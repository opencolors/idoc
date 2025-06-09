---
title: Node.js VM 模块文档
description: Node.js 中的 VM（虚拟机）模块提供了在 V8 JavaScript 引擎上下文中编译和运行代码的 API。它允许创建隔离的 JavaScript 环境，沙箱化代码执行，并管理脚本上下文。
head:
  - - meta
    - name: og:title
      content: Node.js VM 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的 VM（虚拟机）模块提供了在 V8 JavaScript 引擎上下文中编译和运行代码的 API。它允许创建隔离的 JavaScript 环境，沙箱化代码执行，并管理脚本上下文。
  - - meta
    - name: twitter:title
      content: Node.js VM 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的 VM（虚拟机）模块提供了在 V8 JavaScript 引擎上下文中编译和运行代码的 API。它允许创建隔离的 JavaScript 环境，沙箱化代码执行，并管理脚本上下文。
---


# VM (执行 JavaScript) {#vm-executing-javascript}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

`node:vm` 模块可以在 V8 虚拟机上下文中编译和运行代码。

**`node:vm` 模块不是一种安全机制。 不要用它来运行不受信任的代码。**

JavaScript 代码可以被编译并立即运行，也可以被编译、保存并在以后运行。

一个常见的用例是在不同的 V8 上下文中运行代码。 这意味着调用的代码具有与调用代码不同的全局对象。

可以通过[*上下文关联*](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)一个对象来提供上下文。 调用的代码将上下文中的任何属性都视为全局变量。 由调用的代码引起的对全局变量的任何更改都将反映在上下文对象中。

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // 上下文关联该对象。

const code = 'x += 40; var y = 17;';
// `x` 和 `y` 是上下文中的全局变量。
// 最初，x 的值为 2，因为那是 context.x 的值。
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y 未定义。
```
## 类: `vm.Script` {#class-vmscript}

**加入于: v0.3.1**

`vm.Script` 类的实例包含可以在特定上下文中执行的预编译脚本。

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v17.0.0, v16.12.0 | 添加了对 `importModuleDynamically` 参数的导入属性的支持。 |
| v10.6.0 | `produceCachedData` 已弃用，推荐使用 `script.createCachedData()`。 |
| v5.7.0 | 现在支持 `cachedData` 和 `produceCachedData` 选项。 |
| v0.3.1 | 加入于: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译的 JavaScript 代码。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定此脚本生成的堆栈跟踪中使用的文件名。 **默认值:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的行号偏移量。 **默认值:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的第一行列号偏移量。 **默认值:** `0`。
    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供可选的 `Buffer` 或 `TypedArray`，或带有 V8 代码缓存数据的 `DataView` 以用于提供的源。 如果提供，则 `cachedDataRejected` 值将设置为 `true` 或 `false`，具体取决于 V8 是否接受数据。
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 且不存在 `cachedData` 时，V8 将尝试为 `code` 生成代码缓存数据。 成功后，将生成带有 V8 代码缓存数据的 `Buffer` 并将其存储在返回的 `vm.Script` 实例的 `cachedData` 属性中。 `cachedDataProduced` 值将设置为 `true` 或 `false`，具体取决于是否成功生成代码缓存数据。 此选项已被**弃用**，推荐使用 `script.createCachedData()`。 **默认值:** `false`。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在调用 `import()` 时，如何在评估此脚本期间加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参阅[在编译 API 中支持动态 `import()` ](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。

如果 `options` 是一个字符串，那么它指定文件名。

创建一个新的 `vm.Script` 对象会编译 `code` 但不运行它。 编译后的 `vm.Script` 稍后可以多次运行。 `code` 不绑定到任何全局对象； 而是每次运行之前绑定，仅用于该运行。


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**添加于: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

当提供 `cachedData` 来创建 `vm.Script` 时，此值将根据 V8 是否接受数据设置为 `true` 或 `false`。 否则，该值为 `undefined`。

### `script.createCachedData()` {#scriptcreatecacheddata}

**添加于: v10.6.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

创建一个可用于 `Script` 构造函数的 `cachedData` 选项的代码缓存。 返回一个 `Buffer`。 可以随时调用此方法，次数不限。

`Script` 的代码缓存不包含任何 JavaScript 可观察状态。 代码缓存可以安全地与脚本源码一起保存，并多次用于构造新的 `Script` 实例。

`Script` 源码中的函数可以标记为延迟编译，并且在构造 `Script` 时不会编译它们。 这些函数将在第一次调用时编译。 代码缓存序列化 V8 当前知道的关于 `Script` 的元数据，它可以用来加速未来的编译。

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// 在 `cacheWithoutAdd` 中，函数 `add()` 被标记为在调用时进行完全编译。

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` 包含完全编译的函数 `add()`。
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 由 `vm.createContext()` 方法返回的[上下文隔离的](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)对象。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的行代码将附加到堆栈跟踪中。 **默认值:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前执行 `code` 的毫秒数。 如果执行终止，将抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 该值必须是一个严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，接收到 `SIGINT` (+) 将终止执行并抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 通过 `process.on('SIGINT')` 附加的事件的现有处理程序在脚本执行期间被禁用，但在之后继续工作。 **默认值:** `false`。

- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 脚本中执行的最后一个语句的结果。

在给定的 `contextifiedObject` 中运行 `vm.Script` 对象包含的已编译代码，并返回结果。 运行代码无法访问本地作用域。

以下示例编译增加全局变量、设置另一个全局变量的值的代码，然后多次执行该代码。 全局变量包含在 `context` 对象中。

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
// 打印: { animal: 'cat', count: 12, name: 'kitty' }
```
使用 `timeout` 或 `breakOnSigint` 选项将导致启动新的事件循环和相应的线程，这会产生非零的性能开销。


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 参数现在接受 `vm.constants.DONT_CONTEXTIFY`。 |
| v14.6.0 | 现在支持 `microtaskMode` 选项。 |
| v10.0.0 | 现在支持 `contextCodeGeneration` 选项。 |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/zh/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 或是 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify) ，或是一个将会被[上下文隔离](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)的对象。 如果是 `undefined`，则会创建一个空的上下文隔离对象以保持向后兼容。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的行代码将附加到堆栈跟踪中。 **默认:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前执行 `code` 的毫秒数。 如果执行被终止，将抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 此值必须是严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则接收 `SIGINT` (+) 将终止执行并抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 通过 `process.on('SIGINT')` 附加的事件的现有处理程序在脚本执行期间被禁用，但在之后继续工作。 **默认:** `false`。
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新创建的上下文的人工可读名称。 **默认:** `'VM Context i'`，其中 `i` 是创建的上下文的递增数字索引。
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 出于显示目的，对应于新创建的上下文的 [Origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。 原点应格式化为 URL，但只有方案、主机和端口（如果需要），如 [`URL`](/zh/nodejs/api/url#class-url) 对象的 [`url.origin`](/zh/nodejs/api/url#urlorigin) 属性的值。 最值得注意的是，此字符串应省略尾部斜杠，因为它表示路径。 **默认:** `''`。
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则对 `eval` 或函数构造函数（`Function`，`GeneratorFunction` 等）的任何调用都将抛出 `EvalError`。 **默认:** `true`。
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则任何尝试编译 WebAssembly 模块的操作都将抛出 `WebAssembly.CompileError`。 **默认:** `true`。


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果设置为 `afterEvaluate`，微任务（通过 `Promise` 和 `async function` 调度的任务）将在脚本运行后立即运行。 在这种情况下，它们包含在 `timeout` 和 `breakOnSigint` 范围内。


- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 脚本中执行的最后一个语句的结果。

此方法是 `script.runInContext(vm.createContext(options), options)` 的快捷方式。 它同时做了几件事：

以下示例编译了设置全局变量的代码，然后在不同的上下文中多次执行该代码。 全局变量在每个单独的 `context` 中设置并包含在其中。

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// 如果上下文是从上下文隔离的对象创建的，这将抛出错误。
// vm.constants.DONT_CONTEXTIFY 允许创建具有可以冻结的普通全局对象的上下文。
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的行代码将附加到堆栈跟踪中。 **默认:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定执行 `code` 的毫秒数，超过该毫秒数将终止执行。 如果执行被终止，则将抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 该值必须是一个严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，接收到 `SIGINT` (+) 将终止执行并抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 在脚本执行期间，通过 `process.on('SIGINT')` 附加的事件的现有处理程序将被禁用，但在之后继续工作。 **默认:** `false`。
  
 
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 脚本中执行的最后一个语句的结果。

在当前 `global` 对象的上下文中运行 `vm.Script` 包含的已编译代码。 运行代码无法访问本地作用域，但*可以*访问当前 `global` 对象。

以下示例编译递增 `global` 变量的代码，然后多次执行该代码：

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

**添加于: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

当脚本从包含 source map 魔术注释的源编译时，此属性将设置为 source map 的 URL。

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

## 类: `vm.Module` {#class-vmmodule}

**添加于: v13.0.0, v12.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

此功能仅在使用启用的 `--experimental-vm-modules` 命令行标志时可用。

`vm.Module` 类提供了一个低级接口，用于在 VM 上下文中使用 ECMAScript 模块。 它是 `vm.Script` 类的对应物，它与 ECMAScript 规范中定义的 [模块记录](https://262.ecma-international.org/14.0/#sec-abstract-module-records) 紧密对应。

但与 `vm.Script` 不同，每个 `vm.Module` 对象都绑定到创建它的上下文。 与 `vm.Script` 对象的同步性质相反，对 `vm.Module` 对象的操作本质上是异步的。 使用 'async' 函数可以帮助操作 `vm.Module` 对象。

使用 `vm.Module` 对象需要三个不同的步骤：创建/解析、链接和评估。 以下示例说明了这三个步骤。

此实现比 [ECMAScript 模块加载器](/zh/nodejs/api/esm#modules-ecmascript-modules) 处于更低的级别。 目前也没有与加载器交互的方式，但计划支持。

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// 通过构造一个新的 `vm.SourceTextModule` 对象来创建一个模块。 这会
// 解析提供的源文本，如果出现任何问题，则抛出 `SyntaxError`。 默认情况下，会在
// 顶层上下文中创建一个模块。 但在这里，我们将 `contextifiedObject` 指定为
// 此模块所属的上下文。
//
// 在这里，我们尝试从模块 "foo" 获取默认导出，并将其放入
// 局部绑定 "secret" 中。

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// 将此模块导入的依赖项“链接”到它。
//
// 提供的链接回调（“链接器”）接受两个参数：父模块（在本例中为 `bar`）和作为
// 导入模块的说明符的字符串。 回调应返回一个与提供的说明符相对应的模块，
// 并具有 `module.link()` 中记录的某些要求。
//
// 如果返回的模块尚未开始链接，则将在返回的模块上调用相同的链接器回调。
//
// 即使是没有依赖项的顶级模块也必须显式链接。 但是，提供的回调永远不会被调用。
//
// link() 方法返回一个 Promise，该 Promise 将在链接器返回的所有 Promise 都解决后解决。
//
// 注意：这是一个人为的示例，因为链接器函数每次调用时都会创建一个新的 "foo" 模块。
// 在一个成熟的模块系统中，可能会使用缓存来避免重复的模块。

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // "secret" 变量引用我们在创建上下文时添加到 "contextifiedObject" 的全局变量。
      export default secret;
    `, { context: referencingModule.context });

    // 在这里使用 `contextifiedObject` 而不是 `referencingModule.context`
    // 也可以。
  }
  throw new Error(`无法解析依赖项: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// 评估模块。 evaluate() 方法返回一个 promise，该 promise 将在模块完成评估后解决。

// 打印 42。
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // 通过构造一个新的 `vm.SourceTextModule` 对象来创建一个模块。 这会
  // 解析提供的源文本，如果出现任何问题，则抛出 `SyntaxError`。 默认情况下，会在
  // 顶层上下文中创建一个模块。 但在这里，我们将 `contextifiedObject` 指定为
  // 此模块所属的上下文。
  //
  // 在这里，我们尝试从模块 "foo" 获取默认导出，并将其放入
  // 局部绑定 "secret" 中。

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // 将此模块导入的依赖项“链接”到它。
  //
  // 提供的链接回调（“链接器”）接受两个参数：父模块（在本例中为 `bar`）和作为
  // 导入模块的说明符的字符串。 回调应返回一个与提供的说明符相对应的模块，
  // 并具有 `module.link()` 中记录的某些要求。
  //
  // 如果返回的模块尚未开始链接，则将在返回的模块上调用相同的链接器回调。
  //
  // 即使是没有依赖项的顶级模块也必须显式链接。 但是，提供的回调永远不会被调用。
  //
  // link() 方法返回一个 Promise，该 Promise 将在链接器返回的所有 Promise 都解决后解决。
  //
  // 注意：这是一个人为的示例，因为链接器函数每次调用时都会创建一个新的 "foo" 模块。
  // 在一个成熟的模块系统中，可能会使用缓存来避免重复的模块。

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // "secret" 变量引用我们在创建上下文时添加到 "contextifiedObject" 的全局变量。
        export default secret;
      `, { context: referencingModule.context });

      // 在这里使用 `contextifiedObject` 而不是 `referencingModule.context`
      // 也可以。
    }
    throw new Error(`无法解析依赖项: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // 评估模块。 evaluate() 方法返回一个 promise，该 promise 将在模块完成评估后解决。

  // 打印 42。
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此模块所有依赖项的标识符。 返回的数组被冻结，以禁止对其进行任何更改。

对应于 ECMAScript 规范中[循环模块记录](https://tc39.es/ecma262/#sec-cyclic-module-records)的 `[[RequestedModules]]` 字段。

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

如果 `module.status` 是 `'errored'`，则此属性包含模块在评估期间抛出的异常。 如果状态是其他任何状态，则访问此属性将导致抛出异常。

由于可能与 `throw undefined;` 存在歧义，因此值 `undefined` 不能用于没有抛出异常的情况。

对应于 ECMAScript 规范中[循环模块记录](https://tc39.es/ecma262/#sec-cyclic-module-records)的 `[[EvaluationError]]` 字段。

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前评估的毫秒数。 如果执行中断，将抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 该值必须是一个严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，接收到 `SIGINT` (+) 将终止执行并抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 在脚本执行期间，通过 `process.on('SIGINT')` 附加的现有事件处理程序将被禁用，但在脚本执行后会继续工作。 **默认:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时解析为 `undefined`。

评估模块。

必须在模块链接后调用此方法；否则它将拒绝。 也可以在模块已经被评估后调用此方法，在这种情况下，如果初始评估以成功结束（`module.status` 为 `'evaluated'`），它将不执行任何操作；或者它将重新抛出初始评估导致的异常（`module.status` 为 `'errored'`）。

在模块正在被评估时（`module.status` 为 `'evaluating'`）不能调用此方法。

对应于 ECMAScript 规范中[循环模块记录](https://tc39.es/ecma262/#sec-cyclic-module-records)的 [Evaluate() 具体方法](https://tc39.es/ecma262/#sec-moduleevaluation) 字段。


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当前模块的标识符，在构造函数中设置。

### `module.link(linker)` {#modulelinklinker}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | `extra.assert` 选项已重命名为 `extra.attributes`。为了向后兼容，仍然提供之前的名称。 |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 所请求模块的说明符：
    -  `referencingModule` [\<vm.Module\>](/zh/nodejs/api/vm#class-vmmodule) 调用 `link()` 的 `Module` 对象。
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 来自属性的数据：根据 ECMA-262，如果存在不支持的属性，宿主应触发错误。
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `extra.attributes` 的别名。
  
 
    -  返回: [\<vm.Module\>](/zh/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

链接模块依赖项。 此方法必须在求值之前调用，并且每个模块只能调用一次。

该函数应返回一个 `Module` 对象或一个最终解析为 `Module` 对象的 `Promise`。 返回的 `Module` 必须满足以下两个不变性：

- 它必须与父 `Module` 属于同一个上下文。
- 它的 `status` 不能是 `'errored'`。

如果返回的 `Module` 的 `status` 是 `'unlinked'`，则将使用相同的提供的 `linker` 函数在返回的 `Module` 上递归调用此方法。

`link()` 返回一个 `Promise`，当所有链接实例都解析为有效的 `Module` 时，它将被解析，如果链接器函数抛出异常或返回无效的 `Module`，它将被拒绝。

链接器函数大致对应于 ECMAScript 规范中实现定义的 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 抽象操作，但有一些关键区别：

- 链接器函数允许是异步的，而 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 是同步的。

在模块链接期间使用的实际 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 实现是返回链接期间链接的模块的实现。 由于到那时所有模块都已完全链接，因此 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 实现完全符合规范。

对应于 ECMAScript 规范中 [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s 的 [Link() 具体方法](https://tc39.es/ecma262/#sec-moduledeclarationlinking) 字段。


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

模块的命名空间对象。仅在链接 (`module.link()`) 完成后可用。

对应于 ECMAScript 规范中的 [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) 抽象操作。

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

模块的当前状态。将为以下之一：

-  `'unlinked'`：尚未调用 `module.link()`。
-  `'linking'`：已调用 `module.link()`，但链接器函数返回的所有 Promise 尚未解析。
-  `'linked'`：模块已成功链接，并且其所有依赖项都已链接，但尚未调用 `module.evaluate()`。
-  `'evaluating'`：模块正在通过其自身或父模块上的 `module.evaluate()` 进行评估。
-  `'evaluated'`：模块已成功评估。
-  `'errored'`：模块已评估，但抛出了一个异常。

除了 `'errored'` 之外，此状态字符串对应于规范的 [循环模块记录](https://tc39.es/ecma262/#sec-cyclic-module-records) 的 `[[Status]]` 字段。 `'errored'` 对应于规范中的 `'evaluated'`，但 `[[EvaluationError]]` 设置为非 `undefined` 的值。

## 类: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**添加于: v9.6.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

此特性仅在启用了 `--experimental-vm-modules` 命令行标志时可用。

- 继承自: [\<vm.Module\>](/zh/nodejs/api/vm#class-vmmodule)

`vm.SourceTextModule` 类提供了 ECMAScript 规范中定义的 [源文本模块记录](https://tc39.es/ecma262/#sec-source-text-module-records)。

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.0.0, v16.12.0 | 为 `importModuleDynamically` 参数添加了对导入属性的支持。 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的 JavaScript 模块代码
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于堆栈跟踪的字符串。 **默认:** `'vm:module(i)'`，其中 `i` 是特定于上下文的递增索引。
    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供一个可选的 `Buffer` 或 `TypedArray`，或者带有 V8 代码缓存数据的 `DataView`，用于提供的源代码。 `code` 必须与从中创建此 `cachedData` 的模块相同。
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 由 `vm.createContext()` 方法返回的 [上下文对象](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)，用于编译和评估此 `Module`。 如果未指定上下文，则该模块将在当前执行上下文中评估。
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定由该 `Module` 产生的堆栈跟踪中显示的行号偏移量。 **默认:** `0`。
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定由该 `Module` 产生的堆栈跟踪中显示的第一行列号偏移量。 **默认:** `0`。
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在评估此 `Module` 期间调用以初始化 `import.meta`。
    - `meta` [\<import.meta\>](/zh/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/zh/nodejs/api/vm#class-vmsourcetextmodule)


    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于指定在使用 `import()` 调用时，在此模块的评估期间应如何加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参阅 [编译 API 中对动态 `import()` 的支持](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。



创建新的 `SourceTextModule` 实例。

分配给 `import.meta` 对象的作为对象的属性可能允许模块访问指定 `context` 之外的信息。 使用 `vm.runInContext()` 在特定上下文中创建对象。



::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // 注意：此对象是在顶级上下文中创建的。 因此，
      // Object.getPrototypeOf(import.meta.prop) 指向
      // 顶级上下文中的 Object.prototype，而不是
      // 上下文对象中的 Object.prototype。
      meta.prop = {};
    },
  });
// 由于模块没有依赖项，因此永远不会调用链接器函数。
await module.link(() => {});
await module.evaluate();

// 现在，Object.prototype.secret 将等于 42。
//
// 要解决此问题，请替换
//     meta.prop = {};
// 上面的内容为
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
        // 注意：此对象是在顶级上下文中创建的。 因此，
        // Object.getPrototypeOf(import.meta.prop) 指向
        // 顶级上下文中的 Object.prototype，而不是
        // 上下文对象中的 Object.prototype。
        meta.prop = {};
      },
    });
  // 由于模块没有依赖项，因此永远不会调用链接器函数。
  await module.link(() => {});
  await module.evaluate();
  // 现在，Object.prototype.secret 将等于 42。
  //
  // 要解决此问题，请替换
  //     meta.prop = {};
  // 上面的内容为
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**加入于: v13.7.0, v12.17.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

创建一个可以与 `SourceTextModule` 构造函数的 `cachedData` 选项一起使用的代码缓存。返回一个 `Buffer`。在模块被求值之前，可以调用此方法任意次数。

`SourceTextModule` 的代码缓存不包含任何 JavaScript 可观察状态。代码缓存可以安全地与脚本源码一起保存，并用于多次构造新的 `SourceTextModule` 实例。

`SourceTextModule` 源码中的函数可以被标记为延迟编译，并且它们不会在 `SourceTextModule` 构造时被编译。这些函数将在第一次被调用时编译。代码缓存序列化 V8 当前所知的关于 `SourceTextModule` 的元数据，它可以用于加速未来的编译。

```js [ESM]
// 创建一个初始模块
const module = new vm.SourceTextModule('const a = 1;');

// 从该模块创建缓存数据
const cachedData = module.createCachedData();

// 使用缓存数据创建一个新模块。代码必须相同。
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## 类: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**加入于: v13.0.0, v12.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

此功能仅在使用 `--experimental-vm-modules` 命令行标志启用时可用。

- 继承自: [\<vm.Module\>](/zh/nodejs/api/vm#class-vmmodule)

`vm.SyntheticModule` 类提供了 WebIDL 规范中定义的 [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records)。合成模块的目的是为向 ECMAScript 模块图公开非 JavaScript 资源提供通用接口。

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// 在链接中使用 `module`...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**新增于: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 将从模块导出的名称数组。
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 模块被求值时调用。
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于堆栈跟踪的字符串。 **默认值:** `'vm:module(i)'`，其中 `i` 是上下文特定的递增索引。
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 由 `vm.createContext()` 方法返回的 [上下文化的](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 对象，用于在此 `Module` 中编译和求值。

创建新的 `SyntheticModule` 实例。

分配给此实例导出的对象可能允许模块的导入者访问指定 `context` 之外的信息。 使用 `vm.runInContext()` 在特定上下文中创建对象。

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**新增于: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要设置的导出的名称。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要设置的导出的值。

此方法在模块链接后用于设置导出的值。 如果在模块链接之前调用它，则会抛出 [`ERR_VM_MODULE_STATUS`](/zh/nodejs/api/errors#err_vm_module_status) 错误。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v19.6.0, v18.15.0 | 如果传递了 `cachedData` 选项，则返回值现在包含 `cachedDataRejected`，其语义与 `vm.Script` 版本相同。 |
| v17.0.0, v16.12.0 | 添加了对 `importModuleDynamically` 参数的导入属性的支持。 |
| v15.9.0 | 再次添加 `importModuleDynamically` 选项。 |
| v14.3.0 | 由于兼容性问题，删除了 `importModuleDynamically`。 |
| v14.1.0, v13.14.0 | 现在支持 `importModuleDynamically` 选项。 |
| v10.10.0 | 添加于：v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译的函数体。
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 包含该函数所有参数的字符串数组。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定此脚本生成的堆栈跟踪中使用的文件名。**默认值:** `''`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定此脚本生成的堆栈跟踪中显示的行号偏移量。**默认值:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定此脚本生成的堆栈跟踪中显示的第一行列号偏移量。**默认值:** `0`。
    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供一个可选的 `Buffer` 或 `TypedArray`，或 `DataView`，其中包含 V8 为提供的源码提供的代码缓存数据。 这必须由先前调用具有相同 `code` 和 `params` 的 [`vm.compileFunction()`](/zh/nodejs/api/vm#vmcompilefunctioncode-params-options) 产生。
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指定是否生成新的缓存数据。**默认值:** `false`。
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 应该在其中编译所述函数的 [上下文对象](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)。
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个数组，包含要在编译时应用的一组上下文扩展（包装当前作用域的对象）。 **默认值:** `[]`。


- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在调用 `import()` 时，在此函数的求值期间应如何加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参见[在编译 API 中支持动态 `import()` ](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

将给定的代码编译到提供的上下文中（如果没有提供上下文，则使用当前上下文），并将其包装在具有给定 `params` 的函数中返回。


## `vm.constants` {#vmconstants}

**添加于: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个包含 VM 操作常用的常量的对象。

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**添加于: v21.7.0, v20.12.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

一个常量，可以作为 `vm.Script` 和 `vm.compileFunction()` 的 `importModuleDynamically` 选项使用，以便 Node.js 使用主上下文中的默认 ESM 加载器来加载请求的模块。

有关详细信息，请参阅[编译 API 中对动态 `import()` 的支持](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 参数现在接受 `vm.constants.DONT_CONTEXTIFY`。 |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v21.2.0, v20.11.0 | 现在支持 `importModuleDynamically` 选项。 |
| v14.6.0 | 现在支持 `microtaskMode` 选项。 |
| v10.0.0 | 第一个参数不能再是函数。 |
| v10.0.0 | 现在支持 `codeGeneration` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/zh/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 要么是 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify)，要么是将要被[上下文化的对象](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)。 如果是 `undefined`，则将创建一个空的上下文对象以实现向后兼容。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新创建的上下文的人类可读名称。 **默认:** `'VM Context i'`，其中 `i` 是创建的上下文的递增数值索引。
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)  对应于新创建的上下文的[来源](https://developer.mozilla.org/en-US/docs/Glossary/Origin)，用于显示目的。 来源的格式应类似于 URL，但只有协议、主机和端口（如果需要），如 [`url.origin`](/zh/nodejs/api/url#urlorigin) 属性的值 [`URL`](/zh/nodejs/api/url#class-url) 对象。 最值得注意的是，该字符串应省略尾部斜杠，因为它表示路径。 **默认:** `''`。
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则任何对 `eval` 或函数构造器（`Function`、`GeneratorFunction` 等）的调用都将抛出 `EvalError`。 **默认:** `true`。
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则任何编译 WebAssembly 模块的尝试都会抛出 `WebAssembly.CompileError`。 **默认:** `true`。
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果设置为 `afterEvaluate`，则微任务（通过 `Promise` 和 `async function` 安排的任务）将在脚本通过 [`script.runInContext()`](/zh/nodejs/api/vm#scriptrunincontextcontextifiedobject-options) 运行后立即运行。 在这种情况下，它们包含在 `timeout` 和 `breakOnSigint` 范围内。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在此上下文中调用 `import()` 时，应如何加载模块，而没有引用脚本或模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参阅[编译 API 中对动态 `import()` 的支持](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。
  
 
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 上下文化的对象。

如果给定的 `contextObject` 是一个对象，则 `vm.createContext()` 方法将[准备该对象](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)并返回对其的引用，以便它可以在调用 [`vm.runInContext()`](/zh/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) 或 [`script.runInContext()`](/zh/nodejs/api/vm#scriptrunincontextcontextifiedobject-options) 中使用。 在此类脚本中，全局对象将被 `contextObject` 包裹，保留其所有现有属性，但同时也具有任何标准[全局对象](https://es5.github.io/#x15.1) 具有的内置对象和函数。 在 vm 模块运行的脚本之外，全局变量将保持不变。

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// 打印: { globalVar: 2 }

console.log(global.globalVar);
// 打印: 3
```
如果省略 `contextObject`（或显式作为 `undefined` 传递），将返回一个新的、空的[上下文化的](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 对象。

当新创建的上下文中的全局对象被[上下文化](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)时，与普通的全局对象相比，它有一些怪癖。 例如，它不能被冻结。 要创建一个没有上下文怪癖的上下文，请传递 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify) 作为 `contextObject` 参数。 有关详细信息，请参阅 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify) 的文档。

`vm.createContext()` 方法主要用于创建可用于运行多个脚本的单个上下文。 例如，如果模拟 Web 浏览器，该方法可用于创建一个代表窗口全局对象的单个上下文，然后在该上下文中一起运行所有 `\<script\>` 标签。

上下文提供的 `name` 和 `origin` 通过 Inspector API 可见。


## `vm.isContext(object)` {#vmiscontextobject}

**加入于: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果给定的 `object` 对象已经使用 [`vm.createContext()`](/zh/nodejs/api/vm#vmcreatecontextcontextobject-options) [contextified](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)，或者它是使用 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify) 创建的上下文的全局对象，则返回 `true`。

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**加入于: v13.10.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

测量 V8 已知并且当前 V8 隔离区或主上下文已知的所有上下文使用的内存。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可选。
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'summary'` 或 `'detailed'`。 在 summary 模式下，仅返回为主上下文测量的内存。 在 detailed 模式下，将返回为当前 V8 隔离区已知的所有上下文测量的内存。 **默认值:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'` 或 `'eager'`。 使用 default 执行时，promise 将在下一次预定的垃圾回收开始后才会解析，这可能需要一段时间（或者如果程序在下一次 GC 之前退出则永远不会解析）。 使用 eager 执行时，将立即启动 GC 以测量内存。 **默认值:** `'default'`


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 如果内存测量成功，promise 将解析为一个包含内存使用情况信息的对象。 否则，它将以 `ERR_CONTEXT_NOT_INITIALIZED` 错误拒绝。

返回的 Promise 可能解析的对象的格式特定于 V8 引擎，并且可能因 V8 版本而异。

返回的结果与 `v8.getHeapSpaceStatistics()` 返回的统计信息不同，因为 `vm.measureMemory()` 测量当前 V8 引擎实例中每个 V8 特定上下文可访问的内存，而 `v8.getHeapSpaceStatistics()` 的结果测量当前 V8 实例中每个堆空间占用的内存。

```js [ESM]
const vm = require('node:vm');
// 测量主上下文使用的内存。
vm.measureMemory({ mode: 'summary' })
  // 这与 vm.measureMemory() 相同
  .then((result) => {
    // 当前格式为：
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
    // 在此处引用上下文，以便在测量完成之前不会对其进行 GC
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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v17.0.0, v16.12.0 | 增加了对 `importModuleDynamically` 参数的导入属性的支持。 |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译和运行的 JavaScript 代码。
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 将在 `code` 被编译和运行时用作 `global` 的 [contextified](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 对象。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定此脚本生成的堆栈跟踪中使用的文件名。 **默认值:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的行号偏移量。 **默认值:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的第一行列号偏移量。 **默认值:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的代码行将附加到堆栈跟踪中。 **默认值:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前执行 `code` 的毫秒数。 如果执行终止，则将抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 此值必须是严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则收到 `SIGINT` (+) 将终止执行并抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 在脚本执行期间禁用已通过 `process.on('SIGINT')` 附加的事件的现有处理程序，但在之后继续工作。 **默认值:** `false`。
    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供可选的 `Buffer` 或 `TypedArray`，或带有 V8 代码缓存数据的 `DataView`，用于提供的源。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在调用 `import()` 时，应该如何在评估此脚本期间加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参见 [在编译 API 中支持动态 `import()` ](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。

`vm.runInContext()` 方法编译 `code`，在 `contextifiedObject` 的上下文中运行它，然后返回结果。 运行代码无法访问本地作用域。 `contextifiedObject` 对象*必须*先前使用 [`vm.createContext()`](/zh/nodejs/api/vm#vmcreatecontextcontextobject-options) 方法进行 [contextified](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)。

如果 `options` 是字符串，则它指定文件名。

以下示例使用单个 [contextified](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 对象编译和执行不同的脚本：

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 参数现在接受 `vm.constants.DONT_CONTEXTIFY`。 |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v17.0.0, v16.12.0 | 增加了对 `importModuleDynamically` 参数的导入属性的支持。 |
| v14.6.0 | 现在支持 `microtaskMode` 选项。 |
| v10.0.0 | 现在支持 `contextCodeGeneration` 选项。 |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译和运行的 JavaScript 代码。
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/zh/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 要么是 [`vm.constants.DONT_CONTEXTIFY`](/zh/nodejs/api/vm#vmconstantsdont_contextify) ，要么是将要 [上下文隔离](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 的对象。 如果是 `undefined`，将创建一个空的上下文隔离对象以实现向后兼容。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定此脚本生成的堆栈跟踪中使用的文件名。 **默认:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的行号偏移量。 **默认:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的第一行列号偏移量。 **默认:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的行代码将附加到堆栈跟踪中。 **默认:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前执行 `code` 的毫秒数。 如果执行被终止，将抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 此值必须是严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则接收到 `SIGINT` (+) 将终止执行并抛出 [`Error`](/zh/nodejs/api/errors#class-error)。 通过 `process.on('SIGINT')` 附加的事件的现有处理程序在脚本执行期间被禁用，但在之后继续工作。 **默认:** `false`。
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新创建的上下文的人工可读的名称。 **默认:** `'VM Context i'`，其中 `i` 是已创建上下文的递增数字索引。
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 与新创建的上下文相对应的 [源](https://developer.mozilla.org/en-US/docs/Glossary/Origin)，用于显示目的。 该源的格式应类似于 URL，但只有 scheme、host 和 port（如果必要），例如 [`URL`](/zh/nodejs/api/url#class-url) 对象的 [`url.origin`](/zh/nodejs/api/url#urlorigin) 属性的值。 最值得注意的是，此字符串应省略尾部斜杠，因为它表示路径。 **默认:** `''`。
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则对 `eval` 或函数构造函数（`Function`、`GeneratorFunction` 等）的任何调用都将抛出 `EvalError`。 **默认:** `true`。
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 false，则任何编译 WebAssembly 模块的尝试都将抛出 `WebAssembly.CompileError`。 **默认:** `true`。


    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供一个可选的 `Buffer` 或 `TypedArray`，或带有 V8 代码缓存数据的 `DataView`，用于提供的源。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在调用 `import()` 时，在此脚本的评估期间应如何加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参见 [在编译 API 中支持动态 `import()`](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果设置为 `afterEvaluate`，则微任务（通过 `Promise` 和 `async function` 安排的任务）将在脚本运行后立即运行。 在这种情况下，它们包含在 `timeout` 和 `breakOnSigint` 范围内。


- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 脚本中执行的最后一个语句的结果。

此方法是 `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)` 的快捷方式。 如果 `options` 是字符串，则它指定文件名。

它同时做了几件事：

以下示例编译并执行递增全局变量并设置新变量的代码。 这些全局变量包含在 `contextObject` 中。

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// 如果从上下文隔离对象创建上下文，这将抛出。
// vm.constants.DONT_CONTEXTIFY 允许使用可以被冻结的普通全局对象创建上下文。
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.7.0, v20.12.0 | 增加了对 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 的支持。 |
| v17.0.0, v16.12.0 | 为 `importModuleDynamically` 参数增加了对导入属性的支持。 |
| v6.3.0 | 现在支持 `breakOnSigint` 选项。 |
| v0.3.1 | 添加于: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译和运行的 JavaScript 代码。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定此脚本生成的堆栈跟踪中使用的文件名。 **默认值:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的行号偏移量。 **默认值:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定显示在此脚本生成的堆栈跟踪中的首行列号偏移量。 **默认值:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，如果在编译 `code` 时发生 [`Error`](/zh/nodejs/api/errors#class-error)，则导致错误的行代码将附加到堆栈跟踪中。 **默认值:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在终止执行之前执行 `code` 的毫秒数。 如果执行被终止，将抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 此值必须是严格的正整数。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，接收到 `SIGINT` (+) 将终止执行并抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)。 通过 `process.on('SIGINT')` 附加的事件的现有处理程序在脚本执行期间被禁用，但在之后继续工作。 **默认值:** `false`。
    - `cachedData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供一个可选的 `Buffer` 或 `TypedArray`，或者带有 V8 代码缓存数据的 `DataView`，用于提供的源。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/zh/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 用于指定在调用 `import()` 时，应该如何在此脚本的求值期间加载模块。 此选项是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。 有关详细信息，请参见[在编译 API 中支持动态 `import()` ](/zh/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)。

- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 脚本中执行的最后一个语句的结果。

`vm.runInThisContext()` 编译 `code`，在当前 `global` 的上下文中运行它，并返回结果。 运行代码无权访问局部作用域，但有权访问当前的 `global` 对象。

如果 `options` 是一个字符串，则它指定文件名。

以下示例说明了使用 `vm.runInThisContext()` 和 JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) 函数运行相同的代码：

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
因为 `vm.runInThisContext()` 无权访问局部作用域，所以 `localVar` 没有改变。 相比之下，[`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *确实*有权访问局部作用域，所以 `localVar` 的值发生了改变。 通过这种方式，`vm.runInThisContext()` 非常像一个[间接 `eval()` 调用](https://es5.github.io/#x10.4.2)，例如 `(0,eval)('code')`。


## 示例：在 VM 中运行 HTTP 服务器 {#example-running-an-http-server-within-a-vm}

当使用 [`script.runInThisContext()`](/zh/nodejs/api/vm#scriptruninthiscontextoptions) 或 [`vm.runInThisContext()`](/zh/nodejs/api/vm#vmruninthiscontextcode-options) 时，代码会在当前的 V8 全局上下文中执行。传递给此 VM 上下文的代码将拥有其自己的隔离作用域。

为了使用 `node:http` 模块运行一个简单的 Web 服务器，传递给上下文的代码必须自行调用 `require('node:http')`，或者将 `node:http` 模块的引用传递给它。 例如：

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
在上述情况下，`require()` 与其传递过来的上下文共享状态。 当执行不受信任的代码时，这可能会带来风险，例如，以不需要的方式更改上下文中的对象。

## "contextify" 对象意味着什么？ {#what-does-it-mean-to-"contextify"-an-object?}

在 Node.js 中执行的所有 JavaScript 都在 "context" 的作用域内运行。 根据 [V8 嵌入器指南](https://v8.dev/docs/embed#contexts):

当使用对象调用 `vm.createContext()` 方法时，`contextObject` 参数将用于包装 V8 上下文新实例的全局对象（如果 `contextObject` 为 `undefined`，则会在对其进行 contextify 之前从当前上下文创建一个新对象）。 此 V8 上下文为使用 `node:vm` 模块的方法运行的 `code` 提供了一个隔离的全局环境，它可以在其中运行。 创建 V8 上下文并将其与外部上下文中的 `contextObject` 关联的过程就是本文档所说的 "contextifying" 对象。

contextifying 会给上下文中的 `globalThis` 值带来一些怪癖。 例如，它不能被冻结，并且它与外部上下文中的 `contextObject` 不等同。

```js [ESM]
const vm = require('node:vm');

// 一个未定义的 `contextObject` 选项使全局对象被 contextified。
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// 一个被 contextified 的全局对象不能被冻结。
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
要创建一个带有普通全局对象的上下文，并在外部上下文中访问具有更少怪癖的全局代理，请指定 `vm.constants.DONT_CONTEXTIFY` 作为 `contextObject` 参数。


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

当用作 vm API 中的 `contextObject` 参数时，此常量指示 Node.js 创建一个上下文，而无需以 Node.js 特定的方式用另一个对象包装其全局对象。 因此，新上下文中的 `globalThis` 值的行为将更接近于普通的值。

```js [ESM]
const vm = require('node:vm');

// 使用 vm.constants.DONT_CONTEXTIFY 来冻结全局对象。
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
当 `vm.constants.DONT_CONTEXTIFY` 用作 [`vm.createContext()`](/zh/nodejs/api/vm#vmcreatecontextcontextobject-options) 的 `contextObject` 参数时，返回的对象是新创建的上下文中全局对象的类代理对象，具有较少的 Node.js 特有怪癖。 它与新上下文中的 `globalThis` 值具有引用相等性，可以从上下文外部修改，并且可以直接用于访问新上下文中的内置函数。

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// 返回的对象与新上下文中的 globalThis 具有引用相等性。
console.log(vm.runInContext('globalThis', context) === context);  // true

// 可以直接用于访问新上下文中的全局变量。
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// 可以冻结它，并且它会影响内部上下文。
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## 超时与异步任务和 Promise 的交互 {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise` 和 `async function` 可以安排 JavaScript 引擎异步运行的任务。 默认情况下，这些任务在当前堆栈上的所有 JavaScript 函数执行完毕后运行。 这允许逃避 `timeout` 和 `breakOnSigint` 选项的功能。

例如，以下由 `vm.runInNewContext()` 执行的代码，超时时间为 5 毫秒，安排一个无限循环在 promise 解析后运行。 计划的循环永远不会被超时中断：

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
// 这在 'entering loop' 之前打印 (!)
console.log('done executing');
```
这可以通过将 `microtaskMode: 'afterEvaluate'` 传递给创建 `Context` 的代码来解决：

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
在这种情况下，通过 `promise.then()` 调度的微任务将在从 `vm.runInNewContext()` 返回之前运行，并且将被 `timeout` 功能中断。 这仅适用于在 `vm.Context` 中运行的代码，因此例如 [`vm.runInThisContext()`](/zh/nodejs/api/vm#vmruninthiscontextcode-options) 不接受此选项。

Promise 回调被输入到创建它们的上下文的微任务队列中。 例如，如果在上面的示例中将 `() =\> loop()` 替换为 `loop`，则 `loop` 将被推送到全局微任务队列中，因为它是一个来自外部（主）上下文的函数，因此也可以逃避超时。

如果诸如 `process.nextTick()`、`queueMicrotask()`、`setTimeout()`、`setImmediate()` 等异步调度函数在 `vm.Context` 中可用，则传递给它们的函数将被添加到全局队列中，所有上下文共享这些队列。 因此，传递给这些函数的回调也不能通过超时来控制。


## 编译 API 中对动态 `import()` 的支持 {#support-of-dynamic-import-in-compilation-apis}

以下 API 支持 `importModuleDynamically` 选项，以启用由 vm 模块编译的代码中的动态 `import()`。

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

此选项仍然是实验性模块 API 的一部分。 我们不建议在生产环境中使用它。

### 当未指定或未定义 `importModuleDynamically` 选项时 {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

如果未指定此选项，或者如果它是 `undefined`，则包含 `import()` 的代码仍然可以由 vm API 编译，但是当编译后的代码被执行并且实际调用 `import()` 时，结果将因 [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/zh/nodejs/api/errors#err_vm_dynamic_import_callback_missing) 而被拒绝。

### 当 `importModuleDynamically` 为 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` 时 {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

当前 `vm.SourceTextModule` 不支持此选项。

使用此选项，当在编译后的代码中启动 `import()` 时，Node.js 将使用主上下文中的默认 ESM 加载器来加载请求的模块并将其返回给正在执行的代码。

这使编译的代码可以访问 Node.js 内置模块，例如 `fs` 或 `http`。 如果代码在不同的上下文中执行，请注意，从主上下文加载的模块创建的对象仍然来自主上下文，而不是新上下文中的内置类的 `instanceof`。

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: 从主上下文加载的 URL 不是新上下文中 Function 类的实例。
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: 从主上下文加载的 URL 不是新上下文中 Function 类的实例。
script.runInNewContext().then(console.log);
```
:::

此选项还允许脚本或函数加载用户模块：

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// 将 test.js 和 test.txt 写入当前正在运行的脚本所在的目录。
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// 编译一个加载 test.mjs 然后加载 test.json 的脚本
// 就像脚本放置在同一目录中一样。
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

// 将 test.js 和 test.txt 写入当前正在运行的脚本所在的目录。
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// 编译一个加载 test.mjs 然后加载 test.json 的脚本
// 就像脚本放置在同一目录中一样。
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

使用主上下文中的默认加载器加载用户模块有一些注意事项：


### 当 `importModuleDynamically` 是一个函数时 {#when-importmoduledynamically-is-a-function}

当 `importModuleDynamically` 是一个函数时，当在编译后的代码中调用 `import()` 时，它将被调用，以便用户可以自定义应如何编译和评估请求的模块。目前，必须使用 `--experimental-vm-modules` 标志启动 Node.js 实例才能使此选项生效。如果未设置该标志，则将忽略此回调。如果评估的代码实际调用了 `import()`，则结果将因 [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/zh/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag) 而拒绝。

回调 `importModuleDynamically(specifier, referrer, importAttributes)` 具有以下签名：

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 传递给 `import()` 的说明符
- `referrer` [\<vm.Script\>](/zh/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/zh/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) referrer 是 `new vm.Script`、`vm.runInThisContext`、`vm.runInContext` 和 `vm.runInNewContext` 的已编译 `vm.Script`。它是 `vm.compileFunction` 的已编译 `Function`，`new vm.SourceTextModule` 的已编译 `vm.SourceTextModule`，以及 `vm.createContext()` 的上下文 `Object`。
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给 [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call) 可选参数的 `"with"` 值，如果未提供值，则为空对象。
- 返回值: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/zh/nodejs/api/vm#class-vmmodule) 建议返回 `vm.Module` 以利用错误跟踪，并避免包含 `then` 函数导出的命名空间出现问题。

::: code-group
```js [ESM]
// 此脚本必须使用 --experimental-vm-modules 运行。
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // 已编译的脚本
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
// 此脚本必须使用 --experimental-vm-modules 运行。
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // 已编译的脚本
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

