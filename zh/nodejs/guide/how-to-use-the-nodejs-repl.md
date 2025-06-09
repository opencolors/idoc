---
title: Node.js REPL 使用指南
description: 学习如何使用 Node.js REPL 快速测试简单的 JavaScript 代码并探索其功能，包括多行模式、特殊变量和点命令。
head:
  - - meta
    - name: og:title
      content: Node.js REPL 使用指南 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 学习如何使用 Node.js REPL 快速测试简单的 JavaScript 代码并探索其功能，包括多行模式、特殊变量和点命令。
  - - meta
    - name: twitter:title
      content: Node.js REPL 使用指南 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 学习如何使用 Node.js REPL 快速测试简单的 JavaScript 代码并探索其功能，包括多行模式、特殊变量和点命令。
---


# 如何使用 Node.js REPL

`node` 命令是我们用来运行 Node.js 脚本的命令：

```bash
node script.js
```

如果我们运行 `node` 命令时，没有任何要执行的脚本或参数，就会启动一个 REPL 会话：

```bash
node
```

::: tip 提示
REPL 代表读取-求值-打印循环 (Read Evaluate Print Loop)，它是一种编程语言环境（基本上是一个控制台窗口），它将单个表达式作为用户输入，并在执行后将结果返回到控制台。REPL 会话提供了一种快速测试简单 JavaScript 代码的便捷方式。
:::

如果现在在你的终端中尝试，会发生以下情况：

```bash
> node
>
```

该命令保持空闲模式，并等待我们输入内容。

::: tip
如果你不确定如何打开终端，请在 Google 上搜索 “如何在你的操作系统上打开终端”。
:::

更准确地说，REPL 正在等待我们输入一些 JavaScript 代码。

从简单开始，输入：

```bash
> console.log('test')
test
undefined
>
```

第一个值 `test` 是我们告诉控制台打印的输出，然后我们得到 `undefined`，它是运行 `console.log()` 的返回值。Node 读取了这行代码，对其求值，打印了结果，然后又返回等待更多代码行。对于我们在 REPL 中执行的每一段代码，Node 都会循环执行这三个步骤，直到我们退出会话。这就是 REPL 得名的原因。

Node 会自动打印任何 JavaScript 代码行的结果，而无需指示它这样做。例如，输入以下行并按 Enter：

```bash
> 5==5
false
>
```

请注意上面两行输出的差异。Node REPL 在执行 `console.log()` 后打印了 `undefined`，而另一方面，它只是打印了 `5== '5'` 的结果。你需要记住，前者只是 JavaScript 中的一个语句，而后者是一个表达式。

在某些情况下，你想要测试的代码可能需要多行。例如，假设你想定义一个生成随机数的函数，在 REPL 会话中输入以下行并按 Enter：

```javascript
function generateRandom()
...
```

Node REPL 非常智能，可以确定你尚未完成编写代码，它将进入多行模式，供你输入更多代码。现在完成你的函数定义并按 Enter：

```javascript
function generateRandom()
...return Math.random()
```


### 特殊变量：

如果在一些代码之后输入 `_`，它将会打印上一次操作的结果。

### 向上箭头键：

如果你按下向上箭头键，你将可以访问当前甚至以前的 REPL 会话中执行的先前代码行的历史记录。

## 点命令

REPL 有一些特殊的命令，都以点 `.` 开头。它们是：
- `.help`：显示点命令帮助。
- `.editor`：启用编辑器模式，轻松编写多行 JavaScript 代码。一旦你进入此模式，输入 `ctrl-D` 来运行你编写的代码。
- `.break`：当输入多行表达式时，输入 `.break` 命令将中止进一步的输入。与按 `ctrl-C` 相同。
- `.clear`：将 REPL 上下文重置为一个空对象，并清除当前正在输入的所有多行表达式。
- `.1oad`：加载一个 JavaScript 文件，相对于当前工作目录。
- `.save`：将你在 REPL 会话中输入的所有内容保存到一个文件（指定文件名）。
- `.exit`：退出 REPL（与按 `ctrl-C` 两次相同）。

REPL 知道你何时正在输入多行语句，而无需调用 `.editor`。例如，如果你开始输入一个像这样的迭代：
```javascript
[1, 2,3].foxEach(num=>{
```
然后你按下回车键，REPL 将会转到以 3 个点开头的新行，表明你现在可以继续处理该块。
```javascript
1... console.log (num)
2...}
```

如果你在一行末尾输入 `.break`，多行模式将停止，并且该语句将不会被执行。

## 从 JavaScript 文件运行 REPL

我们可以使用 `repl` 在 JavaScript 文件中导入 REPL。
```javascript
const repl = require('node:repl');
```

使用 `repl` 变量，我们可以执行各种操作。要启动 REPL 命令提示符，请输入以下行：
```javascript
repl.start();
```

在命令行中运行该文件。
```bash
node repl.js
```

你可以传递一个字符串，该字符串在 REPL 启动时显示。默认值为 '>'（带尾随空格），但我们可以定义自定义提示符。
```javascript
// 一个 Unix 风格的提示符
const local = repl.start('$ ');
```

你可以在退出 REPL 时显示一条消息

```javascript
local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

你可以在 [repl 文档](/zh/nodejs/api/repl) 中阅读更多关于 REPL 模块的信息。

