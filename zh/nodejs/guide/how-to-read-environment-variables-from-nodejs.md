---
title: 如何在 Node.js 中读取环境变量
description: 了解如何使用 process.env 属性和 .env 文件在 Node.js 中访问环境变量。
head:
  - - meta
    - name: og:title
      content: 如何在 Node.js 中读取环境变量 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 process.env 属性和 .env 文件在 Node.js 中访问环境变量。
  - - meta
    - name: twitter:title
      content: 如何在 Node.js 中读取环境变量 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 process.env 属性和 .env 文件在 Node.js 中访问环境变量。
---


# 如何从 Node.js 中读取环境变量

Node.js 的 process 核心模块提供了一个 `env` 属性，该属性包含进程启动时设置的所有环境变量。

以下代码运行 `app.js` 并设置 `USER_ID` 和 `USER_KEY`。

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

这将传递用户 `USER_ID` 为 239482，`USER_KEY` 为 foobar。这适用于测试，但是对于生产环境，您可能需要配置一些 bash 脚本来导出变量。

::: tip NOTE
`process` 不需要 `"require"`，它是自动可用的。
:::

这是一个访问 `USER_ID` 和 `USER_KEY` 环境变量的示例，我们在上面的代码中设置了这些变量。

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

以同样的方式，您可以访问您设置的任何自定义环境变量。Node.js 20 引入了对 [`.env` 文件的实验性支持](/zh/nodejs/api/cli#env-file-config)。

现在，您可以使用 `--env-file` 标志在运行 Node.js 应用程序时指定一个环境文件。这是一个 `.env` 文件的示例，以及如何使用 `process.env` 访问其变量。

```bash
.env 文件
PORT=3000
```

在你的 js 文件中

```javascript
process.env.PORT; // 3000
```

使用 `.env` 文件中设置的环境变量运行 `app.js` 文件。

```js
node --env-file=.env app.js
```

此命令从 `.env` 文件加载所有环境变量，使其在 `process.env` 上可供应用程序使用。 此外，您可以传递多个 `--env-file` 参数。 后续文件会覆盖先前文件中定义的现有变量。

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
如果同一个变量在环境和文件中都有定义，则来自环境的值优先。
:::

