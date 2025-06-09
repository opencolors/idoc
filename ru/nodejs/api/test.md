---
title: Node.js Тестовый запускатор
description: Модуль Node.js Тестовый запускатор предоставляет встроенное решение для написания и выполнения тестов в приложениях Node.js. Он поддерживает различные форматы тестов, отчеты о покрытии и интегрируется с популярными тестовыми фреймворками.
head:
  - - meta
    - name: og:title
      content: Node.js Тестовый запускатор | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль Node.js Тестовый запускатор предоставляет встроенное решение для написания и выполнения тестов в приложениях Node.js. Он поддерживает различные форматы тестов, отчеты о покрытии и интегрируется с популярными тестовыми фреймворками.
  - - meta
    - name: twitter:title
      content: Node.js Тестовый запускатор | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль Node.js Тестовый запускатор предоставляет встроенное решение для написания и выполнения тестов в приложениях Node.js. Он поддерживает различные форматы тестов, отчеты о покрытии и интегрируется с популярными тестовыми фреймворками.
---


# Запуск тестов {#test-runner}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Запуск тестов теперь стабилен. |
| v18.0.0, v16.17.0 | Добавлено в: v18.0.0, v16.17.0 |
:::

::: tip [Стабильность: 2 - Стабильно]
[Стабильность: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

Модуль `node:test` упрощает создание тестов JavaScript. Чтобы получить к нему доступ:

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Этот модуль доступен только по схеме `node:`.

Тесты, созданные с помощью модуля `test`, состоят из одной функции, которая обрабатывается одним из трех способов:

В следующем примере показано, как пишутся тесты с использованием модуля `test`.

```js [ESM]
test('синхронный проходящий тест', (t) => {
  // Этот тест проходит, потому что он не выбрасывает исключение.
  assert.strictEqual(1, 1);
});

test('синхронный непроходящий тест', (t) => {
  // Этот тест не проходит, потому что он выбрасывает исключение.
  assert.strictEqual(1, 2);
});

test('асинхронный проходящий тест', async (t) => {
  // Этот тест проходит, потому что Promise, возвращенный асинхронной
  // функцией, выполнен и не отклонен.
  assert.strictEqual(1, 1);
});

test('асинхронный непроходящий тест', async (t) => {
  // Этот тест не проходит, потому что Promise, возвращенный асинхронной
  // функцией, отклонен.
  assert.strictEqual(1, 2);
});

test('непроходящий тест с использованием Promises', (t) => {
  // Promises также можно использовать напрямую.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('это приведет к сбою теста'));
    });
  });
});

test('проходящий тест с обратным вызовом', (t, done) => {
  // done() - это функция обратного вызова. Когда выполняется setImmediate(), он вызывает
  // done() без аргументов.
  setImmediate(done);
});

test('непроходящий тест с обратным вызовом', (t, done) => {
  // Когда выполняется setImmediate(), done() вызывается с объектом Error и
  // тест не проходит.
  setImmediate(() => {
    done(new Error('сбой обратного вызова'));
  });
});
```
Если какие-либо тесты не пройдены, коду выхода процесса присваивается значение `1`.


## Подтесты {#subtests}

Метод `test()` контекста теста позволяет создавать подтесты. Он позволяет структурировать ваши тесты иерархически, где вы можете создавать вложенные тесты внутри большего теста. Этот метод ведет себя идентично функции `test()` верхнего уровня. Следующий пример демонстрирует создание теста верхнего уровня с двумя подтестами.

```js [ESM]
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
В этом примере `await` используется для обеспечения завершения обоих подтестов. Это необходимо, потому что тесты не ждут завершения своих подтестов, в отличие от тестов, созданных внутри наборов. Любые незавершенные подтесты при завершении их родительского элемента отменяются и рассматриваются как сбои. Любые сбои подтестов приводят к сбою родительского теста.

## Пропуск тестов {#skipping-tests}

Отдельные тесты можно пропустить, передав параметр `skip` в тест или вызвав метод `skip()` контекста теста, как показано в следующем примере.

```js [ESM]
// Используется параметр skip, но сообщение не предоставлено.
test('skip option', { skip: true }, (t) => {
  // Этот код никогда не выполняется.
});

// Используется параметр skip, и предоставлено сообщение.
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // Этот код никогда не выполняется.
});

test('skip() method', (t) => {
  // Обязательно вернитесь сюда, если тест содержит дополнительную логику.
  t.skip();
});

test('skip() method with message', (t) => {
  // Обязательно вернитесь сюда, если тест содержит дополнительную логику.
  t.skip('this is skipped');
});
```
## Тесты TODO {#todo-tests}

Отдельные тесты можно пометить как нестабильные или неполные, передав параметр `todo` в тест или вызвав метод `todo()` контекста теста, как показано в следующем примере. Эти тесты представляют собой ожидающую реализацию или ошибку, которую необходимо исправить. Тесты TODO выполняются, но не рассматриваются как сбои тестов и, следовательно, не влияют на код завершения процесса. Если тест помечен как TODO и пропущен, параметр TODO игнорируется.

```js [ESM]
// Используется параметр todo, но сообщение не предоставлено.
test('todo option', { todo: true }, (t) => {
  // Этот код выполняется, но не рассматривается как сбой.
  throw new Error('this does not fail the test');
});

// Используется параметр todo, и предоставлено сообщение.
test('todo option with message', { todo: 'this is a todo test' }, (t) => {
  // Этот код выполняется.
});

test('todo() method', (t) => {
  t.todo();
});

test('todo() method with message', (t) => {
  t.todo('this is a todo test and is not treated as a failure');
  throw new Error('this does not fail the test');
});
```

## Псевдонимы `describe()` и `it()` {#describe-and-it-aliases}

Наборы и тесты также можно писать с помощью функций `describe()` и `it()`. [`describe()`](/ru/nodejs/api/test#describename-options-fn) является псевдонимом для [`suite()`](/ru/nodejs/api/test#suitename-options-fn), а [`it()`](/ru/nodejs/api/test#itname-options-fn) является псевдонимом для [`test()`](/ru/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('Что-то', () => {
  it('должно работать', () => {
    assert.strictEqual(1, 1);
  });

  it('должно быть хорошо', () => {
    assert.strictEqual(2, 2);
  });

  describe('вложенная штука', () => {
    it('должно работать', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` и `it()` импортируются из модуля `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only` тесты {#only-tests}

Если Node.js запускается с опцией командной строки [`--test-only`](/ru/nodejs/api/cli#--test-only) или изоляция тестов отключена, можно пропустить все тесты, за исключением выбранного подмножества, передав опцию `only` тестам, которые должны быть запущены. Когда для теста установлена опция `only`, все подтесты также запускаются. Если для набора установлена опция `only`, все тесты в наборе запускаются, если только у него нет потомков с установленной опцией `only`, в этом случае запускаются только эти тесты.

При использовании [подтестов](/ru/nodejs/api/test#subtests) внутри `test()`/`it()` необходимо пометить все родительские тесты опцией `only`, чтобы запустить только выбранное подмножество тестов.

Метод `runOnly()` контекста теста можно использовать для реализации того же поведения на уровне подтестов. Тесты, которые не выполняются, исключаются из выходных данных средства запуска тестов.

```js [ESM]
// Предположим, что Node.js запущен с опцией командной строки --test-only.
// Установлена опция 'only' набора, поэтому эти тесты запускаются.
test('этот тест выполняется', { only: true }, async (t) => {
  // Внутри этого теста все подтесты выполняются по умолчанию.
  await t.test('запуск подтеста');

  // Контекст теста можно обновить, чтобы запускать подтесты с опцией 'only'.
  t.runOnly(true);
  await t.test('этот подтест теперь пропущен');
  await t.test('этот подтест выполняется', { only: true });

  // Переключите контекст обратно для выполнения всех тестов.
  t.runOnly(false);
  await t.test('этот подтест теперь выполняется');

  // Явно не запускайте эти тесты.
  await t.test('пропущенный подтест 3', { only: false });
  await t.test('пропущенный подтест 4', { skip: true });
});

// Опция 'only' не установлена, поэтому этот тест пропускается.
test('этот тест не выполняется', () => {
  // Этот код не выполняется.
  throw new Error('fail');
});

describe('набор', () => {
  // Установлена опция 'only', поэтому этот тест выполняется.
  it('этот тест выполняется', { only: true }, () => {
    // Этот код выполняется.
  });

  it('этот тест не выполняется', () => {
    // Этот код не выполняется.
    throw new Error('fail');
  });
});

describe.only('набор', () => {
  // Установлена опция 'only', поэтому этот тест выполняется.
  it('этот тест выполняется', () => {
    // Этот код выполняется.
  });

  it('этот тест выполняется', () => {
    // Этот код выполняется.
  });
});
```

## Фильтрация тестов по имени {#filtering-tests-by-name}

Опция командной строки [`--test-name-pattern`](/ru/nodejs/api/cli#--test-name-pattern) может использоваться для запуска только тех тестов, чье имя соответствует предоставленному шаблону, а опция [`--test-skip-pattern`](/ru/nodejs/api/cli#--test-skip-pattern) может использоваться для пропуска тестов, чье имя соответствует предоставленному шаблону. Шаблоны имен тестов интерпретируются как регулярные выражения JavaScript. Опции `--test-name-pattern` и `--test-skip-pattern` могут быть указаны несколько раз для запуска вложенных тестов. Для каждого выполняемого теста также запускаются соответствующие хуки тестов, такие как `beforeEach()`. Тесты, которые не выполняются, исключаются из вывода средства запуска тестов.

Учитывая следующий файл тестов, запуск Node.js с опцией `--test-name-pattern="test [1-3]"` приведет к тому, что средство запуска тестов выполнит `test 1`, `test 2` и `test 3`. Если `test 1` не соответствует шаблону имени теста, то его подтесты не будут выполнены, несмотря на соответствие шаблону. Тот же набор тестов можно также выполнить, передав `--test-name-pattern` несколько раз (например, `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"` и т.д.).

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
Шаблоны имен тестов также могут быть указаны с использованием литералов регулярных выражений. Это позволяет использовать флаги регулярных выражений. В предыдущем примере запуск Node.js с `--test-name-pattern="/test [4-5]/i"` (или `--test-skip-pattern="/test [4-5]/i"`) будет соответствовать `Test 4` и `Test 5`, потому что шаблон нечувствителен к регистру.

Чтобы сопоставить один тест с шаблоном, вы можете добавить к нему префикс в виде всех имен его родительских тестов, разделенных пробелом, чтобы обеспечить его уникальность. Например, учитывая следующий файл тестов:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Запуск Node.js с `--test-name-pattern="test 1 some test"` будет соответствовать только `some test` в `test 1`.

Шаблоны имен тестов не изменяют набор файлов, которые выполняет средство запуска тестов.

Если указаны и `--test-name-pattern`, и `--test-skip-pattern`, тесты должны удовлетворять **обоим** требованиям, чтобы быть выполненными.


## Посторонняя асинхронная активность {#extraneous-asynchronous-activity}

После завершения выполнения тестовой функции результаты сообщаются как можно быстрее, сохраняя при этом порядок тестов. Однако возможно, что тестовая функция сгенерирует асинхронную активность, которая переживет сам тест. Тестовый исполнитель обрабатывает этот тип активности, но не задерживает сообщение результатов теста, чтобы учесть это.

В следующем примере тест завершается с двумя все еще невыполненными операциями `setImmediate()`. Первая `setImmediate()` пытается создать новый подтест. Поскольку родительский тест уже завершен и вывел свои результаты, новый подтест немедленно помечается как неудачный и сообщается позже в [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream).

Вторая `setImmediate()` создает событие `uncaughtException`. События `uncaughtException` и `unhandledRejection`, исходящие из завершенного теста, помечаются модулем `test` как неудачные и сообщаются в качестве диагностических предупреждений на верхнем уровне [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream).

```js [ESM]
test('тест, создающий асинхронную активность', (t) => {
  setImmediate(() => {
    t.test('подтест, который был создан слишком поздно', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // Тест завершается после этой строки.
});
```
## Режим наблюдения {#watch-mode}

**Добавлено в: v19.2.0, v18.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Тестовый исполнитель Node.js поддерживает запуск в режиме наблюдения, передавая флаг `--watch`:

```bash [BASH]
node --test --watch
```
В режиме наблюдения тестовый исполнитель будет отслеживать изменения в тестовых файлах и их зависимостях. При обнаружении изменения тестовый исполнитель перезапустит тесты, затронутые этим изменением. Тестовый исполнитель будет продолжать работать до завершения процесса.

## Запуск тестов из командной строки {#running-tests-from-the-command-line}

Тестовый исполнитель Node.js можно вызвать из командной строки, передав флаг [`--test`](/ru/nodejs/api/cli#--test):

```bash [BASH]
node --test
```
По умолчанию Node.js будет запускать все файлы, соответствующие следующим шаблонам:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

При предоставлении [`--experimental-strip-types`](/ru/nodejs/api/cli#--experimental-strip-types) сопоставляются следующие дополнительные шаблоны:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

В качестве альтернативы, один или несколько шаблонов glob могут быть предоставлены в качестве последнего аргумента(ов) команде Node.js, как показано ниже. Шаблоны Glob следуют поведению [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). Шаблоны glob должны быть заключены в двойные кавычки в командной строке, чтобы предотвратить расширение оболочки, что может снизить переносимость между системами.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Соответствующие файлы выполняются как тестовые файлы. Дополнительную информацию о выполнении тестовых файлов можно найти в разделе [модель выполнения тестового исполнителя](/ru/nodejs/api/test#test-runner-execution-model).


### Модель выполнения тестового запуска {#test-runner-execution-model}

Когда включена изоляция тестов на уровне процесса, каждый подходящий тестовый файл выполняется в отдельном дочернем процессе. Максимальное количество дочерних процессов, работающих одновременно, контролируется флагом [`--test-concurrency`](/ru/nodejs/api/cli#--test-concurrency). Если дочерний процесс завершается с кодом выхода 0, тест считается пройденным. В противном случае тест считается неудачным. Тестовые файлы должны быть исполняемыми Node.js, но не обязаны использовать модуль `node:test` внутри.

Каждый тестовый файл выполняется как обычный скрипт. То есть, если сам тестовый файл использует `node:test` для определения тестов, все эти тесты будут выполнены в одном потоке приложения, независимо от значения параметра `concurrency` функции [`test()`](/ru/nodejs/api/test#testname-options-fn).

Когда изоляция тестов на уровне процесса отключена, каждый подходящий тестовый файл импортируется в процесс тестового запуска. После загрузки всех тестовых файлов тесты верхнего уровня выполняются с параллельностью, равной единице. Поскольку все тестовые файлы запускаются в одном контексте, тесты могут взаимодействовать друг с другом способами, которые невозможны при включенной изоляции. Например, если тест зависит от глобального состояния, это состояние может быть изменено тестом, происходящим из другого файла.

## Сбор покрытия кода {#collecting-code-coverage}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Когда Node.js запускается с флагом командной строки [`--experimental-test-coverage`](/ru/nodejs/api/cli#--experimental-test-coverage), собирается покрытие кода и статистика сообщается после завершения всех тестов. Если переменная окружения [`NODE_V8_COVERAGE`](/ru/nodejs/api/cli#node_v8_coveragedir) используется для указания каталога покрытия кода, сгенерированные файлы покрытия V8 записываются в этот каталог. Модули ядра Node.js и файлы в каталогах `node_modules/` по умолчанию не включаются в отчет о покрытии. Однако их можно явно включить с помощью флага [`--test-coverage-include`](/ru/nodejs/api/cli#--test-coverage-include). По умолчанию все подходящие тестовые файлы исключаются из отчета о покрытии. Исключения можно переопределить с помощью флага [`--test-coverage-exclude`](/ru/nodejs/api/cli#--test-coverage-exclude). Если покрытие включено, отчет о покрытии отправляется любым [репортерам тестов](/ru/nodejs/api/test#test-reporters) через событие `'test:coverage'`.

Покрытие можно отключить на серии строк, используя следующий синтаксис комментариев:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Код в этой ветви никогда не будет выполнен, но строки игнорируются для
  // целей покрытия. Все строки после комментария 'disable' игнорируются
  // до тех пор, пока не встретится соответствующий комментарий 'enable'.
  console.log('this is never executed');
}
/* node:coverage enable */
```
Покрытие также можно отключить для указанного количества строк. После указанного количества строк покрытие будет автоматически включено повторно. Если количество строк явно не указано, игнорируется одна строка.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Репортеры покрытия {#coverage-reporters}

Репортеры `tap` и `spec` будут печатать сводку статистики покрытия. Существует также репортер `lcov`, который будет генерировать файл `lcov`, который можно использовать в качестве подробного отчета о покрытии.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Этот репортер не сообщает о результатах тестов.
- Этот репортер в идеале следует использовать вместе с другим репортером.

## Мокирование {#mocking}

Модуль `node:test` поддерживает мокирование во время тестирования через объект верхнего уровня `mock`. В следующем примере создается шпион за функцией, которая складывает два числа. Затем шпион используется для подтверждения того, что функция была вызвана должным образом.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```
:::

Та же функциональность мокирования также предоставляется в объекте [`TestContext`](/ru/nodejs/api/test#class-testcontext) каждого теста. В следующем примере создается шпион за методом объекта с использованием API, предоставленного в `TestContext`. Преимущество мокирования через контекст теста заключается в том, что средство запуска тестов автоматически восстановит всю мокированную функциональность после завершения теста.

```js [ESM]
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### Таймеры {#timers}

Имитация таймеров - это метод, обычно используемый в тестировании программного обеспечения для имитации и управления поведением таймеров, таких как `setInterval` и `setTimeout`, без фактического ожидания указанных временных интервалов.

Полный список методов и функций см. в классе [`MockTimers`](/ru/nodejs/api/test#class-mocktimers).

Это позволяет разработчикам писать более надежные и предсказуемые тесты для функциональности, зависящей от времени.

В приведенном ниже примере показано, как имитировать `setTimeout`. Использование `.enable({ apis: ['setTimeout'] });` позволит имитировать функции `setTimeout` в модулях [node:timers](/ru/nodejs/api/timers) и [node:timers/promises](/ru/nodejs/api/timers#timers-promises-api), а также из глобального контекста Node.js.

**Примечание:** Деструктурирование функций, таких как `import { setTimeout } from 'node:timers'`, в настоящее время не поддерживается этим API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('имитирует setTimeout для синхронного выполнения без необходимости фактического ожидания', () => {
  const fn = mock.fn();

  // При необходимости выберите, что имитировать
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Продвинуться во времени
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Сбросить глобально отслеживаемые моки.
  mock.timers.reset();

  // Если вы вызываете reset mock instance, он также сбросит timers instance
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('имитирует setTimeout для синхронного выполнения без необходимости фактического ожидания', () => {
  const fn = mock.fn();

  // При необходимости выберите, что имитировать
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Продвинуться во времени
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Сбросить глобально отслеживаемые моки.
  mock.timers.reset();

  // Если вы вызываете reset mock instance, он также сбросит timers instance
  mock.reset();
});
```
:::

Та же функциональность имитации также предоставляется в свойстве mock объекта [`TestContext`](/ru/nodejs/api/test#class-testcontext) каждого теста. Преимущество имитации через контекст теста заключается в том, что средство запуска тестов автоматически восстановит всю функциональность имитируемых таймеров после завершения теста.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('имитирует setTimeout для синхронного выполнения без необходимости фактического ожидания', (context) => {
  const fn = context.mock.fn();

  // При необходимости выберите, что имитировать
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Продвинуться во времени
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('имитирует setTimeout для синхронного выполнения без необходимости фактического ожидания', (context) => {
  const fn = context.mock.fn();

  // При необходимости выберите, что имитировать
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Продвинуться во времени
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### Даты {#dates}

API mock-таймеров также позволяет мокать объект `Date`. Это полезная функция для тестирования функциональности, зависящей от времени, или для имитации внутренних календарных функций, таких как `Date.now()`.

Реализация дат также является частью класса [`MockTimers`](/ru/nodejs/api/test#class-mocktimers). Обратитесь к нему для получения полного списка методов и функций.

**Примечание:** Даты и таймеры зависимы, когда мокаются вместе. Это означает, что если у вас замоканы и `Date`, и `setTimeout`, продвижение времени также продвинет и замоканную дату, поскольку они имитируют единые внутренние часы.

В приведенном ниже примере показано, как замокать объект `Date` и получить текущее значение `Date.now()`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('мокает объект Date', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'] });
  // Если не указано, начальная дата будет основана на 0 в эпохе UNIX
  assert.strictEqual(Date.now(), 0);

  // Продвижение во времени также продвинет дату
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('мокает объект Date', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'] });
  // Если не указано, начальная дата будет основана на 0 в эпохе UNIX
  assert.strictEqual(Date.now(), 0);

  // Продвижение во времени также продвинет дату
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

Если начальная эпоха не установлена, начальная дата будет основана на 0 в эпохе Unix. Это 1 января 1970 года, 00:00:00 UTC. Вы можете установить начальную дату, передав свойство `now` методу `.enable()`. Это значение будет использоваться в качестве начальной даты для замоканного объекта `Date`. Оно может быть как положительным целым числом, так и другим объектом Date.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('мокает объект Date с начальным временем', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Продвижение во времени также продвинет дату
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('мокает объект Date с начальным временем', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Продвижение во времени также продвинет дату
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

Вы можете использовать метод `.setTime()` для ручного перемещения замоканной даты на другое время. Этот метод принимает только положительное целое число.

**Примечание:** Этот метод выполнит любые замоканные таймеры, которые были в прошлом относительно нового времени.

В приведенном ниже примере мы устанавливаем новое время для замоканной даты.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('устанавливает время объекта Date', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Продвижение во времени также продвинет дату
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('устанавливает время объекта Date', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Продвижение во времени также продвинет дату
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Если у вас есть какой-либо таймер, настроенный на запуск в прошлом, он будет выполнен, как если бы был вызван метод `.tick()`. Это полезно, если вы хотите протестировать функциональность, зависящую от времени, которая уже в прошлом.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('запускает таймеры, когда setTime проходит тики', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Таймер не выполняется, так как время еще не достигнуто
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Таймер выполняется, так как время теперь достигнуто
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('запускает таймеры, когда setTime проходит тики', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Таймер не выполняется, так как время еще не достигнуто
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Таймер выполняется, так как время теперь достигнуто
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Использование `.runAll()` выполнит все таймеры, которые в данный момент находятся в очереди. Это также продвинет замоканную дату до времени последнего выполненного таймера, как если бы время прошло.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('запускает таймеры, когда setTime проходит тики', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Все таймеры выполняются, так как время теперь достигнуто
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('запускает таймеры, когда setTime проходит тики', (context) => {
  // Опционально выберите, что мокать
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Все таймеры выполняются, так как время теперь достигнуто
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## Snapshot testing {#snapshot-testing}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

Снапшот-тесты позволяют сериализовать произвольные значения в строковые значения и сравнивать их с набором известных хороших значений. Известные хорошие значения называются снапшотами и хранятся в файле снапшотов. Файлы снапшотов управляются тестовым исполнителем, но разработаны таким образом, чтобы быть читаемыми человеком, чтобы помочь в отладке. Рекомендуется сохранять файлы снапшотов в системе контроля версий вместе с вашими тестовыми файлами.

Файлы снапшотов генерируются путем запуска Node.js с флагом командной строки [`--test-update-snapshots`](/ru/nodejs/api/cli#--test-update-snapshots). Для каждого тестового файла генерируется отдельный файл снапшотов. По умолчанию файл снапшотов имеет то же имя, что и тестовый файл, с расширением `.snapshot`. Это поведение можно настроить с помощью функции `snapshot.setResolveSnapshotPath()`. Каждое утверждение снапшота соответствует экспорту в файле снапшотов.

Пример снапшот-теста показан ниже. При первом выполнении этого теста он завершится неудачей, потому что соответствующий файл снапшотов не существует.

```js [ESM]
// test.js
suite('suite of snapshot tests', () => {
  test('snapshot test', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Сгенерируйте файл снапшотов, запустив тестовый файл с `--test-update-snapshots`. Тест должен пройти, и в том же каталоге, что и тестовый файл, будет создан файл с именем `test.js.snapshot`. Содержимое файла снапшотов показано ниже. Каждый снапшот идентифицируется полным именем теста и счетчиком для различения снапшотов в одном и том же тесте.

```js [ESM]
exports[`suite of snapshot tests > snapshot test 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite of snapshot tests > snapshot test 2`] = `
5
`;
```
После создания файла снапшотов запустите тесты снова без флага `--test-update-snapshots`. Теперь тесты должны пройти.


## Test reporters {#test-reporters}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.9.0, v18.17.0 | Репортёры теперь доступны в `node:test/reporters`. |
| v19.6.0, v18.15.0 | Добавлено в: v19.6.0, v18.15.0 |
:::

Модуль `node:test` поддерживает передачу флагов [`--test-reporter`](/ru/nodejs/api/cli#--test-reporter), чтобы средство запуска тестов использовало определенный репортёр.

Поддерживаются следующие встроенные репортёры:

-  `spec` Репортёр `spec` выводит результаты тестов в удобочитаемом формате. Это репортёр по умолчанию.
-  `tap` Репортёр `tap` выводит результаты тестов в формате [TAP](https://testanything.org/).
-  `dot` Репортёр `dot` выводит результаты тестов в компактном формате, где каждый пройденный тест представлен символом `.`, а каждый неудачный тест представлен символом `X`.
-  `junit` Репортёр junit выводит результаты тестов в формате jUnit XML.
-  `lcov` Репортёр `lcov` выводит информацию о покрытии тестами при использовании с флагом [`--experimental-test-coverage`](/ru/nodejs/api/cli#--experimental-test-coverage).

Точный вывод этих репортёров может изменяться между версиями Node.js, и на него не следует полагаться программно. Если требуется программный доступ к выходным данным средства запуска тестов, используйте события, генерируемые [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream).

Репортёры доступны через модуль `node:test/reporters`:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Пользовательские репортёры {#custom-reporters}

[`--test-reporter`](/ru/nodejs/api/cli#--test-reporter) можно использовать для указания пути к пользовательскому репортёру. Пользовательский репортёр — это модуль, который экспортирует значение, принимаемое [stream.compose](/ru/nodejs/api/stream#streamcomposestreams). Репортёры должны преобразовывать события, генерируемые [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream).

Пример пользовательского репортёра, использующего [\<stream.Transform\>](/ru/nodejs/api/stream#class-streamtransform):

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

Пример пользовательского репортёра, использующего функцию-генератор:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

Значение, предоставленное `--test-reporter`, должно быть строкой, похожей на используемую в `import()` в коде JavaScript, или значением, предоставленным для [`--import`](/ru/nodejs/api/cli#--importmodule).


### Несколько репортеров {#multiple-reporters}

Флаг [`--test-reporter`](/ru/nodejs/api/cli#--test-reporter) можно указать несколько раз для вывода результатов тестов в нескольких форматах. В этом случае необходимо указать место назначения для каждого репортера с помощью [`--test-reporter-destination`](/ru/nodejs/api/cli#--test-reporter-destination). Местом назначения может быть `stdout`, `stderr` или путь к файлу. Репортеры и места назначения сопоставляются в соответствии с порядком их указания.

В следующем примере репортер `spec` будет выводить данные в `stdout`, а репортер `dot` - в `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Если указан один репортер, место назначения по умолчанию будет `stdout`, если явно не указано другое место назначения.

## `run([options])` {#runoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Добавлен параметр `cwd`. |
| v23.0.0 | Добавлены параметры покрытия кода. |
| v22.8.0 | Добавлен параметр `isolation`. |
| v22.6.0 | Добавлен параметр `globPatterns`. |
| v22.0.0, v20.14.0 | Добавлен параметр `forceExit`. |
| v20.1.0, v18.17.0 | Добавлен параметр testNamePatterns. |
| v18.9.0, v16.19.0 | Добавлено в: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для запуска тестов. Поддерживаются следующие свойства:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если указано число, то указанное количество тестовых процессов будет выполняться параллельно, где каждый процесс соответствует одному тестовому файлу. Если `true`, то параллельно будет запускаться `os.availableParallelism() - 1` тестовых файлов. Если `false`, то одновременно будет запускаться только один тестовый файл. **По умолчанию:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает текущий рабочий каталог, который будет использоваться программой запуска тестов. Служит базовым путем для разрешения файлов в соответствии с [моделью выполнения программы запуска тестов](/ru/nodejs/api/test#test-runner-execution-model). **По умолчанию:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив, содержащий список файлов для запуска. **По умолчанию:** соответствующие файлы из [модели выполнения программы запуска тестов](/ru/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Конфигурирует программу запуска тестов для завершения процесса после завершения выполнения всех известных тестов, даже если цикл событий в противном случае останется активным. **По умолчанию:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив, содержащий список шаблонов glob для сопоставления тестовых файлов. Этот параметр нельзя использовать вместе с `files`. **По умолчанию:** соответствующие файлы из [модели выполнения программы запуска тестов](/ru/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Устанавливает порт инспектора дочернего тестового процесса. Это может быть число или функция, которая не принимает аргументов и возвращает число. Если указано значение null, каждый процесс получает свой собственный порт, увеличивающийся от основного `process.debugPort`. Этот параметр игнорируется, если для параметра `isolation` установлено значение `'none'`, поскольку дочерние процессы не создаются. **По умолчанию:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Конфигурирует тип изоляции тестов. Если установлено значение `'process'`, каждый тестовый файл запускается в отдельном дочернем процессе. Если установлено значение `'none'`, все тестовые файлы запускаются в текущем процессе. **По умолчанию:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если истинно, контекст теста будет запускать только тесты, у которых установлен параметр `only`
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которая принимает экземпляр `TestsStream` и может использоваться для настройки прослушивателей до запуска каких-либо тестов. **По умолчанию:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив флагов CLI для передачи исполняемому файлу `node` при создании подпроцессов. Этот параметр не действует, если `isolation` имеет значение `'none'`. **По умолчанию:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив флагов CLI для передачи каждому тестовому файлу при создании подпроцессов. Этот параметр не действует, если `isolation` имеет значение `'none'`. **По умолчанию:** `[]`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющееся выполнение теста.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Строка, RegExp или массив RegExp, который можно использовать для запуска только тех тестов, имя которых соответствует предоставленному шаблону. Шаблоны имен тестов интерпретируются как регулярные выражения JavaScript. Для каждого выполняемого теста также запускаются все соответствующие тестовые хуки, такие как `beforeEach()`. **По умолчанию:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Строка, RegExp или массив RegExp, который можно использовать для исключения запуска тестов, имя которых соответствует предоставленному шаблону. Шаблоны имен тестов интерпретируются как регулярные выражения JavaScript. Для каждого выполняемого теста также запускаются все соответствующие тестовые хуки, такие как `beforeEach()`. **По умолчанию:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, после которого выполнение теста завершится неудачно. Если не указано, подтесты наследуют это значение от своего родителя. **По умолчанию:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Запускать ли в режиме наблюдения или нет. **По умолчанию:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Запуск тестов в определенном осколке. **По умолчанию:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - это положительное целое число от 1 до `\<total\>`, указывающее индекс осколка для запуска. Этот параметр *обязателен*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - это положительное целое число, указывающее общее количество осколков, на которые нужно разделить тестовые файлы. Этот параметр *обязателен*.
  
 
    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) включает сбор [покрытия кода](/ru/nodejs/api/test#collecting-code-coverage). **По умолчанию:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Исключает определенные файлы из покрытия кода с помощью шаблона glob, который может соответствовать как абсолютным, так и относительным путям к файлам. Это свойство применимо только в том случае, если для параметра `coverage` установлено значение `true`. Если указаны как `coverageExcludeGlobs`, так и `coverageIncludeGlobs`, файлы должны соответствовать **обоим** критериям, чтобы быть включенными в отчет о покрытии. **По умолчанию:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Включает определенные файлы в покрытие кода с помощью шаблона glob, который может соответствовать как абсолютным, так и относительным путям к файлам. Это свойство применимо только в том случае, если для параметра `coverage` установлено значение `true`. Если указаны как `coverageExcludeGlobs`, так и `coverageIncludeGlobs`, файлы должны соответствовать **обоим** критериям, чтобы быть включенными в отчет о покрытии. **По умолчанию:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Требовать минимальный процент покрытых строк. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`. **По умолчанию:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Требовать минимальный процент покрытых ветвей. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`. **По умолчанию:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Требовать минимальный процент покрытых функций. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`. **По умолчанию:** `0`.
  
 
- Возвращает: [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream)

**Примечание:** `shard` используется для горизонтальной параллелизации запуска тестов на нескольких машинах или в процессах, что идеально подходит для крупномасштабных выполнений в различных средах. Он несовместим с режимом `watch`, предназначенным для быстрой итерации кода путем автоматического повторного запуска тестов при изменении файлов.



::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::


## `suite([name][, options][, fn])` {#suitename-options-fn}

**Добавлено в: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя набора тестов, которое отображается при сообщении результатов тестирования. **По умолчанию:** Свойство `name` функции `fn` или `'\<anonymous\>'`, если у `fn` нет имени.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательные параметры конфигурации для набора тестов. Поддерживает те же параметры, что и `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция набора тестов, объявляющая вложенные тесты и наборы тестов. Первым аргументом этой функции является объект [`SuiteContext`](/ru/nodejs/api/test#class-suitecontext). **По умолчанию:** Функция без операций.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Немедленно выполняется с `undefined`.

Функция `suite()` импортируется из модуля `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Добавлено в: v22.0.0, v20.13.0**

Сокращенная запись для пропуска набора тестов. Это то же самое, что и [`suite([name], { skip: true }[, fn])`](/ru/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Добавлено в: v22.0.0, v20.13.0**

Сокращенная запись для пометки набора тестов как `TODO`. Это то же самое, что и [`suite([name], { todo: true }[, fn])`](/ru/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Добавлено в: v22.0.0, v20.13.0**

Сокращенная запись для пометки набора тестов как `only`. Это то же самое, что и [`suite([name], { only: true }[, fn])`](/ru/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.2.0, v18.17.0 | Добавлены сокращенные записи `skip`, `todo` и `only`. |
| v18.8.0, v16.18.0 | Добавлен параметр `signal`. |
| v18.7.0, v16.17.0 | Добавлен параметр `timeout`. |
| v18.0.0, v16.17.0 | Добавлено в: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста, которое отображается при сообщении результатов тестирования. **По умолчанию:** Свойство `name` функции `fn` или `'\<anonymous\>'`, если у `fn` нет имени.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для теста. Поддерживаются следующие свойства:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если предоставлено число, то такое количество тестов будет выполняться параллельно в потоке приложения. Если `true`, все запланированные асинхронные тесты выполняются одновременно в потоке. Если `false`, выполняется только один тест за раз. Если не указано, подтесты наследуют это значение от родительского. **По умолчанию:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если истинно и контекст теста настроен на запуск только `only` тестов, то этот тест будет запущен. В противном случае тест будет пропущен. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся тест.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если истинно, тест будет пропущен. Если предоставлена строка, эта строка отображается в результатах тестирования как причина пропуска теста. **По умолчанию:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если истинно, тест помечается как `TODO`. Если предоставлена строка, эта строка отображается в результатах тестирования как причина, по которой тест является `TODO`. **По умолчанию:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, по истечении которых тест завершится неудачно. Если не указано, подтесты наследуют это значение от родительского. **По умолчанию:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ожидаемое количество утверждений и подтестов, которые должны быть запущены в тесте. Если количество утверждений, выполненных в тесте, не соответствует количеству, указанному в плане, тест завершится неудачно. **По умолчанию:** `undefined`.


- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Тестируемая функция. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если в тесте используются обратные вызовы, функция обратного вызова передается в качестве второго аргумента. **По умолчанию:** Функция без операций.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется с `undefined` после завершения теста или немедленно, если тест запускается в наборе тестов.

Функция `test()` является значением, импортированным из модуля `test`. Каждый вызов этой функции приводит к сообщению о тесте в [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream).

Объект `TestContext`, переданный аргументу `fn`, можно использовать для выполнения действий, связанных с текущим тестом. Примеры включают пропуск теста, добавление дополнительной диагностической информации или создание подтестов.

`test()` возвращает `Promise`, который выполняется после завершения теста. Если `test()` вызывается внутри набора тестов, он выполняется немедленно. Возвращаемое значение обычно можно отбросить для тестов верхнего уровня. Однако возвращаемое значение из подтестов следует использовать, чтобы предотвратить завершение родительского теста первым и отмену подтеста, как показано в следующем примере.

```js [ESM]
test('top level test', async (t) => {
  // setTimeout() в следующем подтесте приведет к тому, что он переживет свой
  // родительский тест, если удалить 'await' в следующей строке. После завершения родительского теста
  // он отменит любые незавершенные подтесты.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
Параметр `timeout` можно использовать для сбоя теста, если его завершение занимает больше `timeout` миллисекунд. Однако это не является надежным механизмом для отмены тестов, поскольку выполняющийся тест может заблокировать поток приложения и, таким образом, предотвратить запланированную отмену.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Сокращенная запись для пропуска теста, то же самое, что и [`test([name], { skip: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Сокращенная запись для пометки теста как `TODO`, то же самое, что и [`test([name], { todo: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Сокращенная запись для пометки теста как `only`, то же самое, что и [`test([name], { only: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Псевдоним для [`suite()`](/ru/nodejs/api/test#suitename-options-fn).

Функция `describe()` импортируется из модуля `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Сокращенная запись для пропуска набора тестов. Это то же самое, что и [`describe([name], { skip: true }[, fn])`](/ru/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Сокращенная запись для пометки набора тестов как `TODO`. Это то же самое, что и [`describe([name], { todo: true }[, fn])`](/ru/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Добавлено в: v19.8.0, v18.15.0**

Сокращенная запись для пометки набора тестов как `only`. Это то же самое, что и [`describe([name], { only: true }[, fn])`](/ru/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.8.0, v18.16.0 | Вызов `it()` теперь эквивалентен вызову `test()`. |
| v18.6.0, v16.17.0 | Добавлено в: v18.6.0, v16.17.0 |
:::

Псевдоним для [`test()`](/ru/nodejs/api/test#testname-options-fn).

Функция `it()` импортируется из модуля `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Сокращенная запись для пропуска теста, то же самое, что и [`it([name], { skip: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Сокращенная запись для пометки теста как `TODO`, то же самое, что и [`it([name], { todo: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Добавлено в: v19.8.0, v18.15.0**

Сокращенная запись для пометки теста как `only`, то же самое, что и [`it([name], { only: true }[, fn])`](/ru/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Если хук использует колбэки, функция колбэка передается в качестве второго аргумента. **По умолчанию:** Функция-пустышка.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, по истечении которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от родительского элемента. **По умолчанию:** `Infinity`.

Эта функция создает хук, который выполняется перед выполнением набора тестов.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Если хук использует колбэки, функция колбэка передается в качестве второго аргумента. **По умолчанию:** Функция-пустышка.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, по истечении которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от родительского элемента. **По умолчанию:** `Infinity`.

Эта функция создает хук, который выполняется после выполнения набора тестов.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Примечание:** Хук `after` гарантированно запустится, даже если тесты внутри набора завершатся с ошибкой.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция хука. Если хук использует коллбэки, функция коллбэка передается в качестве второго аргумента. **По умолчанию:** функция-пустышка.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, после которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от своего родителя. **По умолчанию:** `Infinity`.

Эта функция создает хук, который выполняется перед каждым тестом в текущем наборе тестов.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция хука. Если хук использует коллбэки, функция коллбэка передается в качестве второго аргумента. **По умолчанию:** функция-пустышка.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, после которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от своего родителя. **По умолчанию:** `Infinity`.

Эта функция создает хук, который выполняется после каждого теста в текущем наборе тестов. Хук `afterEach()` выполняется, даже если тест завершается неудачей.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Добавлено в: v22.3.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

Объект, чьи методы используются для настройки параметров снимков по умолчанию в текущем процессе. Можно применить одну и ту же конфигурацию ко всем файлам, поместив общий код конфигурации в модуль, предварительно загруженный с помощью `--require` или `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Добавлено в: v22.3.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив синхронных функций, используемых в качестве сериализаторов по умолчанию для снапшот-тестов.

Эта функция используется для настройки механизма сериализации по умолчанию, используемого средством запуска тестов. По умолчанию средство запуска тестов выполняет сериализацию, вызывая `JSON.stringify(value, null, 2)` для предоставленного значения. `JSON.stringify()` имеет ограничения в отношении циклических структур и поддерживаемых типов данных. Если требуется более надежный механизм сериализации, следует использовать эту функцию.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Добавлено в: v22.3.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, используемая для вычисления местоположения файла снимка. Функция получает путь к файлу теста в качестве единственного аргумента. Если тест не связан с файлом (например, в REPL), входные данные не определены. `fn()` должна возвращать строку, указывающую местоположение файла снимка.

Эта функция используется для настройки местоположения файла снимка, используемого для снапшот-тестирования. По умолчанию имя файла снимка совпадает с именем файла точки входа с расширением `.snapshot`.


## Класс: `MockFunctionContext` {#class-mockfunctioncontext}

**Добавлено в: v19.1.0, v18.13.0**

Класс `MockFunctionContext` используется для проверки или управления поведением моков, созданных с помощью API [`MockTracker`](/ru/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**Добавлено в: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Геттер, возвращающий копию внутреннего массива, используемого для отслеживания вызовов мока. Каждая запись в массиве является объектом со следующими свойствами.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив аргументов, переданных в мок-функцию.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Если мокированная функция вызвала исключение, то это свойство содержит выброшенное значение. **По умолчанию:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, возвращенное мокированной функцией.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект `Error`, чей стек можно использовать для определения места вызова мокированной функции.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Если мокированная функция является конструктором, это поле содержит создаваемый класс. В противном случае будет `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение `this` мокированной функции.

### `ctx.callCount()` {#ctxcallcount}

**Добавлено в: v19.1.0, v18.13.0**

- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество вызовов этого мока.

Эта функция возвращает количество вызовов этого мока. Эта функция более эффективна, чем проверка `ctx.calls.length`, потому что `ctx.calls` является геттером, который создает копию внутреннего массива отслеживания вызовов.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Добавлено в: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция, которая будет использоваться в качестве новой реализации мока.

Эта функция используется для изменения поведения существующего мока.

В следующем примере создается функция-мок с использованием `t.mock.fn()`, вызывается функция-мок, а затем реализация мока изменяется на другую функцию.

```js [ESM]
test('изменяет поведение мока', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxmockimplementationonceimplementation-oncall}

**Добавлено в: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция, которая будет использоваться в качестве реализации мока для номера вызова, указанного в `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер вызова, который будет использовать `implementation`. Если указанный вызов уже произошел, будет выброшено исключение. **По умолчанию:** Номер следующего вызова.

Эта функция используется для изменения поведения существующего мока для одного вызова. После того, как произошел вызов `onCall`, мок вернется к тому поведению, которое он использовал бы, если бы `mockImplementationOnce()` не вызывался.

В следующем примере создается функция-мок с использованием `t.mock.fn()`, вызывается функция-мок, изменяется реализация мока на другую функцию для следующего вызова, а затем возобновляется его предыдущее поведение.

```js [ESM]
test('изменяет поведение мока один раз', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()` {#ctxresetcalls}

**Добавлено в: v19.3.0, v18.13.0**

Сбрасывает историю вызовов фиктивной функции.

### `ctx.restore()` {#ctxrestore}

**Добавлено в: v19.1.0, v18.13.0**

Восстанавливает исходную реализацию фиктивной функции. После вызова этой функции фиктивная функция по-прежнему может использоваться.

## Класс: `MockModuleContext` {#class-mockmodulecontext}

**Добавлено в: v22.3.0, v20.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя стадия разработки
:::

Класс `MockModuleContext` используется для управления поведением фиктивных модулей, созданных с помощью API [`MockTracker`](/ru/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**Добавлено в: v22.3.0, v20.18.0**

Восстанавливает реализацию фиктивного модуля.

## Класс: `MockTracker` {#class-mocktracker}

**Добавлено в: v19.1.0, v18.13.0**

Класс `MockTracker` используется для управления функциональностью имитации. Модуль запуска тестов предоставляет экспорт верхнего уровня `mock`, который является экземпляром `MockTracker`. Каждый тест также предоставляет свой собственный экземпляр `MockTracker` через свойство `mock` контекста теста.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Добавлено в: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Необязательная функция, для которой создается фиктивная функция. **По умолчанию:** Функция-пустышка.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Необязательная функция, используемая в качестве фиктивной реализации для `original`. Это полезно для создания фиктивных функций, которые демонстрируют одно поведение для указанного количества вызовов, а затем восстанавливают поведение `original`. **По умолчанию:** Функция, указанная в `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательные параметры конфигурации для фиктивной функции. Поддерживаются следующие свойства:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество раз, когда фиктивная функция будет использовать поведение `implementation`. Как только фиктивная функция будет вызвана `times` раз, она автоматически восстановит поведение `original`. Это значение должно быть целым числом больше нуля. **По умолчанию:** `Infinity`.

- Возвращает: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Фиктивная функция. Фиктивная функция содержит специальное свойство `mock`, которое является экземпляром [`MockFunctionContext`](/ru/nodejs/api/test#class-mockfunctioncontext), и может использоваться для проверки и изменения поведения фиктивной функции.

Эта функция используется для создания фиктивной функции.

В следующем примере создается фиктивная функция, которая увеличивает счетчик на единицу при каждом вызове. Параметр `times` используется для изменения поведения фиктивной функции таким образом, чтобы первые два вызова добавляли к счетчику два вместо одного.

```js [ESM]
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])` {#mockgetterobject-methodname-implementation-options}

**Добавлено в версии: v19.3.0, v18.13.0**

Эта функция является синтаксическим сахаром для [`MockTracker.method`](/ru/nodejs/api/test#mockmethodobject-methodname-implementation-options) с `options.getter`, установленным в `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Добавлено в версии: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, метод которого имитируется.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Идентификатор метода в `object`, который нужно имитировать. Если `object[methodName]` не является функцией, возникает ошибка.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Необязательная функция, используемая в качестве имитации реализации для `object[methodName]`. **По умолчанию:** исходный метод, указанный в `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательные параметры конфигурации для имитируемого метода. Поддерживаются следующие свойства:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `object[methodName]` рассматривается как геттер. Этот параметр нельзя использовать с параметром `setter`. **По умолчанию:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `object[methodName]` рассматривается как сеттер. Этот параметр нельзя использовать с параметром `getter`. **По умолчанию:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество раз, которое имитация будет использовать поведение `implementation`. После того, как имитируемый метод был вызван `times` раз, он автоматически восстановит исходное поведение. Это значение должно быть целым числом больше нуля. **По умолчанию:** `Infinity`.

- Возвращает: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Имитируемый метод. Имитируемый метод содержит специальное свойство `mock`, которое является экземпляром [`MockFunctionContext`](/ru/nodejs/api/test#class-mockfunctioncontext) и может использоваться для проверки и изменения поведения имитируемого метода.

Эта функция используется для создания имитации метода существующего объекта. В следующем примере показано, как создается имитация метода существующего объекта.

```js [ESM]
test('следит за методом объекта', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])` {#mockmodulespecifier-options}

**Добавлено в версии: v22.3.0, v20.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Строка, идентифицирующая модуль для подмены.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Дополнительные параметры конфигурации для подмены модуля. Поддерживаются следующие свойства:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `false`, каждый вызов `require()` или `import()` генерирует новый модуль-заглушку. Если `true`, последующие вызовы будут возвращать ту же заглушку модуля, и заглушка модуля будет вставлена в кэш CommonJS. **По умолчанию:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательное значение, используемое в качестве экспорта по умолчанию для заглушки модуля. Если это значение не предоставлено, заглушки ESM не включают экспорт по умолчанию. Если заглушка является модулем CommonJS или встроенным модулем, этот параметр используется в качестве значения `module.exports`. Если это значение не предоставлено, заглушки CJS и встроенные модули используют пустой объект в качестве значения `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный объект, чьи ключи и значения используются для создания именованных экспортов заглушки модуля. Если заглушка является модулем CommonJS или встроенным модулем, эти значения копируются в `module.exports`. Следовательно, если заглушка создана как с именованными экспортами, так и с экспортом по умолчанию, не являющимся объектом, заглушка вызовет исключение при использовании в качестве модуля CJS или встроенного модуля.
  
 
- Возвращает: [\<MockModuleContext\>](/ru/nodejs/api/test#class-mockmodulecontext) Объект, который можно использовать для управления заглушкой.

Эта функция используется для подмены экспорта модулей ECMAScript, модулей CommonJS и встроенных модулей Node.js. Любые ссылки на оригинальный модуль до подмены не затрагиваются. Чтобы включить подмену модулей, Node.js необходимо запустить с флагом командной строки [`--experimental-test-module-mocks`](/ru/nodejs/api/cli#--experimental-test-module-mocks).

В следующем примере показано, как создается заглушка для модуля.

```js [ESM]
test('подменяет встроенный модуль в обеих системах модулей', async (t) => {
  // Создайте заглушку 'node:readline' с именованным экспортом с именем 'fn', который
  // не существует в оригинальном модуле 'node:readline'.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() — это экспорт оригинального модуля 'node:readline'.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // Заглушка восстановлена, поэтому возвращается оригинальный встроенный модуль.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Добавлено в версии: v19.1.0, v18.13.0**

Эта функция восстанавливает поведение по умолчанию для всех макетов, которые были ранее созданы этим `MockTracker`, и разъединяет макеты от экземпляра `MockTracker`. После разъединения макеты все еще можно использовать, но экземпляр `MockTracker` больше нельзя использовать для сброса их поведения или иного взаимодействия с ними.

После завершения каждого теста эта функция вызывается в `MockTracker` контекста теста. Если глобальный `MockTracker` используется в значительной степени, рекомендуется вызывать эту функцию вручную.

### `mock.restoreAll()` {#mockrestoreall}

**Добавлено в версии: v19.1.0, v18.13.0**

Эта функция восстанавливает поведение по умолчанию для всех макетов, которые были ранее созданы этим `MockTracker`. В отличие от `mock.reset()`, `mock.restoreAll()` не разъединяет макеты от экземпляра `MockTracker`.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Добавлено в версии: v19.3.0, v18.13.0**

Эта функция является синтаксическим сахаром для [`MockTracker.method`](/ru/nodejs/api/test#mockmethodobject-methodname-implementation-options) с `options.setter`, установленным в `true`.

## Класс: `MockTimers` {#class-mocktimers}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.1.0 | Mock Timers теперь стабильны. |
| v20.4.0, v18.19.0 | Добавлено в версии: v20.4.0, v18.19.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Макеты таймеров - это техника, обычно используемая при тестировании программного обеспечения для имитации и контроля поведения таймеров, таких как `setInterval` и `setTimeout`, без фактического ожидания указанных временных интервалов.

MockTimers также может имитировать объект `Date`.

[`MockTracker`](/ru/nodejs/api/test#class-mocktracker) предоставляет экспорт `timers` верхнего уровня, который является экземпляром `MockTimers`.

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.2.0, v20.11.0 | Обновлены параметры, чтобы быть объектом опций с доступными API и начальной эпохой по умолчанию. |
| v20.4.0, v18.19.0 | Добавлено в версии: v20.4.0, v18.19.0 |
:::

Включает макет таймеров для указанных таймеров.

- `enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательные параметры конфигурации для включения макета таймеров. Поддерживаются следующие свойства:
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Необязательный массив, содержащий таймеры для имитации. В настоящее время поддерживаемые значения таймера: `'setInterval'`, `'setTimeout'`, `'setImmediate'` и `'Date'`. **По умолчанию:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Если массив не предоставлен, все связанные со временем API (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` и `'Date'`) будут смоделированы по умолчанию.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Необязательное число или объект Date, представляющий начальное время (в миллисекундах) для использования в качестве значения для `Date.now()`. **По умолчанию:** `0`.
  
 

**Примечание:** Когда вы включаете макет для определенного таймера, его связанная функция очистки также будет неявно смоделирована.

**Примечание:** Макет `Date` повлияет на поведение смоделированных таймеров, поскольку они используют одни и те же внутренние часы.

Пример использования без установки начального времени:



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

Приведенный выше пример включает макет для таймера `setInterval` и неявно имитирует функцию `clearInterval`. Только функции `setInterval` и `clearInterval` из [node:timers](/ru/nodejs/api/timers), [node:timers/promises](/ru/nodejs/api/timers#timers-promises-api) и `globalThis` будут смоделированы.

Пример использования с установленным начальным временем



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

Пример использования с начальным объектом Date в качестве установленного времени



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

В качестве альтернативы, если вы вызываете `mock.timers.enable()` без каких-либо параметров:

Все таймеры (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` и `'clearImmediate'`) будут смоделированы. Функции `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` и `clearImmediate` из `node:timers`, `node:timers/promises` и `globalThis` будут смоделированы. А также глобальный объект `Date`.


### `timers.reset()` {#timersreset}

**Добавлено в: v20.4.0, v18.19.0**

Эта функция восстанавливает поведение по умолчанию для всех макетов, которые были ранее созданы этим экземпляром `MockTimers`, и отвязывает макеты от экземпляра `MockTracker`.

**Примечание:** После завершения каждого теста эта функция вызывается в `MockTracker` контекста теста.

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#timerssymboldispose}

Вызывает `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Добавлено в: v20.4.0, v18.19.0**

Продвигает время для всех макетированных таймеров.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество времени в миллисекундах, на которое следует продвинуть таймеры. **По умолчанию:** `1`.

**Примечание:** Это отличается от того, как `setTimeout` ведет себя в Node.js, и принимает только положительные числа. В Node.js `setTimeout` с отрицательными числами поддерживается только из соображений совместимости с вебом.

В следующем примере создается макет функции `setTimeout`, и с помощью `.tick` продвигается время, запуская все ожидающие таймеры.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Альтернативно, функцию `.tick` можно вызвать много раз.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Продвижение времени с помощью `.tick` также продвинет время для любого объекта `Date`, созданного после включения макета (если также было настроено макетирование `Date`).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

#### Использование функций clear {#using-clear-functions}

Как упоминалось, все функции clear из таймеров (`clearTimeout`, `clearInterval` и `clearImmediate`) неявно маскируются. Взгляните на этот пример с использованием `setTimeout`:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Работа с модулями таймеров Node.js {#working-with-nodejs-timers-modules}

После включения маскировки таймеров, модули [node:timers](/ru/nodejs/api/timers), [node:timers/promises](/ru/nodejs/api/timers#timers-promises-api) и таймеры из глобального контекста Node.js включаются:

**Примечание:** Деструктуризация функций, таких как `import { setTimeout } from 'node:timers'`, в настоящее время не поддерживается этим API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

В Node.js `setInterval` из [node:timers/promises](/ru/nodejs/api/timers#timers-promises-api) является `AsyncGenerator` и также поддерживается этим API:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::


### `timers.runAll()` {#timersrunall}

**Добавлено в: v20.4.0, v18.19.0**

Немедленно запускает все ожидающие фиктивные таймеры. Если объект `Date` также является фиктивным, он также продвинет объект `Date` до времени самого дальнего таймера.

Пример ниже немедленно запускает все ожидающие таймеры, заставляя их выполняться без задержки.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll выполняет функции в заданном порядке', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Обратите внимание, что если оба таймера имеют одинаковый таймаут,
  // порядок выполнения гарантируется
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Объект Date также продвигается до времени самого дальнего таймера
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll выполняет функции в заданном порядке', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Обратите внимание, что если оба таймера имеют одинаковый таймаут,
  // порядок выполнения гарантируется
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Объект Date также продвигается до времени самого дальнего таймера
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**Примечание:** Функция `runAll()` специально разработана для запуска таймеров в контексте фиктивного тайминга. Она не оказывает никакого влияния на системные часы реального времени или фактические таймеры за пределами среды фиктивного тайминга.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Добавлено в: v21.2.0, v20.11.0**

Устанавливает текущую метку времени Unix, которая будет использоваться в качестве ссылки для любых фиктивных объектов `Date`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll выполняет функции в заданном порядке', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now не является фиктивным
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now теперь 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime заменяет текущее время', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now не является фиктивным
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now теперь 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### Взаимодействие Date и Timer {#dates-and-timers-working-together}

Объекты Date и timer зависят друг от друга. Если вы используете `setTime()` для передачи текущего времени смоделированному объекту `Date`, установленные таймеры с помощью `setTimeout` и `setInterval` **не** будут затронуты.

Однако метод `tick` **будет** продвигать смоделированный объект `Date`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Класс: `TestsStream` {#class-testsstream}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | добавлено type в события test:pass и test:fail, когда тест является набором тестов. |
| v18.9.0, v16.19.0 | Добавлено в: v18.9.0, v16.19.0 |
:::

- Расширяет [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Успешный вызов метода [`run()`](/ru/nodejs/api/test#runoptions) вернет новый объект [\<TestsStream\>](/ru/nodejs/api/test#class-testsstream), передающий серию событий, представляющих выполнение тестов. `TestsStream` будет генерировать события в порядке определения тестов.

Некоторые события гарантированно будут сгенерированы в том же порядке, что и определены тесты, в то время как другие генерируются в порядке выполнения тестов.


### Событие: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий отчет о покрытии кода.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив отчетов о покрытии для отдельных файлов. Каждый отчет представляет собой объект со следующей схемой:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный путь к файлу.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество строк.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество ветвлений.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество функций.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых строк.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых ветвлений.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых функций.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых строк.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых ветвлений.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых функций.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив функций, представляющий покрытие функций.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя функции.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер строки, где определена функция.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество вызовов функции.


    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив ветвлений, представляющий покрытие ветвлений.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер строки, где определено ветвление.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество прохождений ветвления.


    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив строк, представляющий номера строк и количество раз, когда они были покрыты.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Номер строки.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество раз, когда строка была покрыта.




    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий информацию о том, превышено ли пороговое значение покрытия для каждого типа покрытия.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Пороговое значение покрытия функций.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Пороговое значение покрытия ветвлений.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Пороговое значение покрытия строк.


    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий сводку покрытия для всех файлов.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество строк.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество ветвлений.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество функций.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых строк.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых ветвлений.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество покрытых функций.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых строк.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых ветвлений.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Процент покрытых функций.


    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Рабочий каталог, когда началось покрытие кода. Это полезно для отображения относительных имен путей в случае, если тесты изменили рабочий каталог процесса Node.js.


    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.



Вызывается, когда покрытие кода включено и все тесты завершены.


### Событие: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Дополнительные метаданные выполнения. 
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Пройден тест или нет.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность теста в миллисекундах.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ошибка, оборачивающая ошибку, выброшенную тестом, если он не пройден. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Фактическая ошибка, выброшенная тестом.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Тип теста, используемый для обозначения того, является ли это набором тестов (suite).
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порядковый номер теста.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.todo`](/ru/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.skip`](/ru/nodejs/api/test#contextskipmessage)
  
 

Срабатывает, когда тест завершает свое выполнение. Это событие не генерируется в том же порядке, в котором определены тесты. Соответствующие события, упорядоченные по декларации, это `'test:pass'` и `'test:fail'`.


### Событие: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.

 

Выдается, когда тест извлекается из очереди, непосредственно перед его выполнением. Не гарантируется, что это событие будет выдано в том же порядке, в котором определены тесты. Соответствующим событием, упорядоченным по объявлению, является `'test:start'`.

### Событие: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Диагностическое сообщение.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.

 

Выдается, когда вызывается [`context.diagnostic`](/ru/nodejs/api/test#contextdiagnosticmessage). Гарантируется, что это событие будет выдано в том же порядке, в котором определены тесты.


### Событие: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, в котором определен тест, или `undefined`, если тест был запущен через REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, в которой определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
  
 

Выбрасывается, когда тест помещается в очередь для выполнения.

### Событие: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, в котором определен тест, или `undefined`, если тест был запущен через REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Дополнительные метаданные выполнения. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность теста в миллисекундах.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ошибка, оборачивающая ошибку, выброшенную тестом. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Фактическая ошибка, выброшенная тестом.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Тип теста, используется для обозначения, является ли это набором тестов.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, в которой определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порядковый номер теста.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.todo`](/ru/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.skip`](/ru/nodejs/api/test#contextskipmessage)
  
 

Выбрасывается, когда тест завершается неудачей. Это событие гарантированно выбрасывается в том же порядке, в котором определены тесты. Соответствующим событием в порядке выполнения является `'test:complete'`.


### Событие: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Дополнительные метаданные выполнения.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность теста в миллисекундах.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Тип теста, используется для обозначения, является ли это набором тестов.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порядковый номер теста.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.todo`](/ru/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует, если вызван [`context.skip`](/ru/nodejs/api/test#contextskipmessage)
  
 

Сгенерировано, когда тест пройден. Это событие гарантированно генерируется в том же порядке, в котором определены тесты. Соответствующее упорядоченное по выполнению событие - `'test:complete'`.


### Event: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество запущенных подтестов.
  
 

Срабатывает, когда все подтесты завершены для данного теста. Гарантируется, что это событие будет сгенерировано в том же порядке, в котором определены тесты.

### Event: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер столбца, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, `undefined`, если тест был запущен через REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Номер строки, где определен тест, или `undefined`, если тест был запущен через REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя теста.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень вложенности теста.
  
 

Срабатывает, когда тест начинает сообщать о состоянии своего собственного теста и своих подтестов. Гарантируется, что это событие будет сгенерировано в том же порядке, в котором определены тесты. Соответствующее событие, упорядоченное по выполнению, — `'test:dequeue'`.


### Событие: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к файлу теста.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сообщение, записанное в `stderr`.

 

Срабатывает, когда запущенный тест записывает в `stderr`. Это событие срабатывает только в том случае, если передан флаг `--test`. Не гарантируется, что это событие будет срабатывать в том же порядке, в котором определены тесты.

### Событие: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к файлу теста.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сообщение, записанное в `stdout`.

 

Срабатывает, когда запущенный тест записывает в `stdout`. Это событие срабатывает только в том случае, если передан флаг `--test`. Не гарантируется, что это событие будет срабатывать в том же порядке, в котором определены тесты.

### Событие: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий счетчики различных результатов тестов.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество отмененных тестов.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество проваленных тестов.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество пройденных тестов.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество пропущенных тестов.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество запущенных наборов тестов (suites).
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество запущенных тестов, исключая наборы тестов (suites).
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество тестов TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общее количество тестов и наборов тестов верхнего уровня.
 

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность выполнения тестов в миллисекундах.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Путь к файлу теста, который сгенерировал сводку. Если сводка соответствует нескольким файлам, это значение будет `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, считается ли запуск тестов успешным или нет. Если возникает какое-либо условие ошибки, такое как сбой теста или невыполненный порог покрытия, это значение будет установлено в `false`.

 

Срабатывает при завершении выполнения тестов. Это событие содержит метрики, относящиеся к завершенному выполнению тестов, и полезно для определения того, пройден или не пройден запуск тестов. Если используется изоляция тестов на уровне процесса, событие `'test:summary'` генерируется для каждого файла теста в дополнение к итоговой совокупной сводке.


### Событие: `'test:watch:drained'` {#event-testwatchdrained}

Вызывается, когда в режиме наблюдения больше нет тестов, поставленных в очередь для выполнения.

## Класс: `TestContext` {#class-testcontext}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Функция `before` была добавлена в TestContext. |
| v18.0.0, v16.17.0 | Добавлено в: v18.0.0, v16.17.0 |
:::

Экземпляр `TestContext` передается каждой тестовой функции для взаимодействия с тестовым раннером. Однако конструктор `TestContext` не предоставляется как часть API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Добавлено в: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если хук использует колбэки, функция колбэка передается в качестве второго аргумента. **По умолчанию:** Функция бездействия.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, по истечении которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от своего родителя. **По умолчанию:** `Infinity`.

Эта функция используется для создания хука, выполняющегося перед подтестом текущего теста.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Добавлено в: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если хук использует колбэки, функция колбэка передается в качестве второго аргумента. **По умолчанию:** Функция бездействия.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, по истечении которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от своего родителя. **По умолчанию:** `Infinity`.

Эта функция используется для создания хука, выполняющегося перед каждым подтестом текущего теста.

```js [ESM]
test('top level test', async (t) => {
  t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Добавлено в версии: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если хук использует обратные вызовы, функция обратного вызова передается в качестве второго аргумента. **По умолчанию:** Функция без операций.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, после которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от родительского элемента. **По умолчанию:** `Infinity`.

Эта функция используется для создания хука, который выполняется после завершения текущего теста.

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Добавлено в версии: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Функция-хук. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если хук использует обратные вызовы, функция обратного вызова передается в качестве второго аргумента. **По умолчанию:** Функция без операций.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для хука. Поддерживаются следующие свойства:
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся хук.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, после которого хук завершится с ошибкой. Если не указано, подтесты наследуют это значение от родительского элемента. **По умолчанию:** `Infinity`.

Эта функция используется для создания хука, выполняющегося после каждого подтеста текущего теста.

```js [ESM]
test('top level test', async (t) => {
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```

### `context.assert` {#contextassert}

**Added in: v22.2.0, v20.15.0**

Объект, содержащий методы утверждений, привязанные к `context`. Функции верхнего уровня из модуля `node:assert` представлены здесь для создания планов тестирования.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Added in: v22.3.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение для сериализации в строку. Если Node.js был запущен с флагом [`--test-update-snapshots`](/ru/nodejs/api/cli#--test-update-snapshots), сериализованное значение записывается в файл снимка. В противном случае сериализованное значение сравнивается с соответствующим значением в существующем файле снимка.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Дополнительные параметры конфигурации. Поддерживаются следующие свойства:
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив синхронных функций, используемых для сериализации `value` в строку. `value` передается в качестве единственного аргумента первой функции сериализатора. Возвращаемое значение каждого сериализатора передается в качестве входных данных следующему сериализатору. После того, как все сериализаторы были запущены, результирующее значение приводится к строке. **Default:** Если сериализаторы не предоставлены, используются сериализаторы по умолчанию для средства запуска тестов.
  
 

Эта функция реализует утверждения для тестирования снимков.

```js [ESM]
test('snapshot test with default serialization', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('snapshot test with custom serialization', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Добавлено в: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сообщение для отчета.

Эта функция используется для записи диагностических данных в вывод. Любая диагностическая информация включается в конце результатов теста. Эта функция не возвращает значение.

```js [ESM]
test('top level test', (t) => {
  t.diagnostic('A diagnostic message');
});
```
### `context.filePath` {#contextfilepath}

**Добавлено в: v22.6.0, v20.16.0**

Абсолютный путь к файлу теста, который создал текущий тест. Если файл теста импортирует дополнительные модули, генерирующие тесты, импортированные тесты будут возвращать путь к корневому файлу теста.

### `context.fullName` {#contextfullname}

**Добавлено в: v22.3.0**

Имя теста и каждого из его предков, разделенных символом `\>`.

### `context.name` {#contextname}

**Добавлено в: v18.8.0, v16.18.0**

Имя теста.

### `context.plan(count)` {#contextplancount}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.4.0 | Эта функция больше не является экспериментальной. |
| v22.2.0, v20.15.0 | Добавлено в: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество утверждений и подтестов, которые должны быть выполнены.

Эта функция используется для установки количества утверждений и подтестов, которые должны быть выполнены в тесте. Если количество выполненных утверждений и подтестов не соответствует ожидаемому количеству, тест завершится неудачей.

```js [ESM]
test('top level test', (t) => {
  t.plan(2);
  t.assert.ok('some relevant assertion here');
  t.test('subtest', () => {});
});
```
При работе с асинхронным кодом функцию `plan` можно использовать для обеспечения выполнения правильного количества утверждений:

```js [ESM]
test('planning with streams', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

### `context.runOnly(shouldRunOnlyTests)` {#contextrunonlyshouldrunonlytests}

**Добавлено в версии: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли запускать только тесты с флагом `only`.

Если `shouldRunOnlyTests` имеет значение true, тестовый контекст будет запускать только тесты, у которых установлен параметр `only`. В противном случае будут запущены все тесты. Если Node.js не был запущен с опцией командной строки [`--test-only`](/ru/nodejs/api/cli#--test-only), эта функция не выполняет никаких действий.

```js [ESM]
test('top level test', (t) => {
  // Контекст теста можно настроить для запуска подтестов с опцией 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('this subtest is now skipped'),
    t.test('this subtest is run', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Добавлено в версии: v18.7.0, v16.17.0**

- Тип: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)

Может использоваться для прерывания подзадач теста, когда тест был прерван.

```js [ESM]
test('top level test', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Добавлено в версии: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательное сообщение о пропуске.

Эта функция указывает в выводе теста, что тест был пропущен. Если указано `message`, оно включается в вывод. Вызов `skip()` не прерывает выполнение тестовой функции. Эта функция не возвращает значение.

```js [ESM]
test('top level test', (t) => {
  // Обязательно вернитесь здесь, если тест содержит дополнительную логику.
  t.skip('this is skipped');
});
```
### `context.todo([message])` {#contexttodomessage}

**Добавлено в версии: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательное сообщение `TODO`.

Эта функция добавляет директиву `TODO` в вывод теста. Если указано `message`, оно включается в вывод. Вызов `todo()` не прерывает выполнение тестовой функции. Эта функция не возвращает значение.

```js [ESM]
test('top level test', (t) => {
  // Этот тест помечен как `TODO`
  t.todo('this is a todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.8.0, v16.18.0 | Добавлена опция `signal`. |
| v18.7.0, v16.17.0 | Добавлена опция `timeout`. |
| v18.0.0, v16.17.0 | Добавлено в: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя подтеста, которое отображается при сообщении результатов тестирования. **По умолчанию:** Свойство `name` для `fn` или `'\<anonymous\>'`, если у `fn` нет имени.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для подтеста. Поддерживаются следующие свойства:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Если указано число, то столько тестов будет выполняться параллельно в потоке приложения. Если `true`, то все подтесты будут выполняться параллельно. Если `false`, то будет выполняться только один тест за раз. Если не указано, подтесты наследуют это значение от родительского теста. **По умолчанию:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если истинно и контекст теста настроен на выполнение тестов `only`, то этот тест будет выполнен. В противном случае тест пропускается. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет прервать выполняющийся тест.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если истинно, тест пропускается. Если указана строка, эта строка отображается в результатах тестирования как причина пропуска теста. **По умолчанию:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если истинно, тест помечен как `TODO`. Если указана строка, эта строка отображается в результатах тестирования как причина, по которой тест является `TODO`. **По умолчанию:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, через которое тест завершится неудачей. Если не указано, подтесты наследуют это значение от родительского теста. **По умолчанию:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ожидаемое количество утверждений и подтестов, которые должны быть выполнены в тесте. Если количество утверждений, выполненных в тесте, не соответствует количеству, указанному в плане, тест завершится неудачей. **По умолчанию:** `undefined`.

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Тестируемая функция. Первым аргументом этой функции является объект [`TestContext`](/ru/nodejs/api/test#class-testcontext). Если тест использует обратные вызовы, функция обратного вызова передается в качестве второго аргумента. **По умолчанию:** Функция без операций.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается со значением `undefined` после завершения теста.

Эта функция используется для создания подтестов в рамках текущего теста. Эта функция ведет себя так же, как и функция верхнего уровня [`test()`](/ru/nodejs/api/test#testname-options-fn).

```js [ESM]
test('top level test', async (t) => {
  await t.test(
    'This is a subtest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('some relevant assertion here');
    },
  );
});
```

## Класс: `SuiteContext` {#class-suitecontext}

**Добавлено в: v18.7.0, v16.17.0**

Экземпляр `SuiteContext` передается каждой функции набора тестов для взаимодействия с исполнителем тестов. Однако конструктор `SuiteContext` не предоставляется как часть API.

### `context.filePath` {#contextfilepath_1}

**Добавлено в: v22.6.0**

Абсолютный путь к файлу теста, который создал текущий набор. Если файл теста импортирует дополнительные модули, которые генерируют наборы, импортированные наборы будут возвращать путь к корневому файлу теста.

### `context.name` {#contextname_1}

**Добавлено в: v18.8.0, v16.18.0**

Имя набора тестов.

### `context.signal` {#contextsignal_1}

**Добавлено в: v18.7.0, v16.17.0**

- Тип: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)

Может быть использован для прерывания подзадач теста, когда тест был прерван.

