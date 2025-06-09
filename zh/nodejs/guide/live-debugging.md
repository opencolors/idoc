---
title: Node.js 实时调试
description: 学习如何实时调试 Node.js 进程，以识别和解决应用逻辑和正确性问题。
head:
  - - meta
    - name: og:title
      content: Node.js 实时调试 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 学习如何实时调试 Node.js 进程，以识别和解决应用逻辑和正确性问题。
  - - meta
    - name: twitter:title
      content: Node.js 实时调试 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 学习如何实时调试 Node.js 进程，以识别和解决应用逻辑和正确性问题。
---


# 实时调试

本文档将介绍如何实时调试 Node.js 进程。

## 我的应用程序行为异常

### 症状

用户可能会观察到应用程序对于某些输入没有提供预期的输出，例如，一个 HTTP 服务器返回的 JSON 响应中某些字段为空。在这个过程中可能会出现各种问题，但在这个用例中，我们主要关注应用程序的逻辑及其正确性。

### 调试

在这种情况下，用户想要了解我们的应用程序对于某个触发器（例如传入的 HTTP 请求）执行的代码路径。他们可能还想逐步执行代码并控制执行过程，以及检查变量在内存中保存的值。为此，我们可以在启动应用程序时使用 `--inspect` 标志。调试文档可以在[这里](/zh/nodejs/guide/debugging-nodejs)找到。

