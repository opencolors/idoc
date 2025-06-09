---
title: Node.js 文档 - 实用工具
description: Node.js 'util' 模块的文档，提供用于 Node.js 应用程序的实用功能，包括调试、对象检查等。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 实用工具 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 'util' 模块的文档，提供用于 Node.js 应用程序的实用功能，包括调试、对象检查等。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 实用工具 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 'util' 模块的文档，提供用于 Node.js 应用程序的实用功能，包括调试、对象检查等。
---


# Util {#util}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

`node:util` 模块支持 Node.js 内部 API 的需求。 许多实用工具也对应用程序和模块开发人员有用。 要访问它：

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**新增于: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个 `async` 函数
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调风格的函数

接受一个 `async` 函数（或返回 `Promise` 的函数）并返回一个遵循错误优先回调风格的函数，即以 `(err, value) => ...` 回调作为最后一个参数。 在回调中，第一个参数将是拒绝原因（如果 `Promise` 已解决，则为 `null`），第二个参数将是已解决的值。

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
会打印：

```text [TEXT]
hello world
```
回调是异步执行的，并且将具有有限的堆栈跟踪。 如果回调抛出，进程将发出一个 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件，如果未处理，则将退出。

由于 `null` 作为回调的第一个参数具有特殊含义，如果包装的函数以假值作为原因拒绝 `Promise`，则该值将包装在 `Error` 中，原始值存储在名为 `reason` 的字段中。

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // 当 Promise 被 `null` 拒绝时，它会被一个 Error 包装，并且
  // 原始值存储在 `reason` 中。
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Added in: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个字符串，标识正在为其创建 `debuglog` 函数的应用程序部分。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，在首次调用日志记录函数时被调用，并传入一个经过优化的日志记录函数作为函数参数。
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 日志记录函数

`util.debuglog()` 方法用于创建一个函数，该函数根据 `NODE_DEBUG` 环境变量的存在有条件地将调试消息写入 `stderr`。如果 `section` 名称出现在该环境变量的值中，则返回的函数操作类似于 [`console.error()`](/zh/nodejs/api/console#consoleerrordata-args)。 否则，返回的函数不执行任何操作。

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('来自 foo 的问候 [%d]', 123);
```
如果此程序在环境中以 `NODE_DEBUG=foo` 运行，则它将输出如下内容：

```bash [BASH]
FOO 3245: 来自 foo 的问候 [123]
```
其中 `3245` 是进程 id。 如果没有设置该环境变量运行它，则不会打印任何内容。

`section` 也支持通配符：

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('嗨，这里是 foo-bar [%d]', 2333);
```
如果在环境中以 `NODE_DEBUG=foo*` 运行它，它将输出如下内容：

```bash [BASH]
FOO-BAR 3257: 嗨，这里是 foo-bar [2333]
```
可以在 `NODE_DEBUG` 环境变量中指定多个逗号分隔的 `section` 名称：`NODE_DEBUG=fs,net,tls`。

可选的 `callback` 参数可用于将日志记录函数替换为另一个没有初始化或不必要包装的函数。

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // 替换为优化掉
  // 测试 section 是否启用的日志记录函数
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**新增于: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`util.debuglog().enabled` getter 用于创建一个测试，该测试可以基于 `NODE_DEBUG` 环境变量的存在情况在条件语句中使用。 如果 `section` 名称出现在该环境变量的值中，则返回的值将为 `true`。 如果不是，则返回的值将为 `false`。

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
如果此程序在环境中以 `NODE_DEBUG=foo` 运行，则它将输出如下内容：

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**新增于: v14.9.0**

`util.debuglog` 的别名。 允许在使用 `util.debuglog().enabled` 时提高可读性，不暗示日志记录。

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 对于每个代码，弃用警告只发出一次。 |
| v0.8.0 | 新增于: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 即将被弃用的函数。
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当调用弃用的函数时显示的警告消息。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 弃用代码。 有关代码列表，请参见[已弃用的 API 列表](/zh/nodejs/api/deprecations#list-of-deprecated-apis)。
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 包装后的弃用函数，用于发出警告。

`util.deprecate()` 方法包装 `fn`（可以是函数或类），使其被标记为已弃用。

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // 在这里做一些事情。
}, 'obsoleteFunction() 已弃用。 请使用 newShinyFunction() 代替。');
```
当调用时，`util.deprecate()` 将返回一个函数，该函数将使用 [`'warning'`](/zh/nodejs/api/process#event-warning) 事件发出 `DeprecationWarning`。 警告将被发出并在第一次调用返回的函数时打印到 `stderr`。 在发出警告后，将调用包装后的函数而不发出警告。

如果在多次调用 `util.deprecate()` 时提供了相同的可选 `code`，则对于该 `code`，警告只会发出一次。

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // 发出带有代码 DEP0001 的弃用警告
fn2(); // 不发出弃用警告，因为它具有相同的代码
```
如果使用了 `--no-deprecation` 或 `--no-warnings` 命令行标志，或者如果 `process.noDeprecation` 属性在第一次弃用警告 *之前* 设置为 `true`，则 `util.deprecate()` 方法不执行任何操作。

如果设置了 `--trace-deprecation` 或 `--trace-warnings` 命令行标志，或者 `process.traceDeprecation` 属性设置为 `true`，则在第一次调用已弃用的函数时，会将警告和堆栈跟踪打印到 `stderr`。

如果设置了 `--throw-deprecation` 命令行标志，或者 `process.throwDeprecation` 属性设置为 `true`，则在调用已弃用的函数时将抛出异常。

`--throw-deprecation` 命令行标志和 `process.throwDeprecation` 属性优先于 `--trace-deprecation` 和 `process.traceDeprecation`。


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.11.0 | 现在会忽略 `%c` 说明符。 |
| v12.0.0 | `format` 参数现在只有在实际包含格式说明符时才被视为格式。 |
| v12.0.0 | 如果 `format` 参数不是格式字符串，则输出字符串的格式不再依赖于第一个参数的类型。 此更改删除了先前存在的字符串引号，这些引号在第一个参数不是字符串时输出。 |
| v11.4.0 | `%d`、`%f` 和 `%i` 说明符现在正确支持 `Symbol`。 |
| v11.4.0 | `%o` 说明符的 `depth` 再次具有默认深度 4。 |
| v11.0.0 | `%o` 说明符的 `depth` 选项现在将回退到默认深度。 |
| v10.12.0 | `%d` 和 `%i` 说明符现在支持 `BigInt`。 |
| v8.4.0 | 现在支持 `%o` 和 `%O` 说明符。 |
| v0.5.3 | 添加于: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个类似 `printf` 的格式字符串。

`util.format()` 方法返回一个格式化的字符串，使用第一个参数作为类似 `printf` 的格式字符串，该字符串可以包含零个或多个格式说明符。 每个说明符都会被替换为来自相应参数的转换值。 支持的说明符有：

- `%s`: `String` 将用于转换除 `BigInt`、`Object` 和 `-0` 之外的所有值。 `BigInt` 值将用 `n` 表示，并且没有用户定义的 `toString` 函数的 `Object` 将使用带有选项 `{ depth: 0, colors: false, compact: 3 }` 的 `util.inspect()` 进行检查。
- `%d`: `Number` 将用于转换除 `BigInt` 和 `Symbol` 之外的所有值。
- `%i`: `parseInt(value, 10)` 用于除 `BigInt` 和 `Symbol` 之外的所有值。
- `%f`: `parseFloat(value)` 用于除 `Symbol` 之外的所有值。
- `%j`: JSON。 如果参数包含循环引用，则替换为字符串 `'[Circular]'`。
- `%o`: `Object`。 具有通用 JavaScript 对象格式的对象字符串表示形式。 类似于带有选项 `{ showHidden: true, showProxy: true }` 的 `util.inspect()`。 这将显示完整的对象，包括不可枚举的属性和代理。
- `%O`: `Object`。 具有通用 JavaScript 对象格式的对象字符串表示形式。 类似于没有选项的 `util.inspect()`。 这将显示完整的对象，不包括不可枚举的属性和代理。
- `%c`: `CSS`。 此说明符将被忽略，并将跳过传入的任何 CSS。
- `%%`: 单个百分号 (`'%'`)。 这不会消耗参数。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 格式化的字符串

如果说明符没有相应的参数，则不会替换它：

```js [ESM]
util.format('%s:%s', 'foo');
// 返回: 'foo:%s'
```
如果值的类型不是 `string`，则格式字符串中不包含的值将使用 `util.inspect()` 进行格式化。

如果传递给 `util.format()` 方法的参数多于说明符的数量，则多余的参数会连接到返回的字符串，并用空格分隔：

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// 返回: 'foo:bar baz'
```
如果第一个参数不包含有效的格式说明符，则 `util.format()` 返回一个字符串，该字符串是由所有参数连接在一起并以空格分隔而成的：

```js [ESM]
util.format(1, 2, 3);
// 返回: '1 2 3'
```
如果只将一个参数传递给 `util.format()`，则它会按原样返回，而无需任何格式化：

```js [ESM]
util.format('%% %s');
// 返回: '%% %s'
```
`util.format()` 是一个同步方法，旨在用作调试工具。 一些输入值可能具有显着的性能开销，从而可能阻塞事件循环。 请谨慎使用此函数，切勿在热代码路径中使用。


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**自 v10.0.0 起加入**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此函数与 [`util.format()`](/zh/nodejs/api/util#utilformatformat-args) 相同，不同之处在于它接受一个 `inspectOptions` 参数，该参数指定传递给 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 的选项。

```js [ESM]
util.formatWithOptions({ colors: true }, '参见对象 %O', { foo: 42 });
// 返回 '参见对象 { foo: 42 }'，其中 `42` 在打印到终端时被着色为数字。
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [稳定度：1 - 实验性]
[稳定度：1](/zh/nodejs/api/documentation#stability-index) [稳定度：1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发中
:::


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.3.0 | API 从 `util.getCallSite` 重命名为 `util.getCallSites()`。 |
| v22.9.0 | 自 v22.9.0 起加入 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选，指定要捕获为调用点对象的帧数。 **默认值:** `10`。允许的范围介于 1 和 200 之间。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可选
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 从 source-map 重建堆栈跟踪中的原始位置。默认情况下，使用 `--enable-source-maps` 标志启用。
  
 
- 返回: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 调用点对象数组
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回与此调用点关联的函数的名称。
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回包含此调用点的函数脚本的资源名称。
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 返回关联函数调用的行号，从 1 开始。
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 返回关联函数调用的行上基于 1 的列偏移量。
  
 

返回一个调用点对象数组，其中包含调用方函数的堆栈。

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('调用点:');
  callSites.forEach((callSite, index) => {
    console.log(`调用点 ${index + 1}:`);
    console.log(`函数名称: ${callSite.functionName}`);
    console.log(`脚本名称: ${callSite.scriptName}`);
    console.log(`行号: ${callSite.lineNumber}`);
    console.log(`列号: ${callSite.column}`);
  });
  // 调用点 1:
  // 函数名称: exampleFunction
  // 脚本名称: /home/example.js
  // 行号: 5
  // 列号: 26

  // 调用点 2:
  // 函数名称: anotherFunction
  // 脚本名称: /home/example.js
  // 行号: 22
  // 列号: 3

  // ...
}

// 用于模拟另一个堆栈层级的函数
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
可以通过将 `sourceMap` 选项设置为 `true` 来重建原始位置。如果 source map 不可用，原始位置将与当前位置相同。 启用 `--enable-source-maps` 标志后，例如使用 `--experimental-transform-types` 时，默认情况下 `sourceMap` 将为 true。

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// 使用 sourceMap:
// 函数名称: ''
// 脚本名称: example.js
// 行号: 7
// 列号: 26

// 不使用 sourceMap:
// 函数名称: ''
// 脚本名称: example.js
// 行号: 2
// 列号: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**加入于: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回来自 Node.js API 的数字错误代码的字符串名称。 错误代码和错误名称之间的映射与平台相关。 有关常见错误的名称，请参见 [常见系统错误](/zh/nodejs/api/errors#common-system-errors)。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**加入于: v16.0.0, v14.17.0**

- 返回值: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

返回来自 Node.js API 的所有可用系统错误代码的 Map。 错误代码和错误名称之间的映射与平台相关。 有关常见错误的名称，请参见 [常见系统错误](/zh/nodejs/api/errors#common-system-errors)。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**加入于: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回来自 Node.js API 的数字错误代码的字符串消息。 错误代码和字符串消息之间的映射与平台相关。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v5.0.0 | `constructor` 参数现在可以引用 ES6 类。 |
| v0.3.0 | 加入于: v0.3.0 |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - Legacy: 请改用 ES2015 类语法和 `extends` 关键字。
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

不鼓励使用 `util.inherits()`。 请使用 ES6 `class` 和 `extends` 关键字来获得语言级别的继承支持。 另请注意，这两种样式在 [语义上不兼容](https://github.com/nodejs/node/issues/4179)。

将原型方法从一个 [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) 继承到另一个。 `constructor` 的原型将被设置为从 `superConstructor` 创建的新对象。

这主要是在 `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)` 之上添加一些输入验证。 作为一个额外的便利，可以通过 `constructor.super_` 属性访问 `superConstructor`。

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
使用 `class` 和 `extends` 的 ES6 示例：

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.18.0 | 添加了在检查 `Set` 和 `Map` 时对 `maxArrayLength` 的支持。 |
| v17.3.0, v16.14.0 | 现在支持 `numericSeparator` 选项。 |
| v13.0.0 | 循环引用现在包含对该引用的标记。 |
| v14.6.0, v12.19.0 | 如果 `object` 来自不同的 `vm.Context`，那么它上面的自定义检查函数将不再接收上下文特定的参数。 |
| v13.13.0, v12.17.0 | 现在支持 `maxStringLength` 选项。 |
| v13.5.0, v12.16.0 | 如果 `showHidden` 为 `true`，则检查用户定义的原型属性。 |
| v12.0.0 | `compact` 选项的默认值已更改为 `3`，`breakLength` 选项的默认值已更改为 `80`。 |
| v12.0.0 | 内部属性不再出现在自定义检查函数的上下文参数中。 |
| v11.11.0 | `compact` 选项接受数字作为新的输出模式。 |
| v11.7.0 | ArrayBuffers 现在也显示它们的二进制内容。 |
| v11.5.0 | 现在支持 `getters` 选项。 |
| v11.4.0 | `depth` 默认值已改回 `2`。 |
| v11.0.0 | `depth` 默认值已更改为 `20`。 |
| v11.0.0 | 检查输出现在限制在约 128 MiB。 超过该大小的数据将不会被完全检查。 |
| v10.12.0 | 现在支持 `sorted` 选项。 |
| v10.6.0 | 现在可以检查链表和类似对象，直到最大调用堆栈大小。 |
| v10.0.0 | 现在也可以检查 `WeakMap` 和 `WeakSet` 条目。 |
| v9.9.0 | 现在支持 `compact` 选项。 |
| v6.6.0 | 自定义检查函数现在可以返回 `this`。 |
| v6.3.0 | 现在支持 `breakLength` 选项。 |
| v6.1.0 | 现在支持 `maxArrayLength` 选项；特别是，默认情况下会截断长数组。 |
| v6.1.0 | 现在支持 `showProxy` 选项。 |
| v0.3.0 | 添加于：v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何 JavaScript 原始值或 `Object`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `object` 的不可枚举符号和属性将包含在格式化结果中。 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 和 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 条目以及用户定义的原型属性（不包括方法属性）也会被包含。 **默认值:** `false`。
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定在格式化 `object` 时递归的次数。 这对于检查大型对象很有用。 要递归到最大调用堆栈大小，请传递 `Infinity` 或 `null`。 **默认值:** `2`。
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则输出使用 ANSI 颜色代码进行样式设置。 颜色是可自定义的。 参见 [自定义 `util.inspect` 颜色](/zh/nodejs/api/util#customizing-utilinspect-colors)。 **默认值:** `false`。
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `false`，则不调用 `[util.inspect.custom](depth, opts, inspect)` 函数。 **默认值:** `true`。
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `Proxy` 检查包括 [`target` 和 `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology) 对象。 **默认值:** `false`。
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定格式化时要包含的 `Array`、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)、[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)、[`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 和 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 元素的最大数量。 设置为 `null` 或 `Infinity` 以显示所有元素。 设置为 `0` 或负数以不显示任何元素。 **默认值:** `100`。
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定格式化时要包含的最大字符数。 设置为 `null` 或 `Infinity` 以显示所有元素。 设置为 `0` 或负数以不显示任何字符。 **默认值:** `10000`。
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 输入值在多行上拆分的长度。 设置为 `Infinity` 以将输入格式化为单行（与设置为 `true` 或任何数字 >= `1` 的 `compact` 结合使用）。 **默认值:** `80`。
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 将此设置为 `false` 会导致每个对象键都显示在新行上。 它将在长度超过 `breakLength` 的文本中换行。 如果设置为数字，则只要所有属性都适合 `breakLength`，就会将最里面的 `n` 个元素合并到一行中。 短数组元素也会组合在一起。 有关更多信息，请参见下面的示例。 **默认值:** `3`。
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 如果设置为 `true` 或函数，则对象的所有属性以及 `Set` 和 `Map` 条目都将在结果字符串中排序。 如果设置为 `true`，则使用[默认排序](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)。 如果设置为函数，则它用作[比较函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters)。
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果设置为 `true`，则会检查 getter。 如果设置为 `'get'`，则仅检查没有相应 setter 的 getter。 如果设置为 `'set'`，则仅检查具有相应 setter 的 getter。 这可能会根据 getter 函数引起副作用。 **默认值:** `false`。
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在所有 bigint 和数字中，每三位数字之间使用下划线分隔。 **默认值:** `false`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `object` 的表示形式。

`util.inspect()` 方法返回 `object` 的字符串表示形式，旨在用于调试。 `util.inspect` 的输出可能随时更改，不应以编程方式依赖它。 可以传递其他 `options` 来更改结果。 `util.inspect()` 将使用构造函数的名称和/或 `@@toStringTag` 来为检查的值创建一个可识别的标签。

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
循环引用通过使用引用索引指向它们的锚点：

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
以下示例检查 `util` 对象的所有属性：

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
以下示例突出显示了 `compact` 选项的效果：

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```
`showHidden` 选项允许检查 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 和 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 条目。 如果条目数超过 `maxArrayLength`，则无法保证显示哪些条目。 这意味着两次检索相同的 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 条目可能会导致不同的输出。 此外，没有任何剩余强引用的条目可能随时被垃圾回收。

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
`sorted` 选项确保对象的属性插入顺序不会影响 `util.inspect()` 的结果。

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
`numericSeparator` 选项将下划线添加到所有数字的每三位数字中。

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` 是一种用于调试的同步方法。 其最大输出长度约为 128 MiB。 导致更长输出的输入将被截断。


### 自定义 `util.inspect` 颜色 {#customizing-utilinspect-colors}

`util.inspect` 的颜色输出（如果已启用）可以通过 `util.inspect.styles` 和 `util.inspect.colors` 属性进行全局自定义。

`util.inspect.styles` 是一个将样式名称与 `util.inspect.colors` 中的颜色关联起来的映射。

默认的样式和关联的颜色是：

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: （无样式）
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (例如，`Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

颜色样式使用 ANSI 控制码，可能并非所有终端都支持。 要验证颜色支持，请使用 [`tty.hasColors()`](/zh/nodejs/api/tty#writestreamhascolorscount-env)。

预定义的控制码如下所示（分组为“修饰符”、“前景色”和“背景色”）。

#### 修饰符 {#modifiers}

修饰符的支持情况因不同的终端而异。 如果不支持，它们通常会被忽略。

- `reset` - 将所有（颜色）修饰符重置为默认值
- **bold** - 使文本加粗
- *italic* - 使文本倾斜
- underline - 使文本带有下划线
- ~~strikethrough~~ - 在文本中心画一条水平线（别名：`strikeThrough`、`crossedout`、`crossedOut`）
- `hidden` - 打印文本，但使其不可见（别名：conceal）
- dim - 降低颜色强度（别名：`faint`）
- overlined - 使文本带有上划线
- blink - 间隔地隐藏和显示文本
- inverse - 交换前景色和背景色（别名：`swapcolors`、`swapColors`）
- doubleunderline - 使文本带有双下划线（别名：`doubleUnderline`）
- framed - 在文本周围绘制一个框架

#### 前景色 {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (别名: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### 背景色 {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (别名: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### 对象的自定义检查函数 {#custom-inspection-functions-on-objects}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.3.0, v16.14.0 | 添加了 inspect 参数以提高互操作性。 |
| v0.1.97 | 添加于: v0.1.97 |
:::

对象还可以定义自己的 [`[util.inspect.custom](depth, opts, inspect)`](/zh/nodejs/api/util#utilinspectcustom) 函数，`util.inspect()` 在检查对象时将调用该函数并使用其结果。

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // 五个空格的填充，因为 "Box< " 的大小就是五个空格。
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// 返回: "Box< true >"
```
自定义 `[util.inspect.custom](depth, opts, inspect)` 函数通常返回一个字符串，但可以返回任何类型的值，`util.inspect()` 将相应地格式化该值。

```js [ESM]
const util = require('node:util');

const obj = { foo: '这不会出现在 inspect() 的输出中' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// 返回: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.12.0 | 现在定义为共享符号。 |
| v6.6.0 | 添加于: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 可用于声明自定义检查函数。

除了可以通过 `util.inspect.custom` 访问之外，此符号还[全局注册](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)，并且可以在任何环境中作为 `Symbol.for('nodejs.util.inspect.custom')` 访问。

使用此方法允许以可移植的方式编写代码，以便在 Node.js 环境中使用自定义检查函数，而在浏览器中忽略该函数。 `util.inspect()` 函数本身作为第三个参数传递给自定义检查函数，以允许进一步的可移植性。

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// 打印 Password <xxxxxxxx>
```
有关更多详细信息，请参见[对象的自定义检查函数](/zh/nodejs/api/util#custom-inspection-functions-on-objects)。


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**新增于: v6.4.0**

`defaultOptions` 值允许自定义 `util.inspect` 使用的默认选项。 这对于像 `console.log` 或 `util.format` 这样隐式调用 `util.inspect` 的函数很有用。 它应该设置为一个包含一个或多个有效的 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 选项的对象。 也支持直接设置选项属性。

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // 记录截断的数组
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // 记录完整的数组
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**新增于: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `val1` 和 `val2` 之间存在深度严格相等，则返回 `true`。 否则，返回 `false`。

有关深度严格相等的更多信息，请参见 [`assert.deepStrictEqual()`](/zh/nodejs/api/assert#assertdeepstrictequalactual-expected-message)。

## 类: `util.MIMEType` {#class-utilmimetype}

**新增于: v19.1.0, v18.13.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

[MIMEType 类](https://bmeck.github.io/node-proposal-mime-api/) 的实现。

按照浏览器惯例，`MIMEType` 对象的所有属性都作为类原型上的 getter 和 setter 实现，而不是作为对象本身的数据属性实现。

MIME 字符串是一个包含多个有意义的组件的结构化字符串。 解析后，将返回一个 `MIMEType` 对象，其中包含每个这些组件的属性。

### 构造函数: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的输入 MIME

通过解析 `input` 创建一个新的 `MIMEType` 对象。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

如果 `input` 不是有效的 MIME，则会抛出 `TypeError`。 请注意，将尽力将给定值强制转换为字符串。 例如：

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取并设置 MIME 的类型部分。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取并设置 MIME 的子类型部分。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取 MIME 的本质。此属性是只读的。使用 `mime.type` 或 `mime.subtype` 来更改 MIME。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/zh/nodejs/api/util#class-utilmimeparams)

获取代表 MIME 参数的 [`MIMEParams`](/zh/nodejs/api/util#class-utilmimeparams) 对象。此属性是只读的。有关详细信息，请参阅 [`MIMEParams`](/zh/nodejs/api/util#class-utilmimeparams) 文档。

### `mime.toString()` {#mimetostring}

- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`MIMEType` 对象的 `toString()` 方法返回序列化的 MIME。

由于需要符合标准，因此此方法不允许用户自定义 MIME 的序列化过程。

### `mime.toJSON()` {#mimetojson}

- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`mime.toString()`](/zh/nodejs/api/util#mimetostring) 的别名。

当使用 [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化 `MIMEType` 对象时，会自动调用此方法。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## 类: `util.MIMEParams` {#class-utilmimeparams}

**新增于: v19.1.0, v18.13.0**

`MIMEParams` API 提供对 `MIMEType` 参数的读写访问。

### 构造函数: `new MIMEParams()` {#constructor-new-mimeparams}

通过空参数创建一个新的 `MIMEParams` 对象

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

删除所有名称为 `name` 的名称-值对。


### `mimeParams.entries()` {#mimeparamsentries}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回一个迭代器，用于迭代参数中的每个名称-值对。迭代器的每个项都是一个 JavaScript `Array`。数组的第一个项是 `name`，数组的第二个项是 `value`。

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 一个字符串，如果不存在具有给定 `name` 的名称-值对，则返回 `null`。

返回名称为 `name` 的第一个名称-值对的值。如果不存在这样的键值对，则返回 `null`。

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果存在至少一个名称为 `name` 的名称-值对，则返回 `true`。

### `mimeParams.keys()` {#mimeparamskeys}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回一个迭代器，用于迭代每个名称-值对的名称。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将与 `name` 关联的 `MIMEParams` 对象中的值设置为 `value`。 如果存在任何名称为 `name` 的预先存在的名称-值对，则将第一个此类对的值设置为 `value`。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

返回一个迭代器，该迭代器遍历每个名称-值对的值。

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

[`mimeParams.entries()`](/zh/nodejs/api/util#mimeparamsentries) 的别名。



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | 添加了对允许输入 `config` 中的负选项的支持。 |
| v20.0.0 | 该 API 不再是实验性的。 |
| v18.11.0, v16.19.0 | 添加了对输入 `config` 中默认值的支持。 |
| v18.7.0, v16.17.0 | 添加了对使用输入 `config` 和返回的属性中的 `tokens` 返回详细的解析信息的支持。 |
| v18.3.0, v16.17.0 | 添加于: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于为解析提供参数并配置解析器。 `config` 支持以下属性：
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参数字符串数组。 **默认值:** 删除了 `execPath` 和 `filename` 的 `process.argv`。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于描述解析器已知的参数。 `options` 的键是选项的长名称，值是 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，接受以下属性：
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参数的类型，必须是 `boolean` 或 `string`。
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否可以多次提供此选项。 如果为 `true`，则所有值都将收集在一个数组中。 如果为 `false`，则选项的值为后胜出。 **默认值:** `false`。
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 选项的单个字符别名。
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当未通过 args 设置时，默认选项值。 它必须与 `type` 属性的类型相同。 当 `multiple` 为 `true` 时，它必须是一个数组。
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当遇到未知参数，或者传递的参数与 `options` 中配置的 `type` 不匹配时，是否应抛出错误。 **默认值:** `true`。
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 此命令是否接受位置参数。 **默认值:** 如果 `strict` 为 `true`，则为 `false`，否则为 `true`。
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则允许通过在选项名称前加上 `--no-` 来显式地将布尔选项设置为 `false`。 **默认值:** `false`。
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返回已解析的令牌。 这对于扩展内置行为很有用，从添加额外的检查到以不同的方式重新处理令牌。 **默认值:** `false`。
  
 
-  返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 已解析的命令行参数：
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 已解析的选项名称与其 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 或 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 值的映射。
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 位置参数。
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 参见 [parseArgs tokens](/zh/nodejs/api/util#parseargs-tokens) 部分。 仅当 `config` 包含 `tokens: true` 时返回。
  
 

提供比直接与 `process.argv` 交互更高级别的命令行参数解析 API。 接受预期参数的规范，并返回带有已解析选项和位置参数的结构化对象。



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

通过在配置中指定 `tokens: true`，可以获得详细的解析信息，从而添加自定义行为。返回的 tokens 具有描述以下内容的属性：

- 所有 tokens
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 值为 'option'、'positional' 或 'option-terminator' 之一。
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 包含 token 的元素在 `args` 中的索引。因此，token 的源参数是 `args[token.index]`。
  
 
- option tokens
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 选项的长名称。
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 选项在 args 中如何使用，例如 `-f` 或 `--foo`。
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 在 args 中指定的选项值。对于布尔选项，值为 Undefined。
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 选项值是否以内联方式指定，例如 `--foo=bar`。
  
 
- positional tokens
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) args 中位置参数的值（即 `args[index]`）。
  
 
- option-terminator token

返回的 tokens 的顺序与输入 args 中遇到的顺序相同。在 args 中出现多次的选项会为每次使用生成一个 token。短选项组（如 `-xy`）会展开为每个选项的 token。因此，`-xxx` 会生成三个 token。

例如，要添加对否定选项（如 `--no-color`）的支持（当选项的类型为 `boolean` 时，`allowNegative` 支持此操作），可以重新处理返回的 tokens 以更改为否定选项存储的值。

::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

示例用法，展示了否定选项，以及当一个选项以多种方式使用时，最后一个胜出。

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

**新增于: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`.env` 文件的原始内容。

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

给定一个 `.env` 文件示例：

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// 返回: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// 返回: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0 | 在返回 `Promise` 的函数上调用 `promisify` 已弃用。 |
| v8.0.0 | 新增于: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

接受一个遵循常见错误优先回调风格的函数，即接受一个 `(err, value) => ...` 回调作为最后一个参数，并返回一个返回 promise 的版本。

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // 使用 `stats` 做一些事情
}).catch((error) => {
  // 处理错误。
});
```
或者，等效地使用 `async function`：

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`此目录归 ${stats.uid} 所有`);
}

callStat();
```

如果存在 `original[util.promisify.custom]` 属性，则 `promisify` 将返回其值，请参见[自定义 promise 化函数](/zh/nodejs/api/util#custom-promisified-functions)。

`promisify()` 假定 `original` 是一个以回调作为其最后一个参数的函数。 如果 `original` 不是一个函数，`promisify()` 将抛出一个错误。 如果 `original` 是一个函数，但它的最后一个参数不是一个错误优先的回调，它仍然会被传递一个错误优先的回调作为它的最后一个参数。

在类方法或其他使用 `this` 的方法上使用 `promisify()` 可能无法按预期工作，除非经过特殊处理：

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: 无法读取 undefined 的属性 'a'
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### 自定义 Promise 化函数 {#custom-promisified-functions}

使用 `util.promisify.custom` 符号可以覆盖 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 的返回值:

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```
对于原始函数不遵循以 error-first 回调作为最后一个参数的标准格式的情况，这非常有用。

例如，对于一个接受 `(foo, onSuccessCallback, onErrorCallback)` 的函数：

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
如果定义了 `promisify.custom` 但不是一个函数，则 `promisify()` 将抛出一个错误。

### `util.promisify.custom` {#utilpromisifycustom}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.16.2 | 这现在被定义为一个共享符号。 |
| v8.0.0 | 添加于: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) ，可用于声明函数的自定义 Promise 化变体，请参见[自定义 Promise 化函数](/zh/nodejs/api/util#custom-promisified-functions)。

除了可以通过 `util.promisify.custom` 访问之外，此符号已[全局注册](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)，并且可以在任何环境中作为 `Symbol.for('nodejs.util.promisify.custom')` 访问。

例如，对于一个接受 `(foo, onSuccessCallback, onErrorCallback)` 的函数：

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**添加于: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回移除了所有 ANSI 转义码的 `str`。

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// 打印 "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | styleText 现在是稳定的。 |
| v22.8.0, v20.18.0 | 尊重 isTTY 和环境变量，例如 NO_COLORS、NODE_DISABLE_COLORS 和 FORCE_COLOR。 |
| v21.7.0, v20.12.0 | 添加于: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个文本格式或在 `util.inspect.colors` 中定义的文本格式的数组。
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要格式化的文本。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为真，则检查 `stream` 以查看它是否可以处理颜色。 **默认:** `true`。
    - `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) 将被验证是否可以着色的流。 **默认:** `process.stdout`。
  
 

此函数返回格式化的文本，其中考虑了为在终端中打印而传递的 `format`。 它知道终端的功能，并根据通过 `NO_COLORS`、`NODE_DISABLE_COLORS` 和 `FORCE_COLOR` 环境变量设置的配置进行操作。



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // 验证 process.stderr 是否具有 TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // 验证 process.stderr 是否具有 TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` 还提供文本格式，例如 `italic` 和 `underline`，你可以将两者结合起来：

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
当传递格式数组时，应用的格式顺序是从左到右，因此以下样式可能会覆盖前一个样式。

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
完整的格式列表可以在 [modifiers](/zh/nodejs/api/util#modifiers) 中找到。


## 类: `util.TextDecoder` {#class-utiltextdecoder}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 该类现在可以在全局对象上使用。 |
| v8.3.0 | 添加于: v8.3.0 |
:::

[WHATWG 编码标准](https://encoding.spec.whatwg.org/) `TextDecoder` API 的实现。

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### WHATWG 支持的编码 {#whatwg-supported-encodings}

根据 [WHATWG 编码标准](https://encoding.spec.whatwg.org/)，`TextDecoder` API 支持的编码在下表中列出。 对于每种编码，可以使用一个或多个别名。

不同的 Node.js 构建配置支持不同的编码集。（参见 [国际化](/zh/nodejs/api/intl)）

#### 默认支持的编码（具有完整的 ICU 数据） {#encodings-supported-by-default-with-full-icu-data}

| 编码 | 别名 |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |

#### 当 Node.js 使用 `small-icu` 选项构建时支持的编码 {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| 编码 | 别名 |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### 当 ICU 被禁用时支持的编码 {#encodings-supported-when-icu-is-disabled}

| 编码 | 别名 |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
[WHATWG 编码标准](https://encoding.spec.whatwg.org/)中列出的 `'iso-8859-16'` 编码不受支持。

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 标识此 `TextDecoder` 实例支持的 `encoding`。 **默认值:** `'utf-8'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果解码失败是致命的，则为 `true`。 当 ICU 被禁用时，不支持此选项（参见 [国际化](/zh/nodejs/api/intl)）。 **默认值:** `false`。
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，`TextDecoder` 将在解码结果中包含字节顺序标记。 当 `false` 时，字节顺序标记将从输出中删除。 此选项仅在 `encoding` 为 `'utf-8'`、`'utf-16be'` 或 `'utf-16le'` 时使用。 **默认值:** `false`。
  
 

创建一个新的 `TextDecoder` 实例。 `encoding` 可以指定受支持的编码或别名之一。

`TextDecoder` 类也可在全局对象上使用。

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 包含编码数据的 `ArrayBuffer`、`DataView` 或 `TypedArray` 实例。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果期望有额外的数据块，则为 `true`。 **默认值:** `false`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

解码 `input` 并返回一个字符串。 如果 `options.stream` 为 `true`，则在 `input` 末尾发生的任何不完整的字节序列都会在内部缓冲，并在下次调用 `textDecoder.decode()` 后发出。

如果 `textDecoder.fatal` 为 `true`，则发生的解码错误将导致抛出 `TypeError`。


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoder` 实例支持的编码。

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果解码错误导致抛出 `TypeError`，则该值为 `true`。

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果解码结果将包含字节顺序标记，则该值为 `true`。

## 类: `util.TextEncoder` {#class-utiltextencoder}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 此类现在可在全局对象上使用。 |
| v8.3.0 | 添加于: v8.3.0 |
:::

[WHATWG 编码标准](https://encoding.spec.whatwg.org/) `TextEncoder` API 的实现。 `TextEncoder` 的所有实例仅支持 UTF-8 编码。

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
`TextEncoder` 类也可在全局对象上使用。

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编码的文本。 **默认值:** 空字符串。
- 返回: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

UTF-8 编码 `input` 字符串并返回包含编码字节的 `Uint8Array`。

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**添加于: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编码的文本。
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 用于保存编码结果的数组。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) src 中读取的 Unicode 代码单元数。
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) dest 中写入的 UTF-8 字节数。
  
 

UTF-8 编码 `src` 字符串到 `dest` Uint8Array 并返回一个包含读取的 Unicode 代码单元和写入的 UTF-8 字节数的对象。

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoder` 实例支持的编码。始终设置为 `'utf-8'`。

## `util.toUSVString(string)` {#utiltousvstringstring}

**Added in: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回 `string`，其中任何代理码点（或等效地，任何不成对的代理码元）都被替换为 Unicode “替换字符” U+FFFD。

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Added in: v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

创建并返回一个 [\<AbortController\>](/zh/nodejs/api/globals#class-abortcontroller) 实例，该实例的 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 被标记为可传输的，并且可以与 `structuredClone()` 或 `postMessage()` 一起使用。

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Added in: v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)
- 返回: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)

将给定的 [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 标记为可传输的，以便它可以与 `structuredClone()` 和 `postMessage()` 一起使用。

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Added in: v19.7.0, v18.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 任何与可中止操作相关联的非空对象，并被弱引用。 如果 `resource` 在 `signal` 中止之前被垃圾回收，则 promise 将保持 pending 状态，允许 Node.js 停止跟踪它。 这有助于防止长时间运行或不可取消的操作中的内存泄漏。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

监听提供的 `signal` 上的 abort 事件，并返回一个 promise，该 promise 在 `signal` 中止时解析。 如果提供了 `resource`，它会弱引用操作的关联对象，因此如果 `resource` 在 `signal` 中止之前被垃圾回收，那么返回的 promise 将保持 pending 状态。 这可以防止长时间运行或不可取消的操作中的内存泄漏。

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// 获取具有可中止信号的对象，例如自定义资源或操作。
const dependent = obtainSomethingAbortable();

// 将 `dependent` 作为资源传递，指示仅当 `dependent` 在信号中止时仍在内存中时，promise 才应解析。
aborted(dependent.signal, dependent).then(() => {

  // 此代码在 `dependent` 中止时运行。
  console.log('依赖资源已中止。');
});

// 模拟触发中止的事件。
dependent.on('event', () => {
  dependent.abort(); // 这将导致 `aborted` promise 解析。
});
```

```js [ESM]
import { aborted } from 'node:util';

// 获取具有可中止信号的对象，例如自定义资源或操作。
const dependent = obtainSomethingAbortable();

// 将 `dependent` 作为资源传递，指示仅当 `dependent` 在信号中止时仍在内存中时，promise 才应解析。
aborted(dependent.signal, dependent).then(() => {

  // 此代码在 `dependent` 中止时运行。
  console.log('依赖资源已中止。');
});

// 模拟触发中止的事件。
dependent.on('event', () => {
  dependent.abort(); // 这将导致 `aborted` promise 解析。
});
```
:::


## `util.types` {#utiltypes}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.3.0 | 公开为 `require('util/types')`。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

`util.types` 提供了对不同类型的内置对象的类型检查。 与 `instanceof` 或 `Object.prototype.toString.call(value)` 不同，这些检查不会检查可以从 JavaScript 访问的对象的属性（例如它们的原型），并且通常具有调用 C++ 的开销。

结果通常不保证值在 JavaScript 中公开的属性或行为的种类。 它们主要对希望在 JavaScript 中进行类型检查的插件开发者有用。

该 API 可通过 `require('node:util').types` 或 `require('node:util/types')` 访问。

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**添加于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 [`SharedArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 实例，则返回 `true`。

另请参阅 [`util.types.isArrayBuffer()`](/zh/nodejs/api/util#utiltypesisarraybuffervalue) 和 [`util.types.isSharedArrayBuffer()`](/zh/nodejs/api/util#utiltypesissharedarraybuffervalue)。

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // 返回 true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // 返回 true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**添加于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 视图之一的实例，例如类型化数组对象或 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)，则返回 `true`。 等同于 [`ArrayBuffer.isView()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)。

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**加入版本: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个 `arguments` 对象，则返回 `true`。

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // 返回 true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**加入版本: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个内置的 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 实例，则返回 `true`。 这*不*包括 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 实例。 通常，需要同时测试两者； 请参阅 [`util.types.isAnyArrayBuffer()`](/zh/nodejs/api/util#utiltypesisanyarraybuffervalue)。

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // 返回 true
util.types.isArrayBuffer(new SharedArrayBuffer());  // 返回 false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**加入版本: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个 [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)，则返回 `true`。 这仅报告 JavaScript 引擎所看到的内容； 特别是，如果使用了转译工具，则返回值可能与原始源代码不匹配。

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // 返回 false
util.types.isAsyncFunction(async function foo() {});  // 返回 true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是 `BigInt64Array` 实例，则返回 `true`。

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // 返回 true
util.types.isBigInt64Array(new BigUint64Array());  // 返回 false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**新增于: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个 BigInt 对象，例如由 `Object(BigInt(123))` 创建，则返回 `true`。

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // 返回 true
util.types.isBigIntObject(BigInt(123));   // 返回 false
util.types.isBigIntObject(123);  // 返回 false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是 `BigUint64Array` 实例，则返回 `true`。

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // 返回 false
util.types.isBigUint64Array(new BigUint64Array());  // 返回 true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个布尔对象，例如由 `new Boolean()` 创建，则返回 `true`。

```js [ESM]
util.types.isBooleanObject(false);  // 返回 false
util.types.isBooleanObject(true);   // 返回 false
util.types.isBooleanObject(new Boolean(false)); // 返回 true
util.types.isBooleanObject(new Boolean(true));  // 返回 true
util.types.isBooleanObject(Boolean(false)); // 返回 false
util.types.isBooleanObject(Boolean(true));  // 返回 false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**新增于: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是任何装箱的原始对象，例如由 `new Boolean()`、`new String()` 或 `Object(Symbol())` 创建的，则返回 `true`。

例如:

```js [ESM]
util.types.isBoxedPrimitive(false); // 返回 false
util.types.isBoxedPrimitive(new Boolean(false)); // 返回 true
util.types.isBoxedPrimitive(Symbol('foo')); // 返回 false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // 返回 true
util.types.isBoxedPrimitive(Object(BigInt(5))); // 返回 true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**新增于: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `value` 是一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)，则返回 `true`，否则返回 `false`。

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 实例，则返回 `true`。

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // 返回 true
util.types.isDataView(new Float64Array());  // 返回 false
```
另请参阅 [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)。

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 实例，则返回 `true`。

```js [ESM]
util.types.isDate(new Date());  // 返回 true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是原生 `External` 值，则返回 `true`。

原生 `External` 值是一种特殊类型的对象，它包含一个原始 C++ 指针 (`void*`)，用于从原生代码访问，并且没有其他属性。 这种对象由 Node.js 内部或原生插件创建。 在 JavaScript 中，它们是具有 `null` 原型的[冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)对象。

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // 返回 true
util.types.isExternal(0); // 返回 false
util.types.isExternal(new String('foo')); // 返回 false
```
有关 `napi_create_external` 的更多信息，请参阅 [`napi_create_external()`](/zh/nodejs/api/n-api#napi_create_external)。

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) 实例，则返回 `true`。

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // 返回 false
util.types.isFloat32Array(new Float32Array());  // 返回 true
util.types.isFloat32Array(new Float64Array());  // 返回 false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个内置的 [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) 实例，则返回 `true`。

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // 返回 false
util.types.isFloat64Array(new Uint8Array());  // 返回 false
util.types.isFloat64Array(new Float64Array());  // 返回 true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个生成器函数，则返回 `true`。 这仅报告 JavaScript 引擎所看到的内容； 特别是，如果使用了转译工具，则返回值可能与原始源代码不匹配。

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // 返回 false
util.types.isGeneratorFunction(function* foo() {});  // 返回 true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是由内置生成器函数返回的生成器对象，则返回 `true`。 这仅报告 JavaScript 引擎所看到的内容； 特别是，如果使用了转译工具，则返回值可能与原始源代码不匹配。

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // 返回 true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是一个内置的 [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) 实例，则返回 `true`。

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // 返回 false
util.types.isInt8Array(new Int8Array());  // 返回 true
util.types.isInt8Array(new Float64Array());  // 返回 false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) 实例，则返回 `true`。

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // 返回 false
util.types.isInt16Array(new Int16Array());  // 返回 true
util.types.isInt16Array(new Float64Array());  // 返回 false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) 实例，则返回 `true`。

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // 返回 false
util.types.isInt32Array(new Int32Array());  // 返回 true
util.types.isInt32Array(new Float64Array());  // 返回 false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**新增于: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `value` 是一个 [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)，则返回 `true`，否则返回 `false`。

### `util.types.isMap(value)` {#utiltypesismapvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 实例，则返回 `true`。

```js [ESM]
util.types.isMap(new Map());  // 返回 true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是由内置的 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 实例返回的迭代器，则返回 `true`。

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // 返回 true
util.types.isMapIterator(map.values());  // 返回 true
util.types.isMapIterator(map.entries());  // 返回 true
util.types.isMapIterator(map[Symbol.iterator]());  // 返回 true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是 [模块命名空间对象](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) 的实例，则返回 `true`。

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // 返回 true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是由 [内置 `Error` 类型](https://tc39.es/ecma262/#sec-error-objects) 的构造函数返回的，则返回 `true`。

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
原生错误类型的子类也是原生错误：

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
一个值是原生错误类的 `instanceof` 并不等同于 `isNativeError()` 为该值返回 `true`。 `isNativeError()` 对于来自不同 [realm](https://tc39.es/ecma262/#realm) 的错误返回 `true`，而 `instanceof Error` 对于这些错误返回 `false`：

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
相反，`isNativeError()` 对于所有不是由原生错误的构造函数返回的对象返回 `false`。 这包括 `instanceof` 原生错误的值：

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是数字对象（例如通过 `new Number()` 创建）则返回 `true`。

```js [ESM]
util.types.isNumberObject(0);  // 返回 false
util.types.isNumberObject(new Number(0));   // 返回 true
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 则返回 `true`。

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // 返回 true
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是 [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 实例则返回 `true`。

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // 返回 false
util.types.isProxy(proxy);  // 返回 true
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是正则表达式对象则返回 `true`。

```js [ESM]
util.types.isRegExp(/abc/);  // 返回 true
util.types.isRegExp(new RegExp('abc'));  // 返回 true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**加入于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 实例，则返回 `true`。

```js [ESM]
util.types.isSet(new Set());  // 返回 true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**加入于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是为内置的 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 实例返回的迭代器，则返回 `true`。

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // 返回 true
util.types.isSetIterator(set.values());  // 返回 true
util.types.isSetIterator(set.entries());  // 返回 true
util.types.isSetIterator(set[Symbol.iterator]());  // 返回 true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**加入于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 实例，则返回 `true`。 这*不*包括 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 实例。 通常，最好同时测试两者；有关此信息，请参见 [`util.types.isAnyArrayBuffer()`](/zh/nodejs/api/util#utiltypesisanyarraybuffervalue)。

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // 返回 false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // 返回 true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是字符串对象（例如由 `new String()` 创建的对象），则返回 `true`。

```js [ESM]
util.types.isStringObject('foo');  // 返回 false
util.types.isStringObject(new String('foo'));   // 返回 true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是符号对象（通过在 `Symbol` 原始值上调用 `Object()` 创建的对象），则返回 `true`。

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // 返回 false
util.types.isSymbolObject(Object(symbol));   // 返回 true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例，则返回 `true`。

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // 返回 false
util.types.isTypedArray(new Uint8Array());  // 返回 true
util.types.isTypedArray(new Float64Array());  // 返回 true
```
另见 [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)。

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 实例，则返回 `true`。

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // 返回 false
util.types.isUint8Array(new Uint8Array());  // 返回 true
util.types.isUint8Array(new Float64Array());  // 返回 false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) 实例，则返回 `true`。

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // 返回 false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // 返回 true
util.types.isUint8ClampedArray(new Float64Array());  // 返回 false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) 实例，则返回 `true`。

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // 返回 false
util.types.isUint16Array(new Uint16Array());  // 返回 true
util.types.isUint16Array(new Float64Array());  // 返回 false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) 实例，则返回 `true`。

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // 返回 false
util.types.isUint32Array(new Uint32Array());  // 返回 true
util.types.isUint32Array(new Float64Array());  // 返回 false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 实例，则返回 `true`。

```js [ESM]
util.types.isWeakMap(new WeakMap());  // 返回 true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**新增于: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果该值是内置的 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 实例，则返回 `true`。

```js [ESM]
util.types.isWeakSet(new WeakSet());  // 返回 true
```
## 废弃的 API {#deprecated-apis}

以下 API 已被弃用，不应再使用。 现有的应用程序和模块应更新以寻找替代方法。

### `util._extend(target, source)` {#util_extendtarget-source}

**新增于: v0.7.5**

**自以下版本弃用: v6.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用：请改用 [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)。
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`util._extend()` 方法从来没有打算在 Node.js 内部模块之外使用。 社区找到了它并使用了它。

它已被弃用，不应在新代码中使用。 JavaScript 通过 [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 提供了非常相似的内置功能。

### `util.isArray(object)` {#utilisarrayobject}

**新增于: v0.6.0**

**自以下版本弃用: v4.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用：请改用 [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)。
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) 的别名。

如果给定的 `object` 是一个 `Array`，则返回 `true`。 否则，返回 `false`。

```js [ESM]
const util = require('node:util');

util.isArray([]);
// 返回: true
util.isArray(new Array());
// 返回: true
util.isArray({});
// 返回: false
```
