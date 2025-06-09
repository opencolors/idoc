---
title: Node.js 文档 - 概要
description: Node.js 的概述，详细介绍了其异步事件驱动架构、核心模块以及如何开始 Node.js 开发。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 概要 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的概述，详细介绍了其异步事件驱动架构、核心模块以及如何开始 Node.js 开发。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 概要 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的概述，详细介绍了其异步事件驱动架构、核心模块以及如何开始 Node.js 开发。
---


# 用法和示例 {#usage-and-example}

## 用法 {#usage}

`node [选项] [V8 选项] [script.js | -e "script" | - ] [参数]`

请查阅 [命令行选项](/zh/nodejs/api/cli#options) 文档获取更多信息。

## 示例 {#example}

一个使用 Node.js 编写的 [web 服务器](/zh/nodejs/api/http) 的例子，它会响应 `'Hello, World!'`：

本文档中的命令以 `$` 或 `\>` 开头，以复制它们在用户终端中出现的方式。请不要包含 `$` 和 `\>` 字符。 它们用于显示每个命令的开头。

不以 `$` 或 `\>` 字符开头的行显示上一个命令的输出。

首先，请确保已下载并安装 Node.js。 有关更多安装信息，请参见 [通过软件包管理器安装 Node.js](https://nodejs.org/en/download/package-manager/)。

现在，创建一个名为 `projects` 的空项目文件夹，然后进入该文件夹。

Linux 和 Mac：

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD：

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell：

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
接下来，在 `projects` 文件夹中创建一个新的源文件，并将其命名为 `hello-world.js`。

在任何首选的文本编辑器中打开 `hello-world.js`，然后粘贴以下内容：

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
保存文件。 然后，在终端窗口中，要运行 `hello-world.js` 文件，请输入：

```bash [BASH]
node hello-world.js
```
终端中应显示如下输出：

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
现在，打开任何首选的 Web 浏览器并访问 `http://127.0.0.1:3000`。

如果浏览器显示字符串 `Hello, World!`，则表示服务器正在工作。

