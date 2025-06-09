---
title: Node.js 文档 - 错误
description: Node.js 文档的这一部分详细介绍了错误处理，包括错误类、错误代码以及如何在 Node.js 应用程序中处理错误。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 错误 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 文档的这一部分详细介绍了错误处理，包括错误类、错误代码以及如何在 Node.js 应用程序中处理错误。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 错误 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 文档的这一部分详细介绍了错误处理，包括错误类、错误代码以及如何在 Node.js 应用程序中处理错误。
---


# 错误 {#errors}

在 Node.js 中运行的应用程序通常会遇到以下四类错误：

- 标准 JavaScript 错误，例如 [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError), 和 [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)。
- 由底层操作系统约束触发的系统错误，例如尝试打开不存在的文件或尝试通过关闭的套接字发送数据。
- 由应用程序代码触发的用户指定错误。
- `AssertionError` 是一种特殊的错误，当 Node.js 检测到不应发生的异常逻辑违规时，可以触发这种错误。 这些通常由 `node:assert` 模块引发。

Node.js 引发的所有 JavaScript 和系统错误都继承自标准 JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 类，或者属于该类的实例，并且保证 *至少* 提供该类上可用的属性。

## 错误传播和拦截 {#error-propagation-and-interception}

Node.js 支持多种机制来传播和处理应用程序运行时发生的错误。 如何报告和处理这些错误完全取决于 `Error` 的类型和所调用 API 的样式。

所有 JavaScript 错误都作为异常处理，这些异常会使用标准 JavaScript `throw` 机制 *立即* 生成并抛出错误。 这些错误使用 JavaScript 语言提供的 [`try…catch` 结构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) 进行处理。

```js [ESM]
// 抛出 ReferenceError，因为 z 未定义。
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // 在这里处理错误。
}
```
任何使用 JavaScript `throw` 机制都会引发一个异常，该异常 *必须* 被处理，否则 Node.js 进程将立即退出。

除了少数例外，*同步* API（任何不返回 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 也不接受 `callback` 函数的阻塞方法，例如 [`fs.readFileSync`](/zh/nodejs/api/fs#fsreadfilesyncpath-options)），将使用 `throw` 来报告错误。

*异步 API* 中发生的错误可以通过多种方式报告：

- 一些异步方法返回一个 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，你应该始终考虑到它可能会被拒绝。 有关进程如何对未处理的 promise 拒绝做出反应，请参阅 [`--unhandled-rejections`](/zh/nodejs/api/cli#--unhandled-rejectionsmode) 标志。
- 大多数接受 `callback` 函数的异步方法都会接受一个 `Error` 对象，该对象作为该函数的第一个参数传递。 如果第一个参数不是 `null` 并且是 `Error` 的一个实例，则表示发生了应该处理的错误。
- 当在一个属于 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 的对象上调用异步方法时，错误可以被路由到该对象的 `'error'` 事件。
- Node.js API 中少数通常是异步的方法仍然可以使用 `throw` 机制来引发必须使用 `try…catch` 处理的异常。 没有此类方法的完整列表； 请参阅每个方法的文档以确定所需的适当错误处理机制。

对于 [基于流](/zh/nodejs/api/stream) 和 [基于事件发射器](/zh/nodejs/api/events#class-eventemitter) 的 API，使用 `'error'` 事件机制最为常见，它们本身代表了一系列随时间推移的异步操作（而不是可能通过或失败的单个操作）。

对于 *所有* [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 对象，如果没有提供 `'error'` 事件处理程序，该错误将被抛出，导致 Node.js 进程报告未捕获的异常并崩溃，除非：已为 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件注册了一个处理程序，或者使用了已弃用的 [`node:domain`](/zh/nodejs/api/domain) 模块。

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // 这将导致进程崩溃，因为没有添加“error”事件处理程序。
  ee.emit('error', new Error('This will crash'));
});
```
以这种方式生成的错误 *无法* 使用 `try…catch` 拦截，因为它们是在调用代码已经退出 *之后* 抛出的。

开发人员必须参考每个方法的文档，以确定这些方法引发的错误如何传播。


## 类: `Error` {#class-error}

一个通用的 JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象，它不表示发生错误的任何特定情况。 `Error` 对象捕获一个“堆栈跟踪”，详细说明代码中实例化 `Error` 的位置，并且可以提供错误的文本描述。

由 Node.js 生成的所有错误，包括所有系统和 JavaScript 错误，都将是 `Error` 类的实例或继承自该类。

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 导致新创建的错误的错误。

创建一个新的 `Error` 对象并将 `error.message` 属性设置为提供的文本消息。 如果传递一个对象作为 `message`，则通过调用 `String(message)` 生成文本消息。 如果提供了 `cause` 选项，则将其分配给 `error.cause` 属性。 `error.stack` 属性将表示代码中调用 `new Error()` 的位置。 堆栈跟踪取决于 [V8 的堆栈跟踪 API](https://v8.dev/docs/stack-trace-api)。 堆栈跟踪仅扩展到 (a) *同步代码执行* 的开始，或 (b) 由属性 `Error.stackTraceLimit` 给定的帧数，以较小者为准。

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

在 `targetObject` 上创建一个 `.stack` 属性，当访问该属性时，它会返回一个字符串，表示代码中调用 `Error.captureStackTrace()` 的位置。

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // 类似于 `new Error().stack`
```

跟踪的第一行将以 `${myObject.name}: ${myObject.message}` 为前缀。

可选的 `constructorOpt` 参数接受一个函数。 如果给定，则 `constructorOpt` 之上的所有帧（包括 `constructorOpt`）将从生成的堆栈跟踪中省略。

`constructorOpt` 参数对于从用户那里隐藏错误生成的实现细节很有用。 例如：

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // 创建一个没有堆栈跟踪的错误，以避免计算两次堆栈跟踪。
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // 捕获函数 b 之上的堆栈跟踪
  Error.captureStackTrace(error, b); // 函数 c 和 b 都不包含在堆栈跟踪中
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Error.stackTraceLimit` 属性指定堆栈跟踪收集的堆栈帧的数量（无论是通过 `new Error().stack` 还是 `Error.captureStackTrace(obj)` 生成）。

默认值为 `10`，但可以设置为任何有效的 JavaScript 数字。更改将影响*在*值更改后捕获的任何堆栈跟踪。

如果设置为非数字值或设置为负数，堆栈跟踪将不会捕获任何帧。

### `error.cause` {#errorcause}

**添加于: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

如果存在，`error.cause` 属性是 `Error` 的根本原因。 它用于捕获错误并抛出一个带有不同消息或代码的新错误，以便仍然可以访问原始错误。

`error.cause` 属性通常通过调用 `new Error(message, { cause })` 来设置。 如果未提供 `cause` 选项，则构造函数不会设置它。

此属性允许链接错误。 序列化 `Error` 对象时，如果设置了 `error.cause`，[`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 会递归序列化 `error.cause`。

```js [ESM]
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` 属性是一个字符串标签，用于标识错误的类型。`error.code` 是识别错误最稳定的方法。它只会在 Node.js 的主要版本之间发生变化。相比之下，`error.message` 字符串可能在任何 Node.js 版本之间发生变化。有关特定代码的详细信息，请参阅 [Node.js 错误代码](/zh/nodejs/api/errors#nodejs-error-codes)。

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` 属性是由调用 `new Error(message)` 设置的错误的字符串描述。 传递给构造函数的 `message` 也会出现在 `Error` 的堆栈跟踪的第一行中，但是，在创建 `Error` 对象后更改此属性 *可能不会* 更改堆栈跟踪的第一行（例如，在更改此属性之前读取 `error.stack` 时）。

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.stack` 属性是一个字符串，描述了代码中实例化 `Error` 的位置。

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
第一行格式为 `\<错误类名\>: \<错误消息\>`，后跟一系列堆栈帧（每行以 "at " 开头）。 每个帧描述了代码中导致生成错误的调用点。 V8 尝试显示每个函数的名称（通过变量名、函数名或对象方法名），但有时它无法找到合适的名称。 如果 V8 无法确定函数的名称，则只会显示该帧的位置信息。 否则，将显示确定的函数名称，并在括号中附加位置信息。

帧仅为 JavaScript 函数生成。 例如，如果执行同步地通过一个名为 `cheetahify` 的 C++ 插件函数，该函数本身调用一个 JavaScript 函数，则表示 `cheetahify` 调用的帧将不会出现在堆栈跟踪中：

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
位置信息将是以下之一：

- `native`，如果帧表示 V8 内部的调用（如 `[].forEach`）。
- `plain-filename.js:line:column`，如果帧表示 Node.js 内部的调用。
- `/absolute/path/to/file.js:line:column`，如果帧表示用户程序（使用 CommonJS 模块系统）或其依赖项中的调用。
- `\<传输协议\>:///url/to/module/file.mjs:line:column`，如果帧表示用户程序（使用 ES 模块系统）或其依赖项中的调用。

表示堆栈跟踪的字符串在**访问** `error.stack` 属性时才会被延迟生成。

堆栈跟踪捕获的帧数受 `Error.stackTraceLimit` 或当前事件循环滴答中可用帧数的较小者的限制。


## 类: `AssertionError` {#class-assertionerror}

- 继承: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示断言失败。 有关详细信息，请参阅 [`类: assert.AssertionError`](/zh/nodejs/api/assert#class-assertassertionerror)。

## 类: `RangeError` {#class-rangeerror}

- 继承: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示提供的参数不在函数的允许值集合或范围内； 无论那是数值范围，还是给定函数参数的选项集之外。

```js [ESM]
require('node:net').connect(-1);
// 抛出 "RangeError: "port" option should be >= 0 and < 65536: -1"
```

Node.js 将*立即*生成并抛出 `RangeError` 实例，作为一种参数验证形式。

## 类: `ReferenceError` {#class-referenceerror}

- 继承: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示试图访问未定义的变量。 此类错误通常表示代码中存在拼写错误，或者程序以其他方式损坏。

虽然客户端代码可以生成和传播这些错误，但在实践中，只有 V8 会这样做。

```js [ESM]
doesNotExist;
// 抛出 ReferenceError，doesNotExist 不是此程序中的变量。
```

除非应用程序正在动态生成和运行代码，否则 `ReferenceError` 实例表示代码或其依赖项中存在错误。

## 类: `SyntaxError` {#class-syntaxerror}

- 继承: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示程序不是有效的 JavaScript。 这些错误可能仅在代码评估后生成和传播。 代码评估可能因 `eval`、`Function`、`require` 或 [vm](/zh/nodejs/api/vm) 而发生。 这些错误几乎总是表明程序已损坏。

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' 将是 SyntaxError。
}
```

`SyntaxError` 实例在其创建的上下文中是不可恢复的 - 它们只能被其他上下文捕获。

## 类: `SystemError` {#class-systemerror}

- 继承: [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

当 Node.js 运行时环境中发生异常时，Node.js 会生成系统错误。 这些通常发生在应用程序违反操作系统约束时。 例如，如果应用程序尝试读取不存在的文件，则会发生系统错误。

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果存在，则网络连接失败的地址
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串错误代码
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果存在，则报告文件系统错误时的文件路径目标
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 系统提供的错误号
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果存在，有关错误情况的额外详细信息
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 系统提供的错误的人工可读描述
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果存在，则报告文件系统错误时的文件路径
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果存在，则不可用的网络连接端口
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 触发错误的系统调用的名称


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果存在，`error.address` 是一个字符串，描述网络连接失败的地址。

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` 属性是一个表示错误码的字符串。

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果存在，`error.dest` 是报告文件系统错误时的文件路径目标。

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`error.errno` 属性是一个负数，对应于 [`libuv 错误处理`](https://docs.libuv.org/en/v1.x/errors) 中定义的错误码。

在 Windows 上，系统提供的错误号会被 libuv 标准化。

要获取错误码的字符串表示，请使用 [`util.getSystemErrorName(error.errno)`](/zh/nodejs/api/util#utilgetsystemerrornameerr)。

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果存在，`error.info` 是一个包含错误条件详细信息的对象。

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` 是系统提供的、人类可读的错误描述。

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果存在，`error.path` 是一个包含相关无效路径名的字符串。

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

如果存在，`error.port` 是不可用的网络连接端口。

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.syscall` 属性是一个字符串，描述失败的 [syscall](https://man7.org/linux/man-pages/man2/syscalls.2)。


### 常见系统错误 {#common-system-errors}

以下是在编写 Node.js 程序时经常遇到的一些系统错误列表。 有关完整列表，请参阅 [`errno`(3) man page](https://man7.org/linux/man-pages/man3/errno.3)。

-  `EACCES`（权限被拒绝）：试图以文件访问权限禁止的方式访问文件。
-  `EADDRINUSE`（地址已被使用）：由于本地系统上的另一个服务器已占用该地址，因此尝试将服务器（[`net`](/zh/nodejs/api/net)、[`http`](/zh/nodejs/api/http) 或 [`https`](/zh/nodejs/api/https)）绑定到本地地址失败。
-  `ECONNREFUSED`（连接被拒绝）：无法建立连接，因为目标机器主动拒绝了连接。 这通常是由于尝试连接到外地主机上处于非活动状态的服务而导致的。
-  `ECONNRESET`（连接被对等方重置）：连接被对等方强制关闭。 这通常是由于超时或重新启动导致远程套接字上的连接丢失而导致的。 经常通过 [`http`](/zh/nodejs/api/http) 和 [`net`](/zh/nodejs/api/net) 模块遇到。
-  `EEXIST`（文件已存在）：现有文件是需要目标不存在的操作的目标。
-  `EISDIR`（是目录）：操作需要文件，但给定的路径名是目录。
-  `EMFILE`（系统中打开的文件过多）：已达到系统上允许的[文件描述符](https://en.wikipedia.org/wiki/File_descriptor)的最大数量，并且在至少关闭一个描述符之前，无法满足对另一个描述符的请求。 当并行一次打开许多文件时会遇到这种情况，尤其是在进程的文件描述符限制较低的系统（尤其是 macOS）上。 要解决较低的限制，请在将运行 Node.js 进程的同一 shell 中运行 `ulimit -n 2048`。
-  `ENOENT`（没有这个文件或目录）：通常由 [`fs`](/zh/nodejs/api/fs) 操作引发，以指示指定的路径名的组件不存在。 找不到给定路径的实体（文件或目录）。
-  `ENOTDIR`（不是目录）：给定路径名的组件存在，但不是预期的目录。 通常由 [`fs.readdir`](/zh/nodejs/api/fs#fsreaddirpath-options-callback) 引发。
-  `ENOTEMPTY`（目录非空）：包含条目的目录是需要空目录的操作的目标，通常是 [`fs.unlink`](/zh/nodejs/api/fs#fsunlinkpath-callback)。
-  `ENOTFOUND`（DNS 查找失败）：指示 `EAI_NODATA` 或 `EAI_NONAME` 的 DNS 故障。 这不是标准的 POSIX 错误。
-  `EPERM`（不允许操作）：试图执行需要提升的权限的操作。
-  `EPIPE`（管道损坏）：在没有进程读取数据的管道、套接字或 FIFO 上写入。 经常在 [`net`](/zh/nodejs/api/net) 和 [`http`](/zh/nodejs/api/http) 层遇到，表示要写入的流的远程端已关闭。
-  `ETIMEDOUT`（操作超时）：连接或发送请求失败，因为连接方在一段时间后没有正确响应。 通常由 [`http`](/zh/nodejs/api/http) 或 [`net`](/zh/nodejs/api/net) 遇到。 通常是未正确调用 `socket.end()` 的标志。


## 类: `TypeError` {#class-typeerror}

- 继承自 [\<errors.Error\>](/zh/nodejs/api/errors#class-error)

表示提供的参数不是允许的类型。 例如，将函数传递给需要字符串的参数将引发 `TypeError`。

```js [ESM]
require('node:url').parse(() => { });
// 抛出 TypeError，因为它需要一个字符串。
```
Node.js 将作为参数验证的一种形式*立即*生成并抛出 `TypeError` 实例。

## 异常 vs. 错误 {#exceptions-vs-errors}

JavaScript 异常是一个值，该值是由于无效操作或作为 `throw` 语句的目标而抛出的。 虽然不要求这些值是 `Error` 的实例或继承自 `Error` 的类，但 Node.js 或 JavaScript 运行时抛出的所有异常*都将*是 `Error` 的实例。

某些异常在 JavaScript 层是*不可恢复的*。 这样的异常将*始终*导致 Node.js 进程崩溃。 示例包括 C++ 层中的 `assert()` 检查或 `abort()` 调用。

## OpenSSL 错误 {#openssl-errors}

源自 `crypto` 或 `tls` 的错误属于 `Error` 类，除了标准的 `.code` 和 `.message` 属性外，可能还具有一些额外的 OpenSSL 特有属性。

### `error.opensslErrorStack` {#erroropensslerrorstack}

一个错误数组，可以提供有关错误来自 OpenSSL 库中哪个位置的上下文。

### `error.function` {#errorfunction}

错误源自的 OpenSSL 函数。

### `error.library` {#errorlibrary}

错误源自的 OpenSSL 库。

### `error.reason` {#errorreason}

一个人类可读的字符串，描述了错误的原因。

## Node.js 错误码 {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**加入于: v15.0.0**

当操作被中止时使用（通常使用 `AbortController`）。

*不*使用 `AbortSignal` 的 API 通常不会引发带有此代码的错误。

此代码未使用 Node.js 错误使用的常规 `ERR_*` 约定，以便与 Web 平台的 `AbortError` 兼容。

### `ERR_ACCESS_DENIED` {#err_access_denied}

每当 Node.js 尝试访问受[权限模型](/zh/nodejs/api/permissions#permission-model)限制的资源时触发的一种特殊类型的错误。


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

函数参数的使用方式暗示可能对函数签名存在误解。当 `node:assert` 模块中的 `assert.throws(block, message)` 的 `message` 参数与 `block` 抛出的错误消息匹配时，会抛出此错误。这是因为这种用法表明用户认为 `message` 是期望的消息，而不是当 `block` 未抛出错误时 `AssertionError` 将显示的消息。

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Node.js API 需要一个可迭代参数（即，一个适用于 `for...of` 循环的值），但未提供。

### `ERR_ASSERTION` {#err_assertion}

一种特殊的错误类型，当 Node.js 检测到不应发生的异常逻辑违规时会触发。通常由 `node:assert` 模块引发。

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

试图将非函数注册为 `AsyncHooks` 回调。

### `ERR_ASYNC_TYPE` {#err_async_type}

异步资源的类型无效。如果使用公共嵌入器 API，用户也可以定义自己的类型。

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

传递给 Brotli 流的数据未成功压缩。

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

在 Brotli 流的构造过程中传递了无效的参数键。

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

试图从插件或嵌入器代码创建一个 Node.js `Buffer` 实例，但此时位于未与 Node.js 实例关联的 JS 引擎上下文中。传递给 `Buffer` 方法的数据将在该方法返回时被释放。

当遇到此错误时，创建 `Buffer` 实例的一个可能的替代方案是创建一个普通的 `Uint8Array`，它仅在结果对象的原型上有所不同。`Uint8Array` 通常被 Node.js 核心 API 接受，就像 `Buffer` 一样；它们在所有上下文中都可用。

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

试图执行超出 `Buffer` 边界的操作。

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

试图创建一个大于允许最大大小的 `Buffer`。


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js 无法监听 `SIGINT` 信号。

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

子进程在父进程收到回复之前关闭。

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

当派生子进程时未指定 IPC 通道时使用。

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

当主进程试图从子进程的 STDERR/STDOUT 读取数据，并且数据的长度大于 `maxBuffer` 选项时使用。

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.2.0, v14.17.1 | 重新引入了错误消息。 |
| v11.12.0 | 移除了错误消息。 |
| v10.5.0 | 添加于: v10.5.0 |
:::

尝试使用处于关闭状态的 `MessagePort` 实例，通常在调用 `.close()` 之后。

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

实例化 `Console` 时没有 `stdout` 流，或者 `Console` 有一个不可写的 `stdout` 或 `stderr` 流。

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**添加于: v12.5.0**

调用了一个不可调用的类构造函数。

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

调用类的构造函数时没有使用 `new`。

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

传递给 API 的 vm 上下文尚未初始化。 这可能发生在创建上下文期间发生错误（并被捕获）时，例如，当分配失败或在创建上下文时达到最大调用堆栈大小。

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

请求了一个 OpenSSL 引擎（例如，通过 `clientCertEngine` 或 `privateKeyEngine` TLS 选项），但该引擎不受正在使用的 OpenSSL 版本支持，这可能是由于编译时标志 `OPENSSL_NO_ENGINE`。

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

传递给 `crypto.ECDH()` 类的 `getPublicKey()` 方法的 `format` 参数的值无效。

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

传递给 `crypto.ECDH()` 类的 `computeSecret()` 方法的 `key` 参数的值无效。 这意味着公钥位于椭圆曲线之外。


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

传递给 [`require('node:crypto').setEngine()`](/zh/nodejs/api/crypto#cryptosetengineengine-flags) 的密码引擎标识符无效。

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

使用了 [`--force-fips`](/zh/nodejs/api/cli#--force-fips) 命令行参数，但尝试在 `node:crypto` 模块中启用或禁用 FIPS 模式。

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

尝试启用或禁用 FIPS 模式，但 FIPS 模式不可用。

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

多次调用了 [`hash.digest()`](/zh/nodejs/api/crypto#hashdigestencoding)。 每个 `Hash` 对象的实例只能调用一次 `hash.digest()` 方法。

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/zh/nodejs/api/crypto#hashupdatedata-inputencoding) 因任何原因失败。 这应该很少发生，甚至根本不发生。

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

给定的加密密钥与尝试的操作不兼容。

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

所选的公钥或私钥编码与其他选项不兼容。

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**新增于: v15.0.0**

加密子系统初始化失败。

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**新增于: v15.0.0**

提供了无效的认证标签。

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**新增于: v15.0.0**

为计数器模式密码提供了无效的计数器。

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**新增于: v15.0.0**

提供了无效的椭圆曲线。

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

指定了无效的[加密摘要算法](/zh/nodejs/api/crypto#cryptogethashes)。

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**新增于: v15.0.0**

提供了无效的初始化向量。

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**新增于: v15.0.0**

提供了无效的 JSON Web 密钥。

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**新增于: v15.0.0**

提供了无效的密钥长度。

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**新增于: v15.0.0**

提供了无效的密钥对。

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**新增于: v15.0.0**

提供了无效的密钥类型。


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

给定的密码密钥对象的类型对于尝试的操作无效。

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**新增于: v15.0.0**

提供了无效的消息长度。

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**新增于: v15.0.0**

一个或多个 [`crypto.scrypt()`](/zh/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) 或 [`crypto.scryptSync()`](/zh/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) 参数超出其合法范围。

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

一个密码方法在一个处于无效状态的对象上使用。 例如，在调用 `cipher.final()` 之前调用 [`cipher.getAuthTag()`](/zh/nodejs/api/crypto#ciphergetauthtag)。

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**新增于: v15.0.0**

提供了无效的身份验证标签长度。

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**新增于: v15.0.0**

异步密码操作初始化失败。

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

密钥的椭圆曲线未在 [JSON Web 密钥椭圆曲线注册表](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve) 中注册以供使用。

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

密钥的非对称密钥类型未在 [JSON Web 密钥类型注册表](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types) 中注册以供使用。

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**新增于: v15.0.0**

由于其他未指定的原因，密码操作失败。

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

PBKDF2 算法由于未指定的原因而失败。 OpenSSL 不提供更多详细信息，因此 Node.js 也不提供。

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js 在编译时未启用 `scrypt` 支持。 官方发布的二进制文件不可能出现这种情况，但自定义构建（包括发行版构建）可能会出现。

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

未向 [`sign.sign()`](/zh/nodejs/api/crypto#signsignprivatekey-outputencoding) 方法提供签名 `key`。

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

使用不同长度的 `Buffer`、`TypedArray` 或 `DataView` 参数调用了 [`crypto.timingSafeEqual()`](/zh/nodejs/api/crypto#cryptotimingsafeequala-b)。


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

指定了一个未知的密码。

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

给出了一个未知的 Diffie-Hellman 组名。 有效的组名列表，请参阅 [`crypto.getDiffieHellman()`](/zh/nodejs/api/crypto#cryptogetdiffiehellmangroupname)。

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**新增于: v15.0.0, v14.18.0**

尝试调用不支持的加密操作。

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**新增于: v16.4.0, v14.17.4**

[调试器](/zh/nodejs/api/debugger)发生错误。

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**新增于: v16.4.0, v14.17.4**

[调试器](/zh/nodejs/api/debugger)等待所需的主机/端口空闲超时。

### `ERR_DIR_CLOSED` {#err_dir_closed}

[`fs.Dir`](/zh/nodejs/api/fs#class-fsdir) 之前已关闭。

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**新增于: v14.3.0**

尝试在有正在进行的异步操作的 [`fs.Dir`](/zh/nodejs/api/fs#class-fsdir) 上进行同步读取或关闭调用。

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**新增于: v16.10.0, v14.19.0**

使用 [`--no-addons`](/zh/nodejs/api/cli#--no-addons) 已禁用加载原生插件。

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**新增于: v15.0.0**

对 `process.dlopen()` 的调用失败。

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` 无法设置 DNS 服务器。

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

`node:domain` 模块不可用，因为它无法建立所需的错误处理钩子，因为在早些时候调用了 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)。

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

无法调用 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)，因为 `node:domain` 模块已经在较早的时间点加载。

堆栈跟踪已扩展，以包含加载 `node:domain` 模块的时间点。

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

无法调用 [`v8.startupSnapshot.setDeserializeMainFunction()`](/zh/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data)，因为它之前已经被调用过。


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

提供给 `TextDecoder()` API 的数据根据提供的编码无效。

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

提供给 `TextDecoder()` API 的编码不是 [WHATWG 支持的编码](/zh/nodejs/api/util#whatwg-supported-encodings)之一。

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` 不能与 ESM 输入一起使用。

### `ERR_EVENT_RECURSION` {#err_event_recursion}

当尝试在 `EventTarget` 上递归派发事件时抛出。

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

JS 执行上下文未与 Node.js 环境关联。 当 Node.js 用作嵌入式库并且 JS 引擎的某些钩子未正确设置时，可能会发生这种情况。

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

通过 `util.callbackify()` 回调化的 `Promise` 被一个 falsy 值拒绝。

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**添加于: v14.0.0**

当使用当前运行 Node.js 的平台不可用的功能时使用。

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**添加于: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 将目录复制到非目录（文件、符号链接等）。

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**添加于: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 覆盖已经存在的文件，并且 `force` 和 `errorOnExist` 设置为 `true`。

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**添加于: v16.7.0**

当使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 时，`src` 或 `dest` 指向无效路径。

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**添加于: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 复制命名管道。

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**添加于: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 将非目录（文件、符号链接等）复制到目录。

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**添加于: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 复制到套接字。


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Added in: v16.7.0**

当使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 时，`dest` 中的一个符号链接指向 `src` 的一个子目录。

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Added in: v16.7.0**

尝试使用 [`fs.cp()`](/zh/nodejs/api/fs#fscpsrc-dest-options-callback) 复制到未知文件类型。

### `ERR_FS_EISDIR` {#err_fs_eisdir}

路径是一个目录。

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

尝试读取一个文件，该文件的大小大于 `Buffer` 允许的最大大小。

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

HTTP/2 ALTSVC 帧需要一个有效的 origin。

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

HTTP/2 ALTSVC 帧限制为最多 16,382 字节的有效负载。

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

对于使用 `CONNECT` 方法的 HTTP/2 请求，需要 `:authority` 伪标头。

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

对于使用 `CONNECT` 方法的 HTTP/2 请求，禁止使用 `:path` 伪标头。

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

对于使用 `CONNECT` 方法的 HTTP/2 请求，禁止使用 `:scheme` 伪标头。

### `ERR_HTTP2_ERROR` {#err_http2_error}

发生了一个非特定的 HTTP/2 错误。

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

在 `Http2Session` 收到来自连接对端的 `GOAWAY` 帧后，不能打开新的 HTTP/2 流。

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

在 HTTP/2 响应启动后指定了额外的标头。

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

尝试发送多个响应标头。

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

为需要只有一个值的 HTTP/2 标头字段提供了多个值。

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

信息性 HTTP 状态码 (`1xx`) 不能设置为 HTTP/2 响应的响应状态码。

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

HTTP/1 连接特定的标头禁止在 HTTP/2 请求和响应中使用。

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

指定了一个无效的 HTTP/2 标头值。


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

指定了无效的 HTTP 信息状态码。信息状态码必须是介于 `100` 和 `199` (包括) 之间的整数。

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

HTTP/2 `ORIGIN` 帧需要有效的来源。

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

传递给 `http2.getUnpackedSettings()` API 的 `Buffer` 和 `Uint8Array` 实例的长度必须是 6 的倍数。

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

只能使用有效的 HTTP/2 伪标头（`:status`、`:path`、`:authority`、`:scheme` 和 `:method`）。

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

对已被销毁的 `Http2Session` 对象执行了操作。

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

为 HTTP/2 设置指定了无效值。

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

对已被销毁的流执行了操作。

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

每当向已连接的对等方发送 HTTP/2 `SETTINGS` 帧时，该对等方都需要发送确认收到并应用新 `SETTINGS` 的确认。 默认情况下，在任何给定时间可以发送的最大未确认 `SETTINGS` 帧数是有限制的。 达到该限制时会使用此错误代码。

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

尝试从推送流内部启动新的推送流。 不允许嵌套推送流。

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

使用 `http2session.setLocalWindowSize(windowSize)` API 时内存不足。

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

尝试直接操作（读取、写入、暂停、恢复等）附加到 `Http2Session` 的套接字。

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

HTTP/2 `ORIGIN` 帧的长度限制为 16382 字节。

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

在单个 HTTP/2 会话上创建的流数量达到了最大限制。

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

为禁止有效负载的 HTTP 响应代码指定了消息有效负载。


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

一个 HTTP/2 ping 已被取消。

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

HTTP/2 ping 负载的长度必须正好是 8 个字节。

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

一个 HTTP/2 伪头部被不恰当地使用。伪头部是头部键名，以 `:` 前缀开头。

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

试图创建一个推送流，但已被客户端禁用。

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

试图使用 `Http2Stream.prototype.responseWithFile()` API 来发送一个目录。

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

试图使用 `Http2Stream.prototype.responseWithFile()` API 来发送除常规文件之外的其他内容，但提供了 `offset` 或 `length` 选项。

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

`Http2Session` 以非零错误代码关闭。

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

`Http2Session` 设置已取消。

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

试图将一个 `Http2Session` 对象连接到一个已经绑定到另一个 `Http2Session` 对象的 `net.Socket` 或 `tls.TLSSocket`。

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

试图使用已关闭的 `Http2Session` 的 `socket` 属性。

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

在 HTTP/2 中禁止使用 `101` 信息性状态代码。

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

已指定无效的 HTTP 状态代码。状态代码必须是介于 `100` 和 `599`（包括）之间的整数。

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

在任何数据传输到连接的对等方之前，`Http2Stream` 被销毁。

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

一个非零错误代码已在 `RST_STREAM` 帧中被指定。

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

当设置 HTTP/2 流的优先级时，该流可以被标记为父流的依赖项。当试图将一个流标记为自身的依赖项时，将使用此错误代码。

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

支持的自定义设置数量（10）已超过。


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Added in: v15.14.0**

对等方发送的可接受的无效 HTTP/2 协议帧数量已超过限制，该限制通过 `maxSessionInvalidFrames` 选项指定。

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

尾部标头已在 `Http2Stream` 上发送。

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

在 `Http2Stream` 对象上发出 `'wantTrailers'` 事件之后，才能调用 `http2stream.sendTrailers()` 方法。 只有为 `Http2Stream` 设置了 `waitForTrailers` 选项，才会发出 `'wantTrailers'` 事件。

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()` 被传递了一个使用 `http:` 或 `https:` 以外任何协议的 URL。

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

尝试写入不允许内容的 HTTP 响应时会抛出错误。

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

响应主体大小与指定的 content-length 标头值不匹配。

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

在标头已经发送之后，试图添加更多标头。

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

指定了无效的 HTTP 标头值。

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

状态码超出了常规状态码范围 (100-999)。

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

客户端未在允许的时间内发送整个请求。

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

给定的 [`ServerResponse`](/zh/nodejs/api/http#class-httpserverresponse) 已经分配了一个 socket。

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

根据 [RFC 7230 Section 3](https://tools.ietf.org/html/rfc7230#section-3)，不允许更改 socket 编码。

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

即使传输编码不支持，也设置了 `Trailer` 标头。

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

试图使用非公共构造函数构造对象。

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Added in: v21.1.0**

缺少导入属性，阻止导入指定的模块。


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**加入于: v21.1.0**

提供了一个 import `type` 属性，但指定的模块类型不匹配。

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**加入于: v21.0.0, v20.10.0, v18.19.0**

此版本的 Node.js 不支持 import 属性。

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

一个选项对彼此不兼容，不能同时使用。

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用了 `--input-type` 标志尝试执行文件。 此标志只能用于通过 `--eval`、`--print` 或 `STDIN` 的输入。

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

在使用 `node:inspector` 模块时，尝试激活检查器，但检查器已经开始监听端口。 请在使用不同的地址激活它之前，使用 `inspector.close()` 关闭。

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

在使用 `node:inspector` 模块时，尝试连接，但检查器已经连接。

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

在使用 `node:inspector` 模块时，尝试在使用会话已经关闭后使用检查器。

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

通过 `node:inspector` 模块发出命令时发生错误。

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

当调用 `inspector.waitForDebugger()` 时，`inspector` 未激活。

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

`node:inspector` 模块不可用。

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

在使用 `node:inspector` 模块时，尝试在使用检查器连接之前使用它。

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

在主线程上调用了一个只能从工作线程使用的 API。

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Node.js 中存在一个错误，或者对 Node.js 内部组件的使用不正确。 要修复该错误，请在 [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) 上提出问题。


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

提供的地址 Node.js API 无法识别。

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

提供的地址族 Node.js API 无法识别。

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

传递给 Node.js API 的参数类型错误。

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

为给定的参数传递了无效或不支持的值。

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

使用 `AsyncHooks` 传递了无效的 `asyncId` 或 `triggerAsyncId`。 小于 -1 的 id 永远不应该发生。

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

对 `Buffer` 执行了交换，但其大小与该操作不兼容。

### `ERR_INVALID_CHAR` {#err_invalid_char}

在标头中检测到无效字符。

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

在没有指定列的情况下，无法将给定流上的光标移动到指定的行。

### `ERR_INVALID_FD` {#err_invalid_fd}

文件描述符 ('fd') 无效（例如，它是一个负值）。

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

文件描述符 ('fd') 类型无效。

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

使用 `file:` URL 的 Node.js API（例如 [`fs`](/zh/nodejs/api/fs) 模块中的某些函数）遇到了具有不兼容主机的 file URL。 这种情况只能在类似 Unix 的系统上发生，这些系统仅支持 `localhost` 或空主机。

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

使用 `file:` URL 的 Node.js API（例如 [`fs`](/zh/nodejs/api/fs) 模块中的某些函数）遇到了具有不兼容路径的 file URL。 确定是否可以使用路径的确切语义取决于平台。

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

尝试通过 IPC 通信通道将不受支持的“句柄”发送到子进程。 有关更多信息，请参见 [`subprocess.send()`](/zh/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) 和 [`process.send()`](/zh/nodejs/api/process#processsendmessage-sendhandle-options-callback)。

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

提供了无效的 HTTP 令牌。

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

IP 地址无效。


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

MIME 的语法无效。

### `ERR_INVALID_MODULE` {#err_invalid_module}

**新增于: v15.0.0, v14.18.0**

试图加载一个不存在或以其他方式无效的模块。

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

导入的模块字符串是无效的 URL、包名或包子路径说明符。

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

在设置对象属性上的无效属性时发生错误。

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

一个无效的 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件解析失败。

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

`package.json` 的 [`"exports"`](/zh/nodejs/api/packages#exports) 字段包含用于尝试的模块解析的无效目标映射值。

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

传递给 `http.request()` 的 `options.protocol` 无效。

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

在 [`REPL`](/zh/nodejs/api/repl) 配置中同时设置了 `breakEvalOnSigint` 和 `eval` 选项，这是不支持的。

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

输入可能无法在 [`REPL`](/zh/nodejs/api/repl) 中使用。 使用此错误的条件在 [`REPL`](/zh/nodejs/api/repl) 文档中进行了描述。

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

如果函数选项在执行时没有为其返回的对象属性之一提供有效值，则抛出此错误。

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

如果函数选项在执行时没有为其返回的对象属性之一提供预期的值类型，则抛出此错误。

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

如果函数选项在执行时没有返回预期的值类型，例如当期望函数返回 promise 时，则抛出此错误。

### `ERR_INVALID_STATE` {#err_invalid_state}

**新增于: v15.0.0**

表示由于无效状态而无法完成操作。 例如，对象可能已被销毁，或者可能正在执行另一项操作。

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

已将 `Buffer`、`TypedArray`、`DataView` 或 `string` 作为 stdio 输入提供给异步 fork。 有关更多信息，请参见 [`child_process`](/zh/nodejs/api/child_process) 模块的文档。


### `ERR_INVALID_THIS` {#err_invalid_this}

一个 Node.js API 函数被调用时，使用了不兼容的 `this` 值。

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// 抛出一个类型错误，错误码为 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

提供给 [WHATWG](/zh/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams` 构造函数](/zh/nodejs/api/url#new-urlsearchparamsiterable) 的 `iterable` 中的一个元素，不代表一个 `[name, value]` 元组 —— 也就是说，如果一个元素不可迭代，或者不恰好包含两个元素。

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**新增于: v23.0.0**

提供的 TypeScript 语法无效或不受支持。 当使用需要使用 [类型剥离](/zh/nodejs/api/typescript#type-stripping) 进行转换的 TypeScript 语法时，可能会发生这种情况。

### `ERR_INVALID_URI` {#err_invalid_uri}

传递了一个无效的 URI。

### `ERR_INVALID_URL` {#err_invalid_url}

将一个无效的 URL 传递给 [WHATWG](/zh/nodejs/api/url#the-whatwg-url-api) [`URL` 构造函数](/zh/nodejs/api/url#new-urlinput-base) 或旧版的 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 进行解析。 抛出的错误对象通常具有一个额外的属性 `'input'`，其中包含未能解析的 URL。

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

尝试将与特定用途不兼容的方案（协议）的 URL 用于特定目的。 它仅用于 [`fs`](/zh/nodejs/api/fs) 模块中的 [WHATWG URL API](/zh/nodejs/api/url#the-whatwg-url-api) 支持（仅接受具有 `'file'` 方案的 URL），但将来也可能在其他 Node.js API 中使用。

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

尝试使用已经关闭的 IPC 通信通道。

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

尝试断开一个已经断开连接的 IPC 通信通道。 有关更多信息，请参阅 [`child_process`](/zh/nodejs/api/child_process) 模块的文档。

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

尝试创建一个使用多个 IPC 通信通道的子 Node.js 进程。 有关更多信息，请参阅 [`child_process`](/zh/nodejs/api/child_process) 模块的文档。


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

试图打开与同步 fork 的 Node.js 进程的 IPC 通信通道。 更多信息请参考 [`child_process`](/zh/nodejs/api/child_process) 模块的文档。

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IP 被 `net.BlockList` 阻止。

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**新增于: v18.6.0, v16.17.0**

一个 ESM 加载器钩子返回时，没有调用 `next()` 也没有显式地发出短路信号。

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**新增于: v23.5.0**

加载 SQLite 扩展时发生错误。

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

试图分配内存（通常在 C++ 层），但失败了。

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**新增于: v14.5.0, v12.19.0**

发布到 [`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport) 的消息无法在目标 [vm](/zh/nodejs/api/vm) `Context` 中反序列化。 目前并非所有 Node.js 对象都可以成功地在任何上下文中实例化，在这种情况下，尝试使用 `postMessage()` 传输它们可能会在接收端失败。

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

需要一个方法但未实现。

### `ERR_MISSING_ARGS` {#err_missing_args}

未传递 Node.js API 的必需参数。 这仅用于严格遵守 API 规范（在某些情况下可能接受 `func(undefined)` 但不接受 `func()`）。 在大多数原生 Node.js API 中，`func(undefined)` 和 `func()` 被视为相同，并且可能会改用 [`ERR_INVALID_ARG_TYPE`](/zh/nodejs/api/errors#err-invalid-arg-type) 错误代码。

### `ERR_MISSING_OPTION` {#err_missing_option}

对于接受选项对象的 API，某些选项可能是强制性的。 如果缺少必需的选项，则会抛出此代码。

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

试图读取加密密钥，但未指定密码。

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

此 Node.js 实例使用的 V8 平台不支持创建 Workers。 这是由于缺少对 Workers 的嵌入器支持造成的。 特别是，此错误不会发生在 Node.js 的标准构建中。


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

在尝试执行 `import` 操作或加载程序入口点时，ECMAScript 模块加载器无法解析模块文件。

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

一个回调被多次调用。

回调几乎总是只应该被调用一次，因为查询要么被满足，要么被拒绝，而不能同时发生。 后者可以通过多次调用回调来实现。

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

在使用 `Node-API` 时，传递的构造函数不是一个函数。

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

在调用 `napi_create_dataview()` 时，给定的 `offset` 超出了 dataview 的范围，或者 `offset + length` 大于给定 `buffer` 的长度。

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

在调用 `napi_create_typedarray()` 时，提供的 `offset` 不是元素大小的倍数。

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

在调用 `napi_create_typedarray()` 时，`(length * size_of_element) + byte_offset` 大于给定 `buffer` 的长度。

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

在调用线程安全函数的 JavaScript 部分时发生错误。

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

在尝试检索 JavaScript `undefined` 值时发生错误。

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

一个非上下文感知的原生插件在一个禁止它们的进程中被加载。

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

尝试使用只能在构建 V8 启动快照时使用的操作，即使 Node.js 没有构建快照。

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**添加于: v21.7.0, v20.12.0**

该操作无法在单可执行应用程序中执行。

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

尝试执行构建启动快照时不支持的操作。

### `ERR_NO_CRYPTO` {#err_no_crypto}

尝试使用加密功能，但 Node.js 在编译时没有包含 OpenSSL 加密支持。


### `ERR_NO_ICU` {#err_no_icu}

尝试使用需要 [ICU](/zh/nodejs/api/intl#internationalization-support) 的功能，但 Node.js 在编译时未启用 ICU 支持。

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**新增于: v23.0.0**

尝试使用需要 [原生 TypeScript 支持](/zh/nodejs/api/typescript#type-stripping) 的功能，但 Node.js 在编译时未启用 TypeScript 支持。

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**新增于: v15.0.0**

操作失败。 这通常用于指示异步操作的一般性失败。

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

给定的值超出可接受的范围。

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

`package.json` 的 [`"imports"`](/zh/nodejs/api/packages#imports) 字段未定义给定的内部包说明符映射。

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

`package.json` 的 [`"exports"`](/zh/nodejs/api/packages#exports) 字段未导出请求的子路径。 因为导出是封装的，所以未导出的私有内部模块无法通过包解析导入，除非使用绝对 URL。

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**新增于: v18.3.0, v16.17.0**

当 `strict` 设置为 `true` 时，如果为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 类型的选项提供了 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 值，或者为 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 类型的选项提供了 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 值，则由 [`util.parseArgs()`](/zh/nodejs/api/util#utilparseargsconfig) 抛出。

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**新增于: v18.3.0, v16.17.0**

当提供位置参数并且 `allowPositionals` 设置为 `false` 时，由 [`util.parseArgs()`](/zh/nodejs/api/util#utilparseargsconfig) 抛出。

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**新增于: v18.3.0, v16.17.0**

当 `strict` 设置为 `true` 时，如果参数未在 `options` 中配置，则由 [`util.parseArgs()`](/zh/nodejs/api/util#utilparseargsconfig) 抛出。


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

为性能标记或度量提供了无效的时间戳值。

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

为性能度量提供了无效的选项。

### `ERR_PROTO_ACCESS` {#err_proto_access}

使用 [`--disable-proto=throw`](/zh/nodejs/api/cli#--disable-protomode) 禁止访问 `Object.prototype.__proto__`。应该使用 [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 和 [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 来获取和设置对象的原型。

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**添加于: v23.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

发生 QUIC 应用程序错误。

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**添加于: v23.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

建立 QUIC 连接失败。

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**添加于: v23.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

QUIC 端点因错误而关闭。

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**添加于: v23.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

打开 QUIC 流失败。

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**添加于: v23.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

发生 QUIC 传输错误。

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**添加于: v23.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

QUIC 会话失败，因为需要版本协商。


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

当尝试 `require()` 一个 [ES 模块](/zh/nodejs/api/esm)时，该模块最终是异步的。 也就是说，它包含顶层 await。

要查看顶层 await 的位置，请使用 `--experimental-print-required-tla`（这将在查找顶层 await 之前执行模块）。

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

当尝试 `require()` 一个 [ES 模块](/zh/nodejs/api/esm) 时，CommonJS 到 ESM 或 ESM 到 CommonJS 的边缘参与了一个直接的循环。 这是不允许的，因为 ES 模块在已经被评估时不能被评估。

为了避免循环，循环中涉及的 `require()` 调用不应该发生在 ES 模块（通过 `createRequire()`）或 CommonJS 模块的顶层，并且应该在内部函数中延迟完成。

### `ERR_REQUIRE_ESM` {#err_require_esm}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | `require()` 现在默认支持加载同步 ES 模块。 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

试图 `require()` 一个 [ES 模块](/zh/nodejs/api/esm)。

自从 `require()` 现在支持加载同步 ES 模块以来，此错误已被弃用。 当 `require()` 遇到包含顶层 `await` 的 ES 模块时，它将抛出 [`ERR_REQUIRE_ASYNC_MODULE`](/zh/nodejs/api/errors#err_require_async_module) 错误。

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

脚本执行被 `SIGINT` 中断（例如，按下了 + 键。）

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

脚本执行超时，可能是由于正在执行的脚本中存在错误。

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

当 `net.Server` 已经在监听时，调用了 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 方法。 这适用于 `net.Server` 的所有实例，包括 HTTP、HTTPS 和 HTTP/2 `Server` 实例。


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

当 `net.Server` 未运行时，调用了 [`server.close()`](/zh/nodejs/api/net#serverclosecallback) 方法。 这适用于 `net.Server` 的所有实例，包括 HTTP、HTTPS 和 HTTP/2 `Server` 实例。

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**添加于: v21.7.0, v20.12.0**

传递给单可执行文件应用程序 API 的一个键，用于标识资源，但找不到匹配项。

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

试图绑定一个已经绑定的套接字。

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

在 [`dgram.createSocket()`](/zh/nodejs/api/dgram#dgramcreatesocketoptions-callback) 中为 `recvBufferSize` 或 `sendBufferSize` 选项传递了一个无效（负数）的大小。

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

期望端口 >= 0 且 < 65536 的 API 函数接收到一个无效值。

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

期望套接字类型（`udp4` 或 `udp6`）的 API 函数接收到一个无效值。

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

使用 [`dgram.createSocket()`](/zh/nodejs/api/dgram#dgramcreatesocketoptions-callback) 时，无法确定接收或发送 `Buffer` 的大小。

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

试图对一个已经关闭的套接字进行操作。

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

在连接套接字上调用 [`net.Socket.write()`](/zh/nodejs/api/net#socketwritedata-encoding-callback) 且套接字在连接建立之前关闭时。

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

当使用族自动选择算法时，套接字无法在允许的超时时间内连接到 DNS 返回的任何地址。

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

在已连接的套接字上调用了 [`dgram.connect()`](/zh/nodejs/api/dgram#socketconnectport-address-callback)。

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

在断开连接的套接字上调用了 [`dgram.disconnect()`](/zh/nodejs/api/dgram#socketdisconnect) 或 [`dgram.remoteAddress()`](/zh/nodejs/api/dgram#socketremoteaddress)。

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

进行了调用，但 UDP 子系统未运行。


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

由于源映射不存在或已损坏，无法解析。

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

从源映射导入的文件未找到。

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**添加于: v22.5.0**

从 [SQLite](/zh/nodejs/api/sqlite) 返回了一个错误。

### `ERR_SRI_PARSE` {#err_sri_parse}

为子资源完整性检查提供了一个字符串，但无法解析。 通过查看 [子资源完整性规范](https://www.w3.org/TR/SRI/#the-integrity-attribute) 来检查 integrity 属性的格式。

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

调用了一个流方法，该方法无法完成，因为流已完成。

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

尝试在 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流上调用 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options)。

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

调用了一个流方法，该方法无法完成，因为流已使用 `stream.destroy()` 销毁。

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

尝试使用 `null` 块调用 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback)。

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

当流或管道非正常结束且没有明确的错误时，由 `stream.finished()` 和 `stream.pipeline()` 返回的错误。

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

在将 `null` (EOF) 推送到流后，尝试调用 [`stream.push()`](/zh/nodejs/api/stream#readablepushchunk-encoding)。

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

尝试在管道中管道传输到已关闭或已销毁的流。

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

尝试在发出 `'end'` 事件后调用 [`stream.unshift()`](/zh/nodejs/api/stream#readableunshiftchunk-encoding)。

### `ERR_STREAM_WRAP` {#err_stream_wrap}

如果 Socket 上设置了字符串解码器，或者解码器处于 `objectMode`，则阻止中止。

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

在调用 `stream.end()` 之后，尝试调用 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback)。

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

尝试创建一个长度超过允许最大值的字符串。

### `ERR_SYNTHETIC` {#err_synthetic}

一个用于捕获诊断报告调用堆栈的人工错误对象。

### `ERR_SYSTEM_ERROR` {#err_system_error}

在 Node.js 进程中发生了一个未指定或不具体的系统错误。该错误对象将具有一个 `err.info` 对象属性，其中包含其他详细信息。

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

一个表示词法分析器状态失败的错误。

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

一个表示解析器状态失败的错误。有关导致错误的令牌的更多信息，可通过 `cause` 属性获得。

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

此错误表示 TAP 验证失败。

### `ERR_TEST_FAILURE` {#err_test_failure}

此错误表示测试失败。有关失败的更多信息，可通过 `cause` 属性获得。`failureType` 属性指定测试在发生故障时正在执行的操作。

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

当 `ALPNCallback` 返回的值不在客户端提供的 ALPN 协议列表中时，会抛出此错误。

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

如果在创建 `TLSServer` 时，TLS 选项同时包含 `ALPNProtocols` 和 `ALPNCallback`，则会抛出此错误。这些选项是互斥的。

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

如果用户提供的 `subjectaltname` 属性违反了编码规则，则 `checkServerIdentity` 会抛出此错误。Node.js 本身生成的证书对象始终符合编码规则，因此永远不会导致此错误。

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

在使用 TLS 时，对等方的主机名/IP 与其证书中的任何 `subjectAltNames` 都不匹配。

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

在使用 TLS 时，为 Diffie-Hellman (`DH`) 密钥协商协议提供的参数太小。默认情况下，为了避免漏洞，密钥长度必须大于或等于 1024 位，即使强烈建议使用 2048 位或更大的密钥以获得更强的安全性。


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

TLS/SSL 握手超时。 在这种情况下，服务器也必须中止连接。

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**新增于: v13.3.0**

上下文必须是 `SecureContext`。

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

指定的 `secureProtocol` 方法无效。 它要么是未知的，要么是因为不安全而被禁用。

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

有效的 TLS 协议版本为 `'TLSv1'`、`'TLSv1.1'` 或 `'TLSv1.2'`。

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**新增于: v13.10.0, v12.17.0**

TLS 套接字必须已连接并安全地建立。 确保在继续之前发出 'secure' 事件。

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

尝试设置 TLS 协议 `minVersion` 或 `maxVersion` 与尝试显式设置 `secureProtocol` 冲突。 使用一种机制或另一种机制。

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

设置 PSK 身份提示失败。 提示可能太长。

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

尝试在禁用重新协商的套接字实例上重新协商 TLS。

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

在使用 TLS 时，调用了 `server.addContext()` 方法，但未在第一个参数中提供主机名。

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

检测到过多的 TLS 重新协商，这可能是拒绝服务攻击的潜在向量。

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

尝试从 TLS 服务器端套接字发出服务器名称指示，这仅对客户端有效。

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

`trace_events.createTracing()` 方法至少需要一个跟踪事件类别。

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

由于 Node.js 是使用 `--without-v8-platform` 标志编译的，因此无法加载 `node:trace_events` 模块。

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

`Transform` 流在仍在转换时完成。

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

`Transform` 流在写入缓冲区中仍有数据的情况下完成。


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

由于系统错误，TTY 的初始化失败。

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

函数在 [`process.on('exit')`](/zh/nodejs/api/process#event-exit) 处理程序中被调用，但该函数不应该在 [`process.on('exit')`](/zh/nodejs/api/process#event-exit) 处理程序中被调用。

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) 被调用了两次，但没有先将回调重置为 `null`。

此错误旨在防止意外覆盖从另一个模块注册的回调。

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

收到了包含未转义字符的字符串。

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

发生了未处理的错误（例如，当 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 发出 `'error'` 事件但未注册 `'error'` 处理程序时）。

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

用于标识一种特定的内部 Node.js 错误，通常不应由用户代码触发。此错误的实例指向 Node.js 二进制文件本身的内部错误。

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

传递了一个不存在的 Unix 组或用户标识符。

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

传递给 API 的编码选项无效或未知。

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

尝试加载具有未知或不支持的文件扩展名的模块。

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

尝试加载具有未知或不支持的格式的模块。

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

传递给期望有效信号的 API（例如 [`subprocess.kill()`](/zh/nodejs/api/child_process#subprocesskillsignal)）的进程信号无效或未知。


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

不支持 `import` 目录 URL。 请[使用其名称自引用包](/zh/nodejs/api/packages#self-referencing-a-package-using-its-name)并在 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件的 [`"exports"`](/zh/nodejs/api/packages#exports) 字段中[定义自定义子路径](/zh/nodejs/api/packages#subpath-exports)。

```js [ESM]
import './'; // 不支持
import './index.js'; // 支持
import 'package-name'; // 支持
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

不支持使用 `file` 和 `data` 以外的 URL 方案进行 `import`。

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**添加于: v22.6.0**

不支持从属于 `node_modules` 目录的文件进行类型剥离。

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

尝试解析无效的模块引用者。 当导入或使用以下任一项调用 `import.meta.resolve()` 时，可能会发生这种情况：

- 来自 URL 方案不是 `file` 的模块的，不是内置模块的裸标识符。
- 来自 URL 方案不是[特殊方案](https://url.spec.whatwg.org/#special-scheme)的模块的[相对 URL](https://url.spec.whatwg.org/#relative-url-string)。

```js [ESM]
try {
  // 尝试从 `data:` URL 模块导入包 'bare-specifier':
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

尝试使用已经关闭的东西。

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

当使用性能计时 API (`perf_hooks`) 时，未找到有效的性能条目类型。

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

未指定动态导入回调。

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

在没有 `--experimental-vm-modules` 的情况下调用了动态导入回调。


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

由于以下原因之一，尝试链接的模块不符合链接条件：

- 它已经被链接（`linkingStatus` 为 `'linked'`）
- 它正在被链接（`linkingStatus` 为 `'linking'`）
- 此模块的链接失败（`linkingStatus` 为 `'errored'`）

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

传递给模块构造函数的 `cachedData` 选项无效。

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

无法为已经评估过的模块创建缓存数据。

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

从链接器函数返回的模块与父模块的上下文不同。链接的模块必须共享相同的上下文。

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

由于失败，模块无法链接。

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

链接 Promise 的 fulfilled 值不是 `vm.Module` 对象。

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

当前模块的状态不允许此操作。 错误的具体含义取决于具体的函数。

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

WASI 实例已启动。

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

WASI 实例尚未启动。

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**新增于: v18.1.0**

传递给 `WebAssembly.compileStreaming` 或 `WebAssembly.instantiateStreaming` 的 `Response` 不是有效的 WebAssembly 响应。

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

`Worker` 初始化失败。

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

传递给 `Worker` 构造函数的 `execArgv` 选项包含无效的标志。

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**新增于: v22.5.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

目标线程在处理通过 [`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 发送的消息时抛出了错误。


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

[`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 中请求的线程无效或没有 `workerMessage` 监听器。

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

[`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 中请求的线程 ID 是当前线程 ID。

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

通过 [`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 发送消息超时。

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

由于 `Worker` 实例当前未运行，操作失败。

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

`Worker` 实例因达到其内存限制而终止。

### `ERR_WORKER_PATH` {#err_worker_path}

worker 的主脚本的路径既不是绝对路径，也不是以 `./` 或 `../` 开头的相对路径。

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

从 worker 线程序列化未捕获异常的所有尝试均失败。

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

worker 线程不支持所请求的功能。

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

由于配置不正确，[`zlib`](/zh/nodejs/api/zlib) 对象的创建失败。

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Added in: v21.6.2, v20.11.1, v18.19.1**

接收到的块扩展数据过多。 为了防止恶意或配置错误的客户端，如果接收到的数据超过 16 KiB，则会发出带有此代码的 `Error`。


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.4.0, v10.15.0 | `http_parser` 中的最大头部大小设置为 8 KiB。 |
:::

收到了过多的 HTTP 头部数据。 为了防止恶意或配置错误的客户端，如果接收到的 HTTP 头部数据超过 `maxHeaderSize`，则 HTTP 解析将中止，且不会创建请求或响应对象，并会发出带有此代码的 `Error`。

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

服务器同时发送了 `Content-Length` 头部和 `Transfer-Encoding: chunked`。

`Transfer-Encoding: chunked` 允许服务器为动态生成的内容维护 HTTP 持久连接。 在这种情况下，无法使用 `Content-Length` HTTP 头部。

请使用 `Content-Length` 或 `Transfer-Encoding: chunked`。

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 添加了 `requireStack` 属性。 |
:::

在尝试 [`require()`](/zh/nodejs/api/modules#requireid) 操作或加载程序入口点时，CommonJS 模块加载器无法解析模块文件。

## 遗留 Node.js 错误码 {#legacy-nodejs-error-codes}

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定度: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 这些错误码要么是不一致的，要么已被移除。
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**添加于: v10.5.0**

**移除于: v12.5.0**

传递给 `postMessage()` 的值包含一个不支持传输的对象。

### `ERR_CPU_USAGE` {#err_cpu_usage}

**移除于: v15.0.0**

来自 `process.cpuUsage` 的原生调用无法处理。

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**添加于: v9.0.0**

**移除于: v12.12.0**

UTF-16 编码被用于 [`hash.digest()`](/zh/nodejs/api/crypto#hashdigestencoding)。 虽然 `hash.digest()` 方法确实允许传入一个 `encoding` 参数，导致该方法返回一个字符串而不是 `Buffer`，但不支持 UTF-16 编码（例如 `ucs` 或 `utf16le`）。


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**已移除：v23.0.0**

传递给 [`crypto.scrypt()`](/zh/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) 或 [`crypto.scryptSync()`](/zh/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) 的选项组合不兼容。 新版本的 Node.js 使用错误代码 [`ERR_INCOMPATIBLE_OPTION_PAIR`](/zh/nodejs/api/errors#err_incompatible_option_pair) 代替，这与其他 API 一致。

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**已移除：v23.0.0**

传递给 [`fs.symlink()`](/zh/nodejs/api/fs#fssymlinktarget-path-type-callback) 或 [`fs.symlinkSync()`](/zh/nodejs/api/fs#fssymlinksynctarget-path-type) 方法的符号链接类型无效。

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**已添加：v9.0.0**

**已移除：v10.0.0**

当在 HTTP/2 会话上发送单个帧时发生故障时使用。

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**已添加：v9.0.0**

**已移除：v10.0.0**

当需要 HTTP/2 标头对象时使用。

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**已添加：v9.0.0**

**已移除：v10.0.0**

当 HTTP/2 消息中缺少必需的标头时使用。

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**已添加：v9.0.0**

**已移除：v10.0.0**

HTTP/2 信息性标头必须仅在调用 `Http2Stream.prototype.respond()` 方法*之前*发送。

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**已添加：v9.0.0**

**已移除：v10.0.0**

当已对已关闭的 HTTP/2 流执行操作时使用。

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**已添加：v9.0.0**

**已移除：v10.0.0**

当在 HTTP 响应状态消息（原因短语）中找到无效字符时使用。

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**已添加：v17.1.0, v16.14.0**

**已移除：v21.1.0**

导入断言失败，阻止导入指定的模块。

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**已添加：v17.1.0, v16.14.0**

**已移除：v21.1.0**

缺少导入断言，阻止导入指定的模块。


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**加入于: v17.1.0, v16.14.0**

**移除于: v21.1.0**

此 Node.js 版本不支持导入断言。

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**加入于: v10.0.0**

**移除于: v11.0.0**

给定的索引超出了可接受的范围（例如，负偏移）。

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**加入于: v8.0.0**

**移除于: v15.0.0**

在 options 对象中传递了无效或意外的值。

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**加入于: v9.0.0**

**移除于: v15.0.0**

传递了无效或未知的文件编码。

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**加入于: v8.5.0**

**移除于: v16.7.0**

使用 Performance Timing API (`perf_hooks`) 时，性能标记无效。

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 抛出 `DOMException` 代替。 |
| v21.0.0 | 移除于: v21.0.0 |
:::

传递给 `postMessage()` 的传输对象无效。

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**移除于: v22.2.0**

尝试加载资源，但该资源与策略清单定义的完整性不匹配。 有关更多信息，请参见策略清单的文档。

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**移除于: v22.2.0**

尝试加载资源，但该资源未被列为尝试加载它的位置的依赖项。 有关更多信息，请参见策略清单的文档。

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**移除于: v22.2.0**

尝试加载策略清单，但该清单对于不匹配的资源具有多个条目。 更新清单条目以匹配，从而解决此错误。 有关更多信息，请参见策略清单的文档。

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**移除于: v22.2.0**

策略清单资源对于其某个字段具有无效值。 更新清单条目以匹配，从而解决此错误。 有关更多信息，请参见策略清单的文档。


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**已移除：v22.2.0**

一个策略清单资源对其依赖映射具有无效值。更新清单条目以匹配即可解决此错误。有关更多信息，请参阅策略清单的文档。

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**已移除：v22.2.0**

尝试加载策略清单，但无法解析该清单。有关更多信息，请参阅策略清单的文档。

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**已移除：v22.2.0**

尝试从策略清单中读取，但尚未进行清单初始化。这可能是 Node.js 中的一个错误。

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**已移除：v22.2.0**

加载了策略清单，但其“onerror”行为的值未知。有关更多信息，请参阅策略清单的文档。

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**已移除：v15.0.0**

此错误代码已在 Node.js v15.0.0 中被 [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/zh/nodejs/api/errors#err_missing_transferable_in_transfer_list) 替换，因为它不再准确，因为现在也存在其他类型的可传输对象。

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 抛出一个 `DOMException` 代替。 |
| v21.0.0 | 已移除：v21.0.0 |
| v15.0.0 | 添加于：v15.0.0 |
:::

需要在 `transferList` 参数中显式列出的对象位于传递给 [`postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 调用的对象中，但未在该调用的 `transferList` 中提供。通常，这是一个 `MessagePort`。

在 v15.0.0 之前的 Node.js 版本中，此处使用的错误代码是 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/zh/nodejs/api/errors#err_missing_message_port_in_transfer_list)。但是，可传输对象类型的集合已扩展到涵盖比 `MessagePort` 更多的类型。

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**添加于：v9.0.0**

**已移除：v10.0.0**

当 `Constructor.prototype` 不是对象时，由 `Node-API` 使用。


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**添加于: v10.6.0, v8.16.0**

**移除于: v14.2.0, v12.17.0**

在主线程上，值会从与线程安全函数相关联的队列中在一个空闲循环中移除。此错误表示在尝试启动循环时发生了错误。

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**添加于: v10.6.0, v8.16.0**

**移除于: v14.2.0, v12.17.0**

一旦队列中没有剩余项目，空闲循环必须暂停。此错误表示空闲循环未能停止。

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

以不受支持的方式调用了 Node.js API，例如 `Buffer.write(string, encoding, offset[, length])`。

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**添加于: v9.0.0**

**移除于: v10.0.0**

通常用于标识操作导致内存不足的情况。

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**添加于: v9.0.0**

**移除于: v10.0.0**

`node:repl` 模块无法解析来自 REPL 历史记录文件的数据。

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**添加于: v9.0.0**

**移除于: v14.0.0**

无法在套接字上发送数据。

### `ERR_STDERR_CLOSE` {#err_stderr_close}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.12.0 | `process.stderr.end()` 现在仅关闭流的一侧，而不关闭底层资源，从而使此错误过时，而不是发出错误。 |
| v10.12.0 | 移除于: v10.12.0 |
:::

尝试关闭 `process.stderr` 流。 根据设计，Node.js 不允许用户代码关闭 `stdout` 或 `stderr` 流。

### `ERR_STDOUT_CLOSE` {#err_stdout_close}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.12.0 | `process.stderr.end()` 现在仅关闭流的一侧，而不关闭底层资源，从而使此错误过时，而不是发出错误。 |
| v10.12.0 | 移除于: v10.12.0 |
:::

尝试关闭 `process.stdout` 流。 根据设计，Node.js 不允许用户代码关闭 `stdout` 或 `stderr` 流。

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**添加于: v9.0.0**

**移除于: v10.0.0**

当尝试使用未实现 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 的可读流时使用。


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Added in: v9.0.0**

**Removed in: v10.0.0**

当 TLS 重新协商请求以非特定方式失败时使用。

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Added in: v10.5.0**

**Removed in: v14.0.0**

在序列化期间遇到一个内存不由 JavaScript 引擎或 Node.js 管理的 `SharedArrayBuffer`。 这样的 `SharedArrayBuffer` 无法被序列化。

这只会发生在原生插件以“外部化”模式创建 `SharedArrayBuffer`，或将现有的 `SharedArrayBuffer` 放入外部化模式时。

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Added in: v8.0.0**

**Removed in: v11.7.0**

尝试使用未知的 `stdin` 文件类型启动 Node.js 进程。 此错误通常表明 Node.js 本身存在错误，尽管用户代码也可能触发它。

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Added in: v8.0.0**

**Removed in: v11.7.0**

尝试使用未知的 `stdout` 或 `stderr` 文件类型启动 Node.js 进程。 此错误通常表明 Node.js 本身存在错误，尽管用户代码也可能触发它。

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

使用了 V8 `BreakIterator` API，但未安装完整的 ICU 数据集。

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Added in: v9.0.0**

**Removed in: v10.0.0**

当给定的值超出接受范围时使用。

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Added in: v10.0.0**

**Removed in: v18.1.0, v16.17.0**

链接器函数返回一个链接失败的模块。

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

模块必须在实例化之前成功链接。

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Added in: v11.0.0**

**Removed in: v16.9.0**

用于 Worker 主脚本的路径名具有未知的文件扩展名。

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Added in: v9.0.0**

**Removed in: v10.0.0**

当尝试在使用 `zlib` 对象之后使用它时，该对象已被关闭。


## OpenSSL 错误代码 {#openssl-error-codes}

### 时间有效性错误 {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

证书尚未生效：notBefore 日期晚于当前时间。

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

证书已过期：notAfter 日期早于当前时间。

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

证书吊销列表（CRL）具有将来的发布日期。

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

证书吊销列表（CRL）已过期。

#### `CERT_REVOKED` {#cert_revoked}

证书已被吊销；它位于证书吊销列表（CRL）上。

### 信任或链相关错误 {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

无法找到已查找证书的颁发者证书。 这通常意味着受信任证书的列表不完整。

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

证书的颁发者未知。 如果颁发者未包含在受信任证书列表中，则会发生这种情况。

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

传递的证书是自签名的，并且在受信任证书的列表中找不到相同的证书。

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

证书的颁发者未知。 如果颁发者未包含在受信任证书列表中，则会发生这种情况。

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

证书链的长度大于最大深度。

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

找不到证书引用的 CRL。

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

无法验证任何签名，因为链中仅包含一个证书且该证书不是自签名的。

#### `CERT_UNTRUSTED` {#cert_untrusted}

根证书颁发机构（CA）未被标记为可信以用于指定目的。

### 基本扩展错误 {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

CA 证书无效。 它不是 CA，或者其扩展与提供的目的不一致。

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

已超过 basicConstraints pathlength 参数。

### 名称相关错误 {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

证书与提供的名称不匹配。

### 用途和策略错误 {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

提供的证书不能用于指定的目的。

#### `CERT_REJECTED` {#cert_rejected}

根 CA 被标记为拒绝指定的目的。

### 格式错误 {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

证书的签名无效。

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

证书吊销列表 (CRL) 的签名无效。

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

证书 notBefore 字段包含无效的时间。

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

证书 notAfter 字段包含无效的时间。

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

CRL lastUpdate 字段包含无效的时间。

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

CRL nextUpdate 字段包含无效的时间。

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

无法解密证书签名。 这意味着无法确定实际签名值，而不是它与预期值不匹配，这仅对 RSA 密钥有意义。

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

无法解密证书吊销列表 (CRL) 签名：这意味着无法确定实际签名值，而不是它与预期值不匹配。

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

无法读取证书 SubjectPublicKeyInfo 中的公钥。

### 其他 OpenSSL 错误 {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

尝试分配内存时发生错误。 这不应该发生。

