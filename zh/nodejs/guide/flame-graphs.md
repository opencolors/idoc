---
title: Node.js 性能优化中的火焰图
description: 了解如何创建火焰图来可视化 CPU 时间花费在函数中，并优化 Node.js 性能。
head:
  - - meta
    - name: og:title
      content: Node.js 性能优化中的火焰图 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何创建火焰图来可视化 CPU 时间花费在函数中，并优化 Node.js 性能。
  - - meta
    - name: twitter:title
      content: Node.js 性能优化中的火焰图 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何创建火焰图来可视化 CPU 时间花费在函数中，并优化 Node.js 性能。
---


# 火焰图

## 火焰图有什么用？

火焰图是一种可视化函数中花费的 CPU 时间的方式。它们可以帮助你确定在同步操作上花费过多时间的地方。

## 如何创建火焰图

你可能听说过为 Node.js 创建火焰图很困难，但事实并非如此（现在不是了）。不再需要 Solaris 虚拟机来生成火焰图了！

火焰图由 `perf` 输出生成，这不是一个特定于 Node 的工具。虽然它是可视化 CPU 时间花费的最强大的方式，但它可能在 Node.js 8 及更高版本中对 JavaScript 代码的优化存在问题。请参阅下面的 [perf 输出问题](#perf-output-issues) 部分。

### 使用预打包的工具
如果你想要一个可以在本地生成火焰图的单步操作，请尝试 [0x](https://www.npmjs.com/package/0x)

对于诊断生产环境部署，请阅读这些说明：[0x 生产服务器](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md)。

### 使用系统 perf 工具创建火焰图
本指南的目的是展示创建火焰图所涉及的步骤，并让你控制每个步骤。

如果你想更好地理解每个步骤，请查看后面的章节，在那里我们将更详细地介绍。

现在开始工作吧。

1. 安装 `perf`（如果尚未安装，通常可以通过 linux-tools-common 包获得）
2. 尝试运行 `perf` - 它可能会抱怨缺少内核模块，也安装它们
3. 运行启用 perf 的 node (有关特定于 Node.js 版本的提示，请参阅 [perf 输出问题](#perf-output-issues))
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. 忽略警告，除非它们说由于缺少软件包而无法运行 perf；你可能会收到一些关于无法访问内核模块样本的警告，你无论如何都不需要它们。
5. 运行 `perf script > perfs.out` 来生成你稍后将可视化的数据文件。应用一些清理以获得更易读的图表是很有用的
6. 如果尚未安装 stackvis，请安装它 `npm i -g stackvis`
7. 运行 `stackvis perf < perfs.out > flamegraph.htm`

现在在您喜欢的浏览器中打开火焰图文件并观看它燃烧。它是颜色编码的，因此您可以首先关注最饱和的橙色条。它们可能代表 CPU 密集型函数。

值得一提的是 - 如果你点击火焰图的元素，该元素周围环境的放大视图将显示在图表上方。


### 使用 `perf` 采样运行中的进程

这非常适合从一个正在运行的，你不想中断的进程中记录火焰图数据。想象一下，一个生产环境的进程出现了一个难以重现的问题。

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

`sleep 3` 是做什么用的？它的作用是保持 perf 运行 —— 尽管 `-p` 选项指向了不同的 pid，但该命令需要在进程上执行并随之结束。perf 在你传递给它的命令的生命周期内运行，无论你是否真的在分析该命令。`sleep 3` 确保 perf 运行 3 秒钟。

为什么 `-F`（分析频率）设置为 99？这是一个合理的默认值。你可以根据需要进行调整。`-F99` 告诉 perf 每秒采集 99 个样本，如果想要更高的精度，可以增加这个值。较低的值会产生较少的输出，但结果精度较低。你需要的精度取决于你的 CPU 密集型函数实际运行的时间。如果你正在寻找导致明显减速的原因，那么每秒 99 帧应该足够了。

在你获得 3 秒的 perf 记录后，按照上面的最后两个步骤生成火焰图。

### 过滤掉 Node.js 内部函数

通常，你只想查看你的调用的性能，因此过滤掉 Node.js 和 V8 内部函数可以使图形更容易阅读。你可以使用以下命令清理 perf 文件：

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

如果你阅读火焰图时发现有些奇怪，好像在占用大部分时间的关键函数中缺少了某些东西，请尝试不使用过滤器生成火焰图 —— 也许你遇到了 Node.js 本身问题的罕见情况。

### Node.js 的 profiling 选项

`--perf-basic-prof-only-functions` 和 `--perf-basic-prof` 这两个选项对于调试你的 JavaScript 代码非常有用。其他选项用于分析 Node.js 本身，这超出了本指南的范围。

`--perf-basic-prof-only-functions` 产生的输出较少，因此它是开销最小的选项。


### 为什么我需要它们？

嗯，如果没有这些选项，你仍然会得到火焰图，但大多数条都会被标记为 `v8::Function::Call`。

## `Perf` 输出问题

### Node.js 8.x V8 管道更改

Node.js 8.x 及以上版本对 V8 引擎中的 JavaScript 编译管道进行了新的优化，这使得有时 `perf` 无法访问函数名称/引用。（它被称为 Turbofan）

结果是，您可能无法在火焰图中正确获取您的函数名称。

您会注意到 `ByteCodeHandler:` 出现在您期望函数名称的地方。

0x 内置了一些缓解措施。

有关详细信息，请参见：
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x 使用 `--interpreted-frames-native-stack` 标志解决了 Turbofan 的问题。

运行 `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` 以在火焰图中获取函数名称，而不管 V8 使用哪个管道来编译您的 JavaScript。

### 火焰图中的标签损坏

如果您看到的标签看起来像这样

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

这意味着您使用的 Linux perf 没有使用 demangle 支持编译，例如，请参见 <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654>

## 示例

通过[火焰图练习](https://github.com/naugtur/node-example-flamegraph)自己练习捕获火焰图！

