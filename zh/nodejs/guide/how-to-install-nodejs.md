---
title: 如何安装 Node.js
description: 学习如何使用各种包管理器和方法安装 Node.js，包括 nvm、fnm、Homebrew、Docker 等。
head:
  - - meta
    - name: og:title
      content: 如何安装 Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 学习如何使用各种包管理器和方法安装 Node.js，包括 nvm、fnm、Homebrew、Docker 等。
  - - meta
    - name: twitter:title
      content: 如何安装 Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 学习如何使用各种包管理器和方法安装 Node.js，包括 nvm、fnm、Homebrew、Docker 等。
---


# 如何安装 Node.js

Node.js 可以通过不同的方式安装。本文重点介绍最常见和最便捷的方式。所有主要平台的官方软件包都可以在 [https://nodejs.org/download/](https://nodejs.org/download/) 获取。

安装 Node.js 的一种非常便捷的方式是通过包管理器。在这种情况下，每个操作系统都有自己的包管理器。

## 使用包管理器安装

在 macOS、Linux 和 Windows 上，你可以这样安装：

::: code-group
```bash [nvm]
# 安装 nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# 下载并安装 Node.js (你可能需要重启终端)
nvm install 20

# 验证 Node.js 版本是否正确
node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```
```bash [fnm]
# 安装 fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# 激活 fnm
source ~/.bashrc

# 下载并安装 Node.js
fnm use --install-if-missing 20

# 验证 Node.js 版本是否正确
node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```
```bash [Brew]
# 注意:
# Homebrew 不是 Node.js 包管理器。
# 请确保它已经安装在你的系统上。
# 请按照官方说明 https://brew.sh/
# Homebrew 仅支持安装主要的 Node.js 版本，可能不支持 20 发布线中的最新 Node.js 版本。

# 下载并安装 Node.js
brew install node@20

# 验证 Node.js 版本是否正确
node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```
```bash [Docker]
# 注意:
# Docker 不是 Node.js 包管理器。
# 请确保它已经安装在你的系统上。
# 请按照官方说明 https://docs.docker.com/desktop/
# Docker 镜像在 https://github.com/nodejs/docker-node/ 官方提供

# 拉取 Node.js Docker 镜像
docker pull node:20-alpine

# 验证 Node.js 版本是否正确
docker run node:20-alpine node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
docker run node:20-alpine npm -v # 应该输出 `10.8.2`
```
:::

在 Windows 上，你可以这样安装：

::: code-group
```bash [fnm]
# 安装 fnm (Fast Node Manager)
winget install Schniz.fnm

# 配置 fnm 环境
fnm env --use-on-cd | Out-String | Invoke-Expression

# 下载并安装 Node.js
fnm use --install-if-missing 20

# 验证 Node.js 版本是否正确
node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```
```bash [Chocolatey]
# 注意:
# Chocolatey 不是 Node.js 包管理器。
# 请确保它已经安装在你的系统上。
# 请按照官方说明 https://chocolatey.org/
# Chocolatey 不是由 Node.js 项目官方维护的，可能不支持 Node.js 的 v20.17.0 版本

# 下载并安装 Node.js
choco install nodejs-lts --version="20.17.0"

# 验证 Node.js 版本是否正确
node -v # 应该输出 `20`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```
```bash [Docker]
# 注意:
# Docker 不是 Node.js 包管理器。
# 请确保它已经安装在你的系统上。
# 请按照官方说明 https://docs.docker.com/desktop/
# Docker 镜像在 https://github.com/nodejs/docker-node/ 官方提供

# 拉取 Node.js Docker 镜像
docker pull node:20-alpine

# 验证 Node.js 版本是否正确
docker run node:20-alpine node -v # 应该输出 `v20.17.0`

# 验证 npm 版本是否正确
docker run node:20-alpine npm -v # 应该输出 `10.8.2`
```
:::

`nvm` 是一种流行的 Node.js 运行方式。它允许你轻松切换 Node.js 版本，并安装新版本进行尝试，并在出现问题时轻松回滚。 它对于使用旧的 Node.js 版本测试你的代码也非常有用。

::: tip
有关此选项的更多信息，请参见 [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)。
:::

在任何情况下，当 Node.js 安装完成后，你都可以在命令行中访问 node 可执行程序。

