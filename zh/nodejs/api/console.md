---
title: Node.js 控制台 API 文档
description: Node.js 控制台 API 提供了一个简单的调试控制台，类似于浏览器提供的 JavaScript 控制台机制。本文档详细介绍了在 Node.js 环境中用于记录、调试和检查 JavaScript 对象的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 控制台 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 控制台 API 提供了一个简单的调试控制台，类似于浏览器提供的 JavaScript 控制台机制。本文档详细介绍了在 Node.js 环境中用于记录、调试和检查 JavaScript 对象的方法。
  - - meta
    - name: twitter:title
      content: Node.js 控制台 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 控制台 API 提供了一个简单的调试控制台，类似于浏览器提供的 JavaScript 控制台机制。本文档详细介绍了在 Node.js 环境中用于记录、调试和检查 JavaScript 对象的方法。
---


# Console {#console}

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

`node:console` 模块提供了一个简单的调试控制台，类似于 Web 浏览器提供的 JavaScript 控制台机制。

该模块导出两个特定组件：

- 一个 `Console` 类，具有诸如 `console.log()`、`console.error()` 和 `console.warn()` 等方法，可用于写入任何 Node.js 流。
- 一个全局 `console` 实例，配置为写入 [`process.stdout`](/zh/nodejs/api/process#processstdout) 和 [`process.stderr`](/zh/nodejs/api/process#processstderr)。 无需调用 `require('node:console')` 即可使用全局 `console`。

*<strong>警告</strong>*: 全局 console 对象的方法既不像它们所模仿的浏览器 API 那样始终是同步的，也不像所有其他 Node.js 流那样始终是异步的。 希望依赖于控制台函数的同步/异步行为的程序应首先弄清楚控制台的后备流的性质。 这是因为流依赖于当前进程的底层平台和标准流配置。 有关更多信息，请参见 [关于进程 I/O 的说明](/zh/nodejs/api/process#a-note-on-process-io)。

使用全局 `console` 的示例：

```js [ESM]
console.log('hello world');
// 打印：hello world, 到 stdout
console.log('hello %s', 'world');
// 打印：hello world, 到 stdout
console.error(new Error('Whoops, something bad happened'));
// 将错误消息和堆栈跟踪打印到 stderr：
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// 打印：Danger Will Robinson! Danger!, 到 stderr
```
使用 `Console` 类的示例：

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// 打印：hello world, 到 out
myConsole.log('hello %s', 'world');
// 打印：hello world, 到 out
myConsole.error(new Error('Whoops, something bad happened'));
// 打印：[Error: Whoops, something bad happened], 到 err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// 打印：Danger Will Robinson! Danger!, 到 err
```

## 类: `Console` {#class-console}

::: info [历史]
| 版本    | 变更                                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| v8.0.0  | 默认情况下，写入底层流时发生的错误将被忽略。                                                                              |
:::

可以使用 `Console` 类创建一个具有可配置输出流的简单日志记录器，并且可以使用 `require('node:console').Console` 或 `console.Console` (或它们的解构对应项) 访问：

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [历史]
| 版本           | 变更                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| v14.2.0, v12.17.0 | 引入了 `groupIndentation` 选项。                                                                                             |
| v11.7.0        | 引入了 `inspectOptions` 选项。                                                                                             |
| v10.0.0        | `Console` 构造函数现在支持 `options` 参数，并引入了 `colorMode` 选项。                                                                  |
| v8.0.0         | 引入了 `ignoreErrors` 选项。                                                                                              |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 写入底层流时忽略错误。 **默认:** `true`。
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 为此 `Console` 实例设置颜色支持。 设置为 `true` 可在检查值时启用着色。 设置为 `false` 可在检查值时禁用着色。 设置为 `'auto'` 使颜色支持取决于 `isTTY` 属性的值以及相应流上 `getColorDepth()` 返回的值。 如果也设置了 `inspectOptions.colors`，则无法使用此选项。 **默认:** `'auto'`。
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 指定传递给 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 的选项。
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置组缩进。 **默认:** `2`。

创建一个新的 `Console`，其中包含一个或两个可写流实例。 `stdout` 是一个可写流，用于打印日志或信息输出。 `stderr` 用于警告或错误输出。 如果未提供 `stderr`，则 `stdout` 用于 `stderr`。

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

全局 `console` 是一个特殊的 `Console`，其输出被发送到 [`process.stdout`](/zh/nodejs/api/process#processstdout) 和 [`process.stderr`](/zh/nodejs/api/process#processstderr)。 它等效于调用：

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 此实现现在符合规范，不再抛出异常。 |
| v0.1.101 | 添加于：v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 被测试为真值的 value。
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 除了 `value` 之外的所有参数都用作错误消息。

如果 `value` 是 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 或被省略，则 `console.assert()` 会写入一条消息。 它只会写入一条消息，而不会以其他方式影响执行。 输出始终以 `"Assertion failed"` 开头。 如果提供了 `message`，则使用 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args) 格式化 `message`。

如果 `value` 是 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，则什么也不会发生。

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**添加于: v8.3.0**

当 `stdout` 是一个 TTY 时，调用 `console.clear()` 将尝试清除该 TTY。 当 `stdout` 不是 TTY 时，此方法不执行任何操作。

`console.clear()` 的具体操作可能因操作系统和终端类型而异。 对于大多数 Linux 操作系统，`console.clear()` 的操作类似于 `clear` shell 命令。 在 Windows 上，`console.clear()` 将仅清除 Node.js 二进制文件的当前终端视口中的输出。

### `console.count([label])` {#consolecountlabel}

**添加于: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 计数器的显示标签。 **默认值:** `'default'`。

维护一个特定于 `label` 的内部计数器，并将 `console.count()` 被调用并带有给定 `label` 的次数输出到 `stdout`。

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Added in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 计数器的显示标签。 **默认:** `'default'`。

重置特定于 `label` 的内部计数器。

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.10.0 | `console.debug` 现在是 `console.log` 的别名。 |
| v8.0.0 | Added in: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.debug()` 函数是 [`console.log()`](/zh/nodejs/api/console#consolelogdata-args) 的别名。

### `console.dir(obj[, options])` {#consoledirobj-options}

**Added in: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则还会显示对象的不可枚举和 symbol 属性。 **默认:** `false`。
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 告诉 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 在格式化对象时递归多少次。 这对于检查大型复杂对象很有用。 要使其无限递归，请传递 `null`。 **默认:** `2`。
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则输出将使用 ANSI 颜色代码进行样式设置。 颜色是可定制的; 参见 [customizing `util.inspect()` colors](/zh/nodejs/api/util#customizing-utilinspect-colors)。 **默认:** `false`。

在 `obj` 上使用 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 并将结果字符串打印到 `stdout`。 此函数绕过在 `obj` 上定义的任何自定义 `inspect()` 函数。


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.3.0 | `console.dirxml` 现在为其参数调用 `console.log`。 |
| v8.0.0 | 添加于：v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

此方法调用 `console.log()` 并传递接收到的参数。此方法不产生任何 XML 格式。

### `console.error([data][, ...args])` {#consoleerrordata-args}

**添加于：v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

打印到 `stderr` 并换行。 可以传递多个参数，第一个用作主要消息，所有其他参数用作类似于 [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) 的替换值（所有参数都传递给 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args)）。

```js [ESM]
const code = 5;
console.error('error #%d', code);
// 打印：error #5, 到 stderr
console.error('error', code);
// 打印：error 5, 到 stderr
```
如果在第一个字符串中未找到格式化元素（例如 `%d`），则对每个参数调用 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options)，并将生成的字符串值连接起来。 有关更多信息，请参见 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args)。

### `console.group([...label])` {#consolegrouplabel}

**添加于：v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

将后续行的缩进增加 `groupIndentation` 长度的空格。

如果提供了一个或多个 `label`，则首先打印这些标签，而无需额外的缩进。

### `console.groupCollapsed()` {#consolegroupcollapsed}

**添加于：v8.5.0**

[`console.group()`](/zh/nodejs/api/console#consolegrouplabel) 的别名。

### `console.groupEnd()` {#consolegroupend}

**添加于：v8.5.0**

将后续行的缩进减少 `groupIndentation` 长度的空格。


### `console.info([data][, ...args])` {#consoleinfodata-args}

**添加于: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.info()` 函数是 [`console.log()`](/zh/nodejs/api/console#consolelogdata-args) 的别名。

### `console.log([data][, ...args])` {#consolelogdata-args}

**添加于: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

向 `stdout` 打印，并换行。 可以传递多个参数，第一个参数用作主要消息，所有其他参数用作替换值，类似于 [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3)（所有参数都传递给 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args)）。

```js [ESM]
const count = 5;
console.log('count: %d', count);
// 打印: count: 5, 到 stdout
console.log('count:', count);
// 打印: count: 5, 到 stdout
```
更多信息请参见 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args)。

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**添加于: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于构建表的可选属性。

尝试使用 `tabularData` 的属性列（或使用 `properties`）和 `tabularData` 的行构造一个表，并记录它。如果无法解析为表格，则回退到仅记录参数。

```js [ESM]
// 这些无法解析为表格数据
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**添加于: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'default'`

启动一个计时器，可以用于计算操作的持续时间。计时器由唯一的 `label` 标识。调用 [`console.timeEnd()`](/zh/nodejs/api/console#consoletimeendlabel) 时使用相同的 `label` 来停止计时器，并将以适当的时间单位表示的已用时间输出到 `stdout`。例如，如果已用时间为 3869 毫秒，`console.timeEnd()` 将显示 “3.869s”。

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v13.0.0 | 已用时间以合适的时间单位显示。 |
| v6.0.0 | 此方法不再支持未映射到单个 `console.time()` 调用的多次调用；请参阅下面的详细信息。 |
| v0.1.104 | 添加于：v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'default'`

停止先前通过调用 [`console.time()`](/zh/nodejs/api/console#consoletimelabel) 启动的计时器，并将结果打印到 `stdout`：

```js [ESM]
console.time('bunch-of-stuff');
// 做一堆事情。
console.timeEnd('bunch-of-stuff');
// 打印：bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**添加于: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

对于先前通过调用 [`console.time()`](/zh/nodejs/api/console#consoletimelabel) 启动的计时器，将已用时间和其它 `data` 参数打印到 `stdout`：

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // 返回 42
console.timeLog('process', value);
// 打印 "process: 365.227ms 42"。
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**添加于: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

将字符串 `'Trace: '` 打印到 `stderr`，后跟 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args) 格式化的消息和代码当前位置的堆栈跟踪。

```js [ESM]
console.trace('Show me');
// 打印：（堆栈跟踪将根据调用跟踪的位置而有所不同）
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**添加于: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.warn()` 函数是 [`console.error()`](/zh/nodejs/api/console#consoleerrordata-args) 的别名。

## 仅供检查器使用的方法 {#inspector-only-methods}

以下方法由 V8 引擎在通用 API 中公开，但除非与[检查器](/zh/nodejs/api/debugger)（`--inspect` 标志）结合使用，否则不会显示任何内容。

### `console.profile([label])` {#consoleprofilelabel}

**添加于: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

除非在检查器中使用，否则此方法不显示任何内容。`console.profile()` 方法使用一个可选标签启动一个 JavaScript CPU 性能剖析，直到调用 [`console.profileEnd()`](/zh/nodejs/api/console#consoleprofileendlabel) 。然后，该性能剖析会被添加到检查器的 **Profile** 面板。

```js [ESM]
console.profile('MyLabel');
// 一些代码
console.profileEnd('MyLabel');
// 将 'MyLabel' 性能剖析添加到检查器的 Profiles 面板。
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**添加于: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

除非在检查器中使用，否则此方法不显示任何内容。如果已启动 JavaScript CPU 性能剖析会话，则停止该会话，并将报告打印到检查器的 **Profiles** 面板。 请参阅 [`console.profile()`](/zh/nodejs/api/console#consoleprofilelabel) 以获取示例。

如果调用此方法时没有标签，则会停止最近启动的性能剖析。

### `console.timeStamp([label])` {#consoletimestamplabel}

**添加于: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

除非在检查器中使用，否则此方法不显示任何内容。`console.timeStamp()` 方法将带有标签 `'label'` 的事件添加到检查器的 **Timeline** 面板。

