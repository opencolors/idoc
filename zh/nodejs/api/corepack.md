---
title: Node.js Corepack 文档
description: Corepack 是随 Node.js 一起发布的二进制文件，提供了一个标准接口来管理包管理器，如 npm、pnpm 和 Yarn。它允许用户在不同的包管理器和版本之间轻松切换，确保兼容性并简化开发工作流程。
head:
  - - meta
    - name: og:title
      content: Node.js Corepack 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack 是随 Node.js 一起发布的二进制文件，提供了一个标准接口来管理包管理器，如 npm、pnpm 和 Yarn。它允许用户在不同的包管理器和版本之间轻松切换，确保兼容性并简化开发工作流程。
  - - meta
    - name: twitter:title
      content: Node.js Corepack 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack 是随 Node.js 一起发布的二进制文件，提供了一个标准接口来管理包管理器，如 npm、pnpm 和 Yarn。它允许用户在不同的包管理器和版本之间轻松切换，确保兼容性并简化开发工作流程。
---


# Corepack {#corepack}

**加入于: v16.9.0, v14.19.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* 是一个实验性工具，旨在帮助管理你的包管理器版本。 它为每个[支持的包管理器](/zh/nodejs/api/corepack#supported-package-managers)公开二进制代理，这些代理在被调用时，将识别为当前项目配置的包管理器，如果需要则下载它，并最终运行它。

尽管 Corepack 随 Node.js 的默认安装一起分发，但 Corepack 管理的包管理器不是 Node.js 发行版的一部分，并且：

- 首次使用时，Corepack 会从网络下载最新版本。
- 任何必需的更新（与安全漏洞或其他原因相关）都不在 Node.js 项目的范围内。 如果有必要，最终用户必须自己弄清楚如何更新。

此功能简化了两个核心工作流程：

- 简化了新贡献者的入门，因为他们不再需要遵循特定于系统的安装过程，就可以拥有你想要的包管理器。
- 允许你确保团队中的每个人都将使用你希望他们使用的确切包管理器版本，而无需他们在每次需要进行更新时手动同步它。

## 工作流程 {#workflows}

### 启用该功能 {#enabling-the-feature}

由于其实验性状态，Corepack 目前需要显式启用才能生效。 要做到这一点，运行 [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name)，这将在你的环境中 `node` 二进制文件旁边设置符号链接（如果需要，会覆盖现有的符号链接）。

从现在开始，任何对[支持的二进制文件](/zh/nodejs/api/corepack#supported-package-managers)的调用都将无需进一步设置即可工作。 如果你遇到问题，请运行 [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) 从你的系统中移除代理（并考虑在 [Corepack 仓库](https://github.com/nodejs/corepack) 上开启一个 issue，让我们知道）。


### 配置包 {#configuring-a-package}

Corepack 代理会找到当前目录层级中最接近的 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件，以提取其 [`"packageManager"`](/zh/nodejs/api/packages#packagemanager) 属性。

如果该值对应于一个[受支持的包管理器](/zh/nodejs/api/corepack#supported-package-managers)，Corepack 将确保对相关二进制文件的所有调用都针对请求的版本运行，并在需要时按需下载，如果无法成功检索，则中止。

您可以使用 [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) 命令来要求 Corepack 更新本地 `package.json` 文件，以使用您选择的包管理器：

```bash [BASH]
corepack use  # 在 package.json 中设置最新的 7.x 版本
corepack use yarn@* # 在 package.json 中设置最新的版本
```
### 升级全局版本 {#upgrading-the-global-versions}

当在现有项目之外运行（例如，运行 `yarn init` 时），Corepack 默认会使用预定义的版本，这些版本大致对应于每个工具的最新稳定版本。可以通过运行 [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) 命令以及您希望设置的包管理器版本来覆盖这些版本：

```bash [BASH]
corepack install --global 
```
或者，可以使用标签或范围：

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### 离线工作流 {#offline-workflow}

许多生产环境没有网络访问权限。由于 Corepack 通常直接从其注册表下载包管理器版本，因此它可能会与此类环境发生冲突。为避免这种情况发生，请在您仍然具有网络访问权限时（通常在准备部署映像时）调用 [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) 命令。这将确保即使没有网络访问权限，所需的包管理器仍然可用。

`pack` 命令有[各种标志](https://github.com/nodejs/corepack#utility-commands)。有关更多信息，请参阅详细的 [Corepack 文档](https://github.com/nodejs/corepack#readme)。


## 支持的包管理器 {#supported-package-managers}

以下二进制文件通过 Corepack 提供：

| 包管理器 | 二进制文件名 |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## 常见问题 {#common-questions}

### Corepack 如何与 npm 交互？ {#how-does-corepack-interact-with-npm?}

虽然 Corepack 可以像支持其他包管理器一样支持 npm，但它的 shim 默认情况下未启用。 这会产生一些后果：

- 始终可以在配置为使用另一个包管理器的项目中运行 `npm` 命令，因为 Corepack 无法拦截它。
- 虽然 `npm` 在 [`"packageManager"`](/zh/nodejs/api/packages#packagemanager) 属性中是一个有效的选项，但缺少 shim 会导致使用全局 npm。

### 运行 `npm install -g yarn` 不起作用 {#running-npm-install--g-yarn-doesnt-work}

npm 会阻止在进行全局安装时意外覆盖 Corepack 二进制文件。 为了避免这个问题，请考虑以下选项之一：

- 不要运行此命令； Corepack 无论如何都会提供包管理器二进制文件，并将确保始终提供请求的版本，因此不需要显式安装包管理器。
- 将 `--force` 标志添加到 `npm install`； 这将告诉 npm 可以覆盖二进制文件，但您会在此过程中擦除 Corepack 的二进制文件。（运行 [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) 将它们添加回来。）

