---
title: Node.js 测试运行器
description: Node.js 测试运行器模块为在 Node.js 应用程序中编写和运行测试提供了一个内置的解决方案。它支持多种测试格式，覆盖率报告，并与流行的测试框架集成。
head:
  - - meta
    - name: og:title
      content: Node.js 测试运行器 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 测试运行器模块为在 Node.js 应用程序中编写和运行测试提供了一个内置的解决方案。它支持多种测试格式，覆盖率报告，并与流行的测试框架集成。
  - - meta
    - name: twitter:title
      content: Node.js 测试运行器 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 测试运行器模块为在 Node.js 应用程序中编写和运行测试提供了一个内置的解决方案。它支持多种测试格式，覆盖率报告，并与流行的测试框架集成。
---


# 测试运行器 {#test-runner}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在是稳定的。 |
| v18.0.0, v16.17.0 | 添加于: v18.0.0, v16.17.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

`node:test` 模块有助于创建 JavaScript 测试。 要访问它：

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

此模块仅在 `node:` 方案下可用。

通过 `test` 模块创建的测试由一个单独的函数组成，该函数通过以下三种方式之一进行处理：

以下示例说明了如何使用 `test` 模块编写测试。

```js [ESM]
test('同步通过测试', (t) => {
  // 此测试通过，因为它没有抛出异常。
  assert.strictEqual(1, 1);
});

test('同步失败测试', (t) => {
  // 此测试失败，因为它抛出了异常。
  assert.strictEqual(1, 2);
});

test('异步通过测试', async (t) => {
  // 此测试通过，因为异步函数返回的 Promise
  // 已解决而不是被拒绝。
  assert.strictEqual(1, 1);
});

test('异步失败测试', async (t) => {
  // 此测试失败，因为异步函数返回的 Promise
  // 被拒绝。
  assert.strictEqual(1, 2);
});

test('使用 Promise 的失败测试', (t) => {
  // Promise 也可以直接使用。
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('这将导致测试失败'));
    });
  });
});

test('回调通过测试', (t, done) => {
  // done() 是回调函数。 当 setImmediate() 运行时，它会调用
  // 不带参数的 done()。
  setImmediate(done);
});

test('回调失败测试', (t, done) => {
  // 当 setImmediate() 运行时，将使用 Error 对象调用 done() 并且
  // 测试失败。
  setImmediate(() => {
    done(new Error('回调失败'));
  });
});
```
如果任何测试失败，进程退出码将设置为 `1`。


## 子测试 {#subtests}

测试上下文的 `test()` 方法允许创建子测试。它允许你以分层的方式组织测试，你可以在更大的测试中创建嵌套的测试。此方法的行为与顶层 `test()` 函数完全相同。以下示例演示了如何创建一个包含两个子测试的顶层测试。

```js [ESM]
test('顶层测试', async (t) => {
  await t.test('子测试 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('子测试 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
在这个例子中，`await` 用于确保两个子测试都已完成。这是必要的，因为测试不会像在套件中创建的测试那样等待其子测试完成。当父测试完成时，任何仍在执行的子测试都会被取消并被视为失败。任何子测试的失败都会导致父测试失败。

## 跳过测试 {#skipping-tests}

可以通过将 `skip` 选项传递给测试，或者调用测试上下文的 `skip()` 方法来跳过单个测试，如下例所示。

```js [ESM]
// 使用 skip 选项，但未提供消息。
test('skip 选项', { skip: true }, (t) => {
  // 此代码永远不会被执行。
});

// 使用 skip 选项，并提供了一条消息。
test('带消息的 skip 选项', { skip: '这将被跳过' }, (t) => {
  // 此代码永远不会被执行。
});

test('skip() 方法', (t) => {
  // 如果测试包含其他逻辑，请确保在此处返回。
  t.skip();
});

test('带消息的 skip() 方法', (t) => {
  // 如果测试包含其他逻辑，请确保在此处返回。
  t.skip('这将被跳过');
});
```
## TODO 测试 {#todo-tests}

可以通过将 `todo` 选项传递给测试，或者调用测试上下文的 `todo()` 方法，将单个测试标记为不稳定或不完整，如下例所示。这些测试代表需要修复的待定实现或错误。TODO 测试会被执行，但不被视为测试失败，因此不会影响进程退出代码。如果一个测试同时被标记为 TODO 和跳过，则 TODO 选项将被忽略。

```js [ESM]
// 使用 todo 选项，但未提供消息。
test('todo 选项', { todo: true }, (t) => {
  // 此代码会被执行，但不被视为失败。
  throw new Error('这不会使测试失败');
});

// 使用 todo 选项，并提供了一条消息。
test('带消息的 todo 选项', { todo: '这是一个 todo 测试' }, (t) => {
  // 此代码会被执行。
});

test('todo() 方法', (t) => {
  t.todo();
});

test('带消息的 todo() 方法', (t) => {
  t.todo('这是一个 todo 测试，不会被视为失败');
  throw new Error('这不会使测试失败');
});
```

## `describe()` 和 `it()` 别名 {#describe-and-it-aliases}

套件和测试也可以使用 `describe()` 和 `it()` 函数编写。[`describe()`](/zh/nodejs/api/test#describename-options-fn) 是 [`suite()`](/zh/nodejs/api/test#suitename-options-fn) 的别名，并且 [`it()`](/zh/nodejs/api/test#itname-options-fn) 是 [`test()`](/zh/nodejs/api/test#testname-options-fn) 的别名。

```js [ESM]
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` 和 `it()` 从 `node:test` 模块导入。



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only` 测试 {#only-tests}

如果 Node.js 使用 [`--test-only`](/zh/nodejs/api/cli#--test-only) 命令行选项启动，或者测试隔离已禁用，则可以通过将 `only` 选项传递给应运行的测试，来跳过除选定子集之外的所有测试。 当设置了带有 `only` 选项的测试时，也会运行所有子测试。 如果套件设置了 `only` 选项，则将运行套件中的所有测试，除非它有设置了 `only` 选项的后代，在这种情况下仅运行那些测试。

当在 `test()`/`it()` 中使用 [子测试](/zh/nodejs/api/test#subtests) 时，需要使用 `only` 选项标记所有祖先测试，才能仅运行选定的测试子集。

测试上下文的 `runOnly()` 方法可用于在子测试级别实现相同的行为。 未执行的测试将从测试运行器输出中省略。

```js [ESM]
// 假设 Node.js 使用 --test-only 命令行选项运行。
// 设置了套件的 'only' 选项，因此运行这些测试。
test('this test is run', { only: true }, async (t) => {
  // 在此测试中，默认情况下运行所有子测试。
  await t.test('running subtest');

  // 可以更新测试上下文以运行带有 'only' 选项的子测试。
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // 将上下文切换回执行所有测试。
  t.runOnly(false);
  await t.test('this subtest is now run');

  // 显式不运行这些测试。
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// 未设置 'only' 选项，因此跳过此测试。
test('this test is not run', () => {
  // 不运行此代码。
  throw new Error('fail');
});

describe('a suite', () => {
  // 设置了 'only' 选项，因此运行此测试。
  it('this test is run', { only: true }, () => {
    // 运行此代码。
  });

  it('this test is not run', () => {
    // 不运行此代码。
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // 设置了 'only' 选项，因此运行此测试。
  it('this test is run', () => {
    // 运行此代码。
  });

  it('this test is run', () => {
    // 运行此代码。
  });
});
```

## 按名称过滤测试 {#filtering-tests-by-name}

[`--test-name-pattern`](/zh/nodejs/api/cli#--test-name-pattern) 命令行选项可用于仅运行名称与提供的模式匹配的测试，[`--test-skip-pattern`](/zh/nodejs/api/cli#--test-skip-pattern) 选项可用于跳过名称与提供的模式匹配的测试。 测试名称模式被解释为 JavaScript 正则表达式。 可以多次指定 `--test-name-pattern` 和 `--test-skip-pattern` 选项以运行嵌套测试。 对于执行的每个测试，也会运行任何相应的测试钩子，例如 `beforeEach()`。 未执行的测试将从测试运行程序输出中省略。

给定以下测试文件，使用 `--test-name-pattern="test [1-3]"` 选项启动 Node.js 将导致测试运行程序执行 `test 1`、`test 2` 和 `test 3`。 如果 `test 1` 与测试名称模式不匹配，则即使其子测试与模式匹配，也不会执行。 也可以通过多次传递 `--test-name-pattern` 来执行相同的测试集（例如 `--test-name-pattern="test 1"`，`--test-name-pattern="test 2"` 等）。

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
测试名称模式也可以使用正则表达式字面量指定。 这允许使用正则表达式标志。 在前面的示例中，使用 `--test-name-pattern="/test [4-5]/i"`（或 `--test-skip-pattern="/test [4-5]/i"`) 启动 Node.js 将匹配 `Test 4` 和 `Test 5`，因为该模式不区分大小写。

要使用模式匹配单个测试，您可以将所有祖先测试名称用空格分隔作为其前缀，以确保它是唯一的。 例如，给定以下测试文件：

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
使用 `--test-name-pattern="test 1 some test"` 启动 Node.js 将仅匹配 `test 1` 中的 `some test`。

测试名称模式不会更改测试运行程序执行的文件集。

如果同时提供 `--test-name-pattern` 和 `--test-skip-pattern`，则测试必须满足**两个**要求才能执行。


## 额外的异步活动 {#extraneous-asynchronous-activity}

一旦测试函数执行完毕，结果会以最快的速度报告，同时保持测试的顺序。但是，测试函数有可能生成超出测试本身范围的异步活动。测试运行器会处理此类活动，但不会为了容纳它而延迟测试结果的报告。

在下面的示例中，一个测试完成时，仍有两项 `setImmediate()` 操作未完成。第一个 `setImmediate()` 尝试创建一个新的子测试。由于父测试已经完成并输出了其结果，因此新的子测试会立即被标记为失败，并稍后报告给 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream)。

第二个 `setImmediate()` 创建一个 `uncaughtException` 事件。源自已完成测试的 `uncaughtException` 和 `unhandledRejection` 事件会被 `test` 模块标记为失败，并作为顶级诊断警告由 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream) 报告。

```js [ESM]
test('一个产生异步活动的测试', (t) => {
  setImmediate(() => {
    t.test('创建得太晚的子测试', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // 测试在此行之后完成。
});
```
## 监听模式 {#watch-mode}

**添加于: v19.2.0, v18.13.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

Node.js 测试运行器支持通过传递 `--watch` 标志在监听模式下运行：

```bash [BASH]
node --test --watch
```
在监听模式下，测试运行器将监视测试文件及其依赖项的更改。当检测到更改时，测试运行器将重新运行受更改影响的测试。测试运行器将继续运行，直到进程终止。

## 从命令行运行测试 {#running-tests-from-the-command-line}

Node.js 测试运行器可以通过传递 [`--test`](/zh/nodejs/api/cli#--test) 标志从命令行调用：

```bash [BASH]
node --test
```
默认情况下，Node.js 将运行与以下模式匹配的所有文件：

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

当提供 [`--experimental-strip-types`](/zh/nodejs/api/cli#--experimental-strip-types) 时，将匹配以下附加模式：

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

或者，可以提供一个或多个 glob 模式作为 Node.js 命令的最终参数，如下所示。Glob 模式遵循 [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7) 的行为。glob 模式应使用双引号括起来，以防止 shell 扩展，这可以降低跨系统的可移植性。

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
匹配的文件将作为测试文件执行。有关测试文件执行的更多信息，请参见 [测试运行器执行模型](/zh/nodejs/api/test#test-runner-execution-model) 部分。


### 测试运行器执行模型 {#test-runner-execution-model}

当启用进程级测试隔离时，每个匹配的测试文件都会在一个独立的子进程中执行。同时运行的子进程的最大数量由 [`--test-concurrency`](/zh/nodejs/api/cli#--test-concurrency) 标志控制。如果子进程以退出代码 0 结束，则该测试被认为是通过的。否则，该测试被认为是失败的。测试文件必须可由 Node.js 执行，但不需要在内部使用 `node:test` 模块。

每个测试文件的执行方式都像是一个常规脚本。也就是说，如果测试文件本身使用 `node:test` 来定义测试，那么所有这些测试都将在一个应用程序线程中执行，而不管 [`test()`](/zh/nodejs/api/test#testname-options-fn) 的 `concurrency` 选项的值如何。

当禁用进程级测试隔离时，每个匹配的测试文件都会被导入到测试运行器进程中。一旦所有测试文件都被加载，顶层测试将以并发度 1 执行。由于所有测试文件都在同一个上下文中运行，因此测试之间可能以启用隔离时不可能的方式进行交互。例如，如果一个测试依赖于全局状态，则该状态可能被来自另一个文件的测试所修改。

## 收集代码覆盖率 {#collecting-code-coverage}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

当使用 [`--experimental-test-coverage`](/zh/nodejs/api/cli#--experimental-test-coverage) 命令行标志启动 Node.js 时，将收集代码覆盖率，并在所有测试完成后报告统计信息。如果使用 [`NODE_V8_COVERAGE`](/zh/nodejs/api/cli#node_v8_coveragedir) 环境变量来指定代码覆盖率目录，则生成的 V8 覆盖率文件将被写入该目录。默认情况下，Node.js 核心模块和 `node_modules/` 目录中的文件不包含在覆盖率报告中。但是，可以通过 [`--test-coverage-include`](/zh/nodejs/api/cli#--test-coverage-include) 标志显式包含它们。默认情况下，所有匹配的测试文件都将从覆盖率报告中排除。可以使用 [`--test-coverage-exclude`](/zh/nodejs/api/cli#--test-coverage-exclude) 标志覆盖排除项。如果启用了覆盖率，则覆盖率报告将通过 `'test:coverage'` 事件发送到任何 [测试报告器](/zh/nodejs/api/test#test-reporters)。

可以使用以下注释语法在一系列行上禁用覆盖率：

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // 此分支中的代码永远不会被执行，但这些行会被忽略以用于
  // 覆盖率目的。 'disable' 注释之后的所有行都将被忽略
  // 直到遇到相应的 'enable' 注释。
  console.log('this is never executed');
}
/* node:coverage enable */
```
还可以为指定数量的行禁用覆盖率。在指定的行数之后，覆盖率将自动重新启用。如果未明确提供行数，则忽略单行。

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### 覆盖率报告器 {#coverage-reporters}

`tap` 和 `spec` 报告器会打印覆盖率统计信息的摘要。 还有一个 `lcov` 报告器，它会生成一个 `lcov` 文件，该文件可用作深入的覆盖率报告。

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- 此报告器不报告任何测试结果。
- 理想情况下，此报告器应与另一个报告器一起使用。

## 模拟 {#mocking}

`node:test` 模块通过顶层的 `mock` 对象支持在测试期间进行模拟。 以下示例创建了一个 spy，用于监视一个将两个数字相加的函数。 然后使用 spy 来断言该函数已按预期调用。

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

相同的模拟功能也暴露在每个测试的 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象上。 以下示例使用 `TestContext` 上公开的 API 在对象方法上创建一个 spy。 通过测试上下文进行模拟的好处是，测试运行器将在测试完成后自动恢复所有模拟功能。

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

### 定时器 {#timers}

模拟定时器是一种软件测试中常用的技术，用于模拟和控制定时器的行为，例如 `setInterval` 和 `setTimeout`，而无需实际等待指定的时间间隔。

有关方法和功能的完整列表，请参阅 [`MockTimers`](/zh/nodejs/api/test#class-mocktimers) 类。

这允许开发人员为时间相关的功能编写更可靠和可预测的测试。

下面的示例展示了如何模拟 `setTimeout`。使用 `.enable({ apis: ['setTimeout'] });` 将模拟 [node:timers](/zh/nodejs/api/timers) 和 [node:timers/promises](/zh/nodejs/api/timers#timers-promises-api) 模块以及 Node.js 全局上下文中的 `setTimeout` 函数。

**注意：** 此 API 目前不支持解构函数，例如 `import { setTimeout } from 'node:timers'`。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('模拟 setTimeout 以同步执行，而无需实际等待', () => {
  const fn = mock.fn();

  // 可选地选择要模拟的内容
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 前进一段时间
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // 重置全局跟踪的模拟。
  mock.timers.reset();

  // 如果你调用 reset mock 实例，它也会重置 timers 实例
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('模拟 setTimeout 以同步执行，而无需实际等待', () => {
  const fn = mock.fn();

  // 可选地选择要模拟的内容
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 前进一段时间
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // 重置全局跟踪的模拟。
  mock.timers.reset();

  // 如果你调用 reset mock 实例，它也会重置 timers 实例
  mock.reset();
});
```
:::

相同的模拟功能也暴露在每个测试的 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象的 mock 属性中。通过测试上下文进行模拟的好处是，一旦测试完成，测试运行器将自动恢复所有模拟的定时器功能。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('模拟 setTimeout 以同步执行，而无需实际等待', (context) => {
  const fn = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 前进一段时间
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('模拟 setTimeout 以同步执行，而无需实际等待', (context) => {
  const fn = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 前进一段时间
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::


### 日期 {#dates}

模拟定时器 API 也允许模拟 `Date` 对象。这对于测试时间相关的功能，或者模拟内部日历功能（如 `Date.now()`）非常有用。

日期实现也是 [`MockTimers`](/zh/nodejs/api/test#class-mocktimers) 类的一部分。请参考该类以获取完整的方法和特性列表。

**注意：** 当日期和定时器一起被模拟时，它们是相互依赖的。这意味着如果您同时模拟了 `Date` 和 `setTimeout`，则推进时间也会推进模拟的日期，因为它们模拟的是同一个内部时钟。

下面的示例展示了如何模拟 `Date` 对象并获取当前的 `Date.now()` 值。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

如果没有设置初始纪元时间，则初始日期将基于 Unix 纪元中的 0。也就是 UTC 时间 1970 年 1 月 1 日 00:00:00。您可以通过将 `now` 属性传递给 `.enable()` 方法来设置初始日期。此值将用作模拟 `Date` 对象的初始日期。它可以是正整数，也可以是另一个 Date 对象。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

您可以使用 `.setTime()` 方法手动将模拟日期移动到另一个时间。此方法仅接受正整数。

**注意：** 此方法将执行从新时间开始所有过去的模拟定时器。

在下面的示例中，我们为模拟日期设置了一个新时间。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

如果您有任何定时器设置为在过去运行，它将被执行，就像调用了 `.tick()` 方法一样。如果您想测试已经在过去的时间相关的功能，这将非常有用。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

使用 `.runAll()` 将执行当前队列中的所有定时器。 这也会将模拟日期推进到最后一个被执行的定时器的时间，就像时间已经过去一样。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## 快照测试 {#snapshot-testing}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性：1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

快照测试允许将任意值序列化为字符串值，并与一组已知的良好值进行比较。 这些已知的良好值称为快照，并存储在快照文件中。 快照文件由测试运行器管理，但设计为人类可读，以帮助进行调试。 最佳实践是将快照文件与您的测试文件一起检入到源代码控制中。

快照文件通过使用 [`--test-update-snapshots`](/zh/nodejs/api/cli#--test-update-snapshots) 命令行标志启动 Node.js 来生成。 为每个测试文件生成一个单独的快照文件。 默认情况下，快照文件与测试文件同名，但文件扩展名为 `.snapshot`。 可以使用 `snapshot.setResolveSnapshotPath()` 函数配置此行为。 每个快照断言都对应于快照文件中的一个导出。

下面显示了一个快照测试示例。 第一次执行此测试时，它将失败，因为相应的快照文件不存在。

```js [ESM]
// test.js
suite('快照测试套件', () => {
  test('快照测试', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
通过使用 `--test-update-snapshots` 运行测试文件来生成快照文件。 测试应该通过，并且会在与测试文件相同的目录中创建一个名为 `test.js.snapshot` 的文件。 快照文件的内容如下所示。 每个快照都由测试的完整名称和一个计数器标识，以区分同一测试中的快照。

```js [ESM]
exports[`快照测试套件 > 快照测试 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`快照测试套件 > 快照测试 2`] = `
5
`;
```
创建快照文件后，再次运行测试，不带 `--test-update-snapshots` 标志。 现在测试应该通过。


## 测试报告器 {#test-reporters}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.9.0, v18.17.0 | 报告器现在暴露在 `node:test/reporters` 中。 |
| v19.6.0, v18.15.0 | 添加于：v19.6.0, v18.15.0 |
:::

`node:test` 模块支持传递 [`--test-reporter`](/zh/nodejs/api/cli#--test-reporter) 标志，以便测试运行器使用特定的报告器。

支持以下内置报告器：

- `spec` `spec` 报告器以人类可读的格式输出测试结果。 这是默认报告器。
- `tap` `tap` 报告器以 [TAP](https://testanything.org/) 格式输出测试结果。
- `dot` `dot` 报告器以紧凑的格式输出测试结果，其中每个通过的测试都用 `.` 表示，每个失败的测试都用 `X` 表示。
- `junit` junit 报告器以 jUnit XML 格式输出测试结果
- `lcov` 当与 [`--experimental-test-coverage`](/zh/nodejs/api/cli#--experimental-test-coverage) 标志一起使用时，`lcov` 报告器输出测试覆盖率。

这些报告器的确切输出可能会在 Node.js 版本之间发生变化，不应以编程方式依赖。 如果需要以编程方式访问测试运行器的输出，请使用 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream) 发出的事件。

这些报告器可以通过 `node:test/reporters` 模块获得：

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### 自定义报告器 {#custom-reporters}

[`--test-reporter`](/zh/nodejs/api/cli#--test-reporter) 可用于指定自定义报告器的路径。 自定义报告器是一个模块，它导出一个被 [stream.compose](/zh/nodejs/api/stream#streamcomposestreams) 接受的值。 报告器应该转换 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream) 发出的事件

以下是使用 [\<stream.Transform\>](/zh/nodejs/api/stream#class-streamtransform) 的自定义报告器示例：

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

以下是使用生成器函数的自定义报告器示例：

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

提供给 `--test-reporter` 的值应该是一个字符串，就像 JavaScript 代码中的 `import()` 中使用的字符串一样，或者是一个为 [`--import`](/zh/nodejs/api/cli#--importmodule) 提供的值。


### 多个报告器 {#multiple-reporters}

可以多次指定 [`--test-reporter`](/zh/nodejs/api/cli#--test-reporter) 标志，以多种格式报告测试结果。在这种情况下，需要使用 [`--test-reporter-destination`](/zh/nodejs/api/cli#--test-reporter-destination) 为每个报告器指定一个目标。目标可以是 `stdout`、`stderr` 或文件路径。报告器和目标根据指定的顺序配对。

在以下示例中，`spec` 报告器将输出到 `stdout`，而 `dot` 报告器将输出到 `file.txt`：

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
当仅指定一个报告器时，目标将默认为 `stdout`，除非显式提供目标。

## `run([options])` {#runoptions}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 添加了 `cwd` 选项。 |
| v23.0.0 | 添加了覆盖率选项。 |
| v22.8.0 | 添加了 `isolation` 选项。 |
| v22.6.0 | 添加了 `globPatterns` 选项。 |
| v22.0.0, v20.14.0 | 添加了 `forceExit` 选项。 |
| v20.1.0, v18.17.0 | 添加了 testNamePatterns 选项。 |
| v18.9.0, v16.19.0 | 添加于：v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 运行测试的配置选项。支持以下属性：
    - `concurrency` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 如果提供一个数字，那么将并行运行这么多测试进程，其中每个进程对应一个测试文件。 如果为 `true`，它将并行运行 `os.availableParallelism() - 1` 个测试文件。 如果为 `false`，它将一次只运行一个测试文件。 **默认值:** `false`。
    - `cwd`: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 指定测试运行器要使用的当前工作目录。 用作根据 [测试运行器执行模型](/zh/nodejs/api/test#test-runner-execution-model) 解析文件的基本路径。 **默认值:** `process.cwd()`。
    - `files`: [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含要运行的文件列表的数组。 **默认值:** 来自 [测试运行器执行模型](/zh/nodejs/api/test#test-runner-execution-model) 的匹配文件。
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 配置测试运行器在所有已知测试完成执行后退出进程，即使事件循环原本会保持活动状态。 **默认值:** `false`。
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含要匹配测试文件的 glob 模式列表的数组。 此选项不能与 `files` 一起使用。 **默认值:** 来自 [测试运行器执行模型](/zh/nodejs/api/test#test-runner-execution-model) 的匹配文件。
    - `inspectPort` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 设置测试子进程的检查器端口。 这可以是一个数字，也可以是一个不带参数并返回数字的函数。 如果提供一个空值，则每个进程都会获得自己的端口，从主进程的 `process.debugPort` 递增。 如果 `isolation` 选项设置为 `'none'`，则会忽略此选项，因为不会生成任何子进程。 **默认值:** `undefined`。
    - `isolation` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 配置测试隔离的类型。 如果设置为 `'process'`，则每个测试文件都在单独的子进程中运行。 如果设置为 `'none'`，则所有测试文件都在当前进程中运行。 **默认值:** `'process'`。
    - `only`: [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为真值，则测试上下文将仅运行设置了 `only` 选项的测试
    - `setup` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 接受 `TestsStream` 实例的函数，可用于在运行任何测试之前设置监听器。 **默认值:** `undefined`。
    - `execArgv` [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 在生成子进程时传递给 `node` 可执行文件的 CLI 标志数组。 当 `isolation` 为 `'none'` 时，此选项无效。 **默认值:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 在生成子进程时传递给每个测试文件的 CLI 标志数组。 当 `isolation` 为 `'none'` 时，此选项无效。 **默认值:** `[]`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的测试执行。
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个字符串、RegExp 或 RegExp 数组，可用于仅运行名称与提供的模式匹配的测试。 测试名称模式被解释为 JavaScript 正则表达式。 对于执行的每个测试，也会运行任何相应的测试钩子，例如 `beforeEach()`。 **默认值:** `undefined`。
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个字符串、RegExp 或 RegExp 数组，可用于排除运行名称与提供的模式匹配的测试。 测试名称模式被解释为 JavaScript 正则表达式。 对于执行的每个测试，也会运行任何相应的测试钩子，例如 `beforeEach()`。 **默认值:** `undefined`。
    - `timeout` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 测试执行失败后的毫秒数。 如果未指定，则子测试从此父测试继承此值。 **默认值:** `Infinity`。
    - `watch` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 是否在监视模式下运行。 **默认值:** `false`。
    - `shard` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 在特定分片中运行测试。 **默认值:** `undefined`。
        - `index` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 是介于 1 和 `\<total\>` 之间的正整数，指定要运行的分片的索引。 此选项是*必需的*。
        - `total` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 是一个正整数，指定将测试文件拆分成的分片总数。 此选项是*必需的*。
  
 
    - `coverage` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 启用 [代码覆盖率](/zh/nodejs/api/test#collecting-code-coverage) 收集。 **默认值:** `false`。
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 使用 glob 模式从代码覆盖率中排除特定文件，该模式可以匹配绝对和相对文件路径。 此属性仅在 `coverage` 设置为 `true` 时适用。 如果同时提供了 `coverageExcludeGlobs` 和 `coverageIncludeGlobs`，则文件必须满足**两个**标准才能包含在覆盖率报告中。 **默认值:** `undefined`。
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 使用 glob 模式在代码覆盖率中包含特定文件，该模式可以匹配绝对和相对文件路径。 此属性仅在 `coverage` 设置为 `true` 时适用。 如果同时提供了 `coverageExcludeGlobs` 和 `coverageIncludeGlobs`，则文件必须满足**两个**标准才能包含在覆盖率报告中。 **默认值:** `undefined`。
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 需要覆盖行的最小百分比。 如果代码覆盖率未达到指定的阈值，则该过程将以代码 `1` 退出。 **默认值:** `0`。
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 需要覆盖分支的最小百分比。 如果代码覆盖率未达到指定的阈值，则该过程将以代码 `1` 退出。 **默认值:** `0`。
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 需要覆盖函数的最小百分比。 如果代码覆盖率未达到指定的阈值，则该过程将以代码 `1` 退出。 **默认值:** `0`。
  
 
- 返回: [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream)

**注意:** `shard` 用于跨机器或进程水平并行化测试运行，非常适合跨各种环境的大规模执行。 它与 `watch` 模式不兼容，后者通过在文件更改时自动重新运行测试来为快速代码迭代量身定制。

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

**添加于: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套件的名称，在报告测试结果时显示。**默认:** `fn` 的 `name` 属性，如果 `fn` 没有名称，则为 `'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 套件的可选配置选项。这支持与 `test([name][, options][, fn])` 相同的选项。
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 声明嵌套测试和套件的套件函数。此函数的第一个参数是 [`SuiteContext`](/zh/nodejs/api/test#class-suitecontext) 对象。**默认:** 一个空操作函数。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 立即解析为 `undefined`。

`suite()` 函数从 `node:test` 模块导入。

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**添加于: v22.0.0, v20.13.0**

跳过套件的简写。这与 [`suite([name], { skip: true }[, fn])`](/zh/nodejs/api/test#suitename-options-fn) 相同。

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**添加于: v22.0.0, v20.13.0**

将套件标记为 `TODO` 的简写。这与 [`suite([name], { todo: true }[, fn])`](/zh/nodejs/api/test#suitename-options-fn) 相同。

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**添加于: v22.0.0, v20.13.0**

将套件标记为 `only` 的简写。这与 [`suite([name], { only: true }[, fn])`](/zh/nodejs/api/test#suitename-options-fn) 相同。

## `test([name][, options][, fn])` {#testname-options-fn}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v20.2.0, v18.17.0 | 添加了 `skip`、`todo` 和 `only` 简写。 |
| v18.8.0, v16.18.0 | 添加了 `signal` 选项。 |
| v18.7.0, v16.17.0 | 添加了 `timeout` 选项。 |
| v18.0.0, v16.17.0 | 添加于: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试的名称，在报告测试结果时显示。**默认:** `fn` 的 `name` 属性，如果 `fn` 没有名称，则为 `'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 测试的配置选项。支持以下属性：
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果提供一个数字，则在应用程序线程中并行运行这么多测试。 如果为 `true`，则所有计划的异步测试都在线程中并发运行。 如果为 `false`，则一次只运行一个测试。 如果未指定，则子测试从其父级继承此值。 **默认:** `false`。
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为真值，并且测试上下文配置为仅运行 `only` 测试，则将运行此测试。 否则，将跳过该测试。 **默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的测试。
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为真值，则跳过该测试。 如果提供一个字符串，则该字符串将显示在测试结果中，作为跳过测试的原因。 **默认:** `false`。
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为真值，则该测试标记为 `TODO`。 如果提供一个字符串，则该字符串将显示在测试结果中，作为测试为 `TODO` 的原因。 **默认:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试将在多少毫秒后失败。 如果未指定，则子测试从其父级继承此值。 **默认:** `Infinity`。
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 期望在测试中运行的断言和子测试的数量。 如果测试中运行的断言数量与计划中指定的数量不匹配，则测试将失败。 **默认:** `undefined`。

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 被测函数。 此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。 如果测试使用回调，则回调函数作为第二个参数传递。 **默认:** 一个空操作函数。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一旦测试完成，则解析为 `undefined`，如果测试在套件中运行，则立即解析。

`test()` 函数是从 `test` 模块导入的值。 每次调用此函数都会导致将测试报告给 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream)。

传递给 `fn` 参数的 `TestContext` 对象可用于执行与当前测试相关的操作。 示例包括跳过测试、添加其他诊断信息或创建子测试。

`test()` 返回一个 `Promise`，该 `Promise` 在测试完成后解析。 如果在套件中调用 `test()`，它会立即解析。 通常可以丢弃顶级测试的返回值。 但是，应该使用子测试的返回值，以防止父测试首先完成并取消子测试，如下例所示。

```js [ESM]
test('顶级测试', async (t) => {
  // 如果删除下一行中的 'await'，则以下子测试中的 setTimeout() 将导致它比其父测试存活更长时间。 一旦父测试
  // 完成，它将取消任何未完成的子测试。
  await t.test('长时间运行的子测试', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
如果测试花费的时间超过 `timeout` 毫秒才能完成，则可以使用 `timeout` 选项使测试失败。 但是，它不是取消测试的可靠机制，因为正在运行的测试可能会阻塞应用程序线程，从而阻止计划的取消。


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

跳过测试的简写形式，与 [`test([name], { skip: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

将测试标记为 `TODO` 的简写形式，与 [`test([name], { todo: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

将测试标记为 `only` 的简写形式，与 [`test([name], { only: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。

## `describe([name][, options][, fn])` {#describename-options-fn}

[`suite()`](/zh/nodejs/api/test#suitename-options-fn) 的别名。

`describe()` 函数从 `node:test` 模块导入。

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

跳过测试套件的简写形式。与 [`describe([name], { skip: true }[, fn])`](/zh/nodejs/api/test#describename-options-fn) 相同。

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

将测试套件标记为 `TODO` 的简写形式。与 [`describe([name], { todo: true }[, fn])`](/zh/nodejs/api/test#describename-options-fn) 相同。

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**添加于: v19.8.0, v18.15.0**

将测试套件标记为 `only` 的简写形式。与 [`describe([name], { only: true }[, fn])`](/zh/nodejs/api/test#describename-options-fn) 相同。

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.8.0, v18.16.0 | 调用 `it()` 现在等同于调用 `test()`。 |
| v18.6.0, v16.17.0 | 添加于: v18.6.0, v16.17.0 |
:::

[`test()`](/zh/nodejs/api/test#testname-options-fn) 的别名。

`it()` 函数从 `node:test` 模块导入。

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

跳过测试的简写形式，与 [`it([name], { skip: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

将测试标记为 `TODO` 的简写形式，与 [`it([name], { todo: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**添加于: v19.8.0, v18.15.0**

将测试标记为 `only` 的简写形式，与 [`it([name], { only: true }[, fn])`](/zh/nodejs/api/test#testname-options-fn) 相同。


## `before([fn][, options])` {#beforefn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。如果钩子使用回调，则回调函数作为第二个参数传递。**默认值:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子将在此毫秒数后失败。如果未指定，子测试将从其父测试继承此值。**默认值:** `Infinity`。

此函数创建一个在执行套件之前运行的钩子。

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。如果钩子使用回调，则回调函数作为第二个参数传递。**默认值:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子将在此毫秒数后失败。如果未指定，子测试将从其父测试继承此值。**默认值:** `Infinity`。

此函数创建一个在执行套件之后运行的钩子。

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**注意:** 保证 `after` 钩子会运行，即使套件中的测试失败。


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。如果钩子使用回调，则回调函数作为第二个参数传递。**默认:** 一个空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子将在此毫秒数后失败。如果未指定，子测试将从其父级继承此值。**默认:** `Infinity`。
  
 

此函数创建一个钩子，该钩子在当前套件中的每个测试之前运行。

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。如果钩子使用回调，则回调函数作为第二个参数传递。**默认:** 一个空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子将在此毫秒数后失败。如果未指定，子测试将从其父级继承此值。**默认:** `Infinity`。
  
 

此函数创建一个钩子，该钩子在当前套件中的每个测试之后运行。即使测试失败，也会运行 `afterEach()` 钩子。

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Added in: v22.3.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

一个对象，其方法用于配置当前进程中的默认快照设置。可以通过将公共配置代码放置在使用 `--require` 或 `--import` 预加载的模块中，将相同的配置应用于所有文件。

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Added in: v22.3.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个同步函数数组，用作快照测试的默认序列化器。

此函数用于自定义测试运行器使用的默认序列化机制。 默认情况下，测试运行器通过在提供的 `value` 上调用 `JSON.stringify(value, null, 2)` 来执行序列化。`JSON.stringify()` 在循环结构和支持的数据类型方面确实存在局限性。如果需要更强大的序列化机制，则应使用此函数。

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Added in: v22.3.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于计算快照文件位置的函数。该函数接收测试文件的路径作为其唯一参数。如果测试未与文件关联（例如在 REPL 中），则输入未定义。 `fn()` 必须返回一个字符串，指定快照快照文件的位置。

此函数用于自定义用于快照测试的快照文件的位置。默认情况下，快照文件名与入口点文件名相同，并带有 `.snapshot` 文件扩展名。


## 类: `MockFunctionContext` {#class-mockfunctioncontext}

**添加于: v19.1.0, v18.13.0**

`MockFunctionContext` 类用于检查或操作通过 [`MockTracker`](/zh/nodejs/api/test#class-mocktracker) API 创建的模拟对象的行为。

### `ctx.calls` {#ctxcalls}

**添加于: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

一个 getter，返回用于跟踪对模拟对象的调用的内部数组的副本。 数组中的每个条目都是一个具有以下属性的对象。

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 传递给模拟函数的参数数组。
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 如果模拟函数抛出异常，则此属性包含抛出的值。 **默认值:** `undefined`。
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 模拟函数返回的值。
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 一个 `Error` 对象，其堆栈可用于确定模拟函数调用的调用点。
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果模拟函数是构造函数，则此字段包含正在构造的类。 否则，这将是 `undefined`。
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 模拟函数的 `this` 值。

### `ctx.callCount()` {#ctxcallcount}

**添加于: v19.1.0, v18.13.0**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 此模拟对象被调用的次数。

此函数返回此模拟对象已被调用的次数。 此函数比检查 `ctx.calls.length` 更有效，因为 `ctx.calls` 是一个 getter，它创建内部调用跟踪数组的副本。


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**添加于: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) 将用作模拟的新实现的函数。

此函数用于更改现有模拟的行为。

以下示例使用 `t.mock.fn()` 创建一个模拟函数，调用该模拟函数，然后将模拟实现更改为另一个函数。

```js [ESM]
test('更改模拟行为', (t) => {
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

**添加于: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.ecma262/#sec-async-function-constructor) 将用作模拟的实现的函数，用于 `onCall` 指定的调用次数。
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 将使用 `implementation` 的调用编号。 如果指定的调用已经发生，则会抛出异常。 **默认值:** 下一次调用的次数。

此函数用于更改现有模拟的单次调用行为。 一旦调用 `onCall` 发生，模拟将恢复到未调用 `mockImplementationOnce()` 时的行为。

以下示例使用 `t.mock.fn()` 创建一个模拟函数，调用该模拟函数，将模拟实现更改为另一个函数以进行下一次调用，然后恢复其先前的行为。

```js [ESM]
test('单次更改模拟行为', (t) => {
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

**添加于: v19.3.0, v18.13.0**

重置模拟函数的调用历史。

### `ctx.restore()` {#ctxrestore}

**添加于: v19.1.0, v18.13.0**

将模拟函数的实现重置为其原始行为。调用此函数后，仍然可以使用该模拟函数。

## 类: `MockModuleContext` {#class-mockmodulecontext}

**添加于: v22.3.0, v20.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

`MockModuleContext` 类用于操纵通过 [`MockTracker`](/zh/nodejs/api/test#class-mocktracker) API 创建的模块模拟的行为。

### `ctx.restore()` {#ctxrestore_1}

**添加于: v22.3.0, v20.18.0**

重置模拟模块的实现。

## 类: `MockTracker` {#class-mocktracker}

**添加于: v19.1.0, v18.13.0**

`MockTracker` 类用于管理模拟功能。测试运行器模块提供了一个顶级的 `mock` 导出，它是 `MockTracker` 的实例。每个测试还通过测试上下文的 `mock` 属性提供自己的 `MockTracker` 实例。

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**添加于: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个可选的函数，用于创建模拟。**默认:** 一个空操作函数。
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个可选的函数，用作 `original` 的模拟实现。这对于创建在指定调用次数内表现出一种行为，然后恢复 `original` 行为的模拟很有用。**默认:** `original` 指定的函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 模拟函数的可选配置选项。支持以下属性：
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 模拟将使用 `implementation` 行为的次数。一旦模拟函数被调用 `times` 次，它将自动恢复 `original` 的行为。此值必须是大于零的整数。**默认:** `Infinity`。


- 返回: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 模拟函数。模拟函数包含一个特殊的 `mock` 属性，它是 [`MockFunctionContext`](/zh/nodejs/api/test#class-mockfunctioncontext) 的一个实例，可用于检查和更改模拟函数的行为。

此函数用于创建模拟函数。

以下示例创建一个模拟函数，该函数在每次调用时将计数器递增 1。 `times` 选项用于修改模拟行为，以便前两次调用将计数器加 2 而不是 1。

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

**添加于: v19.3.0, v18.13.0**

此函数是 [`MockTracker.method`](/zh/nodejs/api/test#mockmethodobject-methodname-implementation-options) 的语法糖，并将 `options.getter` 设置为 `true`。

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**添加于: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 其方法正在被 mock 的对象。
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 要在 `object` 上 mock 的方法的标识符。 如果 `object[methodName]` 不是函数，则会抛出错误。
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个可选的函数，用作 `object[methodName]` 的 mock 实现。 **默认:** 由 `object[methodName]` 指定的原始方法。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mock 方法的可选配置选项。 支持以下属性：
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `object[methodName]` 被视为 getter。 此选项不能与 `setter` 选项一起使用。 **默认:** false。
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `object[methodName]` 被视为 setter。 此选项不能与 `getter` 选项一起使用。 **默认:** false。
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mock 将使用 `implementation` 行为的次数。 一旦 mock 的方法被调用了 `times` 次，它将自动恢复原始行为。 此值必须是大于零的整数。 **默认:** `Infinity`。
  
 
- 返回: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) mock 的方法。 mock 的方法包含一个特殊的 `mock` 属性，它是 [`MockFunctionContext`](/zh/nodejs/api/test#class-mockfunctioncontext) 的一个实例，可用于检查和更改 mock 方法的行为。

此函数用于在现有对象方法上创建 mock。 以下示例演示了如何在现有对象方法上创建 mock。

```js [ESM]
test('spies on an object method', (t) => {
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

**新增于: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 一个字符串，用于标识要模拟的模块。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于模拟模块的可选配置选项。 支持以下属性：
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `false`，则每次调用 `require()` 或 `import()` 都会生成一个新的模拟模块。 如果为 `true`，则后续调用将返回相同的模块模拟，并且模拟模块将插入到 CommonJS 缓存中。 **默认值:** false。
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 一个可选值，用作模拟模块的默认导出。 如果未提供此值，则 ESM 模拟不包含默认导出。 如果模拟是 CommonJS 或内置模块，则此设置用作 `module.exports` 的值。 如果未提供此值，则 CJS 和内置模块模拟使用一个空对象作为 `module.exports` 的值。
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个可选对象，其键和值用于创建模拟模块的具名导出。 如果模拟是 CommonJS 或内置模块，则这些值将被复制到 `module.exports`。 因此，如果使用具名导出和非对象默认导出创建模拟，则当模拟用作 CJS 或内置模块时，将抛出异常。


- 返回: [\<MockModuleContext\>](/zh/nodejs/api/test#class-mockmodulecontext) 可用于操作模拟的对象。

此函数用于模拟 ECMAScript 模块、CommonJS 模块和 Node.js 内置模块的导出。 在模拟之前对原始模块的任何引用都不会受到影响。 为了启用模块模拟，Node.js 必须使用 [`--experimental-test-module-mocks`](/zh/nodejs/api/cli#--experimental-test-module-mocks) 命令行标志启动。

以下示例演示了如何为模块创建模拟。

```js [ESM]
test('在两种模块系统中模拟一个内置模块', async (t) => {
  // 创建一个名为 'node:readline' 的模拟，其中包含一个名为 'fn' 的具名导出，
  // 该导出在原始 'node:readline' 模块中不存在。
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() 是原始 'node:readline' 模块的一个导出。
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // 模拟已恢复，因此返回原始的内置模块。
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**新增于: v19.1.0, v18.13.0**

此函数恢复由此 `MockTracker` 先前创建的所有模拟的默认行为，并将这些模拟与 `MockTracker` 实例解除关联。一旦解除关联，模拟仍然可以使用，但 `MockTracker` 实例将无法再用于重置其行为或以其他方式与它们交互。

每个测试完成后，都会在测试上下文的 `MockTracker` 上调用此函数。 如果全局 `MockTracker` 被广泛使用，建议手动调用此函数。

### `mock.restoreAll()` {#mockrestoreall}

**新增于: v19.1.0, v18.13.0**

此函数恢复由此 `MockTracker` 先前创建的所有模拟的默认行为。 与 `mock.reset()` 不同，`mock.restoreAll()` 不会将模拟与 `MockTracker` 实例解除关联。

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**新增于: v19.3.0, v18.13.0**

此函数是 [`MockTracker.method`](/zh/nodejs/api/test#mockmethodobject-methodname-implementation-options) 的语法糖，并将 `options.setter` 设置为 `true`。

## 类: `MockTimers` {#class-mocktimers}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v23.1.0 | 模拟定时器现在是稳定的。 |
| v20.4.0, v18.19.0 | 新增于: v20.4.0, v18.19.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

模拟定时器是一种通常用于软件测试的技术，用于模拟和控制定时器的行为，例如 `setInterval` 和 `setTimeout`，而无需实际等待指定的时间间隔。

MockTimers 还可以模拟 `Date` 对象。

[`MockTracker`](/zh/nodejs/api/test#class-mocktracker) 提供了一个顶级 `timers` 导出，它是一个 `MockTimers` 实例。

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v21.2.0, v20.11.0 | 更新参数为一个带有可用 API 和默认初始 epoch 的选项对象。 |
| v20.4.0, v18.19.0 | 新增于: v20.4.0, v18.19.0 |
:::

启用指定定时器的定时器模拟。

- `enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于启用定时器模拟的可选配置选项。 支持以下属性：
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含要模拟的定时器的可选数组。 当前支持的定时器值为 `'setInterval'`、`'setTimeout'`、`'setImmediate'` 和 `'Date'`。 **默认值:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`。 如果未提供数组，则所有与时间相关的 API（`'setInterval'`、`'clearInterval'`、`'setTimeout'`、`'clearTimeout'`、`'setImmediate'`、`'clearImmediate'` 和 `'Date'`）都将默认被模拟。
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 表示初始时间（以毫秒为单位）的可选数字或 Date 对象，用作 `Date.now()` 的值。 **默认值:** `0`。
  
 

**注意:** 当你为一个特定的定时器启用模拟时，它的关联清除函数也会被隐式地模拟。

**注意:** 模拟 `Date` 将会影响被模拟定时器的行为，因为它们使用相同的内部时钟。

不设置初始时间的例子:



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

上面的例子启用了 `setInterval` 定时器的模拟，并隐式地模拟了 `clearInterval` 函数。 只有来自 [node:timers](/zh/nodejs/api/timers)、[node:timers/promises](/zh/nodejs/api/timers#timers-promises-api) 和 `globalThis` 的 `setInterval` 和 `clearInterval` 函数会被模拟。

设置了初始时间的例子:



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

使用初始 Date 对象作为时间设置的例子:



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

或者，如果你调用 `mock.timers.enable()` 而不带任何参数：

所有定时器（`'setInterval'`、`'clearInterval'`、`'setTimeout'`、`'clearTimeout'`、`'setImmediate'` 和 `'clearImmediate'`）都将被模拟。 来自 `node:timers`、`node:timers/promises` 和 `globalThis` 的 `setInterval`、`clearInterval`、`setTimeout`、`clearTimeout`、`setImmediate` 和 `clearImmediate` 函数将被模拟。 以及全局 `Date` 对象。


### `timers.reset()` {#timersreset}

**新增于: v20.4.0, v18.19.0**

此函数恢复所有先前由此 `MockTimers` 实例创建的模拟的默认行为，并将这些模拟与 `MockTracker` 实例解除关联。

**注意:** 在每个测试完成后，都会在测试上下文的 `MockTracker` 上调用此函数。

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

调用 `timers.reset()`。

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**新增于: v20.4.0, v18.19.0**

为所有模拟的定时器推进时间。

- `milliseconds` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 以毫秒为单位推进定时器的时间量。 **默认值:** `1`。

**注意:** 这与 Node.js 中 `setTimeout` 的行为不同，并且仅接受正数。 在 Node.js 中，仅出于 Web 兼容性原因才支持带有负数的 `setTimeout`。

以下示例模拟了一个 `setTimeout` 函数，并通过使用 `.tick` 推进时间来触发所有挂起的定时器。

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

或者，可以多次调用 `.tick` 函数

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

使用 `.tick` 推进时间也会推进在启用模拟后创建的任何 `Date` 对象的时间（如果 `Date` 也被设置为模拟）。

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


#### 使用 clear 函数 {#using-clear-functions}

正如前面提到的，所有来自定时器的 clear 函数（`clearTimeout`、`clearInterval` 和 `clearImmediate`）都会被隐式地模拟。看一看这个使用 `setTimeout` 的例子：

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('模拟 setTimeout 以同步执行，而无需实际等待', (context) => {
  const fn = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // 也被隐式地模拟
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // 由于该 setTimeout 已被清除，因此永远不会调用模拟函数
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('模拟 setTimeout 以同步执行，而无需实际等待', (context) => {
  const fn = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // 也被隐式地模拟
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // 由于该 setTimeout 已被清除，因此永远不会调用模拟函数
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### 使用 Node.js 定时器模块 {#working-with-nodejs-timers-modules}

一旦你启用了模拟定时器，[node:timers](/zh/nodejs/api/timers)，[node:timers/promises](/zh/nodejs/api/timers#timers-promises-api) 模块，以及来自 Node.js 全局上下文的定时器就会被启用：

**注意：** 此 API 目前不支持解构函数，例如 `import { setTimeout } from 'node:timers'`。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('模拟 setTimeout 以同步执行，而无需实际等待', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // 前进时间
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

test('模拟 setTimeout 以同步执行，而无需实际等待', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // 可选地选择要模拟的内容
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // 前进时间
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

在 Node.js 中，来自 [node:timers/promises](/zh/nodejs/api/timers#timers-promises-api) 的 `setInterval` 是一个 `AsyncGenerator`，并且也受此 API 支持：

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('应该测试一个真实的用例，执行五次 tick', async (context) => {
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
test('应该测试一个真实的用例，执行五次 tick', async (context) => {
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

**加入于: v20.4.0, v18.19.0**

立即触发所有待处理的模拟定时器。如果 `Date` 对象也被模拟，它也会将 `Date` 对象推进到最远的定时器时间。

下面的示例立即触发所有待处理的定时器，使它们立即执行，没有任何延迟。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll 函数按照给定的顺序执行', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // 请注意，如果两个定时器具有相同的超时，
  // 则保证执行顺序
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Date 对象也被推进到最远的定时器时间
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll 函数按照给定的顺序执行', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // 请注意，如果两个定时器具有相同的超时，
  // 则保证执行顺序
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Date 对象也被推进到最远的定时器时间
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**注意:** `runAll()` 函数专门设计用于在定时器模拟的上下文中触发定时器。 它对模拟环境之外的实时系统时钟或实际定时器没有任何影响。

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**加入于: v21.2.0, v20.11.0**

设置当前 Unix 时间戳，该时间戳将用作任何模拟的 `Date` 对象的参考。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll 函数按照给定的顺序执行', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now 没有被模拟
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now 现在是 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime 替换当前时间', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now 没有被模拟
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now 现在是 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### 日期和定时器协同工作 {#dates-and-timers-working-together}

日期和定时器对象彼此依赖。如果使用 `setTime()` 将当前时间传递给模拟的 `Date` 对象，则使用 `setTimeout` 和 `setInterval` 设置的定时器将**不会**受到影响。

但是，`tick` 方法**将会**推进模拟的 `Date` 对象。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('按照给定顺序运行所有函数', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 日期已推进，但定时器未触发
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('按照给定顺序运行所有函数', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 日期已推进，但定时器未触发
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## 类: `TestsStream` {#class-testsstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | 为测试用例为套件时，向 test:pass 和 test:fail 事件添加了类型。 |
| v18.9.0, v16.19.0 | 添加于: v18.9.0, v16.19.0 |
:::

- 继承自 [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable)

成功调用 [`run()`](/zh/nodejs/api/test#runoptions) 方法将返回一个新的 [\<TestsStream\>](/zh/nodejs/api/test#class-testsstream) 对象，该对象会流式传输一系列事件，表示测试的执行过程。 `TestsStream` 将按照测试定义的顺序发出事件。

某些事件保证以与测试定义相同的顺序发出，而另一些事件则按照测试执行的顺序发出。


### 事件: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含覆盖率报告的对象。
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含各个文件覆盖率报告的数组。每个报告都是一个对象，具有以下模式：
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文件的绝对路径。
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总行数。
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总分支数。
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总函数数。
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的行数。
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的分支数。
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的函数数。
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的行百分比。
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的分支百分比。
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的函数百分比。
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个表示函数覆盖率的函数数组。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 函数的名称。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 函数定义的行号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 函数被调用的次数。
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个表示分支覆盖率的分支数组。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 分支定义的行号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 分支被执行的次数。
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个表示行号和它们被覆盖次数的行数组。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 该行被覆盖的次数。
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个包含每种覆盖类型是否满足覆盖率要求的对象。
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 函数覆盖率阈值。
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 分支覆盖率阈值。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行覆盖率阈值。
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个包含所有文件覆盖率摘要的对象。
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总行数。
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总分支数。
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 总函数数。
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的行数。
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的分支数。
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的函数数。
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的行百分比。
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的分支百分比。
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 覆盖的函数百分比。
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 代码覆盖率开始时的工作目录。这对于在测试更改 Node.js 进程的工作目录时显示相对路径名很有用。
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
  
 

当启用代码覆盖率并且所有测试都已完成时触发。


### Event: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义所在的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 额外的执行元数据。
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 测试是否通过。
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试持续时间，以毫秒为单位。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果测试未通过，则为包装测试抛出的错误的错误对象。
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 测试抛出的实际错误。
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试的类型，用于表示这是否是一个套件。
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义所在的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的序号。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.todo`](/zh/nodejs/api/test#contexttodomessage)，则存在
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.skip`](/zh/nodejs/api/test#contextskipmessage)，则存在
  
 

当测试完成执行时触发。此事件的触发顺序与测试的定义顺序不一致。 对应的声明顺序事件是 `'test:pass'` 和 `'test:fail'`。


### Event: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
  
 

在测试被出队，即将执行之前发出。 此事件不能保证以与测试定义相同的顺序发出。 相应的声明顺序事件是 `'test:start'`。

### Event: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试是通过 REPL 运行的，则为 `undefined`。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 诊断消息。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
  
 

当调用 [`context.diagnostic`](/zh/nodejs/api/test#contextdiagnosticmessage) 时发出。 此事件保证以与测试定义相同的顺序发出。


### Event: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
  
 

当一个测试被加入执行队列时触发。

### Event: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 额外的执行元数据。
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试持续时间，以毫秒为单位。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 一个包装了测试抛出的错误的错误对象。
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 测试抛出的实际错误。
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试的类型，用于表示这是否为一个套件。
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的序号。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.todo`](/zh/nodejs/api/test#contexttodomessage) 则存在。
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.skip`](/zh/nodejs/api/test#contextskipmessage) 则存在。
  
 

当一个测试失败时触发。保证此事件以与测试定义相同的顺序触发。相应的执行顺序事件为 `'test:complete'`。


### 事件: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义所在的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 额外的执行元数据。
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的持续时间，以毫秒为单位。
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试的类型，用于表示这是否为一个套件。

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义所在的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的序号。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.todo`](/zh/nodejs/api/test#contexttodomessage)，则存在。
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果调用了 [`context.skip`](/zh/nodejs/api/test#contextskipmessage)，则存在。


当测试通过时触发。 保证此事件的触发顺序与测试的定义顺序相同。 对应的执行顺序事件是 `'test:complete'`。


### Event: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 已运行的子测试的数量。

当给定测试的所有子测试都已完成时发出。 保证此事件以与测试定义相同的顺序发出。

### Event: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的列号，如果测试通过 REPL 运行，则为 `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试文件的路径，如果测试通过 REPL 运行，则为 `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 测试定义的行号，如果测试通过 REPL 运行，则为 `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试名称。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试的嵌套级别。

当测试开始报告其自身及其子测试的状态时发出。 保证此事件以与测试定义相同的顺序发出。 相应的执行顺序事件是 `'test:dequeue'`。


### Event: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试文件的路径。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 写入到 `stderr` 的消息。

当正在运行的测试写入到 `stderr` 时触发。只有在传递了 `--test` 标志时才会触发此事件。不能保证此事件的触发顺序与测试定义顺序相同。

### Event: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 测试文件的路径。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 写入到 `stdout` 的消息。

当正在运行的测试写入到 `stdout` 时触发。只有在传递了 `--test` 标志时才会触发此事件。不能保证此事件的触发顺序与测试定义顺序相同。

### Event: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含各种测试结果计数的对象。
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 已取消的测试总数。
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 失败的测试总数。
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 通过的测试总数。
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 跳过的测试总数。
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 运行的套件总数。
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 运行的测试总数，不包括套件。
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TODO 测试的总数。
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 顶层测试和套件的总数。

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试运行的持续时间，以毫秒为单位。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 生成摘要的测试文件的路径。如果摘要对应于多个文件，则此值为 `undefined`。
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示测试运行是否被认为是成功的。如果发生任何错误情况，例如测试失败或未满足的覆盖率阈值，则此值将设置为 `false`。

当测试运行完成时触发。此事件包含与已完成测试运行相关的指标，可用于确定测试运行是通过还是失败。如果使用进程级测试隔离，则除了最终累积摘要之外，还会为每个测试文件生成一个 `'test:summary'` 事件。


### 事件: `'test:watch:drained'` {#event-testwatchdrained}

当在观察模式下没有更多测试排队等待执行时触发。

## 类: `TestContext` {#class-testcontext}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | `before` 函数被添加到 TestContext。 |
| v18.0.0, v16.17.0 | 添加于: v18.0.0, v16.17.0 |
:::

`TestContext` 的实例被传递给每个测试函数，以便与测试运行器交互。但是，`TestContext` 构造函数不会作为 API 的一部分公开。

### `context.before([fn][, options])` {#contextbeforefn-options}

**添加于: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) hook 函数。此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。如果 hook 使用回调，则回调函数作为第二个参数传递。**默认:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) hook 的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 hook。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) hook 将在其后失败的毫秒数。如果未指定，子测试将从其父级继承此值。**默认:** `Infinity`。

此函数用于创建一个在当前测试的子测试之前运行的 hook。

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) hook 函数。此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。如果 hook 使用回调，则回调函数作为第二个参数传递。**默认:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) hook 的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的 hook。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) hook 将在其后失败的毫秒数。如果未指定，子测试将从其父级继承此值。**默认:** `Infinity`。

此函数用于创建一个在当前测试的每个子测试之前运行的 hook。

```js [ESM]
test('顶层测试', async (t) => {
  t.beforeEach((t) => t.diagnostic(`即将运行 ${t.name}`));
  await t.test(
    '这是一个子测试',
    (t) => {
      assert.ok('这里有一些相关的断言');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**添加于: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。如果钩子使用回调，则回调函数作为第二个参数传递。**默认:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子失败前的毫秒数。如果未指定，则子测试从其父级继承此值。**默认:** `Infinity`。
  
 

此函数用于创建在当前测试完成后运行的钩子。

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 钩子函数。此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。如果钩子使用回调，则回调函数作为第二个参数传递。**默认:** 空操作函数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 钩子的配置选项。支持以下属性：
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的钩子。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 钩子失败前的毫秒数。如果未指定，则子测试从其父级继承此值。**默认:** `Infinity`。
  
 

此函数用于创建在当前测试的每个子测试之后运行的钩子。

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

**新增于: v22.2.0, v20.15.0**

一个包含绑定到 `context` 的断言方法的对象。来自 `node:assert` 模块的顶级函数在此处公开，目的是为了创建测试计划。

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**新增于: v22.3.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要序列化为字符串的值。如果 Node.js 启动时带有 [`--test-update-snapshots`](/zh/nodejs/api/cli#--test-update-snapshots) 标志，则序列化后的值将写入快照文件。否则，序列化后的值将与现有快照文件中相应的值进行比较。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可选的配置选项。支持以下属性：
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 用于将 `value` 序列化为字符串的同步函数数组。`value` 作为唯一参数传递给第一个序列化函数。每个序列化函数的返回值作为输入传递给下一个序列化函数。一旦所有序列化器都运行完毕，结果值将被强制转换为字符串。**默认值:** 如果未提供序列化器，则使用测试运行器的默认序列化器。
  
 

此函数实现了快照测试的断言。

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

**添加于: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要报告的消息。

此函数用于将诊断信息写入输出。任何诊断信息都包含在测试结果的末尾。此函数不返回值。

```js [ESM]
test('顶级测试', (t) => {
  t.diagnostic('一条诊断消息');
});
```
### `context.filePath` {#contextfilepath}

**添加于: v22.6.0, v20.16.0**

创建当前测试的测试文件的绝对路径。如果测试文件导入了生成测试的其他模块，则导入的测试将返回根测试文件的路径。

### `context.fullName` {#contextfullname}

**添加于: v22.3.0**

测试的名称及其每个祖先的名称，用 `>` 分隔。

### `context.name` {#contextname}

**添加于: v18.8.0, v16.18.0**

测试的名称。

### `context.plan(count)` {#contextplancount}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.4.0 | 此函数不再是实验性的。 |
| v22.2.0, v20.15.0 | 添加于: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 预计要运行的断言和子测试的数量。

此函数用于设置测试中预期运行的断言和子测试的数量。如果运行的断言和子测试的数量与预期计数不匹配，则测试将失败。

```js [ESM]
test('顶级测试', (t) => {
  t.plan(2);
  t.assert.ok('一些相关的断言');
  t.test('子测试', () => {});
});
```
当使用异步代码时，`plan` 函数可用于确保运行正确数量的断言：

```js [ESM]
test('使用流进行规划', (t, done) => {
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

**添加于: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否只运行 `only` 测试。

如果 `shouldRunOnlyTests` 是真值，则测试上下文将仅运行设置了 `only` 选项的测试。 否则，将运行所有测试。 如果 Node.js 不是使用 [`--test-only`](/zh/nodejs/api/cli#--test-only) 命令行选项启动的，则此函数不执行任何操作。

```js [ESM]
test('顶层测试', (t) => {
  // 可以设置测试上下文以运行带有 'only' 选项的子测试。
  t.runOnly(true);
  return Promise.all([
    t.test('现在跳过此子测试'),
    t.test('运行此子测试', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**添加于: v18.7.0, v16.17.0**

- 类型: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)

当测试中止时，可用于中止测试子任务。

```js [ESM]
test('顶层测试', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**添加于: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选的跳过消息。

此函数使测试的输出指示该测试已被跳过。 如果提供了 `message`，它将包含在输出中。 调用 `skip()` 不会终止测试函数的执行。 此函数不返回值。

```js [ESM]
test('顶层测试', (t) => {
  // 如果测试包含其他逻辑，请确保也在此处返回。
  t.skip('这被跳过了');
});
```
### `context.todo([message])` {#contexttodomessage}

**添加于: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选的 `TODO` 消息。

此函数将 `TODO` 指令添加到测试的输出中。 如果提供了 `message`，它将包含在输出中。 调用 `todo()` 不会终止测试函数的执行。 此函数不返回值。

```js [ESM]
test('顶层测试', (t) => {
  // 此测试标记为 `TODO`
  t.todo('这是一个待办事项');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.8.0, v16.18.0 | 添加 `signal` 选项。 |
| v18.7.0, v16.17.0 | 添加 `timeout` 选项。 |
| v18.0.0, v16.17.0 | 添加于: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子测试的名称，在报告测试结果时显示。**默认:** `fn` 的 `name` 属性，如果 `fn` 没有名称，则为 `'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 子测试的配置选项。 支持以下属性：
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 如果提供一个数字，那么将有那么多个测试在应用程序线程中并行运行。 如果为 `true`，它将并行运行所有子测试。 如果为 `false`，它将一次只运行一个测试。 如果未指定，子测试将从其父测试继承此值。 **默认:** `null`。
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为真值，并且测试上下文配置为运行 `only` 测试，那么将运行此测试。 否则，将跳过该测试。 **默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止正在进行的测试。
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为真值，则跳过该测试。 如果提供一个字符串，该字符串将显示在测试结果中，作为跳过测试的原因。 **默认:** `false`。
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为真值，则将测试标记为 `TODO`。 如果提供一个字符串，该字符串将显示在测试结果中，作为测试为 `TODO` 的原因。 **默认:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 测试将在多少毫秒后失败。 如果未指定，子测试将从其父测试继承此值。 **默认:** `Infinity`。
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 期望在测试中运行的断言和子测试的数量。 如果在测试中运行的断言数量与计划中指定的数量不匹配，则测试将失败。 **默认:** `undefined`。
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 被测试的函数。 此函数的第一个参数是 [`TestContext`](/zh/nodejs/api/test#class-testcontext) 对象。 如果测试使用回调，则回调函数将作为第二个参数传递。 **默认:** 空操作函数。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一旦测试完成，则使用 `undefined` 兑现。

此函数用于在当前测试下创建子测试。 此函数的行为方式与顶级 [`test()`](/zh/nodejs/api/test#testname-options-fn) 函数相同。

```js [ESM]
test('顶级测试', async (t) => {
  await t.test(
    '这是一个子测试',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('此处的一些相关断言');
    },
  );
});
```

## 类: `SuiteContext` {#class-suitecontext}

**加入于: v18.7.0, v16.17.0**

`SuiteContext` 的一个实例会被传递给每个套件函数，以便与测试运行器进行交互。但是，`SuiteContext` 构造函数不会作为 API 的一部分公开。

### `context.filePath` {#contextfilepath_1}

**加入于: v22.6.0**

创建当前套件的测试文件的绝对路径。如果一个测试文件导入了会生成套件的额外模块，则导入的套件将返回根测试文件的路径。

### `context.name` {#contextname_1}

**加入于: v18.8.0, v16.18.0**

套件的名称。

### `context.signal` {#contextsignal_1}

**加入于: v18.7.0, v16.17.0**

- 类型: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)

可用于在测试中止时中止测试子任务。

