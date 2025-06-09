---
title: 从命令行运行 Node.js 脚本
description: 了解如何从命令行运行 Node.js 程序，包括使用 node 命令、shebang 行、可执行权限、传递字符串作为参数以及自动重启应用程序。
head:
  - - meta
    - name: og:title
      content: 从命令行运行 Node.js 脚本 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何从命令行运行 Node.js 程序，包括使用 node 命令、shebang 行、可执行权限、传递字符串作为参数以及自动重启应用程序。
  - - meta
    - name: twitter:title
      content: 从命令行运行 Node.js 脚本 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何从命令行运行 Node.js 程序，包括使用 node 命令、shebang 行、可执行权限、传递字符串作为参数以及自动重启应用程序。
---


# 从命令行运行 Node.js 脚本

运行 Node.js 程序的通常方式是运行全局可用的 `node` 命令（一旦你安装了 Node.js），并传入你要执行的文件名。

如果你的 Node.js 应用程序主文件是 `app.js`，你可以通过输入以下命令来调用它：

```bash
node app.js
```

上面，你显式地告诉 shell 使用 `node` 运行你的脚本。你也可以使用 "shebang" 行将此信息嵌入到你的 JavaScript 文件中。"Shebang" 是文件中的第一行，它告诉操作系统使用哪个解释器来运行脚本。以下是 JavaScript 的第一行：

```javascript
#!/usr/bin/node
```

上面，我们显式地给出了解释器的绝对路径。并非所有操作系统都在 `bin` 文件夹中包含 `node`，但所有操作系统都应该包含 `env`。你可以告诉操作系统运行 `env`，并将 `node` 作为参数：

```javascript
#!/usr/bin/env node
// 你的 javascript 代码
```

## 要使用 shebang，你的文件应该具有可执行权限。

你可以通过运行以下命令来授予 `app.js` 可执行权限：

```bash
chmod u+x app.js
```

运行命令时，请确保你位于包含 `app.js` 文件的同一目录中。

## 将字符串作为参数传递给 node 而不是文件路径

要将字符串作为参数执行，你可以使用 `-e`，`--eval "script"`。将以下参数作为 JavaScript 求值。REPL 中预定义的模块也可以在脚本中使用。在 Windows 上，使用 `cmd.exe` 时，单引号将无法正常工作，因为它只识别双引号 `"` 进行引用。在 Powershell 或 Git bash 中，`"` 和 `'` 都可以使用。

```bash
node -e "console.log(123)"
```

## 自动重启应用程序

从 nodejs V 16 开始，有一个内置选项可以在文件更改时自动重启应用程序。这对于开发目的很有用。要使用此功能，你需要将 `watch` 标志传递给 nodejs。

```bash
node --watch app.js
```

这样，当你更改文件时，应用程序将自动重启。阅读 --watch [标志文档](/zh/nodejs/api/cli#watch)。

