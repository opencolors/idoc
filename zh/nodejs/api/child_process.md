---
title: Node.js 文档 - 子进程
description: Node.js 子进程模块的文档，详细介绍如何生成子进程，管理其生命周期，以及处理进程间通信。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 子进程 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 子进程模块的文档，详细介绍如何生成子进程，管理其生命周期，以及处理进程间通信。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 子进程 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 子进程模块的文档，详细介绍如何生成子进程，管理其生命周期，以及处理进程间通信。
---


# 子进程 {#child-process}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

`node:child_process` 模块提供了生成子进程的能力，这种方式类似于，但不等同于 [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3)。 此功能主要由 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 函数提供：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

默认情况下，父 Node.js 进程和生成的子进程之间会建立 `stdin`、`stdout` 和 `stderr` 的管道。 这些管道的容量有限（且与平台相关）。 如果子进程写入 stdout 的内容超过此限制，但输出未被捕获，则子进程会阻塞，等待管道缓冲区接受更多数据。 这与 shell 中管道的行为相同。 如果不需要使用输出，请使用 `{ stdio: 'ignore' }` 选项。

如果 `env` 在 `options` 对象中，则使用 `options.env.PATH` 环境变量执行命令查找。 否则，使用 `process.env.PATH`。 如果设置了 `options.env` 而没有 `PATH`，则在 Unix 上，在默认搜索路径 `/usr/bin:/bin` 上执行查找（请参阅操作系统的 execvpe/execvp 手册），在 Windows 上，使用当前进程的环境变量 `PATH`。

在 Windows 上，环境变量不区分大小写。 Node.js 按字典顺序对 `env` 键进行排序，并使用第一个不区分大小写匹配的键。 只有第一个（按字典顺序）条目会被传递到子进程。 当将对象传递给 `env` 选项时，这可能会导致 Windows 上的问题，因为该对象具有同一键的多个变体，例如 `PATH` 和 `Path`。

[`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 方法以异步方式生成子进程，而不会阻塞 Node.js 事件循环。 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 函数以同步方式提供等效功能，该方式会阻塞事件循环，直到生成的进程退出或终止。

为了方便起见，`node:child_process` 模块为 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 和 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 提供了一些同步和异步的替代方法。 这些替代方法中的每一种都是在 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 或 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 之上实现的。

- [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback)：生成一个 shell 并在该 shell 中运行一个命令，完成后将 `stdout` 和 `stderr` 传递给回调函数。
- [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback)：类似于 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback)，不同之处在于它默认情况下直接生成命令，而无需先生成 shell。
- [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options)：生成一个新的 Node.js 进程，并调用指定的模块，同时建立 IPC 通信通道，允许在父进程和子进程之间发送消息。
- [`child_process.execSync()`](/zh/nodejs/api/child_process#child_processexecsynccommand-options)：[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 的同步版本，它将阻塞 Node.js 事件循环。
- [`child_process.execFileSync()`](/zh/nodejs/api/child_process#child_processexecfilesyncfile-args-options)：[`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 的同步版本，它将阻塞 Node.js 事件循环。

对于某些用例，例如自动化 shell 脚本，[同步对应项](/zh/nodejs/api/child_process#synchronous-process-creation)可能更方便。 但是，在许多情况下，同步方法会对性能产生重大影响，因为会在生成的进程完成时暂停事件循环。


## 异步进程创建 {#asynchronous-process-creation}

[`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options)、[`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options)、[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 和 [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 方法都遵循与其他 Node.js API 典型的惯用异步编程模式。

每个方法都返回一个 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 实例。 这些对象实现了 Node.js [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) API，允许父进程注册侦听器函数，这些函数在子进程生命周期中发生某些事件时被调用。

[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 和 [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 方法还允许指定一个可选的 `callback` 函数，该函数在子进程终止时被调用。

### 在 Windows 上衍生 `.bat` 和 `.cmd` 文件 {#spawning-bat-and-cmd-files-on-windows}

[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 和 [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 之间的区别的重要性可能因平台而异。 在类 Unix 操作系统（Unix、Linux、macOS）上，[`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 可能更有效，因为它默认不衍生 shell。 但是，在 Windows 上，`.bat` 和 `.cmd` 文件在没有终端的情况下无法自行执行，因此无法使用 [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 启动。 在 Windows 上运行时，可以使用设置了 `shell` 选项的 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options)、使用 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 或衍生 `cmd.exe` 并将 `.bat` 或 `.cmd` 文件作为参数传递（这是 `shell` 选项和 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 所做的事情）来调用 `.bat` 和 `.cmd` 文件。 在任何情况下，如果脚本文件名包含空格，则需要用引号引起来。

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v15.4.0 | 添加了 AbortSignal 支持。 |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的命令，以空格分隔的参数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。 **默认值:** `process.cwd()`。
  - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量的键值对。 **默认值:** `process.env`。
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`
  - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于执行命令的 shell。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认值:** Unix 上为 `'/bin/sh'`，Windows 上为 `process.env.ComSpec`。
  - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 中止子进程。
  - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
  - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 允许在 stdout 或 stderr 上的最大数据量（以字节为单位）。 如果超过，子进程将被终止，并且任何输出都会被截断。 请参见 [`maxBuffer` 和 Unicode](/zh/nodejs/api/child_process#maxbuffer-and-unicode) 中的注意事项。 **默认值:** `1024 * 1024`。
  - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `'SIGTERM'`
  - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
  - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
  - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认值:** `false`。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 进程终止时使用输出调用。
  - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)


- 返回: [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

生成一个 shell，然后在该 shell 中执行 `command`，缓冲任何生成的输出。 传递给 exec 函数的 `command` 字符串由 shell 直接处理，特殊字符（因 [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters) 而异）需要相应地处理：

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// 使用双引号，以便路径中的空格不被解释为
// 多个参数的分隔符。

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 变量在第一个实例中被转义，但在第二个实例中没有。
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// 使用双引号，以便路径中的空格不被解释为
// 多个参数的分隔符。

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 变量在第一个实例中被转义，但在第二个实例中没有。
```
:::

**永远不要将未经处理的用户输入传递给此函数。 任何包含 shell 元字符的输入都可能被用于触发任意命令执行。**

如果提供了 `callback` 函数，则使用参数 `(error, stdout, stderr)` 调用它。 成功时，`error` 将为 `null`。 发生错误时，`error` 将是 [`Error`](/zh/nodejs/api/errors#class-error) 的实例。 `error.code` 属性将是进程的退出代码。 按照惯例，任何非 `0` 的退出代码都表示错误。 `error.signal` 将是终止进程的信号。

传递给回调的 `stdout` 和 `stderr` 参数将包含子进程的 stdout 和 stderr 输出。 默认情况下，Node.js 会将输出解码为 UTF-8 并将字符串传递给回调。 `encoding` 选项可用于指定用于解码 stdout 和 stderr 输出的字符编码。 如果 `encoding` 为 `'buffer'`，或无法识别的字符编码，则会将 `Buffer` 对象传递给回调。

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

如果 `timeout` 大于 `0`，如果子进程运行时间超过 `timeout` 毫秒，则父进程将发送由 `killSignal` 属性标识的信号（默认为 `'SIGTERM'`）。

与 [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3) POSIX 系统调用不同，`child_process.exec()` 不会替换现有进程，而是使用 shell 来执行命令。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 版本调用，则它会返回一个 `Promise`，该 `Promise` 包含具有 `stdout` 和 `stderr` 属性的 `Object`。 返回的 `ChildProcess` 实例作为 `child` 属性附加到 `Promise`。 如果发生错误（包括导致退出代码不是 0 的任何错误），则会返回拒绝的 Promise，该 Promise 具有回调中给出的相同 `error` 对象，但具有两个附加属性 `stdout` 和 `stderr`。

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

如果启用了 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在子进程上调用 `.kill()`，不同之处在于传递给回调的错误将是 `AbortError`：

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v15.4.0, v14.17.0 | 添加了 AbortSignal 支持。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v0.1.91 | 添加于: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的可执行文件的名称或路径。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串参数列表。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认:** `process.env`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 或 stderr 允许的最大数据量（以字节为单位）。 如果超过，子进程将被终止，并且任何输出都将被截断。 请参阅 [`maxBuffer` 和 Unicode](/zh/nodejs/api/child_process#maxbuffer-and-unicode) 中的警告。 **默认:** `1024 * 1024`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认:** `false`。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 在 Windows 上不对参数进行引用或转义。 在 Unix 上被忽略。 **默认:** `false`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为 `true`，则在 shell 中运行 `command`。 在 Unix 上使用 `'/bin/sh'`，在 Windows 上使用 `process.env.ComSpec`。 可以将不同的 shell 指定为字符串。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认的 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认:** `false`（无 shell）。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 中止子进程。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 进程终止时，使用输出调用。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)


- 返回: [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

`child_process.execFile()` 函数类似于 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback)，除了它默认不生成 shell。 而是直接将指定的可执行文件 `file` 作为新进程生成，使其比 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 效率更高。

支持与 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 相同的选项。 由于未生成 shell，因此不支持 I/O 重定向和文件 globbing 等行为。

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

传递给回调的 `stdout` 和 `stderr` 参数将包含子进程的 stdout 和 stderr 输出。 默认情况下，Node.js 将输出解码为 UTF-8 并将字符串传递给回调。 `encoding` 选项可用于指定用于解码 stdout 和 stderr 输出的字符编码。 如果 `encoding` 为 `'buffer'` 或无法识别的字符编码，则会将 `Buffer` 对象传递给回调。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal)ed 版本调用，则它返回一个 `Promise`，其中包含具有 `stdout` 和 `stderr` 属性的 `Object`。 返回的 `ChildProcess` 实例作为 `child` 属性附加到 `Promise`。 如果发生错误（包括导致退出代码不是 0 的任何错误），则返回一个被拒绝的 promise，其中包含回调中给出的相同 `error` 对象，但带有两个附加属性 `stdout` 和 `stderr`。

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**如果启用 <code>shell</code> 选项，请勿将未经消毒的用户输入传递给此
函数。 任何包含 shell 元字符的输入都可能被用来触发
任意命令执行。**

如果启用 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在子进程上调用 `.kill()`，不同之处在于传递给回调的错误将是 `AbortError`：

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.4.0, v16.14.0 | `modulePath` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v16.4.0, v14.18.0 | `cwd` 选项可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v15.13.0, v14.18.0 | 添加了 timeout。 |
| v15.11.0, v14.18.0 | 添加了 AbortSignal 的 killSignal。 |
| v15.6.0, v14.17.0 | 添加了 AbortSignal 支持。 |
| v13.2.0, v12.16.0 | 现在支持 `serialization` 选项。 |
| v8.0.0 | `stdio` 选项现在可以是一个字符串。 |
| v6.4.0 | 现在支持 `stdio` 选项。 |
| v0.5.0 | 添加于: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要在子进程中运行的模块。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串参数列表。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 准备子进程独立于其父进程运行。 具体行为取决于平台，请参阅 [`options.detached`](/zh/nodejs/api/child_process#optionsdetached)。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认:** `process.env`。
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于创建子进程的可执行文件。
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 传递给可执行文件的字符串参数列表。 **默认:** `process.execArgv`。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定用于在进程之间发送消息的序列化类型。 可能的值为 `'json'` 和 `'advanced'`。 有关更多详细信息，请参见[高级序列化](/zh/nodejs/api/child_process#advanced-serialization)。 **默认:** `'json'`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 关闭子进程。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当生成的进程因超时或中止信号而终止时，要使用的信号值。 **默认:** `'SIGTERM'`。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则子进程的 stdin、stdout 和 stderr 将通过管道传递到父进程，否则它们将从父进程继承，有关更多详细信息，请参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio) 的 `'pipe'` 和 `'inherit'` 选项。 **默认:** `false`。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio)。 如果提供此选项，它将覆盖 `silent`。 如果使用数组变体，则它必须只包含一个值为 `'ipc'` 的项，否则将抛出错误。 例如 `[0, 1, 2, 'ipc']`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 在 Windows 上不进行参数的引用或转义。 在 Unix 上忽略。 **默认:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 进程允许运行的最长时间（以毫秒为单位）。 **默认:** `undefined`。

- 返回: [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

`child_process.fork()` 方法是 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的一个特例，专门用于生成新的 Node.js 进程。 像 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 一样，会返回一个 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 对象。 返回的 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 将具有一个内置的附加通信通道，该通道允许在父进程和子进程之间来回传递消息。 有关详细信息，请参见 [`subprocess.send()`](/zh/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)。

请记住，生成的 Node.js 子进程独立于父进程，除了在两者之间建立的 IPC 通信通道。 每个进程都有自己的内存，以及自己的 V8 实例。 由于需要额外的资源分配，因此不建议生成大量子 Node.js 进程。

默认情况下，`child_process.fork()` 将使用父进程的 [`process.execPath`](/zh/nodejs/api/process#processexecpath) 生成新的 Node.js 实例。 `options` 对象中的 `execPath` 属性允许使用替代执行路径。

使用自定义 `execPath` 启动的 Node.js 进程将使用子进程上使用环境变量 `NODE_CHANNEL_FD` 标识的文件描述符 (fd) 与父进程通信。

与 [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2) POSIX 系统调用不同，`child_process.fork()` 不克隆当前进程。

[`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 中可用的 `shell` 选项不受 `child_process.fork()` 支持，如果设置将被忽略。

如果启用了 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在子进程上调用 `.kill()`，除了传递给回调的错误将是 `AbortError`：

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v15.13.0, v14.18.0 | 添加了 timeout。 |
| v15.11.0, v14.18.0 | 添加了 AbortSignal 的 killSignal。 |
| v15.5.0, v14.17.0 | 添加了 AbortSignal 支持。 |
| v13.2.0, v12.16.0 | 现在支持 `serialization` 选项。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v6.4.0 | 现在支持 `argv0` 选项。 |
| v5.7.0 | 现在支持 `shell` 选项。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的命令。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串参数列表。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认值:** `process.env`。
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 显式设置发送到子进程的 `argv[0]` 的值。 如果未指定，则将其设置为 `command`。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子进程的 stdio 配置（参见 [`options.stdio`](/zh/nodejs/api/child_process#optionsstdio)）。
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 准备子进程以独立于其父进程运行。 具体行为取决于平台，参见 [`options.detached`](/zh/nodejs/api/child_process#optionsdetached)）。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定用于在进程之间发送消息的序列化类型。 可能的值为 `'json'` 和 `'advanced'`。 详情请参见 [高级序列化](/zh/nodejs/api/child_process#advanced-serialization)。 **默认值:** `'json'`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为 `true`，则在 shell 中运行 `command`。 在 Unix 上使用 `'/bin/sh'`，在 Windows 上使用 `process.env.ComSpec`。 可以将不同的 shell 指定为字符串。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认值:** `false`（无 shell）。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 在 Windows 上不进行参数的引用或转义。 在 Unix 上忽略。 当指定 `shell` 并且为 CMD 时，此值会自动设置为 `true`。 **默认值:** `false`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认值:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 AbortSignal 中止子进程。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 进程允许运行的最长时间（以毫秒为单位）。 **默认值:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当生成的进程将被超时或中止信号终止时，要使用的信号值。 **默认值:** `'SIGTERM'`。
  
 
- 返回: [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

`child_process.spawn()` 方法使用给定的 `command` 生成一个新进程，并将命令行参数放在 `args` 中。 如果省略，则 `args` 默认为空数组。

**如果启用了 <code>shell</code> 选项，请勿将未经处理的用户输入传递给此函数。 任何包含 shell 元字符的输入都可能被用来触发任意命令执行。**

第三个参数可用于指定其他选项，默认值如下：

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```

使用 `cwd` 指定生成进程的工作目录。 如果未给出，则默认为继承当前工作目录。 如果给出，但该路径不存在，则子进程会发出 `ENOENT` 错误并立即退出。 当命令不存在时，也会发出 `ENOENT`。

使用 `env` 指定新进程可见的环境变量，默认为 [`process.env`](/zh/nodejs/api/process#processenv)。

`env` 中的 `undefined` 值将被忽略。

运行 `ls -lh /usr` 的示例，捕获 `stdout`、`stderr` 和退出码：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

示例：一种非常精细的运行 `ps ax | grep ssh` 的方法

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

检查失败的 `spawn` 的示例：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

某些平台（macOS、Linux）将使用 `argv[0]` 的值作为进程标题，而其他平台（Windows、SunOS）将使用 `command`。

Node.js 在启动时使用 `process.execPath` 覆盖 `argv[0]`，因此 Node.js 子进程中的 `process.argv[0]` 将与从父进程传递给 `spawn` 的 `argv0` 参数不匹配。 请改用 `process.argv0` 属性检索它。

如果启用了 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在子进程上调用 `.kill()`，除了传递给回调的错误将是 `AbortError`：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // 如果控制器中止，这将使用 err 作为 AbortError 调用
});
controller.abort(); // 停止子进程
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // 如果控制器中止，这将使用 err 作为 AbortError 调用
});
controller.abort(); // 停止子进程
```
:::


#### `options.detached` {#optionsdetached}

**新增于: v0.7.10**

在 Windows 上，将 `options.detached` 设置为 `true` 可以使子进程在父进程退出后继续运行。 子进程将拥有自己的控制台窗口。 一旦为子进程启用此功能，就无法禁用。

在非 Windows 平台上，如果 `options.detached` 设置为 `true`，则子进程将成为新进程组和会话的领导者。 无论子进程是否分离，它们都可以在父进程退出后继续运行。 有关更多信息，请参见 [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2)。

默认情况下，父进程将等待分离的子进程退出。 要防止父进程等待给定的 `subprocess` 退出，请使用 `subprocess.unref()` 方法。 这样做会导致父进程的事件循环不将其引用计数中包含子进程，从而允许父进程独立于子进程退出，除非子进程和父进程之间存在已建立的 IPC 通道。

当使用 `detached` 选项启动长时间运行的进程时，除非为其提供未连接到父进程的 `stdio` 配置，否则该进程在父进程退出后不会在后台保持运行。 如果继承了父进程的 `stdio`，则子进程将保持与控制终端的连接。

通过分离并忽略其父进程的 `stdio` 文件描述符，以便忽略父进程的终止，从而实现长时间运行的进程的示例：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

或者，可以将子进程的输出重定向到文件中：

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.6.0, v14.18.0 | 添加了 `overlapped` stdio 标志。 |
| v3.3.1 | 现在接受值 `0` 作为文件描述符。 |
| v0.7.10 | 添加于: v0.7.10 |
:::

`options.stdio` 选项用于配置在父进程和子进程之间建立的管道。 默认情况下，子进程的 stdin、stdout 和 stderr 会重定向到 [`subprocess.stdin`](/zh/nodejs/api/child_process#subprocessstdin)、[`subprocess.stdout`](/zh/nodejs/api/child_process#subprocessstdout) 和 [`subprocess.stderr`](/zh/nodejs/api/child_process#subprocessstderr) 流，它们位于 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 对象上。 这相当于将 `options.stdio` 设置为 `['pipe', 'pipe', 'pipe']`。

为了方便起见，`options.stdio` 可以是以下字符串之一：

- `'pipe'`：等效于 `['pipe', 'pipe', 'pipe']`（默认值）
- `'overlapped'`：等效于 `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`：等效于 `['ignore', 'ignore', 'ignore']`
- `'inherit'`：等效于 `['inherit', 'inherit', 'inherit']` 或 `[0, 1, 2]`

否则，`options.stdio` 的值是一个数组，其中每个索引对应于子进程中的一个 fd。 fd 0、1 和 2 分别对应于 stdin、stdout 和 stderr。 可以指定额外的 fd 以在父进程和子进程之间创建额外的管道。 该值是以下之一：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// 子进程将使用父进程的 stdios。
spawn('prg', [], { stdio: 'inherit' });

// 衍生子进程仅共享 stderr。
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// 打开一个额外的 fd=4，以与呈现
// startd 风格接口的程序进行交互。
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// 子进程将使用父进程的 stdios。
spawn('prg', [], { stdio: 'inherit' });

// 衍生子进程仅共享 stderr。
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// 打开一个额外的 fd=4，以与呈现
// startd 风格接口的程序进行交互。
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*值得注意的是，当在父进程和子进程之间建立 IPC 通道，并且子进程是 Node.js 实例时，启动子进程时 IPC 通道处于非引用状态（使用 <code>unref()</code>），直到子进程为 <a href="process.html#event-disconnect"><code>'disconnect'</code></a> 事件或 <a href="process.html#event-message"><code>'message'</code></a> 事件注册了事件处理程序。 这允许子进程正常退出，而不会因为打开的 IPC 通道而保持进程打开。* 另请参阅：[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 和 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options)。


## 同步进程创建 {#synchronous-process-creation}

[`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options)、[`child_process.execSync()`](/zh/nodejs/api/child_process#child_processexecsynccommand-options) 和 [`child_process.execFileSync()`](/zh/nodejs/api/child_process#child_processexecfilesyncfile-args-options) 方法是同步的，会阻塞 Node.js 事件循环，暂停任何其他代码的执行，直到派生的进程退出。

像这样的阻塞调用主要用于简化通用脚本任务，以及简化启动时应用程序配置的加载/处理。

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v10.10.0 | `input` 选项现在可以是任何 `TypedArray` 或 `DataView`。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v8.0.0 | `input` 选项现在可以是 `Uint8Array`。 |
| v6.2.1, v4.5.0 | `encoding` 选项现在可以显式设置为 `buffer`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的可执行文件的名称或路径。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串参数列表。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将作为 stdin 传递给派生进程的值。 如果 `stdio[0]` 设置为 `'pipe'`，则提供此值将覆盖 `stdio[0]`。
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子进程的 stdio 配置。 参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio)。 默认情况下，除非指定了 `stdio`，否则 `stderr` 将输出到父进程的 stderr。 **默认值:** `'pipe'`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认值:** `process.env`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 进程允许运行的最长时间（以毫秒为单位）。 **默认值:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当要终止派生的进程时要使用的信号值。 **默认值:** `'SIGTERM'`。
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 或 stderr 上允许的最大数据量（以字节为单位）。 如果超出，子进程将被终止。 参见 [`maxBuffer` 和 Unicode](/zh/nodejs/api/child_process#maxbuffer-and-unicode) 中的警告。 **默认值:** `1024 * 1024`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于所有 stdio 输入和输出的编码。 **默认值:** `'buffer'`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认值:** `false`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为 `true`，则在 shell 中运行 `command`。 在 Unix 上使用 `'/bin/sh'`，在 Windows 上使用 `process.env.ComSpec`。 可以将不同的 shell 指定为字符串。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认值:** `false`（无 shell）。

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 来自命令的 stdout。

`child_process.execFileSync()` 方法通常与 [`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 相同，除了该方法在子进程完全关闭之前不会返回。 当遇到超时并且发送了 `killSignal` 时，该方法在进程完全退出之前不会返回。

如果子进程拦截并处理了 `SIGTERM` 信号但未退出，则父进程仍将等待直到子进程退出。

如果进程超时或具有非零退出代码，则此方法将抛出一个 [`Error`](/zh/nodejs/api/errors#class-error)，其中将包含底层 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 的完整结果。

**如果启用了 <code>shell</code> 选项，请勿将未经清理的用户输入传递给此函数。 任何包含 shell 元字符的输入都可能被用来触发任意命令执行。**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 从子进程捕获 stdout 和 stderr。 覆盖了将子进程 stderr 流式传输到父进程 stderr 的默认行为
    stdio: 'pipe',

    // 对 stdio 管道使用 utf8 编码
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 派生子进程失败
    console.error(err.code);
  } else {
    // 子进程已派生，但以非零退出代码退出
    // 错误包含来自子进程的任何 stdout 和 stderr
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 从子进程捕获 stdout 和 stderr。 覆盖了将子进程 stderr 流式传输到父进程 stderr 的默认行为
    stdio: 'pipe',

    // 对 stdio 管道使用 utf8 编码
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 派生子进程失败
    console.error(err.code);
  } else {
    // 子进程已派生，但以非零退出代码退出
    // 错误包含来自子进程的任何 stdout 和 stderr
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v10.10.0 | `input` 选项现在可以是任何 `TypedArray` 或 `DataView`。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v8.0.0 | `input` 选项现在可以是 `Uint8Array`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的命令。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
  - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将作为 stdin 传递给衍生进程的值。 如果 `stdio[0]` 设置为 `'pipe'`，则提供此值将覆盖 `stdio[0]`。
  - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子进程的 stdio 配置。 参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio)。 除非指定了 `stdio`，否则默认情况下 `stderr` 将输出到父进程的 stderr。 **默认:** `'pipe'`。
  - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认:** `process.env`。
  - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于执行命令的 shell。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认:** Unix 上为 `'/bin/sh'`，Windows 上为 `process.env.ComSpec`。
  - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识。（参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)）。
  - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识。（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)）。
  - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 进程允许运行的最长时间（以毫秒为单位）。 **默认:** `undefined`。
  - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 将在终止衍生进程时使用的信号值。 **默认:** `'SIGTERM'`。
  - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 或 stderr 上允许的最大数据量（以字节为单位）。 如果超过此值，子进程将终止，并且任何输出都将被截断。 参见 [`maxBuffer` 和 Unicode](/zh/nodejs/api/child_process#maxbuffer-and-unicode) 的注意事项。 **默认:** `1024 * 1024`。
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于所有 stdio 输入和输出的编码。 **默认:** `'buffer'`。
  - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认:** `false`。

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 命令的 stdout。

`child_process.execSync()` 方法通常与 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback) 相同，但该方法在子进程完全关闭之前不会返回。 当遇到超时并且发送了 `killSignal` 时，该方法将一直等到进程完全退出后才会返回。 如果子进程拦截并处理 `SIGTERM` 信号并且没有退出，则父进程将一直等到子进程退出。

如果进程超时或具有非零退出代码，则此方法将抛出异常。 [`Error`](/zh/nodejs/api/errors#class-error) 对象将包含来自 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 的整个结果。

**永远不要将未经清理的用户输入传递给此函数。 任何包含 shell
元字符的输入都可能被用来触发任意命令执行。**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 选项可以使用 WHATWG `URL` 对象，使用 `file:` 协议。 |
| v10.10.0 | `input` 选项现在可以是任何 `TypedArray` 或 `DataView`。 |
| v8.8.0 | 现在支持 `windowsHide` 选项。 |
| v8.0.0 | `input` 选项现在可以是 `Uint8Array`。 |
| v5.7.0 | 现在支持 `shell` 选项。 |
| v6.2.1, v4.5.0 | `encoding` 选项现在可以显式设置为 `buffer`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要运行的命令。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串参数列表。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 子进程的当前工作目录。
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 将作为 stdin 传递给派生进程的值。 如果 `stdio[0]` 设置为 `'pipe'`，则提供此值将覆盖 `stdio[0]`。
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 显式设置发送到子进程的 `argv[0]` 的值。 如果未指定，则将其设置为 `command`。
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子进程的 stdio 配置。 参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio)。 **默认:** `'pipe'`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 环境变量键值对。 **默认:** `process.env`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识 (参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2))。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识 (参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2))。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 进程允许运行的最长时间（以毫秒为单位）。 **默认:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于杀死派生进程的信号值。 **默认:** `'SIGTERM'`。
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 或 stderr 上允许的最大数据量（以字节为单位）。 如果超过，子进程将终止，并且任何输出都将被截断。 参见 [`maxBuffer` 和 Unicode](/zh/nodejs/api/child_process#maxbuffer-and-unicode) 中的注意事项。 **默认:** `1024 * 1024`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于所有 stdio 输入和输出的编码。 **默认:** `'buffer'`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果为 `true`，则在 shell 中运行 `command`。 在 Unix 上使用 `'/bin/sh'`，在 Windows 上使用 `process.env.ComSpec`。 可以将不同的 shell 指定为字符串。 参见 [Shell 要求](/zh/nodejs/api/child_process#shell-requirements) 和 [默认 Windows shell](/zh/nodejs/api/child_process#default-windows-shell)。 **默认:** `false`（无 shell）。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 在 Windows 上不进行参数的引用或转义。 在 Unix 上忽略。 当指定 `shell` 并且是 CMD 时，这将自动设置为 `true`。 **默认:** `false`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的子进程控制台窗口。 **默认:** `false`。

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 子进程的 Pid。
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 来自 stdio 输出的结果数组。
    - `stdout` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[1]` 的内容。
    - `stderr` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[2]` 的内容。
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 子进程的退出码，如果子进程由于信号而终止，则为 `null`。
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 用于杀死子进程的信号，如果子进程不是由于信号而终止，则为 `null`。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 如果子进程失败或超时，则为 error 对象。

`child_process.spawnSync()` 方法通常与 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 相同，区别在于该函数在子进程完全关闭之前不会返回。 当遇到超时并且发送了 `killSignal` 时，该方法将不会返回，直到进程完全退出。 如果进程拦截并处理 `SIGTERM` 信号并且没有退出，则父进程将等待直到子进程退出。

**如果启用了 <code>shell</code> 选项，请不要将未经处理的用户输入传递给此函数。 任何包含 shell 元字符的输入都可能被用来触发任意命令执行。**


## 类：`ChildProcess` {#class-childprocess}

**新增于: v2.2.0**

- 继承：[\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`ChildProcess` 的实例表示衍生的子进程。

`ChildProcess` 的实例不打算直接创建。而是使用 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options)、[`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback)、[`child_process.execFile()`](/zh/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 或 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 方法来创建 `ChildProcess` 的实例。

### 事件：`'close'` {#event-close}

**新增于: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 如果子进程自行退出，则为退出码。
- `signal` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 子进程终止所使用的信号。

当进程结束*并且*子进程的 stdio 流已关闭后，会触发 `'close'` 事件。 这与 [`'exit'`](/zh/nodejs/api/child_process#event-exit) 事件不同，因为多个进程可能共享相同的 stdio 流。 `'close'` 事件总是在 [`'exit'`](/zh/nodejs/api/child_process#event-exit) 已经触发之后触发，如果子进程未能衍生，则在 [`'error'`](/zh/nodejs/api/child_process#event-error) 之后触发。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### 事件：`'disconnect'` {#event-disconnect}

**新增于：v0.7.2**

在父进程中调用 [`subprocess.disconnect()`](/zh/nodejs/api/child_process#subprocessdisconnect) 方法或子进程中调用 [`process.disconnect()`](/zh/nodejs/api/process#processdisconnect) 方法后，将发出 `'disconnect'` 事件。 断开连接后，将无法再发送或接收消息，并且 [`subprocess.connected`](/zh/nodejs/api/child_process#subprocessconnected) 属性为 `false`。

### 事件：`'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 错误。

每当发生以下情况时，都会发出 `'error'` 事件：

- 进程无法生成。
- 进程无法被终止。
- 向子进程发送消息失败。
- 子进程因 `signal` 选项而中止。

在发生错误后，可能会或可能不会触发 `'exit'` 事件。 当同时监听 `'exit'` 和 `'error'` 事件时，请防止意外地多次调用处理函数。

另请参阅 [`subprocess.kill()`](/zh/nodejs/api/child_process#subprocesskillsignal) 和 [`subprocess.send()`](/zh/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)。

### 事件：`'exit'` {#event-exit}

**新增于：v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果子进程自行退出，则为退出码。
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子进程被终止的信号。

在子进程结束后，将发出 `'exit'` 事件。 如果进程退出，则 `code` 是进程的最终退出码，否则为 `null`。 如果进程因收到信号而终止，则 `signal` 是信号的字符串名称，否则为 `null`。 两者之一将始终为非 `null`。

当触发 `'exit'` 事件时，子进程的 stdio 流可能仍然打开。

Node.js 为 `SIGINT` 和 `SIGTERM` 建立信号处理程序，并且 Node.js 进程不会因收到这些信号而立即终止。 相反，Node.js 将执行一系列清理操作，然后重新引发处理的信号。

请参阅 [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2)。


### Event: `'message'` {#event-message}

**Added in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个已解析的 JSON 对象或原始值。
- `sendHandle` [\<Handle\>](/zh/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` 或一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)、[`net.Server`](/zh/nodejs/api/net#class-netserver) 或 [`dgram.Socket`](/zh/nodejs/api/dgram#class-dgramsocket) 对象。

当子进程使用 [`process.send()`](/zh/nodejs/api/process#processsendmessage-sendhandle-options-callback) 发送消息时，会触发 `'message'` 事件。

消息会经过序列化和解析。 生成的消息可能与最初发送的消息不同。

如果在生成子进程时将 `serialization` 选项设置为 `'advanced'`，则 `message` 参数可能包含 JSON 无法表示的数据。 有关更多详细信息，请参见[高级序列化](/zh/nodejs/api/child_process#advanced-serialization)。

### Event: `'spawn'` {#event-spawn}

**Added in: v15.1.0, v14.17.0**

当子进程成功生成后，会触发 `'spawn'` 事件。 如果子进程未成功生成，则不会触发 `'spawn'` 事件，而是触发 `'error'` 事件。

如果触发了 `'spawn'` 事件，则它会出现在所有其他事件之前，以及通过 `stdout` 或 `stderr` 接收任何数据之前。

无论在生成的进程**内部**是否发生错误，都会触发 `'spawn'` 事件。 例如，如果 `bash some-command` 成功生成，则将触发 `'spawn'` 事件，尽管 `bash` 可能无法生成 `some-command`。 当使用 `{ shell: true }` 时，此注意事项也适用。

### `subprocess.channel` {#subprocesschannel}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 该对象不再意外地暴露原生 C++ 绑定。 |
| v7.1.0 | 添加于: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个管道，表示与子进程的 IPC 通道。

`subprocess.channel` 属性是对子进程的 IPC 通道的引用。 如果不存在 IPC 通道，则此属性为 `undefined`。


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Added in: v7.1.0**

如果之前调用过 `.unref()`，则此方法使 IPC 通道保持父进程的事件循环运行。

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Added in: v7.1.0**

此方法使 IPC 通道不保持父进程的事件循环运行，并使其即使在通道打开时也能完成。

### `subprocess.connected` {#subprocessconnected}

**Added in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 在调用 `subprocess.disconnect()` 后设置为 `false`。

`subprocess.connected` 属性指示是否仍然可以从子进程发送和接收消息。 当 `subprocess.connected` 为 `false` 时，将无法再发送或接收消息。

### `subprocess.disconnect()` {#subprocessdisconnect}

**Added in: v0.7.2**

关闭父进程和子进程之间的 IPC 通道，从而允许子进程在没有其他连接保持活动状态时正常退出。 调用此方法后，父进程和子进程（分别是）中的 `subprocess.connected` 和 `process.connected` 属性将设置为 `false`，并且不再可能在进程之间传递消息。

当没有正在接收的消息时，将发出 `'disconnect'` 事件。 这通常会在调用 `subprocess.disconnect()` 后立即触发。

当子进程是 Node.js 实例（例如，使用 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 生成）时，可以在子进程中调用 `process.disconnect()` 方法来关闭 IPC 通道。

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`subprocess.exitCode` 属性指示子进程的退出码。 如果子进程仍在运行，则该字段将为 `null`。

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Added in: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`subprocess.kill()` 方法向子进程发送信号。 如果没有给出参数，进程将被发送 `'SIGTERM'` 信号。 有关可用信号的列表，请参阅 [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)。 如果 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) 成功，则此函数返回 `true`，否则返回 `false`。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

如果无法传递信号，则 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 对象可能会发出一个 [`'error'`](/zh/nodejs/api/child_process#event-error) 事件。 向已经退出的子进程发送信号不是错误，但可能会产生不可预见的后果。 具体来说，如果进程标识符 (PID) 已重新分配给另一个进程，则该信号将传递给该进程，这可能会产生意外的结果。

虽然该函数被称为 `kill`，但传递给子进程的信号可能实际上不会终止该进程。

有关参考，请参阅 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)。

在 Windows 上，由于不存在 POSIX 信号，除了 `'SIGKILL'`、`'SIGTERM'`、`'SIGINT'` 和 `'SIGQUIT'` 之外，`signal` 参数将被忽略，并且进程将始终被强制和突然地终止（类似于 `'SIGKILL'`）。 有关更多详细信息，请参阅 [信号事件](/zh/nodejs/api/process#signal-events)。

在 Linux 上，尝试终止子进程的父进程时，不会终止子进程的子进程。 当在 shell 中运行新进程或使用 `ChildProcess` 的 `shell` 选项时，很可能会发生这种情况：

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // 不会终止 shell 中的 Node.js 进程。
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // 不会终止 shell 中的 Node.js 进程。
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**加入于: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

使用 `'SIGTERM'` 调用 [`subprocess.kill()`](/zh/nodejs/api/child_process#subprocesskillsignal)。

### `subprocess.killed` {#subprocesskilled}

**加入于: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果在 `subprocess.kill()` 成功发送信号给子进程后，则设置为 `true`。

`subprocess.killed` 属性指示子进程是否成功接收到来自 `subprocess.kill()` 的信号。 `killed` 属性并不表示子进程已经终止。

### `subprocess.pid` {#subprocesspid}

**加入于: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

返回子进程的进程标识符 (PID)。 如果由于错误导致子进程无法生成，则该值为 `undefined` 并发出 `error`。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**加入于: v0.7.10**

在调用 `subprocess.unref()` 之后调用 `subprocess.ref()` 将恢复已删除的子进程的引用计数，强制父进程在退出自身之前等待子进程退出。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v5.8.0 | 现在支持 `options` 参数，特别是 `keepOpen` 选项。 |
| v5.0.0 | 此方法现在返回一个布尔值用于流量控制。 |
| v4.0.0 | 现在支持 `callback` 参数。 |
| v0.5.9 | 添加于: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/zh/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`，或者一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)，[`net.Server`](/zh/nodejs/api/net#class-netserver)，或 [`dgram.Socket`](/zh/nodejs/api/dgram#class-dgramsocket) 对象。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` 参数（如果存在）是一个对象，用于参数化某些类型的句柄的发送。 `options` 支持以下属性：
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 一个可以在传递 `net.Socket` 实例时使用的值。 当为 `true` 时，套接字在发送进程中保持打开状态。 **默认:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

当父进程和子进程之间建立了 IPC 通道时（即，当使用 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 时），可以使用 `subprocess.send()` 方法将消息发送到子进程。 当子进程是一个 Node.js 实例时，可以通过 [`'message'`](/zh/nodejs/api/process#event-message) 事件接收这些消息。

消息会经过序列化和解析。 结果消息可能与最初发送的消息不同。

例如，在父脚本中：

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// 导致子进程打印：CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// 导致子进程打印：CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

然后，子脚本 `'sub.js'` 可能如下所示：

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// 导致父进程打印：PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
子 Node.js 进程将拥有自己的 [`process.send()`](/zh/nodejs/api/process#processsendmessage-sendhandle-options-callback) 方法，允许子进程将消息发送回父进程。

当发送一个 `{cmd: 'NODE_foo'}` 消息时，有一个特殊情况。 在 `cmd` 属性中包含 `NODE_` 前缀的消息保留供 Node.js 核心使用，并且不会在子进程的 [`'message'`](/zh/nodejs/api/process#event-message) 事件中触发。 相反，此类消息使用 `'internalMessage'` 事件触发，并由 Node.js 在内部使用。 应用程序应避免使用此类消息或监听 `'internalMessage'` 事件，因为它可能会在不另行通知的情况下更改。

可以传递给 `subprocess.send()` 的可选 `sendHandle` 参数用于将 TCP 服务器或套接字对象传递给子进程。 子进程会将该对象作为传递给在 [`'message'`](/zh/nodejs/api/process#event-message) 事件上注册的回调函数的第二个参数接收。 在套接字中接收和缓冲的任何数据都不会发送到子进程。 Windows 上不支持发送 IPC 套接字。

可选的 `callback` 是一个函数，在消息发送之后但在子进程可能已经接收到它之前调用。 该函数使用单个参数调用：成功时为 `null`，失败时为 [`Error`](/zh/nodejs/api/errors#class-error) 对象。

如果未提供 `callback` 函数并且无法发送消息，则 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 对象将发出一个 `'error'` 事件。 例如，当子进程已退出时，可能会发生这种情况。

如果通道已关闭，或者未发送消息的积压超过了使其不宜发送更多消息的阈值，则 `subprocess.send()` 将返回 `false`。 否则，该方法返回 `true`。 `callback` 函数可用于实现流量控制。


#### 示例：发送服务器对象 {#example-sending-a-server-object}

`sendHandle` 参数可以用于将 TCP 服务器对象的句柄传递给子进程，如下例所示：

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// 打开服务器对象并发送句柄。
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// 打开服务器对象并发送句柄。
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

子进程将接收服务器对象，如下所示：

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
现在服务器在父进程和子进程之间共享，一些连接可能由父进程处理，而另一些连接可能由子进程处理。

虽然上面的示例使用了使用 `node:net` 模块创建的服务器，但 `node:dgram` 模块服务器使用完全相同的工作流程，除了监听 `'message'` 事件而不是 `'connection'` 事件，以及使用 `server.bind()` 而不是 `server.listen()` 之外。但是，这仅在 Unix 平台上受支持。

#### 示例：发送套接字对象 {#example-sending-a-socket-object}

类似地，`sendHandler` 参数可用于将套接字的句柄传递给子进程。下面的示例派生了两个子进程，每个子进程都处理具有“正常”或“特殊”优先级的连接：

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// 打开服务器并将套接字发送到子进程。 使用 pauseOnConnect 来防止
// 在将套接字发送到子进程之前读取它们。
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // 如果这是特殊优先级...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // 这是正常优先级。
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// 打开服务器并将套接字发送到子进程。 使用 pauseOnConnect 来防止
// 在将套接字发送到子进程之前读取它们。
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // 如果这是特殊优先级...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // 这是正常优先级。
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` 将接收套接字句柄，作为传递给事件回调函数的第二个参数：

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // 检查客户端套接字是否存在。
      // 在套接字被发送和在子进程中被接收之间，套接字可能被关闭。
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
不要在已传递到子进程的套接字上使用 `.maxConnections`。 父进程无法跟踪套接字何时被销毁。

子进程中的任何 `'message'` 处理程序都应验证 `socket` 是否存在，因为在将连接发送到子进程期间，连接可能已关闭。


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`subprocess.signalCode` 属性指示子进程接收到的信号（如果有），否则为 `null`。

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

`subprocess.spawnargs` 属性表示启动子进程时使用的完整命令行参数列表。

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`subprocess.spawnfile` 属性指示启动的子进程的可执行文件名。

对于 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options)，它的值将等于 [`process.execPath`](/zh/nodejs/api/process#processexecpath)。 对于 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options)，它的值将是可执行文件的名称。 对于 [`child_process.exec()`](/zh/nodejs/api/child_process#child_processexeccommand-options-callback)，它的值将是启动子进程的 shell 的名称。

### `subprocess.stderr` {#subprocessstderr}

**Added in: v0.1.90**

- [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

一个 `Readable Stream`，表示子进程的 `stderr`。

如果子进程在生成时 `stdio[2]` 设置为除 `'pipe'` 之外的任何值，则此值将为 `null`。

`subprocess.stderr` 是 `subprocess.stdio[2]` 的别名。 这两个属性都将引用相同的值。

如果无法成功生成子进程，则 `subprocess.stderr` 属性可以为 `null` 或 `undefined`。


### `subprocess.stdin` {#subprocessstdin}

**添加于: v0.1.90**

- [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

表示子进程 `stdin` 的 `Writable Stream`。

如果子进程等待读取所有输入，则子进程将不会继续，直到此流通过 `end()` 关闭。

如果子进程在生成时，`stdio[0]` 设置为 `'pipe'` 以外的任何值，则此值将为 `null`。

`subprocess.stdin` 是 `subprocess.stdio[0]` 的别名。 两个属性将引用相同的值。

如果无法成功生成子进程，则 `subprocess.stdin` 属性可能为 `null` 或 `undefined`。

### `subprocess.stdio` {#subprocessstdio}

**添加于: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

到子进程的管道的稀疏数组，对应于传递给 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio) 选项中已设置为值 `'pipe'` 的位置。 `subprocess.stdio[0]`、`subprocess.stdio[1]` 和 `subprocess.stdio[2]` 也分别可用作 `subprocess.stdin`、`subprocess.stdout` 和 `subprocess.stderr`。

在以下示例中，只有子进程的 fd `1` (stdout) 被配置为管道，因此只有父进程的 `subprocess.stdio[1]` 是流，数组中的所有其他值都是 `null`。

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

如果无法成功生成子进程，则 `subprocess.stdio` 属性可能为 `undefined`。


### `subprocess.stdout` {#subprocessstdout}

**添加于: v0.1.90**

- [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

一个 `Readable Stream`，表示子进程的 `stdout`。

如果子进程在生成时，将 `stdio[1]` 设置为除 `'pipe'` 之外的任何值，则此值为 `null`。

`subprocess.stdout` 是 `subprocess.stdio[1]` 的别名。这两个属性都将引用相同的值。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

如果子进程未能成功生成，则 `subprocess.stdout` 属性可以为 `null` 或 `undefined`。

### `subprocess.unref()` {#subprocessunref}

**添加于: v0.7.10**

默认情况下，父进程将等待分离的子进程退出。 为了防止父进程等待给定的 `subprocess` 退出，请使用 `subprocess.unref()` 方法。 这样做会导致父进程的事件循环不将子进程包含在其引用计数中，从而允许父进程独立于子进程退出，除非子进程和父进程之间存在已建立的 IPC 通道。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` 和 Unicode {#maxbuffer-and-unicode}

`maxBuffer` 选项指定了 `stdout` 或 `stderr` 上允许的最大字节数。 如果超过此值，子进程将被终止。 这会影响包含多字节字符编码（如 UTF-8 或 UTF-16）的输出。 例如，`console.log('中文测试')` 将向 `stdout` 发送 13 个 UTF-8 编码的字节，尽管只有 4 个字符。

## Shell 要求 {#shell-requirements}

shell 应该理解 `-c` 开关。 如果 shell 是 `'cmd.exe'`，它应该理解 `/d /s /c` 开关，并且命令行解析应该是兼容的。

## 默认 Windows shell {#default-windows-shell}

虽然 Microsoft 指定 `%COMSPEC%` 必须包含根环境中 `'cmd.exe'` 的路径，但子进程并不总是受相同要求的约束。 因此，在可以生成 shell 的 `child_process` 函数中，如果 `process.env.ComSpec` 不可用，则使用 `'cmd.exe'` 作为后备。

## 高级序列化 {#advanced-serialization}

**新增于: v13.2.0, v12.16.0**

子进程支持一种基于 [`node:v8` 模块的序列化 API](/zh/nodejs/api/v8#serialization-api) 的 IPC 序列化机制，该机制基于 [HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)。 这通常更强大，并支持更多内置 JavaScript 对象类型，例如 `BigInt`、`Map` 和 `Set`、`ArrayBuffer` 和 `TypedArray`、`Buffer`、`Error`、`RegExp` 等。

但是，此格式不是 JSON 的完整超集，例如，在此类内置类型的对象上设置的属性将不会通过序列化步骤传递。 此外，根据传递的数据的结构，性能可能与 JSON 的性能不相同。 因此，此功能需要通过在调用 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 或 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 时将 `serialization` 选项设置为 `'advanced'` 来选择启用。

