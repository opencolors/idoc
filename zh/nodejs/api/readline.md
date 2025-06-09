---
title: Node.js 文档：Readline
description: Node.js 的 readline 模块提供了一个接口，用于从可读流（如 process.stdin）中逐行读取数据。它支持创建用于从控制台读取输入的接口，处理用户输入，并管理逐行操作。
head:
  - - meta
    - name: og:title
      content: Node.js 文档：Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的 readline 模块提供了一个接口，用于从可读流（如 process.stdin）中逐行读取数据。它支持创建用于从控制台读取输入的接口，处理用户输入，并管理逐行操作。
  - - meta
    - name: twitter:title
      content: Node.js 文档：Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的 readline 模块提供了一个接口，用于从可读流（如 process.stdin）中逐行读取数据。它支持创建用于从控制台读取输入的接口，处理用户输入，并管理逐行操作。
---


# Readline {#readline}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [Stability: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

`node:readline` 模块提供了一个接口，用于一次一行地从 [Readable](/zh/nodejs/api/stream#readable-streams) 流（例如 [`process.stdin`](/zh/nodejs/api/process#processstdin)）读取数据。

要使用基于 Promise 的 API：

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

要使用回调和同步 API：

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

以下简单示例说明了 `node:readline` 模块的基本用法。

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('What do you think of Node.js? ');

console.log(`Thank you for your valuable feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
```
:::

一旦调用此代码，Node.js 应用程序将不会终止，直到 `readline.Interface` 关闭，因为该接口等待在 `input` 流上接收数据。

## 类: `InterfaceConstructor` {#class-interfaceconstructor}

**加入于: v0.1.104**

- 继承: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`InterfaceConstructor` 类的实例使用 `readlinePromises.createInterface()` 或 `readline.createInterface()` 方法构造。 每个实例都与单个 `input` [Readable](/zh/nodejs/api/stream#readable-streams) 流和单个 `output` [Writable](/zh/nodejs/api/stream#writable-streams) 流相关联。 `output` 流用于打印提示，以提示用户在 `input` 流上接收并读取的输入。


### 事件: `'close'` {#event-close}

**加入版本: v0.1.98**

当发生以下情况之一时，会触发 `'close'` 事件：

- 调用了 `rl.close()` 方法，并且 `InterfaceConstructor` 实例已放弃对 `input` 和 `output` 流的控制；
- `input` 流接收到其 `'end'` 事件；
- `input` 流接收到 + 以表示传输结束 (EOT)；
- `input` 流接收到 + 以表示 `SIGINT`，并且 `InterfaceConstructor` 实例上没有注册 `'SIGINT'` 事件监听器。

监听器函数在调用时不传递任何参数。

一旦触发 `'close'` 事件，`InterfaceConstructor` 实例就完成了。

### 事件: `'line'` {#event-line}

**加入版本: v0.1.98**

每当 `input` 流接收到行尾输入 (`\n`、`\r` 或 `\r\n`) 时，就会触发 `'line'` 事件。 这通常发生在用户按下  或  时。

如果从流中读取了新数据，并且该流在没有最终行尾标记的情况下结束，也会触发 `'line'` 事件。

监听器函数在调用时会传递一个字符串，其中包含接收到的单行输入。

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### 事件: `'history'` {#event-history}

**加入版本: v15.8.0, v14.18.0**

每当 history 数组发生更改时，就会触发 `'history'` 事件。

监听器函数在调用时会传递一个数组，其中包含 history 数组。 它将反映所有更改，由于 `historySize` 和 `removeHistoryDuplicates` 而添加的行和删除的行。

主要目的是允许监听器持久化 history。 监听器也可以更改 history 对象。 这对于防止将某些行（如密码）添加到 history 中可能很有用。

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### 事件: `'pause'` {#event-pause}

**加入版本: v0.7.5**

当发生以下情况之一时，会触发 `'pause'` 事件：

- `input` 流已暂停。
- `input` 流未暂停并接收到 `'SIGCONT'` 事件。（请参阅事件 [`'SIGTSTP'`](/zh/nodejs/api/readline#event-sigtstp) 和 [`'SIGCONT'`](/zh/nodejs/api/readline#event-sigcont)。）

监听器函数在调用时不传递任何参数。

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### 事件: `'resume'` {#event-resume}

**添加于: v0.7.5**

每当 `input` 流恢复时，会触发 `'resume'` 事件。

监听器函数被调用时，不传递任何参数。

```js [ESM]
rl.on('resume', () => {
  console.log('Readline 恢复.');
});
```
### 事件: `'SIGCONT'` {#event-sigcont}

**添加于: v0.7.5**

当一个先前使用 + (即 `SIGTSTP`) 移至后台的 Node.js 进程，之后通过 [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) 带回前台时，会触发 `'SIGCONT'` 事件。

如果 `input` 流在 `SIGTSTP` 请求*之前*已暂停，则不会触发此事件。

调用监听器函数时，不传递任何参数。

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` 会自动恢复流
  rl.prompt();
});
```
Windows 上*不*支持 `'SIGCONT'` 事件。

### 事件: `'SIGINT'` {#event-sigint}

**添加于: v0.3.0**

每当 `input` 流接收到一个  输入（通常称为 `SIGINT`）时，会触发 `'SIGINT'` 事件。 如果在 `input` 流收到 `SIGINT` 时，没有注册 `'SIGINT'` 事件的监听器，则会触发 `'pause'` 事件。

调用监听器函数时，不传递任何参数。

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('确定要退出吗？', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### 事件: `'SIGTSTP'` {#event-sigtstp}

**添加于: v0.7.5**

当 `input` 流接收到 + 输入（通常称为 `SIGTSTP`）时，会触发 `'SIGTSTP'` 事件。 如果在 `input` 流收到 `SIGTSTP` 时，没有注册 `'SIGTSTP'` 事件的监听器，则 Node.js 进程将被发送到后台。

当使用 [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) 恢复程序时，将触发 `'pause'` 和 `'SIGCONT'` 事件。 这些可用于恢复 `input` 流。

如果在进程发送到后台之前 `input` 被暂停，则不会触发 `'pause'` 和 `'SIGCONT'` 事件。

调用监听器函数时，不传递任何参数。

```js [ESM]
rl.on('SIGTSTP', () => {
  // 这将覆盖 SIGTSTP 并阻止程序进入后台。
  console.log('捕获到 SIGTSTP。');
});
```
Windows 上*不*支持 `'SIGTSTP'` 事件。


### `rl.close()` {#rlclose}

**新增于: v0.1.98**

`rl.close()` 方法关闭 `InterfaceConstructor` 实例，并放弃对 `input` 和 `output` 流的控制。 调用后，将触发 `'close'` 事件。

调用 `rl.close()` 不会立即停止 `InterfaceConstructor` 实例触发的其他事件（包括 `'line'`）。

### `rl.pause()` {#rlpause}

**新增于: v0.3.4**

`rl.pause()` 方法暂停 `input` 流，允许在必要时稍后恢复。

调用 `rl.pause()` 不会立即暂停 `InterfaceConstructor` 实例触发的其他事件（包括 `'line'`）。

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**新增于: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则防止光标位置重置为 `0`。

`rl.prompt()` 方法将 `InterfaceConstructor` 实例配置的 `prompt` 写入 `output` 中的新行，以便为用户提供一个新的位置来提供输入。

调用后，如果 `input` 流已暂停，则 `rl.prompt()` 将恢复它。

如果创建 `InterfaceConstructor` 时将 `output` 设置为 `null` 或 `undefined`，则不会写入提示。

### `rl.resume()` {#rlresume}

**新增于: v0.3.4**

如果 `input` 流已暂停，则 `rl.resume()` 方法会恢复它。

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**新增于: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)

`rl.setPrompt()` 方法设置将写入 `output` 的提示，只要调用 `rl.prompt()`。

### `rl.getPrompt()` {#rlgetprompt}

**新增于: v15.3.0, v14.17.0**

- 返回: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 当前的提示字符串

`rl.getPrompt()` 方法返回 `rl.prompt()` 使用的当前提示。

### `rl.write(data[, key])` {#rlwritedata-key}

**新增于: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 表示  键。
    - `meta` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 表示  键。
    - `shift` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 表示  键。
    - `name` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 键的名称。

`rl.write()` 方法会将 `data` 或由 `key` 标识的键序列写入 `output`。 仅当 `output` 是 [TTY](/zh/nodejs/api/tty) 文本终端时，才支持 `key` 参数。 有关键组合的列表，请参见 [TTY 键绑定](/zh/nodejs/api/readline#tty-keybindings)。

如果指定了 `key`，则忽略 `data`。

调用后，如果 `input` 流已暂停，则 `rl.write()` 将恢复它。

如果创建 `InterfaceConstructor` 时将 `output` 设置为 `null` 或 `undefined`，则不会写入 `data` 和 `key`。

```js [ESM]
rl.write('删除这个!');
// 模拟 Ctrl+U 删除先前写入的行
rl.write(null, { ctrl: true, name: 'u' });
```

`rl.write()` 方法会将数据写入 `readline` `Interface` 的 `input`，*就像它是由用户提供的一样*。


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.14.0, v10.17.0 | Symbol.asyncIterator 支持不再是实验性的。 |
| v11.4.0, v10.16.0 | 加入于: v11.4.0, v10.16.0 |
:::

- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

创建一个 `AsyncIterator` 对象，该对象将输入流中的每一行作为一个字符串进行迭代。此方法允许通过 `for await...of` 循环异步迭代 `InterfaceConstructor` 对象。

输入流中的错误不会被转发。

如果循环以 `break`、`throw` 或 `return` 终止，则会调用 [`rl.close()`](/zh/nodejs/api/readline#rlclose)。换句话说，迭代 `InterfaceConstructor` 将始终完全消耗输入流。

性能不如传统的 `'line'` 事件 API。对于对性能敏感的应用程序，请改用 `'line'`。

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // readline 输入中的每一行都会依次作为 `line` 在这里提供。
  }
}
```
`readline.createInterface()` 将在调用后开始消耗输入流。在接口创建和异步迭代之间进行异步操作可能会导致遗漏行。

### `rl.line` {#rlline}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.8.0, v14.18.0 | 值将始终是一个字符串，永远不会是 undefined。 |
| v0.1.98 | 加入于: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

node 当前正在处理的输入数据。

当从 TTY 流收集输入时，可以使用它来检索到目前为止已处理的当前值，在 `line` 事件发出之前。一旦 `line` 事件被发出，这个属性将是一个空字符串。

请注意，如果在实例运行时修改该值，如果 `rl.cursor` 没有被控制，可能会产生意想不到的后果。

**如果不使用 TTY 流作为输入，请使用 <a href="#event-line"><code>'line'</code></a> 事件。**

一个可能的用例如下：

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**添加于: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

光标相对于 `rl.line` 的位置。

当从 TTY 流读取输入时，这将跟踪当前光标在输入字符串中的位置。光标的位置决定了输入字符串中将被修改的部分，以及终端插入符号将被渲染的列。

### `rl.getCursorPos()` {#rlgetcursorpos}

**添加于: v13.5.0, v12.16.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 光标当前所在提示符的行
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 光标当前所在的屏幕列

返回光标相对于输入提示符 + 字符串的实际位置。 长输入（换行）字符串以及多行提示符都包含在计算中。

## Promises API {#promises-api}

**添加于: v17.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

### 类: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**添加于: v17.0.0**

- 继承自: [\<readline.InterfaceConstructor\>](/zh/nodejs/api/readline#class-interfaceconstructor)

`readlinePromises.Interface` 类的实例使用 `readlinePromises.createInterface()` 方法构造。 每个实例都与一个 `input` [Readable](/zh/nodejs/api/stream#readable-streams) 流和一个 `output` [Writable](/zh/nodejs/api/stream#writable-streams) 流相关联。 `output` 流用于打印提示用户输入，这些输入会到达并从 `input` 流读取。


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Added in: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要写入到 `output` 的语句或查询，位于提示符之前。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可选，允许使用 `AbortSignal` 取消 `question()`。

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个 promise，其值是用户对 `query` 的输入的响应。

`rl.question()` 方法通过将其写入到 `output` 来显示 `query`，等待用户在 `input` 上提供输入，然后调用 `callback` 函数，并将提供的输入作为第一个参数传递。

当调用时，如果 `rl.question()` 暂停了 `input` 流，它将恢复该流。

如果 `readlinePromises.Interface` 创建时 `output` 设置为 `null` 或 `undefined`，则不写入 `query`。

如果在 `rl.close()` 之后调用问题，它将返回一个被拒绝的 promise。

用法示例：

```js [ESM]
const answer = await rl.question('What is your favorite food? ');
console.log(`Oh, so your favorite food is ${answer}`);
```
使用 `AbortSignal` 取消一个问题。

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

const answer = await rl.question('What is your favorite food? ', { signal });
console.log(`Oh, so your favorite food is ${answer}`);
```
### Class: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Added in: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Added in: v17.0.0**

- `stream` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) 一个 [TTY](/zh/nodejs/api/tty) 流。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则无需调用 `rl.commit()`。


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Added in: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 光标左侧
    - `1`: 光标右侧
    - `0`: 整行
  
 
- 返回: this

`rl.clearLine()` 方法向待执行的内部操作列表添加一个操作，该操作清除与 `stream` 关联的当前行，清除的方向由 `dir` 指定。 调用 `rl.commit()` 来查看此方法的效果，除非在构造函数中传递了 `autoCommit: true`。

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Added in: v17.0.0**

- 返回: this

`rl.clearScreenDown()` 方法向待执行的内部操作列表添加一个操作，该操作清除与流关联的光标当前位置下方的屏幕。 调用 `rl.commit()` 来查看此方法的效果，除非在构造函数中传递了 `autoCommit: true`。

#### `rl.commit()` {#rlcommit}

**Added in: v17.0.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`rl.commit()` 方法将所有待执行的操作发送到关联的 `stream` 并清除待执行操作的内部列表。

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Added in: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: this

`rl.cursorTo()` 方法向待执行的内部操作列表添加一个操作，该操作将光标移动到关联 `stream` 中的指定位置。 调用 `rl.commit()` 来查看此方法的效果，除非在构造函数中传递了 `autoCommit: true`。

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Added in: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: this

`rl.moveCursor()` 方法向待执行的内部操作列表添加一个操作，该操作将光标相对于其在关联 `stream` 中的当前位置进行移动。 调用 `rl.commit()` 来查看此方法的效果，除非在构造函数中传递了 `autoCommit: true`。


#### `rl.rollback()` {#rlrollback}

**新增于: v17.0.0**

- 返回: this

`rl.rollback` 方法清除内部的待处理操作列表，而不将其发送到关联的 `stream`。

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**新增于: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) 要监听的 [Readable](/zh/nodejs/api/stream#readable-streams) 流。 此选项是*必需的*。
    - `output` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) 用于写入 readline 数据的 [Writable](/zh/nodejs/api/stream#writable-streams) 流。
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于 Tab 自动补全的可选函数。
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果应该将 `input` 和 `output` 流视为 TTY，并且将 ANSI/VT100 转义码写入其中，则为 `true`。 **默认值:** 在实例化时检查 `output` 流上的 `isTTY`。
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 历史记录行的初始列表。 仅当用户或内部 `output` 检查将 `terminal` 设置为 `true` 时，此选项才有意义，否则根本不会初始化历史记录缓存机制。 **默认值:** `[]`。
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 保留的最大历史记录行数。 要禁用历史记录，请将此值设置为 `0`。 仅当用户或内部 `output` 检查将 `terminal` 设置为 `true` 时，此选项才有意义，否则根本不会初始化历史记录缓存机制。 **默认值:** `30`。
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则当添加到历史记录列表中的新输入行与旧的重复时，这将从列表中删除旧的行。 **默认值:** `false`。
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的提示字符串。 **默认值:** `'\> '`。
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果 `\r` 和 `\n` 之间的延迟超过 `crlfDelay` 毫秒，则 `\r` 和 `\n` 都将被视为单独的行尾输入。 `crlfDelay` 将被强制转换为不小于 `100` 的数字。 可以将其设置为 `Infinity`，在这种情况下，`\r` 后跟 `\n` 将始终被视为单个换行符（对于 [读取文件](/zh/nodejs/api/readline#example-read-file-stream-line-by-line) 并使用 `\r\n` 行分隔符的情况，这可能是合理的）。 **默认值:** `100`。
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `readlinePromises` 将等待字符的持续时间（以毫秒为单位读取不明确的键序列时，该键序列既可以使用到目前为止读取的输入形成完整的键序列，又可以采用其他输入来完成更长的键序列）。 **默认值:** `500`。
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个制表符等于的空格数（最小值为 1）。 **默认值:** `8`。
  
 
- 返回: [\<readlinePromises.Interface\>](/zh/nodejs/api/readline#class-readlinepromisesinterface)

`readlinePromises.createInterface()` 方法创建一个新的 `readlinePromises.Interface` 实例。



::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

创建 `readlinePromises.Interface` 实例后，最常见的情况是监听 `'line'` 事件：

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
如果此实例的 `terminal` 为 `true`，那么如果 `output` 流定义了 `output.columns` 属性，并在 `output` 上发出 `'resize'` 事件（如果列发生更改）（[`process.stdout`](/zh/nodejs/api/process#processstdout) 在它是 TTY 时会自动执行此操作），则它将获得最佳兼容性。


#### 使用 `completer` 函数 {#use-of-the-completer-function}

`completer` 函数接受用户输入的当前行作为参数，并返回一个包含 2 个条目的 `Array`：

- 一个包含用于补全的匹配条目的 `Array`。
- 用于匹配的子字符串。

例如：`[[substr1, substr2, ...], originalsubstring]`。

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 如果未找到匹配项，则显示所有补全项
  return [hits.length ? hits : completions, line];
}
```
`completer` 函数也可以返回一个 [\<Promise\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，或者可以是异步的：

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## 回调 API {#callback-api}

**加入版本: v0.1.104**

### 类: `readline.Interface` {#class-readlineinterface}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.0.0 | 类 `readline.Interface` 现在继承自 `Interface`。 |
| v0.1.104 | 加入版本: v0.1.104 |
:::

- 继承自: [\<readline.InterfaceConstructor\>](/zh/nodejs/api/readline#class-interfaceconstructor)

`readline.Interface` 类的实例使用 `readline.createInterface()` 方法构造。 每个实例都与一个 `input` [Readable](/zh/nodejs/api/stream#readable-streams) 流和一个 `output` [Writable](/zh/nodejs/api/stream#writable-streams) 流相关联。 `output` 流用于打印提示以获取用户输入，这些输入到达 `input` 流并从其中读取。

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**加入版本: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 要写入 `output` 的语句或查询，前置于提示符。
- `options` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可选地允许使用 `AbortController` 取消 `question()`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，在使用用户输入响应 `query` 时调用。

`rl.question()` 方法通过将 `query` 写入 `output` 来显示它，等待用户在 `input` 上提供输入，然后调用 `callback` 函数，并将提供的输入作为第一个参数传递。

调用时，如果 `rl.question()` 暂停了 `input` 流，它将恢复该流。

如果 `readline.Interface` 是使用设置为 `null` 或 `undefined` 的 `output` 创建的，则不会写入 `query`。

传递给 `rl.question()` 的 `callback` 函数不遵循接受 `Error` 对象或 `null` 作为第一个参数的典型模式。 `callback` 被调用时，只将提供的答案作为参数。

如果在 `rl.close()` 之后调用 `rl.question()`，将抛出一个错误。

使用示例：

```js [ESM]
rl.question('你最喜欢的食物是什么？', (answer) => {
  console.log(`哦，所以你最喜欢的食物是 ${answer}`);
});
```
使用 `AbortController` 取消问题。

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('你最喜欢的食物是什么？', { signal }, (answer) => {
  console.log(`哦，所以你最喜欢的食物是 ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('食物问题超时了');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 添加于: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 光标左侧
    - `1`: 光标右侧
    - `0`: 整行


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `stream` 希望调用代码等待发出 `'drain'` 事件后再继续写入其他数据，则为 `false`；否则为 `true`。

`readline.clearLine()` 方法清除给定 [TTY](/zh/nodejs/api/tty) 流中指定方向上光标所在的当前行，由 `dir` 标识。

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 添加于: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `stream` 希望调用代码等待发出 `'drain'` 事件后再继续写入其他数据，则为 `false`；否则为 `true`。

`readline.clearScreenDown()` 方法清除给定 [TTY](/zh/nodejs/api/tty) 流中从光标当前位置向下的内容。


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.14.0, v14.18.0 | 现在支持 `signal` 选项。 |
| v15.8.0, v14.18.0 | 现在支持 `history` 选项。 |
| v13.9.0 | 现在支持 `tabSize` 选项。 |
| v8.3.0, v6.11.4 | 移除 `crlfDelay` 选项的最大限制。 |
| v6.6.0 | 现在支持 `crlfDelay` 选项。 |
| v6.3.0 | 现在支持 `prompt` 选项。 |
| v6.0.0 | `historySize` 选项现在可以为 `0`。 |
| v0.1.98 | 添加于：v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `input` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) 要监听的 [Readable](/zh/nodejs/api/stream#readable-streams) 流。 此选项是*必需的*。
  - `output` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) 要向其写入 readline 数据的 [Writable](/zh/nodejs/api/stream#writable-streams) 流。
  - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于 Tab 自动完成的可选函数。
  - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `input` 和 `output` 流应被视为 TTY，并且要将 ANSI/VT100 转义码写入其中，则为 `true`。 **默认值：** 在实例化时检查 `output` 流上的 `isTTY`。
  - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 历史行的初始列表。 仅当用户或内部 `output` 检查将 `terminal` 设置为 `true` 时，此选项才有意义，否则根本不会初始化历史缓存机制。 **默认值：** `[]`。
  - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 保留的最大历史行数。 要禁用历史记录，请将此值设置为 `0`。 仅当用户或内部 `output` 检查将 `terminal` 设置为 `true` 时，此选项才有意义，否则根本不会初始化历史缓存机制。 **默认值：** `30`。
  - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则当添加到历史记录列表中的新输入行与旧行重复时，将从列表中删除旧行。 **默认值：** `false`。
  - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的提示字符串。 **默认值：** `'\> '`。
  - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果 `\r` 和 `\n` 之间的延迟超过 `crlfDelay` 毫秒，则 `\r` 和 `\n` 都将被视为单独的行尾输入。 `crlfDelay` 将被强制转换为不小于 `100` 的数字。 可以将其设置为 `Infinity`，在这种情况下，`\r` 后跟 `\n` 将始终被视为单个换行符（对于使用 `\r\n` 行分隔符[逐行读取文件](/zh/nodejs/api/readline#example-read-file-stream-line-by-line)可能很合理）。 **默认值：** `100`。
  - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `readline` 将等待字符的持续时间（以毫秒为单位读取不明确的键序列时，该序列可以使用到目前为止读取的输入形成完整的键序列，并且可以接受其他输入以完成更长的键序列）。 **默认值：** `500`。
  - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 制表符等于的空格数（最小值为 1）。 **默认值：** `8`。
  - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 关闭接口。 中止信号将在内部调用接口上的 `close`。


- 返回：[\<readline.Interface\>](/zh/nodejs/api/readline#class-readlineinterface)

`readline.createInterface()` 方法创建一个新的 `readline.Interface` 实例。

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

创建 `readline.Interface` 实例后，最常见的情况是监听 `'line'` 事件：

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
如果此实例的 `terminal` 为 `true`，则如果 `output` 定义了 `output.columns` 属性并在 `output` 上发出 `'resize'` 事件（如果列发生更改）（[`process.stdout`](/zh/nodejs/api/process#processstdout) 在它是 TTY 时会自动执行此操作），则 `output` 流将获得最佳兼容性。

当使用 `stdin` 作为输入创建 `readline.Interface` 时，程序将不会终止，直到它收到一个 [EOF 字符](https://en.wikipedia.org/wiki/End-of-file#EOF_character)。 要退出而不等待用户输入，请调用 `process.stdin.unref()`。


#### 使用 `completer` 函数 {#use-of-the-completer-function_1}

`completer` 函数接受用户输入的当前行作为参数，并返回一个包含 2 个条目的 `Array`：

- 一个包含用于补全的匹配条目的 `Array`。
- 用于匹配的子字符串。

例如：`[[substr1, substr2, ...], originalsubstring]`。

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 如果未找到任何补全项，则显示所有补全项
  return [hits.length ? hits : completions, line];
}
```
如果 `completer` 函数接受两个参数，则可以异步调用它：

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 添加于：v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回：[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `stream` 希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件，则为 `false`；否则为 `true`。

`readline.cursorTo()` 方法将光标移动到给定 [TTY](/zh/nodejs/api/tty) `stream` 中的指定位置。

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v12.7.0 | 公开了流的 write() 回调和返回值。 |
| v0.7.7 | 添加于：v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作完成后调用。
- 返回：[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `stream` 希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件，则为 `false`；否则为 `true`。

`readline.moveCursor()` 方法将光标相对于其在给定 [TTY](/zh/nodejs/api/tty) `stream` 中的当前位置进行*相对*移动。


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**新增于: v0.7.7**

- `stream` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/zh/nodejs/api/readline#class-interfaceconstructor)

`readline.emitKeypressEvents()` 方法使给定的 [Readable](/zh/nodejs/api/stream#readable-streams) 流开始发出与接收到的输入相对应的 `'keypress'` 事件。

可选地，`interface` 指定一个 `readline.Interface` 实例，当检测到复制粘贴的输入时，该实例的自动完成功能将被禁用。

如果 `stream` 是 [TTY](/zh/nodejs/api/tty)，那么它必须处于原始模式。

如果 `input` 是终端，则任何 readline 实例都会在其 `input` 上自动调用此方法。 关闭 `readline` 实例不会停止 `input` 发出 `'keypress'` 事件。

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## 示例：微型 CLI {#example-tiny-cli}

以下示例说明了如何使用 `readline.Interface` 类来实现一个小型命令行接口：

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## 示例：逐行读取文件流 {#example-read-file-stream-line-by-line}

`readline` 的一个常见用例是一次处理输入文件的一行。 最简单的方法是利用 [`fs.ReadStream`](/zh/nodejs/api/fs#class-fsreadstream) API 以及 `for await...of` 循环：

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 注意：我们使用 crlfDelay 选项来识别 input.txt 中所有 CR LF ('\r\n') 实例作为一个换行符。

  for await (const line of rl) {
    // input.txt 中的每一行将在此处连续可用，作为 `line`。
    console.log(`来自文件的行：${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 注意：我们使用 crlfDelay 选项来识别 input.txt 中所有 CR LF ('\r\n') 实例作为一个换行符。

  for await (const line of rl) {
    // input.txt 中的每一行将在此处连续可用，作为 `line`。
    console.log(`来自文件的行：${line}`);
  }
}

processLineByLine();
```
:::

或者，可以使用 [`'line'`](/zh/nodejs/api/readline#event-line) 事件：

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`来自文件的行：${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`来自文件的行：${line}`);
});
```
:::

目前，`for await...of` 循环可能会慢一些。 如果 `async` / `await` 流和速度都至关重要，则可以应用混合方法：

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 处理该行。
    });

    await once(rl, 'close');

    console.log('文件已处理。');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 处理该行。
    });

    await once(rl, 'close');

    console.log('文件已处理。');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## TTY 键盘绑定 {#tty-keybindings}

| 键盘绑定 | 描述 | 备注 |
| --- | --- | --- |
|  +   +   | 删除行左侧内容 | 在 Linux、Mac 和 Windows 上不起作用 |
|  +   +   | 删除行右侧内容 | 在 Mac 上不起作用 |
|  +   | 发出 `SIGINT` 或关闭 readline 实例 |  |
|  +   | 删除左侧内容 |  |
|  +   | 删除右侧内容，如果当前行为空/EOF 则关闭 readline 实例 | 在 Windows 上不起作用 |
|  +   | 从当前位置删除到行首 |  |
|  +   | 从当前位置删除到行尾 |  |
|  +   | 粘贴（回忆）先前删除的文本 | 仅适用于通过  +   或  +   删除的文本 |
|  +   | 在先前删除的文本之间循环 | 仅当上一次按键是  +   或  +   时可用 |
|  +   | 转到行首 |  |
|  +   | 转到行尾 |  |
|  +   | 向后移动一个字符 |  |
|  +   | 向前移动一个字符 |  |
|  +   | 清屏 |  |
|  +   | 下一个历史记录项 |  |
|  +   | 上一个历史记录项 |  |
|  +   | 撤消上一次更改 | 任何发出键码 `0x1F` 的按键都将执行此操作。 例如，在许多终端（如 `xterm`）中，这绑定到  +   。 |
|  +   | 重做上一次更改 | 许多终端没有默认的重做按键。我们选择键码 `0x1E` 来执行重做。 在 `xterm` 中，默认情况下它绑定到  +   。 |
|  +   | 将正在运行的进程移至后台。 键入 `fg` 并按  返回。 | 在 Windows 上不起作用 |
|  +   或  +   | 向后删除到单词边界 |  +   在 Linux、Mac 和 Windows 上不起作用 |
|  +   | 向前删除到单词边界 | 在 Mac 上不起作用 |
|  +   或  +   | 左移一个单词 |  +   在 Mac 上不起作用 |
|  +   或  +   | 右移一个单词 |  +   在 Mac 上不起作用 |
|  +   或  +   | 删除右侧单词 |  +   在 Windows 上不起作用 |
|  +   | 删除左侧单词 | 在 Mac 上不起作用 |

