---
title: Node.js REPL 文档
description: 了解 Node.js REPL（读-评-打印循环），它提供了一个交互式环境来执行 JavaScript 代码，调试和测试 Node.js 应用程序。
head:
  - - meta
    - name: og:title
      content: Node.js REPL 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js REPL（读-评-打印循环），它提供了一个交互式环境来执行 JavaScript 代码，调试和测试 Node.js 应用程序。
  - - meta
    - name: twitter:title
      content: Node.js REPL 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js REPL（读-评-打印循环），它提供了一个交互式环境来执行 JavaScript 代码，调试和测试 Node.js 应用程序。
---


# REPL {#repl}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

`node:repl` 模块提供了一个读取-求值-打印循环 (REPL) 的实现，它既可以作为独立程序使用，也可以包含在其他应用程序中。 可以使用以下方式访问它：

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## 设计和特性 {#design-and-features}

`node:repl` 模块导出 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 类。 在运行时，[`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 的实例将接受用户输入的单行数据，根据用户定义的求值函数对其进行求值，然后输出结果。 输入和输出可以分别是 `stdin` 和 `stdout`，也可以连接到任何 Node.js [流](/zh/nodejs/api/stream)。

[`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 的实例支持输入自动补全、补全预览、简化的 Emacs 风格的行编辑、多行输入、类似 [ZSH](https://en.wikipedia.org/wiki/Z_shell) 的反向 i-搜索、类似 [ZSH](https://en.wikipedia.org/wiki/Z_shell) 的基于子字符串的历史搜索、ANSI 风格的输出、保存和恢复当前 REPL 会话状态、错误恢复以及可自定义的求值函数。 不支持 ANSI 样式和 Emacs 样式行编辑的终端会自动回退到有限的功能集。

### 命令和特殊键 {#commands-and-special-keys}

所有 REPL 实例都支持以下特殊命令：

- `.break`: 当正在输入多行表达式时，输入 `.break` 命令（或按 +）以中止进一步输入或处理该表达式。
- `.clear`: 将 REPL `context` 重置为空对象并清除正在输入的多行表达式。
- `.exit`: 关闭 I/O 流，导致 REPL 退出。
- `.help`: 显示此特殊命令列表。
- `.save`: 将当前 REPL 会话保存到文件：`\> .save ./file/to/save.js`
- `.load`: 将文件加载到当前 REPL 会话中。 `\> .load ./file/to/load.js`
- `.editor`: 进入编辑器模式（+ 完成，+ 取消）。

```bash [BASH]
> .editor
// 进入编辑器模式（^D 完成，^C 取消）
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
REPL 中的以下按键组合具有这些特殊效果：

- +: 按一次与 `.break` 命令的效果相同。 在空白行上按两次，与 `.exit` 命令的效果相同。
- +: 与 `.exit` 命令的效果相同。
- : 在空白行上按下时，显示全局和局部（作用域）变量。 在输入其他内容时按下时，显示相关的自动补全选项。

有关与反向 i-搜索相关的键绑定的更多信息，请参阅 [`reverse-i-search`](/zh/nodejs/api/repl#reverse-i-search)。 有关所有其他键绑定，请参阅 [TTY 键绑定](/zh/nodejs/api/readline#tty-keybindings)。


### 默认求值 {#default-evaluation}

默认情况下，所有 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 的实例都使用一个求值函数来求值 JavaScript 表达式，并提供对 Node.js 内置模块的访问。可以通过在创建 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 实例时传入一个替代的求值函数来覆盖此默认行为。

#### JavaScript 表达式 {#javascript-expressions}

默认求值器支持直接求值 JavaScript 表达式：

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
除非在块或函数中另有范围界定，否则使用 `const`、`let` 或 `var` 关键字隐式声明或显式声明的变量都在全局作用域中声明。

#### 全局和局部作用域 {#global-and-local-scope}

默认求值器提供对全局作用域中存在的任何变量的访问。 可以通过将变量分配给与每个 `REPLServer` 关联的 `context` 对象，来显式地将变量暴露给 REPL：

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

`context` 对象中的属性在 REPL 中显示为局部变量：

```bash [BASH]
$ node repl_test.js
> m
'message'
```
默认情况下，上下文属性不是只读的。 要指定只读全局变量，必须使用 `Object.defineProperty()` 定义上下文属性：

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### 访问核心 Node.js 模块 {#accessing-core-nodejs-modules}

默认求值器会在使用时自动将 Node.js 核心模块加载到 REPL 环境中。 例如，除非另行声明为全局变量或作用域变量，否则输入 `fs` 将按需求值为 `global.fs = require('node:fs')`。

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### 全局未捕获异常 {#global-uncaught-exceptions}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v12.3.0 | 如果 repl 被用作独立程序，则从现在起将触发 `'uncaughtException'` 事件。 |
:::

REPL 使用 [`domain`](/zh/nodejs/api/domain) 模块来捕获该 REPL 会话的所有未捕获异常。

在 REPL 中使用 [`domain`](/zh/nodejs/api/domain) 模块具有以下副作用：

- 未捕获的异常仅在独立的 REPL 中触发 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件。 在另一个 Node.js 程序中的 REPL 中为此事件添加侦听器会导致 [`ERR_INVALID_REPL_INPUT`](/zh/nodejs/api/errors#err_invalid_repl_input)。
- 尝试使用 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) 会抛出 [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/zh/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture) 错误。

#### `_`（下划线）变量的赋值 {#assignment-of-the-_-underscore-variable}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v9.8.0 | 添加了 `_error` 支持。 |
:::

默认情况下，默认求值器会将最近求值的表达式的结果分配给特殊变量 `_`（下划线）。 显式地将 `_` 设置为某个值将禁用此行为。

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
现在禁用表达式赋值给 _。
4
> 1 + 1
2
> _
4
```
类似地，`_error` 将引用最后看到的错误（如果有的话）。 显式地将 `_error` 设置为某个值将禁用此行为。

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### `await` 关键字 {#await-keyword}

在顶层启用了对 `await` 关键字的支持。

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
在 REPL 中使用 `await` 关键字的一个已知限制是，它会使 `const` 和 `let` 关键字的词法作用域失效。

例如：

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/zh/nodejs/api/cli#--no-experimental-repl-await) 应禁用 REPL 中的顶层 `await`。


### 反向-i-搜索 {#reverse-i-search}

**新增于: v13.6.0, v12.17.0**

REPL 支持类似于 [ZSH](https://en.wikipedia.org/wiki/Z_shell) 的双向反向-i-搜索。它通过 + 触发以向后搜索，并通过 + 触发以向前搜索。

重复的历史记录条目将被跳过。

一旦按下任何与反向搜索不对应的键，条目就会被接受。可以通过按 或 + 来取消。

立即更改方向会从当前位置开始，在预期方向上搜索下一个条目。

### 自定义求值函数 {#custom-evaluation-functions}

当创建一个新的 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 时，可以提供一个自定义的求值函数。例如，这可以用来实现完全定制的 REPL 应用程序。

以下示例展示了一个 REPL，它可以计算给定数字的平方：

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### 可恢复的错误 {#recoverable-errors}

在 REPL 提示符下，按下  会将当前输入行发送到 `eval` 函数。为了支持多行输入，`eval` 函数可以返回一个 `repl.Recoverable` 的实例给提供的回调函数：

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### 自定义 REPL 输出 {#customizing-repl-output}

默认情况下，[`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 实例会在将输出写入提供的 `Writable` 流（默认为 `process.stdout`）之前，使用 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 方法格式化输出。 `showProxy` 检查选项默认设置为 true，`colors` 选项会根据 REPL 的 `useColors` 选项设置为 true。

可以在构造时指定 `useColors` 布尔选项，以指示默认写入器使用 ANSI 样式代码来着色来自 `util.inspect()` 方法的输出。

如果 REPL 作为独立程序运行，也可以通过使用 `inspect.replDefaults` 属性从 REPL 内部更改 REPL 的[检查默认值](/zh/nodejs/api/util#utilinspectobject-options)，该属性反映了来自 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 的 `defaultOptions`。

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
要完全自定义 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 实例的输出，请在构造时传入一个新的函数作为 `writer` 选项。 例如，以下示例仅将任何输入文本转换为大写：

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## 类: `REPLServer` {#class-replserver}

**加入于: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [`repl.start()`](/zh/nodejs/api/repl#replstartoptions)
- 继承自: [\<readline.Interface\>](/zh/nodejs/api/readline#class-readlineinterface)

`repl.REPLServer` 的实例使用 [`repl.start()`](/zh/nodejs/api/repl#replstartoptions) 方法创建，或者直接使用 JavaScript `new` 关键字创建。

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### 事件: `'exit'` {#event-exit}

**新增于: v0.7.7**

当 REPL 退出时，会触发 `'exit'` 事件，退出方式包括：收到输入的 `.exit` 命令、用户按下 + 两次以发出 `SIGINT` 信号，或者按下 + 以在输入流上发出 `'end'` 信号。侦听器回调函数在调用时没有任何参数。

```js [ESM]
replServer.on('exit', () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
```
### 事件: `'reset'` {#event-reset}

**新增于: v0.11.0**

当 REPL 的上下文被重置时，会触发 `'reset'` 事件。当收到 `.clear` 命令作为输入时会发生这种情况，*除非* REPL 使用默认求值器并且 `repl.REPLServer` 实例创建时将 `useGlobal` 选项设置为 `true`。侦听器回调函数将被调用，并将 `context` 对象作为唯一参数传递。

这主要可以用于将 REPL 上下文重新初始化为一些预定义的state：

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

当执行此代码时，全局 `'m'` 变量可以被修改，然后使用 `.clear` 命令重置为其初始值：

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**新增于: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 命令关键字（*不带* 前导 `.` 字符）。
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 处理命令时要调用的函数。

`replServer.defineCommand()` 方法用于向 REPL 实例添加新的以 `.` 为前缀的命令。 通过键入 `.` 后跟 `keyword` 来调用此类命令。 `cmd` 可以是 `Function` 或具有以下属性的 `Object`：

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当输入 `.help` 时显示的帮助文本（可选）。
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要执行的函数，可以选择接受一个字符串参数。

以下示例显示了添加到 REPL 实例的两个新命令：

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

然后可以从 REPL 实例中使用新命令：

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Added in: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`replServer.displayPrompt()` 方法使 REPL 实例准备好接受来自用户的输入，在 `output` 的新行上打印配置的 `prompt`，并恢复 `input` 以接受新的输入。

当输入多行时，会打印省略号而不是 'prompt'。

当 `preserveCursor` 为 `true` 时，光标位置不会重置为 `0`。

`replServer.displayPrompt` 方法主要用于从使用 `replServer.defineCommand()` 方法注册的命令的操作函数中调用。

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Added in: v9.0.0**

`replServer.clearBufferedCommand()` 方法清除任何已缓冲但尚未执行的命令。此方法主要用于从使用 `replServer.defineCommand()` 方法注册的命令的操作函数中调用。

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Added in: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 历史记录文件的路径
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当历史记录写入准备就绪或发生错误时调用
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/zh/nodejs/api/repl#class-replserver)

 

为 REPL 实例初始化历史记录日志文件。当执行 Node.js 二进制文件并使用命令行 REPL 时，默认情况下会初始化一个历史记录文件。但是，以编程方式创建 REPL 时并非如此。在使用 REPL 实例以编程方式工作时，请使用此方法初始化历史记录日志文件。

## `repl.builtinModules` {#replbuiltinmodules}

**Added in: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

所有 Node.js 模块名称的列表，例如，`'http'`。


## `repl.start([options])` {#replstartoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.4.0, v12.17.0 | 现在可以使用 `preview` 选项。 |
| v12.0.0 | 现在 `terminal` 选项在所有情况下都遵循默认描述，并且 `useColors` 检查 `hasColors()`（如果可用）。 |
| v10.0.0 | 删除了 `REPL_MAGIC_MODE` `replMode`。 |
| v6.3.0 | 现在支持 `breakEvalOnSigint` 选项。 |
| v5.8.0 | 现在 `options` 参数是可选的。 |
| v0.1.91 | 添加于: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要显示的输入提示符。 **默认:** `'\> '`（带尾随空格）。
    - `input` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) REPL 输入将从中读取的 `Readable` 流。 **默认:** `process.stdin`。
    - `output` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) REPL 输出将写入的 `Writable` 流。 **默认:** `process.stdout`。
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定应将 `output` 视为 TTY 终端。 **默认:** 在实例化时检查 `output` 流上 `isTTY` 属性的值。
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于评估每个给定输入行的函数。 **默认:** JavaScript `eval()` 函数的异步包装器。 `eval` 函数可能会因 `repl.Recoverable` 错误而导致输入不完整，并提示输入其他行。
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定默认的 `writer` 函数应在 REPL 输出中包含 ANSI 颜色样式。 如果提供了自定义 `writer` 函数，则此设置无效。 **默认:** 如果 REPL 实例的 `terminal` 值为 `true`，则检查 `output` 流上的颜色支持。
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定默认评估函数将使用 JavaScript `global` 作为上下文，而不是为 REPL 实例创建一个新的单独上下文。 node CLI REPL 将此值设置为 `true`。 **默认:** `false`。
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定如果命令的返回值求值为 `undefined`，则默认的 writer 将不输出该值。 **默认:** `false`。
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在写入 `output` 之前调用以格式化每个命令的输出的函数。 **默认:** [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options)。
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于自定义 Tab 自动完成的可选函数。 有关示例，请参见 [`readline.InterfaceCompleter`](/zh/nodejs/api/readline#use-of-the-completer-function)。
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 一个标志，指定默认评估器是在严格模式还是默认（宽松）模式下执行所有 JavaScript 命令。 可接受的值为：
    - `repl.REPL_MODE_SLOPPY` 在宽松模式下评估表达式。
    - `repl.REPL_MODE_STRICT` 在严格模式下评估表达式。 这等效于在每个 repl 语句前加上 `'use strict'`。
  
 
    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 收到 `SIGINT` 时停止评估当前代码段，例如当按下 + 时。 这不能与自定义 `eval` 函数一起使用。 **默认:** `false`。
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 定义 repl 是否打印自动完成和输出预览。 **默认:** 使用默认 eval 函数时为 `true`，在使用自定义 eval 函数时为 `false`。 如果 `terminal` 为假值，则没有预览，并且 `preview` 的值无效。
  
 
- 返回: [\<repl.REPLServer\>](/zh/nodejs/api/repl#class-replserver)

`repl.start()` 方法创建并启动一个 [`repl.REPLServer`](/zh/nodejs/api/repl#class-replserver) 实例。

如果 `options` 是一个字符串，则它指定输入提示符：

::: code-group
```js [ESM]
import repl from 'node:repl';

// 一个 Unix 样式的提示符
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// 一个 Unix 样式的提示符
repl.start('$ ');
```
:::


## Node.js REPL {#the-nodejs-repl}

Node.js 本身使用 `node:repl` 模块来提供自己的交互式接口以执行 JavaScript。这可以通过执行 Node.js 二进制文件而不传递任何参数（或通过传递 `-i` 参数）来使用：

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### 环境变量选项 {#environment-variable-options}

可以使用以下环境变量自定义 Node.js REPL 的各种行为：

- `NODE_REPL_HISTORY`: 当给定有效路径时，持久 REPL 历史记录将保存到指定的文件，而不是用户主目录中的 `.node_repl_history`。 将此值设置为 `''`（空字符串）将禁用持久 REPL 历史记录。 空格将从该值中删除。 在 Windows 平台上，具有空值的环境变量无效，因此请将此变量设置为一个或多个空格以禁用持久 REPL 历史记录。
- `NODE_REPL_HISTORY_SIZE`: 控制如果历史记录可用，将持久保存多少行历史记录。 必须是一个正数。 **默认值:** `1000`。
- `NODE_REPL_MODE`: 可以是 `'sloppy'` 或 `'strict'`。 **默认值:** `'sloppy'`，这将允许运行非严格模式代码。

### 持久历史记录 {#persistent-history}

默认情况下，Node.js REPL 会通过将输入保存到位于用户主目录中的 `.node_repl_history` 文件来持久保存 `node` REPL 会话之间的历史记录。 可以通过设置环境变量 `NODE_REPL_HISTORY=''` 来禁用此功能。

### 将 Node.js REPL 与高级行编辑器一起使用 {#using-the-nodejs-repl-with-advanced-line-editors}

对于高级行编辑器，请使用环境变量 `NODE_NO_READLINE=1` 启动 Node.js。 这将以规范终端设置启动主 REPL 和调试器 REPL，这将允许与 `rlwrap` 一起使用。

例如，可以将以下内容添加到 `.bashrc` 文件中：

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### 针对单个正在运行的实例启动多个 REPL 实例 {#starting-multiple-repl-instances-against-a-single-running-instance}

可以创建并运行多个 REPL 实例，针对单个正在运行的 Node.js 实例，这些实例共享一个 `global` 对象，但具有单独的 I/O 接口。

例如，以下示例在 `stdin`、Unix 套接字和 TCP 套接字上提供单独的 REPL：

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

从命令行运行此应用程序将在 stdin 上启动一个 REPL。 其他 REPL 客户端可以通过 Unix 套接字或 TCP 套接字连接。 例如，`telnet` 对于连接到 TCP 套接字很有用，而 `socat` 可用于连接到 Unix 和 TCP 套接字。

通过从基于 Unix 套接字的服务器而不是 stdin 启动 REPL，可以连接到长时间运行的 Node.js 进程，而无需重新启动它。

有关通过 `net.Server` 和 `net.Socket` 实例运行“功能齐全” (`terminal`) REPL 的示例，请参见：[https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310)。

有关通过 [`curl(1)`](https://curl.haxx.se/docs/manpage) 运行 REPL 实例的示例，请参见：[https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342)。

此示例仅用于教育目的，以演示如何使用不同的 I/O 流启动 Node.js REPL。 在没有其他保护措施的情况下，**不**应在生产环境或任何涉及安全性的上下文中使用它。 如果需要在实际应用程序中实现 REPL，请考虑采取其他方法来减轻这些风险，例如使用安全的输入机制并避免开放的网络接口。

