---
title: Документация модуля VM в Node.js
description: Модуль VM (Виртуальная Машина) в Node.js предоставляет API для компиляции и выполнения кода в контекстах движка JavaScript V8. Он позволяет создавать изолированные JavaScript среды, изолировать выполнение кода и управлять контекстами скриптов.
head:
  - - meta
    - name: og:title
      content: Документация модуля VM в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль VM (Виртуальная Машина) в Node.js предоставляет API для компиляции и выполнения кода в контекстах движка JavaScript V8. Он позволяет создавать изолированные JavaScript среды, изолировать выполнение кода и управлять контекстами скриптов.
  - - meta
    - name: twitter:title
      content: Документация модуля VM в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль VM (Виртуальная Машина) в Node.js предоставляет API для компиляции и выполнения кода в контекстах движка JavaScript V8. Он позволяет создавать изолированные JavaScript среды, изолировать выполнение кода и управлять контекстами скриптов.
---


# VM (выполнение JavaScript) {#vm-executing-javascript}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

Модуль `node:vm` позволяет компилировать и запускать код в контекстах виртуальной машины V8.

**Модуль <code>node:vm</code> не является механизмом
безопасности. Не используйте его для запуска ненадежного кода.**

Код JavaScript можно скомпилировать и запустить немедленно, либо скомпилировать, сохранить и запустить позже.

Типичный вариант использования — запуск кода в другом контексте V8. Это означает, что вызванный код имеет другой глобальный объект, чем вызывающий код.

Контекст можно предоставить посредством [*контекстуализации*](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объекта. Вызванный код рассматривает любое свойство в контексте как глобальную переменную. Любые изменения глобальных переменных, вызванные вызванным кодом, отражаются в контекстном объекте.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Контекстуализация объекта.

const code = 'x += 40; var y = 17;';
// `x` и `y` — глобальные переменные в контексте.
// Изначально x имеет значение 2, потому что это значение context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y не определена.
```
## Класс: `vm.Script` {#class-vmscript}

**Добавлено в версии: v0.3.1**

Экземпляры класса `vm.Script` содержат предварительно скомпилированные скрипты, которые можно выполнять в определенных контекстах.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.12.0 | Добавлена поддержка `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов импорта для параметра `importModuleDynamically`. |
| v10.6.0 | `produceCachedData` устарел в пользу `script.createCachedData()`. |
| v5.7.0 | Теперь поддерживаются параметры `cachedData` и `produceCachedData`. |
| v0.3.1 | Добавлено в версии: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Код JavaScript для компиляции.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает имя файла, используемое в трассировках стека, созданных этим скриптом. **По умолчанию:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, которое отображается в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, которое отображается в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray`, или `DataView` с данными кеша кода V8 для предоставленного источника. При предоставлении значение `cachedDataRejected` будет установлено в `true` или `false` в зависимости от принятия данных V8.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true` и `cachedData` отсутствует, V8 попытается создать данные кеша кода для `code`. В случае успеха будет создан `Buffer` с данными кеша кода V8 и сохранен в свойстве `cachedData` возвращенного экземпляра `vm.Script`. Значение `cachedDataProduced` будет установлено в `true` или `false` в зависимости от того, были ли данные кеша кода созданы успешно. Этот параметр **устарел** в пользу `script.createCachedData()`. **По умолчанию:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания способа загрузки модулей во время оценки этого скрипта при вызове `import()`. Этот параметр является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Подробную информацию см. в разделе [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

Если `options` является строкой, то она указывает имя файла.

Создание нового объекта `vm.Script` компилирует `code`, но не запускает его. Скомпилированный `vm.Script` можно запустить позже несколько раз. `code` не привязан ни к какому глобальному объекту; скорее, он привязывается перед каждым запуском, только для этого запуска.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Добавлено в: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Когда `cachedData` предоставляется для создания `vm.Script`, это значение будет установлено в `true` или `false` в зависимости от принятия данных движком V8. В противном случае значение будет `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Добавлено в: v10.6.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Создает кэш кода, который можно использовать с опцией `cachedData` конструктора `Script`. Возвращает `Buffer`. Этот метод можно вызывать в любое время и любое количество раз.

Кэш кода `Script` не содержит каких-либо наблюдаемых состояний JavaScript. Кэш кода можно безопасно сохранять вместе с исходным кодом скрипта и использовать для многократного создания новых экземпляров `Script`.

Функции в исходном коде `Script` могут быть помечены как лениво компилируемые, и они не компилируются при создании `Script`. Эти функции будут скомпилированы при первом их вызове. Кэш кода сериализует метаданные, которые V8 в настоящее время знает о `Script`, и которые он может использовать для ускорения будущих компиляций.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// В `cacheWithoutAdd` функция `add()` помечена для полной компиляции
// при вызове.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` содержит полностью скомпилированную функцию `add()`.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстуализированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, возвращенный методом `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то если при компиляции `code` возникает [`Error`](/ru/nodejs/api/errors#class-error), строка кода, вызвавшая ошибку, присоединяется к стеку вызовов. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для выполнения `code` до завершения выполнения. Если выполнение будет прервано, будет выдана ошибка [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение сигнала `SIGINT` (+) приведет к завершению выполнения и выдаче ошибки [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики для события, которые были подключены через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.

- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) результат последнего выполненного в скрипте выражения.

Выполняет скомпилированный код, содержащийся в объекте `vm.Script`, в заданном `contextifiedObject` и возвращает результат. Выполняемый код не имеет доступа к локальной области видимости.

Следующий пример компилирует код, который увеличивает глобальную переменную, устанавливает значение другой глобальной переменной, а затем выполняет код несколько раз. Глобальные переменные содержатся в объекте `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Выводит: { animal: 'cat', count: 12, name: 'kitty' }
```
Использование параметров `timeout` или `breakOnSigint` приведет к запуску новых циклов событий и соответствующих потоков, что имеет ненулевые накладные расходы на производительность.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.8.0, v20.18.0 | Аргумент `contextObject` теперь принимает `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | Теперь поддерживается опция `microtaskMode`. |
| v10.0.0 | Теперь поддерживается опция `contextCodeGeneration`. |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ru/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Либо [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify), либо объект, который будет [контекстуализирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Если `undefined`, будет создан пустой контекстуализированный объект для обратной совместимости.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то при возникновении [`Error`](/ru/nodejs/api/errors#class-error) во время компиляции `code`, строка кода, вызвавшая ошибку, будет прикреплена к трассировке стека. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для выполнения `code` до прекращения выполнения. Если выполнение прекращается, будет выброшена [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) прекратит выполнение и вызовет [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики события, подключенные через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Человекочитаемое имя вновь созданного контекста. **По умолчанию:** `'VM Context i'`, где `i` - это возрастающий числовой индекс созданного контекста.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Источник](https://developer.mozilla.org/en-US/docs/Glossary/Origin), соответствующий вновь созданному контексту для отображения. Источник должен быть отформатирован как URL-адрес, но только со схемой, хостом и портом (если необходимо), как значение свойства [`url.origin`](/ru/nodejs/api/url#urlorigin) объекта [`URL`](/ru/nodejs/api/url#class-url). В частности, эта строка должна опускать завершающий слэш, поскольку это обозначает путь. **По умолчанию:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любые вызовы `eval` или конструкторов функций (`Function`, `GeneratorFunction` и т. д.) вызовут `EvalError`. **По умолчанию:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любая попытка скомпилировать модуль WebAssembly вызовет `WebAssembly.CompileError`. **По умолчанию:** `true`.

    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если установлено значение `afterEvaluate`, микрозадачи (задачи, запланированные через `Promise` и `async function`) будут выполняться сразу после выполнения скрипта. В этом случае они включены в области действия `timeout` и `breakOnSigint`.

- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) результат последнего оператора, выполненного в скрипте.

Этот метод является ярлыком для `script.runInContext(vm.createContext(options), options)`. Он делает несколько вещей одновременно:

Следующий пример компилирует код, устанавливающий глобальную переменную, а затем выполняет код несколько раз в разных контекстах. Глобальные переменные устанавливаются и содержатся в каждом отдельном `context`.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Это вызвало бы исключение, если контекст был создан из контекстуализированного объекта.
// vm.constants.DONT_CONTEXTIFY позволяет создавать контексты с обычными
// глобальными объектами, которые можно заморозить.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то при возникновении [`Error`](/ru/nodejs/api/errors#class-error) во время компиляции `code`, строка кода, вызвавшая ошибку, прикрепляется к трассировке стека. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Определяет количество миллисекунд для выполнения `code` до завершения выполнения. Если выполнение завершается, будет выброшена [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) завершит выполнение и выбросит [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики для события, которые были прикреплены через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.

- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) результат последнего оператора, выполненного в скрипте.

Запускает скомпилированный код, содержащийся в `vm.Script`, в контексте текущего `global` объекта. Запущенный код не имеет доступа к локальной области видимости, но *имеет* доступ к текущему `global` объекту.

В следующем примере компилируется код, который увеличивает `global` переменную, а затем выполняет этот код несколько раз:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Добавлено в: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Когда скрипт скомпилирован из исходника, содержащего magic comment для source map, это свойство будет установлено в URL source map.



::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Класс: `vm.Module` {#class-vmmodule}

**Добавлено в: v13.0.0, v12.16.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Эта возможность доступна только с включенным флагом командной строки `--experimental-vm-modules`.

Класс `vm.Module` предоставляет низкоуровневый интерфейс для использования модулей ECMAScript в контекстах VM. Он является аналогом класса `vm.Script`, который тесно отражает [Module Record](https://262.ecma-international.org/14.0/#sec-abstract-module-records)s, как определено в спецификации ECMAScript.

Однако, в отличие от `vm.Script`, каждый объект `vm.Module` привязан к контексту с момента его создания. Операции над объектами `vm.Module` по своей сути асинхронны, в отличие от синхронной природы объектов `vm.Script`. Использование функций 'async' может помочь в манипулировании объектами `vm.Module`.

Использование объекта `vm.Module` требует трех отдельных шагов: создание/разбор, связывание и вычисление. Эти три шага проиллюстрированы в следующем примере.

Эта реализация находится на более низком уровне, чем [загрузчик модулей ECMAScript](/ru/nodejs/api/esm#modules-ecmascript-modules). Также пока нет возможности взаимодействовать с загрузчиком, хотя поддержка планируется.



::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Шаг 1
//
// Создайте модуль, построив новый объект `vm.SourceTextModule`. Это
// разбирает предоставленный исходный текст, вызывая `SyntaxError`, если что-то пойдет
// не так. По умолчанию модуль создается в верхнем контексте. Но здесь мы
// указываем `contextifiedObject` как контекст, к которому принадлежит этот модуль.
//
// Здесь мы пытаемся получить экспорт по умолчанию из модуля "foo" и
// поместить его в локальную привязку "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Шаг 2
//
// "Связать" импортированные зависимости этого модуля с ним.
//
// Предоставленный callback-функция связывания (linker) принимает два аргумента:
// родительский модуль (в данном случае `bar`) и строку, являющуюся спецификатором
// импортированного модуля. Ожидается, что обратный вызов вернет модуль, который
// соответствует предоставленному спецификатору, с определенными требованиями, задокументированными
// в `module.link()`.
//
// Если связывание не было запущено для возвращенного модуля, та же самая callback-функция
// связывания будет вызвана для возвращенного модуля.
//
// Даже модули верхнего уровня без зависимостей должны быть явно связаны.
// Предоставленный callback-функция никогда не будет вызвана, однако.
//
// Метод link() возвращает Promise, который будет разрешен, когда все
// Promises, возвращенные linker-ом, разрешатся.
//
// Примечание: это надуманный пример, поскольку функция связывания создает новый
// модуль "foo" каждый раз, когда он вызывается. В полноценной модульной системе
// для избежания дублирования модулей, вероятно, будет использоваться кэш.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // Переменная "secret" ссылается на глобальную переменную, которую мы добавили в
      // "contextifiedObject" при создании контекста.
      export default secret;
    `, { context: referencingModule.context });

    // Использование `contextifiedObject` вместо `referencingModule.context`
    // здесь также будет работать.
  }
  throw new Error(`Невозможно разрешить зависимость: ${specifier}`);
}
await bar.link(linker);

// Шаг 3
//
// Вычислить модуль. Метод evaluate() возвращает promise, который будет
// разрешен после завершения вычисления модуля.

// Выводит 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Шаг 1
  //
  // Создайте модуль, построив новый объект `vm.SourceTextModule`. Это
  // разбирает предоставленный исходный текст, вызывая `SyntaxError`, если что-то пойдет
  // не так. По умолчанию модуль создается в верхнем контексте. Но здесь мы
  // указываем `contextifiedObject` как контекст, к которому принадлежит этот модуль.
  //
  // Здесь мы пытаемся получить экспорт по умолчанию из модуля "foo" и
  // поместить его в локальную привязку "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Шаг 2
  //
  // "Связать" импортированные зависимости этого модуля с ним.
  //
  // Предоставленный callback-функция связывания (linker) принимает два аргумента:
  // родительский модуль (в данном случае `bar`) и строку, являющуюся спецификатором
  // импортированного модуля. Ожидается, что обратный вызов вернет модуль, который
  // соответствует предоставленному спецификатору, с определенными требованиями, задокументированными
  // в `module.link()`.
  //
  // Если связывание не было запущено для возвращенного модуля, та же самая callback-функция
  // связывания будет вызвана для возвращенного модуля.
  //
  // Даже модули верхнего уровня без зависимостей должны быть явно связаны.
  // Предоставленный callback-функция никогда не будет вызвана, однако.
  //
  // Метод link() возвращает Promise, который будет разрешен, когда все
  // Promises, возвращенные linker-ом, разрешатся.
  //
  // Примечание: это надуманный пример, поскольку функция связывания создает новый
  // модуль "foo" каждый раз, когда он вызывается. В полноценной модульной системе
  // для избежания дублирования модулей, вероятно, будет использоваться кэш.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // Переменная "secret" ссылается на глобальную переменную, которую мы добавили в
        // "contextifiedObject" при создании контекста.
        export default secret;
      `, { context: referencingModule.context });

      // Использование `contextifiedObject` вместо `referencingModule.context`
      // здесь также будет работать.
    }
    throw new Error(`Невозможно разрешить зависимость: ${specifier}`);
  }
  await bar.link(linker);

  // Шаг 3
  //
  // Вычислить модуль. Метод evaluate() возвращает promise, который будет
  // разрешен после завершения вычисления модуля.

  // Выводит 42.
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Спецификаторы всех зависимостей этого модуля. Возвращаемый массив заморожен, чтобы запретить любые изменения в нём.

Соответствует полю `[[RequestedModules]]` в [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) спецификации ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Если `module.status` равен `'errored'`, это свойство содержит исключение, выброшенное модулем во время оценки. Если статус какой-либо другой, доступ к этому свойству приведет к выброшенному исключению.

Значение `undefined` нельзя использовать для случаев, когда нет выброшенного исключения, из-за возможной неоднозначности с `throw undefined;`.

Соответствует полю `[[EvaluationError]]` в [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) спецификации ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для оценки до прекращения выполнения. Если выполнение прерывается, будет выброшена [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) завершит выполнение и выбросит [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики для события, которые были привязаны через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **Default:** `false`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется с `undefined` при успехе.

Оценить модуль.

Это необходимо вызвать после того, как модуль был связан; в противном случае он будет отклонен. Это также можно вызвать, когда модуль уже был оценен, в этом случае он либо ничего не сделает, если начальная оценка закончилась успешно (`module.status` равен `'evaluated'`), либо повторно выбросит исключение, которое привело к начальной оценке (`module.status` равен `'errored'`).

Этот метод нельзя вызывать, пока модуль оценивается (`module.status` равен `'evaluating'`).

Соответствует полю [Evaluate() concrete method](https://tc39.es/ecma262/#sec-moduleevaluation) в [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) спецификации ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Идентификатор текущего модуля, как установлено в конструкторе.

### `module.link(linker)` {#modulelinklinker}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | Опция `extra.assert` переименована в `extra.attributes`. Прежнее название по-прежнему предоставляется для обратной совместимости. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Спецификатор запрошенного модуля:
    -  `referencingModule` [\<vm.Module\>](/ru/nodejs/api/vm#class-vmmodule) Объект `Module`, для которого вызывается `link()`.
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Данные из атрибута: Согласно ECMA-262, хосты должны вызывать ошибку при наличии неподдерживаемого атрибута.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Псевдоним для `extra.attributes`.
  
 
    -  Возвращает: [\<vm.Module\>](/ru/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Связывает зависимости модуля. Этот метод должен быть вызван перед выполнением и может быть вызван только один раз для каждого модуля.

Ожидается, что функция вернет объект `Module` или `Promise`, который в конечном итоге разрешается в объект `Module`. Возвращенный `Module` должен удовлетворять следующим двум инвариантам:

- Он должен принадлежать к тому же контексту, что и родительский `Module`.
- Его `status` не должен быть `'errored'`.

Если `status` возвращенного `Module` равен `'unlinked'`, этот метод будет рекурсивно вызван для возвращенного `Module` с той же предоставленной функцией `linker`.

`link()` возвращает `Promise`, который либо будет разрешен, когда все экземпляры связывания разрешатся в допустимый `Module`, либо отклонен, если функция связывания либо выдаст исключение, либо вернет недопустимый `Module`.

Функция связывания примерно соответствует определяемой реализацией абстрактной операции [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) в спецификации ECMAScript, с несколькими ключевыми отличиями:

- Функция связывания может быть асинхронной, в то время как [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) является синхронной.

Фактическая реализация [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule), используемая во время связывания модулей, — это реализация, которая возвращает модули, связанные во время связывания. Поскольку на тот момент все модули уже были бы полностью связаны, реализация [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) является полностью синхронной в соответствии со спецификацией.

Соответствует полю [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s в спецификации ECMAScript.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект пространства имен модуля. Доступен только после завершения связывания (`module.link()`).

Соответствует абстрактной операции [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) в спецификации ECMAScript.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Текущий статус модуля. Может принимать одно из следующих значений:

-  `'unlinked'`: `module.link()` еще не был вызван.
-  `'linking'`: `module.link()` был вызван, но не все Promise, возвращенные функцией связывания, еще не были разрешены.
-  `'linked'`: Модуль успешно связан, и все его зависимости связаны, но `module.evaluate()` еще не был вызван.
-  `'evaluating'`: Модуль находится в процессе оценки через `module.evaluate()` на самом себе или родительском модуле.
-  `'evaluated'`: Модуль был успешно оценен.
-  `'errored'`: Модуль был оценен, но было выброшено исключение.

За исключением `'errored'`, эта строка статуса соответствует полю `[[Status]]` [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) в спецификации. `'errored'` соответствует `'evaluated'` в спецификации, но с `[[EvaluationError]]`, установленным в значение, отличное от `undefined`.

## Class: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Добавлено в: v9.6.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Эта функция доступна только при включенном флаге командной строки `--experimental-vm-modules`.

- Расширяет: [\<vm.Module\>](/ru/nodejs/api/vm#class-vmmodule)

Класс `vm.SourceTextModule` предоставляет [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records), как определено в спецификации ECMAScript.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов импорта для параметра `importModuleDynamically`. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) JavaScript код модуля для разбора
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка, используемая в трассировках стека. **По умолчанию:** `'vm:module(i)'`, где `i` — зависящий от контекста возрастающий индекс.
    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray` или `DataView` с данными кеша кода V8 для предоставленного источника. `code` должен быть тем же модулем, из которого был создан этот `cachedData`.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстифицированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, возвращаемый методом `vm.createContext()`, для компиляции и оценки этого `Module` в нем. Если контекст не указан, модуль оценивается в текущем контексте выполнения.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, которое отображается в трассировках стека, создаваемых этим `Module`. **По умолчанию:** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, которое отображается в трассировках стека, создаваемых этим `Module`. **По умолчанию:** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается во время оценки этого `Module` для инициализации `import.meta`.
    - `meta` [\<import.meta\>](/ru/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/ru/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Используется для указания того, как модули должны загружаться во время оценки этого модуля при вызове `import()`. Этот параметр является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Подробную информацию см. в разделе [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Создает новый экземпляр `SourceTextModule`.

Свойства, присвоенные объекту `import.meta`, которые являются объектами, могут позволить модулю получить доступ к информации за пределами указанного `context`. Используйте `vm.runInContext()` для создания объектов в определенном контексте.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Добавлено в: v13.7.0, v12.17.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Создаёт кодовый кэш, который можно использовать с опцией `cachedData` конструктора `SourceTextModule`. Возвращает `Buffer`. Этот метод может быть вызван сколько угодно раз до вычисления модуля.

Кодовый кэш `SourceTextModule` не содержит каких-либо наблюдаемых JavaScript состояний. Кодовый кэш можно безопасно сохранить вместе с исходным кодом скрипта и использовать для многократного создания новых экземпляров `SourceTextModule`.

Функции в исходном коде `SourceTextModule` могут быть помечены как лениво компилируемые и не компилируются при создании `SourceTextModule`. Эти функции будут скомпилированы при первом вызове. Кодовый кэш сериализует метаданные, которые V8 в настоящее время знает о `SourceTextModule`, которые он может использовать для ускорения будущих компиляций.

```js [ESM]
// Создаём начальный модуль
const module = new vm.SourceTextModule('const a = 1;');

// Создаём кэшированные данные из этого модуля
const cachedData = module.createCachedData();

// Создаём новый модуль, используя кэшированные данные. Код должен быть тем же.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Класс: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Добавлено в: v13.0.0, v12.16.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Эта функция доступна только с включённым флагом командной строки `--experimental-vm-modules`.

- Расширяет: [\<vm.Module\>](/ru/nodejs/api/vm#class-vmmodule)

Класс `vm.SyntheticModule` предоставляет [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records), как это определено в спецификации WebIDL. Цель синтетических модулей состоит в том, чтобы предоставить общий интерфейс для предоставления не-JavaScript источников графам модулей ECMAScript.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Используем `module` в связывании...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Добавлено в: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив имен, которые будут экспортированы из модуля.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается при вычислении модуля.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка, используемая в трассировках стека. **По умолчанию:** `'vm:module(i)'`, где `i` - это зависящий от контекста возрастающий индекс.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстуализированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, возвращенный методом `vm.createContext()`, для компиляции и вычисления этого `Module`.

Создает новый экземпляр `SyntheticModule`.

Объекты, присвоенные экспорту этого экземпляра, могут позволить импортерам модуля получить доступ к информации за пределами указанного `context`. Используйте `vm.runInContext()` для создания объектов в определенном контексте.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Добавлено в: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя экспорта для установки.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, которое нужно установить для экспорта.

Этот метод используется после связывания модуля для установки значений экспорта. Если он вызывается до связывания модуля, будет выброшена ошибка [`ERR_VM_MODULE_STATUS`](/ru/nodejs/api/errors#err_vm_module_status).

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.12.0 | Добавлена поддержка `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | Возвращаемое значение теперь включает `cachedDataRejected` с той же семантикой, что и в `vm.Script`, если был передан параметр `cachedData`. |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов импорта для параметра `importModuleDynamically`. |
| v15.9.0 | Опция `importModuleDynamically` добавлена снова. |
| v14.3.0 | Удаление `importModuleDynamically` из-за проблем совместимости. |
| v14.1.0, v13.14.0 | Теперь поддерживается опция `importModuleDynamically`. |
| v10.10.0 | Добавлено в: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тело функции для компиляции.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив строк, содержащий все параметры для функции.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает имя файла, используемое в трассировках стека, созданных этим скриптом. **По умолчанию:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, которое отображается в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, которое отображается в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray`, или `DataView` с данными кеша кода V8 для предоставленного источника. Это должно быть произведено предыдущим вызовом [`vm.compileFunction()`](/ru/nodejs/api/vm#vmcompilefunctioncode-params-options) с тем же `code` и `params`.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли создавать новые данные кеша. **По умолчанию:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстифицированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, в котором должна быть скомпилирована указанная функция.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Массив, содержащий набор расширений контекста (объекты, оборачивающие текущую область видимости), которые должны быть применены во время компиляции. **По умолчанию:** `[]`.


- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания способа загрузки модулей во время вычисления этой функции, когда вызывается `import()`. Эта опция является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Компилирует данный код в предоставленный контекст (если контекст не указан, используется текущий контекст) и возвращает его, обернутым внутри функции с данными `params`.


## `vm.constants` {#vmconstants}

**Добавлено в: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, содержащий часто используемые константы для операций VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Добавлено в: v21.7.0, v20.12.0**

::: warning [Стабильно: 1 - Экспериментальная]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Константа, которая может быть использована в качестве опции `importModuleDynamically` для `vm.Script` и `vm.compileFunction()`, чтобы Node.js использовал загрузчик ESM по умолчанию из основного контекста для загрузки запрошенного модуля.

Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.8.0, v20.18.0 | Аргумент `contextObject` теперь принимает `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Добавлена поддержка для `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | Теперь поддерживается опция `importModuleDynamically`. |
| v14.6.0 | Теперь поддерживается опция `microtaskMode`. |
| v10.0.0 | Первый аргумент больше не может быть функцией. |
| v10.0.0 | Теперь поддерживается опция `codeGeneration`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ru/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Либо [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify), либо объект, который будет [контекстифицирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Если `undefined`, будет создан пустой контекстифицированный объект для обратной совместимости.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Человекочитаемое имя вновь созданного контекста. **По умолчанию:** `'VM Context i'`, где `i` - это возрастающий числовой индекс созданного контекста.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Источник](https://developer.mozilla.org/en-US/docs/Glossary/Origin), соответствующий вновь созданному контексту для целей отображения. Источник должен быть отформатирован как URL, но только со схемой, хостом и портом (если необходимо), как значение свойства [`url.origin`](/ru/nodejs/api/url#urlorigin) объекта [`URL`](/ru/nodejs/api/url#class-url). Примечательно, что эта строка должна опускать конечную косую черту, поскольку это обозначает путь. **По умолчанию:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любые вызовы `eval` или конструкторов функций (`Function`, `GeneratorFunction` и т. д.) вызовут ошибку `EvalError`. **По умолчанию:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любая попытка скомпилировать модуль WebAssembly вызовет ошибку `WebAssembly.CompileError`. **По умолчанию:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если установлено значение `afterEvaluate`, микрозадачи (задачи, запланированные через `Promise` и `async function`) будут выполняться сразу после запуска скрипта через [`script.runInContext()`](/ru/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). В этом случае они включаются в области `timeout` и `breakOnSigint`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания способа загрузки модулей при вызове `import()` в этом контексте без скрипта-реферера или модуля. Эта опция является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) контекстифицированный объект.

Если данный `contextObject` является объектом, метод `vm.createContext()` [подготовит этот объект](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) и вернет ссылку на него, чтобы его можно было использовать в вызовах [`vm.runInContext()`](/ru/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) или [`script.runInContext()`](/ru/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Внутри таких скриптов глобальный объект будет обернут `contextObject`, сохраняя все свои существующие свойства, но также имея встроенные объекты и функции, которые есть у любого стандартного [глобального объекта](https://es5.github.io/#x15.1). Вне скриптов, запущенных модулем vm, глобальные переменные останутся неизменными.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
Если `contextObject` опущен (или явно передан как `undefined`), будет возвращен новый, пустой [контекстифицированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект.

Когда глобальный объект в новом созданном контексте [контекстифицирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object), у него есть некоторые особенности по сравнению с обычными глобальными объектами. Например, его нельзя заморозить. Чтобы создать контекст без особенностей контекстификации, передайте [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify) в качестве аргумента `contextObject`. См. документацию [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify) для получения подробной информации.

Метод `vm.createContext()` в основном полезен для создания одного контекста, который можно использовать для запуска нескольких скриптов. Например, при эмуляции веб-браузера этот метод можно использовать для создания одного контекста, представляющего глобальный объект окна, а затем запустить все теги `\<script\>` вместе в этом контексте.

Предоставленные `name` и `origin` контекста становятся видимыми через Inspector API.


## `vm.isContext(object)` {#vmiscontextobject}

**Добавлено в: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если данный объект `object` был [контекстуализирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) с помощью [`vm.createContext()`](/ru/nodejs/api/vm#vmcreatecontextcontextobject-options) или если это глобальный объект контекста, созданного с использованием [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Добавлено в: v13.10.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Измеряет память, известную V8, и используемую всеми контекстами, известными текущему изоляту V8 или основному контексту.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'summary'`, либо `'detailed'`. В режиме summary будет возвращена только память, измеренная для основного контекста. В режиме detailed будет возвращена память, измеренная для всех контекстов, известных текущему изоляту V8. **По умолчанию:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'default'`, либо `'eager'`. При стандартном выполнении промис не разрешится до начала следующей запланированной сборки мусора, что может занять некоторое время (или никогда, если программа завершится до следующей GC). При энергичном выполнении GC будет запущена сразу для измерения памяти. **По умолчанию:** `'default'`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Если память успешно измерена, промис разрешится с объектом, содержащим информацию об использовании памяти. В противном случае он будет отклонен с ошибкой `ERR_CONTEXT_NOT_INITIALIZED`.

Формат объекта, с которым может разрешиться возвращаемый промис, зависит от движка V8 и может изменяться от версии V8 к версии V8.

Возвращаемый результат отличается от статистики, возвращаемой `v8.getHeapSpaceStatistics()`, тем, что `vm.measureMemory()` измеряет память, доступную для каждого конкретного контекста V8 в текущем экземпляре движка V8, в то время как результат `v8.getHeapSpaceStatistics()` измеряет память, занятую каждым пространством кучи в текущем экземпляре V8.

```js [ESM]
const vm = require('node:vm');
// Измеряет память, используемую основным контекстом.
vm.measureMemory({ mode: 'summary' })
  // Это то же самое, что и vm.measureMemory()
  .then((result) => {
    // Текущий формат:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Ссылаемся на контекст здесь, чтобы он не был собран GC
    // пока измерение не будет завершено.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.12.0 | Добавлена поддержка `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов импорта для параметра `importModuleDynamically`. |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) JavaScript-код для компиляции и выполнения.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстуализированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, который будет использоваться как `global` при компиляции и запуске `code`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает имя файла, используемое в трассировках стека, созданных этим скриптом. **По умолчанию:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, отображаемое в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, отображаемое в трассировках стека, созданных этим скриптом. **По умолчанию:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то при возникновении [`Error`](/ru/nodejs/api/errors#class-error) во время компиляции `code`, строка кода, вызвавшая ошибку, будет присоединена к трассировке стека. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для выполнения `code` перед завершением выполнения. Если выполнение завершено, будет выброшена [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) завершит выполнение и выдаст [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики для события, которые были подключены через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.
    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray`, или `DataView` с данными кеша кода V8 для предоставленного источника.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания способа загрузки модулей во время оценки этого скрипта при вызове `import()`. Эта опция является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Метод `vm.runInContext()` компилирует `code`, запускает его в контексте `contextifiedObject`, а затем возвращает результат. Запускаемый код не имеет доступа к локальной области видимости. Объект `contextifiedObject` *должен* быть предварительно [контекстуализирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) с помощью метода [`vm.createContext()`](/ru/nodejs/api/vm#vmcreatecontextcontextobject-options).

Если `options` является строкой, то она указывает имя файла.

В следующем примере компилируются и выполняются различные скрипты с использованием одного [контекстуализированного](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объекта:

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.8.0, v20.18.0 | Аргумент `contextObject` теперь принимает `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Добавлена поддержка `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов import для параметра `importModuleDynamically`. |
| v14.6.0 | Теперь поддерживается опция `microtaskMode`. |
| v10.0.0 | Теперь поддерживается опция `contextCodeGeneration`. |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) JavaScript-код для компиляции и запуска.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ru/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Либо [`vm.constants.DONT_CONTEXTIFY`](/ru/nodejs/api/vm#vmconstantsdont_contextify), либо объект, который будет [контекстуализирован](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Если `undefined`, для обратной совместимости будет создан пустой контекстуализированный объект.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает имя файла, используемое в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, отображаемое в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, отображаемое в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, когда во время компиляции `code` возникает [`Error`](/ru/nodejs/api/errors#class-error), строка кода, вызвавшая ошибку, прикрепляется к трассировке стека. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для выполнения `code` до завершения выполнения. Если выполнение завершено, будет выброшено [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) завершит выполнение и выбросит [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики события, прикрепленные через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Человекочитаемое имя вновь созданного контекста. **По умолчанию:** `'VM Context i'`, где `i` — это возрастающий числовой индекс созданного контекста.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Источник](https://developer.mozilla.org/en-US/docs/Glossary/Origin), соответствующий вновь созданному контексту для целей отображения. Источник должен быть отформатирован как URL, но только со схемой, хостом и портом (если необходимо), как значение свойства [`url.origin`](/ru/nodejs/api/url#urlorigin) объекта [`URL`](/ru/nodejs/api/url#class-url). В частности, эта строка должна опускать конечную косую черту, поскольку она обозначает путь. **По умолчанию:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любые вызовы `eval` или конструкторов функций (`Function`, `GeneratorFunction` и т. д.) вызовут ошибку `EvalError`. **По умолчанию:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение false, любая попытка скомпилировать модуль WebAssembly вызовет ошибку `WebAssembly.CompileError`. **По умолчанию:** `true`.


    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray` или `DataView` с данными кеша кода V8 для предоставленного источника.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания способа загрузки модулей во время оценки этого скрипта при вызове `import()`. Эта опция является частью экспериментального API модулей. Мы не рекомендуем использовать его в производственной среде. Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если установлено значение `afterEvaluate`, микрозадачи (задачи, запланированные через `Promise`s и `async function`s) будут выполняться сразу после выполнения скрипта. В этом случае они включены в области действия `timeout` и `breakOnSigint`.


- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) результат последнего оператора, выполненного в скрипте.

Этот метод является сокращением для `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Если `options` является строкой, то она указывает имя файла.

Он делает несколько вещей одновременно:

Следующий пример компилирует и выполняет код, который увеличивает глобальную переменную и устанавливает новую. Эти глобальные переменные содержатся в `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Выводит: { animal: 'cat', count: 3, name: 'kitty' }

// Это вызвало бы ошибку, если бы контекст был создан из контекстуализированного объекта.
// vm.constants.DONT_CONTEXTIFY позволяет создавать контексты с обычными глобальными объектами, которые
// могут быть заморожены.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.12.0 | Добавлена поддержка `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Добавлена поддержка атрибутов импорта для параметра `importModuleDynamically`. |
| v6.3.0 | Теперь поддерживается опция `breakOnSigint`. |
| v0.3.1 | Добавлено в версии: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) JavaScript код для компиляции и выполнения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает имя файла, используемое в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера строки, которое отображается в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает смещение номера столбца первой строки, которое отображается в трассировках стека, создаваемых этим скриптом. **По умолчанию:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, если [`Error`](/ru/nodejs/api/errors#class-error) возникает во время компиляции `code`, строка кода, вызвавшая ошибку, прикрепляется к трассировке стека. **По умолчанию:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество миллисекунд для выполнения `code` перед завершением выполнения. Если выполнение завершено, будет выброшена [`Error`](/ru/nodejs/api/errors#class-error). Это значение должно быть строго положительным целым числом.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, получение `SIGINT` (+) завершит выполнение и выдаст [`Error`](/ru/nodejs/api/errors#class-error). Существующие обработчики для события, которые были привязаны через `process.on('SIGINT')`, отключаются во время выполнения скрипта, но продолжают работать после этого. **По умолчанию:** `false`.
    - `cachedData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Предоставляет необязательный `Buffer` или `TypedArray`, или `DataView` с данными кэша кода V8 для предоставленного источника.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ru/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Используется для указания того, как модули должны загружаться во время оценки этого скрипта, когда вызывается `import()`. Эта опция является частью экспериментального API модулей. Мы не рекомендуем использовать ее в производственной среде. Для получения подробной информации см. [Поддержка динамического `import()` в API компиляции](/ru/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) результат самого последнего оператора, выполненного в скрипте.

`vm.runInThisContext()` компилирует `code`, запускает его в контексте текущего `global` и возвращает результат. Запущенный код не имеет доступа к локальной области видимости, но имеет доступ к текущему глобальному объекту `global`.

Если `options` является строкой, то она указывает имя файла.

Следующий пример иллюстрирует использование как `vm.runInThisContext()`, так и JavaScript функции [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) для запуска одного и того же кода:

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
Поскольку `vm.runInThisContext()` не имеет доступа к локальной области видимости, `localVar` остается неизменной. В отличие от этого, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *имеет* доступ к локальной области видимости, поэтому значение `localVar` изменяется. Таким образом, `vm.runInThisContext()` очень похож на [косвенный вызов `eval()`](https://es5.github.io/#x10.4.2), например, `(0,eval)('code')`.


## Пример: Запуск HTTP-сервера внутри VM {#example-running-an-http-server-within-a-vm}

При использовании [`script.runInThisContext()`](/ru/nodejs/api/vm#scriptruninthiscontextoptions) или [`vm.runInThisContext()`](/ru/nodejs/api/vm#vmruninthiscontextcode-options) код выполняется в текущем глобальном контексте V8. Код, переданный в этот контекст VM, будет иметь собственную изолированную область видимости.

Чтобы запустить простой веб-сервер с использованием модуля `node:http`, код, переданный в контекст, должен либо самостоятельно вызвать `require('node:http')`, либо иметь ссылку на модуль `node:http`, переданную ему. Например:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
В приведенном выше случае `require()` разделяет состояние с контекстом, из которого он был передан. Это может представлять риски при выполнении ненадежного кода, например, изменение объектов в контексте нежелательным образом.

## Что значит "контекстуализировать" объект? {#what-does-it-mean-to-"contextify"-an-object?}

Весь JavaScript, выполняемый в Node.js, работает в области "контекста". Согласно [Руководству разработчика V8](https://v8.dev/docs/embed#contexts):

Когда метод `vm.createContext()` вызывается с объектом, аргумент `contextObject` будет использоваться для обертывания глобального объекта нового экземпляра V8 Context (если `contextObject` равен `undefined`, новый объект будет создан из текущего контекста до его контекстуализации). Этот V8 Context предоставляет `code`, запускаемый с использованием методов модуля `node:vm`, с изолированной глобальной средой, в которой он может работать. Процесс создания V8 Context и связывания его с `contextObject` во внешнем контексте - это то, что в этом документе называется "контекстуализацией" объекта.

Контекстуализация вносит некоторые особенности в значение `globalThis` в контексте. Например, его нельзя заморозить, и он не равен по ссылке `contextObject` во внешнем контексте.

```js [ESM]
const vm = require('node:vm');

// Опция `contextObject` со значением undefined приводит к контекстуализации глобального объекта.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Контекстуализированный глобальный объект не может быть заморожен.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Чтобы создать контекст с обычным глобальным объектом и получить доступ к глобальному прокси во внешнем контексте с меньшим количеством особенностей, укажите `vm.constants.DONT_CONTEXTIFY` в качестве аргумента `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Эта константа, при использовании в качестве аргумента `contextObject` в API vm, указывает Node.js создать контекст без обертывания его глобального объекта другим объектом специфичным для Node.js способом. В результате, значение `globalThis` внутри нового контекста будет вести себя ближе к обычному.

```js [ESM]
const vm = require('node:vm');

// Используйте vm.constants.DONT_CONTEXTIFY для заморозки глобального объекта.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Когда `vm.constants.DONT_CONTEXTIFY` используется в качестве аргумента `contextObject` для [`vm.createContext()`](/ru/nodejs/api/vm#vmcreatecontextcontextobject-options), возвращаемый объект является прокси-подобным объектом к глобальному объекту в новом созданном контексте с меньшим количеством специфичных для Node.js особенностей. Он имеет ссылочное равенство значению `globalThis` в новом контексте, может быть изменен извне контекста и может быть использован для доступа к встроенным функциям в новом контексте напрямую.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// Возвращаемый объект имеет ссылочное равенство globalThis в новом контексте.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Может использоваться для прямого доступа к глобальным переменным в новом контексте.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Может быть заморожен, и это влияет на внутренний контекст.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Взаимодействия по тайм-ауту с асинхронными задачами и Promise {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise` и `async function` могут планировать задачи для асинхронного выполнения движком JavaScript. По умолчанию эти задачи выполняются после завершения выполнения всех функций JavaScript в текущем стеке. Это позволяет избежать функциональности параметров `timeout` и `breakOnSigint`.

Например, следующий код, выполняемый `vm.runInNewContext()` с тайм-аутом 5 миллисекунд, планирует бесконечный цикл для выполнения после разрешения promise. Запланированный цикл никогда не прерывается тайм-аутом:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// Это выводится *перед* 'entering loop' (!)
console.log('done executing');
```
Это можно решить, передав `microtaskMode: 'afterEvaluate'` коду, который создает `Context`:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
В этом случае микрозадача, запланированная через `promise.then()`, будет выполнена до возврата из `vm.runInNewContext()` и будет прервана функциональностью `timeout`. Это относится только к коду, выполняемому в `vm.Context`, поэтому, например, [`vm.runInThisContext()`](/ru/nodejs/api/vm#vmruninthiscontextcode-options) не принимает этот параметр.

Коллбэки Promise помещаются в очередь микрозадач контекста, в котором они были созданы. Например, если `() =\> loop()` заменить просто на `loop` в приведенном выше примере, то `loop` будет помещен в глобальную очередь микрозадач, потому что это функция из внешнего (основного) контекста, и, следовательно, также сможет избежать тайм-аута.

Если функции асинхронного планирования, такие как `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()` и т. д., доступны внутри `vm.Context`, функции, переданные им, будут добавлены в глобальные очереди, которые используются совместно всеми контекстами. Поэтому коллбэки, переданные этим функциям, также не контролируются через тайм-аут.


## Поддержка динамического `import()` в API компиляции {#support-of-dynamic-import-in-compilation-apis}

Следующие API поддерживают опцию `importModuleDynamically` для включения динамического `import()` в коде, скомпилированном модулем vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Эта опция все еще является частью экспериментального API модулей. Мы не рекомендуем использовать ее в производственной среде.

### Когда опция `importModuleDynamically` не указана или имеет значение undefined {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Если эта опция не указана или имеет значение `undefined`, код, содержащий `import()`, все равно может быть скомпилирован API vm, но когда скомпилированный код выполняется и фактически вызывает `import()`, результат будет отклонен с ошибкой [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/ru/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### Когда `importModuleDynamically` имеет значение `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Эта опция в настоящее время не поддерживается для `vm.SourceTextModule`.

С этой опцией, когда `import()` инициируется в скомпилированном коде, Node.js будет использовать загрузчик ESM по умолчанию из основного контекста для загрузки запрошенного модуля и возврата его выполняемому коду.

Это дает доступ к встроенным модулям Node.js, таким как `fs` или `http`, коду, который компилируется. Если код выполняется в другом контексте, имейте в виду, что объекты, созданные модулями, загруженными из основного контекста, все еще находятся в основном контексте и не являются `instanceof` встроенных классов в новом контексте.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```
:::

Эта опция также позволяет скрипту или функции загружать пользовательские модули:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Есть несколько предостережений при загрузке пользовательских модулей с использованием загрузчика по умолчанию из основного контекста:


### Когда `importModuleDynamically` является функцией {#when-importmoduledynamically-is-a-function}

Когда `importModuleDynamically` является функцией, она будет вызываться при вызове `import()` в скомпилированном коде для настройки компиляции и оценки запрошенного модуля. В настоящее время экземпляр Node.js должен быть запущен с флагом `--experimental-vm-modules`, чтобы эта опция работала. Если флаг не установлен, этот обратный вызов будет проигнорирован. Если вычисленный код фактически вызывает `import()`, результат будет отклонен с ошибкой [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/ru/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

Обратный вызов `importModuleDynamically(specifier, referrer, importAttributes)` имеет следующую сигнатуру:

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) спецификатор, переданный в `import()`
- `referrer` [\<vm.Script\>](/ru/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/ru/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `referrer` — это скомпилированный `vm.Script` для `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` и `vm.runInNewContext`. Это скомпилированная `Function` для `vm.compileFunction`, скомпилированный `vm.SourceTextModule` для `new vm.SourceTextModule` и контекстный `Object` для `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Значение `"with"`, переданное в необязательный параметр [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call), или пустой объект, если значение не было предоставлено.
- Возвращает: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/ru/nodejs/api/vm#class-vmmodule) Рекомендуется возвращать `vm.Module`, чтобы воспользоваться преимуществами отслеживания ошибок и избежать проблем с пространствами имен, содержащими экспорты функции `then`.

::: code-group
```js [ESM]
// Этот скрипт должен быть запущен с --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // The compiled script
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Этот скрипт должен быть запущен с --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // The compiled script
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

