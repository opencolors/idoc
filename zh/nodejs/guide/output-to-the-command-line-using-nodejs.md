---
title: 使用 Node.js 输出到命令行
description: Node.js 提供了一个控制台模块，具有多种与命令行交互的方法，包括日志记录、计数、计时等。
head:
  - - meta
    - name: og:title
      content: 使用 Node.js 输出到命令行 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 提供了一个控制台模块，具有多种与命令行交互的方法，包括日志记录、计数、计时等。
  - - meta
    - name: twitter:title
      content: 使用 Node.js 输出到命令行 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 提供了一个控制台模块，具有多种与命令行交互的方法，包括日志记录、计数、计时等。
---


# 使用 Node.js 输出到命令行

使用 console 模块进行基本输出
Node.js 提供了一个 console 模块，该模块提供了大量与命令行交互的非常有用的方法。 它基本上与你在浏览器中找到的 console 对象相同。

最基本和最常用的方法是 `console.log()`，它会将你传递给它的字符串打印到控制台。 如果你传递一个对象，它会将其呈现为字符串。

你可以将多个变量传递给 `console.log`，例如：
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

我们还可以通过传递变量和格式说明符来格式化漂亮的短语。 例如：
```javascript
console.log('我的 %s 有 %d 只耳朵', '猫', 2);
```

- %s 将变量格式化为字符串 - %d 将变量格式化为数字 - %i 仅将变量格式化为其整数部分 - %o 将变量格式化为对象
示例：
```javascript
console.log('%o', Number);
```
## 清除控制台

`console.clear()` 清除控制台（行为可能取决于使用的控制台）。

## 计数元素

`console.count()` 是一个方便的方法。
看这段代码：
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('x 的值是 '+x+' 并且已经被检查了...多少次？');
console.count('x 的值是'+x+'并且已经被检查了...多少次？');
console.count('y 的值是'+y+'并且已经被检查了...多少次？');
```

发生的情况是 `console.count()` 将计算字符串被打印的次数，并在旁边打印计数：

你可以只计数苹果和橙子：

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## 重置计数

`console.countReset()` 方法重置与 `console.count()` 一起使用的计数器。

我们将使用苹果和橙子的例子来演示这一点。

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## 打印堆栈跟踪

在某些情况下，打印函数的调用堆栈跟踪可能很有用，也许是为了回答你是如何到达代码的那个部分的？

你可以使用 `console.trace()` 来做到这一点：

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

这将打印堆栈跟踪。 这是我们在 Node.js REPL 中尝试时打印的内容：

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## 计算花费的时间

你可以使用 `time()` 和 `timeEnd()` 轻松计算函数运行所需的时间。

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // 做一些事情，并测量它花费的时间
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout 和 stderr

正如我们所看到的，`console.log` 非常适合在控制台中打印消息。 这就是所谓的标准输出，或 stdout。

`console.error` 打印到 stderr 流。

它不会出现在控制台中，但会出现在错误日志中。

## 给输出着色

你可以使用转义序列为控制台中的文本输出着色。 转义序列是一组标识颜色的字符。

例子：

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

你可以在 Node.js REPL 中尝试一下，它会以黄色打印 hi!。

但是，这是执行此操作的底层方式。 对控制台输出进行着色的最简单方法是使用库。 Chalk 就是这样一个库，除了着色之外，它还可以帮助你进行其他样式设置，例如使文本变为粗体、斜体或带下划线。

你使用 `npm install chalk` 安装它，然后你可以使用它：

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

使用 `chalk.yellow` 比尝试记住转义代码方便得多，并且代码更具可读性。

请查看上面发布的项目链接以获取更多使用示例。


## 创建进度条

`progress` 是一个很棒的包，用于在控制台中创建进度条。 使用 `npm install progress` 安装它。

以下代码段创建了一个 10 步的进度条，并且每 100 毫秒完成一步。 当进度条完成时，我们清除间隔：

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```
