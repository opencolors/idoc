---
title: 优化 Node.js 性能
description: 了解如何分析 Node.js 进程以识别性能瓶颈并优化代码以提高效率和用户体验。
head:
  - - meta
    - name: og:title
      content: 优化 Node.js 性能 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何分析 Node.js 进程以识别性能瓶颈并优化代码以提高效率和用户体验。
  - - meta
    - name: twitter:title
      content: 优化 Node.js 性能 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何分析 Node.js 进程以识别性能瓶颈并优化代码以提高效率和用户体验。
---


# 性能不佳
在本文档中，您可以了解如何分析 Node.js 进程。

## 我的应用程序性能不佳

### 症状

我的应用程序延迟很高，并且我已经确认瓶颈不在于我的依赖项，例如数据库和下游服务。因此，我怀疑我的应用程序花费大量时间来运行代码或处理信息。

您对应用程序的整体性能感到满意，但希望了解可以改进应用程序的哪个部分，使其运行得更快或更高效。当我们想要改善用户体验或节省计算成本时，这会很有用。

### 调试
在这种用例中，我们对那些比其他代码段使用更多 CPU 周期的代码段感兴趣。当我们在本地执行此操作时，我们通常会尝试优化我们的代码。[使用 V8 采样分析器](/zh/nodejs/guide/profiling-nodejs-applications) 可以帮助我们做到这一点。

