---
title: Node.js 调试
description: Node.js 调试选项，包括 --inspect、--inspect-brk 和 --debug，以及远程调试场景和旧版调试器信息。
head:
  - - meta
    - name: og:title
      content: Node.js 调试 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 调试选项，包括 --inspect、--inspect-brk 和 --debug，以及远程调试场景和旧版调试器信息。
  - - meta
    - name: twitter:title
      content: Node.js 调试 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 调试选项，包括 --inspect、--inspect-brk 和 --debug，以及远程调试场景和旧版调试器信息。
---


# 调试 Node.js

本指南将帮助您开始调试 Node.js 应用程序和脚本。

## 启用 Inspector

使用 `--inspect` 开关启动时，Node.js 进程会监听调试客户端。默认情况下，它将在主机和端口 `127.0.0.1:9229` 上监听。每个进程也被分配一个唯一的 UUID。

Inspector 客户端必须知道并指定主机地址、端口和 UUID 才能连接。完整的 URL 看起来类似于 `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`。

如果 Node.js 收到 `SIGUSR1` 信号，它也会开始监听调试消息。（Windows 上没有 `SIGUSR1`。）在 Node.js 7 及更早版本中，这会激活旧版 Debugger API。在 Node.js 8 及更高版本中，它将激活 Inspector API。

## 安全隐患

由于调试器可以完全访问 Node.js 执行环境，因此能够连接到此端口的恶意行为者可能能够代表 Node.js 进程执行任意代码。了解在公共和私有网络上暴露调试器端口的安全隐患非常重要。

### 公开暴露调试端口是不安全的

如果调试器绑定到公共 IP 地址或 0.0.0.0，任何可以访问您的 IP 地址的客户端都将能够毫无限制地连接到调试器，并且能够运行任意代码。

默认情况下，`node --inspect` 绑定到 127.0.0.1。如果您打算允许外部连接到调试器，则需要明确提供公共 IP 地址或 0.0.0.0 等。这样做可能会使您面临潜在的重大安全威胁。我们建议您确保安装适当的防火墙和访问控制，以防止安全漏洞。

请参阅“[启用远程调试场景](/zh/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)”部分，了解有关如何安全地允许远程调试器客户端连接的一些建议。

### 本地应用程序可以完全访问 inspector

即使您将 inspector 端口绑定到 127.0.0.1（默认值），本地计算机上运行的任何应用程序也将具有不受限制的访问权限。这是设计使然，以便本地调试器能够方便地附加。


### 浏览器、WebSocket 和同源策略

在 Web 浏览器中打开的网站可以根据浏览器安全模型发出 WebSocket 和 HTTP 请求。需要初始 HTTP 连接才能获得唯一的调试器会话 ID。同源策略阻止网站建立此 HTTP 连接。为了进一步防止 [DNS 重绑定攻击](https://en.wikipedia.org/wiki/DNS_rebinding)，Node.js 验证连接的“Host”标头是否精确地指定了 IP 地址或 `localhost`。

这些安全策略禁止通过指定主机名来连接到远程调试服务器。您可以通过指定 IP 地址或使用如下所述的 ssh 隧道来解决此限制。

## Inspector 客户端

Node.js 提供了一个最小的 CLI 调试器，可以通过 `node inspect myscript.js` 使用。一些商业和开源工具也可以连接到 Node.js Inspector。

### Chrome DevTools 55+，Microsoft Edge
+ **选项 1**: 在基于 Chromium 的浏览器中打开 `chrome://inspect` 或在 Edge 中打开 `edge://inspect`。单击“配置”按钮，并确保已列出目标主机和端口。
+ **选项 2**: 从 `/json/list` 的输出（见上文）或 `--inspect` 提示文本中复制 `devtoolsFrontendUrl` 并粘贴到 Chrome 中。

更多信息请参阅 [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com)。

### Visual Studio Code 1.10+
+ 在“调试”面板中，单击设置图标以打开 `.vscode/launch.json`。选择“Node.js”进行初始设置。

更多信息请参阅 [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode)。

### JetBrains WebStorm 和其他 JetBrains IDE

+ 创建一个新的 Node.js 调试配置并点击“调试”。默认情况下，Node.js 7+ 将使用 `--inspect`。要禁用，请在 IDE 注册表中取消选中 `js.debugger.node.use.inspect`。要了解有关在 WebStorm 和其他 JetBrains IDE 中运行和调试 Node.js 的更多信息，请查看 [WebStorm 在线帮助](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html)。


### chrome-remote-interface

+ 用于简化与 [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) 端点连接的库。
  更多信息请参考 [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)。

### Gitpod

+ 从 `Debug` 视图启动 Node.js 调试配置，或者按下 `F5`。详细说明

  更多信息请参考 [https://www.gitpod.io](https://www.gitpod.io)。

### Eclipse IDE with Eclipse Wild Web Developer extension

+ 从 `.js` 文件中，选择 `Debug As... > Node program`，或者创建一个调试配置，将调试器附加到正在运行的 Node.js 应用程序 (已经使用 `--inspect` 启动)。

  更多信息请参考 [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide)。

## 命令行选项

下表列出了各种运行时标志对调试的影响：

| Flag | Meaning |
| --- | --- |
| `--inspect` | 启用带有 Node.js Inspector 的调试。监听默认地址和端口 (127.0.0.1:9229) |
| `--inspect-brk` | 启用带有 Node.js Inspector 的调试。监听默认地址和端口 (127.0.0.1:9229)；在用户代码开始之前中断 |
| `--inspect=[host:port]` | 启用 inspector 代理；绑定到地址或主机名 host (默认值: 127.0.0.1)；监听端口 port (默认值: 9229) |
| `--inspect-brk=[host:port]` | 启用 inspector 代理；绑定到地址或主机名 host (默认值: 127.0.0.1)；监听端口 port (默认值: 9229)；在用户代码开始之前中断 |
| `--inspect-wait` | 启用 inspector 代理；监听默认地址和端口 (127.0.0.1:9229)；等待调试器附加。 |
| `--inspect-wait=[host:port]` | 启用 inspector 代理；绑定到地址或主机名 host (默认值: 127.0.0.1)；监听端口 port (默认值: 9229)；等待调试器附加。 |
| `node inspect script.js` | 生成子进程以在 --inspect 标志下运行用户的脚本；并使用主进程运行 CLI 调试器。 |
| `node inspect --port=xxxx script.js` | 生成子进程以在 --inspect 标志下运行用户的脚本；并使用主进程运行 CLI 调试器。监听端口 port (默认值: 9229) |


## 启用远程调试场景

我们建议您永远不要让调试器监听公共 IP 地址。如果您需要允许远程调试连接，我们建议使用 ssh 隧道代替。我们提供以下示例仅用于说明目的。在继续之前，请了解允许远程访问特权服务的安全风险。

假设您正在远程计算机 remote.example.com 上运行 Node.js，并且希望能够对其进行调试。在该计算机上，您应该启动仅监听 localhost（默认）的检查器的 Node.js 进程。

```bash
node --inspect app.js
```

现在，在您要从中启动调试器客户端连接的本地计算机上，您可以设置一个 ssh 隧道：

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

这将启动一个 ssh 隧道会话，其中到本地计算机上的端口 9221 的连接将被转发到 remote.example.com 上的端口 9229。您现在可以将调试器（例如 Chrome DevTools 或 Visual Studio Code）附加到 localhost:9221，它应该能够像 Node.js 应用程序在本地运行一样进行调试。

## 旧版调试器

**自 Node.js 7.7.0 起，旧版调试器已被弃用。请改用 --inspect 和 Inspector。**

当在版本 7 及更早版本中使用 `--debug` 或 `--debug-brk` 开关启动时，Node.js 会在一个 TCP 端口上监听已停止维护的 V8 调试协议定义的调试命令，默认端口为 `5858`。任何使用此协议的调试器客户端都可以连接到并调试正在运行的进程；下面列出了几个常用的调试器。

V8 调试协议不再维护或记录。

### 内置调试器

启动 `node debug script_name.js` 以在内置命令行调试器下启动您的脚本。 您的脚本在另一个使用 `--debug-brk` 选项启动的 Node.js 进程中启动，并且初始 Node.js 进程运行 `_debugger.js` 脚本并连接到您的目标。 有关更多信息，请参见 [docs](/zh/nodejs/api/debugger)。


### node-inspector

通过使用一个中间进程，该进程将 Chromium 中使用的 [Inspector 协议](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) 转换为 Node.js 中使用的 V8 调试器协议，从而使用 Chrome DevTools 调试您的 Node.js 应用程序。有关更多信息，请参见 [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector)。

