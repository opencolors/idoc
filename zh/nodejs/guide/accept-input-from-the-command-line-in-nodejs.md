---
title: 在 Node.js 中获取用户输入
description: 学习如何使用 readline 模块和 Inquirer.js 包创建交互式的 Node.js CLI 程序。
head:
  - - meta
    - name: og:title
      content: 在 Node.js 中获取用户输入 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 学习如何使用 readline 模块和 Inquirer.js 包创建交互式的 Node.js CLI 程序。
  - - meta
    - name: twitter:title
      content: 在 Node.js 中获取用户输入 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 学习如何使用 readline 模块和 Inquirer.js 包创建交互式的 Node.js CLI 程序。
---


# 在 Node.js 中接受来自命令行的输入

如何使 Node.js CLI 程序具有交互性？

自 Node.js 7 版本起，提供了一个 `readline` 模块来专门执行此操作：从可读流（例如 `process.stdin` 流）获取输入，该流在 Node.js 程序执行期间是终端输入，一次一行。

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("你叫什么名字?", name => {
    console.log('你好 ' + name + '!');
    rl.close();
});
```

这段代码询问用户的姓名，一旦输入了文本并且用户按下回车键，我们就会发送问候语。

`question()` 方法显示第一个参数（一个问题）并等待用户输入。 一旦按下回车键，它就会调用回调函数。

在这个回调函数中，我们关闭了 readline 接口。

`readline` 提供了其他几种方法，请查看上面链接的包文档。

如果您需要输入密码，最好不要将其回显，而是显示一个 `*` 符号。

最简单的方法是使用 `readline-sync` 包，它在 API 方面非常相似，并且开箱即用地处理此问题。 `Inquirer.js` 包提供了一个更完整和抽象的解决方案。

您可以使用 `npm install inquirer` 安装它，然后您可以像这样复制上面的代码：

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "你叫什么名字?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('你好 ' + answers.name + '!');
});
```

`Inquirer.js` 允许你做很多事情，比如询问多个选择、拥有单选按钮、确认等等。

值得了解所有替代方案，尤其是 Node.js 提供的内置方案，但是如果您计划将 CLI 输入提升到一个新的水平，`Inquirer.js` 是一个最佳选择。

