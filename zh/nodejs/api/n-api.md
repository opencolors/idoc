---
title: Node.js N-API 文档
description: N-API（Node.js API）为原生插件提供了一个稳定且一致的接口，使开发者能够创建跨不同Node.js版本兼容的模块。
head:
  - - meta
    - name: og:title
      content: Node.js N-API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: N-API（Node.js API）为原生插件提供了一个稳定且一致的接口，使开发者能够创建跨不同Node.js版本兼容的模块。
  - - meta
    - name: twitter:title
      content: Node.js N-API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: N-API（Node.js API）为原生插件提供了一个稳定且一致的接口，使开发者能够创建跨不同Node.js版本兼容的模块。
---


# Node-API {#node-api}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

Node-API（以前称为 N-API）是一个用于构建原生插件的 API。它独立于底层 JavaScript 运行时（例如，V8），并且作为 Node.js 本身的一部分进行维护。此 API 在 Node.js 的各个版本中将保持应用程序二进制接口 (ABI) 的稳定。它的目的是使插件免受底层 JavaScript 引擎更改的影响，并允许为一个主要版本编译的模块在更高版本的 Node.js 上运行而无需重新编译。[ABI 稳定性](https://nodejs.org/en/docs/guides/abi-stability/) 指南提供了更深入的解释。

插件的构建/打包方法与 [C++ 插件](/zh/nodejs/api/addons) 章节中概述的方法/工具相同。唯一的区别是原生代码使用的 API 集。可以使用 Node-API 中提供的函数，而不是使用 V8 或 [Node.js 的原生抽象](https://github.com/nodejs/nan) API。

Node-API 公开的 API 通常用于创建和操作 JavaScript 值。概念和操作通常映射到 ECMA-262 语言规范中指定的概念。这些 API 具有以下属性：

- 所有 Node-API 调用都返回 `napi_status` 类型的状态码。此状态指示 API 调用是成功还是失败。
- API 的返回值通过 out 参数传递。
- 所有 JavaScript 值都抽象在名为 `napi_value` 的不透明类型后面。
- 如果出现错误状态码，可以使用 `napi_get_last_error_info` 获取更多信息。有关更多信息，请参见错误处理章节 [错误处理](/zh/nodejs/api/n-api#error-handling)。

Node-API 是一个 C API，可确保 Node.js 版本和不同编译器级别之间的 ABI 稳定性。C++ API 可能更容易使用。为了支持使用 C++，该项目维护一个名为 [`node-addon-api`](https://github.com/nodejs/node-addon-api) 的 C++ 包装模块。此包装器提供了一个可内联的 C++ API。使用 `node-addon-api` 构建的二进制文件将依赖于 Node.js 导出的基于 Node-API C 的函数的符号。`node-addon-api` 是一种更有效的方式来编写调用 Node-API 的代码。例如，考虑以下 `node-addon-api` 代码。第一部分显示 `node-addon-api` 代码，第二部分显示插件中实际使用的代码。

```C++ [C++]
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```
```C++ [C++]
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```
最终结果是，插件仅使用导出的 C API。因此，它仍然可以获得 C API 提供的 ABI 稳定性带来的好处。

当使用 `node-addon-api` 而不是 C API 时，首先查看 `node-addon-api` 的 API [文档](https://github.com/nodejs/node-addon-api#api-documentation)。

[Node-API 资源](https://nodejs.github.io/node-addon-examples/) 为刚开始使用 Node-API 和 `node-addon-api` 的开发者提供了出色的指导和技巧。可以在 [Node-API 媒体](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md) 页面上找到其他媒体资源。


## ABI 稳定性的影响 {#implications-of-abi-stability}

尽管 Node-API 提供了 ABI 稳定性保证，但 Node.js 的其他部分则没有，并且从插件使用的任何外部库也可能没有。 特别是，以下任何 API 都不能保证跨主要版本的 ABI 稳定性：

- 通过以下方式可用的 Node.js C++ API
- libuv API，它也包含在 Node.js 中，并通过以下方式提供
- 通过以下方式可用的 V8 API

因此，为了使插件在 Node.js 主要版本之间保持 ABI 兼容性，它必须专门使用 Node-API，方法是限制自己使用

```C [C]
#include <node_api.h>
```
并通过检查它使用的所有外部库，确保外部库做出与 Node-API 类似的 ABI 稳定性保证。

## 构建 {#building}

与用 JavaScript 编写的模块不同，使用 Node-API 开发和部署 Node.js 原生插件需要一组额外的工具。 除了开发 Node.js 所需的基本工具外，原生插件开发人员还需要一个可以将 C 和 C++ 代码编译为二进制文件的工具链。 此外，根据原生插件的部署方式，原生插件的 *用户* 也需要安装 C/C++ 工具链。

对于 Linux 开发人员，必要的 C/C++ 工具链软件包很容易获得。[GCC](https://gcc.gnu.org/) 广泛用于 Node.js 社区，以在各种平台上构建和测试。 对于许多开发人员来说，[LLVM](https://llvm.org/) 编译器基础设施也是一个不错的选择。

对于 Mac 开发人员，[Xcode](https://developer.apple.com/xcode/) 提供了所有必需的编译器工具。 但是，没有必要安装整个 Xcode IDE。 以下命令安装必要的工具链：

```bash [BASH]
xcode-select --install
```
对于 Windows 开发人员，[Visual Studio](https://visualstudio.microsoft.com/) 提供了所有必需的编译器工具。 但是，没有必要安装整个 Visual Studio IDE。 以下命令安装必要的工具链：

```bash [BASH]
npm install --global windows-build-tools
```
以下各节描述了可用于开发和部署 Node.js 原生插件的其他工具。


### 构建工具 {#build-tools}

这里列出的工具都要求原生插件的*用户*安装 C/C++ 工具链，才能成功安装原生插件。

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) 是一个基于 Google [GYP](https://gyp.gsrc.io/) 工具的 [gyp-next](https://github.com/nodejs/gyp-next) 分支的构建系统，并且与 npm 捆绑在一起。 GYP，以及 node-gyp，需要安装 Python。

从历史上看，node-gyp 一直是构建原生插件的首选工具。 它被广泛采用并拥有完善的文档。 但是，一些开发者在使用 node-gyp 时遇到了限制。

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) 是一个基于 [CMake](https://cmake.org/) 的替代构建系统。

对于已经使用 CMake 的项目，或者受到 node-gyp 限制影响的开发者，CMake.js 是一个不错的选择。 [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) 是一个基于 CMake 的原生插件项目的示例。

### 上传预编译的二进制文件 {#uploading-precompiled-binaries}

这里列出的三种工具允许原生插件的开发者和维护者创建二进制文件并将其上传到公共或私有服务器。 这些工具通常与 CI/CD 构建系统（如 [Travis CI](https://travis-ci.org/) 和 [AppVeyor](https://www.appveyor.com/)）集成，以构建和上传适用于各种平台和架构的二进制文件。 然后，用户可以下载这些二进制文件，而无需安装 C/C++ 工具链。

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) 是一个基于 node-gyp 的工具，它添加了将二进制文件上传到开发者选择的服务器的功能。 node-pre-gyp 对将二进制文件上传到 Amazon S3 具有特别好的支持。

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) 是一个支持使用 node-gyp 或 CMake.js 构建的工具。 与支持各种服务器的 node-pre-gyp 不同，prebuild 仅将二进制文件上传到 [GitHub releases](https://help.github.com/en/github/administering-a-repository/about-releases)。 prebuild 是使用 CMake.js 的 GitHub 项目的理想选择。


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) 是一个基于 node-gyp 的工具。prebuildify 的优点是，构建的二进制文件在上传到 npm 时会与原生插件捆绑在一起。这些二进制文件从 npm 下载，并在安装原生插件后立即供模块用户使用。

## 用法 {#usage}

为了使用 Node-API 函数，请包含文件 [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h)，该文件位于 node 开发树的 src 目录中：

```C [C]
#include <node_api.h>
```
这将选择加入给定 Node.js 版本的默认 `NAPI_VERSION`。为了确保与特定版本的 Node-API 兼容，可以在包含头文件时显式指定版本：

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
这将把 Node-API 表面限制为仅在指定的（和更早的）版本中可用的功能。

一些 Node-API 表面是实验性的，需要显式选择加入：

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
在这种情况下，包括任何实验性 API 在内的整个 API 表面都将可用于模块代码。

有时，会引入影响已发布和稳定 API 的实验性功能。可以通过选择退出禁用这些功能：

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
其中 `\<FEATURE_NAME\>` 是影响实验性和稳定 API 的实验性功能的名称。

## Node-API 版本矩阵 {#node-api-version-matrix}

在 9 版本之前，Node-API 版本是累加的，并且与 Node.js 无关。这意味着任何版本都是先前版本的扩展，因为它具有先前版本中的所有 API 以及一些附加功能。每个 Node.js 版本仅支持单个 Node-API 版本。例如，v18.15.0 仅支持 Node-API 版本 8。实现 ABI 稳定性的原因是 8 是所有先前版本的严格超集。

从版本 9 开始，虽然 Node-API 版本继续独立版本化，但在 Node-API 版本 9 上运行的插件可能需要代码更新才能在 Node-API 版本 10 上运行。但是，由于支持高于 8 的 Node-API 版本的 Node.js 版本将支持 8 到它们支持的最高版本之间的所有版本，并且除非插件选择加入更高的 Node-API 版本，否则默认提供版本 8 API，因此保持了 ABI 稳定性。这种方法提供了更好地优化现有 Node-API 函数的灵活性，同时保持 ABI 稳定性。现有的插件可以使用早期版本的 Node-API 继续运行而无需重新编译。如果插件需要来自较新 Node-API 版本的功能，则无论如何都需要更改现有代码并重新编译才能使用这些新函数。

在支持 Node-API 版本 9 及更高版本的 Node.js 版本中，定义 `NAPI_VERSION=X` 并使用现有的插件初始化宏会将运行时使用的请求的 Node-API 版本烘焙到插件中。如果未设置 `NAPI_VERSION`，它将默认为 8。

此表在旧版本流中可能不是最新的，最新信息位于最新的 API 文档中：[Node-API 版本矩阵](/zh/nodejs/api/n-api#node-api-version-matrix)

| Node-API 版本 | 支持的版本 |
| --- | --- |
| 9 | v18.17.0+, 20.3.0+, 21.0.0 及所有后续版本 |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 及所有后续版本 |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 及所有后续版本 |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 及所有后续版本 |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 及所有后续版本 |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 及所有后续版本 |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 及所有后续版本 |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 及所有后续版本 |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 及所有后续版本 |
* Node-API 是实验性的。

** Node.js 8.0.0 包括 Node-API 作为实验性的。它作为 Node-API 版本 1 发布，但一直发展到 Node.js 8.6.0。在 Node.js 8.6.0 之前的版本中，API 是不同的。我们建议使用 Node-API 版本 3 或更高版本。

每个为 Node-API 记录的 API 都有一个名为 `added in:` 的标头，而稳定的 API 将具有额外的标头 `Node-API version:`。当使用支持 `Node-API version:` 中显示的 Node-API 版本或更高版本的 Node.js 版本时，API 可以直接使用。当使用不支持列出的 `Node-API version:` 的 Node.js 版本时，或者如果没有列出 `Node-API version:`，那么只有在 `#define NAPI_EXPERIMENTAL` 位于 `node_api.h` 或 `js_native_api.h` 的包含之前，API 才可用。如果某个 API 似乎在比 `added in:` 中显示的 Node.js 版本更新的版本上不可用，那么这很可能是导致明显缺失的原因。

与从本机代码访问 ECMAScript 功能严格相关的 Node-API 可以在 `js_native_api.h` 和 `js_native_api_types.h` 中单独找到。这些头文件中定义的 API 包含在 `node_api.h` 和 `node_api_types.h` 中。这些头文件的结构方式是为了允许在 Node.js 之外实现 Node-API。对于这些实现，Node.js 特定的 API 可能不适用。

可以将插件的 Node.js 特定的部分与将实际功能公开给 JavaScript 环境的代码分开，以便后者可以与 Node-API 的多个实现一起使用。在下面的示例中，`addon.c` 和 `addon.h` 仅引用 `js_native_api.h`。这确保了 `addon.c` 可以重复使用，以针对 Node-API 的 Node.js 实现或 Node.js 之外的任何 Node-API 实现进行编译。

`addon_node.c` 是一个单独的文件，其中包含 Node.js 特定的插件入口点，并在插件加载到 Node.js 环境中时通过调用 `addon.c` 来实例化插件。

```C [C]
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```
```C [C]
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```
```C [C]
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## 环境生命周期 API {#environment-life-cycle-apis}

[ECMAScript 语言规范](https://tc39.github.io/ecma262/)的[第 8.7 节](https://tc39.es/ecma262/#sec-agents)定义了“代理”的概念，即 JavaScript 代码运行的自包含环境。 进程可以并发或按顺序启动和终止多个此类代理。

Node.js 环境对应于 ECMAScript 代理。 在主进程中，环境在启动时创建，并且可以在单独的线程上创建其他环境以用作[工作线程](https://nodejs.org/api/worker_threads)。 当 Node.js 嵌入到另一个应用程序中时，应用程序的主线程也可能在应用程序进程的生命周期内多次构造和销毁 Node.js 环境，以便应用程序创建的每个 Node.js 环境反过来可以在其生命周期内创建和销毁作为工作线程的附加环境。

从原生插件的角度来看，这意味着它提供的绑定可能会被多次调用，来自多个上下文，甚至可能从多个线程并发调用。

原生插件可能需要分配全局状态，它们在 Node.js 环境的生命周期中使用该状态，以便该状态对于插件的每个实例都是唯一的。

为此，Node-API 提供了一种关联数据的方法，以便其生命周期与 Node.js 环境的生命周期相关联。

### `napi_set_instance_data` {#napi_set_instance_data}

**新增于: v12.8.0, v10.20.0**

**N-API 版本: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] data`: 要提供给此实例绑定的数据项。
- `[in] finalize_cb`: 在环境被销毁时调用的函数。 该函数接收 `data`，以便它可以释放它。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_hint`: 可选提示，用于在垃圾回收期间传递给 finalize 回调。

如果 API 成功，则返回 `napi_ok`。

此 API 将 `data` 与当前正在运行的 Node.js 环境相关联。 以后可以使用 `napi_get_instance_data()` 检索 `data`。 与当前正在运行的 Node.js 环境关联的任何现有数据（通过先前调用 `napi_set_instance_data()` 设置）将被覆盖。 如果先前的调用提供了 `finalize_cb`，则不会调用它。


### `napi_get_instance_data` {#napi_get_instance_data}

**加入于: v12.8.0, v10.20.0**

**N-API 版本: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: 调用 Node-API 的环境。
- `[out] data`: 先前通过调用 `napi_set_instance_data()` 与当前运行的 Node.js 环境关联的数据项。

如果 API 成功，则返回 `napi_ok`。

此 API 检索先前通过 `napi_set_instance_data()` 与当前运行的 Node.js 环境关联的数据。 如果未设置数据，则调用将成功，并且 `data` 将设置为 `NULL`。

## 基本 Node-API 数据类型 {#basic-node-api-data-types}

Node-API 公开以下基本数据类型作为各种 API 使用的抽象。 这些 API 应被视为不透明的，仅能通过其他 Node-API 调用进行内省。

### `napi_status` {#napi_status}

**加入于: v8.0.0**

**N-API 版本: 1**

指示 Node-API 调用成功或失败的整数状态码。 目前，支持以下状态码。

```C [C]
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* 未使用 */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
如果 API 返回失败状态时需要其他信息，可以通过调用 `napi_get_last_error_info` 获取。

### `napi_extended_error_info` {#napi_extended_error_info}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: UTF8 编码的字符串，其中包含 VM 中立的错误描述。
- `engine_reserved`: 保留用于 VM 特定的错误详细信息。 目前，这尚未在任何 VM 中实现。
- `engine_error_code`: VM 特定的错误代码。 目前，这尚未在任何 VM 中实现。
- `error_code`: 源于上次错误的 Node-API 状态代码。

有关其他信息，请参阅[错误处理](/zh/nodejs/api/n-api#error-handling)部分。


### `napi_env` {#napi_env}

`napi_env` 用于表示一个上下文，底层 Node-API 实现可以使用它来持久化 VM 特定的状态。这个结构体在调用原生函数时会传递给原生函数，并且在进行 Node-API 调用时必须传递回来。具体来说，在初始原生函数调用时传入的同一个 `napi_env` 必须传递给任何后续嵌套的 Node-API 调用。不允许缓存 `napi_env` 以便一般重用，也不允许在运行在不同 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程上的同一个插件实例之间传递 `napi_env`。当原生插件的实例卸载时，`napi_env` 将变为无效。此事件的通知通过提供给 [`napi_add_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_env_cleanup_hook) 和 [`napi_set_instance_data`](/zh/nodejs/api/n-api#napi_set_instance_data) 的回调函数传递。

### `node_api_basic_env` {#node_api_basic_env}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

`napi_env` 的这个变体传递给同步终结器（[`node_api_basic_finalize`](/zh/nodejs/api/n-api#node_api_basic_finalize)）。有一部分 Node-API 接受类型为 `node_api_basic_env` 的参数作为它们的第一个参数。这些 API 不访问 JavaScript 引擎的状态，因此可以安全地从同步终结器中调用。允许将类型为 `napi_env` 的参数传递给这些 API，但是，不允许将类型为 `node_api_basic_env` 的参数传递给访问 JavaScript 引擎状态的 API。如果不进行类型转换就尝试这样做，在编译附加组件时，如果使用了会导致它们在将不正确的指针类型传递给函数时发出警告和/或错误的标志，则会产生编译器警告或错误。从同步终结器调用此类 API 最终将导致应用程序终止。

### `napi_value` {#napi_value}

这是一个不透明的指针，用于表示 JavaScript 值。


### `napi_threadsafe_function` {#napi_threadsafe_function}

**加入于: v10.6.0**

**N-API 版本: 4**

这是一个不透明的指针，表示一个 JavaScript 函数，可以通过 `napi_call_threadsafe_function()` 从多个线程异步调用它。

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**加入于: v10.6.0**

**N-API 版本: 4**

一个传递给 `napi_release_threadsafe_function()` 的值，用于指示是否立即关闭线程安全函数 (`napi_tsfn_abort`)，或者仅仅释放它 (`napi_tsfn_release`)，使其可以通过 `napi_acquire_threadsafe_function()` 和 `napi_call_threadsafe_function()` 供后续使用。

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**加入于: v10.6.0**

**N-API 版本: 4**

一个传递给 `napi_call_threadsafe_function()` 的值，用于指示当与线程安全函数关联的队列已满时，调用是否应该阻塞。

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Node-API 内存管理类型 {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

这是一种抽象，用于控制和修改在特定作用域内创建的对象的生命周期。 通常，Node-API 值是在句柄作用域的上下文中创建的。 当从 JavaScript 调用本机方法时，将存在默认的句柄作用域。 如果用户没有显式创建新的句柄作用域，则 Node-API 值将在默认的句柄作用域中创建。 对于在执行本机方法之外的代码的任何调用（例如，在 libuv 回调调用期间），模块需要在调用任何可能导致创建 JavaScript 值的函数之前创建一个作用域。

句柄作用域使用 [`napi_open_handle_scope`](/zh/nodejs/api/n-api#napi_open_handle_scope) 创建，并使用 [`napi_close_handle_scope`](/zh/nodejs/api/n-api#napi_close_handle_scope) 销毁。 关闭作用域可以向 GC 指示在句柄作用域的生命周期内创建的所有 `napi_value` 都不再从当前堆栈帧引用。

有关更多详细信息，请查看[对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management)。


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

可逃逸句柄作用域是一种特殊类型的句柄作用域，用于将特定句柄作用域内创建的值返回给父作用域。

#### `napi_ref` {#napi_ref}

**Added in: v8.0.0**

**N-API version: 1**

这是一个用于引用 `napi_value` 的抽象。它允许用户管理 JavaScript 值的生命周期，包括显式定义它们的最小生命周期。

有关更多详细信息，请查看[对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management)。

#### `napi_type_tag` {#napi_type_tag}

**Added in: v14.8.0, v12.19.0**

**N-API version: 8**

一个 128 位的数值，存储为两个无符号 64 位整数。它充当 UUID，可用于“标记”JavaScript 对象或 [externals](/zh/nodejs/api/n-api#napi_create_external)，以确保它们属于某种类型。这比 [`napi_instanceof`](/zh/nodejs/api/n-api#napi_instanceof) 检查更严格，因为如果对象的原型已被篡改，后者可能会报告误报。类型标记与 [`napi_wrap`](/zh/nodejs/api/n-api#napi_wrap) 结合使用时最有用，因为它确保从包装对象检索的指针可以安全地转换为先前应用于 JavaScript 对象的类型标记对应的本机类型。

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Added in: v14.10.0, v12.19.0**

一个不透明的值，由 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook) 返回。当异步清理事件链完成时，必须将其传递给 [`napi_remove_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_remove_async_cleanup_hook)。

### Node-API 回调类型 {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Added in: v8.0.0**

**N-API version: 1**

传递给回调函数的不透明数据类型。它可用于获取有关调用回调的上下文的其他信息。

#### `napi_callback` {#napi_callback}

**Added in: v8.0.0**

**N-API version: 1**

用户提供的本机函数的功能指针类型，这些函数将通过 Node-API 公开给 JavaScript。回调函数应满足以下签名：

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
除非出于[对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management)中讨论的原因，否则在 `napi_callback` 内部创建句柄和/或回调作用域是不必要的。


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**添加于: v21.6.0, v20.12.0, v18.20.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

函数指针类型，用于插件提供的函数，允许用户在外部拥有的数据准备好被清理时收到通知，因为与其关联的对象已被垃圾回收。用户必须提供满足以下签名的函数，该函数将在对象被回收时调用。目前，`node_api_basic_finalize` 可用于找出何时收集具有外部数据的对象。

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
除非在[对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management)中讨论的原因，否则在函数体内创建句柄和/或回调作用域是不必要的。

由于这些函数可能会在 JavaScript 引擎处于无法执行 JavaScript 代码的状态时被调用，因此只能调用将 `node_api_basic_env` 作为其第一个参数的 Node-API。 [`node_api_post_finalizer`](/zh/nodejs/api/n-api#node_api_post_finalizer) 可用于安排需要访问 JavaScript 引擎状态的 Node-API 调用，以便在当前垃圾回收周期完成后运行。

在 [`node_api_create_external_string_latin1`](/zh/nodejs/api/n-api#node_api_create_external_string_latin1) 和 [`node_api_create_external_string_utf16`](/zh/nodejs/api/n-api#node_api_create_external_string_utf16) 的情况下，`env` 参数可能为空，因为外部字符串可能会在环境关闭的后期阶段被收集。

变更历史：

-  实验性 (`NAPI_EXPERIMENTAL`): 只能调用将 `node_api_basic_env` 作为其第一个参数的 Node-API 调用，否则应用程序将以适当的错误消息终止。可以通过定义 `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` 来关闭此功能。


#### `napi_finalize` {#napi_finalize}

**添加于: v8.0.0**

**N-API 版本: 1**

附加组件提供的函数指针类型，允许用户安排一组 Node-API 调用，以响应垃圾回收事件，在垃圾回收周期完成后执行。 这些函数指针可以与 [`node_api_post_finalizer`](/zh/nodejs/api/n-api#node_api_post_finalizer) 一起使用。

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
变更历史:

- 实验性 (定义了 `NAPI_EXPERIMENTAL`): 这种类型的函数不再可以用作终结器，除非与 [`node_api_post_finalizer`](/zh/nodejs/api/n-api#node_api_post_finalizer) 一起使用。 必须使用 [`node_api_basic_finalize`](/zh/nodejs/api/n-api#node_api_basic_finalize) 代替。 可以通过定义 `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` 来关闭此功能。

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**添加于: v8.0.0**

**N-API 版本: 1**

与支持异步操作的函数一起使用的函数指针。 回调函数必须满足以下签名：

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
此函数的实现必须避免进行执行 JavaScript 或与 JavaScript 对象交互的 Node-API 调用。 Node-API 调用应放在 `napi_async_complete_callback` 中。 不要使用 `napi_env` 参数，因为它很可能导致 JavaScript 的执行。

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**添加于: v8.0.0**

**N-API 版本: 1**

与支持异步操作的函数一起使用的函数指针。 回调函数必须满足以下签名：

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
除非出于 [对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management) 中讨论的原因，否则在函数体内创建句柄和/或回调范围没有必要。


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**新增于: v10.6.0**

**N-API 版本: 4**

用于异步线程安全函数调用的函数指针。该回调将在主线程上被调用。其目的是使用通过队列从辅助线程到达的数据项来构建调用 JavaScript 所需的参数，通常通过 `napi_call_function`，然后调用 JavaScript。

通过队列从辅助线程到达的数据在 `data` 参数中给出，要调用的 JavaScript 函数在 `js_callback` 参数中给出。

Node-API 在调用此回调之前设置环境，因此通过 `napi_call_function` 调用 JavaScript 函数就足够了，而无需通过 `napi_make_callback`。

回调函数必须满足以下签名：

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: 用于 API 调用的环境，如果线程安全函数正在被拆卸并且 `data` 可能需要被释放，则为 `NULL`。
- `[in] js_callback`: 要调用的 JavaScript 函数，如果线程安全函数正在被拆卸并且 `data` 可能需要被释放，则为 `NULL`。如果创建线程安全函数时没有 `js_callback`，则它也可能为 `NULL`。
- `[in] context`: 创建线程安全函数时使用的可选数据。
- `[in] data`: 由辅助线程创建的数据。回调有责任将此原生数据转换为 JavaScript 值（使用 Node-API 函数），这些值可以在调用 `js_callback` 时作为参数传递。此指针完全由线程和此回调管理。因此，此回调应释放数据。

除非由于 [对象生命周期管理](/zh/nodejs/api/n-api#object-lifetime-management) 中讨论的原因，否则在函数体内创建句柄和/或回调范围不是必需的。


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**添加于: v19.2.0, v18.13.0**

**N-API 版本: 3**

与 [`napi_add_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_env_cleanup_hook) 一起使用的函数指针。 它将在环境被销毁时调用。

回调函数必须满足以下签名：

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: 传递给 [`napi_add_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_env_cleanup_hook) 的数据。

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**添加于: v14.10.0, v12.19.0**

与 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook) 一起使用的函数指针。 它将在环境被销毁时调用。

回调函数必须满足以下签名：

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: 在异步清理完成后必须传递给 [`napi_remove_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_remove_async_cleanup_hook) 的句柄。
- `[in] data`: 传递给 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook) 的数据。

函数体应启动异步清理操作，在异步清理操作结束时，必须在调用 [`napi_remove_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_remove_async_cleanup_hook) 时传入 `handle`。

## 错误处理 {#error-handling}

Node-API 使用返回值和 JavaScript 异常进行错误处理。 以下章节将解释每种情况的处理方法。

### 返回值 {#return-values}

所有 Node-API 函数都共享相同的错误处理模式。 所有 API 函数的返回类型都是 `napi_status`。

如果请求成功并且没有抛出未捕获的 JavaScript 异常，则返回值将为 `napi_ok`。 如果发生错误并且抛出了异常，则将返回错误的 `napi_status` 值。 如果抛出了异常，但没有发生错误，则将返回 `napi_pending_exception`。

如果返回了 `napi_ok` 或 `napi_pending_exception` 之外的返回值，则必须调用 [`napi_is_exception_pending`](/zh/nodejs/api/n-api#napi_is_exception_pending) 来检查是否存在待处理的异常。 有关更多详细信息，请参见有关异常的部分。

可能的 `napi_status` 值的完整集合在 `napi_api_types.h` 中定义。

`napi_status` 返回值提供了所发生错误的与 VM 无关的表示形式。 在某些情况下，能够获得更详细的信息（包括表示错误的字符串以及 VM（引擎）特定的信息）很有用。

为了检索此信息，提供了 [`napi_get_last_error_info`](/zh/nodejs/api/n-api#napi_get_last_error_info)，它返回一个 `napi_extended_error_info` 结构。 `napi_extended_error_info` 结构的格式如下：

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: 发生的错误的文本表示形式。
- `engine_reserved`: 仅保留供引擎使用的不透明句柄。
- `engine_error_code`: VM 特定的错误代码。
- `error_code`: 上次错误的 Node-API 状态代码。

[`napi_get_last_error_info`](/zh/nodejs/api/n-api#napi_get_last_error_info) 返回上次 Node-API 调用所产生的信息。

不要依赖于任何扩展信息的内容或格式，因为它不受 SemVer 的约束，并且可能随时更改。 它仅用于日志记录。


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: 调用 API 的环境。
- `[out] result`: 包含有关错误的更多信息的 `napi_extended_error_info` 结构体。

如果 API 成功，则返回 `napi_ok`。

此 API 检索一个 `napi_extended_error_info` 结构体，其中包含有关发生的最后一个错误的信息。

返回的 `napi_extended_error_info` 的内容仅在同一个 `env` 上调用 Node-API 函数之前有效。 这包括对 `napi_is_exception_pending` 的调用，因此通常需要复制信息以便以后使用。 `error_message` 中返回的指针指向静态定义的字符串，因此如果您已将其从 `error_message` 字段（将被覆盖）复制出来，则可以安全地使用该指针，然后再调用另一个 Node-API 函数。

不要依赖任何扩展信息的内容或格式，因为它不受 SemVer 的约束，并且可能随时更改。 它仅用于记录目的。

即使存在挂起的 JavaScript 异常，也可以调用此 API。

### 异常 {#exceptions}

任何 Node-API 函数调用都可能导致挂起的 JavaScript 异常。 对于任何 API 函数都是如此，即使是那些可能不会导致执行 JavaScript 的函数。

如果函数返回的 `napi_status` 是 `napi_ok`，则没有挂起的异常，也不需要采取其他操作。 如果返回的 `napi_status` 不是 `napi_ok` 或 `napi_pending_exception`，为了尝试恢复并继续而不是立即返回，必须调用 [`napi_is_exception_pending`](/zh/nodejs/api/n-api#napi_is_exception_pending) 以确定是否挂起异常。

在许多情况下，当调用 Node-API 函数并且已存在挂起的异常时，该函数将立即返回 `napi_pending_exception` 的 `napi_status`。 但是，并非所有函数都是这种情况。 Node-API 允许调用一部分函数，以便在返回到 JavaScript 之前进行一些最少的清理。 在这种情况下，`napi_status` 将反映该函数的状态。 它不会反映以前挂起的异常。 为了避免混淆，请在每次函数调用后检查错误状态。

当异常挂起时，可以使用两种方法之一。

第一种方法是进行任何适当的清理，然后返回，以便执行返回到 JavaScript。 作为返回到 JavaScript 的一部分，异常将在 JavaScript 代码中调用本机方法的位置引发。 在异常挂起时，大多数 Node-API 调用的行为是未指定的，并且许多调用将简单地返回 `napi_pending_exception`，因此请尽可能少地执行操作，然后返回到可以处理异常的 JavaScript。

第二种方法是尝试处理异常。 在某些情况下，本机代码可以捕获异常，采取适当的措施，然后继续。 仅在已知可以安全处理异常的特定情况下才建议这样做。 在这些情况下，可以使用 [`napi_get_and_clear_last_exception`](/zh/nodejs/api/n-api#napi_get_and_clear_last_exception) 来获取并清除异常。 成功后，result 将包含指向最后一个 JavaScript `Object` 的句柄。 如果在检索异常后确定仍然无法处理异常，则可以使用 [`napi_throw`](/zh/nodejs/api/n-api#napi_throw) 重新抛出异常，其中 error 是要抛出的 JavaScript 值。

如果本机代码需要引发异常或确定 `napi_value` 是否为 JavaScript `Error` 对象的实例，还可以使用以下实用程序函数：[`napi_throw_error`](/zh/nodejs/api/n-api#napi_throw_error)、[`napi_throw_type_error`](/zh/nodejs/api/n-api#napi_throw_type_error)、[`napi_throw_range_error`](/zh/nodejs/api/n-api#napi_throw_range_error)、[`node_api_throw_syntax_error`](/zh/nodejs/api/n-api#node_api_throw_syntax_error) 和 [`napi_is_error`](/zh/nodejs/api/n-api#napi_is_error)。

如果本机代码需要创建 `Error` 对象，还可以使用以下实用程序函数：[`napi_create_error`](/zh/nodejs/api/n-api#napi_create_error)、[`napi_create_type_error`](/zh/nodejs/api/n-api#napi_create_type_error)、[`napi_create_range_error`](/zh/nodejs/api/n-api#napi_create_range_error) 和 [`node_api_create_syntax_error`](/zh/nodejs/api/n-api#node_api_create_syntax_error)，其中 result 是指向新创建的 JavaScript `Error` 对象的 `napi_value`。

Node.js 项目正在将错误代码添加到内部生成的所有错误。 目标是让应用程序使用这些错误代码进行所有错误检查。 关联的错误消息将保留，但仅用于日志记录和显示，并期望消息可以在没有 SemVer 应用的情况下进行更改。 为了在 Node-API 中支持此模型，无论是在内部功能中还是对于模块特定功能（因为这是很好的做法），`throw_` 和 `create_` 函数都采用可选的代码参数，该参数是将添加到错误对象的代码的字符串。 如果可选参数为 `NULL`，则不会将任何代码与错误关联。 如果提供了代码，则与错误关联的名称也会更新为：

```text [TEXT]
originalName [code]
```
其中 `originalName` 是与错误关联的原始名称，`code` 是提供的代码。 例如，如果代码是 `'ERR_ERROR_1'` 并且正在创建 `TypeError`，则名称将是：

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: 调用 API 的环境。
- `[in] error`: 要抛出的 JavaScript 值。

如果 API 成功，则返回 `napi_ok`。

此 API 抛出提供的 JavaScript 值。

#### `napi_throw_error` {#napi_throw_error}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: 调用 API 的环境。
- `[in] code`: 要在错误上设置的可选错误代码。
- `[in] msg`: 表示要与错误关联的文本的 C 字符串。

如果 API 成功，则返回 `napi_ok`。

此 API 抛出一个带有提供的文本的 JavaScript `Error`。

#### `napi_throw_type_error` {#napi_throw_type_error}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: 调用 API 的环境。
- `[in] code`: 要在错误上设置的可选错误代码。
- `[in] msg`: 表示要与错误关联的文本的 C 字符串。

如果 API 成功，则返回 `napi_ok`。

此 API 抛出一个带有提供的文本的 JavaScript `TypeError`。

#### `napi_throw_range_error` {#napi_throw_range_error}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: 调用 API 的环境。
- `[in] code`: 要在错误上设置的可选错误代码。
- `[in] msg`: 表示要与错误关联的文本的 C 字符串。

如果 API 成功，则返回 `napi_ok`。

此 API 抛出一个带有提供的文本的 JavaScript `RangeError`。


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**新增于: v17.2.0, v16.14.0**

**N-API 版本: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: API 在其下调用的环境。
- `[in] code`: 要在错误中设置的可选错误代码。
- `[in] msg`: C 字符串，表示要与错误关联的文本。

如果 API 成功，则返回 `napi_ok`。

此 API 抛出一个包含所提供文本的 JavaScript `SyntaxError`。

#### `napi_is_error` {#napi_is_error}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] value`: 要检查的 `napi_value`。
- `[out] result`: 布尔值，如果 `napi_value` 表示错误，则设置为 true，否则设置为 false。

如果 API 成功，则返回 `napi_ok`。

此 API 查询一个 `napi_value` 以检查它是否表示一个错误对象。

#### `napi_create_error` {#napi_create_error}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] code`: 可选的 `napi_value`，包含要与错误关联的错误代码的字符串。
- `[in] msg`: `napi_value`，它引用一个 JavaScript `string`，该字符串将用作 `Error` 的消息。
- `[out] result`: 表示所创建错误的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个包含所提供文本的 JavaScript `Error`。

#### `napi_create_type_error` {#napi_create_type_error}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] code`: 可选的 `napi_value`，包含要与错误关联的错误代码的字符串。
- `[in] msg`: `napi_value`，它引用一个 JavaScript `string`，该字符串将用作 `Error` 的消息。
- `[out] result`: 表示所创建错误的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个包含所提供文本的 JavaScript `TypeError`。


#### `napi_create_range_error` {#napi_create_range_error}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] code`: 可选的 `napi_value`，其中包含要与错误关联的错误代码字符串。
- `[in] msg`: `napi_value`，引用 JavaScript `string`，用作 `Error` 的消息。
- `[out] result`: `napi_value`，表示创建的错误。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个 JavaScript `RangeError`，其中包含提供的文本。

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**添加于: v17.2.0, v16.14.0**

**N-API 版本: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] code`: 可选的 `napi_value`，其中包含要与错误关联的错误代码字符串。
- `[in] msg`: `napi_value`，引用 JavaScript `string`，用作 `Error` 的消息。
- `[out] result`: `napi_value`，表示创建的错误。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个 JavaScript `SyntaxError`，其中包含提供的文本。

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[out] result`: 如果存在待处理的异常，则为该异常；否则为 `NULL`。

如果 API 成功，则返回 `napi_ok`。

即使存在待处理的 JavaScript 异常，也可以调用此 API。


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: 调用 API 所处的环境。
- `[out] result`: 如果存在待处理的异常，则设置为 true 的布尔值。

如果 API 成功，则返回 `napi_ok`。

即使存在待处理的 JavaScript 异常，也可以调用此 API。

#### `napi_fatal_exception` {#napi_fatal_exception}

**添加于: v9.10.0**

**N-API 版本: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: 调用 API 所处的环境。
- `[in] err`: 传递给 `'uncaughtException'` 的错误。

在 JavaScript 中触发 `'uncaughtException'`。 如果异步回调抛出异常且无法恢复，则很有用。

### 致命错误 {#fatal-errors}

如果在原生插件中发生无法恢复的错误，则可以抛出致命错误以立即终止进程。

#### `napi_fatal_error` {#napi_fatal_error}

**添加于: v8.2.0**

**N-API 版本: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: 发生错误的可选位置。
- `[in] location_len`: 位置的字节长度，如果以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[in] message`: 与错误关联的消息。
- `[in] message_len`: 消息的字节长度，如果以 null 结尾，则为 `NAPI_AUTO_LENGTH`。

函数调用不会返回，进程将被终止。

即使存在待处理的 JavaScript 异常，也可以调用此 API。

## 对象生命周期管理 {#object-lifetime-management}

当进行 Node-API 调用时，底层 VM 的堆中对象的句柄可能会作为 `napi_values` 返回。 这些句柄必须保持对象“活动”，直到原生代码不再需要它们，否则对象可能会在原生代码完成使用之前被回收。

当返回对象句柄时，它们与“作用域”相关联。 默认作用域的生命周期与原生方法调用的生命周期相关联。 结果是，默认情况下，句柄保持有效，并且与这些句柄关联的对象将在原生方法调用的生命周期内保持活动状态。

然而，在许多情况下，有必要使句柄的有效期比原生方法的生命周期更短或更长。 以下各节描述了可用于更改句柄生命周期（从默认值）的 Node-API 函数。


### 使句柄的生命周期短于原生方法 {#making-handle-lifespan-shorter-than-that-of-the-native-method}

通常有必要使句柄的生命周期短于原生方法的生命周期。例如，考虑一个原生方法，它有一个循环，循环遍历一个大型数组中的元素：

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // 对元素进行一些操作
}
```

这将导致创建大量的句柄，消耗大量的资源。此外，即使原生代码只能使用最近的句柄，所有关联的对象也会保持活动状态，因为它们都共享相同的范围。

为了处理这种情况，Node-API 提供了建立新“范围”的能力，新创建的句柄将与该范围关联。一旦不再需要这些句柄，就可以“关闭”该范围，并且与该范围关联的任何句柄都将失效。 可用于打开/关闭范围的方法是 [`napi_open_handle_scope`](/zh/nodejs/api/n-api#napi_open_handle_scope) 和 [`napi_close_handle_scope`](/zh/nodejs/api/n-api#napi_close_handle_scope)。

Node-API 仅支持单个嵌套的范围层次结构。任何时候都只有一个活动范围，并且所有新句柄都将在该范围处于活动状态时与其关联。 范围必须以与打开顺序相反的顺序关闭。 此外，在从原生方法返回之前，必须关闭在该方法中创建的所有范围。

以前面的示例为例，添加对 [`napi_open_handle_scope`](/zh/nodejs/api/n-api#napi_open_handle_scope) 和 [`napi_close_handle_scope`](/zh/nodejs/api/n-api#napi_close_handle_scope) 的调用将确保在整个循环执行过程中最多只有一个句柄有效：

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // 对元素进行一些操作
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```

当嵌套作用域时，在某些情况下，来自内部作用域的句柄需要超出该作用域的生命周期。 Node-API 支持“可逃逸作用域”以支持这种情况。 可逃逸作用域允许“提升”一个句柄，使其“逃逸”当前作用域，并且句柄的生命周期从当前作用域更改为外部作用域的生命周期。

可用于打开/关闭可逃逸范围的方法是 [`napi_open_escapable_handle_scope`](/zh/nodejs/api/n-api#napi_open_escapable_handle_scope) 和 [`napi_close_escapable_handle_scope`](/zh/nodejs/api/n-api#napi_close_escapable_handle_scope)。

提升句柄的请求通过 [`napi_escape_handle`](/zh/nodejs/api/n-api#napi_escape_handle) 发出，该请求只能调用一次。


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: 调用 API 时所处的环境。
- `[out] result`: `napi_value`，表示新的作用域。

如果 API 成功执行，则返回 `napi_ok`。

此 API 打开一个新的作用域。

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: 调用 API 时所处的环境。
- `[in] scope`: `napi_value`，表示要关闭的作用域。

如果 API 成功执行，则返回 `napi_ok`。

此 API 关闭传入的作用域。作用域必须以与创建顺序相反的顺序关闭。

即使存在挂起的 JavaScript 异常，也可以调用此 API。

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: 调用 API 时所处的环境。
- `[out] result`: `napi_value`，表示新的作用域。

如果 API 成功执行，则返回 `napi_ok`。

此 API 打开一个新的作用域，从中可以将一个对象提升到外部作用域。

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: 调用 API 时所处的环境。
- `[in] scope`: `napi_value`，表示要关闭的作用域。

如果 API 成功执行，则返回 `napi_ok`。

此 API 关闭传入的作用域。作用域必须以与创建顺序相反的顺序关闭。

即使存在挂起的 JavaScript 异常，也可以调用此 API。


#### `napi_escape_handle` {#napi_escape_handle}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] scope`: 代表当前作用域的 `napi_value`。
- `[in] escapee`: 代表要转义的 JavaScript `Object` 的 `napi_value`。
- `[out] result`: 代表外部作用域中转义的 `Object` 的句柄的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 提升 JavaScript 对象的句柄，使其在外部作用域的生命周期内有效。 每个作用域只能调用一次。 如果多次调用它，将返回错误。

即使存在挂起的 JavaScript 异常，也可以调用此 API。

### 对生命周期长于本机方法的值的引用 {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

在某些情况下，插件需要能够创建和引用生命周期长于单个本机方法调用的值。 例如，要创建一个构造函数，然后在创建实例的请求中使用该构造函数，必须可以在许多不同的实例创建请求中引用该构造函数对象。 使用前面部分中描述的作为 `napi_value` 返回的普通句柄，这是不可能的。 普通句柄的生命周期由作用域管理，所有作用域必须在本机方法结束前关闭。

Node-API 提供了创建对值的持久引用的方法。 目前，Node-API 仅允许为有限的值类型集创建引用，包括对象、外部、函数和符号。

每个引用都有一个关联的计数，值为 0 或更高，这决定了引用是否会保持相应值的活动状态。 计数为 0 的引用不会阻止值的收集。 对象（对象、函数、外部）和符号类型的值正在成为“弱”引用，并且在未收集时仍然可以访问。 任何大于 0 的计数都将阻止值的收集。

符号值具有不同的风格。 真正的弱引用行为仅受使用 `napi_create_symbol` 函数或 JavaScript `Symbol()` 构造函数调用创建的本地符号支持。 使用 `node_api_symbol_for` 函数或 JavaScript `Symbol.for()` 函数调用创建的全局注册符号始终保持强引用，因为垃圾回收器不会收集它们。 对于诸如 `Symbol.iterator` 之类的众所周知的符号也是如此。 垃圾回收器也永远不会收集它们。

可以使用初始引用计数创建引用。 然后可以通过 [`napi_reference_ref`](/zh/nodejs/api/n-api#napi_reference_ref) 和 [`napi_reference_unref`](/zh/nodejs/api/n-api#napi_reference_unref) 修改计数。 如果在引用的计数为 0 时收集了一个对象，则后续所有获取与引用关联的对象的调用 [`napi_get_reference_value`](/zh/nodejs/api/n-api#napi_get_reference_value) 将为返回的 `napi_value` 返回 `NULL`。 尝试为对象已被收集的引用调用 [`napi_reference_ref`](/zh/nodejs/api/n-api#napi_reference_ref) 会导致错误。

一旦插件不再需要引用，就必须删除它们。 删除引用后，它将不再阻止收集相应的对象。 未能删除持久引用会导致“内存泄漏”，持久引用的本机内存和堆上对应的对象都将被永久保留。

可以创建多个引用同一对象的持久引用，每个引用都将基于其各自的计数来保持对象的活动状态。 对同一对象的多个持久引用可能导致意外地保持本机内存的活动状态。 持久引用的本机结构必须保持活动状态，直到执行被引用对象的终结器。 如果为同一对象创建了新的持久引用，则不会运行该对象的终结器，并且不会释放早期持久引用指向的本机内存。 可以通过在可能的情况下调用 `napi_delete_reference` 以及 `napi_reference_unref` 来避免这种情况。

**变更历史:**

- 实验性 (`NAPI_EXPERIMENTAL` 已定义): 可以为所有值类型创建引用。 新支持的值类型不支持弱引用语义，并且这些类型的值在引用计数变为 0 时释放，并且无法再从引用访问。


#### `napi_create_reference` {#napi_create_reference}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要为其创建引用的 `napi_value`。
- `[in] initial_refcount`: 新引用的初始引用计数。
- `[out] result`: 指向新引用的 `napi_ref`。

如果 API 成功，则返回 `napi_ok`。

此 API 使用指定的引用计数为传入的值创建一个新引用。

#### `napi_delete_reference` {#napi_delete_reference}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: API 被调用的环境。
- `[in] ref`: 要删除的 `napi_ref`。

如果 API 成功，则返回 `napi_ok`。

此 API 删除传入的引用。

即使存在挂起的 JavaScript 异常，也可以调用此 API。

#### `napi_reference_ref` {#napi_reference_ref}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: API 被调用的环境。
- `[in] ref`: 要增加引用计数的 `napi_ref`。
- `[out] result`: 新的引用计数。

如果 API 成功，则返回 `napi_ok`。

此 API 增加传入引用的引用计数，并返回结果引用计数。

#### `napi_reference_unref` {#napi_reference_unref}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: API 被调用的环境。
- `[in] ref`: 要减少引用计数的 `napi_ref`。
- `[out] result`: 新的引用计数。

如果 API 成功，则返回 `napi_ok`。

此 API 减少传入引用的引用计数，并返回结果引用计数。


#### `napi_get_reference_value` {#napi_get_reference_value}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] ref`: 要请求相应值的 `napi_ref`。
- `[out] result`: `napi_ref` 引用的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

如果仍然有效，此 API 将返回表示与 `napi_ref` 关联的 JavaScript 值的 `napi_value`。 否则，结果将为 `NULL`。

### 在当前 Node.js 环境退出时清理 {#cleanup-on-exit-of-the-current-nodejs-environment}

虽然 Node.js 进程通常在退出时释放其所有资源，但 Node.js 的嵌入器或未来的 Worker 支持可能需要插件注册清理钩子，这些钩子将在当前 Node.js 环境退出后运行。

Node-API 提供了用于注册和取消注册此类回调的函数。 当这些回调运行时，插件持有的所有资源都应该被释放。

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**添加于: v10.2.0**

**N-API 版本: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
将 `fun` 注册为在当前 Node.js 环境退出时使用 `arg` 参数运行的函数。

可以安全地使用不同的 `arg` 值多次指定一个函数。 在这种情况下，它也会被多次调用。 不允许多次提供相同的 `fun` 和 `arg` 值，这会导致进程中止。

钩子将以相反的顺序被调用，即最近添加的钩子将首先被调用。

可以使用 [`napi_remove_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_remove_env_cleanup_hook) 删除此钩子。 通常，当为此钩子添加的资源无论如何都要被拆除时，就会发生这种情况。

对于异步清理，可以使用 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook)。


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**添加于: v10.2.0**

**N-API 版本: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
取消注册 `fun`，使其不再作为函数在当前 Node.js 环境退出时使用 `arg` 参数运行。参数和函数值都需要完全匹配。

该函数必须最初已通过 `napi_add_env_cleanup_hook` 注册，否则进程将中止。

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v14.10.0, v12.19.0 | 更改了 `hook` 回调的签名。 |
| v14.8.0, v12.19.0 | 添加于: v14.8.0, v12.19.0 |
:::

**N-API 版本: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: 调用 API 的环境。
- `[in] hook`: 在环境拆卸时调用的函数指针。 类型为 [`napi_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_async_cleanup_hook)。
- `[in] arg`: 在调用 `hook` 时传递给它的指针。
- `[out] remove_handle`: 指向异步清理钩子的可选句柄。

注册 `hook`，它是一个 [`napi_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_async_cleanup_hook) 类型的函数，作为在当前 Node.js 环境退出时使用 `remove_handle` 和 `arg` 参数运行的函数。

与 [`napi_add_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_env_cleanup_hook) 不同，允许钩子是异步的。

否则，行为通常与 [`napi_add_env_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_env_cleanup_hook) 的行为相匹配。

如果 `remove_handle` 不是 `NULL`，则会在其中存储一个不透明的值，稍后必须将其传递给 [`napi_remove_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_remove_async_cleanup_hook)，无论钩子是否已被调用。 通常，当要拆卸为其添加此钩子的资源时，会发生这种情况。


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.10.0, v12.19.0 | 移除 `env` 参数。 |
| v14.8.0, v12.19.0 | 添加于: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: 要移除的异步清理钩子的句柄，该钩子使用 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook) 创建。

取消注册与 `remove_handle` 对应的清理钩子。 这将阻止钩子被执行，除非它已经开始执行。 必须对从 [`napi_add_async_cleanup_hook`](/zh/nodejs/api/n-api#napi_add_async_cleanup_hook) 获取的任何 `napi_async_cleanup_hook_handle` 值调用此函数。

### Node.js 环境退出时的最终化 {#finalization-on-the-exit-of-the-nodejs-environment}

Node.js 环境可能会在尽可能早的时间被任意关闭，同时禁止 JavaScript 执行，例如在 [`worker.terminate()`](/zh/nodejs/api/worker_threads#workerterminate) 的请求下。 当环境被关闭时，JavaScript 对象的已注册 `napi_finalize` 回调、线程安全函数和环境实例数据会被立即且独立地调用。

`napi_finalize` 回调的调用安排在手动注册的清理钩子之后。 为了确保在环境关闭期间附加组件最终化的正确顺序，以避免在 `napi_finalize` 回调中出现 use-after-free 错误，附加组件应使用 `napi_add_env_cleanup_hook` 和 `napi_add_async_cleanup_hook` 注册一个清理钩子，以便以正确的顺序手动释放已分配的资源。

## 模块注册 {#module-registration}

Node-API 模块的注册方式与其他模块类似，不同之处在于，它使用以下内容而不是 `NODE_MODULE` 宏：

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
下一个不同之处在于 `Init` 方法的签名。 对于 Node-API 模块，其签名如下：

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
来自 `Init` 的返回值被视为模块的 `exports` 对象。 为了方便起见，`Init` 方法通过 `exports` 参数传递一个空对象。 如果 `Init` 返回 `NULL`，则作为 `exports` 传递的参数由模块导出。 Node-API 模块无法修改 `module` 对象，但可以将任何内容指定为模块的 `exports` 属性。

要将方法 `hello` 添加为一个函数，以便可以将其作为附加组件提供的方法调用：

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```
要设置一个函数，使其由附加组件的 `require()` 返回：

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
要定义一个类，以便可以创建新实例（通常与 [对象包装](/zh/nodejs/api/n-api#object-wrap) 一起使用）：

```C [C]
// 注意：部分示例，并非所有引用的代码都包含在内
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```
你也可以使用 `NAPI_MODULE_INIT` 宏，它充当 `NAPI_MODULE` 的简写，并定义一个 `Init` 函数：

```C [C]
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```
参数 `env` 和 `exports` 被提供给 `NAPI_MODULE_INIT` 宏的主体。

所有 Node-API 附加组件都是上下文感知的，这意味着它们可以被多次加载。 在声明此类模块时，需要考虑一些设计因素。 有关 [上下文感知附加组件](/zh/nodejs/api/addons#context-aware-addons) 的文档提供了更多详细信息。

变量 `env` 和 `exports` 将在宏调用之后的函数体内部可用。

有关在对象上设置属性的更多详细信息，请参阅 [使用 JavaScript 属性](/zh/nodejs/api/n-api#working-with-javascript-properties) 部分。

有关通常构建附加组件模块的更多详细信息，请参阅现有的 API。


## 使用 JavaScript 值 {#working-with-javascript-values}

Node-API 公开了一组 API 来创建所有类型的 JavaScript 值。 其中一些类型记录在 [ECMAScript 语言规范](https://tc39.github.io/ecma262/)的 [第 6 节](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) 中。

从根本上说，这些 API 用于执行以下操作之一：

Node-API 值由类型 `napi_value` 表示。 任何需要 JavaScript 值的 Node-API 调用都会传入一个 `napi_value`。 在某些情况下，API 会预先检查 `napi_value` 的类型。 但是，为了获得更好的性能，调用者最好确保所讨论的 `napi_value` 是 API 期望的 JavaScript 类型。

### 枚举类型 {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**添加于: v13.7.0, v12.17.0, v10.20.0**

**N-API 版本: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
描述 `键/属性` 过滤器枚举：

`napi_key_collection_mode` 限制了收集属性的范围。

`napi_key_own_only` 将收集的属性限制为仅给定的对象。 `napi_key_include_prototypes` 将包括对象原型链的所有键。

#### `napi_key_filter` {#napi_key_filter}

**添加于: v13.7.0, v12.17.0, v10.20.0**

**N-API 版本: 6**

```C [C]
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```
属性过滤器位。 它们可以进行或运算来构建复合过滤器。

#### `napi_key_conversion` {#napi_key_conversion}

**添加于: v13.7.0, v12.17.0, v10.20.0**

**N-API 版本: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` 会将整数索引转换为字符串。 `napi_key_keep_numbers` 将为整数索引返回数字。

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // ES6 类型 (对应于 typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```
描述 `napi_value` 的类型。 这通常对应于 ECMAScript 语言规范的 [第 6.1 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) 中描述的类型。 除了该部分中的类型之外，`napi_valuetype` 还可以表示带有外部数据的 `Function` 和 `Object`。

`napi_external` 类型的 JavaScript 值在 JavaScript 中显示为普通对象，这样就无法在其上设置任何属性，也没有原型。


#### `napi_typedarray_type` {#napi_typedarray_type}

```C [C]
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
```
这表示 `TypedArray` 的底层二进制标量数据类型。此枚举的元素对应于 [ECMAScript 语言规范](https://tc39.github.io/ecma262/) 的[第 22.2 节](https://tc39.github.io/ecma262/#sec-typedarray-objects)。

### 对象创建函数 {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: 调用 Node-API 的环境。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `Array`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个 Node-API 值，该值对应于 JavaScript `Array` 类型。JavaScript 数组在 ECMAScript 语言规范的[第 22.1 节](https://tc39.github.io/ecma262/#sec-array-objects)中进行了描述。

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] length`: `Array` 的初始长度。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `Array`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个 Node-API 值，该值对应于 JavaScript `Array` 类型。`Array` 的 length 属性设置为传入的 length 参数。但是，不能保证底层缓冲区在创建数组时由 VM 预先分配。该行为留给底层 VM 实现。如果缓冲区必须是可以经由 C 直接读取和/或写入的连续内存块，请考虑使用 [`napi_create_external_arraybuffer`](/zh/nodejs/api/n-api#napi_create_external_arraybuffer)。

JavaScript 数组在 ECMAScript 语言规范的[第 22.1 节](https://tc39.github.io/ecma262/#sec-array-objects)中进行了描述。


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] length`: 要创建的数组缓冲区的长度，以字节为单位。
- `[out] data`: 指向 `ArrayBuffer` 的底层字节缓冲区的指针。可以通过传递 `NULL` 来选择性地忽略 `data`。
- `[out] result`: 一个表示 JavaScript `ArrayBuffer` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回对应于 JavaScript `ArrayBuffer` 的 Node-API 值。 `ArrayBuffer` 用于表示固定长度的二进制数据缓冲区。它们通常用作 `TypedArray` 对象的后备缓冲区。分配的 `ArrayBuffer` 将具有一个底层字节缓冲区，其大小由传入的 `length` 参数确定。底层缓冲区可以选择性地返回给调用者，以防调用者想要直接操作该缓冲区。只能从本机代码直接写入此缓冲区。要从 JavaScript 写入此缓冲区，需要创建一个类型化数组或 `DataView` 对象。

JavaScript `ArrayBuffer` 对象在 ECMAScript 语言规范的 [第 24.1 节](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) 中进行了描述。

#### `napi_create_buffer` {#napi_create_buffer}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] size`: 底层缓冲区的大小，以字节为单位。
- `[out] data`: 指向底层缓冲区的原始指针。可以通过传递 `NULL` 来选择性地忽略 `data`。
- `[out] result`: 一个表示 `node::Buffer` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 分配一个 `node::Buffer` 对象。虽然这仍然是一个完全支持的数据结构，但在大多数情况下，使用 `TypedArray` 就足够了。


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: API 在其下调用的环境。
- `[in] size`: 输入缓冲区的大小（以字节为单位）（应与新缓冲区的大小相同）。
- `[in] data`: 指向要复制的底层缓冲区的原始指针。
- `[out] result_data`: 指向新的 `Buffer` 的底层数据缓冲区的指针。 可以选择通过传递 `NULL` 来忽略 `result_data`。
- `[out] result`: 一个 `napi_value`，表示一个 `node::Buffer`。

如果 API 成功，则返回 `napi_ok`。

此 API 分配一个 `node::Buffer` 对象，并使用从传入缓冲区复制的数据对其进行初始化。 虽然这仍然是完全支持的数据结构，但在大多数情况下，使用 `TypedArray` 就足够了。

#### `napi_create_date` {#napi_create_date}

**添加于: v11.11.0, v10.17.0**

**N-API 版本: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] time`: 自 1970 年 1 月 1 日 UTC 以来经过的 ECMAScript 时间值，以毫秒为单位。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `Date`。

如果 API 成功，则返回 `napi_ok`。

此 API 不观察闰秒； 它们会被忽略，因为 ECMAScript 与 POSIX 时间规范对齐。

此 API 分配一个 JavaScript `Date` 对象。

JavaScript `Date` 对象在 ECMAScript 语言规范的[第 20.3 节](https://tc39.github.io/ecma262/#sec-date-objects)中描述。

#### `napi_create_external` {#napi_create_external}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: API 在其下调用的环境。
- `[in] data`: 指向外部数据的原始指针。
- `[in] finalize_cb`: 可选的回调，在收集外部值时调用。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多细节。
- `[in] finalize_hint`: 可选的提示，在收集期间传递给 finaliz 回调。
- `[out] result`: 一个 `napi_value`，表示一个外部值。

如果 API 成功，则返回 `napi_ok`。

此 API 分配一个 JavaScript 值，并将外部数据附加到它。 这用于通过 JavaScript 代码传递外部数据，以便稍后可以使用 [`napi_get_value_external`](/zh/nodejs/api/n-api#napi_get_value_external) 通过本机代码检索它。

该 API 添加了一个 `napi_finalize` 回调，该回调将在刚刚创建的 JavaScript 对象被垃圾回收时调用。

创建的值不是对象，因此不支持其他属性。 它被认为是一种不同的值类型：使用外部值调用 `napi_typeof()` 会产生 `napi_external`。


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] external_data`: 指向 `ArrayBuffer` 底层字节缓冲区的指针。
- `[in] byte_length`: 底层缓冲区的字节长度。
- `[in] finalize_cb`: 可选的回调函数，当 `ArrayBuffer` 被垃圾回收时调用。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_hint`: 可选的提示信息，在垃圾回收期间传递给 finalize 回调函数。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `ArrayBuffer`。

如果 API 成功，则返回 `napi_ok`。

**某些 Node.js 以外的运行时已放弃对外部缓冲区的支持**。在 Node.js 以外的运行时，此方法可能会返回 `napi_no_external_buffers_allowed`，以表明不支持外部缓冲区。其中一个运行时是 Electron，如本 issue [electron/issues/35801](https://github.com/electron/electron/issues/35801) 中所述。

为了保持与所有运行时最广泛的兼容性，您可以在包含 node-api 头文件之前在您的插件中定义 `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`。 这样做将隐藏创建外部缓冲区的 2 个函数。 这将确保如果您意外使用其中一种方法，则会发生编译错误。

此 API 返回一个 Node-API 值，对应于一个 JavaScript `ArrayBuffer`。 `ArrayBuffer` 的底层字节缓冲区是外部分配和管理的。 调用者必须确保字节缓冲区在 finalize 回调函数被调用之前保持有效。

该 API 添加了一个 `napi_finalize` 回调函数，当刚创建的 JavaScript 对象被垃圾回收时，将调用该回调函数。

JavaScript `ArrayBuffer` 在 ECMAScript 语言规范的 [Section 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) 中进行了描述。


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] length`: 输入缓冲区的大小（以字节为单位）（应与新缓冲区的大小相同）。
- `[in] data`: 指向要暴露给 JavaScript 的底层缓冲区的原始指针。
- `[in] finalize_cb`: 可选的回调函数，在 `ArrayBuffer` 被回收时调用。[`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_hint`: 可选的提示信息，在回收期间传递给 finalize 回调。
- `[out] result`: 一个 `napi_value`，表示一个 `node::Buffer`。

如果 API 成功，则返回 `napi_ok`。

**某些 Node.js 以外的运行时已经放弃了对外部缓冲区的支持**。在 Node.js 以外的运行时，此方法可能返回 `napi_no_external_buffers_allowed`，以表明不支持外部缓冲区。Electron 就是这样一个运行时，如问题 [electron/issues/35801](https://github.com/electron/electron/issues/35801) 中所述。

为了保持与所有运行时的最广泛兼容性，您可以在包含 node-api 头文件之前在您的插件中定义 `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`。这样做会隐藏创建外部缓冲区的 2 个函数。这将确保如果您不小心使用了其中一种方法，则会发生编译错误。

此 API 分配一个 `node::Buffer` 对象，并使用传入的缓冲区支持的数据对其进行初始化。虽然这仍然是一种完全支持的数据结构，但在大多数情况下，使用 `TypedArray` 就足够了。

该 API 添加了一个 `napi_finalize` 回调，当刚刚创建的 JavaScript 对象被垃圾回收时，将调用该回调。

对于 Node.js \>=4，`Buffers` 是 `Uint8Array`。


#### `napi_create_object` {#napi_create_object}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[out] result`: 一个代表 JavaScript `Object` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 分配一个默认的 JavaScript `Object`。它等同于在 JavaScript 中执行 `new Object()`。

JavaScript `Object` 类型在 ECMAScript 语言规范的 [第 6.1.7 节](https://tc39.github.io/ecma262/#sec-object-type) 中进行了描述。

#### `napi_create_symbol` {#napi_create_symbol}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] description`: 可选的 `napi_value`，它指向一个 JavaScript `string`，该字符串将被设置为符号的描述。
- `[out] result`: 一个代表 JavaScript `symbol` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF8 编码的 C 字符串创建一个 JavaScript `symbol` 值。

JavaScript `symbol` 类型在 ECMAScript 语言规范的 [第 19.4 节](https://tc39.github.io/ecma262/#sec-symbol-objects) 中进行了描述。

#### `node_api_symbol_for` {#node_api_symbol_for}

**添加于: v17.5.0, v16.15.0**

**N-API 版本: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] utf8description`: UTF-8 C 字符串，表示将用作符号描述的文本。
- `[in] length`: 描述字符串的长度（以字节为单位），如果以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 一个代表 JavaScript `symbol` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 在全局注册表中搜索具有给定描述的现有符号。 如果符号已经存在，它将被返回，否则将在注册表中创建一个新符号。

JavaScript `symbol` 类型在 ECMAScript 语言规范的 [第 19.4 节](https://tc39.github.io/ecma262/#sec-symbol-objects) 中进行了描述。


#### `napi_create_typedarray` {#napi_create_typedarray}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] type`: `TypedArray` 中元素的标量数据类型。
- `[in] length`: `TypedArray` 中元素的数量。
- `[in] arraybuffer`: `ArrayBuffer` 是类型化数组的基础。
- `[in] byte_offset`: 从 `ArrayBuffer` 中开始投影 `TypedArray` 的字节偏移量。
- `[out] result`: 一个代表 JavaScript `TypedArray` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 在现有的 `ArrayBuffer` 上创建一个 JavaScript `TypedArray` 对象。`TypedArray` 对象提供了一个类似数组的视图，可以访问底层数据缓冲区，其中每个元素都具有相同的底层二进制标量数据类型。

要求 `(length * size_of_element) + byte_offset` 应该 \<= 传入数组的字节大小。 如果不是，则会引发 `RangeError` 异常。

JavaScript `TypedArray` 对象在 ECMAScript 语言规范的[第 22.2 节](https://tc39.github.io/ecma262/#sec-typedarray-objects)中进行了描述。

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**添加于: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: API 被调用的环境。
- **<code>[in] arraybuffer</code>**: 将从中创建缓冲区的 `ArrayBuffer`。
- **<code>[in] byte_offset</code>**: 从 `ArrayBuffer` 中开始创建缓冲区的字节偏移量。
- **<code>[in] byte_length</code>**: 从 `ArrayBuffer` 创建的缓冲区的字节长度。
- **<code>[out] result</code>**: 一个代表创建的 JavaScript `Buffer` 对象的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 从现有的 `ArrayBuffer` 创建一个 JavaScript `Buffer` 对象。`Buffer` 对象是 Node.js 特定的类，提供了一种直接在 JavaScript 中处理二进制数据的方法。

字节范围 `[byte_offset, byte_offset + byte_length)` 必须在 `ArrayBuffer` 的边界内。 如果 `byte_offset + byte_length` 超过 `ArrayBuffer` 的大小，则会引发 `RangeError` 异常。


#### `napi_create_dataview` {#napi_create_dataview}

**添加于: v8.3.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] length`: `DataView` 中的元素数量。
- `[in] arraybuffer`: `DataView` 基础的 `ArrayBuffer`。
- `[in] byte_offset`: 从 `ArrayBuffer` 中开始投影 `DataView` 的字节偏移量。
- `[out] result`: 表示 JavaScript `DataView` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 在现有的 `ArrayBuffer` 上创建一个 JavaScript `DataView` 对象。 `DataView` 对象提供了一个类似于数组的视图，它覆盖了一个底层数据缓冲区，但允许 `ArrayBuffer` 中具有不同大小和类型的项目。

要求 `byte_length + byte_offset` 小于或等于传入数组的字节大小。 如果不是，则会引发 `RangeError` 异常。

JavaScript `DataView` 对象在 ECMAScript 语言规范的[第 24.3 节](https://tc39.github.io/ecma262/#sec-dataview-objects)中进行了描述。

### 从 C 类型转换为 Node-API 的函数 {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**添加于: v8.4.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要在 JavaScript 中表示的整数值。
- `[out] result`: 表示 JavaScript `number` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 用于将 C `int32_t` 类型转换为 JavaScript `number` 类型。

JavaScript `number` 类型在 ECMAScript 语言规范的[第 6.1.6 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)中进行了描述。


#### `napi_create_uint32` {#napi_create_uint32}

**添加于: v8.4.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要在 JavaScript 中表示的无符号整数值。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `number`。

如果 API 成功，则返回 `napi_ok`。

此 API 用于将 C `uint32_t` 类型转换为 JavaScript `number` 类型。

JavaScript `number` 类型在 ECMAScript 语言规范的[第 6.1.6 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)中描述。

#### `napi_create_int64` {#napi_create_int64}

**添加于: v8.4.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要在 JavaScript 中表示的整数值。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `number`。

如果 API 成功，则返回 `napi_ok`。

此 API 用于将 C `int64_t` 类型转换为 JavaScript `number` 类型。

JavaScript `number` 类型在 ECMAScript 语言规范的[第 6.1.6 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)中描述。 请注意，`int64_t` 的完整范围无法在 JavaScript 中以完整的精度表示。 超出 [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` 范围的整数值将失去精度。

#### `napi_create_double` {#napi_create_double}

**添加于: v8.4.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要在 JavaScript 中表示的双精度值。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript `number`。

如果 API 成功，则返回 `napi_ok`。

此 API 用于将 C `double` 类型转换为 JavaScript `number` 类型。

JavaScript `number` 类型在 ECMAScript 语言规范的[第 6.1.6 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)中描述。


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**加入于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] value`: 要在 JavaScript 中表示的整数值。
- `[out] result`: 代表 JavaScript `BigInt` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 将 C `int64_t` 类型转换为 JavaScript `BigInt` 类型。

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**加入于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] value`: 要在 JavaScript 中表示的无符号整数值。
- `[out] result`: 代表 JavaScript `BigInt` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 将 C `uint64_t` 类型转换为 JavaScript `BigInt` 类型。

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**加入于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] sign_bit`: 确定生成的 `BigInt` 是正数还是负数。
- `[in] word_count`: `words` 数组的长度。
- `[in] words`: 一个 `uint64_t` 小端 64 位字的数组。
- `[out] result`: 代表 JavaScript `BigInt` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 将无符号 64 位字的数组转换为单个 `BigInt` 值。

生成的 `BigInt` 计算如下：(–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 ISO-8859-1 编码字符串的字符缓冲区。
- `[in] length`: 字符串的字节长度，如果以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 表示 JavaScript `string` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 ISO-8859-1 编码的 C 字符串创建 JavaScript `string` 值。 本地字符串会被复制。

JavaScript `string` 类型在 ECMAScript 语言规范的 [第 6.1.4 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中描述。

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**添加于: v20.4.0, v18.18.0**

::: warning [不稳定: 1 - 实验性]
[不稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 ISO-8859-1 编码字符串的字符缓冲区。
- `[in] length`: 字符串的字节长度，如果以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[in] finalize_callback`: 当字符串被回收时要调用的函数。 该函数将被调用，并带有以下参数：
    - `[in] env`: 加载项运行的环境。 如果字符串作为 worker 或主 Node.js 实例终止的一部分被收集，则此值可能为 null。
    - `[in] data`: 这是作为 `void*` 指针的 `str` 值。
    - `[in] finalize_hint`: 这是传递给 API 的 `finalize_hint` 值。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。 此参数是可选的。 传递 null 值意味着在收集相应的 JavaScript 字符串时，不需要通知加载项。
  
 
- `[in] finalize_hint`: 在回收期间传递给终结回调的可选提示。
- `[out] result`: 表示 JavaScript `string` 的 `napi_value`。
- `[out] copied`: 字符串是否被复制。 如果是，则终结器已经调用以销毁 `str`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 ISO-8859-1 编码的 C 字符串创建 JavaScript `string` 值。 本地字符串可能不会被复制，因此必须在 JavaScript 值的整个生命周期中存在。

JavaScript `string` 类型在 ECMAScript 语言规范的 [第 6.1.4 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中描述。


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 UTF16-LE 编码字符串的字符缓冲区。
- `[in] length`: 字符串的长度（以双字节代码单元表示），如果字符串以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 表示 JavaScript `string` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF16-LE 编码的 C 字符串创建一个 JavaScript `string` 值。 本机字符串会被复制。

JavaScript `string` 类型在 ECMAScript 语言规范的[第 6.1.4 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)中进行了描述。

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**添加于: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 UTF16-LE 编码字符串的字符缓冲区。
- `[in] length`: 字符串的长度（以双字节代码单元表示），如果字符串以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[in] finalize_callback`: 字符串被回收时要调用的函数。 该函数将使用以下参数调用：
    - `[in] env`: 插件运行的环境。 如果字符串作为 worker 或主 Node.js 实例终止的一部分被回收，则此值可能为 null。
    - `[in] data`: 这是作为 `void*` 指针的 `str` 值。
    - `[in] finalize_hint`: 这是传递给 API 的 `finalize_hint` 值。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。 此参数是可选的。 传递 null 值意味着插件不需要在收集相应的 JavaScript 字符串时收到通知。
  
 
- `[in] finalize_hint`: 在收集期间传递给 finalize 回调的可选提示。
- `[out] result`: 表示 JavaScript `string` 的 `napi_value`。
- `[out] copied`: 字符串是否被复制。 如果是，则 finalizer 应该已经被调用以销毁 `str`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF16-LE 编码的 C 字符串创建一个 JavaScript `string` 值。 本机字符串可能未被复制，因此必须在 JavaScript 值的整个生命周期内存在。

JavaScript `string` 类型在 ECMAScript 语言规范的[第 6.1.4 节](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)中进行了描述。


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: API 在其下调用的环境。
- `[in] str`: 表示 UTF8 编码字符串的字符缓冲区。
- `[in] length`: 字符串的字节长度，如果为 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 表示 JavaScript `string` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF8 编码的 C 字符串创建一个 JavaScript `string` 值。 复制原生字符串。

JavaScript `string` 类型在 ECMAScript 语言规范的 [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中进行了描述。

### 用于创建优化属性键的函数 {#functions-to-create-optimized-property-keys}

包括 V8 在内的许多 JavaScript 引擎都使用内部化的字符串作为键来设置和获取属性值。 它们通常使用哈希表来创建和查找此类字符串。 虽然这会增加每个键创建的成本，但通过启用字符串指针而不是整个字符串的比较，从而提高了之后的性能。

如果一个新的 JavaScript 字符串旨在用作属性键，那么对于某些 JavaScript 引擎来说，使用本节中的函数会更有效率。 否则，请使用 `napi_create_string_utf8` 或 `node_api_create_external_string_utf8` 系列函数，因为使用属性键创建方法创建/存储字符串可能会有额外的开销。

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**添加于: v22.9.0, v20.18.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] str`: 表示 ISO-8859-1 编码字符串的字符缓冲区。
- `[in] length`: 字符串的字节长度，如果为 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 一个 `napi_value`，表示一个优化的 JavaScript `string`，用于作为对象的属性键。

如果 API 成功，则返回 `napi_ok`。

此 API 从 ISO-8859-1 编码的 C 字符串创建一个优化的 JavaScript `string` 值，用作对象的属性键。 复制原生字符串。 与 `napi_create_string_latin1` 相比，使用相同的 `str` 指针后续调用此函数可能会受益于所请求的 `napi_value` 创建速度的加快，具体取决于引擎。

JavaScript `string` 类型在 ECMAScript 语言规范的 [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中进行了描述。


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**加入于: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 UTF16-LE 编码字符串的字符缓冲区。
- `[in] length`: 字符串的长度，以双字节代码单元表示；如果字符串以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 一个 `napi_value`，表示一个优化的 JavaScript `string`，用于作为对象的属性键。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF16-LE 编码的 C 字符串创建一个优化的 JavaScript `string` 值，用作对象的属性键。 本机字符串会被复制。

JavaScript `string` 类型在 ECMAScript 语言规范的 [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中描述。

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**加入于: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] str`: 表示 UTF8 编码字符串的字符缓冲区。
- `[in] length`: 字符串的长度，以双字节代码单元表示；如果字符串以 null 结尾，则为 `NAPI_AUTO_LENGTH`。
- `[out] result`: 一个 `napi_value`，表示一个优化的 JavaScript `string`，用于作为对象的属性键。

如果 API 成功，则返回 `napi_ok`。

此 API 从 UTF8 编码的 C 字符串创建一个优化的 JavaScript `string` 值，用作对象的属性键。 本机字符串会被复制。

JavaScript `string` 类型在 ECMAScript 语言规范的 [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) 中描述。


### 将 Node-API 类型转换为 C 类型的函数 {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: API 在其下调用的环境。
- `[in] value`: 表示要查询长度的 JavaScript `Array` 的 `napi_value`。
- `[out] result`: 表示数组长度的 `uint32`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回数组的长度。

`Array` 的长度在 ECMAScript 语言规范的 [Section 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) 中描述。

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: API 在其下调用的环境。
- `[in] arraybuffer`: 表示要查询的 `ArrayBuffer` 的 `napi_value`。
- `[out] data`: `ArrayBuffer` 的底层数据缓冲区。 如果 byte_length 为 `0`，则这可以是 `NULL` 或任何其他指针值。
- `[out] byte_length`: 底层数据缓冲区的长度（以字节为单位）。

如果 API 成功，则返回 `napi_ok`。

此 API 用于检索 `ArrayBuffer` 的底层数据缓冲区及其长度。

*警告*: 使用此 API 时要小心。 底层数据缓冲区的生命周期由 `ArrayBuffer` 管理，即使在返回后也是如此。 安全使用此 API 的一种可能方法是与 [`napi_create_reference`](/zh/nodejs/api/n-api#napi_create_reference) 结合使用，该 API 可用于保证对 `ArrayBuffer` 生命周期进行控制。 在同一个回调中使用返回的数据缓冲区也是安全的，只要没有调用其他可能触发 GC 的 API。


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 表示正在查询的 `node::Buffer` 或 `Uint8Array` 的 `napi_value`。
- `[out] data`: `node::Buffer` 或 `Uint8Array` 的底层数据缓冲区。 如果 length 为 `0`，则这可以是 `NULL` 或任何其他指针值。
- `[out] length`: 底层数据缓冲区的长度（以字节为单位）。

如果 API 成功，则返回 `napi_ok`。

此方法返回与 [`napi_get_typedarray_info`](/zh/nodejs/api/n-api#napi_get_typedarray_info) 相同的 `data` 和 `byte_length`。 并且 `napi_get_typedarray_info` 也可以接受 `node::Buffer`（一个 Uint8Array）作为值。

此 API 用于检索 `node::Buffer` 的底层数据缓冲区及其长度。

*警告*: 使用此 API 时请务必小心，因为如果底层数据缓冲区由 VM 管理，则其生命周期无法得到保证。

#### `napi_get_prototype` {#napi_get_prototype}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] object`: 表示要返回其原型的 JavaScript `Object` 的 `napi_value`。 这将返回与 `Object.getPrototypeOf` 等效的值（这与函数的 `prototype` 属性不同）。
- `[out] result`: 表示给定对象的原型的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: 调用 API 的环境。
- `[in] typedarray`: 表示要查询其属性的 `TypedArray` 的 `napi_value`。
- `[out] type`: `TypedArray` 中元素的标量数据类型。
- `[out] length`: `TypedArray` 中元素的数量。
- `[out] data`: 由 `byte_offset` 值调整的 `TypedArray` 的底层数据缓冲区，以便它指向 `TypedArray` 中的第一个元素。 如果数组的长度为 `0`，则这可以是 `NULL` 或任何其他指针值。
- `[out] arraybuffer`: `TypedArray` 的底层 `ArrayBuffer`。
- `[out] byte_offset`: 底层本机数组中数组的第一个元素所在的字节偏移量。 data 参数的值已经过调整，以便 data 指向数组中的第一个元素。 因此，本机数组的第一个字节将位于 `data - byte_offset`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回类型化数组的各种属性。

如果不需要该属性，任何 out 参数都可以是 `NULL`。

*警告*: 使用此 API 时请务必小心，因为底层数据缓冲区由 VM 管理。


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**添加于: v8.3.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: 调用 API 的环境。
- `[in] dataview`: 代表要查询其属性的 `DataView` 的 `napi_value`。
- `[out] byte_length`: `DataView` 中的字节数。
- `[out] data`: `DataView` 的底层数据缓冲区。 如果 byte_length 为 `0`，则此值可能为 `NULL` 或任何其他指针值。
- `[out] arraybuffer`: `DataView` 的底层 `ArrayBuffer`。
- `[out] byte_offset`: 从数据缓冲区中开始投影 `DataView` 的字节偏移量。

如果 API 成功，则返回 `napi_ok`。

如果不需要该属性，则任何 out 参数都可能为 `NULL`。

此 API 返回 `DataView` 的各种属性。

#### `napi_get_date_value` {#napi_get_date_value}

**添加于: v11.11.0, v10.17.0**

**N-API 版本: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 表示 JavaScript `Date` 的 `napi_value`。
- `[out] result`: 时间值，以 `double` 类型表示，以自 1970 年 1 月 1 日 UTC 午夜以来经过的毫秒数表示。

此 API 不会观察闰秒；它们会被忽略，因为 ECMAScript 与 POSIX 时间规范对齐。

如果 API 成功，则返回 `napi_ok`。 如果传入非 date 的 `napi_value`，则返回 `napi_date_expected`。

此 API 返回给定 JavaScript `Date` 的时间值的 C double 原始类型。

#### `napi_get_value_bool` {#napi_get_value_bool}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 表示 JavaScript `Boolean` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `Boolean` 的等效 C 布尔原始类型。

如果 API 成功，则返回 `napi_ok`。 如果传入非 boolean 的 `napi_value`，则返回 `napi_boolean_expected`。

此 API 返回给定 JavaScript `Boolean` 的等效 C 布尔原始类型。


#### `napi_get_value_double` {#napi_get_value_double}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript `number` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `number` 的 C double 原始类型等价值。

如果 API 成功，则返回 `napi_ok`。 如果传入一个非数字的 `napi_value`，则返回 `napi_number_expected`。

此 API 返回给定 JavaScript `number` 的 C double 原始类型等价值。

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**添加于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript `BigInt` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `BigInt` 的 C `int64_t` 原始类型等价值。
- `[out] lossless`: 指示 `BigInt` 值是否无损转换。

如果 API 成功，则返回 `napi_ok`。 如果传入一个非 `BigInt` 的值，则返回 `napi_bigint_expected`。

此 API 返回给定 JavaScript `BigInt` 的 C `int64_t` 原始类型等价值。 如果需要，它将截断该值，并将 `lossless` 设置为 `false`。

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**添加于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript `BigInt` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `BigInt` 的 C `uint64_t` 原始类型等价值。
- `[out] lossless`: 指示 `BigInt` 值是否无损转换。

如果 API 成功，则返回 `napi_ok`。 如果传入一个非 `BigInt` 的值，则返回 `napi_bigint_expected`。

此 API 返回给定 JavaScript `BigInt` 的 C `uint64_t` 原始类型等价值。 如果需要，它将截断该值，并将 `lossless` 设置为 `false`。


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**添加于: v10.7.0**

**N-API 版本: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript `BigInt` 的 `napi_value`。
- `[out] sign_bit`: 整数，表示 JavaScript `BigInt` 是正数还是负数。
- `[in/out] word_count`: 必须初始化为 `words` 数组的长度。 返回时，它将被设置为存储此 `BigInt` 所需的实际字数。
- `[out] words`: 指向预先分配的 64 位字数组的指针。

如果 API 成功，则返回 `napi_ok`。

此 API 将单个 `BigInt` 值转换为符号位、64 位小端数组以及数组中的元素数量。 可以将 `sign_bit` 和 `words` 都设置为 `NULL`，以便仅获取 `word_count`。

#### `napi_get_value_external` {#napi_get_value_external}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript 外部值的 `napi_value`。
- `[out] result`: 指向 JavaScript 外部值包装的数据的指针。

如果 API 成功，则返回 `napi_ok`。 如果传入非外部 `napi_value`，则返回 `napi_invalid_arg`。

此 API 检索先前传递给 `napi_create_external()` 的外部数据指针。

#### `napi_get_value_int32` {#napi_get_value_int32}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 代表 JavaScript `number` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `number` 的 C `int32` 原始等效值。

如果 API 成功，则返回 `napi_ok`。 如果传入非数字 `napi_value`，则返回 `napi_number_expected`。

此 API 返回给定 JavaScript `number` 的 C `int32` 原始等效值。

如果该数字超出 32 位整数的范围，则结果将被截断为底部 32 位的等效值。 如果该值 > 2 - 1，这可能导致一个大的正数变为负数。

非有限数字值（`NaN`、`+Infinity` 或 `-Infinity`）将结果设置为零。


#### `napi_get_value_int64` {#napi_get_value_int64}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 代表 JavaScript `number` 的 `napi_value`。
- `[out] result`: 给定 JavaScript `number` 对应的 C `int64` 原始类型。

如果 API 成功，则返回 `napi_ok`。 如果传入非数字的 `napi_value`，则返回 `napi_number_expected`。

该 API 返回给定 JavaScript `number` 对应的 C `int64` 原始类型。

超出 [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` 范围的 `number` 值将会丢失精度。

非有限数字值（`NaN`、`+Infinity` 或 `-Infinity`）会将结果设置为零。

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 代表 JavaScript 字符串的 `napi_value`。
- `[in] buf`: 用于写入 ISO-8859-1 编码字符串的缓冲区。 如果传入 `NULL`，则字符串的长度（以字节为单位，不包括空终止符）将返回在 `result` 中。
- `[in] bufsize`: 目标缓冲区的大小。 当此值不足时，返回的字符串将被截断并以空字符结尾。
- `[out] result`: 复制到缓冲区中的字节数，不包括空终止符。

如果 API 成功，则返回 `napi_ok`。 如果传入非 `string` 的 `napi_value`，则返回 `napi_string_expected`。

该 API 返回与传入值对应的 ISO-8859-1 编码字符串。


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 表示 JavaScript 字符串的 `napi_value`。
- `[in] buf`: 用于写入 UTF8 编码字符串的缓冲区。 如果传入 `NULL`，则 `result` 中返回字符串的字节长度（不包括空终止符）。
- `[in] bufsize`: 目标缓冲区的大小。 如果此值不足，则返回的字符串将被截断并以 null 结尾。
- `[out] result`: 复制到缓冲区的字节数，不包括空终止符。

如果 API 成功，则返回 `napi_ok`。 如果传入非 `string` 的 `napi_value`，则返回 `napi_string_expected`。

此 API 返回与传入值对应的 UTF8 编码字符串。

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 表示 JavaScript 字符串的 `napi_value`。
- `[in] buf`: 用于写入 UTF16-LE 编码字符串的缓冲区。 如果传入 `NULL`，则返回字符串中 2 字节代码单元的长度（不包括空终止符）。
- `[in] bufsize`: 目标缓冲区的大小。 如果此值不足，则返回的字符串将被截断并以 null 结尾。
- `[out] result`: 复制到缓冲区的 2 字节代码单元数，不包括空终止符。

如果 API 成功，则返回 `napi_ok`。 如果传入非 `string` 的 `napi_value`，则返回 `napi_string_expected`。

此 API 返回与传入值对应的 UTF16 编码字符串。


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 代表 JavaScript `number` 的 `napi_value`。
- `[out] result`: 给定 `napi_value` 的 C 原始类型等效值，表示为 `uint32_t`。

如果 API 成功，则返回 `napi_ok`。 如果传入非数字的 `napi_value`，则返回 `napi_number_expected`。

此 API 返回给定 `napi_value` 的 C 原始类型等效值，表示为 `uint32_t`。

### 获取全局实例的函数 {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: API 调用的环境。
- `[in] value`: 要检索的布尔值。
- `[out] result`: 代表要检索的 JavaScript `Boolean` 单例的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 用于返回 JavaScript 单例对象，该对象用于表示给定的布尔值。

#### `napi_get_global` {#napi_get_global}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: API 调用的环境。
- `[out] result`: 代表 JavaScript `global` 对象的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回 `global` 对象。

#### `napi_get_null` {#napi_get_null}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: API 调用的环境。
- `[out] result`: 代表 JavaScript `null` 对象的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回 `null` 对象。

#### `napi_get_undefined` {#napi_get_undefined}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: API 调用的环境。
- `[out] result`: 代表 JavaScript Undefined 值的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回 Undefined 对象。


## 使用 JavaScript 值和抽象操作 {#working-with-javascript-values-and-abstract-operations}

Node-API 公开了一组 API，用于对 JavaScript 值执行一些抽象操作。其中一些操作记录在 [ECMAScript 语言规范](https://tc39.github.io/ecma262/)的[第 7 节](https://tc39.github.io/ecma262/#sec-abstract-operations)中。

这些 API 支持执行以下操作之一：

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要强制转换的 JavaScript 值。
- `[out] result`: `napi_value` 表示强制转换后的 JavaScript `Boolean`。

如果 API 成功，则返回 `napi_ok`。

此 API 实现了 ECMAScript 语言规范 [第 7.1.2 节](https://tc39.github.io/ecma262/#sec-toboolean) 中定义的抽象操作 `ToBoolean()`。

### `napi_coerce_to_number` {#napi_coerce_to_number}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要强制转换的 JavaScript 值。
- `[out] result`: `napi_value` 表示强制转换后的 JavaScript `number`。

如果 API 成功，则返回 `napi_ok`。

此 API 实现了 ECMAScript 语言规范 [第 7.1.3 节](https://tc39.github.io/ecma262/#sec-tonumber) 中定义的抽象操作 `ToNumber()`。 如果传入的值是一个对象，此函数可能会运行 JS 代码。

### `napi_coerce_to_object` {#napi_coerce_to_object}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要强制转换的 JavaScript 值。
- `[out] result`: `napi_value` 表示强制转换后的 JavaScript `Object`。

如果 API 成功，则返回 `napi_ok`。

此 API 实现了 ECMAScript 语言规范 [第 7.1.13 节](https://tc39.github.io/ecma262/#sec-toobject) 中定义的抽象操作 `ToObject()`。


### `napi_coerce_to_string` {#napi_coerce_to_string}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要强制转换的 JavaScript 值。
- `[out] result`: 代表强制转换后的 JavaScript `string` 的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此 API 实现了 ECMAScript 语言规范的 [Section 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) 中定义的抽象操作 `ToString()`。 如果传入的值是一个对象，则此函数可能会运行 JS 代码。

### `napi_typeof` {#napi_typeof}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要查询类型的 JavaScript 值。
- `[out] result`: JavaScript 值的类型。

如果 API 成功，则返回 `napi_ok`。

- 如果 `value` 的类型不是已知的 ECMAScript 类型且 `value` 不是外部值，则返回 `napi_invalid_arg`。

此 API 表示类似于在对象上调用 `typeof` 运算符的行为，如 ECMAScript 语言规范的 [Section 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) 中所定义。 但是，存在一些差异：

如果 `value` 具有无效类型，则返回错误。

### `napi_instanceof` {#napi_instanceof}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: API 被调用的环境。
- `[in] object`: 要检查的 JavaScript 值。
- `[in] constructor`: 要检查的构造函数的 JavaScript 函数对象。
- `[out] result`: 如果 `object instanceof constructor` 为真，则设置为 true 的布尔值。

如果 API 成功，则返回 `napi_ok`。

此 API 表示在对象上调用 `instanceof` 运算符，如 ECMAScript 语言规范的 [Section 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) 中所定义。


### `napi_is_array` {#napi_is_array}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的对象是否为数组。

如果 API 成功，则返回 `napi_ok`。

此 API 表示对对象调用 `IsArray` 操作，如 ECMAScript 语言规范的 [第 7.2.2 节](https://tc39.github.io/ecma262/#sec-isarray) 中所定义。

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的对象是否为 `ArrayBuffer`。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为数组缓冲区。

### `napi_is_buffer` {#napi_is_buffer}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的 `napi_value` 是否表示 `node::Buffer` 或 `Uint8Array` 对象。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为缓冲区或 Uint8Array。如果调用者需要检查该值是否为 Uint8Array，则应首选 [`napi_is_typedarray`](/zh/nodejs/api/n-api#napi_is_typedarray)。

### `napi_is_date` {#napi_is_date}

**加入于: v11.11.0, v10.17.0**

**N-API 版本: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的 `napi_value` 是否表示 JavaScript `Date` 对象。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为日期。


### `napi_is_error` {#napi_is_error_1}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的 `napi_value` 是否表示一个 `Error` 对象。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为 `Error`。

### `napi_is_typedarray` {#napi_is_typedarray}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的 `napi_value` 是否表示一个 `TypedArray`。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为类型化数组。

### `napi_is_dataview` {#napi_is_dataview}

**添加于: v8.3.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API 被调用的环境。
- `[in] value`: 要检查的 JavaScript 值。
- `[out] result`: 给定的 `napi_value` 是否表示一个 `DataView`。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否为 `DataView`。

### `napi_strict_equals` {#napi_strict_equals}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: API 被调用的环境。
- `[in] lhs`: 要检查的 JavaScript 值。
- `[in] rhs`: 要检查的 JavaScript 值，用于对比。
- `[out] result`: 两个 `napi_value` 对象是否相等。

如果 API 成功，则返回 `napi_ok`。

此 API 表示严格相等算法的调用，该算法在 ECMAScript 语言规范的 [Section 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) 中定义。


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**添加于: v13.0.0, v12.16.0, v10.22.0**

**N-API 版本: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: 调用 API 的环境。
- `[in] arraybuffer`: 要分离的 JavaScript `ArrayBuffer`。

如果 API 成功，则返回 `napi_ok`。 如果传入一个不可分离的 `ArrayBuffer`，它将返回 `napi_detachable_arraybuffer_expected`。

通常，如果 `ArrayBuffer` 之前已被分离，则它是不可分离的。 引擎可能会对 `ArrayBuffer` 是否可分离施加额外的条件。 例如，V8 要求 `ArrayBuffer` 是外部的，也就是说，使用 [`napi_create_external_arraybuffer`](/zh/nodejs/api/n-api#napi_create_external_arraybuffer) 创建的。

此 API 表示 ECMAScript 语言规范的 [第 24.1.1.3 节](https://tc39.es/ecma262/#sec-detacharraybuffer) 中定义的 `ArrayBuffer` 分离操作的调用。

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**添加于: v13.3.0, v12.16.0, v10.22.0**

**N-API 版本: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] arraybuffer`: 要检查的 JavaScript `ArrayBuffer`。
- `[out] result`: `arraybuffer` 是否已分离。

如果 API 成功，则返回 `napi_ok`。

如果 `ArrayBuffer` 的内部数据为 `null`，则认为它已分离。

此 API 表示 ECMAScript 语言规范的 [第 24.1.1.2 节](https://tc39.es/ecma262/#sec-isdetachedbuffer) 中定义的 `ArrayBuffer` `IsDetachedBuffer` 操作的调用。

## 使用 JavaScript 属性 {#working-with-javascript-properties}

Node-API 公开了一组 API，用于获取和设置 JavaScript 对象上的属性。 其中一些类型记录在 [ECMAScript 语言规范](https://tc39.github.io/ecma262/) 的 [第 7 节](https://tc39.github.io/ecma262/#sec-abstract-operations) 中。

JavaScript 中的属性表示为键和值的元组。 从根本上讲，Node-API 中的所有属性键都可以用以下形式之一表示：

- 命名：一个简单的 UTF8 编码字符串
- 整数索引：由 `uint32_t` 表示的索引值
- JavaScript 值：这些由 Node-API 中的 `napi_value` 表示。 这可以是表示 `string`、`number` 或 `symbol` 的 `napi_value`。

Node-API 值由类型 `napi_value` 表示。 任何需要 JavaScript 值的 Node-API 调用都会接受 `napi_value`。 但是，调用者有责任确保所讨论的 `napi_value` 是 API 期望的 JavaScript 类型。

本节中记录的 API 提供了一个简单的接口，用于获取和设置由 `napi_value` 表示的任意 JavaScript 对象上的属性。

例如，考虑以下 JavaScript 代码片段：

```js [ESM]
const obj = {};
obj.myProp = 123;
```
可以使用具有以下代码片段的 Node-API 值来完成等效操作：

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
可以以类似的方式设置索引属性。 考虑以下 JavaScript 代码片段：

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
可以使用具有以下代码片段的 Node-API 值来完成等效操作：

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
可以使用本节中描述的 API 来检索属性。 考虑以下 JavaScript 代码片段：

```js [ESM]
const arr = [];
const value = arr[123];
```
以下是 Node-API 对应项的大致等效项：

```C [C]
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```
最后，出于性能原因，也可以在一个对象上定义多个属性。 考虑以下 JavaScript：

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
以下是 Node-API 对应项的大致等效项：

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### 结构体 {#structures}

#### `napi_property_attributes` {#napi_property_attributes}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.12.0 | 添加了 `napi_default_method` 和 `napi_default_property`。 |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // 用于 napi_define_class 来区分静态属性和
  // 实例属性。napi_define_properties 会忽略它。
  napi_static = 1 << 10,

  // 类的默认方法。
  napi_default_method = napi_writable | napi_configurable,

  // 对象属性的默认值，就像 JS obj[prop] 中一样。
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` 是用于控制在 JavaScript 对象上设置的属性的行为的标志。除了 `napi_static` 之外，它们对应于 [ECMAScript 语言规范](https://tc39.github.io/ecma262/)的 [第 6.1.7.1 节](https://tc39.github.io/ecma262/#table-2) 中列出的属性。 它们可以是以下一个或多个位标志：

- `napi_default`：属性上未设置任何显式属性。 默认情况下，属性是只读的，不可枚举的，且不可配置的。
- `napi_writable`：属性是可写的。
- `napi_enumerable`：属性是可枚举的。
- `napi_configurable`：该属性是可配置的，如 [ECMAScript 语言规范](https://tc39.github.io/ecma262/)的 [第 6.1.7.1 节](https://tc39.github.io/ecma262/#table-2) 中所定义。
- `napi_static`：该属性将被定义为类上的静态属性，而不是实例属性，后者是默认值。 这仅由 [`napi_define_class`](/zh/nodejs/api/n-api#napi_define_class) 使用。 `napi_define_properties` 会忽略它。
- `napi_default_method`：与 JS 类中的方法类似，该属性是可配置和可写的，但不可枚举。
- `napi_default_jsproperty`：与通过 JavaScript 中的赋值设置的属性类似，该属性是可写，可枚举且可配置的。


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // utf8name 或 name 应该有一个为 NULL。
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```
- `utf8name`: 可选字符串，描述属性的键，编码为 UTF8。`utf8name` 或 `name` 必须为属性提供一个。
- `name`: 可选的 `napi_value`，指向一个 JavaScript 字符串或符号，用作属性的键。`utf8name` 或 `name` 必须为属性提供一个。
- `value`: 如果属性是数据属性，则通过 get 访问属性检索的值。 如果传入此值，请将 `getter`、`setter`、`method` 和 `data` 设置为 `NULL`（因为不会使用这些成员）。
- `getter`: 在执行属性的 get 访问时调用的函数。 如果传入此值，请将 `value` 和 `method` 设置为 `NULL`（因为不会使用这些成员）。 当从 JavaScript 代码访问属性时（或者如果使用 Node-API 调用执行属性的 get 操作），运行时会隐式调用给定的函数。 [`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 提供了更多详细信息。
- `setter`: 在执行属性的 set 访问时调用的函数。 如果传入此值，请将 `value` 和 `method` 设置为 `NULL`（因为不会使用这些成员）。 当从 JavaScript 代码设置属性时（或者如果使用 Node-API 调用执行属性的 set 操作），运行时会隐式调用给定的函数。 [`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 提供了更多详细信息。
- `method`: 设置此项以使属性描述符对象的 `value` 属性成为由 `method` 表示的 JavaScript 函数。 如果传入此值，请将 `value`、`getter` 和 `setter` 设置为 `NULL`（因为不会使用这些成员）。 [`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 提供了更多详细信息。
- `attributes`: 与特定属性关联的属性。 参见 [`napi_property_attributes`](/zh/nodejs/api/n-api#napi_property_attributes)。
- `data`: 如果调用此函数，则传递给 `method`、`getter` 和 `setter` 的回调数据。


### 函数 {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要从中检索属性的对象。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript 值数组，这些值表示对象的属性名称。该 API 可以用于使用 [`napi_get_array_length`](/zh/nodejs/api/n-api#napi_get_array_length) 和 [`napi_get_element`](/zh/nodejs/api/n-api#napi_get_element) 遍历 `result`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回 `object` 的可枚举属性的名称，表示为字符串数组。键为符号的 `object` 的属性将不包括在内。

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**加入于: v13.7.0, v12.17.0, v10.20.0**

**N-API 版本: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要从中检索属性的对象。
- `[in] key_mode`: 是否同时检索原型属性。
- `[in] key_filter`: 要检索的属性（可枚举/可读/可写）。
- `[in] key_conversion`: 是否将编号的属性键转换为字符串。
- `[out] result`: 一个 `napi_value`，表示一个 JavaScript 值数组，这些值表示对象的属性名称。可以使用 [`napi_get_array_length`](/zh/nodejs/api/n-api#napi_get_array_length) 和 [`napi_get_element`](/zh/nodejs/api/n-api#napi_get_element) 遍历 `result`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回一个数组，其中包含此对象的可用属性的名称。


#### `napi_set_property` {#napi_set_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要设置属性的对象。
- `[in] key`: 要设置的属性的名称。
- `[in] value`: 属性值。

如果 API 成功，则返回 `napi_ok`。

此 API 在传入的 `Object` 上设置一个属性。

#### `napi_get_property` {#napi_get_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 从中检索属性的对象。
- `[in] key`: 要检索的属性的名称。
- `[out] result`: 属性的值。

如果 API 成功，则返回 `napi_ok`。

此 API 从传入的 `Object` 获取请求的属性。

#### `napi_has_property` {#napi_has_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] key`: 要检查其存在的属性的名称。
- `[out] result`: 该属性是否存在于对象上。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否具有指定的属性。

#### `napi_delete_property` {#napi_delete_property}

**添加于: v8.2.0**

**N-API 版本: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] key`: 要删除的属性的名称。
- `[out] result`: 属性删除是否成功。 可以选择通过传递 `NULL` 来忽略 `result`。

如果 API 成功，则返回 `napi_ok`。

此 API 尝试从 `object` 中删除 `key` 自身属性。


#### `napi_has_own_property` {#napi_has_own_property}

**添加于: v8.2.0**

**N-API 版本: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] key`: 要检查其存在的自身属性的名称。
- `[out] result`: 自身属性是否存在于对象上。

如果 API 成功，则返回 `napi_ok`。

此 API 检查传入的 `Object` 是否具有指定的自身属性。`key` 必须是 `string` 或 `symbol`，否则将抛出错误。Node-API 不会在数据类型之间执行任何转换。

#### `napi_set_named_property` {#napi_set_named_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要在其上设置属性的对象。
- `[in] utf8Name`: 要设置的属性的名称。
- `[in] value`: 属性值。

如果 API 成功，则返回 `napi_ok`。

此方法等效于使用从作为 `utf8Name` 传入的字符串创建的 `napi_value` 调用 [`napi_set_property`](/zh/nodejs/api/n-api#napi_set_property)。

#### `napi_get_named_property` {#napi_get_named_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要从中检索属性的对象。
- `[in] utf8Name`: 要获取的属性的名称。
- `[out] result`: 属性的值。

如果 API 成功，则返回 `napi_ok`。

此方法等效于使用从作为 `utf8Name` 传入的字符串创建的 `napi_value` 调用 [`napi_get_property`](/zh/nodejs/api/n-api#napi_get_property)。


#### `napi_has_named_property` {#napi_has_named_property}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] utf8Name`: 要检查其存在的属性的名称。
- `[out] result`: 属性是否存在于对象上。

如果 API 成功，则返回 `napi_ok`。

此方法等效于使用从作为 `utf8Name` 传入的字符串创建的 `napi_value` 调用 [`napi_has_property`](/zh/nodejs/api/n-api#napi_has_property)。

#### `napi_set_element` {#napi_set_element}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 从中设置属性的对象。
- `[in] index`: 要设置的属性的索引。
- `[in] value`: 属性值。

如果 API 成功，则返回 `napi_ok`。

此 API 设置传入的 `Object` 上的一个元素。

#### `napi_get_element` {#napi_get_element}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 从中检索属性的对象。
- `[in] index`: 要获取的属性的索引。
- `[out] result`: 属性的值。

如果 API 成功，则返回 `napi_ok`。

此 API 获取请求索引处的元素。

#### `napi_has_element` {#napi_has_element}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] index`: 要检查其存在的属性的索引。
- `[out] result`: 属性是否存在于对象上。

如果 API 成功，则返回 `napi_ok`。

如果传入的 `Object` 在请求的索引处具有元素，则此 API 返回 true。


#### `napi_delete_element` {#napi_delete_element}

**新增于: v8.2.0**

**N-API 版本: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要查询的对象。
- `[in] index`: 要删除的属性的索引。
- `[out] result`: 元素删除是否成功。 可以选择通过传递 `NULL` 来忽略 `result`。

如果 API 成功，则返回 `napi_ok`。

此 API 尝试从 `object` 中删除指定的 `index`。

#### `napi_define_properties` {#napi_define_properties}

**新增于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要从中检索属性的对象。
- `[in] property_count`: `properties` 数组中的元素数。
- `[in] properties`: 属性描述符数组。

如果 API 成功，则返回 `napi_ok`。

此方法允许在给定对象上高效地定义多个属性。 这些属性使用属性描述符定义（请参见 [`napi_property_descriptor`](/zh/nodejs/api/n-api#napi_property_descriptor)）。 给定此类属性描述符的数组，此 API 将按照 `DefineOwnProperty()`（在 ECMA-262 规范的 [Section 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) 中描述）的定义，一次设置对象上的一个属性。

#### `napi_object_freeze` {#napi_object_freeze}

**新增于: v14.14.0, v12.20.0**

**N-API 版本: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要冻结的对象。

如果 API 成功，则返回 `napi_ok`。

此方法冻结给定的对象。 这样可以防止向其添加新属性，防止删除现有属性，防止更改现有属性的可枚举性、可配置性或可写性，并防止更改现有属性的值。 它还防止对象的原型被更改。 这在 ECMA-262 规范的 [Section 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) 中进行了描述。


#### `napi_object_seal` {#napi_object_seal}

**添加于: v14.14.0, v12.20.0**

**N-API 版本: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: 调用 Node-API 的环境。
- `[in] object`: 要封闭的对象。

如果 API 成功，则返回 `napi_ok`。

此方法封闭给定的对象。这可以防止向其添加新属性，并将所有现有属性标记为不可配置。这在 ECMA-262 规范的 [第 19.1.2.20 节](https://tc39.es/ecma262/#sec-object.seal) 中有所描述。

## 使用 JavaScript 函数 {#working-with-javascript-functions}

Node-API 提供了一组 API，允许 JavaScript 代码回调到原生代码。支持回调到原生代码的 Node-API 接受由 `napi_callback` 类型表示的回调函数。当 JavaScript VM 回调到原生代码时，将调用提供的 `napi_callback` 函数。本节中记录的 API 允许回调函数执行以下操作：

- 获取有关调用回调的上下文的信息。
- 获取传递给回调的参数。
- 从回调返回 `napi_value`。

此外，Node-API 提供了一组函数，允许从原生代码调用 JavaScript 函数。可以像常规 JavaScript 函数调用一样调用函数，也可以作为构造函数调用。

通过 `napi_property_descriptor` 项的 `data` 字段传递给此 API 的任何非 `NULL` 数据都可以与 `object` 关联，并在 `object` 被垃圾回收时通过将 `object` 和数据传递给 [`napi_add_finalizer`](/zh/nodejs/api/n-api#napi_add_finalizer) 来释放。

### `napi_call_function` {#napi_call_function}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] recv`: 传递给被调用函数的 `this` 值。
- `[in] func`: 表示要调用的 JavaScript 函数的 `napi_value`。
- `[in] argc`: `argv` 数组中的元素计数。
- `[in] argv`: `napi_values` 数组，表示作为参数传递给函数的 JavaScript 值。
- `[out] result`: 表示返回的 JavaScript 对象的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此方法允许从原生插件调用 JavaScript 函数对象。这是从插件的原生代码*回调*到 JavaScript 的主要机制。对于在异步操作后调用 JavaScript 的特殊情况，请参阅 [`napi_make_callback`](/zh/nodejs/api/n-api#napi_make_callback)。

一个示例用例可能如下所示。考虑以下 JavaScript 代码片段：

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
然后，可以使用以下代码从原生插件调用上述函数：

```C [C]
// 获取全局对象上名为“AddTwo”的函数
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// 将结果转换回原生类型
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**加入于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: API 调用的环境。
- `[in] utf8Name`: 函数的可选名称，编码为 UTF8。这在 JavaScript 中作为新函数对象的 `name` 属性可见。
- `[in] length`: `utf8name` 的字节长度，如果它是空终止的，则为 `NAPI_AUTO_LENGTH`。
- `[in] cb`: 当调用此函数对象时应调用的原生函数。[`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 提供了更多详细信息。
- `[in] data`: 用户提供的数据上下文。 这将在以后调用时传递回函数。
- `[out] result`: `napi_value` 表示新创建函数的 JavaScript 函数对象。

如果 API 成功，则返回 `napi_ok`。

此 API 允许附加组件作者在原生代码中创建函数对象。 这是允许 *从* JavaScript *调用* 到附加组件原生代码的主要机制。

新创建的函数在此调用后不会自动从脚本中可见。 相反，必须在任何对 JavaScript 可见的对象上显式设置属性，以便可以从脚本访问该函数。

为了将函数公开为附加组件模块导出的一部分，请在 exports 对象上设置新创建的函数。 一个示例模块可能如下所示：

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
给定以上代码，可以从 JavaScript 中使用该附加组件，如下所示：

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
传递给 `require()` 的字符串是 `binding.gyp` 中负责创建 `.node` 文件的目标的名称。

通过 `data` 参数传递给此 API 的任何非 `NULL` 数据都可以与生成的 JavaScript 函数（在 `result` 参数中返回）相关联，并通过将 JavaScript 函数和数据都传递给 [`napi_add_finalizer`](/zh/nodejs/api/n-api#napi_add_finalizer) 并在该函数被垃圾回收时释放。

JavaScript `Function` 在 ECMAScript 语言规范的 [第 19.2 节](https://tc39.github.io/ecma262/#sec-function-objects) 中描述。


### `napi_get_cb_info` {#napi_get_cb_info}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: API 调用的环境。
- `[in] cbinfo`: 传递给回调函数的回调信息。
- `[in-out] argc`: 指定提供的 `argv` 数组的长度，并接收实际的参数计数。 可以选择通过传递 `NULL` 来忽略 `argc`。
- `[out] argv`: `napi_value` 的 C 数组，参数将复制到该数组。 如果参数多于提供的计数，则仅复制所请求数量的参数。 如果提供的参数少于声明的数量，则 `argv` 的其余部分将填充表示 `undefined` 的 `napi_value` 值。 可以选择通过传递 `NULL` 来忽略 `argv`。
- `[out] thisArg`: 接收调用的 JavaScript `this` 参数。 可以选择通过传递 `NULL` 来忽略 `thisArg`。
- `[out] data`: 接收回调的数据指针。 可以选择通过传递 `NULL` 来忽略 `data`。

如果 API 成功，则返回 `napi_ok`。

此方法在回调函数中使用，以从给定的回调信息中检索有关调用的详细信息，如参数和 `this` 指针。

### `napi_get_new_target` {#napi_get_new_target}

**添加于: v8.6.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: API 调用的环境。
- `[in] cbinfo`: 传递给回调函数的回调信息。
- `[out] result`: 构造函数调用的 `new.target`。

如果 API 成功，则返回 `napi_ok`。

此 API 返回构造函数调用的 `new.target`。 如果当前回调不是构造函数调用，则结果为 `NULL`。


### `napi_new_instance` {#napi_new_instance}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: API 被调用的环境。
- `[in] cons`: 代表要作为构造函数调用的 JavaScript 函数的 `napi_value`。
- `[in] argc`: `argv` 数组中的元素计数。
- `[in] argv`: JavaScript 值的数组，作为 `napi_value` 表示构造函数的参数。 如果 `argc` 为零，则可以通过传入 `NULL` 来省略此参数。
- `[out] result`: 表示返回的 JavaScript 对象的 `napi_value`，在本例中是构造的对象。

此方法用于使用给定的 `napi_value` 实例化一个新的 JavaScript 值，该值表示该对象的构造函数。 例如，考虑以下代码段：

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
以下内容可以使用以下代码段在 Node-API 中近似实现：

```C [C]
// 获取构造函数 MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```
如果 API 成功，则返回 `napi_ok`。

## 对象包装 {#object-wrap}

Node-API 提供了一种“包装”C++ 类和实例的方法，以便可以从 JavaScript 调用类构造函数和方法。

对于包装的对象，可能难以区分在类原型上调用的函数和在类的实例上调用的函数。 用于解决此问题的常见模式是保存对类构造函数的持久引用，以供以后进行 `instanceof` 检查。

```C [C]
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // otherwise...
}
```
一旦不再需要该引用，必须释放它。

在某些情况下，`napi_instanceof()` 不足以确保 JavaScript 对象是某种原生类型的包装器。 当包装的 JavaScript 对象通过静态方法（而不是作为原型方法的 `this` 值）传递回插件时，尤其如此。 在这种情况下，它们可能会被错误地解包。

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` 返回一个 JavaScript 对象，该对象包装了一个原生数据库
// 句柄。
const dbHandle = myAddon.openDatabase();

// `query()` 返回一个 JavaScript 对象，该对象包装了一个原生查询句柄。
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// 下面一行中存在意外错误。 `myAddon.queryHasRecords()` 的第一个参数
// 应该是数据库句柄 (`dbHandle`)，而不是查询句柄 (`query`)，因此 while 循环的正确条件
// 应该是
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // 检索记录
}
```
在上面的示例中，`myAddon.queryHasRecords()` 是一种接受两个参数的方法。 第一个是数据库句柄，第二个是查询句柄。 在内部，它会解包第一个参数，并将生成的指针强制转换为原生数据库句柄。 然后，它解包第二个参数，并将生成的指针强制转换为查询句柄。 如果参数的传递顺序错误，则强制转换将起作用，但是，底层数据库操作很有可能会失败，甚至会导致无效的内存访问。

为了确保从第一个参数检索的指针确实是指向数据库句柄的指针，并且类似地，从第二个参数检索的指针确实是指向查询句柄的指针，`queryHasRecords()` 的实现必须执行类型验证。 在 `napi_ref` 中保留从中实例化数据库句柄的 JavaScript 类构造函数和从中实例化查询句柄的构造函数可以提供帮助，因为然后可以使用 `napi_instanceof()` 来确保传递到 `queryHashRecords()` 中的实例确实是正确的类型。

不幸的是，`napi_instanceof()` 无法防止原型操作。 例如，可以将数据库句柄实例的原型设置为查询句柄实例的构造函数的原型。 在这种情况下，数据库句柄实例可以显示为查询句柄实例，并且它将通过查询句柄实例的 `napi_instanceof()` 测试，同时仍然包含指向数据库句柄的指针。

为此，Node-API 提供了类型标记功能。

类型标记是插件唯一的 128 位整数。 Node-API 提供了 `napi_type_tag` 结构来存储类型标记。 当这样的值与存储在 `napi_value` 中的 JavaScript 对象或 [外部](/zh/nodejs/api/n-api#napi_create_external) 一起传递给 `napi_type_tag_object()` 时，JavaScript 对象将被“标记”为类型标记。 “标记”在 JavaScript 方面是不可见的。 当 JavaScript 对象到达原生绑定时，可以将 `napi_check_object_type_tag()` 与原始类型标记一起使用，以确定 JavaScript 对象是否先前已使用类型标记“标记”。 这创建了一种比 `napi_instanceof()` 可以提供的更高保真度的类型检查功能，因为这种类型标记可以在原型操作和插件卸载/重新加载中幸存下来。

继续上面的示例，以下骨架插件实现说明了 `napi_type_tag_object()` 和 `napi_check_object_type_tag()` 的使用。

```C [C]
// 此值是数据库句柄的类型标记。 命令
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// 可用于获取用于初始化结构的两个值。
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// 此值是查询句柄的类型标记。
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // 执行导致数据库句柄的底层操作。
  DatabaseHandle* dbHandle = open_database();

  // 创建一个新的空 JS 对象。
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // 标记该对象以指示它保存指向 `DatabaseHandle` 的指针。
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // 将指向 `DatabaseHandle` 结构的指针存储在 JS 对象中。
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// 稍后，当我们收到声称是数据库句柄的 JavaScript 对象时
// 我们可以使用 `napi_check_object_type_tag()` 来确保它确实是这样的
// 句柄。

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // 检查作为第一个参数传递的对象是否具有先前
  // 应用的标记。
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // 如果不是，则抛出 `TypeError`。
  if (!is_db_handle) {
    // 抛出一个 TypeError。
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```
- `[in] env`: API 调用的环境。
- `[in] utf8name`: JavaScript 构造函数的名字。 为了清晰起见，建议在包装 C++ 类时使用 C++ 类名。
- `[in] length`: `utf8name` 的字节长度，如果它是空终止的，则为 `NAPI_AUTO_LENGTH`。
- `[in] constructor`: 处理类实例构造的回调函数。 当包装 C++ 类时，此方法必须是具有 [`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 签名的静态成员。 不能使用 C++ 类构造函数。 [`napi_callback`](/zh/nodejs/api/n-api#napi_callback) 提供了更多详细信息。
- `[in] data`: 可选数据，作为回调信息的 `data` 属性传递给构造函数回调。
- `[in] property_count`: `properties` 数组参数中的条目数。
- `[in] properties`: 描述类上的静态和实例数据属性、访问器和方法的属性描述符数组。 参见 `napi_property_descriptor`。
- `[out] result`: 代表类的构造函数的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

定义一个 JavaScript 类，包括：

- 具有类名的 JavaScript 构造函数。 当包装对应的 C++ 类时，通过 `constructor` 传递的回调可用于实例化一个新的 C++ 类实例，然后可以使用 [`napi_wrap`](/zh/nodejs/api/n-api#napi_wrap) 将其放置在正在构造的 JavaScript 对象实例中。
- 构造函数上的属性，其实现可以调用 C++ 类的相应*静态*数据属性、访问器和方法（由带有 `napi_static` 属性的属性描述符定义）。
- 构造函数的 `prototype` 对象上的属性。 当包装 C++ 类时，在检索使用 [`napi_unwrap`](/zh/nodejs/api/n-api#napi_unwrap) 放置在 JavaScript 对象实例中的 C++ 类实例之后，可以从属性描述符中给出的没有 `napi_static` 属性的静态函数中调用 C++ 类的*非静态*数据属性、访问器和方法。

当包装 C++ 类时，通过 `constructor` 传递的 C++ 构造函数回调应是类上的静态方法，该方法调用实际的类构造函数，然后将新的 C++ 实例包装在 JavaScript 对象中，并返回包装对象。 详情请参见 [`napi_wrap`](/zh/nodejs/api/n-api#napi_wrap)。

从 [`napi_define_class`](/zh/nodejs/api/n-api#napi_define_class) 返回的 JavaScript 构造函数通常被保存并在以后用于从原生代码构造类的新实例，和/或检查提供的值是否是类的实例。 在这种情况下，为了防止函数值被垃圾回收，可以使用 [`napi_create_reference`](/zh/nodejs/api/n-api#napi_create_reference) 创建对它的强持久引用，确保引用计数保持 >= 1。

任何通过 `data` 参数或通过 `napi_property_descriptor` 数组项的 `data` 字段传递给此 API 的非 `NULL` 数据都可以与生成的 JavaScript 构造函数（在 `result` 参数中返回）相关联，并且每当通过将 JavaScript 函数和数据传递给 [`napi_add_finalizer`](/zh/nodejs/api/n-api#napi_add_finalizer) 来垃圾回收该类时，都可以释放该数据。


### `napi_wrap` {#napi_wrap}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: API 在其下调用的环境。
- `[in] js_object`: 将作为原生对象包装器的 JavaScript 对象。
- `[in] native_object`: 将包装在 JavaScript 对象中的原生实例。
- `[in] finalize_cb`: 可选的原生回调，可用于在 JavaScript 对象被垃圾回收时释放原生实例。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_hint`: 可选的上下文提示，传递给 finalize 回调。
- `[out] result`: 可选的对包装对象的引用。

如果 API 成功，则返回 `napi_ok`。

将原生实例包装在 JavaScript 对象中。 稍后可以使用 `napi_unwrap()` 检索原生实例。

当 JavaScript 代码调用使用 `napi_define_class()` 定义的类的构造函数时，将调用构造函数的 `napi_callback`。 在构造原生类的实例后，回调必须调用 `napi_wrap()` 以将新构造的实例包装到已经是构造函数回调的 `this` 参数的 JavaScript 对象中。（`this` 对象是从构造函数的 `prototype` 创建的，因此它已经具有所有实例属性和方法的定义。）

通常，在包装类实例时，应提供一个 finalize 回调，该回调仅删除作为 `data` 参数接收的原生实例到 finalize 回调。

可选的返回引用最初是弱引用，这意味着它的引用计数为 0。 通常，在需要实例保持有效状态的异步操作期间，此引用计数将暂时递增。

*注意*：可选的返回引用（如果获得）应仅在响应 finalize 回调调用时通过 [`napi_delete_reference`](/zh/nodejs/api/n-api#napi_delete_reference) 删除。 如果在此之前将其删除，则可能永远不会调用 finalize 回调。 因此，当获取引用时，还需要一个 finalize 回调，以便能够正确处理该引用。

Finalizer 回调可能会被延迟，从而留下一个窗口，在该窗口中，对象已被垃圾回收（并且弱引用无效），但尚未调用 finalizer。 在对 `napi_wrap()` 返回的弱引用使用 `napi_get_reference_value()` 时，您仍然应该处理空结果。

在对象上第二次调用 `napi_wrap()` 将返回错误。 要将另一个原生实例与对象关联，请先使用 `napi_remove_wrap()`。


### `napi_unwrap` {#napi_unwrap}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: API 被调用的环境。
- `[in] js_object`: 与原生实例关联的对象。
- `[out] result`: 指向被包装的原生实例的指针。

如果 API 成功，则返回 `napi_ok`。

检索先前使用 `napi_wrap()` 包装在 JavaScript 对象中的原生实例。

当 JavaScript 代码在类上调用方法或属性访问器时，将调用相应的 `napi_callback`。 如果回调是针对实例方法或访问器的，则回调的 `this` 参数是包装器对象； 然后可以通过在包装器对象上调用 `napi_unwrap()` 来获取作为调用目标的包装的 C++ 实例。

### `napi_remove_wrap` {#napi_remove_wrap}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: API 被调用的环境。
- `[in] js_object`: 与原生实例关联的对象。
- `[out] result`: 指向被包装的原生实例的指针。

如果 API 成功，则返回 `napi_ok`。

检索先前使用 `napi_wrap()` 包装在 JavaScript 对象 `js_object` 中的原生实例，并移除包装。 如果终结回调与包装相关联，则当 JavaScript 对象被垃圾回收时，将不再调用它。

### `napi_type_tag_object` {#napi_type_tag_object}

**添加于: v14.8.0, v12.19.0**

**N-API 版本: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: API 被调用的环境。
- `[in] js_object`: 要标记的 JavaScript 对象或 [external](/zh/nodejs/api/n-api#napi_create_external)。
- `[in] type_tag`: 用于标记对象的标签。

如果 API 成功，则返回 `napi_ok`。

将 `type_tag` 指针的值与 JavaScript 对象或 [external](/zh/nodejs/api/n-api#napi_create_external) 关联起来。 然后可以使用 `napi_check_object_type_tag()` 来比较附加到对象的标签与插件拥有的标签，以确保对象具有正确的类型。

如果该对象已经有关联的类型标签，则此 API 将返回 `napi_invalid_arg`。


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**添加于: v14.8.0, v12.19.0**

**N-API 版本: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] js_object`: 要检查其类型标签的 JavaScript 对象或 [外部对象](/zh/nodejs/api/n-api#napi_create_external)。
- `[in] type_tag`: 用于与对象上找到的任何标签进行比较的标签。
- `[out] result`: 给定的类型标签是否与对象上的类型标签匹配。 如果在对象上未找到类型标签，则也返回 `false`。

如果 API 成功，则返回 `napi_ok`。

将作为 `type_tag` 给出的指针与在 `js_object` 上找到的任何指针进行比较。 如果在 `js_object` 上未找到标签，或者如果找到了标签但不匹配 `type_tag`，则将 `result` 设置为 `false`。 如果找到标签并且它与 `type_tag` 匹配，则将 `result` 设置为 `true`。

### `napi_add_finalizer` {#napi_add_finalizer}

**添加于: v8.0.0**

**N-API 版本: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] js_object`: 要将本机数据附加到的 JavaScript 对象。
- `[in] finalize_data`: 要传递给 `finalize_cb` 的可选数据。
- `[in] finalize_cb`: 当 JavaScript 对象已被垃圾回收时，将用于释放本机数据的本机回调。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_hint`: 传递给终结回调的可选上下文提示。
- `[out] result`: 对 JavaScript 对象的可选引用。

如果 API 成功，则返回 `napi_ok`。

添加一个 `napi_finalize` 回调，该回调将在 `js_object` 中的 JavaScript 对象被垃圾回收时调用。

可以在单个 JavaScript 对象上多次调用此 API。

*注意*: 可选的返回引用（如果已获取）应仅响应终结回调调用，才通过 [`napi_delete_reference`](/zh/nodejs/api/n-api#napi_delete_reference) 删除。 如果在此之前删除，则可能永远不会调用终结回调。 因此，当获取引用时，还需要终结回调才能正确处理引用。


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**加入于: v21.0.0, v20.10.0, v18.19.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: 调用 API 的环境。
- `[in] finalize_cb`: 当 JavaScript 对象被垃圾回收时，用于释放本机数据的原生回调。 [`napi_finalize`](/zh/nodejs/api/n-api#napi_finalize) 提供了更多详细信息。
- `[in] finalize_data`: 可选数据，传递给 `finalize_cb`。
- `[in] finalize_hint`: 可选的上下文提示，传递给终结器回调。

如果 API 成功，则返回 `napi_ok`。

安排一个 `napi_finalize` 回调，以便在事件循环中异步调用。

通常，终结器在 GC（垃圾收集器）收集对象时被调用。 此时，调用任何可能导致 GC 状态发生变化的 Node-API 将被禁用，并导致 Node.js 崩溃。

`node_api_post_finalizer` 通过允许附加组件将此类 Node-API 的调用推迟到 GC 终结之外的时间点，从而有助于解决此限制。

## 简单的异步操作 {#simple-asynchronous-operations}

插件模块通常需要利用 libuv 中的异步辅助程序作为其实现的一部分。 这允许他们安排要异步执行的工作，以便他们的方法可以在工作完成之前返回。 这使他们能够避免阻塞 Node.js 应用程序的整体执行。

Node-API 为这些支持函数提供了一个 ABI 稳定的接口，该接口涵盖了最常见的异步用例。

Node-API 定义了 `napi_async_work` 结构，该结构用于管理异步工作器。 实例使用 [`napi_create_async_work`](/zh/nodejs/api/n-api#napi_create_async_work) 和 [`napi_delete_async_work`](/zh/nodejs/api/n-api#napi_delete_async_work) 创建/删除。

`execute` 和 `complete` 回调函数分别是执行器准备好执行时和完成其任务时将调用的函数。

`execute` 函数应避免进行任何可能导致 JavaScript 执行或与 JavaScript 对象交互的 Node-API 调用。 最常见的是，任何需要进行 Node-API 调用的代码都应该在 `complete` 回调中进行。 避免在 execute 回调中使用 `napi_env` 参数，因为它可能会执行 JavaScript。

这些函数实现了以下接口：

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
当调用这些方法时，传递的 `data` 参数将是插件提供的 `void*` 数据，该数据已传递到 `napi_create_async_work` 调用中。

创建后，可以使用 [`napi_queue_async_work`](/zh/nodejs/api/n-api#napi_queue_async_work) 函数将异步工作器排队以供执行：

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
如果需要在工作开始执行之前取消工作，可以使用 [`napi_cancel_async_work`](/zh/nodejs/api/n-api#napi_cancel_async_work)。

调用 [`napi_cancel_async_work`](/zh/nodejs/api/n-api#napi_cancel_async_work) 后，将使用 `napi_cancelled` 的状态值调用 `complete` 回调。 即使已取消工作，也不应在 `complete` 回调调用之前删除工作。


### `napi_create_async_work` {#napi_create_async_work}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.6.0 | 添加了 `async_resource` 和 `async_resource_name` 参数。 |
| v8.0.0 | 添加于：v8.0.0 |
:::

**N-API 版本: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: API 调用的环境。
- `[in] async_resource`: 与异步工作关联的可选对象，该对象将传递给可能的 `async_hooks` [`init` 钩子](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)。
- `[in] async_resource_name`: 用于诊断信息的资源类型的标识符，由 `async_hooks` API 公开。
- `[in] execute`: 应该调用以异步执行逻辑的本地函数。 给定的函数从工作池线程调用，并且可以与主事件循环线程并行执行。
- `[in] complete`: 异步逻辑完成或取消时将调用的本地函数。 给定的函数从主事件循环线程调用。 [`napi_async_complete_callback`](/zh/nodejs/api/n-api#napi_async_complete_callback) 提供了更多详细信息。
- `[in] data`: 用户提供的数据上下文。 这将被传递回 execute 和 complete 函数。
- `[out] result`: `napi_async_work*`，它是新创建的异步工作的句柄。

如果 API 成功，则返回 `napi_ok`。

此 API 分配一个工作对象，该对象用于异步执行逻辑。 一旦不再需要该工作，就应该使用 [`napi_delete_async_work`](/zh/nodejs/api/n-api#napi_delete_async_work) 释放它。

`async_resource_name` 应该是一个以 null 结尾的 UTF-8 编码的字符串。

`async_resource_name` 标识符由用户提供，应代表正在执行的异步工作的类型。 还建议将命名空间应用于标识符，例如，通过包含模块名称。 有关更多信息，请参见 [`async_hooks` 文档](/zh/nodejs/api/async_hooks#type)。


### `napi_delete_async_work` {#napi_delete_async_work}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: 调用 API 的环境。
- `[in] work`: 调用 `napi_create_async_work` 返回的句柄。

如果 API 成功，则返回 `napi_ok`。

此 API 释放先前分配的工作对象。

即使存在待处理的 JavaScript 异常，也可以调用此 API。

### `napi_queue_async_work` {#napi_queue_async_work}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: 调用 API 的环境。
- `[in] work`: 调用 `napi_create_async_work` 返回的句柄。

如果 API 成功，则返回 `napi_ok`。

此 API 请求调度先前分配的工作以执行。 一旦成功返回，就不得再使用同一个 `napi_async_work` 项目调用此 API，否则结果将是未定义的。

### `napi_cancel_async_work` {#napi_cancel_async_work}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: 调用 API 的环境。
- `[in] work`: 调用 `napi_create_async_work` 返回的句柄。

如果 API 成功，则返回 `napi_ok`。

如果已排队的工作尚未启动，则此 API 将取消该工作。 如果它已经开始执行，则无法取消，并且将返回 `napi_generic_failure`。 如果成功，则将使用 `napi_cancelled` 的状态值调用 `complete` 回调。 即使已成功取消，也不应在 `complete` 回调调用之前删除该工作。

即使存在待处理的 JavaScript 异常，也可以调用此 API。

## 自定义异步操作 {#custom-asynchronous-operations}

上述简单的异步工作 API 可能并不适用于所有场景。 当使用任何其他异步机制时，以下 API 是必要的，以确保运行时正确跟踪异步操作。


### `napi_async_init` {#napi_async_init}

**加入于: v8.6.0**

**N-API 版本: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: API 在其下调用的环境。
- `[in] async_resource`: 与异步工作相关的对象，该对象将传递给可能的 `async_hooks` [`init` 钩子](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)，并且可以通过 [`async_hooks.executionAsyncResource()`](/zh/nodejs/api/async_hooks#async_hooksexecutionasyncresource) 访问。
- `[in] async_resource_name`: 用于通过 `async_hooks` API 公开的诊断信息提供的资源类型标识符。
- `[out] result`: 初始化后的异步上下文。

如果 API 成功，则返回 `napi_ok`。

`async_resource` 对象需要保持存活直到 [`napi_async_destroy`](/zh/nodejs/api/n-api#napi_async_destroy)，以保持 `async_hooks` 相关 API 的行为正确。 为了保留与以前版本的 ABI 兼容性，`napi_async_context` 不会维护对 `async_resource` 对象的强引用，以避免引入内存泄漏。 但是，如果在 `napi_async_context` 被 `napi_async_destroy` 销毁之前，`async_resource` 被 JavaScript 引擎垃圾回收，则调用 `napi_async_context` 相关 API（例如 [`napi_open_callback_scope`](/zh/nodejs/api/n-api#napi_open_callback_scope) 和 [`napi_make_callback`](/zh/nodejs/api/n-api#napi_make_callback)）可能会导致问题，例如在使用 `AsyncLocalStorage` API 时丢失异步上下文。

为了保留与以前版本的 ABI 兼容性，为 `async_resource` 传递 `NULL` 不会导致错误。 但是，不建议这样做，因为这将导致 `async_hooks` [`init` 钩子](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) 和 `async_hooks.executionAsyncResource()` 出现不良行为，因为底层 `async_hooks` 实现现在需要该资源，以便提供异步回调之间的链接。


### `napi_async_destroy` {#napi_async_destroy}

**添加于: v8.6.0**

**N-API 版本: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: API 调用的环境。
- `[in] async_context`: 要销毁的异步上下文。

如果 API 成功，则返回 `napi_ok`。

即使存在待处理的 JavaScript 异常，也可以调用此 API。

### `napi_make_callback` {#napi_make_callback}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v8.6.0 | 添加了 `async_context` 参数。 |
| v8.0.0 | 添加于: v8.0.0 |
:::

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: API 调用的环境。
- `[in] async_context`: 调用回调的异步操作的上下文。 这通常应该是先前从 [`napi_async_init`](/zh/nodejs/api/n-api#napi_async_init) 获取的值。 为了保持与先前版本的 ABI 兼容性，将 `NULL` 传递给 `async_context` 不会导致错误。 但是，这会导致异步钩子的不正确操作。 潜在的问题包括在使用 `AsyncLocalStorage` API 时丢失异步上下文。
- `[in] recv`: 传递给被调用函数的 `this` 值。
- `[in] func`: 表示要调用的 JavaScript 函数的 `napi_value`。
- `[in] argc`: `argv` 数组中元素的计数。
- `[in] argv`: 作为 `napi_value` 的 JavaScript 值数组，表示函数的参数。 如果 `argc` 为零，则可以通过传入 `NULL` 来省略此参数。
- `[out] result`: 表示返回的 JavaScript 对象的 `napi_value`。

如果 API 成功，则返回 `napi_ok`。

此方法允许从本机插件调用 JavaScript 函数对象。 此 API 类似于 `napi_call_function`。 但是，它用于在从异步操作返回 *后* （当堆栈上没有其他脚本时）， *从* 本机代码调用 *回* JavaScript。 它是 `node::MakeCallback` 周围一个相当简单的包装器。

请注意，从 `napi_async_complete_callback` 中使用 `napi_make_callback` *不是* 必需的； 在这种情况下，回调的异步上下文已经设置好，因此直接调用 `napi_call_function` 就足够且合适。 在实现不使用 `napi_create_async_work` 的自定义异步行为时，可能需要使用 `napi_make_callback` 函数。

回调期间 JavaScript 在微任务队列上调度的任何 `process.nextTick` 或 Promise 都会在返回 C/C++ 之前运行。


### `napi_open_callback_scope` {#napi_open_callback_scope}

**添加于: v9.6.0**

**N-API 版本: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: 调用 API 的环境。
- `[in] resource_object`: 与将传递给可能的 `async_hooks` [`init` 钩子](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) 的异步工作相关联的对象。此参数已被弃用，并在运行时被忽略。请改用 [`napi_async_init`](/zh/nodejs/api/n-api#napi_async_init) 中的 `async_resource` 参数。
- `[in] context`: 调用回调的异步操作的上下文。 这应该是一个先前从 [`napi_async_init`](/zh/nodejs/api/n-api#napi_async_init) 获得的值。
- `[out] result`: 新创建的作用域。

在某些情况下（例如，解决 promise），在进行某些 Node-API 调用时，必须具有与回调关联的作用域的等效项。 如果堆栈上没有其他脚本，则可以使用 [`napi_open_callback_scope`](/zh/nodejs/api/n-api#napi_open_callback_scope) 和 [`napi_close_callback_scope`](/zh/nodejs/api/n-api#napi_close_callback_scope) 函数来打开/关闭所需的作用域。

### `napi_close_callback_scope` {#napi_close_callback_scope}

**添加于: v9.6.0**

**N-API 版本: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: 调用 API 的环境。
- `[in] scope`: 要关闭的作用域。

即使存在未决的 JavaScript 异常，也可以调用此 API。

## 版本管理 {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**添加于: v8.4.0**

**N-API 版本: 1**

```C [C]
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```
- `[in] env`: 调用 API 的环境。
- `[out] version`: 指向 Node.js 本身的版本信息的指针。

如果 API 成功，则返回 `napi_ok`。

此函数使用当前正在运行的 Node.js 的主版本、次版本和补丁版本填充 `version` 结构体，并使用 [`process.release.name`](/zh/nodejs/api/process#processrelease) 的值填充 `release` 字段。

返回的缓冲区是静态分配的，不需要释放。


### `napi_get_version` {#napi_get_version}

**添加于: v8.0.0**

**N-API 版本: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: API 调用的环境。
- `[out] result`: 支持的最高 Node-API 版本。

如果 API 成功，则返回 `napi_ok`。

此 API 返回 Node.js 运行时支持的最高 Node-API 版本。 Node-API 计划是累加的，这样 Node.js 的较新版本可以支持额外的 API 函数。 为了允许插件在使用支持它的 Node.js 版本运行时使用较新的函数，同时在使用不支持它的 Node.js 版本运行时提供回退行为：

- 调用 `napi_get_version()` 来确定 API 是否可用。
- 如果可用，使用 `uv_dlsym()` 动态加载指向该函数的指针。
- 使用动态加载的指针来调用该函数。
- 如果该函数不可用，则提供不使用该函数的替代实现。

## 内存管理 {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: API 调用的环境。
- `[in] change_in_bytes`: 由 JavaScript 对象保持活动的外部分配内存的更改量。
- `[out] result`: 调整后的值

如果 API 成功，则返回 `napi_ok`。

此函数向 V8 指示由 JavaScript 对象保持活动的外部分配内存量（即，指向由原生插件分配的自身内存的 JavaScript 对象）。 注册外部分配的内存将比其他情况更频繁地触发全局垃圾收集。

## Promises {#promises}

Node-API 提供了创建 `Promise` 对象的工具，如 ECMA 规范的 [Section 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) 中所述。 它将 promises 实现为一对对象。 当 `napi_create_promise()` 创建 promise 时，将创建一个 "deferred" 对象并与 `Promise` 一起返回。 deferred 对象绑定到创建的 `Promise`，并且是使用 `napi_resolve_deferred()` 或 `napi_reject_deferred()` 解析或拒绝 `Promise` 的唯一手段。 由 `napi_create_promise()` 创建的 deferred 对象由 `napi_resolve_deferred()` 或 `napi_reject_deferred()` 释放。 `Promise` 对象可以返回给 JavaScript，在那里可以像往常一样使用它。

例如，要创建一个 promise 并将其传递给异步 worker：

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// 创建 promise。
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// 将 deferred 传递给执行异步操作的函数。
do_something_asynchronous(deferred);

// 将 promise 返回给 JS
return promise;
```
上面的函数 `do_something_asynchronous()` 将执行其异步操作，然后它将解析或拒绝 deferred，从而结束 promise 并释放 deferred：

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// 创建一个用于结束 deferred 的值。
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// 根据异步操作是否成功，解析或拒绝与 deferred 关联的 promise。
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// 此时 deferred 已被释放，因此我们应该将其赋值为 NULL。
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: 调用 API 的环境。
- `[out] deferred`: 新创建的延迟对象，稍后可以将其传递给 `napi_resolve_deferred()` 或 `napi_reject_deferred()` 以分别解析或拒绝关联的 Promise。
- `[out] promise`: 与延迟对象关联的 JavaScript Promise。

如果 API 成功，则返回 `napi_ok`。

此 API 创建一个延迟对象和一个 JavaScript Promise。

### `napi_resolve_deferred` {#napi_resolve_deferred}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: 调用 API 的环境。
- `[in] deferred`: 要解析其关联 Promise 的延迟对象。
- `[in] resolution`: 用于解析 Promise 的值。

此 API 通过与其关联的延迟对象来解析 JavaScript Promise。 因此，它只能用于解析可以获得相应延迟对象的 JavaScript Promise。 这实际上意味着 Promise 必须使用 `napi_create_promise()` 创建，并且必须保留从该调用返回的延迟对象才能传递给此 API。

延迟对象在成功完成后被释放。

### `napi_reject_deferred` {#napi_reject_deferred}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: 调用 API 的环境。
- `[in] deferred`: 要解析其关联 Promise 的延迟对象。
- `[in] rejection`: 用于拒绝 Promise 的值。

此 API 通过与其关联的延迟对象来拒绝 JavaScript Promise。 因此，它只能用于拒绝可以获得相应延迟对象的 JavaScript Promise。 这实际上意味着 Promise 必须使用 `napi_create_promise()` 创建，并且必须保留从该调用返回的延迟对象才能传递给此 API。

延迟对象在成功完成后被释放。


### `napi_is_promise` {#napi_is_promise}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: 调用 API 的环境。
- `[in] value`: 要检查的值。
- `[out] is_promise`: 标志，指示 `promise` 是否为原生 promise 对象（即由底层引擎创建的 promise 对象）。

## 脚本执行 {#script-execution}

Node-API 提供了一个 API，用于使用底层 JavaScript 引擎执行包含 JavaScript 的字符串。

### `napi_run_script` {#napi_run_script}

**添加于: v8.5.0**

**N-API 版本: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] script`: 包含要执行的脚本的 JavaScript 字符串。
- `[out] result`: 执行脚本后的结果值。

此函数执行一段 JavaScript 代码并返回其结果，但需要注意以下几点：

- 与 `eval` 不同，此函数不允许脚本访问当前的词法作用域，因此也不允许访问[模块作用域](/zh/nodejs/api/modules#the-module-scope)，这意味着伪全局变量（如 `require`）将不可用。
- 脚本可以访问[全局作用域](/zh/nodejs/api/globals)。 脚本中的函数和 `var` 声明将添加到 [`global`](/zh/nodejs/api/globals#global) 对象。 使用 `let` 和 `const` 进行的变量声明在全局范围内可见，但不会添加到 [`global`](/zh/nodejs/api/globals#global) 对象。
- 在脚本中，`this` 的值为 [`global`](/zh/nodejs/api/globals#global)。

## libuv 事件循环 {#libuv-event-loop}

Node-API 提供了一个函数，用于获取与特定 `napi_env` 关联的当前事件循环。

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**添加于: v9.3.0, v8.10.0**

**N-API 版本: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: 调用 API 的环境。
- `[out] loop`: 当前 libuv 循环实例。

注意：虽然 libuv 随着时间的推移相对稳定，但它不提供 ABI 稳定性保证。 应避免使用此功能。 使用它可能会导致插件无法跨 Node.js 版本工作。 [异步线程安全函数调用](/zh/nodejs/api/n-api#asynchronous-thread-safe-function-calls) 是许多用例的替代方案。


## 异步线程安全函数调用 {#asynchronous-thread-safe-function-calls}

JavaScript 函数通常只能从原生插件的主线程调用。如果插件创建了额外的线程，那么需要 `napi_env`、`napi_value` 或 `napi_ref` 的 Node-API 函数不能从这些线程调用。

当插件有额外的线程，并且需要根据这些线程完成的处理来调用 JavaScript 函数时，这些线程必须与插件的主线程通信，以便主线程可以代表它们调用 JavaScript 函数。线程安全函数 API 提供了一种简单的方法来实现这一点。

这些 API 提供了 `napi_threadsafe_function` 类型，以及创建、销毁和调用此类型对象的 API。`napi_create_threadsafe_function()` 创建对 `napi_value` 的持久引用，该引用保存一个可以从多个线程调用的 JavaScript 函数。这些调用是异步发生的。这意味着调用 JavaScript 回调的值将被放置在一个队列中，并且对于队列中的每个值，最终都会对 JavaScript 函数进行调用。

在创建 `napi_threadsafe_function` 时，可以提供一个 `napi_finalize` 回调。当线程安全函数即将被销毁时，将在主线程上调用此回调。它接收在构造期间给定的上下文和完成数据，并提供在线程之后进行清理的机会，例如通过调用 `uv_thread_join()`。**除了主循环线程外，在完成回调完成后，任何线程都不应使用线程安全函数。**

可以通过调用 `napi_get_threadsafe_function_context()` 从任何线程检索在调用 `napi_create_threadsafe_function()` 期间给定的 `context`。

### 调用线程安全函数 {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()` 可用于启动对 JavaScript 的调用。`napi_call_threadsafe_function()` 接受一个参数，该参数控制 API 的行为是否阻塞。如果设置为 `napi_tsfn_nonblocking`，则 API 的行为是非阻塞的，如果队列已满，则返回 `napi_queue_full`，从而阻止数据成功添加到队列中。如果设置为 `napi_tsfn_blocking`，则 API 会阻塞，直到队列中有可用空间。如果线程安全函数创建时最大队列大小为 0，则 `napi_call_threadsafe_function()` 永远不会阻塞。

不应从 JavaScript 线程使用 `napi_tsfn_blocking` 调用 `napi_call_threadsafe_function()`，因为如果队列已满，可能会导致 JavaScript 线程死锁。

对 JavaScript 的实际调用由通过 `call_js_cb` 参数给定的回调控制。对于通过成功调用 `napi_call_threadsafe_function()` 放置到队列中的每个值，`call_js_cb` 在主线程上调用一次。如果未给出此类回调，则将使用默认回调，并且生成的 JavaScript 调用将没有参数。`call_js_cb` 回调在其参数中接收要调用的 JavaScript 函数作为 `napi_value`，以及创建 `napi_threadsafe_function` 时使用的 `void*` 上下文指针，以及由辅助线程之一创建的下一个数据指针。然后，回调可以使用诸如 `napi_call_function()` 之类的 API 调用 JavaScript。

也可以调用回调，并将 `env` 和 `call_js_cb` 都设置为 `NULL`，以指示不再可能调用 JavaScript，而队列中仍保留可能需要释放的项目。当 Node.js 进程退出时，通常会发生这种情况，而线程安全函数仍在活动状态。

无需通过 `napi_make_callback()` 调用 JavaScript，因为 Node-API 在适合回调的上下文中运行 `call_js_cb`。

在事件循环的每个滴答声中，可能会调用零个或多个排队的项目。应用程序不应依赖于特定行为，除了在调用回调时会取得进展，并且随着时间的推移将调用事件。


### 线程安全函数的引用计数 {#reference-counting-of-thread-safe-functions}

线程可以在 `napi_threadsafe_function` 对象的生命周期内被添加和移除。因此，除了在创建时指定初始线程数之外，还可以调用 `napi_acquire_threadsafe_function` 来表明一个新线程将开始使用该线程安全函数。类似地，可以调用 `napi_release_threadsafe_function` 来表明一个现有线程将停止使用该线程安全函数。

当每个使用该对象的线程都已调用 `napi_release_threadsafe_function()` 或者在响应 `napi_call_threadsafe_function` 的调用时收到了 `napi_closing` 的返回状态时，`napi_threadsafe_function` 对象将被销毁。队列会在 `napi_threadsafe_function` 被销毁之前被清空。`napi_release_threadsafe_function()` 应该是与给定的 `napi_threadsafe_function` 相关的最后一个 API 调用，因为在调用完成后，不能保证 `napi_threadsafe_function` 仍然被分配。出于同样的原因，在响应 `napi_call_threadsafe_function` 的调用时收到 `napi_closing` 的返回值后，不要再使用线程安全函数。与 `napi_threadsafe_function` 相关联的数据可以在传递给 `napi_create_threadsafe_function()` 的 `napi_finalize` 回调中被释放。`napi_create_threadsafe_function` 的参数 `initial_thread_count` 标记了线程安全函数的初始获取数量，而不是在创建时多次调用 `napi_acquire_threadsafe_function`。

一旦使用 `napi_threadsafe_function` 的线程数达到零，就不能再通过调用 `napi_acquire_threadsafe_function()` 来启动使用它的线程。实际上，所有后续与其相关的 API 调用（除了 `napi_release_threadsafe_function()`）都将返回 `napi_closing` 的错误值。

可以通过给 `napi_release_threadsafe_function()` 赋值 `napi_tsfn_abort` 来“中止”线程安全函数。即使在其引用计数达到零之前，这将导致所有后续与线程安全函数相关的 API（除了 `napi_release_threadsafe_function()`）返回 `napi_closing`。特别是，`napi_call_threadsafe_function()` 将返回 `napi_closing`，从而通知线程不再可能对线程安全函数进行异步调用。这可以用作终止线程的标准。**从 <code>napi_call_threadsafe_function()</code> 接收到 <code>napi_closing</code> 的返回值后，线程不得再使用线程安全函数，因为不再保证它已被分配。**


### 决定是否保持进程运行 {#deciding-whether-to-keep-the-process-running}

与 libuv 句柄类似，线程安全函数可以被“引用”和“取消引用”。“已引用”的线程安全函数将导致创建它的线程上的事件循环保持活动状态，直到线程安全函数被销毁。相反，“未引用”的线程安全函数不会阻止事件循环退出。为此，存在 API `napi_ref_threadsafe_function` 和 `napi_unref_threadsafe_function`。

`napi_unref_threadsafe_function` 既不将线程安全函数标记为可以销毁，`napi_ref_threadsafe_function` 也不阻止它被销毁。

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v12.6.0, v10.17.0 | 将 `func` 参数设置为可选，并提供自定义 `call_js_cb`。 |
| v10.6.0 | 添加于：v10.6.0 |
:::

**N-API 版本：4**

```C [C]
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```
- `[in] env`: 调用 API 的环境。
- `[in] func`: 一个可选的 JavaScript 函数，用于从另一个线程调用。 如果将 `NULL` 传递给 `call_js_cb`，则必须提供它。
- `[in] async_resource`: 与异步工作关联的可选对象，将传递给可能的 `async_hooks` [`init` 钩子](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)。
- `[in] async_resource_name`: 一个 JavaScript 字符串，用于为 `async_hooks` API 公开的诊断信息提供正在提供的资源类型的标识符。
- `[in] max_queue_size`: 队列的最大大小。 `0` 表示没有限制。
- `[in] initial_thread_count`: 获取的初始数量，即包括主线程在内的将使用此函数的线程的初始数量。
- `[in] thread_finalize_data`: 要传递给 `thread_finalize_cb` 的可选数据。
- `[in] thread_finalize_cb`: 可选函数，在销毁 `napi_threadsafe_function` 时调用。
- `[in] context`: 要附加到生成的 `napi_threadsafe_function` 的可选数据。
- `[in] call_js_cb`: 可选的回调函数，用于响应来自不同线程的调用来调用 JavaScript 函数。 将在主线程上调用此回调函数。 如果未提供，则将调用 JavaScript 函数，且不带任何参数，并以 `undefined` 作为其 `this` 值。 [`napi_threadsafe_function_call_js`](/zh/nodejs/api/n-api#napi_threadsafe_function_call_js) 提供了更多详细信息。
- `[out] result`: 异步线程安全 JavaScript 函数。

**变更历史：**

- 实验性（定义了 `NAPI_EXPERIMENTAL`）：在 `call_js_cb` 中抛出的未捕获异常将通过 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件处理，而不是被忽略。


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**添加于: v10.6.0**

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: 要检索上下文的线程安全函数。
- `[out] result`: 存储上下文的位置。

可以从任何使用 `func` 的线程调用此 API。

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0 | 恢复了对 `napi_would_deadlock` 的支持。 |
| v14.1.0 | 当从主线程或工作线程使用 `napi_tsfn_blocking` 调用且队列已满时，返回 `napi_would_deadlock`。 |
| v10.6.0 | 添加于: v10.6.0 |
:::

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: 要调用的异步线程安全 JavaScript 函数。
- `[in] data`: 通过在创建线程安全 JavaScript 函数期间提供的回调 `call_js_cb` 发送到 JavaScript 的数据。
- `[in] is_blocking`: 标志，其值可以是 `napi_tsfn_blocking`，表示如果队列已满，则调用应阻塞；也可以是 `napi_tsfn_nonblocking`，表示只要队列已满，调用应立即返回，状态为 `napi_queue_full`。

不应从 JavaScript 线程使用 `napi_tsfn_blocking` 调用此 API，因为如果队列已满，则可能会导致 JavaScript 线程死锁。

如果从任何线程使用设置为 `napi_tsfn_abort` 的 `abort` 调用了 `napi_release_threadsafe_function()`，则此 API 将返回 `napi_closing`。 仅当 API 返回 `napi_ok` 时，该值才会添加到队列中。

可以从任何使用 `func` 的线程调用此 API。

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**添加于: v10.6.0**

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: 要开始使用的异步线程安全 JavaScript 函数。

线程应在将 `func` 传递给任何其他线程安全函数 API 之前调用此 API，以表明它将使用 `func`。 这可以防止在所有其他线程都停止使用 `func` 时销毁 `func`。

可以从任何将开始使用 `func` 的线程调用此 API。


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**添加于: v10.6.0**

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: 要递减其引用计数的异步线程安全 JavaScript 函数。
- `[in] mode`: 标志，其值可以是 `napi_tsfn_release`，表示当前线程将不再调用线程安全函数；也可以是 `napi_tsfn_abort`，表示除了当前线程之外，其他线程也不应再调用线程安全函数。 如果设置为 `napi_tsfn_abort`，则进一步调用 `napi_call_threadsafe_function()` 将返回 `napi_closing`，并且不会再将任何值放入队列。

当线程停止使用 `func` 时，应该调用此 API。 在调用此 API 后将 `func` 传递给任何线程安全 API 都会产生未定义的结果，因为 `func` 可能已被销毁。

此 API 可以从任何将停止使用 `func` 的线程调用。

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**添加于: v10.6.0**

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: 调用 API 的环境。
- `[in] func`: 要引用的线程安全函数。

此 API 用于指示在 `func` 被销毁之前，在主线程上运行的事件循环不应退出。 与 [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref) 类似，它也是幂等的。

`napi_unref_threadsafe_function` 既不会将线程安全函数标记为可以被销毁，`napi_ref_threadsafe_function` 也不会阻止它被销毁。 `napi_acquire_threadsafe_function` 和 `napi_release_threadsafe_function` 可用于此目的。

此 API 只能从主线程调用。

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**添加于: v10.6.0**

**N-API 版本: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: 调用 API 的环境。
- `[in] func`: 要取消引用的线程安全函数。

此 API 用于指示在 `func` 被销毁之前，在主线程上运行的事件循环可以退出。 与 [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref) 类似，它也是幂等的。

此 API 只能从主线程调用。


## 其他实用工具 {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**加入于: v15.9.0, v14.18.0, v12.22.0**

**N-API 版本: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: 调用 API 的环境。
- `[out] result`: 一个 URL，包含加载插件的绝对路径。对于本地文件系统上的文件，它将以 `file://` 开头。该字符串以 null 结尾，并由 `env` 拥有，因此不得修改或释放。

如果在加载过程中，插件加载进程未能确定插件的文件名，则 `result` 可能为空字符串。

