---
title: Node.js 权限 API
description: Node.js 权限 API 文档详细介绍了如何在 Node.js 应用程序中管理和控制各种操作的权限，确保对系统资源的安全和受控访问。
head:
  - - meta
    - name: og:title
      content: Node.js 权限 API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 权限 API 文档详细介绍了如何在 Node.js 应用程序中管理和控制各种操作的权限，确保对系统资源的安全和受控访问。
  - - meta
    - name: twitter:title
      content: Node.js 权限 API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 权限 API 文档详细介绍了如何在 Node.js 应用程序中管理和控制各种操作的权限，确保对系统资源的安全和受控访问。
---


# 权限 {#permissions}

权限可用于控制 Node.js 进程可以访问哪些系统资源，或该进程可以对这些资源执行哪些操作。

- [基于进程的权限](/zh/nodejs/api/permissions#process-based-permissions) 控制 Node.js 进程对资源的访问。资源可以完全允许或拒绝，或者可以控制与之相关的操作。例如，可以允许文件系统读取，同时拒绝写入。此功能不能防止恶意代码。根据 Node.js [安全策略](https://github.com/nodejs/node/blob/main/SECURITY.md)，Node.js 信任要求运行的任何代码。

权限模型实现了一种“安全带”方法，它可以防止受信任的代码无意中更改文件或使用未经明确授权访问的资源。它不能在存在恶意代码的情况下提供安全保障。恶意代码可以绕过权限模型，并执行任意代码，而不受权限模型施加的限制。

如果您发现潜在的安全漏洞，请参阅我们的[安全策略](https://github.com/nodejs/node/blob/main/SECURITY.md)。

## 基于进程的权限 {#process-based-permissions}

### 权限模型 {#permission-model}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

Node.js 权限模型是一种在执行期间限制对特定资源访问的机制。该 API 存在于标志 [`--permission`](/zh/nodejs/api/cli#--permission) 之后，启用该标志时，将限制对所有可用权限的访问。

可用权限由 [`--permission`](/zh/nodejs/api/cli#--permission) 标志记录。

使用 `--permission` 启动 Node.js 时，通过 `fs` 模块访问文件系统、生成进程、使用 `node:worker_threads`、使用原生插件、使用 WASI 以及启用运行时检查器的能力将受到限制。

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
允许访问生成进程和创建工作线程可以使用 [`--allow-child-process`](/zh/nodejs/api/cli#--allow-child-process) 和 [`--allow-worker`](/zh/nodejs/api/cli#--allow-worker) 分别完成。

要在使用权限模型时允许原生插件，请使用 [`--allow-addons`](/zh/nodejs/api/cli#--allow-addons) 标志。 对于 WASI，请使用 [`--allow-wasi`](/zh/nodejs/api/cli#--allow-wasi) 标志。


#### 运行时 API {#runtime-api}

当通过 [`--permission`](/zh/nodejs/api/cli#--permission) 标志启用权限模型时，一个新的属性 `permission` 会被添加到 `process` 对象中。这个属性包含一个函数：

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

用于在运行时检查权限的 API 调用 ([`permission.has()`](/zh/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### 文件系统权限 {#file-system-permissions}

默认情况下，权限模型通过 `node:fs` 模块限制对文件系统的访问。它不保证用户无法通过其他方式访问文件系统，例如通过 `node:sqlite` 模块。

要允许访问文件系统，请使用 [`--allow-fs-read`](/zh/nodejs/api/cli#--allow-fs-read) 和 [`--allow-fs-write`](/zh/nodejs/api/cli#--allow-fs-write) 标志：

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
这两个标志的有效参数是：

- `*` - 分别允许所有 `FileSystemRead` 或 `FileSystemWrite` 操作。
- 以逗号（`,`）分隔的路径，分别仅允许匹配的 `FileSystemRead` 或 `FileSystemWrite` 操作。

例子：

- `--allow-fs-read=*` - 将允许所有 `FileSystemRead` 操作。
- `--allow-fs-write=*` - 将允许所有 `FileSystemWrite` 操作。
- `--allow-fs-write=/tmp/` - 将允许对 `/tmp/` 文件夹的 `FileSystemWrite` 访问。
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - 允许对 `/tmp/` 文件夹**和** `/home/.gitignore` 路径的 `FileSystemRead` 访问。

也支持通配符：

- `--allow-fs-read=/home/test*` 将允许读取对与通配符匹配的所有内容。例如：`/home/test/file1` 或 `/home/test2`

在传递通配符 (`*`) 后，所有后续字符都将被忽略。例如：`/home/*.js` 的工作方式类似于 `/home/*`。

当权限模型初始化时，如果指定的目录存在，它会自动添加一个通配符 (*)。例如，如果 `/home/test/files` 存在，它将被视为 `/home/test/files/*`。但是，如果该目录不存在，则不会添加通配符，并且访问权限将仅限于 `/home/test/files`。如果您想允许访问尚未存在的文件夹，请确保明确包含通配符：`/my-path/folder-do-not-exist/*`。


#### 权限模型约束 {#permission-model-constraints}

在使用此系统之前，您需要了解一些约束：

- 该模型不会继承到子节点进程或工作线程。
- 当使用权限模型时，以下功能将被限制：
    - 原生模块
    - 子进程
    - 工作线程
    - 检查器协议
    - 文件系统访问
    - WASI

- 权限模型在 Node.js 环境设置完成后初始化。但是，某些标志（例如 `--env-file` 或 `--openssl-config`）的设计目的是在环境初始化之前读取文件。因此，此类标志不受权限模型规则的约束。通过 `v8.setFlagsFromString` 经由运行时设置的 V8 标志也同样适用。
- 启用权限模型后，无法在运行时请求 OpenSSL 引擎，这会影响内置的 crypto、https 和 tls 模块。
- 启用权限模型后，无法加载运行时可加载扩展，这会影响 sqlite 模块。
- 通过 `node:fs` 模块使用现有文件描述符会绕过权限模型。

#### 局限性和已知问题 {#limitations-and-known-issues}

- 即使链接到已授权访问的路径集之外的位置，也会跟随符号链接。相对符号链接可能允许访问任意文件和目录。当启用权限模型启动应用程序时，您必须确保已授权访问的任何路径都不包含相对符号链接。

