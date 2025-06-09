---
title: 发布 Node-API 包
description: 了解如何发布 Node-API 版本的包与非 Node-API 版本并行，以及如何在包中引入 Node-API 版本的依赖。
head:
  - - meta
    - name: og:title
      content: 发布 Node-API 包 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何发布 Node-API 版本的包与非 Node-API 版本并行，以及如何在包中引入 Node-API 版本的依赖。
  - - meta
    - name: twitter:title
      content: 发布 Node-API 包 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何发布 Node-API 版本的包与非 Node-API 版本并行，以及如何在包中引入 Node-API 版本的依赖。
---


# 如何发布 Node-API 包

## 如何同时发布一个包的 Node-API 版本和非 Node-API 版本

以下步骤使用 `iotivity-node` 包进行说明：

- 首先，发布非 Node-API 版本：
    - 更新 `package.json` 中的版本。对于 `iotivity-node`，版本变为 1.2.0-2。
    - 完成发布清单（确保测试/演示/文档都 OK）。
    - `npm publish`。

- 然后，发布 Node-API 版本：
    - 更新 `package.json` 中的版本。对于 `iotivity-node`，版本变为 1.2.0-3。对于版本控制，我们建议遵循 [semver.org](https://semver.org) 描述的预发布版本方案，例如 1.2.0-napi。
    - 完成发布清单（确保测试/演示/文档都 OK）。
    - `npm publish --tag n-api`。

在这个例子中，使用 `n-api` 标记发布确保了，尽管版本 1.2.0-3 比已发布的非 Node-API 版本 (1.2.0-2) 更新，但如果有人选择简单地运行 `npm install iotivity-node` 来安装 `iotivity-node`，它将不会被安装。默认情况下，这将安装非 Node-API 版本。用户必须运行 `npm install iotivity-node@n-api` 才能接收 Node-API 版本。有关将标签与 npm 结合使用的更多信息，请查看 "Using dist-tags"。

## 如何引入对包的 Node-API 版本的依赖

要添加 `iotivity-node` 的 Node-API 版本作为依赖项，`package.json` 将如下所示：

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

如 "Using dist-tags" 中所述，与常规版本不同，标记版本不能通过 `package.json` 中的版本范围（例如 `"^2.0.0"`）来寻址。原因是该标签恰好引用一个版本。因此，如果包维护者选择使用相同的标签标记包的更高版本，则 `npm update` 将接收到更高版本。除了最新发布的版本之外，这应该是可以接受的版本，`package.json` 依赖项必须引用确切的版本，如下所示：

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
