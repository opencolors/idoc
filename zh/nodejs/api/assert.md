---
title: Node.js 断言模块文档
description: Node.js 的断言模块提供了一组简单的断言测试，用于测试不变量。本文档涵盖了 Node.js 中断言模块的使用、方法和示例。
head:
  - - meta
    - name: og:title
      content: Node.js 断言模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的断言模块提供了一组简单的断言测试，用于测试不变量。本文档涵盖了 Node.js 中断言模块的使用、方法和示例。
  - - meta
    - name: twitter:title
      content: Node.js 断言模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的断言模块提供了一组简单的断言测试，用于测试不变量。本文档涵盖了 Node.js 中断言模块的使用、方法和示例。
---


# 断言 {#assert}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

`node:assert` 模块提供了一组用于验证不变式的断言函数。

## 严格断言模式 {#strict-assertion-mode}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 作为 `require('node:assert/strict')` 公开。 |
| v13.9.0, v12.16.2 | 将“严格模式”更改为“严格断言模式”，将“传统模式”更改为“传统断言模式”，以避免与“严格模式”的更常见含义混淆。 |
| v9.9.0 | 向严格断言模式添加了错误差异。 |
| v9.9.0 | 将严格断言模式添加到 assert 模块。 |
| v9.9.0 | 添加于: v9.9.0 |
:::

在严格断言模式下，非严格方法表现得像它们对应的严格方法。 例如，[`assert.deepEqual()`](/zh/nodejs/api/assert#assertdeepequalactual-expected-message) 的行为将类似于 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message)。

在严格断言模式下，对象的错误消息会显示差异。 在传统断言模式下，对象的错误消息会显示对象，通常会被截断。

要使用严格断言模式：

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

错误差异示例：

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: 预期输入是严格深度相等的：
// + actual - expected ... 已跳过行
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
// AssertionError: 预期输入是严格深度相等的：
// + actual - expected ... 已跳过行
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

要停用颜色，请使用 `NO_COLOR` 或 `NODE_DISABLE_COLORS` 环境变量。 这也会停用 REPL 中的颜色。 有关终端环境中颜色支持的更多信息，请阅读 tty [`getColorDepth()`](/zh/nodejs/api/tty#writestreamgetcolordepthenv) 文档。


## 遗留断言模式 {#legacy-assertion-mode}

遗留断言模式在以下函数中使用 [`==` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)：

- [`assert.deepEqual()`](/zh/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/zh/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/zh/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/zh/nodejs/api/assert#assertnotequalactual-expected-message)

要使用遗留断言模式：

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

遗留断言模式可能会产生令人惊讶的结果，尤其是在使用 [`assert.deepEqual()`](/zh/nodejs/api/assert#assertdeepequalactual-expected-message) 时：

```js [CJS]
// 警告：在遗留断言模式下，这不会抛出 AssertionError！
assert.deepEqual(/a/gi, new Date());
```
## 类: assert.AssertionError {#class-assertassertionerror}

- 继承自: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示断言失败。 `node:assert` 模块抛出的所有错误都将是 `AssertionError` 类的实例。

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**新增于: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果提供，则错误消息设置为此值。
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 错误实例上的 `actual` 属性。
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 错误实例上的 `expected` 属性。
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 错误实例上的 `operator` 属性。
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 如果提供，则生成的堆栈跟踪会省略此函数之前的帧。

`Error` 的子类，表示断言失败。

所有实例都包含内置的 `Error` 属性（`message` 和 `name`）和：

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 设置为诸如 [`assert.strictEqual()`](/zh/nodejs/api/assert#assertstrictequalactual-expected-message) 之类的方法的 `actual` 参数。
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 设置为诸如 [`assert.strictEqual()`](/zh/nodejs/api/assert#assertstrictequalactual-expected-message) 之类的方法的 `expected` 值。
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示消息是否为自动生成 (`true`)。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 该值为始终为 `ERR_ASSERTION`，以表明该错误是断言错误。
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 设置为传入的 operator 值。

::: code-group
```js [ESM]
import assert from 'node:assert';

// 生成一个 AssertionError 以便稍后比较错误消息：
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// 验证错误输出：
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

// 生成一个 AssertionError 以便稍后比较错误消息：
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// 验证错误输出：
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


## 类：`assert.CallTracker` {#class-assertcalltracker}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0 | `assert.CallTracker` 类已弃用，并将在未来的版本中移除。 |
| v14.2.0, v12.19.0 | 添加于: v14.2.0, v12.19.0 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

此特性已弃用，并将在未来的版本中移除。 请考虑使用替代方案，例如 [`mock`](/zh/nodejs/api/test#mocking) 辅助函数。

### `new assert.CallTracker()` {#new-assertcalltracker}

**添加于: v14.2.0, v12.19.0**

创建一个新的 [`CallTracker`](/zh/nodejs/api/assert#class-assertcalltracker) 对象，该对象可用于跟踪函数是否被调用了特定次数。 必须调用 `tracker.verify()` 才能进行验证。 通常的模式是在 [`process.on('exit')`](/zh/nodejs/api/process#event-exit) 处理程序中调用它。

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() 必须在 tracker.verify() 之前被精确调用 1 次。
const callsfunc = tracker.calls(func, 1);

callsfunc();

// 调用 tracker.verify() 并验证所有 tracker.calls() 函数是否已被精确调用指定次数。
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() 必须在 tracker.verify() 之前被精确调用 1 次。
const callsfunc = tracker.calls(func, 1);

callsfunc();

// 调用 tracker.verify() 并验证所有 tracker.calls() 函数是否已被精确调用指定次数。
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**添加于: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **默认:** 一个空操作函数。
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `1`。
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 包装 `fn` 的函数。

包装器函数预计会被精确调用 `exact` 次。 如果在调用 [`tracker.verify()`](/zh/nodejs/api/assert#trackerverify) 时，该函数未被精确调用 `exact` 次，则 [`tracker.verify()`](/zh/nodejs/api/assert#trackerverify) 将抛出一个错误。

::: code-group
```js [ESM]
import assert from 'node:assert';

// 创建调用跟踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被精确调用指定次数。
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// 创建调用跟踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被精确调用指定次数。
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**添加于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含所有对被追踪函数的调用的数组。
- 对象 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 传递给被追踪函数的参数

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

// 创建调用追踪器。
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**添加于: v14.2.0, v12.19.0**

- 返回: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含有关 [`tracker.calls()`](/zh/nodejs/api/assert#trackercallsfn-exact) 返回的包装函数的信息的对象数组。
- 对象 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 函数的实际调用次数。
  - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 预计函数被调用的次数。
  - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 被包装的函数的名称。
  - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 函数的堆栈跟踪。

该数组包含有关未按预期次数调用的函数的预期调用次数和实际调用次数的信息。

::: code-group
```js [ESM]
import assert from 'node:assert';

// 创建调用追踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被调用 exact 次。
const callsfunc = tracker.calls(func, 2);

// 返回一个包含 callsfunc() 信息的数组
console.log(tracker.report());
// [
//  {
//    message: '预计 func 函数被执行 2 次，但实际执行了 0 次。',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// 创建调用追踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被调用 exact 次。
const callsfunc = tracker.calls(func, 2);

// 返回一个包含 callsfunc() 信息的数组
console.log(tracker.report());
// [
//  {
//    message: '预计 func 函数被执行 2 次，但实际执行了 0 次。',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**新增于: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要重置的被追踪函数。

重置调用追踪器的调用。 如果将一个被追踪的函数作为参数传递，则将重置对它的调用。 如果未传递任何参数，则将重置所有被追踪的函数。

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// 追踪器被调用一次
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
// 追踪器被调用一次
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**新增于: v14.2.0, v12.19.0**

遍历传递给 [`tracker.calls()`](/zh/nodejs/api/assert#trackercallsfn-exact) 的函数列表，并且会为未按预期次数调用的函数抛出错误。

::: code-group
```js [ESM]
import assert from 'node:assert';

// 创建调用追踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被调用 exact 次。
const callsfunc = tracker.calls(func, 2);

callsfunc();

// 由于 callsfunc() 仅被调用一次，因此将抛出错误。
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// 创建调用追踪器。
const tracker = new assert.CallTracker();

function func() {}

// 返回一个包装 func() 的函数，该函数必须在 tracker.verify() 之前被调用 exact 次。
const callsfunc = tracker.calls(func, 2);

callsfunc();

// 由于 callsfunc() 仅被调用一次，因此将抛出错误。
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Added in: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 被检查是否为真值的输入。
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.ok()`](/zh/nodejs/api/assert#assertokvalue-message) 的别名。

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.2.0, v20.15.0 | 错误原因和 errors 属性现在也会进行比较。 |
| v18.0.0 | 正则表达式的 lastIndex 属性现在也会进行比较。 |
| v16.0.0, v14.18.0 | 在传统断言模式下，状态从已弃用更改为传统。 |
| v14.0.0 | 如果两边都是 NaN，则 NaN 现在被视为相同。 |
| v12.0.0 | 类型标签现在可以正确比较，并且有一些小的比较调整，以使检查不那么令人惊讶。 |
| v9.0.0 | `Error` 的名称和消息现在可以正确比较。 |
| v8.0.0 | `Set` 和 `Map` 的内容也会进行比较。 |
| v6.4.0, v4.7.1 | 现在可以正确处理类型化数组切片。 |
| v6.1.0, v4.5.0 | 现在可以使用具有循环引用的对象作为输入。 |
| v5.10.1, v4.4.3 | 正确处理非 `Uint8Array` 的类型化数组。 |
| v0.1.21 | 添加于：v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**严格断言模式**

[`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message) 的别名。

**传统断言模式**

::: info [稳定度: 3 - 传统]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 传统：请改用 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message)。
:::

测试 `actual` 和 `expected` 参数之间的深度相等性。 考虑使用 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message) 代替。 [`assert.deepEqual()`](/zh/nodejs/api/assert#assertdeepequalactual-expected-message) 可能会产生令人惊讶的结果。

*深度相等* 意味着子对象的可枚举的“自身”属性也通过以下规则递归地进行评估。


### 比较详情 {#comparison-details}

- 原始值使用 [`==` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) 进行比较，但 `NaN` 除外。 如果两边都是 `NaN`，则将其视为相同。
- 对象的[类型标签](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)应相同。
- 仅考虑[可枚举的“自身”属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。
- 始终比较 [`Error`](/zh/nodejs/api/errors#class-error) 的名称、消息、原因和错误，即使这些不是可枚举的属性。
- [对象包装器](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript)既作为对象进行比较，也作为解包后的值进行比较。
- `Object` 属性的比较是无序的。
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 键和 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 项的比较是无序的。
- 当两边不同或两边都遇到循环引用时，递归停止。
- 实现不测试对象的 [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)。
- 不比较 [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 属性。
- [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 和 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 的比较不依赖于它们的值，而仅依赖于它们的实例。
- 始终比较 [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 的 lastIndex、flags 和 source，即使这些不是可枚举的属性。

以下示例不会抛出 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，因为原始值是使用 [`==` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) 进行比较的。

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

“深层”相等意味着还将评估子对象的可枚举“自身”属性：

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

如果值不相等，则会抛出 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，并且 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出它，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.2.0, v20.15.0 | 现在也会比较错误原因和 errors 属性。 |
| v18.0.0 | 现在也会比较正则表达式的 lastIndex 属性。 |
| v9.0.0 | 现在会比较可枚举的符号属性。 |
| v9.0.0 | 现在使用 [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 比较来比较 `NaN`。 |
| v8.5.0 | 现在可以正确比较 `Error` 的名称和消息。 |
| v8.0.0 | 现在还会比较 `Set` 和 `Map` 的内容。 |
| v6.1.0 | 现在可以使用循环引用的对象作为输入。 |
| v6.4.0, v4.7.1 | 现在可以正确处理类型化数组切片。 |
| v5.10.1, v4.4.3 | 正确处理非 `Uint8Array` 类型化数组。 |
| v1.2.0 | 添加于: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)

测试 `actual` 和 `expected` 参数之间的深度相等性。“深度”相等性意味着子对象的可枚举“自有”属性也会通过以下规则递归评估。

### 比较详情 {#comparison-details_1}

- 原始值使用 [`Object.is()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 进行比较。
- 对象的[类型标签](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)应该相同。
- 对象的 [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) 使用 [`===` 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality) 进行比较。
- 仅考虑[可枚举的“自有”属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。
- 始终比较 [`Error`](/zh/nodejs/api/errors#class-error) 名称、消息、原因和错误，即使这些不是可枚举的属性。 还会比较 `errors`。
- 还会比较可枚举的自有 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 属性。
- [对象包装器](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript)既作为对象又作为解包值进行比较。
- `Object` 属性的比较是无序的。
- [`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 键和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 项的比较是无序的。
- 当双方不同或双方遇到循环引用时，递归停止。
- [`WeakMap`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 和 [`WeakSet`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 的比较不依赖于它们的值。 请参阅下面的更多详细信息。
- 始终比较 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions) 的 lastIndex、flags 和 source，即使这些不是可枚举的属性。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// 这会失败，因为 1 !== '1'。
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 以下对象没有自有属性
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 不同的 [[Prototype]]：
assert.deepStrictEqual(object, fakeDate);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + {}
// - Date {}

// 不同的类型标签：
assert.deepStrictEqual(date, fakeDate);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// 确定，因为 Object.is(NaN, NaN) 为真。

// 不同的解包数字：
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// 确定，因为对象和字符串在解包后是相同的。

assert.deepStrictEqual(-0, -0);
// 确定

// 不同的零：
assert.deepStrictEqual(0, -0);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// 确定，因为它是两个对象上相同的符号。

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: 输入相同但引用不相等：
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// 确定，因为无法比较条目

// 失败，因为 weakMap3 具有 weakMap1 不包含的属性：
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: 期望输入是严格深度相等的：
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

// 这会失败，因为 1 !== '1'。
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 以下对象没有自有属性
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 不同的 [[Prototype]]：
assert.deepStrictEqual(object, fakeDate);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + {}
// - Date {}

// 不同的类型标签：
assert.deepStrictEqual(date, fakeDate);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// 确定，因为 Object.is(NaN, NaN) 为真。

// 不同的解包数字：
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// 确定，因为对象和字符串在解包后是相同的。

assert.deepStrictEqual(-0, -0);
// 确定

// 不同的零：
assert.deepStrictEqual(0, -0);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// 确定，因为它是两个对象上相同的符号。

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: 输入相同但引用不相等：
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// 确定，因为无法比较条目

// 失败，因为 weakMap3 具有 weakMap1 不包含的属性：
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: 期望输入是严格深度相等的：
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

如果值不相等，则抛出 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，并且 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出该实例而不是 `AssertionError`。


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 此 API 不再是实验性的。 |
| v13.6.0, v12.16.0 | 添加于: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

期望 `string` 输入与正则表达式不匹配。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: 期望输入不匹配 ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: "string" 参数的类型必须为 string。

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: 期望输入不匹配 ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: "string" 参数的类型必须为 string。

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

如果值匹配，或者 `string` 参数不是 `string` 类型，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配一个默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么它将被抛出，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**新增于: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

等待 `asyncFn` promise，或者如果 `asyncFn` 是一个函数，则立即调用该函数并等待返回的 promise 完成。 然后它将检查 promise 是否未被拒绝。

如果 `asyncFn` 是一个函数并且它同步抛出一个错误，`assert.doesNotReject()` 将返回一个被拒绝的 `Promise`，并带有该错误。 如果该函数没有返回一个 promise，`assert.doesNotReject()` 将返回一个被拒绝的 `Promise`，并带有 [`ERR_INVALID_RETURN_VALUE`](/zh/nodejs/api/errors#err_invalid_return_value) 错误。 在这两种情况下，错误处理程序都会被跳过。

实际上使用 `assert.doesNotReject()` 并没有什么用，因为捕获一个拒绝然后再次拒绝它没有什么好处。 相反，考虑在不应该拒绝的特定代码路径旁边添加一个注释，并保持错误消息尽可能具有表达性。

如果指定了 `error`，它可以是一个 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)，[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 或一个验证函数。 有关更多详细信息，请参见 [`assert.throws()`](/zh/nodejs/api/assert#assertthrowsfn-error-message)。

除了等待完成的异步特性外，其行为与 [`assert.doesNotThrow()`](/zh/nodejs/api/assert#assertdoesnotthrowfn-error-message) 完全相同。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v5.11.0, v4.4.5 | 现在会考虑 `message` 参数。 |
| v4.2.0 | `error` 参数现在可以是一个箭头函数。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

断言函数 `fn` 不会抛出错误。

使用 `assert.doesNotThrow()` 实际上没有用，因为捕获一个错误然后重新抛出它没有任何好处。 考虑在不应该抛出的特定代码路径旁边添加注释，并保持错误消息尽可能具有表达力。

当调用 `assert.doesNotThrow()` 时，它会立即调用 `fn` 函数。

如果抛出一个错误，并且它的类型与 `error` 参数指定的类型相同，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。 如果错误是不同的类型，或者 `error` 参数未定义，则该错误会传播回调用者。

如果指定了 `error`，它可以是一个 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)，[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)，或者一个验证函数。 详见 [`assert.throws()`](/zh/nodejs/api/assert#assertthrowsfn-error-message)。

例如，以下代码会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)，因为断言中没有匹配的错误类型：

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
:::

但是，以下代码将导致一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，并显示消息“Got unwanted exception...”：

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
:::

如果抛出了一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror) 并且为 `message` 参数提供了一个值，则 `message` 的值将附加到 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror) 消息：

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
:::

## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0, v14.18.0 | 在旧式断言模式中，状态从已弃用更改为旧式。 |
| v14.0.0 | 现在，如果双方都是 NaN，则将 NaN 视为相同。 |
| v0.1.21 | 添加于：v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**严格断言模式**

[`assert.strictEqual()`](/zh/nodejs/api/assert#assertstrictequalactual-expected-message) 的别名。

**旧式断言模式**

::: info [稳定: 3 - 旧式]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 旧式：请改用 [`assert.strictEqual()`](/zh/nodejs/api/assert#assertstrictequalactual-expected-message)。
:::

使用 [`==` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) 测试 `actual` 和 `expected` 参数之间的浅层、强制相等性。 `NaN` 经过特殊处理，如果双方都是 `NaN`，则被视为相同。

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

如果这些值不相等，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配一个默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出该实例而不是 `AssertionError`。


## `assert.fail([message])` {#assertfailmessage}

**添加于: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **默认:** `'Failed'`

抛出一个带有提供的错误消息或默认错误消息的 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么它将被抛出，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。

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

可以使用带有两个以上参数的 `assert.fail()`，但是已弃用。 见下文了解更多详情。

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 使用多于一个参数调用 `assert.fail()` 已被弃用并发出警告。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定度: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 `assert.fail([message])` 或其他 assert 函数。
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **默认:** `assert.fail`

如果 `message` 是 falsy 值，则错误消息设置为由提供的 `operator` 分隔的 `actual` 和 `expected` 的值。 如果仅提供两个 `actual` 和 `expected` 参数，则 `operator` 将默认为 `'!='`。 如果 `message` 作为第三个参数提供，它将用作错误消息，并且其他参数将作为属性存储在抛出的对象上。 如果提供了 `stackStartFn`，则该函数之上的所有堆栈帧都将从堆栈跟踪中删除（请参阅 [`Error.captureStackTrace`](/zh/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)）。 如果没有给出任何参数，将使用默认消息 `Failed`。

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

在最后三种情况下，`actual`、`expected` 和 `operator` 对错误消息没有影响。

以下是使用 `stackStartFn` 截断异常堆栈跟踪的示例：

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 现在，它不是抛出原始错误，而是将其包装到包含完整堆栈跟踪的 [`AssertionError`][] 中。 |
| v10.0.0 | 现在，Value 只能是 `undefined` 或 `null`。 之前，所有 falsy 值都与 `null` 的处理方式相同，并且不会抛出错误。 |
| v0.1.97 | 添加于: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

如果 `value` 不是 `undefined` 或 `null`，则抛出 `value`。 这在测试回调中的 `error` 参数时很有用。 堆栈跟踪包含从传递给 `ifError()` 的错误中的所有帧，包括 `ifError()` 本身潜在的新帧。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: Error

// 创建一些随机的错误帧。
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: Error

// 创建一些随机的错误帧。
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError 得到了不需要的异常: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 此 API 不再是实验性的。 |
| v13.6.0, v12.16.0 | 添加于：v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

期望 `string` 输入与正则表达式匹配。

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

如果值不匹配，或者 `string` 参数不是 `string` 类型，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为 `message` 参数的值。 如果 `message` 参数未定义，则会分配一个默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出该实例，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0, v14.18.0 | 在旧版断言模式下，已将状态从“已弃用”更改为“旧版”。 |
| v14.0.0 | 如果双方都是 NaN，现在将 NaN 视为相同。 |
| v9.0.0 | 现在可以正确比较 `Error` 名称和消息。 |
| v8.0.0 | 还会比较 `Set` 和 `Map` 的内容。 |
| v6.4.0, v4.7.1 | 现在可以正确处理类型化数组切片。 |
| v6.1.0, v4.5.0 | 现在可以使用具有循环引用的对象作为输入。 |
| v5.10.1, v4.4.3 | 正确处理非 `Uint8Array` 类型化数组。 |
| v0.1.21 | 添加于：v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**严格断言模式**

[`assert.notDeepStrictEqual()`](/zh/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) 的别名。

**旧版断言模式**

::: info [Stable: 3 - Legacy]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 旧版：请改用 [`assert.notDeepStrictEqual()`](/zh/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message)。
:::

测试任何深层不等式。 与 [`assert.deepEqual()`](/zh/nodejs/api/assert#assertdeepequalactual-expected-message) 相反。

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

如果值深层相等，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为 `message` 参数的值。 如果 `message` 参数未定义，则会分配一个默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出该实例，而不是 `AssertionError`。


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | `-0` 和 `+0` 不再被认为是相等的。 |
| v9.0.0 | 现在使用 [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 比较来比较 `NaN`。 |
| v9.0.0 | 现在可以正确比较 `Error` 的名称和消息。 |
| v8.0.0 | 也会比较 `Set` 和 `Map` 的内容。 |
| v6.1.0 | 现在可以将具有循环引用的对象用作输入。 |
| v6.4.0, v4.7.1 | 现在可以正确处理类型化数组切片。 |
| v5.10.1, v4.4.3 | 正确处理非 `Uint8Array` 类型化数组。 |
| v1.2.0 | 添加于: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

测试深度严格不等性。 是 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message) 的反面。

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

如果值在深度和严格上相等，则抛出 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，并且 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，则会抛出它，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0, v14.18.0 | 在旧版断言模式中，状态从“已弃用”更改为“旧版”。 |
| v14.0.0 | 如果双方都是 NaN，则 NaN 现在被视为相同。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**严格断言模式**

是 [`assert.notStrictEqual()`](/zh/nodejs/api/assert#assertnotstrictequalactual-expected-message) 的别名。

**旧版断言模式**

::: info [稳定度: 3 - 旧版]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定度: 3](/zh/nodejs/api/documentation#stability-index) - 旧版：请改用 [`assert.notStrictEqual()`](/zh/nodejs/api/assert#assertnotstrictequalactual-expected-message)。
:::

使用 [`!=` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality)测试浅层强制不等性。 `NaN` 经过特殊处理，如果双方都是 `NaN`，则被视为相同。

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

如果值相等，则会抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，并且 `message` 属性会被设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则会分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么将会抛出该实例而不是 `AssertionError`。


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 使用的比较从严格相等更改为 `Object.is()`。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

根据 [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 确定的 `actual` 和 `expected` 参数之间的严格不相等性测试。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: 期望 "actual" 严格不等于:
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
// AssertionError [ERR_ASSERTION]: 期望 "actual" 严格不等于:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

如果值严格相等，则抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么将抛出它而不是 `AssertionError`。

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 现在 `assert.ok()` （没有参数）将使用预定义的错误消息。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

测试 `value` 是否为真值。 它等价于 `assert.equal(!!value, true, message)`。

如果 `value` 不是真值，则抛出一个 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数是 `undefined`，则分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么将抛出它而不是 `AssertionError`。 如果根本没有传入任何参数，则 `message` 将设置为字符串: `'No value argument passed to `assert.ok()`'`。

请注意，在 `repl` 中，错误消息将与文件中抛出的错误消息不同！ 请参阅下文了解更多详细信息。

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

**添加于: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

等待 `asyncFn` promise，或者，如果 `asyncFn` 是一个函数，则立即调用该函数并等待返回的 promise 完成。 然后它将检查 promise 是否被拒绝。

如果 `asyncFn` 是一个函数并且它同步抛出一个错误，`assert.rejects()` 将返回一个带有该错误的被拒绝的 `Promise`。 如果该函数没有返回 promise，`assert.rejects()` 将返回一个带有 [`ERR_INVALID_RETURN_VALUE`](/zh/nodejs/api/errors#err_invalid_return_value) 错误的被拒绝的 `Promise`。 在这两种情况下，都会跳过错误处理程序。

除了等待完成的异步特性外，其行为与 [`assert.throws()`](/zh/nodejs/api/assert#assertthrowsfn-error-message) 完全相同。

如果指定了 `error`，则可以是 [\<Class\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)、验证函数、一个对象（将测试每个属性）或一个错误实例（将测试每个属性，包括不可枚举的 `message` 和 `name` 属性）。

如果指定了 `message`，如果 `asyncFn` 未能拒绝，则它将是由 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror) 提供的消息。

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

`error` 不能是字符串。 如果将字符串作为第二个参数提供，则假定已省略 `error`，并且该字符串将改用于 `message`。 这可能导致容易遗漏的错误。 如果考虑使用字符串作为第二个参数，请仔细阅读 [`assert.throws()`](/zh/nodejs/api/assert#assertthrowsfn-error-message) 中的示例。


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 使用的比较从严格相等更改为 `Object.is()`。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

测试 `actual` 和 `expected` 参数之间的严格相等性，由 [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 确定。

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

如果值不严格相等，则抛出 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)，其 `message` 属性设置为等于 `message` 参数的值。 如果 `message` 参数未定义，则分配默认错误消息。 如果 `message` 参数是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例，那么它将被抛出，而不是 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.2.0 | `error` 参数现在可以是一个包含正则表达式的对象。 |
| v9.9.0 | `error` 参数现在也可以是一个对象。 |
| v4.2.0 | `error` 参数现在可以是一个箭头函数。 |
| v0.1.21 | 添加于: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

期望函数 `fn` 抛出一个错误。

如果指定了 `error`，则它可以是一个 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)，[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)，一个验证函数，一个验证对象（其中每个属性都将针对严格深度相等进行测试），或者一个错误实例（其中每个属性都将针对严格深度相等进行测试，包括不可枚举的 `message` 和 `name` 属性）。 当使用对象时，也可以使用正则表达式，当针对字符串属性进行验证时。 请参见下面的示例。

如果指定了 `message`，则如果 `fn` 调用未抛出错误或错误验证失败，则 `message` 将附加到 `AssertionError` 提供的消息中。

自定义验证对象/错误实例：

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Wrong value');
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
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // 仅测试验证对象上的属性。
    // 使用嵌套对象需要存在所有属性。 否则验证将失败。
  },
);

// 使用正则表达式验证错误属性：
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` 和 `message` 属性是字符串，并且在它们上使用正则表达式将
    // 匹配字符串。 如果它们失败，则会抛出错误。
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // 无法对嵌套属性使用正则表达式！
      baz: 'text',
    },
    // `reg` 属性包含一个正则表达式，并且仅当验证对象包含相同的
    // 正则表达式时，它才会通过。
    reg: /abc/i,
  },
);

// 由于不同的 `message` 和 `name` 属性而失败：
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // 将所有可枚举属性从 `err` 复制到 `otherErr`。
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // 当使用错误作为验证对象时，还将检查该错误的 `message` 和 `name` 属性。
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Wrong value');
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
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // 仅测试验证对象上的属性。
    // 使用嵌套对象需要存在所有属性。 否则验证将失败。
  },
);

// 使用正则表达式验证错误属性：
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` 和 `message` 属性是字符串，并且在它们上使用正则表达式将
    // 匹配字符串。 如果它们失败，则会抛出错误。
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // 无法对嵌套属性使用正则表达式！
      baz: 'text',
    },
    // `reg` 属性包含一个正则表达式，并且仅当验证对象包含相同的
    // 正则表达式时，它才会通过。
    reg: /abc/i,
  },
);

// 由于不同的 `message` 和 `name` 属性而失败：
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // 将所有可枚举属性从 `err` 复制到 `otherErr`。
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // 当使用错误作为验证对象时，还将检查该错误的 `message` 和 `name` 属性。
  err,
);
```
:::

使用构造函数验证 instanceof：

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```
:::

使用 [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 验证错误消息：

使用正则表达式在错误对象上运行 `.toString`，因此也将包括错误名称。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```
:::

自定义错误验证：

该函数必须返回 `true` 以指示所有内部验证均已通过。 否则，它将因 [`AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror) 而失败。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // 避免从验证函数中返回任何内容，除了 `true`。
    // 否则，不清楚验证的哪个部分失败了。 相反，抛出有关特定验证的错误（如在本示例中所示），并向该错误添加尽可能多的有用的调试信息。
    return true;
  },
  'unexpected error',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // 避免从验证函数中返回任何内容，除了 `true`。
    // 否则，不清楚验证的哪个部分失败了。 相反，抛出有关特定验证的错误（如在本示例中所示），并向该错误添加尽可能多的有用的调试信息。
    return true;
  },
  'unexpected error',
);
```
:::

`error` 不能是字符串。 如果将字符串作为第二个参数提供，则假定省略 `error`，并且该字符串将改为用于 `message`。 这可能导致容易忽略的错误。 使用与抛出的错误消息相同的消息将导致 `ERR_AMBIGUOUS_ARGUMENT` 错误。 如果考虑将字符串用作第二个参数，请仔细阅读以下示例：

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

// 第二个参数是一个字符串，并且输入函数抛出一个 Error。
// 第一种情况不会抛出，因为它与输入函数抛出的错误消息不匹配！
assert.throws(throwingFirst, 'Second');
// 在下一个示例中，该消息与错误中的消息相比没有任何好处，并且由于不清楚用户是否打算实际匹配
// 错误消息，因此 Node.js 抛出 `ERR_AMBIGUOUS_ARGUMENT` 错误。
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 仅在函数未抛出错误的情况下，才使用该字符串（作为消息）：
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// 如果打算匹配错误消息，请改为执行此操作：
// 它不会抛出，因为错误消息匹配。
assert.throws(throwingSecond, /Second$/);

// 如果错误消息不匹配，则会抛出 AssertionError。
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

// 第二个参数是一个字符串，并且输入函数抛出一个 Error。
// 第一种情况不会抛出，因为它与输入函数抛出的错误消息不匹配！
assert.throws(throwingFirst, 'Second');
// 在下一个示例中，该消息与错误中的消息相比没有任何好处，并且由于不清楚用户是否打算实际匹配
// 错误消息，因此 Node.js 抛出 `ERR_AMBIGUOUS_ARGUMENT` 错误。
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 仅在函数未抛出错误的情况下，才使用该字符串（作为消息）：
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// 如果打算匹配错误消息，请改为执行此操作：
// 它不会抛出，因为错误消息匹配。
assert.throws(throwingSecond, /Second$/);

// 如果错误消息不匹配，则会抛出 AssertionError。
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

由于令人困惑且容易出错的表示法，请避免将字符串作为第二个参数。


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**新增于: v23.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/zh/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) 通过深度比较断言 `actual` 和 `expected` 参数之间的等价性，确保 `expected` 参数中的所有属性都存在于 `actual` 参数中，并且具有等效的值，不允许类型强制转换。与 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message) 的主要区别在于 [`assert.partialDeepStrictEqual()`](/zh/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) 不要求 `actual` 参数中的所有属性都存在于 `expected` 参数中。 此方法应始终通过与 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message) 相同的测试用例，表现为它的超集。

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

