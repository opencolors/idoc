---
title: Документация модуля Assert в Node.js
description: Модуль Assert в Node.js предоставляет простой набор тестов утверждений, которые могут быть использованы для проверки инвариантов. В данной документации рассматривается использование, методы и примеры модуля assert в Node.js.
head:
  - - meta
    - name: og:title
      content: Документация модуля Assert в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль Assert в Node.js предоставляет простой набор тестов утверждений, которые могут быть использованы для проверки инвариантов. В данной документации рассматривается использование, методы и примеры модуля assert в Node.js.
  - - meta
    - name: twitter:title
      content: Документация модуля Assert в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль Assert в Node.js предоставляет простой набор тестов утверждений, которые могут быть использованы для проверки инвариантов. В данной документации рассматривается использование, методы и примеры модуля assert в Node.js.
---


# Assert {#assert}

::: tip [Стабильно: 2 - Stable]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Исходный код:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

Модуль `node:assert` предоставляет набор функций утверждений для проверки инвариантов.

## Строгий режим утверждений {#strict-assertion-mode}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Предоставлено как `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | "Строгий режим" изменен на "строгий режим утверждений", а "устаревший режим" - на "устаревший режим утверждений", чтобы избежать путаницы с более привычным значением "строгого режима". |
| v9.9.0 | Добавлены различия ошибок в строгом режиме утверждений. |
| v9.9.0 | Добавлен строгий режим утверждений в модуль assert. |
| v9.9.0 | Добавлено в: v9.9.0 |
:::

В строгом режиме утверждений нестрогие методы ведут себя как соответствующие строгие методы. Например, [`assert.deepEqual()`](/ru/nodejs/api/assert#assertdeepequalactual-expected-message) будет вести себя как [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

В строгом режиме утверждений сообщения об ошибках для объектов отображают разницу. В устаревшем режиме утверждений сообщения об ошибках для объектов отображают объекты, часто усеченные.

Чтобы использовать строгий режим утверждений:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

Пример различия ошибок:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

Чтобы отключить цвета, используйте переменные среды `NO_COLOR` или `NODE_DISABLE_COLORS`. Это также отключит цвета в REPL. Для получения дополнительной информации о поддержке цвета в терминальных средах прочитайте документацию tty [`getColorDepth()`](/ru/nodejs/api/tty#writestreamgetcolordepthenv).


## Устаревший режим утверждений {#legacy-assertion-mode}

Устаревший режим утверждений использует [`==` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) в:

- [`assert.deepEqual()`](/ru/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/ru/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/ru/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/ru/nodejs/api/assert#assertnotequalactual-expected-message)

Чтобы использовать устаревший режим утверждений:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

Устаревший режим утверждений может давать неожиданные результаты, особенно при использовании [`assert.deepEqual()`](/ru/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// ПРЕДУПРЕЖДЕНИЕ: Это не вызовет ошибку AssertionError в устаревшем режиме утверждений!
assert.deepEqual(/a/gi, new Date());
```
## Класс: assert.AssertionError {#class-assertassertionerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает на неудачу утверждения. Все ошибки, выдаваемые модулем `node:assert`, будут экземплярами класса `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Добавлено в: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если предоставлено, сообщение об ошибке устанавливается в это значение.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Свойство `actual` в экземпляре ошибки.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Свойство `expected` в экземпляре ошибки.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Свойство `operator` в экземпляре ошибки.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Если предоставлено, сгенерированный трассировка стека опускает кадры до этой функции.

Подкласс `Error`, который указывает на неудачу утверждения.

Все экземпляры содержат встроенные свойства `Error` (`message` и `name`) и:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Устанавливается в аргумент `actual` для таких методов, как [`assert.strictEqual()`](/ru/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Устанавливается в значение `expected` для таких методов, как [`assert.strictEqual()`](/ru/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, было ли сообщение сгенерировано автоматически (`true`) или нет.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение всегда `ERR_ASSERTION`, чтобы показать, что ошибка является ошибкой утверждения.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Устанавливается в переданное значение оператора.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Сгенерируйте AssertionError, чтобы сравнить сообщение об ошибке позже:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Проверьте вывод ошибки:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// Сгенерируйте AssertionError, чтобы сравнить сообщение об ошибке позже:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Проверьте вывод ошибки:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::


## Класс: `assert.CallTracker` {#class-assertcalltracker}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v20.1.0 | Класс `assert.CallTracker` объявлен устаревшим и будет удален в будущей версии. |
| v14.2.0, v12.19.0 | Добавлено в: v14.2.0, v12.19.0 |
:::

::: danger [Стабильность: 0 - Устаревший]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший
:::

Эта функциональность устарела и будет удалена в будущей версии. Пожалуйста, рассмотрите альтернативные варианты, такие как вспомогательная функция [`mock`](/ru/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Добавлено в: v14.2.0, v12.19.0**

Создает новый объект [`CallTracker`](/ru/nodejs/api/assert#class-assertcalltracker), который можно использовать для отслеживания того, сколько раз были вызваны функции. Метод `tracker.verify()` должен быть вызван для выполнения проверки. Обычно его вызывают в обработчике [`process.on('exit')`](/ru/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() должна быть вызвана ровно 1 раз перед tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Вызывает tracker.verify() и проверяет, были ли все функции tracker.calls()
// вызваны точное количество раз.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() должна быть вызвана ровно 1 раз перед tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Вызывает tracker.verify() и проверяет, были ли все функции tracker.calls()
// вызваны точное количество раз.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Добавлено в: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **По умолчанию:** Функция, не выполняющая никаких действий (no-op).
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `1`.
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, оборачивающая `fn`.

Обернутая функция должна быть вызвана ровно `exact` раз. Если функция не была вызвана ровно `exact` раз к моменту вызова [`tracker.verify()`](/ru/nodejs/api/assert#trackerverify), то [`tracker.verify()`](/ru/nodejs/api/assert#trackerverify) выбросит ошибку.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Создает отслеживатель вызовов.
const tracker = new assert.CallTracker();

function func() {}

// Возвращает функцию, оборачивающую func(), которая должна быть вызвана точное
// количество раз перед tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Создает отслеживатель вызовов.
const tracker = new assert.CallTracker();

function func() {}

// Возвращает функцию, оборачивающую func(), которая должна быть вызвана точное
// количество раз перед tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив со всеми вызовами отслеживаемой функции.
- Объект [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Аргументы, переданные отслеживаемой функции

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Добавлено в: v14.2.0, v12.19.0**

- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив объектов, содержащий информацию о функциях-обёртках, возвращённых [`tracker.calls()`](/ru/nodejs/api/assert#trackercallsfn-exact).
- Объект [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Фактическое количество вызовов функции.
  - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество ожидаемых вызовов функции.
  - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя обёрнутой функции.
  - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Трассировка стека функции.

Массивы содержат информацию об ожидаемом и фактическом количестве вызовов функций, которые не были вызваны ожидаемое количество раз.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::

### `tracker.reset([fn])` {#trackerresetfn}

**Добавлено в версии: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) отслеживаемая функция для сброса.

Сбрасывает вызовы отслеживателя вызовов. Если отслеживаемая функция передается в качестве аргумента, вызовы будут сброшены для нее. Если аргументы не передаются, все отслеживаемые функции будут сброшены.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Добавлено в версии: v14.2.0, v12.19.0**

Перебирает список функций, переданных в [`tracker.calls()`](/ru/nodejs/api/assert#trackercallsfn-exact), и выдает ошибку для функций, которые не были вызваны ожидаемое количество раз.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Добавлено в версии: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Входные данные, проверяемые на истинность.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Псевдоним для [`assert.ok()`](/ru/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0, v20.15.0 | Теперь сравниваются также причина ошибки и свойства ошибок. |
| v18.0.0 | Теперь также сравнивается свойство lastIndex регулярных выражений. |
| v16.0.0, v14.18.0 | В устаревшем режиме утверждений изменен статус с устаревшего на устаревший. |
| v14.0.0 | NaN теперь считается идентичным, если обе стороны являются NaN. |
| v12.0.0 | Теперь теги типов сравниваются правильно, и внесены небольшие корректировки сравнения, чтобы проверка была менее удивительной. |
| v9.0.0 | Теперь правильно сравниваются имена и сообщения `Error`. |
| v8.0.0 | Также сравнивается содержимое `Set` и `Map`. |
| v6.4.0, v4.7.1 | Теперь правильно обрабатываются срезы типизированных массивов. |
| v6.1.0, v4.5.0 | Теперь объекты с циклическими ссылками можно использовать в качестве входных данных. |
| v5.10.1, v4.4.3 | Правильно обрабатывать типизированные массивы, отличные от `Uint8Array`. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Режим строгих утверждений**

Псевдоним для [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Устаревший режим утверждений**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: используйте [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message) вместо него.
:::

Проверяет глубокое равенство между параметрами `actual` и `expected`. Рекомендуется использовать [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message) вместо этого. [`assert.deepEqual()`](/ru/nodejs/api/assert#assertdeepequalactual-expected-message) может давать неожиданные результаты.

*Глубокое равенство* означает, что перечисляемые "собственные" свойства дочерних объектов также рекурсивно оцениваются по следующим правилам.


### Подробности сравнения {#comparison-details}

- Примитивные значения сравниваются с помощью [`==` оператора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality), за исключением `NaN`. Он рассматривается как идентичный в случае, когда обе стороны являются `NaN`.
- [Теги типов](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) объектов должны быть одинаковыми.
- Рассматриваются только [перечисляемые "собственные" свойства](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- [`Error`](/ru/nodejs/api/errors#class-error) имена, сообщения, причины и ошибки всегда сравниваются, даже если они не являются перечисляемыми свойствами.
- [Обёртки объектов](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) сравниваются как объекты и как распакованные значения.
- Свойства `Object` сравниваются без учета порядка.
- Ключи [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) и элементы [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) сравниваются без учета порядка.
- Рекурсия останавливается, когда обе стороны различаются или обе стороны сталкиваются с циклической ссылкой.
- Реализация не тестирует [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) объектов.
- Свойства [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) не сравниваются.
- Сравнение [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) и [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) основывается не на их значениях, а только на их экземплярах.
- `lastIndex`, `flags` и `source` [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) всегда сравниваются, даже если они не являются перечисляемыми свойствами.

Следующий пример не выдает [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror), поскольку примитивы сравниваются с использованием [`==` оператора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

"Глубокое" равенство означает, что также оцениваются перечисляемые "собственные" свойства дочерних объектов:

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

Если значения не равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, установленным равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то будет выброшено именно это исключение, а не [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0, v20.15.0 | Теперь также сравниваются свойства cause и errors. |
| v18.0.0 | Теперь также сравнивается свойство lastIndex регулярных выражений. |
| v9.0.0 | Теперь сравниваются перечисляемые свойства Symbol. |
| v9.0.0 | Теперь `NaN` сравнивается с использованием сравнения [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | Теперь корректно сравниваются имена и сообщения `Error`. |
| v8.0.0 | Также сравнивается содержимое `Set` и `Map`. |
| v6.1.0 | Объекты с циклическими ссылками теперь можно использовать в качестве входных данных. |
| v6.4.0, v4.7.1 | Теперь корректно обрабатываются срезы типизированных массивов. |
| v5.10.1, v4.4.3 | Корректно обрабатываются типизированные массивы, отличные от `Uint8Array`. |
| v1.2.0 | Добавлено в версии: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Проверяет глубокое равенство между параметрами `actual` и `expected`. "Глубокое" равенство означает, что перечисляемые "собственные" свойства дочерних объектов рекурсивно оцениваются также по следующим правилам.

### Детали сравнения {#comparison-details_1}

- Примитивные значения сравниваются с использованием [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- [Теги типов](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) объектов должны быть одинаковыми.
- [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) объектов сравниваются с использованием [`===` оператора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- Учитываются только [перечисляемые "собственные" свойства](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- Имена, сообщения, причины и ошибки [`Error`](/ru/nodejs/api/errors#class-error) всегда сравниваются, даже если они не являются перечисляемыми свойствами. Также сравниваются `errors`.
- Также сравниваются перечисляемые собственные свойства [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).
- [Обёртки объектов](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) сравниваются как объекты, так и как развёрнутые значения.
- Свойства `Object` сравниваются в неупорядоченном виде.
- Ключи [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) и элементы [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) сравниваются в неупорядоченном виде.
- Рекурсия останавливается, когда обе стороны различаются или обе стороны сталкиваются с циклической ссылкой.
- Сравнение [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) и [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) не зависит от их значений. Подробности см. ниже.
- lastIndex, flags и source [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) всегда сравниваются, даже если они не являются перечисляемыми свойствами.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Это не удается, потому что 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Следующие объекты не имеют собственных свойств
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Разные [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Разные теги типов:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK, потому что Object.is(NaN, NaN) истинно.

// Разные развернутые числа:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK, потому что объект и строка идентичны при развертывании.

assert.deepStrictEqual(-0, -0);
// OK

// Разные нули:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, потому что это один и тот же символ на обоих объектах.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, потому что невозможно сравнить записи

// Не удается, потому что weakMap3 имеет свойство, которого нет в weakMap1:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// Это не удается, потому что 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Следующие объекты не имеют собственных свойств
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Разные [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Разные теги типов:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK, потому что Object.is(NaN, NaN) истинно.

// Разные развернутые числа:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK, потому что объект и строка идентичны при развертывании.

assert.deepStrictEqual(-0, -0);
// OK

// Разные нули:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, потому что это один и тот же символ на обоих объектах.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, потому что невозможно сравнить записи

// Не удается, потому что weakMap3 имеет свойство, которого нет в weakMap1:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

Если значения не равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, установленным равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо `AssertionError` будет выброшено исключение.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Этот API больше не является экспериментальным. |
| v13.6.0, v12.16.0 | Добавлено в: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ожидает, что входная `string` не будет соответствовать регулярному выражению.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

Если значения совпадают, или если аргумент `string` имеет тип, отличный от `string`, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то будет выброшен он, а не [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Добавлено в: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ожидает обещание `asyncFn` или, если `asyncFn` является функцией, немедленно вызывает функцию и ожидает завершения возвращаемого обещания. Затем он проверит, что обещание не отклонено.

Если `asyncFn` является функцией и она синхронно выбрасывает ошибку, `assert.doesNotReject()` вернет отклоненный `Promise` с этой ошибкой. Если функция не возвращает обещание, `assert.doesNotReject()` вернет отклоненный `Promise` с ошибкой [`ERR_INVALID_RETURN_VALUE`](/ru/nodejs/api/errors#err_invalid_return_value). В обоих случаях обработчик ошибок пропускается.

Использовать `assert.doesNotReject()` на самом деле не полезно, потому что мало пользы в том, чтобы поймать отклонение и затем снова его отклонить. Вместо этого рассмотрите возможность добавления комментария рядом с конкретным путем кода, который не должен отклонять, и сохраняйте сообщения об ошибках максимально выразительными.

Если указано, `error` может быть [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) или функцией валидации. Смотрите [`assert.throws()`](/ru/nodejs/api/assert#assertthrowsfn-error-message) для получения более подробной информации.

Помимо асинхронной природы ожидания завершения, ведет себя идентично [`assert.doesNotThrow()`](/ru/nodejs/api/assert#assertdoesnotthrowfn-error-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
:::

## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.11.0, v4.4.5 | Параметр `message` теперь учитывается. |
| v4.2.0 | Параметр `error` теперь может быть стрелочной функцией. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Утверждает, что функция `fn` не вызывает ошибку.

Использование `assert.doesNotThrow()` на самом деле не полезно, потому что нет никакой выгоды в перехвате ошибки и ее повторном выбросе. Вместо этого рассмотрите возможность добавления комментария рядом с конкретным путем кода, который не должен выбрасывать исключение, и сделайте сообщения об ошибках максимально выразительными.

При вызове `assert.doesNotThrow()` функция `fn` будет вызвана немедленно.

Если ошибка выбрасывается и она того же типа, что и указанный параметром `error`, то выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror). Если ошибка имеет другой тип, или если параметр `error` не определен, ошибка передается обратно вызывающей стороне.

Если указано, `error` может быть [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) или функцией валидации. Подробнее см. [`assert.throws()`](/ru/nodejs/api/assert#assertthrowsfn-error-message).

Например, следующее вызовет [`TypeError`](/ru/nodejs/api/errors#class-typeerror), поскольку в утверждении нет соответствующего типа ошибки:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  SyntaxError,
);
```
:::

Однако следующее приведет к [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) с сообщением "Получено нежелательное исключение...":

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  TypeError,
);
```
:::

Если выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) и для параметра `message` указано значение, значение `message` будет добавлено к сообщению [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  /Неверное значение/,
  'Ой',
);
// Выбрасывает: AssertionError: Получено нежелательное исключение: Ой
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Неверное значение');
  },
  /Неверное значение/,
  'Ой',
);
// Выбрасывает: AssertionError: Получено нежелательное исключение: Ой
```
:::

## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0, v14.18.0 | В устаревшем режиме утверждений изменен статус с "Устаревший" на "Устаревший". |
| v14.0.0 | NaN теперь рассматривается как идентичный, если обе стороны являются NaN. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Строгий режим утверждений**

Псевдоним [`assert.strictEqual()`](/ru/nodejs/api/assert#assertstrictequalactual-expected-message).

**Устаревший режим утверждений**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте вместо этого [`assert.strictEqual()`](/ru/nodejs/api/assert#assertstrictequalactual-expected-message).
:::

Проверяет поверхностное, принудительное равенство между параметрами `actual` и `expected` с использованием [`==` оператора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` специально обрабатывается и считается идентичным, если обе стороны являются `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

Если значения не равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то он будет выброшен вместо `AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**Добавлено в версии: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **По умолчанию:** `'Failed'`

Выбрасывает [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) с предоставленным сообщением об ошибке или сообщением об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) будет выброшен он.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

Использование `assert.fail()` с более чем двумя аргументами возможно, но является устаревшим. Подробности смотрите ниже.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов `assert.fail()` с более чем одним аргументом устарел и выдает предупреждение. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

::: danger [Stable: 0 - Устаревший]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший: Вместо этого используйте `assert.fail([message])` или другие функции assert.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **По умолчанию:** `assert.fail`

Если `message` ложно, сообщение об ошибке устанавливается как значения `actual` и `expected`, разделенные предоставленным `operator`. Если предоставлены только два аргумента `actual` и `expected`, то `operator` по умолчанию будет `'!='`. Если `message` предоставлено в качестве третьего аргумента, то оно будет использоваться в качестве сообщения об ошибке, а остальные аргументы будут сохранены в качестве свойств в выброшенном объекте. Если предоставлен `stackStartFn`, все кадры стека выше этой функции будут удалены из трассировки стека (см. [`Error.captureStackTrace`](/ru/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Если аргументы не указаны, будет использовано сообщение по умолчанию `Failed`.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

В последних трех случаях `actual`, `expected` и `operator` не влияют на сообщение об ошибке.

Пример использования `stackStartFn` для усечения трассировки стека исключения:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::


## `assert.ifError(value)` {#assertiferrorvalue}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вместо выбрасывания оригинальной ошибки теперь она оборачивается в [`AssertionError`][], который содержит полный стек вызовов. |
| v10.0.0 | Value теперь может быть только `undefined` или `null`. Раньше все ложные значения обрабатывались так же, как и `null`, и не вызывали исключение. |
| v0.1.97 | Добавлено в: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Выбрасывает `value`, если `value` не `undefined` или `null`. Это полезно при тестировании аргумента `error` в колбэках. Трассировка стека содержит все фреймы из ошибки, переданной в `ifError()`, включая потенциальные новые фреймы для самого `ifError()`.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Этот API больше не является экспериментальным. |
| v13.6.0, v12.16.0 | Добавлено в: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ожидает, что входная `string` будет соответствовать регулярному выражению.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

Если значения не совпадают или если аргумент `string` имеет другой тип, отличный от `string`, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, установленным равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) будет выброшен он.

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0, v14.18.0 | В режиме Legacy assertion статус изменен с Deprecated на Legacy. |
| v14.0.0 | NaN теперь рассматривается как идентичный, если обе стороны являются NaN. |
| v9.0.0 | Имена и сообщения `Error` теперь сравниваются правильно. |
| v8.0.0 | Также сравнивается содержимое `Set` и `Map`. |
| v6.4.0, v4.7.1 | Теперь срезы типизированных массивов обрабатываются корректно. |
| v6.1.0, v4.5.0 | Объекты с циклическими ссылками теперь можно использовать в качестве входных данных. |
| v5.10.1, v4.4.3 | Правильно обрабатывать типизированные массивы, отличные от `Uint8Array`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Режим строгой проверки утверждений (Strict assertion mode)**

Псевдоним [`assert.notDeepStrictEqual()`](/ru/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Режим Legacy assertion**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Legacy: Используйте [`assert.notDeepStrictEqual()`](/ru/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) вместо этого.
:::

Проверяет любое глубокое неравенство. Противоположность [`assert.deepEqual()`](/ru/nodejs/api/assert#assertdeepequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

Если значения глубоко равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, установленным равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо `AssertionError` будет выброшен он.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v9.0.0 | `-0` и `+0` больше не считаются равными. |
| v9.0.0 | `NaN` теперь сравнивается с использованием сравнения [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | Имена и сообщения `Error` теперь сравниваются корректно. |
| v8.0.0 | Также сравнивается содержимое `Set` и `Map`. |
| v6.1.0 | Объекты с циклическими ссылками теперь могут использоваться в качестве входных данных. |
| v6.4.0, v4.7.1 | Срезы типизированных массивов теперь обрабатываются корректно. |
| v5.10.1, v4.4.3 | Корректно обрабатываются типизированные массивы, отличные от `Uint8Array`. |
| v1.2.0 | Добавлено в версии: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Проверяет глубокое строгое неравенство. Противоположность [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

Если значения глубоко и строго равны, выбрасывается исключение [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то он будет выброшен вместо [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v16.0.0, v14.18.0 | В устаревшем режиме утверждений статус из "Устаревший" изменен на "Устаревший". |
| v14.0.0 | NaN теперь рассматривается как идентичный, если обе стороны являются NaN. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Строгий режим утверждений**

Псевдоним [`assert.notStrictEqual()`](/ru/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Устаревший режим утверждений**

::: info [Стабильно: 3 - Устаревший]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте [`assert.notStrictEqual()`](/ru/nodejs/api/assert#assertnotstrictequalactual-expected-message) вместо этого.
:::

Проверяет поверхностное, принудительное неравенство с помощью [`!=` оператора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` специально обрабатывается и рассматривается как идентичный, если обе стороны являются `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

Если значения равны, выбрасывается исключение [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то он будет выброшен вместо `AssertionError`.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Используемое сравнение изменено со строгого равенства на `Object.is()`. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Проверяет строгое неравенство между параметрами `actual` и `expected`, как определено [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

Если значения строго равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо `AssertionError` будет выброшена ошибка.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | `assert.ok()` (без аргументов) теперь будет использовать предопределенное сообщение об ошибке. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Проверяет, является ли `value` истинным значением. Эквивалентно `assert.equal(!!value, true, message)`.

Если `value` не является истинным, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` равен `undefined`, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо `AssertionError` будет выброшена ошибка. Если аргументы не передаются вообще, `message` будет установлено в строку: `'No value argument passed to `assert.ok()`'`.

Имейте в виду, что в `repl` сообщение об ошибке будет отличаться от того, что выбрасывается в файле! Смотрите ниже для получения более подробной информации.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**Добавлено в: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ожидает промис `asyncFn` или, если `asyncFn` является функцией, немедленно вызывает функцию и ожидает завершения возвращенного промиса. Затем он проверит, что промис был отклонен.

Если `asyncFn` является функцией и она синхронно выбрасывает ошибку, `assert.rejects()` вернет отклоненный `Promise` с этой ошибкой. Если функция не возвращает промис, `assert.rejects()` вернет отклоненный `Promise` с ошибкой [`ERR_INVALID_RETURN_VALUE`](/ru/nodejs/api/errors#err_invalid_return_value). В обоих случаях обработчик ошибок пропускается.

Помимо асинхронной природы ожидания завершения, он ведет себя идентично [`assert.throws()`](/ru/nodejs/api/assert#assertthrowsfn-error-message).

Если указано, `error` может быть [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), функцией валидации, объектом, где будет проверено каждое свойство, или экземпляром ошибки, где будет проверено каждое свойство, включая неперечисляемые свойства `message` и `name`.

Если указано, `message` будет сообщением, предоставленным [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror), если `asyncFn` не отклонит.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
:::

`error` не может быть строкой. Если строка указана в качестве второго аргумента, тогда предполагается, что `error` опущен, и вместо этого строка будет использоваться для `message`. Это может привести к легко пропускаемым ошибкам. Пожалуйста, внимательно прочитайте пример в [`assert.throws()`](/ru/nodejs/api/assert#assertthrowsfn-error-message), если рассматривается использование строки в качестве второго аргумента.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Используемое сравнение изменено со Строгого Равенства на `Object.is()`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Проверяет строгое равенство между параметрами `actual` и `expected`, как определено [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

Если значения не строго равны, выбрасывается [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) со свойством `message`, равным значению параметра `message`. Если параметр `message` не определен, назначается сообщение об ошибке по умолчанию. Если параметр `message` является экземпляром [`Error`](/ru/nodejs/api/errors#class-error), то вместо [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror) будет выброшен он.


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.2.0 | Параметр `error` теперь может быть объектом, содержащим регулярные выражения. |
| v9.9.0 | Параметр `error` теперь также может быть объектом. |
| v4.2.0 | Параметр `error` теперь может быть стрелочной функцией. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ожидает, что функция `fn` вызовет ошибку.

Если указано, `error` может быть [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), функцией валидации, объектом валидации, где каждое свойство будет проверено на строгое глубокое равенство, или экземпляром ошибки, где каждое свойство будет проверено на строгое глубокое равенство, включая неперечисляемые свойства `message` и `name`. При использовании объекта также можно использовать регулярное выражение при валидации строкового свойства. Смотрите примеры ниже.

Если указано, `message` будет добавлено к сообщению, предоставленному `AssertionError`, если вызов `fn` не сможет вызвать исключение или в случае сбоя проверки ошибки.

Пользовательский объект валидации/экземпляр ошибки:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Неверное значение');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Неверное значение',
    info: {
      nested: true,
      baz: 'text',
    },
    // Проверяются только свойства объекта валидации.
    // Использование вложенных объектов требует наличия всех свойств. В противном случае
    // валидация завершится неудачей.
  },
);

// Использование регулярных выражений для проверки свойств ошибки:
assert.throws(
  () => {
    throw err;
  },
  {
    // Свойства `name` и `message` являются строками, и использование регулярных
    // выражений для них будет соответствовать строке. Если они не совпадают,
    // будет выброшена ошибка.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Невозможно использовать регулярные выражения для вложенных свойств!
      baz: 'text',
    },
    // Свойство `reg` содержит регулярное выражение, и только если объект
    // валидации содержит идентичное регулярное выражение, проверка будет
    // пройдена.
    reg: /abc/i,
  },
);

// Не проходит из-за разных свойств `message` и `name`:
assert.throws(
  () => {
    const otherErr = new Error('Не найдено');
    // Скопировать все перечисляемые свойства из `err` в `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Свойства `message` и `name` ошибки также будут проверены при использовании
  // ошибки в качестве объекта валидации.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Неверное значение');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Неверное значение',
    info: {
      nested: true,
      baz: 'text',
    },
    // Проверяются только свойства объекта валидации.
    // Использование вложенных объектов требует наличия всех свойств. В противном случае
    // валидация завершится неудачей.
  },
);

// Использование регулярных выражений для проверки свойств ошибки:
assert.throws(
  () => {
    throw err;
  },
  {
    // Свойства `name` и `message` являются строками, и использование регулярных
    // выражений для них будет соответствовать строке. Если они не совпадают,
    // будет выброшена ошибка.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Невозможно использовать регулярные выражения для вложенных свойств!
      baz: 'text',
    },
    // Свойство `reg` содержит регулярное выражение, и только если объект
    // валидации содержит идентичное регулярное выражение, проверка будет
    // пройдена.
    reg: /abc/i,
  },
);

// Не проходит из-за разных свойств `message` и `name`:
assert.throws(
  () => {
    const otherErr = new Error('Не найдено');
    // Скопировать все перечисляемые свойства из `err` в `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Свойства `message` и `name` ошибки также будут проверены при использовании
  // ошибки в качестве объекта валидации.
  err,
);
```
:::

Проверка instanceof с использованием конструктора:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  Error,
);
```
:::

Проверка сообщения об ошибке с использованием [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

Использование регулярного выражения запускает `.toString` для объекта ошибки и, следовательно, также будет включать имя ошибки.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  /^Error: Неверное значение$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  /^Error: Неверное значение$/,
);
```
:::

Пользовательская валидация ошибки:

Функция должна возвращать `true`, чтобы указать, что все внутренние проверки пройдены. В противном случае она завершится неудачей с [`AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Избегайте возврата чего-либо, кроме `true`, из функций валидации.
    // В противном случае неясно, какая часть валидации не удалась. Вместо этого,
    // выбросьте ошибку о конкретной неудачной валидации (как сделано в этом
    // примере) и добавьте как можно больше полезной отладочной информации к этой ошибке.
    return true;
  },
  'неожиданная ошибка',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Неверное значение');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Избегайте возврата чего-либо, кроме `true`, из функций валидации.
    // В противном случае неясно, какая часть валидации не удалась. Вместо этого,
    // выбросьте ошибку о конкретной неудачной валидации (как сделано в этом
    // примере) и добавьте как можно больше полезной отладочной информации к этой ошибке.
    return true;
  },
  'неожиданная ошибка',
);
```
:::

`error` не может быть строкой. Если строка указана в качестве второго аргумента, то предполагается, что `error` опущен, и строка будет использоваться для `message` вместо этого. Это может привести к легко упускаемым ошибкам. Использование того же сообщения, что и сообщение выброшенной ошибки, приведет к ошибке `ERR_AMBIGUOUS_ARGUMENT`. Пожалуйста, внимательно прочитайте пример ниже, если рассматривается использование строки в качестве второго аргумента:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// Второй аргумент - строка, и входная функция выбросила Error.
// Первый случай не вызовет исключение, так как он не соответствует сообщению об ошибке,
// выброшенному входной функцией!
assert.throws(throwingFirst, 'Second');
// В следующем примере сообщение не имеет преимуществ перед сообщением из
// ошибки, и поскольку неясно, намеревался ли пользователь фактически сопоставить
// сообщение об ошибке, Node.js выдает ошибку `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// Строка используется только (в качестве сообщения) в случае, если функция не вызывает исключение:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// Если предполагалось сопоставить сообщение об ошибке, сделайте это вместо этого:
// Он не выдает исключение, потому что сообщения об ошибках совпадают.
assert.throws(throwingSecond, /Second$/);

// Если сообщение об ошибке не совпадает, выдается AssertionError.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// Второй аргумент - строка, и входная функция выбросила Error.
// Первый случай не вызовет исключение, так как он не соответствует сообщению об ошибке,
// выброшенному входной функцией!
assert.throws(throwingFirst, 'Second');
// В следующем примере сообщение не имеет преимуществ перед сообщением из
// ошибки, и поскольку неясно, намеревался ли пользователь фактически сопоставить
// сообщение об ошибке, Node.js выдает ошибку `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// Строка используется только (в качестве сообщения) в случае, если функция не вызывает исключение:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// Если предполагалось сопоставить сообщение об ошибке, сделайте это вместо этого:
// Он не выдает исключение, потому что сообщения об ошибках совпадают.
assert.throws(throwingSecond, /Second$/);

// Если сообщение об ошибке не совпадает, выдается AssertionError.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

Из-за запутанной и подверженной ошибкам нотации избегайте использования строки в качестве второго аргумента.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Добавлено в версии: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/ru/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Утверждает эквивалентность между параметрами `actual` и `expected` посредством глубокого сравнения, гарантируя, что все свойства в параметре `expected` присутствуют в параметре `actual` с эквивалентными значениями, не допуская приведения типов. Основное отличие от [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message) состоит в том, что [`assert.partialDeepStrictEqual()`](/ru/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) не требует, чтобы все свойства в параметре `actual` присутствовали в параметре `expected`. Этот метод всегда должен проходить те же тесты, что и [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message), ведя себя как его супермножество.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

