---
title: npm 包管理器指南
description: 了解如何使用 npm 管理依赖项、安装和更新包以及在 Node.js 项目中运行任务。
head:
  - - meta
    - name: og:title
      content: npm 包管理器指南 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 npm 管理依赖项、安装和更新包以及在 Node.js 项目中运行任务。
  - - meta
    - name: twitter:title
      content: npm 包管理器指南 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 npm 管理依赖项、安装和更新包以及在 Node.js 项目中运行任务。
---


# npm 包管理器介绍

## npm 简介

`npm` 是 Node.js 的标准包管理器。

据报告，截至 2022 年 9 月，npm 注册表中列出了超过 210 万个包，使其成为地球上最大的单语言代码仓库，您可以确信（几乎！）所有东西都有一个包。

它最初是一种下载和管理 Node.js 包的依赖项的方式，但后来它也成为前端 JavaScript 中使用的工具。

::: tip
`Yarn` 和 `pnpm` 是 npm cli 的替代品。您也可以查看它们。
:::

## 包

### 安装所有依赖项

您可以通过运行以下命令来安装 `package.json` 文件中列出的所有依赖项：

```bash
npm install
```

它将安装项目所需的一切，在 `node_modules` 文件夹中，如果该文件夹不存在，则会创建它。

### 安装单个包

您可以通过运行以下命令来安装单个包：

```bash
npm install <包名>
```

此外，从 npm 5 开始，此命令会将 `<包名>` 添加到 `package.json` 文件依赖项中。在版本 5 之前，您需要添加 `--save` 标志。

通常，您会看到更多标志添加到此命令中：

+ `--save-dev` (或 `-D`) 将包添加到 `package.json` 文件的 `devDependencies` 部分。
+ `--no-save` 阻止将包保存到 `package.json` 文件。
+ `--no-optional` 阻止安装可选依赖项。
+ `--save-optional` 将包添加到 `package.json` 文件的 `optionalDependencies` 部分。

也可以使用标志的简写形式：

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

devDependencies 和 dependencies 之间的区别在于，前者包含开发工具，例如测试库，而后者与生产环境中的应用程序捆绑在一起。

至于 optionalDependencies，区别在于依赖项的构建失败不会导致安装失败。但是，您的程序有责任处理缺少依赖项的情况。阅读更多关于 [optional dependencies](https://docs.npmjs.com/cli/v10/using-npm/config#optional) 的信息。


### 更新包
通过运行以下命令可以轻松更新：

```bash
npm update
```

这将把所有依赖项更新到最新版本。

您也可以指定一个要更新的包：

```bash
npm update <package-name>
```

### 移除包

要移除一个包，您可以运行：

```bash
npm uninstall <package-name>
```

### 版本控制
除了简单的下载，`npm` 还管理版本控制，因此您可以指定包的任何特定版本，或者要求高于或低于您需要的版本。

很多时候，你会发现一个库只与另一个库的主要版本兼容。

或者一个库的最新版本中的一个错误，仍然没有修复，导致了一个问题。

指定库的显式版本也有助于使每个人都使用包的完全相同的版本，以便整个团队在 `package.json` 文件更新之前运行相同的版本。

在所有这些情况下，版本控制都非常有帮助，并且 `npm` 遵循 [语义化版本 (semver)](https://semver.org/) 标准。

您可以通过运行以下命令来安装包的特定版本：

```bash
npm install <package-name>@<version>
```

您还可以通过运行以下命令来安装包的最新版本：

```bash
npm install <package-name>@latest
```

### 运行任务
package.json 文件支持一种格式，用于指定可以使用以下命令运行的命令行任务

```bash
npm run <task-name>
```

例如，如果您有一个包含以下内容的 package.json 文件：

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

使用此功能来运行 Webpack 非常常见：

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

因此，您可以运行以下命令，而不是键入那些容易忘记或拼写错误的冗长命令：

```bash
npm run watch
npm run dev
npm run prod
```

