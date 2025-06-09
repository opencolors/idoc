---
title: Node.js 文档 - 国际化
description: Node.js 文档的这一部分介绍了国际化（Intl）模块，该模块提供了各种国际化和本地化功能的访问，包括排序、数字格式化、日期和时间格式化等。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 国际化 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 文档的这一部分介绍了国际化（Intl）模块，该模块提供了各种国际化和本地化功能的访问，包括排序、数字格式化、日期和时间格式化等。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 国际化 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 文档的这一部分介绍了国际化（Intl）模块，该模块提供了各种国际化和本地化功能的访问，包括排序、数字格式化、日期和时间格式化等。
---


# 国际化支持 {#internationalization-support}

Node.js 拥有许多功能，可以更轻松地编写国际化的程序。 其中一些是：

- [ECMAScript 语言规范](https://tc39.github.io/ecma262/) 中的区域设置敏感或支持 Unicode 的函数：
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- [ECMAScript 国际化 API 规范](https://tc39.github.io/ecma402/) (又名 ECMA-402) 中描述的所有功能：
    - [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) 对象
    - 区域设置敏感的方法，例如 [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 和 [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- [WHATWG URL 解析器](/zh/nodejs/api/url#the-whatwg-url-api) 的[国际化域名](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDN) 支持
- [`require('node:buffer').transcode()`](/zh/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- 更准确的 [REPL](/zh/nodejs/api/repl#repl) 行编辑
- [`require('node:util').TextDecoder`](/zh/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Unicode 属性转义](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js 和底层的 V8 引擎使用 [Unicode 国际组件 (ICU)](http://site.icu-project.org/) 在原生 C/C++ 代码中实现这些功能。 完整的 ICU 数据集默认由 Node.js 提供。 但是，由于 ICU 数据文件的大小，因此提供了几个选项，用于在构建或运行 Node.js 时自定义 ICU 数据集。


## 构建 Node.js 的选项 {#options-for-building-nodejs}

为了控制 ICU 在 Node.js 中的使用方式，在编译期间有四个 `configure` 选项可用。有关如何编译 Node.js 的更多详细信息，请参见 [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md)。

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (默认)

每个 `configure` 选项可用的 Node.js 和 JavaScript 功能概述：

| 功能 | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | 无 (函数是空操作) | 完整 | 完整 | 完整 |
| `String.prototype.to*Case()` | 完整 | 完整 | 完整 | 完整 |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | 无 (对象不存在) | 部分/完整 (取决于操作系统) | 部分 (仅限英语) | 完整 |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | 部分 (不感知区域设置) | 完整 | 完整 | 完整 |
| `String.prototype.toLocale*Case()` | 部分 (不感知区域设置) | 完整 | 完整 | 完整 |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | 部分 (不感知区域设置) | 部分/完整 (取决于操作系统) | 部分 (仅限英语) | 完整 |
| `Date.prototype.toLocale*String()` | 部分 (不感知区域设置) | 部分/完整 (取决于操作系统) | 部分 (仅限英语) | 完整 |
| [旧版 URL 解析器](/zh/nodejs/api/url#legacy-url-api) | 部分 (不支持 IDN) | 完整 | 完整 | 完整 |
| [WHATWG URL 解析器](/zh/nodejs/api/url#the-whatwg-url-api) | 部分 (不支持 IDN) | 完整 | 完整 | 完整 |
| [`require('node:buffer').transcode()`](/zh/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | 无 (函数不存在) | 完整 | 完整 | 完整 |
| [REPL](/zh/nodejs/api/repl#repl) | 部分 (不准确的行编辑) | 完整 | 完整 | 完整 |
| [`require('node:util').TextDecoder`](/zh/nodejs/api/util#class-utiltextdecoder) | 部分 (基本编码支持) | 部分/完整 (取决于操作系统) | 部分 (仅限 Unicode) | 完整 |
| [`RegExp` Unicode 属性转义](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | 无 (无效的 `RegExp` 错误) | 完整 | 完整 | 完整 |

“(不感知区域设置)”的 designation 表示该函数执行其操作，就像该函数的非 `Locale` 版本（如果存在）一样。 例如，在 `none` 模式下，`Date.prototype.toLocaleString()` 的操作与 `Date.prototype.toString()` 的操作相同。


### 禁用所有国际化特性 (`none`) {#disable-all-internationalization-features-none}

如果选择此选项，ICU 将被禁用，并且上述提到的大部分国际化特性将在生成的 `node` 二进制文件中**不可用**。

### 使用预安装的 ICU 构建 (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js 可以链接到系统上已安装的 ICU 构建。事实上，大多数 Linux 发行版已经安装了 ICU，此选项可以重用操作系统中其他组件使用的数据集。

仅需要 ICU 库本身的功能，例如 [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 和 [WHATWG URL 解析器](/zh/nodejs/api/url#the-whatwg-url-api)，在 `system-icu` 下完全支持。 还需要 ICU 区域设置数据的功能，例如 [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) *可能*被完全或部分支持，具体取决于系统上安装的 ICU 数据的完整性。

### 嵌入有限的 ICU 数据 (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

此选项使生成的二进制文件静态链接到 ICU 库，并在 `node` 可执行文件中包含 ICU 数据的子集（通常仅为英语区域设置）。

仅需要 ICU 库本身的功能，例如 [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 和 [WHATWG URL 解析器](/zh/nodejs/api/url#the-whatwg-url-api)，在 `small-icu` 下完全支持。 还需要 ICU 区域设置数据的功能，例如 [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)，通常只适用于英语区域设置：

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// 在 small-icu 上打印 "M01" 或 "January"，具体取决于用户的默认区域设置
// 应该打印 "enero"
```
此模式在特性和二进制文件大小之间取得了平衡。


#### 在运行时提供 ICU 数据 {#providing-icu-data-at-runtime}

如果使用了 `small-icu` 选项，仍然可以在运行时提供额外的语言环境数据，以便 JS 方法能够适用于所有 ICU 语言环境。假设数据文件存储在 `/runtime/directory/with/dat/file`，则可以通过以下方式使其可用于 ICU：

- `--with-icu-default-data-dir` 配置选项：这仅将默认数据目录路径嵌入到二进制文件中。实际的数据文件将在运行时从此目录路径加载。
- [`NODE_ICU_DATA`](/zh/nodejs/api/cli#node_icu_datafile) 环境变量：
- [`--icu-data-dir`](/zh/nodejs/api/cli#--icu-data-dirfile) CLI 参数：

当指定了多个选项时，`--icu-data-dir` CLI 参数的优先级最高，其次是 `NODE_ICU_DATA` 环境变量，然后是 `--with-icu-default-data-dir` 配置选项。

ICU 能够自动查找和加载各种数据格式，但数据必须适合 ICU 版本，并且文件名必须正确。数据文件最常见的名称是 `icudtX[bl].dat`，其中 `X` 表示预期的 ICU 版本，`b` 或 `l` 表示系统的字节序。如果无法从指定目录读取预期的数据文件，Node.js 将无法加载。与当前 Node.js 版本对应的数据文件的名称可以使用以下方法计算：

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```

请查阅 ICU 用户指南中的 ["ICU Data"](http://userguide.icu-project.org/icudata) 文章，以获取其他支持的格式和有关 ICU 数据的更多详细信息。

[full-icu](https://www.npmjs.com/package/full-icu) npm 模块可以通过检测正在运行的 `node` 可执行文件的 ICU 版本并下载相应的数据文件来大大简化 ICU 数据的安装。通过 `npm i full-icu` 安装该模块后，数据文件将在 `./node_modules/full-icu` 中可用。然后，可以将此路径传递给 `NODE_ICU_DATA` 或 `--icu-data-dir`，如上所示，以启用完整的 `Intl` 支持。


### 嵌入整个 ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

此选项使生成的二进制文件静态链接 ICU 并包含完整的 ICU 数据集。以这种方式创建的二进制文件没有进一步的外部依赖项，并支持所有区域设置，但可能相当大。如果没有传递 `--with-intl` 标志，这是默认行为。官方二进制文件也是在这种模式下构建的。

## 检测国际化支持 {#detecting-internationalization-support}

要验证是否启用了 ICU（`system-icu`、`small-icu` 或 `full-icu`），只需检查 `Intl` 是否存在即可：

```js [ESM]
const hasICU = typeof Intl === 'object';
```
或者，检查 `process.versions.icu` 也可以，这是一个仅在启用 ICU 时定义的属性：

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
要检查是否支持非英语区域设置（即 `full-icu` 或 `system-icu`），[`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) 可以是一个很好的区分因素：

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
对于更详细的 `Intl` 支持测试，以下资源可能会有所帮助：

- [btest402](https://github.com/srl295/btest402): 通常用于检查 Node.js 的 `Intl` 支持是否正确构建。
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): ECMAScript 的官方一致性测试套件包含一个专门针对 ECMA-402 的部分。

