---
title: Node.js 插件
description: 了解如何使用 C++ 创建 Node.js 插件，以扩展 Node.js 应用程序的功能，包括示例和 API 参考。
head:
  - - meta
    - name: og:title
      content: Node.js 插件 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 C++ 创建 Node.js 插件，以扩展 Node.js 应用程序的功能，包括示例和 API 参考。
  - - meta
    - name: twitter:title
      content: Node.js 插件 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 C++ 创建 Node.js 插件，以扩展 Node.js 应用程序的功能，包括示例和 API 参考。
---


# C++ 插件 {#c-addons}

*插件* 是用 C++ 编写的动态链接共享对象。 [`require()`](/zh/nodejs/api/modules#requireid) 函数可以将插件作为普通的 Node.js 模块加载。 插件提供了 JavaScript 和 C/C++ 库之间的接口。

实现插件有三种选择：

- Node-API
- `nan` ([Node.js 的原生抽象](https://github.com/nodejs/nan))
- 直接使用内部 V8、libuv 和 Node.js 库

除非需要直接访问 Node-API 未公开的功能，否则请使用 Node-API。 有关 Node-API 的更多信息，请参阅 [使用 Node-API 的 C/C++ 插件](/zh/nodejs/api/n-api)。

如果不使用 Node-API，实现插件会变得更加复杂，需要了解多个组件和 API：

-  [V8](https://v8.dev/)：Node.js 用来提供 JavaScript 实现的 C++ 库。 它提供了创建对象、调用函数等的机制。 V8 的 API 主要记录在 `v8.h` 头文件中（Node.js 源代码树中的 `deps/v8/include/v8.h`），也可以在 [在线](https://v8docs.nodesource.com/) 获取。
-  [libuv](https://github.com/libuv/libuv)：C 库，实现了 Node.js 事件循环、其工作线程以及平台的所有异步行为。 它还充当跨平台抽象库，可以在所有主要操作系统上轻松地以类似 POSIX 的方式访问许多常见的系统任务，例如与文件系统、套接字、计时器和系统事件的交互。 libuv 还提供了一个类似于 POSIX 线程的线程抽象，用于需要超越标准事件循环的更复杂的异步插件。 插件作者应避免使用 I/O 或其他耗时任务阻塞事件循环，方法是通过 libuv 将工作卸载到非阻塞系统操作、工作线程或自定义使用 libuv 线程。
-  内部 Node.js 库：Node.js 本身导出插件可以使用的 C++ API，其中最重要的是 `node::ObjectWrap` 类。
-  其他静态链接库（包括 OpenSSL）：这些其他库位于 Node.js 源代码树的 `deps/` 目录中。 只有 libuv、OpenSSL、V8 和 zlib 符号被 Node.js 有目的地重新导出，并且插件可以在不同程度上使用它们。 有关更多信息，请参阅 [链接到 Node.js 附带的库](/zh/nodejs/api/addons#linking-to-libraries-included-with-nodejs)。

以下所有示例均可[下载](https://github.com/nodejs/node-addon-examples) 并可用作插件的起点。


## Hello world {#hello-world}

这个 "Hello world" 示例是一个简单的 C++ 编写的插件，它等价于下面的 JavaScript 代码：

```js [ESM]
module.exports.hello = () => 'world';
```
首先，创建文件 `hello.cc`：

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
所有 Node.js 插件都必须导出一个遵循以下模式的初始化函数：

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
`NODE_MODULE` 之后没有分号，因为它不是一个函数（参见 `node.h`）。

`module_name` 必须与最终二进制文件的文件名匹配（不包括 `.node` 后缀）。

那么，在 `hello.cc` 示例中，初始化函数是 `Initialize`，插件模块名称是 `addon`。

当使用 `node-gyp` 构建插件时，使用宏 `NODE_GYP_MODULE_NAME` 作为 `NODE_MODULE()` 的第一个参数将确保最终二进制文件的名称传递给 `NODE_MODULE()`。

使用 `NODE_MODULE()` 定义的插件不能在多个上下文或多个线程中同时加载。

### 上下文感知插件 {#context-aware-addons}

在某些环境中，Node.js 插件可能需要在多个上下文中多次加载。 例如，[Electron](https://electronjs.org/) 运行时在单个进程中运行多个 Node.js 实例。 每个实例都有自己的 `require()` 缓存，因此每个实例都需要一个本机插件才能在通过 `require()` 加载时正常运行。 这意味着该插件必须支持多次初始化。

可以使用宏 `NODE_MODULE_INITIALIZER` 构建一个上下文感知插件，该宏扩展为 Node.js 在加载插件时期望找到的函数的名称。 因此，可以像以下示例中那样初始化插件：

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Perform addon initialization steps here. */
}
```
另一种选择是使用宏 `NODE_MODULE_INIT()`，它也会构建一个上下文感知插件。 与用于围绕给定的插件初始化函数构建插件的 `NODE_MODULE()` 不同，`NODE_MODULE_INIT()` 用作此类初始值设定项的声明，后跟函数体。

以下三个变量可以在调用 `NODE_MODULE_INIT()` 之后的函数体中使用：

- `Local\<Object\> exports`，
- `Local\<Value\> module`，以及
- `Local\<Context\> context`

构建上下文感知插件需要仔细管理全局静态数据，以确保稳定性和正确性。 由于插件可能会被多次加载，甚至可能从不同的线程加载，因此插件中存储的任何全局静态数据都必须受到适当的保护，并且不得包含对 JavaScript 对象的任何持久引用。 原因是 JavaScript 对象仅在一个上下文中有效，并且从错误的上下文或与创建它们的线程不同的线程访问时可能会导致崩溃。

可以通过执行以下步骤来构造上下文感知插件以避免全局静态数据：

- 定义一个类，该类将保存每个插件实例的数据，并且具有以下形式的静态成员  
- 在插件初始化程序中堆分配此类的实例。 这可以使用 `new` 关键字来完成。
- 调用 `node::AddEnvironmentCleanupHook()`，将上面创建的实例和指向 `DeleteInstance()` 的指针传递给它。 这将确保在环境关闭时删除该实例。
- 将该类的实例存储在 `v8::External` 中，并且
- 通过将其传递给 `v8::FunctionTemplate::New()` 或 `v8::Function::New()` 将 `v8::External` 传递给 JavaScript 公开的所有方法，这将创建本机支持的 JavaScript 函数。 `v8::FunctionTemplate::New()` 或 `v8::Function::New()` 的第三个参数接受 `v8::External`，并使用 `v8::FunctionCallbackInfo::Data()` 方法使其在本机回调中可用。

这将确保每个可以从 JavaScript 调用的绑定都获得每个插件实例的数据。 每个插件实例的数据也必须传递到插件可能创建的任何异步回调中。

以下示例说明了上下文感知插件的实现：

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Retrieve the per-addon-instance data.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Worker 支持 {#worker-support}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.8.0, v12.19.0 | 清理钩子现在可以是异步的。 |
:::

为了能够从多个 Node.js 环境（例如主线程和 Worker 线程）加载，附加组件需要：

- 成为 Node-API 插件，或者
- 使用如上所述的 `NODE_MODULE_INIT()` 声明为上下文感知

为了支持 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程，附加组件需要在线程退出时清理可能已分配的任何资源。 这可以通过使用 `AddEnvironmentCleanupHook()` 函数来实现：

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
此函数添加一个钩子，该钩子将在给定的 Node.js 实例关闭之前运行。 如果有必要，可以在运行之前使用 `RemoveEnvironmentCleanupHook()` 删除这些钩子，它具有相同的签名。 回调以后进先出的顺序运行。

如有必要，还有另外一对 `AddEnvironmentCleanupHook()` 和 `RemoveEnvironmentCleanupHook()` 重载，其中清理钩子接受回调函数。 这可以用于关闭异步资源，例如由附加组件注册的任何 libuv 句柄。

以下 `addon.cc` 使用 `AddEnvironmentCleanupHook`：

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// 注意：在实际应用中，不要依赖静态/全局数据。
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // 断言 VM 仍在运行
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// 初始化此附加组件以使其具有上下文感知能力。
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
通过运行以下 JavaScript 代码进行测试：

```js [ESM]
// test.js
require('./build/Release/addon');
```

### 构建 {#building}

一旦源代码编写完成，就必须将其编译成二进制文件 `addon.node`。为此，需要在项目的顶层创建一个名为 `binding.gyp` 的文件，该文件使用类似 JSON 的格式描述模块的构建配置。该文件由 [node-gyp](https://github.com/nodejs/node-gyp) 使用，该工具专门用于编译 Node.js 插件。

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```
`node-gyp` 工具的一个版本与 Node.js 一起捆绑和分发，作为 `npm` 的一部分。此版本不直接供开发人员使用，仅用于支持使用 `npm install` 命令编译和安装插件的功能。希望直接使用 `node-gyp` 的开发人员可以使用命令 `npm install -g node-gyp` 安装它。有关更多信息，包括特定于平台的要求，请参阅 `node-gyp` 的[安装说明](https://github.com/nodejs/node-gyp#installation)。

创建 `binding.gyp` 文件后，使用 `node-gyp configure` 为当前平台生成适当的项目构建文件。这将在 `build/` 目录中生成一个 `Makefile`（在 Unix 平台上）或一个 `vcxproj` 文件（在 Windows 上）。

接下来，调用 `node-gyp build` 命令来生成已编译的 `addon.node` 文件。这将放入 `build/Release/` 目录中。

当使用 `npm install` 安装 Node.js 插件时，npm 使用其自身捆绑的 `node-gyp` 版本来执行相同的操作集，从而按需为用户的平台生成已编译的插件版本。

构建完成后，可以通过将 [`require()`](/zh/nodejs/api/modules#requireid) 指向构建的 `addon.node` 模块，从 Node.js 内部使用二进制插件：

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
由于已编译的插件二进制文件的确切路径可能因其编译方式而异（即，有时它可能位于 `./build/Debug/` 中），因此插件可以使用 [bindings](https://github.com/TooTallNate/node-bindings) 包来加载已编译的模块。

虽然 `bindings` 包的实现在如何定位插件模块方面更为复杂，但它本质上使用的是类似于以下的 `try…catch` 模式：

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### 链接到 Node.js 自带的库 {#linking-to-libraries-included-with-nodejs}

Node.js 使用静态链接的库，如 V8、libuv 和 OpenSSL。所有 addon 都需要链接到 V8，并且也可以链接到任何其他的依赖项。通常，这就像包含适当的 `#include \<...\>` 语句（例如 `#include \<v8.h\>`) 一样简单，`node-gyp` 会自动找到相应的头文件。但是，需要注意以下几点：

- 当 `node-gyp` 运行时，它将检测 Node.js 的特定发布版本，并下载完整的源代码 tarball 或仅下载头文件。 如果下载了完整的源代码，addon 将可以完全访问整套 Node.js 依赖项。 但是，如果仅下载 Node.js 头文件，则只有 Node.js 导出的符号可用。
- 可以使用 `--nodedir` 标志运行 `node-gyp`，该标志指向本地 Node.js 源代码映像。 使用此选项，addon 将可以访问整套依赖项。

### 使用 `require()` 加载 addon {#loading-addons-using-require}

编译后的 addon 二进制文件的文件扩展名是 `.node`（而不是 `.dll` 或 `.so`）。[`require()`](/zh/nodejs/api/modules#requireid) 函数被编写为查找文件扩展名为 `.node` 的文件，并将这些文件初始化为动态链接库。

在调用 [`require()`](/zh/nodejs/api/modules#requireid) 时，通常可以省略 `.node` 扩展名，Node.js 仍然会找到并初始化 addon。但是，需要注意的是，Node.js 将首先尝试查找并加载恰好共享相同基本名称的模块或 JavaScript 文件。例如，如果二进制文件 `addon.node` 的同一目录中有一个文件 `addon.js`，那么 [`require('addon')`](/zh/nodejs/api/modules#requireid) 将优先考虑 `addon.js` 文件并加载它。

## Node.js 的原生抽象 {#native-abstractions-for-nodejs}

本文档中说明的每个示例都直接使用 Node.js 和 V8 API 来实现 addon。V8 API 可能会，并且已经，从一个 V8 版本到下一个版本（以及从一个主要的 Node.js 版本到下一个版本）发生巨大的变化。每次更改时，可能需要更新和重新编译 addon 才能继续运行。Node.js 发布计划旨在最大限度地减少此类更改的频率和影响，但 Node.js 在确保 V8 API 的稳定性方面几乎无能为力。

[Node.js 的原生抽象](https://github.com/nodejs/nan) (或 `nan`) 提供了一组工具，建议 addon 开发人员使用这些工具来保持 V8 和 Node.js 的过去和未来版本之间的兼容性。有关如何使用它的说明，请参阅 `nan` [示例](https://github.com/nodejs/nan/tree/HEAD/examples/)。


## Node-API {#node-api}

::: tip [稳定级别: 2 - 稳定]
[稳定级别: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

Node-API 是用于构建原生插件的 API。它独立于底层 JavaScript 运行时（例如 V8），并且作为 Node.js 本身的一部分进行维护。此 API 在 Node.js 的各个版本中将保持应用程序二进制接口 (ABI) 稳定。 它的目的是使插件免受底层 JavaScript 引擎变化的影响，并允许为一个版本编译的模块在更高版本的 Node.js 上运行，而无需重新编译。 插件的构建/打包方式与本文档中概述的方式/工具（node-gyp 等）相同。 唯一的区别是原生代码使用的 API 集。 使用 Node-API 中提供的函数，而不是使用 V8 或 [Native Abstractions for Node.js](https://github.com/nodejs/nan) API。

创建和维护一个受益于 Node-API 提供的 ABI 稳定性的插件，需要考虑某些[实现方面的因素](/zh/nodejs/api/n-api#implications-of-abi-stability)。

要在上面的“Hello world”示例中使用 Node-API，请将 `hello.cc` 的内容替换为以下内容。 所有其他说明保持不变。

```C++ [C++]
// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
可用函数以及如何使用它们记录在 [C/C++ 插件与 Node-API](/zh/nodejs/api/n-api) 中。


## 插件示例 {#addon-examples}

以下是一些示例插件，旨在帮助开发人员入门。 这些示例使用 V8 API。 有关各种 V8 调用的帮助，请参阅在线 [V8 参考文档](https://v8docs.nodesource.com/)，有关句柄、作用域、函数模板等几个概念的解释，请参阅 V8 的 [嵌入器指南](https://v8.dev/docs/embed)。

以下是每个示例使用的 `binding.gyp` 文件：

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
如果存在多个 `.cc` 文件，只需将其他文件名添加到 `sources` 数组中：

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
`binding.gyp` 文件准备就绪后，可以使用 `node-gyp` 配置和构建示例插件：

```bash [BASH]
node-gyp configure build
```
### 函数参数 {#function-arguments}

插件通常会公开可以从 Node.js 中运行的 JavaScript 访问的对象和函数。 从 JavaScript 调用函数时，输入参数和返回值必须映射到 C/C++ 代码和从 C/C++ 代码映射。

以下示例说明了如何读取从 JavaScript 传递的函数参数以及如何返回结果：

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// 这是“add”方法的实现
// 输入参数使用
// const FunctionCallbackInfo<Value>& args 结构体传递
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // 检查传递的参数数量。
  if (args.Length() < 2) {
    // 抛出一个传递回 JavaScript 的错误
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "参数数量错误").ToLocalChecked()));
    return;
  }

  // 检查参数类型
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "参数错误").ToLocalChecked()));
    return;
  }

  // 执行操作
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // 设置返回值（使用传入的
  // FunctionCallbackInfo<Value>&）
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
编译完成后，可以从 Node.js 中 require 和使用示例插件：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('这应该是 8：', addon.add(3, 5));
```

### 回调 {#callbacks}

在插件中，常见的做法是将 JavaScript 函数传递给 C++ 函数并从那里执行它们。 以下示例说明了如何调用此类回调：

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
此示例使用 `Init()` 的双参数形式，它接收完整的 `module` 对象作为第二个参数。 这允许插件使用单个函数完全覆盖 `exports`，而不是将该函数添加为 `exports` 的属性。

要测试它，请运行以下 JavaScript：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
在此示例中，回调函数是同步调用的。

### 对象工厂 {#object-factory}

插件可以从 C++ 函数内部创建和返回新对象，如下面的示例所示。 创建并返回一个对象，该对象具有一个 `msg` 属性，该属性回显传递给 `createObject()` 的字符串：

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
要在 JavaScript 中进行测试：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### 函数工厂 {#function-factory}

另一种常见的场景是创建 JavaScript 函数来包装 C++ 函数，并将它们返回给 JavaScript：

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // 省略此项使其匿名
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
测试：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// 输出: 'hello world'
```
### 包装 C++ 对象 {#wrapping-c-objects}

也可以包装 C++ 对象/类，以便可以使用 JavaScript `new` 运算符创建新实例：

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
然后，在 `myobject.h` 中，包装类继承自 `node::ObjectWrap`：

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
在 `myobject.cc` 中，实现要公开的各种方法。在下面的代码中，通过将 `plusOne()` 方法添加到构造函数的原型来公开它：

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 个字段用于 MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // 准备构造函数模板
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // 原型
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // 作为构造函数调用：`new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // 作为普通函数调用 `MyObject(...)`，转换为构造函数调用。
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
要构建此示例，必须将 `myobject.cc` 文件添加到 `binding.gyp`：

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
使用以下方法进行测试：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// 输出: 11
console.log(obj.plusOne());
// 输出: 12
console.log(obj.plusOne());
// 输出: 13
```
当对象被垃圾回收时，将运行包装器对象的析构函数。 对于析构函数测试，有一些命令行标志可用于强制垃圾回收。 这些标志由底层的 V8 JavaScript 引擎提供。 它们可能会随时更改或删除。 Node.js 或 V8 没有记录它们，因此不应在测试之外使用它们。

在进程或工作线程关闭期间，JS 引擎不会调用析构函数。 因此，用户有责任跟踪这些对象并确保正确销毁以避免资源泄漏。


### 包装对象的工厂 {#factory-of-wrapped-objects}

或者，可以使用工厂模式来避免使用 JavaScript `new` 操作符显式创建对象实例：

```js [ESM]
const obj = addon.createObject();
// 代替:
// const obj = new addon.Object();
```
首先，`createObject()` 方法在 `addon.cc` 中实现：

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
在 `myobject.h` 中，添加静态方法 `NewInstance()` 来处理对象实例化。此方法取代了在 JavaScript 中使用 `new` 的方式：

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
`myobject.cc` 中的实现与前面的示例类似：

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// 警告！ 这不是线程安全的，此插件不能用于工作线程。
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // 准备构造函数模板
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // 原型
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // 作为构造函数调用: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // 作为普通函数调用 `MyObject(...)`，转换为构造函数调用。
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
同样，要构建此示例，必须将 `myobject.cc` 文件添加到 `binding.gyp` 中：

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
使用以下命令进行测试：

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### 传递包装对象 {#passing-wrapped-objects-around}

除了包装和返回 C++ 对象，还可以通过 Node.js 辅助函数 `node::ObjectWrap::Unwrap` 来解包对象，从而传递包装对象。以下示例展示了一个 `add()` 函数，它可以接收两个 `MyObject` 对象作为输入参数：

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
在 `myobject.h` 中，添加了一个新的公共方法，以便在解包对象后访问私有值。

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
`myobject.cc` 的实现与之前的版本类似：

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
使用以下代码进行测试：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```

