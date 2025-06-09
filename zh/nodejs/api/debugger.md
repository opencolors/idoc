---
title: Node.js 调试器指南
description: 关于如何使用 Node.js 内置调试器的全面指南，详细介绍了命令、使用方法和调试技术。
head:
  - - meta
    - name: og:title
      content: Node.js 调试器指南 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 关于如何使用 Node.js 内置调试器的全面指南，详细介绍了命令、使用方法和调试技术。
  - - meta
    - name: twitter:title
      content: Node.js 调试器指南 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 关于如何使用 Node.js 内置调试器的全面指南，详细介绍了命令、使用方法和调试技术。
---


# 调试器 {#debugger}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

Node.js 包括一个命令行调试实用程序。 Node.js 调试器客户端不是一个功能齐全的调试器，但可以进行简单的单步执行和检查。

要使用它，请使用 `inspect` 参数启动 Node.js，后跟要调试的脚本的路径。

```bash [BASH]
$ node inspect myscript.js
< 调试器正在监听 ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< 如需帮助，请参阅：https://nodejs.org/en/docs/inspector
<
正在连接到 127.0.0.1:9229 ... 确定
< 调试器已连接。
<
 确定
在 myscript.js:2 处中断
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
调试器会自动在第一个可执行行处中断。 要改为运行到第一个断点（由 [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) 语句指定），请将 `NODE_INSPECT_RESUME_ON_START` 环境变量设置为 `1`。

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< 调试器正在监听 ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< 如需帮助，请参阅：https://nodejs.org/en/docs/inspector
<
正在连接到 127.0.0.1:9229 ... 确定
< 调试器已连接。
<
< 你好
<
在 myscript.js:4 处中断
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
在 myscript.js:5 处中断
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
按 Ctrl+C 离开调试 repl
> x
5
> 2 + 2
4
debug> next
< 世界
<
在 myscript.js:6 处中断
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
`repl` 命令允许远程评估代码。 `next` 命令单步执行到下一行。 键入 `help` 以查看还有哪些命令可用。

不输入命令直接按 `enter` 键将重复上一个调试器命令。


## 监视器 {#watchers}

可以在调试时监视表达式和变量的值。在每个断点处，监视器列表中的每个表达式都会在当前上下文中进行计算，并立即显示在断点的源代码列表之前。

要开始监视一个表达式，输入 `watch('my_expression')`。命令 `watchers` 将打印出当前活动的监视器。要移除一个监视器，输入 `unwatch('my_expression')`。

## 命令参考 {#command-reference}

### 步进 {#stepping}

- `cont`, `c`: 继续执行
- `next`, `n`: 单步跳过
- `step`, `s`: 单步进入
- `out`, `o`: 单步跳出
- `pause`: 暂停运行的代码 (类似于开发者工具中的暂停按钮)

### 断点 {#breakpoints}

- `setBreakpoint()`, `sb()`: 在当前行设置断点
- `setBreakpoint(line)`, `sb(line)`: 在指定行设置断点
- `setBreakpoint('fn()')`, `sb(...)`: 在函数体内的第一条语句处设置断点
- `setBreakpoint('script.js', 1)`, `sb(...)`: 在 `script.js` 的第一行设置断点
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: 在 `script.js` 的第一行设置条件断点，仅当 `num \< 4` 的计算结果为 `true` 时才中断
- `clearBreakpoint('script.js', 1)`, `cb(...)`: 清除 `script.js` 中第 1 行的断点

也可以在尚未加载的文件（模块）中设置断点：

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
也可以设置一个条件断点，该断点仅在给定表达式的计算结果为 `true` 时才中断：

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### 信息 {#information}

- `backtrace`, `bt`: 打印当前执行帧的回溯
- `list(5)`: 列出脚本源代码，包含 5 行上下文 (前后各 5 行)
- `watch(expr)`: 添加表达式到观察列表
- `unwatch(expr)`: 从观察列表中移除表达式
- `unwatch(index)`: 从观察列表中移除指定索引处的表达式
- `watchers`: 列出所有观察器及其值 (每次断点时自动列出)
- `repl`: 打开调试器的 repl，用于在调试脚本的上下文中求值
- `exec expr`, `p expr`: 在调试脚本的上下文中执行表达式并打印其值
- `profile`: 开始 CPU 分析会话
- `profileEnd`: 停止当前 CPU 分析会话
- `profiles`: 列出所有已完成的 CPU 分析会话
- `profiles[n].save(filepath = 'node.cpuprofile')`: 将 CPU 分析会话保存到磁盘，格式为 JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: 拍摄堆快照并保存到磁盘，格式为 JSON

### 执行控制 {#execution-control}

- `run`: 运行脚本 (调试器启动时自动运行)
- `restart`: 重新启动脚本
- `kill`: 终止脚本

### 其他 {#various}

- `scripts`: 列出所有已加载的脚本
- `version`: 显示 V8 的版本

## 高级用法 {#advanced-usage}

### Node.js 的 V8 检查器集成 {#v8-inspector-integration-for-nodejs}

V8 检查器集成允许将 Chrome DevTools 连接到 Node.js 实例以进行调试和性能分析。 它使用 [Chrome DevTools 协议](https://chromedevtools.github.io/devtools-protocol/)。

可以通过在启动 Node.js 应用程序时传递 `--inspect` 标志来启用 V8 检查器。 也可以使用该标志提供自定义端口，例如 `--inspect=9222` 将接受端口 9222 上的 DevTools 连接。

使用 `--inspect` 标志将会在调试器连接之前立即执行代码。 这意味着代码将在您可以开始调试之前开始运行，如果您想从一开始就进行调试，这可能并不理想。

在这种情况下，您有两种选择：

因此，在 `--inspect`、`--inspect-wait` 和 `--inspect-brk` 之间进行选择时，请考虑您是否希望代码立即开始执行，在执行之前等待调试器连接，或者在第一行中断以进行逐步调试。

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(在上面的示例中，URL 末尾的 UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 是动态生成的，在不同的调试会话中会有所不同。)

如果 Chrome 浏览器版本低于 66.0.3345.0，请在上述 URL 中使用 `inspector.html` 代替 `js_app.html`。

Chrome DevTools 尚不支持调试[工作线程](/zh/nodejs/api/worker_threads)。 可以使用 [ndb](https://github.com/GoogleChromeLabs/ndb/) 来调试它们。

