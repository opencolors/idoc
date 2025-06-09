---
title: Документация Node.js - Система модулей
description: Эта страница предоставляет подробную документацию по системе модулей Node.js, включая модули CommonJS и ES, как загружать модули, кэширование модулей и различия между двумя системами модулей.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Система модулей | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница предоставляет подробную документацию по системе модулей Node.js, включая модули CommonJS и ES, как загружать модули, кэширование модулей и различия между двумя системами модулей.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Система модулей | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница предоставляет подробную документацию по системе модулей Node.js, включая модули CommonJS и ES, как загружать модули, кэширование модулей и различия между двумя системами модулей.
---


# Модули: API `node:module` {#modules-nodemodule-api}

**Добавлено в: v0.3.7**

## Объект `Module` {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Предоставляет общие служебные методы для взаимодействия с экземплярами `Module`, переменной [`module`](/ru/nodejs/api/module#the-module-object), часто встречающейся в модулях [CommonJS](/ru/nodejs/api/modules). Доступ осуществляется через `import 'node:module'` или `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Теперь список также содержит модули только с префиксом. |
| v9.3.0, v8.10.0, v6.13.0 | Добавлено в: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список имен всех модулей, предоставляемых Node.js. Может использоваться для проверки, поддерживается ли модуль сторонней компанией или нет.

`module` в данном контексте — это не тот же объект, который предоставляется [оберткой модуля](/ru/nodejs/api/modules#the-module-wrapper). Чтобы получить к нему доступ, подключите модуль `Module`:

::: code-group
```js [ESM]
// module.mjs
// В модуле ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// В модуле CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Добавлено в: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Имя файла, используемое для создания функции require. Должно быть объектом URL-адреса файла, строкой URL-адреса файла или строкой абсолютного пути.
- Возвращает: [\<require\>](/ru/nodejs/api/modules#requireid) Функция Require

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js — это модуль CommonJS.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Добавлено в: v23.2.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Спецификатор для модуля, чей `package.json` необходимо получить. При передаче *простого спецификатора* возвращается `package.json` в корне пакета. При передаче *относительного спецификатора* или *абсолютного спецификатора* возвращается ближайший родительский `package.json`.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Абсолютное расположение (строка URL-адреса `file:` или путь FS) содержащего модуля. Для CJS используйте `__filename` (не `__dirname`!); для ESM используйте `import.meta.url`. Вам не нужно передавать его, если `specifier` является `absolute specifier`.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь, если `package.json` найден. Когда `startLocation` является пакетом, корневой `package.json` пакета; когда относительный или неразрешенный, ближайший `package.json` к `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Тот же результат при передаче абсолютного спецификатора:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// При передаче абсолютного спецификатора вы можете получить другой результат, если
// разрешенный модуль находится внутри подпапки, у которой есть вложенные `package.json`.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Тот же результат при передаче абсолютного спецификатора:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// При передаче абсолютного спецификатора вы можете получить другой результат, если
// разрешенный модуль находится внутри подпапки, у которой есть вложенные `package.json`.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Added in: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) имя модуля
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) возвращает true, если модуль является встроенным, иначе возвращает false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.8.0, v18.19.0 | Добавлена поддержка экземпляров WHATWG URL. |
| v20.6.0, v18.19.0 | Добавлено в: v20.6.0, v18.19.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на релиз
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Хуки настройки для регистрации; это должна быть та же строка, которая была бы передана в `import()`, за исключением того, что если она относительная, она разрешается относительно `parentURL`.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Если вы хотите разрешить `specifier` относительно базового URL, например `import.meta.url`, вы можете передать этот URL здесь. **По умолчанию:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Если вы хотите разрешить `specifier` относительно базового URL, например `import.meta.url`, вы можете передать этот URL здесь. Это свойство игнорируется, если `parentURL` указан в качестве второго аргумента. **По умолчанию:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное, клонируемое JavaScript значение для передачи в хук [`initialize`](/ru/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [передаваемые объекты](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist) для передачи в хук `initialize`.
  
 

Зарегистрируйте модуль, который экспортирует [хуки](/ru/nodejs/api/module#customization-hooks), которые настраивают разрешение модулей Node.js и поведение загрузки. См. [Хуки настройки](/ru/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Добавлено в версии: v23.5.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) См. [хук load](/ru/nodejs/api/module#loadurl-context-nextload). **По умолчанию:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) См. [хук resolve](/ru/nodejs/api/module#resolvespecifier-context-nextresolve). **По умолчанию:** `undefined`.
  
 

Регистрирует [хуки](/ru/nodejs/api/module#customization-hooks), которые настраивают разрешение модулей Node.js и поведение загрузки. См. [Хуки настройки](/ru/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Добавлено в версии: v23.2.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Код, из которого нужно удалить аннотации типов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'strip'`. Возможные значения:
    - `'strip'` Только удаляет аннотации типов без выполнения преобразования функций TypeScript.
    - `'transform'` Удаляет аннотации типов и преобразует функции TypeScript в JavaScript.
  
 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`. Только когда `mode` имеет значение `'transform'`, если `true`, будет сгенерирована карта источников для преобразованного кода.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает URL-адрес источника, используемый в карте источников.
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Код с удаленными аннотациями типов. `module.stripTypeScriptTypes()` удаляет аннотации типов из кода TypeScript. Его можно использовать для удаления аннотаций типов из кода TypeScript перед запуском с помощью `vm.runInContext()` или `vm.compileFunction()`. По умолчанию, он выдаст ошибку, если код содержит функции TypeScript, которые требуют преобразования, такие как `Enums`, см. [удаление типов](/ru/nodejs/api/typescript#type-stripping) для получения дополнительной информации. Когда mode имеет значение `'transform'`, он также преобразует функции TypeScript в JavaScript, см. [преобразование функций TypeScript](/ru/nodejs/api/typescript#typescript-features) для получения дополнительной информации. Когда mode имеет значение `'strip'`, карты источников не создаются, поскольку местоположения сохраняются. Если предоставлен `sourceMap`, когда mode имеет значение `'strip'`, будет выдана ошибка.

*ВНИМАНИЕ*: Вывод этой функции не должен считаться стабильным между версиями Node.js из-за изменений в парсере TypeScript.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Выводит: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Выводит: const a         = 1;
```
:::

Если указан `sourceUrl`, он будет добавлен в качестве комментария в конце вывода:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Выводит: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Выводит: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Когда `mode` имеет значение `'transform'`, код преобразуется в JavaScript:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Выводит:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Выводит:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Добавлено в: v12.12.0**

Метод `module.syncBuiltinESMExports()` обновляет все активные привязки для встроенных [ES-модулей](/ru/nodejs/api/esm) в соответствии со свойствами экспортов [CommonJS](/ru/nodejs/api/modules). Он не добавляет и не удаляет экспортированные имена из [ES-модулей](/ru/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Он синхронизирует существующее свойство readFile с новым значением
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync был удален из требуемого fs
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() не удаляет readFileSync из esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() не добавляет имена
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Кэш компиляции модулей {#module-compile-cache}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.8.0 | добавлены начальные JavaScript API для доступа во время выполнения. |
| v22.1.0 | Добавлено в: v22.1.0 |
:::

Кэш компиляции модулей можно включить либо с помощью метода [`module.enableCompileCache()`](/ru/nodejs/api/module#moduleenablecompilecachecachedir), либо с помощью переменной окружения [`NODE_COMPILE_CACHE=dir`](/ru/nodejs/api/cli#node_compile_cachedir). После включения, всякий раз, когда Node.js компилирует CommonJS или ECMAScript Module, он будет использовать [V8 code cache](https://v8.dev/blog/code-caching-for-devs) на диске, сохраненный в указанном каталоге, для ускорения компиляции. Это может замедлить первую загрузку графа модулей, но последующие загрузки того же графа модулей могут получить значительное ускорение, если содержимое модулей не изменится.

Чтобы очистить сгенерированный кэш компиляции на диске, просто удалите каталог кэша. Каталог кэша будет воссоздан при следующем использовании того же каталога для хранения кэша компиляции. Чтобы избежать заполнения диска устаревшим кэшем, рекомендуется использовать каталог в [`os.tmpdir()`](/ru/nodejs/api/os#ostmpdir). Если кэш компиляции включен вызовом [`module.enableCompileCache()`](/ru/nodejs/api/module#moduleenablecompilecachecachedir) без указания каталога, Node.js будет использовать переменную окружения [`NODE_COMPILE_CACHE=dir`](/ru/nodejs/api/cli#node_compile_cachedir), если она установлена, или по умолчанию `path.join(os.tmpdir(), 'node-compile-cache')`. Чтобы найти каталог кэша компиляции, используемый запущенным экземпляром Node.js, используйте [`module.getCompileCacheDir()`](/ru/nodejs/api/module#modulegetcompilecachedir).

В настоящее время при использовании кэша компиляции с [V8 JavaScript code coverage](https://v8project.blogspot.com/2017/12/javascript-code-coverage) покрытие, собираемое V8, может быть менее точным в функциях, десериализованных из кэша кода. Рекомендуется отключать это при запуске тестов для генерации точного покрытия.

Включенный кэш компиляции модулей можно отключить с помощью переменной окружения [`NODE_DISABLE_COMPILE_CACHE=1`](/ru/nodejs/api/cli#node_disable_compile_cache1). Это может быть полезно, когда кэш компиляции приводит к неожиданному или нежелательному поведению (например, менее точное покрытие тестами).

Кэш компиляции, сгенерированный одной версией Node.js, не может быть повторно использован другой версией Node.js. Кэш, сгенерированный разными версиями Node.js, будет храниться отдельно, если для сохранения кэша используется один и тот же базовый каталог, поэтому они могут сосуществовать.

В настоящее время, когда включен кэш компиляции и модуль загружается заново, кэш кода генерируется из скомпилированного кода немедленно, но будет записан на диск только тогда, когда экземпляр Node.js собирается завершить работу. Это может быть изменено. Метод [`module.flushCompileCache()`](/ru/nodejs/api/module#moduleflushcompilecache) можно использовать, чтобы убедиться, что накопленный кэш кода сброшен на диск, если приложение хочет порождать другие экземпляры Node.js и позволить им совместно использовать кэш задолго до завершения работы родительского процесса.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Добавлено в: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Следующие константы возвращаются в качестве поля `status` в объекте, возвращаемом [`module.enableCompileCache()`](/ru/nodejs/api/module#moduleenablecompilecachecachedir), чтобы указать результат попытки включить [кэш компиляции модулей](/ru/nodejs/api/module#module-compile-cache).

| Константа | Описание |
| --- | --- |
| `ENABLED` |        Node.js успешно включил кэш компиляции. Директория, используемая для хранения кэша       компиляции, будет возвращена в поле `directory` в возвращенном объекте.      |
| `ALREADY_ENABLED` |        Кэш компиляции уже был включен ранее, либо предыдущим вызовом `module.enableCompileCache()`, либо переменной окружения `NODE_COMPILE_CACHE=dir`. Директория, используемая для хранения кэша компиляции, будет возвращена в поле `directory` в возвращенном объекте.      |
| `FAILED` |        Node.js не удалось включить кэш компиляции. Это может быть вызвано отсутствием прав       на использование указанной директории, или различными видами ошибок файловой системы.       Подробности ошибки будут возвращены в поле `message` в возвращенном объекте.      |
| `DISABLED` |        Node.js не может включить кэш компиляции, потому что установлена переменная окружения `NODE_DISABLE_COMPILE_CACHE=1`.      |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Добавлено в: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Необязательный путь для указания директории, в которой будет храниться/извлекаться кэш компиляции.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Одно из значений [`module.constants.compileCacheStatus`](/ru/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Если Node.js не может включить кэш компиляции, это поле содержит сообщение об ошибке. Устанавливается только если `status` равен `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Если кэш компиляции включен, это поле содержит директорию, в которой хранится кэш компиляции. Устанавливается только если `status` равен `module.constants.compileCacheStatus.ENABLED` или `module.constants.compileCacheStatus.ALREADY_ENABLED`.

Включает [кэш компиляции модулей](/ru/nodejs/api/module#module-compile-cache) в текущем экземпляре Node.js.

Если `cacheDir` не указан, Node.js будет использовать либо директорию, указанную в переменной окружения [`NODE_COMPILE_CACHE=dir`](/ru/nodejs/api/cli#node_compile_cachedir), если она установлена, либо `path.join(os.tmpdir(), 'node-compile-cache')` в противном случае. Для общих случаев использования рекомендуется вызывать `module.enableCompileCache()` без указания `cacheDir`, чтобы директория могла быть переопределена переменной окружения `NODE_COMPILE_CACHE` при необходимости.

Поскольку кэш компиляции должен быть тихой оптимизацией, которая не требуется для функционирования приложения, этот метод разработан таким образом, чтобы не выдавать никаких исключений, когда кэш компиляции не может быть включен. Вместо этого он вернет объект, содержащий сообщение об ошибке в поле `message` для помощи в отладке. Если кэш компиляции успешно включен, поле `directory` в возвращенном объекте содержит путь к директории, в которой хранится кэш компиляции. Поле `status` в возвращенном объекте будет одним из значений `module.constants.compileCacheStatus`, чтобы указать результат попытки включить [кэш компиляции модулей](/ru/nodejs/api/module#module-compile-cache).

Этот метод влияет только на текущий экземпляр Node.js. Чтобы включить его в дочерних рабочих потоках, либо вызовите этот метод в дочерних рабочих потоках, либо установите значение `process.env.NODE_COMPILE_CACHE` в директорию кэша компиляции, чтобы поведение могло быть унаследовано дочерними рабочими потоками. Директорию можно получить либо из поля `directory`, возвращенного этим методом, либо с помощью [`module.getCompileCacheDir()`](/ru/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Добавлено в: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Сбрасывает [кэш компиляции модулей](/ru/nodejs/api/module#module-compile-cache), накопленный из модулей, уже загруженных в текущем экземпляре Node.js, на диск. Функция возвращает управление после завершения всех операций записи в файловую систему, независимо от того, завершились они успешно или нет. В случае возникновения каких-либо ошибок, функция завершится без уведомлений, поскольку пропуски в кэше компиляции не должны влиять на фактическую работу приложения.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Добавлено в: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к каталогу [кэша компиляции модулей](/ru/nodejs/api/module#module-compile-cache), если он включен, или `undefined` в противном случае.

## Хуки кастомизации {#customization-hooks}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Добавлена поддержка синхронных и внутрипотоковых хуков. |
| v20.6.0, v18.19.0 | Добавлен хук `initialize` для замены `globalPreload`. |
| v18.6.0, v16.17.0 | Добавлена поддержка цепочек загрузчиков. |
| v16.12.0 | Удалены `getFormat`, `getSource`, `transformSource` и `globalPreload`; добавлены хук `load` и хук `getGlobalPreload`. |
| v8.8.0 | Добавлено в: v8.8.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на релиз (асинхронная версия) Стабильность: 1.1 - Активная разработка (синхронная версия)
:::

В настоящее время поддерживаются два типа хуков кастомизации модулей:

### Включение {#enabling}

Разрешение и загрузку модулей можно настроить с помощью:

Хуки могут быть зарегистрированы до запуска кода приложения с использованием флага [`--import`](/ru/nodejs/api/cli#--importmodule) или [`--require`](/ru/nodejs/api/cli#-r---require-module):

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```


::: code-group
```js [ESM]
// register-hooks.js
// Этот файл можно require()-ed, только если он не содержит await верхнего уровня.
// Используйте module.register() для регистрации асинхронных хуков в выделенном потоке.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Используйте module.register() для регистрации асинхронных хуков в выделенном потоке.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::



::: code-group
```js [ESM]
// Используйте module.registerHooks() для регистрации синхронных хуков в основном потоке.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* реализация */ },
  load(url, context, nextLoad) { /* реализация */ },
});
```

```js [CJS]
// Используйте module.registerHooks() для регистрации синхронных хуков в основном потоке.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* реализация */ },
  load(url, context, nextLoad) { /* реализация */ },
});
```
:::

Файл, переданный в `--import` или `--require`, также может быть экспортом из зависимости:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Где `some-package` имеет поле [`"exports"`](/ru/nodejs/api/packages#exports), определяющее экспорт `/register` для сопоставления с файлом, который вызывает `register()`, как в следующем примере `register-hooks.js`.

Использование `--import` или `--require` гарантирует, что хуки будут зарегистрированы до импорта каких-либо файлов приложения, включая точку входа приложения и по умолчанию для любых рабочих потоков.

В качестве альтернативы `register()` и `registerHooks()` можно вызывать из точки входа, хотя для любого кода ESM, который должен быть запущен после регистрации хуков, необходимо использовать динамический `import()`.



::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Поскольку это динамический `import()`, хуки `http-to-https` будут запущены
// для обработки `./my-app.js` и любых других файлов, которые он импортирует или требует.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Поскольку это динамический `import()`, хуки `http-to-https` будут запущены
// для обработки `./my-app.js` и любых других файлов, которые он импортирует или требует.
import('./my-app.js');
```
:::

Хуки кастомизации будут запускаться для любых модулей, загруженных позже регистрации, и модулей, на которые они ссылаются через `import` и встроенный `require`. Функция `require`, созданная пользователями с помощью `module.createRequire()`, может быть настроена только с помощью синхронных хуков.

В этом примере мы регистрируем хуки `http-to-https`, но они будут доступны только для впоследствии импортированных модулей — в данном случае `my-app.js` и всего, на что он ссылается через `import` или встроенный `require` в зависимостях CommonJS.

Если бы `import('./my-app.js')` вместо этого был статическим `import './my-app.js'`, приложение было бы *уже* загружено **до** регистрации хуков `http-to-https`. Это связано со спецификацией модулей ES, где статические импорты оцениваются сначала от листьев дерева, а затем обратно к стволу. Внутри `my-app.js` могут быть статические импорты, которые не будут оцениваться до тех пор, пока `my-app.js` не будет динамически импортирован.

Если используются синхронные хуки, поддерживаются как `import`, `require`, так и пользовательский `require`, созданный с помощью `createRequire()`.



::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* реализация синхронных хуков */ });

const require = createRequire(import.meta.url);

// Синхронные хуки влияют на import, require() и пользовательскую функцию require(),
// созданную через createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* реализация синхронных хуков */ });

const userRequire = createRequire(__filename);

// Синхронные хуки влияют на import, require() и пользовательскую функцию require(),
// созданную через createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Наконец, если все, что вам нужно, это зарегистрировать хуки перед запуском вашего приложения, и вы не хотите создавать для этого отдельный файл, вы можете передать `data:` URL в `--import`:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Цепочки {#chaining}

Можно вызывать `register` несколько раз:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

В этом примере зарегистрированные хуки образуют цепочки. Эти цепочки выполняются в порядке "последним пришел - первым обслужен" (LIFO). Если и `foo.mjs`, и `bar.mjs` определяют хук `resolve`, они будут вызываться следующим образом (обратите внимание на порядок справа налево): значение по умолчанию node ← `./foo.mjs` ← `./bar.mjs` (начиная с `./bar.mjs`, затем `./foo.mjs`, затем значение по умолчанию Node.js). То же самое относится ко всем остальным хукам.

Зарегистрированные хуки также влияют на сам `register`. В этом примере `bar.mjs` будет разрешен и загружен через хуки, зарегистрированные `foo.mjs` (потому что хуки `foo` уже будут добавлены в цепочку). Это позволяет, например, писать хуки на языках, отличных от JavaScript, если ранее зарегистрированные хуки транспилируются в JavaScript.

Метод `register` нельзя вызывать из модуля, который определяет хуки.

Цепочки `registerHooks` работают аналогично. Если синхронные и асинхронные хуки смешаны, синхронные хуки всегда запускаются первыми, прежде чем начнут выполняться асинхронные хуки, то есть, в последнем запускаемом синхронном хуке его следующий хук включает вызов асинхронных хуков.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Взаимодействие с хуками кастомизации модуля {#communication-with-module-customization-hooks}

Асинхронные хуки выполняются в выделенном потоке, отдельно от основного потока, в котором выполняется код приложения. Это означает, что изменение глобальных переменных не повлияет на другие потоки, и для связи между потоками необходимо использовать каналы сообщений.

Метод `register` можно использовать для передачи данных в хук [`initialize`](/ru/nodejs/api/module#initialize). Данные, передаваемые в хук, могут включать передаваемые объекты, такие как порты.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Этот пример демонстрирует, как канал сообщений можно использовать для
// взаимодействия с хуками, путем отправки `port2` хукам.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Этот пример демонстрирует, как канал сообщений можно использовать для
// взаимодействия с хуками, путем отправки `port2` хукам.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Синхронные хуки модуля выполняются в том же потоке, где выполняется код приложения. Они могут напрямую изменять глобальные переменные контекста, к которому обращается основной поток.

### Хуки {#hooks}

#### Асинхронные хуки, принимаемые `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

Метод [`register`](/ru/nodejs/api/module#moduleregisterspecifier-parenturl-options) можно использовать для регистрации модуля, который экспортирует набор хуков. Хуки — это функции, которые вызываются Node.js для настройки процесса разрешения и загрузки модулей. Экспортируемые функции должны иметь определенные имена и сигнатуры, и они должны быть экспортированы как именованные экспорты.

```js [ESM]
export async function initialize({ number, port }) {
  // Получает данные от `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Берет `import` или `require` specifier и разрешает его в URL.
}

export async function load(url, context, nextLoad) {
  // Берет разрешенный URL и возвращает исходный код для оценки.
}
```
Асинхронные хуки выполняются в отдельном потоке, изолированном от основного потока, в котором выполняется код приложения. Это означает, что это другая [область](https://tc39.es/ecma262/#realm). Поток хуков может быть завершен основным потоком в любое время, поэтому не полагайтесь на завершение асинхронных операций (например, `console.log`). Они по умолчанию наследуются в дочерние воркеры.


#### Синхронные хуки, принимаемые `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Добавлено в: v23.5.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Метод `module.registerHooks()` принимает синхронные функции хуков. `initialize()` не поддерживается и не является необходимым, поскольку разработчик хука может просто запустить код инициализации непосредственно перед вызовом `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Принимает спецификатор `import` или `require` и преобразует его в URL.
}

function load(url, context, nextLoad) {
  // Принимает преобразованный URL и возвращает исходный код для выполнения.
}
```

Синхронные хуки выполняются в том же потоке и той же [области](https://tc39.es/ecma262/#realm), где загружаются модули. В отличие от асинхронных хуков, они не наследуются в дочерние рабочие потоки по умолчанию, хотя, если хуки зарегистрированы с использованием файла, предварительно загруженного с помощью [`--import`](/ru/nodejs/api/cli#--importmodule) или [`--require`](/ru/nodejs/api/cli#-r---require-module), дочерние рабочие потоки могут наследовать предварительно загруженные скрипты через наследование `process.execArgv`. Подробности см. в [документации `Worker`](/ru/nodejs/api/worker_threads#new-workerfilename-options).

В синхронных хуках пользователи могут ожидать завершения `console.log()` так же, как они ожидают завершения `console.log()` в коде модуля.

#### Соглашения о хуках {#conventions-of-hooks}

Хуки являются частью [цепочки](/ru/nodejs/api/module#chaining), даже если эта цепочка состоит только из одного пользовательского (предоставленного пользователем) хука и хука по умолчанию, который всегда присутствует. Функции хуков вложены: каждая из них всегда должна возвращать простой объект, и связывание происходит в результате того, что каждая функция вызывает `next\<hookName\>()`, который является ссылкой на хук последующего загрузчика (в порядке LIFO).

Хук, возвращающий значение, в котором отсутствует необходимое свойство, вызывает исключение. Хук, который возвращает значение, не вызывая `next\<hookName\>()` *и* не возвращая `shortCircuit: true`, также вызывает исключение. Эти ошибки предназначены для предотвращения непреднамеренных разрывов в цепочке. Верните `shortCircuit: true` из хука, чтобы сигнализировать о том, что цепочка намеренно заканчивается в вашем хуке.


#### `initialize()` {#initialize}

**Добавлено в: v20.6.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Данные из `register(loader, import.meta.url, { data })`.

Хук `initialize` принимается только [`register`](/ru/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` не поддерживает и не нуждается в нём, поскольку инициализация, выполняемая для синхронных хуков, может быть запущена непосредственно перед вызовом `registerHooks()`.

Хук `initialize` предоставляет способ определения пользовательской функции, которая запускается в потоке хуков при инициализации модуля хуков. Инициализация происходит, когда модуль хуков регистрируется через [`register`](/ru/nodejs/api/module#moduleregisterspecifier-parenturl-options).

Этот хук может получать данные из вызова [`register`](/ru/nodejs/api/module#moduleregisterspecifier-parenturl-options), включая порты и другие передаваемые объекты. Возвращаемое значение `initialize` может быть [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), и в этом случае оно будет ожидаться до возобновления выполнения основного потока приложения.

Код настройки модуля:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Вызывающий код:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Этот пример показывает, как канал сообщений можно использовать для связи
// между основным (прикладным) потоком и хуками, работающими в потоке хуков,
// отправляя `port2` в хук `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Этот пример показывает, как канал сообщений можно использовать для связи
// между основным (прикладным) потоком и хуками, работающими в потоке хуков,
// отправляя `port2` в хук `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Добавлена поддержка синхронных и потоковых хуков. |
| v21.0.0, v20.10.0, v18.19.0 | Свойство `context.importAssertions` заменено на `context.importAttributes`. Использование старого имени по-прежнему поддерживается и будет выдавать экспериментальное предупреждение. |
| v18.6.0, v16.17.0 | Добавлена поддержка цепочки хуков разрешения. Каждый хук должен либо вызывать `nextResolve()`, либо включать свойство `shortCircuit`, установленное в `true` в возвращаемом значении. |
| v17.1.0, v16.14.0 | Добавлена поддержка утверждений импорта. |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на выпуск (асинхронная версия) Стабильность: 1.1 - Активная разработка (синхронная версия)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Условия экспорта соответствующего `package.json`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, пары ключ-значение которого представляют атрибуты для импорта модуля
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Модуль, импортирующий этот модуль, или undefined, если это точка входа Node.js

- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Последующий хук `resolve` в цепочке или хук `resolve` по умолчанию в Node.js после последнего хука `resolve`, предоставленного пользователем
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Асинхронная версия принимает либо объект, содержащий следующие свойства, либо `Promise`, который разрешится в такой объект. Синхронная версия принимает только объект, возвращаемый синхронно.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Подсказка для хука загрузки (она может быть проигнорирована) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Атрибуты импорта, которые следует использовать при кэшировании модуля (необязательно; если исключено, будет использоваться ввод)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Сигнал о том, что этот хук намерен завершить цепочку хуков `resolve`. **По умолчанию:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный URL-адрес, к которому разрешается этот ввод

Цепочка хуков `resolve` отвечает за то, чтобы сообщить Node.js, где найти и как кэшировать данный оператор или выражение `import` или вызов `require`. Он может необязательно возвращать формат (например, `'module'`) в качестве подсказки для хука `load`. Если указан формат, хук `load` в конечном итоге отвечает за предоставление окончательного значения `format` (и он может свободно игнорировать подсказку, предоставленную `resolve`); если `resolve` предоставляет `format`, требуется пользовательский хук `load`, даже если только для передачи значения хуку `load` по умолчанию Node.js.

Атрибуты типа импорта являются частью ключа кэша для сохранения загруженных модулей во внутренний кэш модулей. Хук `resolve` отвечает за возврат объекта `importAttributes`, если модуль должен быть кэширован с другими атрибутами, чем те, которые присутствовали в исходном коде.

Свойство `conditions` в `context` представляет собой массив условий, которые будут использоваться для сопоставления [условий экспорта пакета](/ru/nodejs/api/packages#conditional-exports) для этого запроса разрешения. Их можно использовать для поиска условных сопоставлений в другом месте или для изменения списка при вызове логики разрешения по умолчанию.

Текущие [условия экспорта пакета](/ru/nodejs/api/packages#conditional-exports) всегда находятся в массиве `context.conditions`, переданном в хук. Чтобы гарантировать *поведение разрешения спецификатора модуля Node.js по умолчанию* при вызове `defaultResolve`, массив `context.conditions`, переданный ему, *должен* включать *все* элементы массива `context.conditions`, первоначально переданного в хук `resolve`.

```js [ESM]
// Асинхронная версия, принимаемая module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Некое условие.
    // Для некоторых или всех спецификаторов выполните некоторую пользовательскую логику для разрешения.
    // Всегда возвращайте объект в форме {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Другое условие.
    // При вызове `defaultResolve` аргументы можно изменить. В этом
    // случае он добавляет другое значение для сопоставления условных экспортов.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Отложите до следующего хука в цепочке, который будет
  // разрешением Node.js по умолчанию, если это последний указанный пользователем загрузчик.
  return nextResolve(specifier);
}
```
```js [ESM]
// Синхронная версия, принимаемая module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Аналогично асинхронному resolve() выше, поскольку в этом случае отсутствует
  // какая-либо асинхронная логика.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Добавлена поддержка синхронной и внутрипоточной версии. |
| v20.6.0 | Добавлена поддержка `source` с форматом `commonjs`. |
| v18.6.0, v16.17.0 | Добавлена поддержка цепочки хуков загрузки. Каждый хук должен либо вызывать `nextLoad()`, либо включать свойство `shortCircuit`, установленное в `true` в своем возврате. |
:::

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на выпуск (асинхронная версия) Стабильность: 1.1 - Активная разработка (синхронная версия)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL, возвращенный цепочкой `resolve`
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Условия экспорта соответствующего `package.json`
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Формат, опционально предоставленный цепочкой хука `resolve`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Последующий хук `load` в цепочке или хук `load` по умолчанию в Node.js после последнего предоставленного пользователем хука `load`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Асинхронная версия принимает либо объект, содержащий следующие свойства, либо `Promise`, который будет разрешен в такой объект. Синхронная версия принимает только объект, возвращенный синхронно.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Сигнал о том, что этот хук намерен прервать цепочку хуков `load`. **По умолчанию:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Исходный код для оценки Node.js
  
 

Хук `load` предоставляет способ определить пользовательский метод определения того, как URL-адрес должен интерпретироваться, извлекаться и анализироваться. Он также отвечает за проверку атрибутов импорта.

Окончательное значение `format` должно быть одним из следующих:

| `format` | Описание | Приемлемые типы для `source`, возвращаемого `load` |
| --- | --- | --- |
| `'builtin'` | Загрузить встроенный модуль Node.js | Не применимо |
| `'commonjs'` | Загрузить модуль Node.js CommonJS | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Загрузить файл JSON | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Загрузить модуль ES | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Загрузить модуль WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |

Значение `source` игнорируется для типа `'builtin'`, потому что в настоящее время невозможно заменить значение встроенного (основного) модуля Node.js.


##### Предостережение при использовании асинхронного хука `load` {#caveat-in-the-asynchronous-load-hook}

При использовании асинхронного хука `load`, пропуск или предоставление `source` для `'commonjs'` имеет очень разные последствия:

- Если `source` предоставлен, все вызовы `require` из этого модуля будут обработаны загрузчиком ESM с зарегистрированными хуками `resolve` и `load`; все вызовы `require.resolve` из этого модуля будут обработаны загрузчиком ESM с зарегистрированными хуками `resolve`; будет доступно только подмножество API CommonJS (например, нет `require.extensions`, нет `require.cache`, нет `require.resolve.paths`) и monkey-patching для загрузчика модулей CommonJS не будет применяться.
- Если `source` не определен или `null`, он будет обработан загрузчиком модулей CommonJS и вызовы `require`/`require.resolve` не будут проходить через зарегистрированные хуки. Такое поведение для nullish `source` является временным — в будущем nullish `source` не будет поддерживаться.

Эти предостережения не относятся к синхронному хуку `load`, в котором полный набор API CommonJS доступен для настроенных модулей CommonJS, и `require`/`require.resolve` всегда проходят через зарегистрированные хуки.

Внутренняя асинхронная реализация `load` в Node.js, которая является значением `next` для последнего хука в цепочке `load`, возвращает `null` для `source`, когда `format` является `'commonjs'` для обратной совместимости. Вот пример хука, который позволит использовать нестандартное поведение:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Асинхронная версия, принимаемая module.register(). Это исправление не требуется
// для синхронной версии, принимаемой module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Это также не относится к синхронному хуку `load`, в котором возвращаемый `source` содержит исходный код, загруженный следующим хуком, независимо от формата модуля.

- Специфический объект [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) является [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- Специфический объект [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) является [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Если значение source для текстового формата (т. е. `'json'`, `'module'`) не является строкой, оно преобразуется в строку с помощью [`util.TextDecoder`](/ru/nodejs/api/util#class-utiltextdecoder).

Хук `load` предоставляет способ определения пользовательского метода для получения исходного кода разрешенного URL-адреса. Это позволит загрузчику потенциально избежать чтения файлов с диска. Его также можно использовать для сопоставления нераспознанного формата с поддерживаемым, например, `yaml` с `module`.

```js [ESM]
// Асинхронная версия, принимаемая module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Какое-то условие
    /*
      Для некоторых или всех URL-адресов выполните некоторую пользовательскую логику для получения исходного кода.
      Всегда возвращайте объект формы {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Отложите выполнение следующему хуку в цепочке.
  return nextLoad(url);
}
```
```js [ESM]
// Синхронная версия, принимаемая module.registerHooks().
function load(url, context, nextLoad) {
  // Аналогично асинхронной load() выше, поскольку в ней нет
  // какой-либо асинхронной логики.
}
```
В более продвинутом сценарии это также можно использовать для преобразования неподдерживаемого источника в поддерживаемый (см. [Примеры](/ru/nodejs/api/module#examples) ниже).


### Примеры {#examples}

Различные хуки настройки модулей можно использовать вместе для выполнения широкомасштабных настроек поведения загрузки и оценки кода Node.js.

#### Импорт из HTTPS {#import-from-https}

Приведенный ниже хук регистрирует хуки для обеспечения базовой поддержки таких спецификаторов. Хотя это может показаться значительным улучшением основной функциональности Node.js, у фактического использования этих хуков есть существенные недостатки: производительность намного ниже, чем при загрузке файлов с диска, нет кэширования и нет безопасности.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Для загрузки JavaScript по сети, нам нужно получить и
  // вернуть его.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Этот пример предполагает, что весь JavaScript, предоставленный сетью, является кодом модуля ES
          // код.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Пусть Node.js обрабатывает все остальные URL-адреса.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
С предыдущим модулем хуков, запуск `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` выводит текущую версию CoffeeScript в соответствии с модулем по URL-адресу в `main.mjs`.

#### Транспиляция {#transpilation}

Источники, которые находятся в форматах, которые Node.js не понимает, можно преобразовать в JavaScript с помощью [`load` hook](/ru/nodejs/api/module#loadurl-context-nextload).

Это менее производительно, чем транспиляция исходных файлов перед запуском Node.js; хуки транспилятора следует использовать только в целях разработки и тестирования.


##### Асинхронная версия {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // Файлы CoffeeScript могут быть либо CommonJS, либо ES модулями, поэтому мы хотим, чтобы любой
    // файл CoffeeScript обрабатывался Node.js так же, как и файл .js в
    // том же месте. Чтобы определить, как Node.js будет интерпретировать произвольный файл .js
    // найдите в файловой системе ближайший родительский файл package.json
    // и прочитайте его поле "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Этот хук преобразует исходный код CoffeeScript в исходный код JavaScript
    // для всех импортированных файлов CoffeeScript.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Пусть Node.js обрабатывает все остальные URL.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` является только путем к файлу во время первой итерации при передаче
  // разрешенного URL из хука load()
  // фактический путь к файлу из load() будет содержать расширение файла, так как это
  // требуется спецификацией
  // эта простая проверка на истинность того, содержит ли `url` расширение файла, будет
  // работать для большинства проектов, но не охватывает некоторые крайние случаи (например,
  // файлы без расширения или URL, заканчивающийся пробелом)
  const isFilePath = !!extname(url);
  // Если это путь к файлу, получите каталог, в котором он находится
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Составьте путь к файлу package.json в том же каталоге,
  // который может существовать или не существовать
  const packagePath = resolvePath(dir, 'package.json');
  // Попытайтесь прочитать возможно несуществующий package.json
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Если package.json существовал и содержал поле `type` со значением, вуаля
  if (type) return type;
  // В противном случае (если не в корне) продолжайте проверять следующий каталог выше
  // Если в корне, остановитесь и верните false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Синхронная версия {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Запуск хуков {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
С помощью приведенных выше модулей хуков запуск `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` или `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` приводит к тому, что `main.coffee` преобразуется в JavaScript после загрузки его исходного кода с диска, но до того, как Node.js выполнит его; и так далее для любых файлов `.coffee`, `.litcoffee` или `.coffee.md`, на которые есть ссылки через операторы `import` любого загруженного файла.


#### Карты импорта {#import-maps}

В предыдущих двух примерах определялись `load`-хуки. Это пример `resolve`-хука. Этот хук модуля читает файл `import-map.json`, который определяет, какие спецификаторы переопределять другими URL-адресами (это очень упрощенная реализация небольшого подмножества спецификации "карт импорта").

##### Асинхронная версия {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Синхронная версия {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Использование хуков {#using-the-hooks}

Со следующими файлами:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
Запуск `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` или `node --import ./import-map-sync-hooks.js main.js` должен вывести `some module!`.

## Поддержка Source map v3 {#source-map-v3-support}

**Добавлено в: v13.7.0, v12.17.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Вспомогательные функции для взаимодействия с кешем source map. Этот кеш заполняется, когда включен разбор source map и в нижнем колонтитуле модулей найдены [директивы включения source map](https://sourcemaps.info/spec#h.lmz475t4mvbx).

Чтобы включить разбор source map, Node.js должен быть запущен с флагом [`--enable-source-maps`](/ru/nodejs/api/cli#--enable-source-maps) или с включенным покрытием кода путем установки [`NODE_V8_COVERAGE=dir`](/ru/nodejs/api/cli#node_v8_coveragedir).

::: code-group
```js [ESM]
// module.mjs
// В модуле ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// В модуле CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Добавлено в версии: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<module.SourceMap\>](/ru/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Возвращает `module.SourceMap`, если найдена карта исходного кода, в противном случае `undefined`.

`path` - это разрешенный путь к файлу, для которого должна быть получена соответствующая карта исходного кода.

### Класс: `module.SourceMap` {#class-modulesourcemap}

**Добавлено в версии: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Создает новый экземпляр `sourceMap`.

`payload` - это объект с ключами, соответствующими [формату Source map v3](https://sourcemaps.info/spec#h.mofvlxcwqzej):

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` - это необязательный массив длин каждой строки в сгенерированном коде.

#### `sourceMap.payload` {#sourcemappayload}

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Геттер для полезной нагрузки, используемой для создания экземпляра [`SourceMap`](/ru/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение номера строки с отсчетом от нуля в сгенерированном исходном коде
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение номера столбца с отсчетом от нуля в сгенерированном исходном коде
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Учитывая смещение строки и смещение столбца в сгенерированном исходном файле, возвращает объект, представляющий диапазон SourceMap в исходном файле, если он найден, или пустой объект, если нет.

Возвращаемый объект содержит следующие ключи:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение строки начала диапазона в сгенерированном исходном коде
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение столбца начала диапазона в сгенерированном исходном коде
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя файла исходного исходного кода, как указано в SourceMap
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение строки начала диапазона в исходном исходном коде
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение столбца начала диапазона в исходном исходном коде
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращаемое значение представляет собой необработанный диапазон, как он отображается в SourceMap, на основе смещений с отсчетом от нуля, *а не* номера строк и столбцов с отсчетом от 1, как они отображаются в сообщениях об ошибках и объектах CallSite.

Чтобы получить соответствующие номера строк и столбцов с отсчетом от 1 из lineNumber и columnNumber, как они сообщаются стеками ошибок и объектами CallSite, используйте `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер строки с индексом 1 в месте вызова в сгенерированном исходном коде.
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер столбца с индексом 1 в месте вызова в сгенерированном исходном коде.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Принимает `lineNumber` и `columnNumber` с индексом 1 из места вызова в сгенерированном исходном коде и находит соответствующее место вызова в исходном коде.

Если предоставленные `lineNumber` и `columnNumber` не найдены ни в одной карте исходного кода, возвращается пустой объект. В противном случае возвращаемый объект содержит следующие ключи:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Имя диапазона в карте исходного кода, если оно было предоставлено
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя файла исходного кода, как указано в SourceMap.
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер строки с индексом 1 соответствующего места вызова в исходном коде.
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер столбца с индексом 1 соответствующего места вызова в исходном коде.

