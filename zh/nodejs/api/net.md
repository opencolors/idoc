---
title: Node.js 文档 - 网络
description: Node.js 中的 'net' 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 IPC 服务器和客户端。它包括创建连接、服务器以及处理套接字操作的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 网络 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的 'net' 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 IPC 服务器和客户端。它包括创建连接、服务器以及处理套接字操作的方法。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 网络 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的 'net' 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 IPC 服务器和客户端。它包括创建连接、服务器以及处理套接字操作的方法。
---


# Net {#net}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

`node:net` 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 [IPC](/zh/nodejs/api/net#ipc-support) 服务器（[`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener)）和客户端（[`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection)）。

可以通过以下方式访问它：

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## IPC 支持 {#ipc-support}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0 | 支持绑定到抽象 Unix 域套接字路径，例如 `\0abstract`。 我们可以为 Node.js `\< v20.4.0` 绑定 '\0'。 |
:::

`node:net` 模块支持 Windows 上使用命名管道的 IPC，以及其他操作系统上使用 Unix 域套接字的 IPC。

### 识别 IPC 连接的路径 {#identifying-paths-for-ipc-connections}

[`net.connect()`](/zh/nodejs/api/net#netconnect)、[`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection)、[`server.listen()`](/zh/nodejs/api/net#serverlisten) 和 [`socket.connect()`](/zh/nodejs/api/net#socketconnect) 接受一个 `path` 参数来标识 IPC 端点。

在 Unix 上，本地域也称为 Unix 域。 路径是文件系统路径名。 当路径名的长度大于 `sizeof(sockaddr_un.sun_path)` 的长度时，它将抛出一个错误。 典型值在 Linux 上是 107 字节，在 macOS 上是 103 字节。 如果 Node.js API 抽象创建了 Unix 域套接字，它也会取消链接 Unix 域套接字。 例如，[`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener) 可能会创建一个 Unix 域套接字，并且 [`server.close()`](/zh/nodejs/api/net#serverclosecallback) 将取消链接它。 但是，如果用户在这些抽象之外创建了 Unix 域套接字，则用户需要将其删除。 当 Node.js API 创建一个 Unix 域套接字但程序随后崩溃时，情况也是如此。 简而言之，Unix 域套接字将在文件系统中可见，并将持续存在直到取消链接。 在 Linux 上，可以通过在路径开头添加 `\0` 来使用 Unix 抽象套接字，例如 `\0abstract`。 Unix 抽象套接字的路径在文件系统中不可见，并且当所有打开的对套接字的引用都关闭时，它将自动消失。

在 Windows 上，本地域是使用命名管道实现的。 该路径*必须*引用 `\\?\pipe\` 或 `\\.\pipe\` 中的条目。 允许使用任何字符，但后者可能会对管道名称进行一些处理，例如解析 `..` 序列。 尽管它看起来可能是这样，但管道命名空间是扁平的。 管道将*不会持久存在*。 当对它们的最后一个引用关闭时，它们将被删除。 与 Unix 域套接字不同，Windows 将在拥有进程退出时关闭并删除管道。

JavaScript 字符串转义要求使用额外的反斜杠转义来指定路径，例如：

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## 类：`net.BlockList` {#class-netblocklist}

**加入于: v15.0.0, v14.18.0**

`BlockList` 对象可以与某些网络 API 一起使用，以指定禁用对特定 IP 地址、IP 范围或 IP 子网的入站或出站访问的规则。

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**加入于: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 一个 IPv4 或 IPv6 地址。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'`。**默认:** `'ipv4'`。

添加一条规则以阻止给定的 IP 地址。

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**加入于: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 范围内的起始 IPv4 或 IPv6 地址。
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 范围内的结束 IPv4 或 IPv6 地址。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'`。**默认:** `'ipv4'`。

添加一条规则以阻止从 `start`（包括）到 `end`（包括）的 IP 地址范围。

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**加入于: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 网络 IPv4 或 IPv6 地址。
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CIDR 前缀位数。对于 IPv4，该值必须介于 `0` 和 `32` 之间。对于 IPv6，该值必须介于 `0` 和 `128` 之间。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'`。**默认:** `'ipv4'`。

添加一条规则以阻止指定为子网掩码的 IP 地址范围。


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**新增于: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 要检查的 IP 地址
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'`。 **默认:** `'ipv4'`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果给定的 IP 地址匹配添加到 `BlockList` 的任何规则，则返回 `true`。

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // 打印: true
console.log(blockList.check('10.0.0.3'));  // 打印: true
console.log(blockList.check('222.111.111.222'));  // 打印: false

// IPv4 地址的 IPv6 表示法有效：
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // 打印: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // 打印: true
```
### `blockList.rules` {#blocklistrules}

**新增于: v15.0.0, v14.18.0**

- 类型: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

添加到黑名单的规则列表。

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**新增于: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何 JS 值
- 如果 `value` 是一个 `net.BlockList`，则返回 `true`。

## 类: `net.SocketAddress` {#class-netsocketaddress}

**新增于: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**新增于: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 网络地址，可以是 IPv4 或 IPv6 字符串。 **默认**: 如果 `family` 是 `'ipv4'`，则为 `'127.0.0.1'`；如果 `family` 是 `'ipv6'`，则为 `'::'`。
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'` 之一。 **默认**: `'ipv4'`。
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IPv6 流标签，仅当 `family` 为 `'ipv6'` 时使用。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP 端口。


### `socketaddress.address` {#socketaddressaddress}

**新增于: v15.14.0, v14.18.0**

- 类型 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**新增于: v15.14.0, v14.18.0**

- 类型 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 或 `'ipv6'`。

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**新增于: v15.14.0, v14.18.0**

- 类型 [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**新增于: v15.14.0, v14.18.0**

- 类型 [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**新增于: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个包含 IP 地址和可选端口的输入字符串，例如 `123.1.2.3:1234` 或 `[1::1]:1234`。
- 返回: [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress) 如果解析成功，则返回 `SocketAddress`。 否则返回 `undefined`。

## 类: `net.Server` {#class-netserver}

**新增于: v0.1.90**

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

此类用于创建 TCP 或 [IPC](/zh/nodejs/api/net#ipc-support) 服务器。

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`net.createServer([options][, connectionListener])`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener)。
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 自动设置为 [`'connection'`](/zh/nodejs/api/net#event-connection) 事件的监听器。
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

`net.Server` 是一个带有以下事件的 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter)：

### 事件: `'close'` {#event-close}

**新增于: v0.5.0**

当服务器关闭时触发。 如果存在连接，则直到所有连接都结束后才会触发此事件。


### 事件: `'connection'` {#event-connection}

**加入于: v0.1.90**

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 连接对象

当建立新连接时触发。`socket` 是 `net.Socket` 的一个实例。

### 事件: `'error'` {#event-error}

**加入于: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当发生错误时触发。与 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 不同，如果没有手动调用 [`server.close()`](/zh/nodejs/api/net#serverclosecallback)，则 **不会**在此事件之后立即触发 [`'close'`](/zh/nodejs/api/net#event-close) 事件。 请参见关于 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 的讨论中的示例。

### 事件: `'listening'` {#event-listening}

**加入于: v0.1.90**

在调用 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 之后服务器已绑定时触发。

### 事件: `'drop'` {#event-drop}

**加入于: v18.6.0, v16.17.0**

当连接数达到 `server.maxConnections` 的阈值时，服务器将丢弃新连接并触发 `'drop'` 事件。 如果是 TCP 服务器，则参数如下，否则参数为 `undefined`。

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给事件监听器的参数。
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 本地地址。
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 本地端口。
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 本地族。
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 远程地址。
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程端口。
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 远程 IP 族。 `'IPv4'` 或 `'IPv6'`。


### `server.address()` {#serveraddress}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.4.0 | `family` 属性现在返回字符串而不是数字。 |
| v18.0.0 | `family` 属性现在返回数字而不是字符串。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

返回绑定的 `address`，地址 `family` 名称，以及服务器的 `port`，由操作系统报告（当获取操作系统分配的地址时，可用于查找分配了哪个端口）: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。

对于监听管道或 Unix 域套接字的服务器，该名称作为字符串返回。

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // 在此处理错误。
  throw err;
});

// 获取任意未使用的端口。
server.listen(() => {
  console.log('opened server on', server.address());
});
```

在发出 `'listening'` 事件之前或调用 `server.close()` 之后，`server.address()` 返回 `null`。

### `server.close([callback])` {#serverclosecallback}

**添加于: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 服务器关闭时调用。
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

停止服务器接受新的连接并保持现有连接。 此函数是异步的，当所有连接都结束并且服务器发出 [`'close'`](/zh/nodejs/api/net#event-close) 事件时，服务器最终关闭。 一旦发生 `'close'` 事件，将调用可选的 `callback`。 与该事件不同，如果服务器在关闭时未打开，则将使用 `Error` 作为其唯一参数调用它。


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**添加于: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

调用 [`server.close()`](/zh/nodejs/api/net#serverclosecallback) 并返回一个 promise，该 promise 在服务器关闭时兑现。

### `server.getConnections(callback)` {#servergetconnectionscallback}

**添加于: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

异步获取服务器上的并发连接数。当套接字被发送到 fork 时有效。

回调应该接受两个参数 `err` 和 `count`。

### `server.listen()` {#serverlisten}

启动一个服务器来监听连接。一个 `net.Server` 可以是一个 TCP 或一个 [IPC](/zh/nodejs/api/net#ipc-support) 服务器，具体取决于它监听的内容。

可能的签名：

- [`server.listen(handle[, backlog][, callback])`](/zh/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/zh/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/zh/nodejs/api/net#serverlistenpath-backlog-callback) 用于 [IPC](/zh/nodejs/api/net#ipc-support) 服务器
- [`server.listen([port[, host[, backlog]]][, callback])`](/zh/nodejs/api/net#serverlistenport-host-backlog-callback) 用于 TCP 服务器

此函数是异步的。当服务器开始监听时，将发出 [`'listening'`](/zh/nodejs/api/net#event-listening) 事件。最后一个参数 `callback` 将作为 [`'listening'`](/zh/nodejs/api/net#event-listening) 事件的监听器添加。

所有 `listen()` 方法都可以采用 `backlog` 参数来指定待处理连接队列的最大长度。实际长度将由操作系统通过 sysctl 设置（例如 Linux 上的 `tcp_max_syn_backlog` 和 `somaxconn`）确定。此参数的默认值为 511（不是 512）。

所有 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 都设置为 `SO_REUSEADDR`（有关详细信息，请参见 [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7)）。

仅当第一次 `server.listen()` 调用期间发生错误或已调用 `server.close()` 时，才能再次调用 `server.listen()` 方法。 否则，将抛出 `ERR_SERVER_ALREADY_LISTEN` 错误。

监听时最常见的错误之一是 `EADDRINUSE`。当另一个服务器已经在请求的 `port`/`path`/`handle` 上监听时，会发生这种情况。 一种处理方法是在一定时间后重试：

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**加入版本：v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/zh/nodejs/api/net#serverlisten) 函数的通用参数
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

启动服务器监听给定 `handle` 上的连接，该 `handle` 已经绑定到端口、Unix 域套接字或 Windows 命名管道。

`handle` 对象可以是服务器、套接字（任何具有底层 `_handle` 成员的对象）或具有 `fd` 成员的对象，该成员是有效的文件描述符。

Windows 上不支持监听文件描述符。

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.1.0 | 支持 `reusePort` 选项。 |
| v15.6.0 | 添加了 AbortSignal 支持。 |
| v11.4.0 | 支持 `ipv6Only` 选项。 |
| v0.11.14 | 加入版本：v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必需。 支持以下属性：
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/zh/nodejs/api/net#serverlisten) 函数的通用参数。
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 对于 TCP 服务器，将 `ipv6Only` 设置为 `true` 将禁用双栈支持，即绑定到主机 `::` 不会使 `0.0.0.0` 被绑定。 **默认:** `false`。
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 对于 TCP 服务器，将 `reusePort` 设置为 `true` 允许同一主机上的多个套接字绑定到同一端口。 操作系统将传入的连接分配给监听套接字。 此选项仅在某些平台上可用，例如 Linux 3.9+、DragonFlyBSD 3.6+、FreeBSD 12.0+、Solaris 11.4 和 AIX 7.2.5+。 **默认:** `false`。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果指定了 `port`，则将被忽略。 请参阅 [识别 IPC 连接的路径](/zh/nodejs/api/net#identifying-paths-for-ipc-connections)。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 对于 IPC 服务器，使管道对所有用户可读。 **默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于关闭监听服务器的 AbortSignal。
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 对于 IPC 服务器，使管道对所有用户可写。 **默认:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

如果指定了 `port`，它的行为与 [`server.listen([port[, host[, backlog]]][, callback])`](/zh/nodejs/api/net#serverlistenport-host-backlog-callback) 相同。 否则，如果指定了 `path`，它的行为与 [`server.listen(path[, backlog][, callback])`](/zh/nodejs/api/net#serverlistenpath-backlog-callback) 相同。 如果两者都未指定，则会抛出错误。

如果 `exclusive` 为 `false`（默认），则集群工作进程将使用相同的底层句柄，从而允许共享连接处理职责。 当 `exclusive` 为 `true` 时，不共享句柄，并且尝试共享端口会导致错误。 下面显示了一个监听独占端口的示例。

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
当 `exclusive` 为 `true` 并且共享底层句柄时，多个工作进程可能会使用不同的积压查询句柄。 在这种情况下，将使用传递给主进程的第一个 `backlog`。

以 root 身份启动 IPC 服务器可能会导致非特权用户无法访问服务器路径。 使用 `readableAll` 和 `writableAll` 将使服务器可供所有用户访问。

如果启用了 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在服务器上调用 `.close()`：

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// 稍后，当您要关闭服务器时。
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**新增于: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 服务器应监听的路径。参见 [识别 IPC 连接的路径](/zh/nodejs/api/net#identifying-paths-for-ipc-connections)。
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/zh/nodejs/api/net#serverlisten) 函数的常用参数。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)。
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

启动一个 [IPC](/zh/nodejs/api/net#ipc-support) 服务器，监听给定 `path` 上的连接。

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**新增于: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/zh/nodejs/api/net#serverlisten) 函数的常用参数。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)。
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

启动一个 TCP 服务器，监听给定 `port` 和 `host` 上的连接。

如果省略 `port` 或为 0，操作系统将分配一个任意未使用的端口，该端口可以在发出 [`'listening'`](/zh/nodejs/api/net#event-listening) 事件后使用 `server.address().port` 检索。

如果省略 `host`，则当 IPv6 可用时，服务器将接受 [未指定的 IPv6 地址](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) 上的连接，否则接受 [未指定的 IPv4 地址](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) 上的连接。

在大多数操作系统中，监听 [未指定的 IPv6 地址](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) 可能会导致 `net.Server` 也监听 [未指定的 IPv4 地址](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`)。


### `server.listening` {#serverlistening}

**添加于: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 表示服务器是否正在监听连接。

### `server.maxConnections` {#servermaxconnections}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 将 `maxConnections` 设置为 `0` 将丢弃所有传入的连接。 之前，它被解释为 `Infinity`。 |
| v0.2.0 | 添加于: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当连接数达到 `server.maxConnections` 阈值时：

一旦 socket 被发送到带有 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 的子进程，就不建议使用此选项。

### `server.dropMaxConnection` {#serverdropmaxconnection}

**添加于: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

将此属性设置为 `true`，以便在连接数达到 [`server.maxConnections`][] 阈值时开始关闭连接。 此设置仅在集群模式下有效。

### `server.ref()` {#serverref}

**添加于: v0.9.1**

- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

与 `unref()` 相反，在一个先前 `unref` 过的服务器上调用 `ref()` 将 *不会* 让程序退出（如果它是剩余的唯一服务器）（默认行为）。 如果服务器已经 `ref` 过，再次调用 `ref()` 将不起作用。

### `server.unref()` {#serverunref}

**添加于: v0.9.1**

- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

在一个服务器上调用 `unref()` 将允许程序退出，如果这是事件系统中唯一的活动服务器。 如果服务器已经 `unref` 过，再次调用 `unref()` 将不起作用。

## 类: `net.Socket` {#class-netsocket}

**添加于: v0.3.4**

- 继承自: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

此类是 TCP socket 或流式 [IPC](/zh/nodejs/api/net#ipc-support) 端点（在 Windows 上使用命名管道，否则使用 Unix 域 socket）的抽象。 它也是一个 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter)。

`net.Socket` 可以由用户创建并直接用于与服务器交互。 例如，它由 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 返回，因此用户可以使用它来与服务器通信。

它也可以由 Node.js 创建并在收到连接时传递给用户。 例如，它被传递给 [`'connection'`](/zh/nodejs/api/net#event-connection) 事件的监听器，该事件在 [`net.Server`](/zh/nodejs/api/net#class-netserver) 上发出，因此用户可以使用它来与客户端交互。


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.14.0 | 添加了 AbortSignal 支持。 |
| v12.10.0 | 添加了 `onread` 选项。 |
| v0.3.4 | 添加于：v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可用选项如下：
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `false`，则当可读端结束时，套接字将自动结束可写端。 有关详细信息，请参阅 [`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener) 和 [`'end'`](/zh/nodejs/api/net#event-end) 事件。 **默认:** `false`。
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果指定，则使用给定的文件描述符包装现有的套接字，否则将创建一个新的套接字。
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果指定，则传入的数据存储在单个 `buffer` 中，并在数据到达套接字时传递给提供的 `callback`。 这将导致流式传输功能不提供任何数据。 套接字将像往常一样发出 `'error'`、`'end'` 和 `'close'` 等事件。 像 `pause()` 和 `resume()` 这样的方法也会按预期运行。
    - `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要用于存储传入数据的可重用内存块，或返回此类内存块的函数。
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 每次有传入数据块时都会调用此函数。 两个参数传递给它：写入 `buffer` 的字节数和对 `buffer` 的引用。 从此函数返回 `false` 以隐式 `pause()` 套接字。 此函数将在全局上下文中执行。

    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当传递 `fd` 时允许在套接字上进行读取，否则将被忽略。 **默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于销毁套接字的 Abort 信号。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当传递 `fd` 时允许在套接字上进行写入，否则将被忽略。 **默认:** `false`。

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

创建一个新的套接字对象。

新创建的套接字可以是 TCP 套接字或流式 [IPC](/zh/nodejs/api/net#ipc-support) 端点，具体取决于它 [`connect()`](/zh/nodejs/api/net#socketconnect) 到什么。


### 事件: `'close'` {#event-close_1}

**新增于: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果套接字存在传输错误，则为 `true`。

套接字完全关闭时触发一次。 参数 `hadError` 是一个布尔值，表示套接字是否由于传输错误而关闭。

### 事件: `'connect'` {#event-connect}

**新增于: v0.1.90**

当成功建立套接字连接时触发。 参见 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection)。

### 事件: `'connectionAttempt'` {#event-connectionattempt}

**新增于: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字尝试连接的 IP。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字尝试连接的端口。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP 的族。 对于 IPv6，它可以是 `6`，对于 IPv4，它可以是 `4`。

当启动新的连接尝试时触发。 如果在 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 中启用了族自动选择算法，则可能会多次触发。

### 事件: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**新增于: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字尝试连接的 IP。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字尝试连接的端口。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP 的族。 对于 IPv6，它可以是 `6`，对于 IPv4，它可以是 `4`。
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 与失败关联的错误。

当连接尝试失败时触发。 如果在 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 中启用了族自动选择算法，则可能会多次触发。


### 事件：`'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**新增于：v21.6.0，v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字尝试连接的 IP。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字尝试连接的端口。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP 的族。 IPv6 为 `6`，IPv4 为 `4`。

当连接尝试超时时触发。 仅当在 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 中启用族自动选择算法时，才会触发此事件（并且可能会多次触发）。

### 事件：`'data'` {#event-data}

**新增于：v0.1.90**

- [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当接收到数据时触发。 参数 `data` 将是 `Buffer` 或 `String`。 数据的编码由 [`socket.setEncoding()`](/zh/nodejs/api/net#socketsetencodingencoding) 设置。

如果没有监听器，当 `Socket` 触发 `'data'` 事件时，数据将会丢失。

### 事件：`'drain'` {#event-drain}

**新增于：v0.1.90**

当写入缓冲区为空时触发。 可用于限制上传。

另见：`socket.write()` 的返回值。

### 事件：`'end'` {#event-end}

**新增于：v0.1.90**

当套接字的另一端发出传输结束的信号时触发，从而结束套接字的可读端。

默认情况下（`allowHalfOpen` 为 `false`），套接字将发回一个传输结束数据包，并在写出其待处理的写入队列后销毁其文件描述符。 但是，如果 `allowHalfOpen` 设置为 `true`，则套接字不会自动 [`end()`](/zh/nodejs/api/net#socketenddata-encoding-callback) 其可写端，从而允许用户写入任意数量的数据。 用户必须显式调用 [`end()`](/zh/nodejs/api/net#socketenddata-encoding-callback) 以关闭连接（即发回一个 FIN 数据包）。


### Event: `'error'` {#event-error_1}

**Added in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当发生错误时触发。 `'close'` 事件将在此事件之后直接被调用。

### Event: `'lookup'` {#event-lookup}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v5.10.0 | 现在支持 `host` 参数。 |
| v0.11.3 | 添加于: v0.11.3 |
:::

在解析主机名之后、连接之前触发。 不适用于 Unix 套接字。

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 错误对象。 参见 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP 地址。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 地址类型。 参见 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 主机名。

### Event: `'ready'` {#event-ready}

**Added in: v9.11.0**

当套接字准备好使用时触发。

在 `'connect'` 之后立即触发。

### Event: `'timeout'` {#event-timeout}

**Added in: v0.1.90**

如果套接字因不活动而超时，则触发。 这只是为了通知套接字已空闲。 用户必须手动关闭连接。

另见：[`socket.setTimeout()`](/zh/nodejs/api/net#socketsettimeouttimeout-callback)。

### `socket.address()` {#socketaddress}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0 | `family` 属性现在返回一个字符串而不是一个数字。 |
| v18.0.0 | `family` 属性现在返回一个数字而不是一个字符串。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回绑定的 `address`、地址 `family` 名称和套接字的 `port`，由操作系统报告：`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**新增于: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

只有在 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 中启用了族自动选择算法时，才会出现此属性，并且它是已尝试的地址数组。

每个地址都是 `$IP:$PORT` 形式的字符串。 如果连接成功，则最后一个地址是套接字当前连接到的地址。

### `socket.bufferSize` {#socketbuffersize}

**新增于: v0.3.8**

**自以下版本弃用: v14.6.0**

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`writable.writableLength`](/zh/nodejs/api/stream#writablewritablelength)。
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性显示为写入而缓冲的字符数。 缓冲区可能包含编码后长度未知的字符串。 因此，这个数字只是缓冲区中字节数的近似值。

`net.Socket` 具有 `socket.write()` 始终有效的属性。 这是为了帮助用户快速启动和运行。 计算机无法始终跟上写入套接字的数据量。 网络连接可能太慢。 Node.js 会在内部将写入套接字的数据排队，并在可能的情况下通过网络发送出去。

这种内部缓冲的后果是内存可能会增长。 遇到较大或增长的 `bufferSize` 的用户应尝试使用 [`socket.pause()`](/zh/nodejs/api/net#socketpause) 和 [`socket.resume()`](/zh/nodejs/api/net#socketresume) 来“限制”程序中的数据流。

### `socket.bytesRead` {#socketbytesread}

**新增于: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

接收到的字节数。


### `socket.bytesWritten` {#socketbyteswritten}

**新增于: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

已发送的字节数。

### `socket.connect()` {#socketconnect}

在给定的套接字上发起连接。

可能的签名：

- [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/zh/nodejs/api/net#socketconnectpath-connectlistener) 用于 [IPC](/zh/nodejs/api/net#ipc-support) 连接。
- [`socket.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#socketconnectport-host-connectlistener) 用于 TCP 连接。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

此函数是异步的。当连接建立时，将触发 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件。如果连接时出现问题，不会触发 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件，而是触发 [`'error'`](/zh/nodejs/api/net#event-error_1) 事件，并将错误传递给 [`'error'`](/zh/nodejs/api/net#event-error_1) 监听器。如果提供了最后一个参数 `connectListener`，则会将其添加为 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器**一次**。

此函数应仅用于在 `'close'` 事件触发后重新连接套接字，否则可能导致未定义的行为。

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.4.0 | 可以使用 `setDefaultAutoSelectFamily` 在运行时更改 autoSelectFamily 选项的默认值，也可以通过命令行选项 `--enable-network-family-autoselection` 进行更改。 |
| v20.0.0, v18.18.0 | autoSelectFamily 选项的默认值现在为 true。`--enable-network-family-autoselection` CLI 标志已重命名为 `--network-family-autoselection`。旧名称现在是一个别名，但不建议使用。 |
| v19.3.0, v18.13.0 | 添加了 `autoSelectFamily` 选项。 |
| v17.7.0, v16.15.0 | 现在支持 `noDelay`、`keepAlive` 和 `keepAliveInitialDelay` 选项。 |
| v6.0.0 | 现在 `hints` 选项在所有情况下都默认为 `0`。 之前，在没有 `family` 选项的情况下，它将默认为 `dns.ADDRCONFIG | dns.V4MAPPED`。 |
| v5.11.0 | 现在支持 `hints` 选项。 |
| v0.1.90 | 新增于：v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/zh/nodejs/api/net#socketconnect) 方法的通用参数。 将作为 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器添加一次。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

在给定的套接字上发起连接。 通常不需要此方法，套接字应该使用 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 创建和打开。 仅在实现自定义套接字时使用此方法。

对于 TCP 连接，可用的 `options` 有：

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): 如果设置为 `true`，它将启用一个族自动检测算法，该算法宽松地实现了 [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt) 的第 5 节。 传递给查找的 `all` 选项设置为 `true`，套接字尝试按顺序连接到所有获得的 IPv6 和 IPv4 地址，直到建立连接。 首先尝试返回的第一个 AAAA 地址，然后尝试返回的第一个 A 地址，然后是返回的第二个 AAAA 地址，依此类推。 每个连接尝试（但最后一个连接尝试）都会获得 `autoSelectFamilyAttemptTimeout` 选项指定的时间量，然后超时并尝试下一个地址。 如果 `family` 选项不是 `0` 或设置了 `localAddress`，则忽略。 如果至少一个连接成功，则不会触发连接错误。 如果所有连接尝试都失败，则会触发一个包含所有失败尝试的 `AggregateError`。 **默认值:** [`net.getDefaultAutoSelectFamily()`](/zh/nodejs/api/net#netgetdefaultautoselectfamily)。
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): 使用 `autoSelectFamily` 选项时，等待连接尝试完成再尝试下一个地址的毫秒数。 如果设置为小于 `10` 的正整数，则将改为使用值 `10`。 **默认值:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/zh/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout)。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): IP 协议栈的版本。 必须为 `4`、`6` 或 `0`。 值 `0` 表示允许 IPv4 和 IPv6 地址。 **默认值:** `0`。
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选的 [`dns.lookup()` 提示](/zh/nodejs/api/dns#supported-getaddrinfo-flags)。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字应连接到的主机。 **默认值:** `'localhost'`。
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，它会在连接建立后立即在套接字上启用 keep-alive 功能，类似于在 [`socket.setKeepAlive()`](/zh/nodejs/api/net#socketsetkeepaliveenable-initialdelay) 中所做的事情。 **默认值:** `false`。
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果设置为正数，则它会设置在空闲套接字上发送第一个 keepalive 探测之前的初始延迟。 **默认值:** `0`。
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字应连接的本地地址。
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字应连接的本地端口。
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 自定义查找函数。 **默认值:** [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在套接字建立后立即禁用 Nagle 算法的使用。 **默认值:** `false`。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 必需。 套接字应连接到的端口。
- `blockList` [\<net.BlockList\>](/zh/nodejs/api/net#class-netblocklist) `blockList` 可用于禁用对特定 IP 地址、IP 范围或 IP 子网的出站访问。

对于 [IPC](/zh/nodejs/api/net#ipc-support) 连接，可用的 `options` 有：

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必需。 客户端应连接到的路径。 参见 [识别 IPC 连接的路径](/zh/nodejs/api/net#identifying-paths-for-ipc-connections)。 如果提供，则忽略上面的 TCP 特定选项。


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 客户端应该连接到的路径。参见 [识别 IPC 连接的路径](/zh/nodejs/api/net#identifying-paths-for-ipc-connections)。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/zh/nodejs/api/net#socketconnect) 方法的常用参数。将会被添加为 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器一次。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) socket 本身。

在给定的 socket 上启动一个 [IPC](/zh/nodejs/api/net#ipc-support) 连接。

别名为调用时将 `{ path: path }` 作为 `options` 的 [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener)。

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**添加于: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 客户端应该连接到的端口。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 客户端应该连接到的主机。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/zh/nodejs/api/net#socketconnect) 方法的常用参数。将会被添加为 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器一次。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) socket 本身。

在给定的 socket 上启动一个 TCP 连接。

别名为调用时将 `{port: port, host: host}` 作为 `options` 的 [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener)。

### `socket.connecting` {#socketconnecting}

**添加于: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `true`，则说明已经调用了 [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 且尚未完成。 它将保持 `true` 直到 socket 变为已连接状态，然后设置为 `false` 并且发出 `'connect'` 事件。 请注意，[`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 回调是 `'connect'` 事件的监听器。


### `socket.destroy([error])` {#socketdestroyerror}

**新增于: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

确保此套接字上不再发生 I/O 活动。销毁流并关闭连接。

有关更多详细信息，请参阅 [`writable.destroy()`](/zh/nodejs/api/stream#writabledestroyerror)。

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示连接是否已销毁。 连接一旦被销毁，就不能再使用它传输任何数据。

有关更多详细信息，请参阅 [`writable.destroyed`](/zh/nodejs/api/stream#writabledestroyed)。

### `socket.destroySoon()` {#socketdestroysoon}

**新增于: v0.3.4**

在所有数据写入后销毁套接字。 如果已发出 `'finish'` 事件，则会立即销毁套接字。 如果套接字仍然可写，它会隐式地调用 `socket.end()`。

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**新增于: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 仅当数据为 `string` 时使用。 **默认值:** `'utf8'`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 套接字完成时的可选回调函数。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

半关闭套接字。 即，它发送一个 FIN 包。 服务器仍有可能发送一些数据。

有关更多详细信息，请参阅 [`writable.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback)。

### `socket.localAddress` {#socketlocaladdress}

**新增于: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

远程客户端连接的本地 IP 地址的字符串表示形式。 例如，在侦听 `'0.0.0.0'` 的服务器中，如果客户端连接到 `'192.168.1.1'`，则 `socket.localAddress` 的值将为 `'192.168.1.1'`。


### `socket.localPort` {#socketlocalport}

**新增于: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

本地端口的数字表示。 例如，`80` 或 `21`。

### `socket.localFamily` {#socketlocalfamily}

**新增于: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

本地 IP 族的字符串表示。 `'IPv4'` 或 `'IPv6'`。

### `socket.pause()` {#socketpause}

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

暂停读取数据。 也就是说，不会触发 [`'data'`](/zh/nodejs/api/net#event-data) 事件。 有助于降低上传速度。

### `socket.pending` {#socketpending}

**新增于: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果套接字尚未连接，则为 `true`，原因可能是尚未调用 `.connect()`，或者仍在连接过程中（请参阅 [`socket.connecting`](/zh/nodejs/api/net#socketconnecting)）。

### `socket.ref()` {#socketref}

**新增于: v0.9.1**

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

与 `unref()` 相反，在一个先前 `unref` 过的套接字上调用 `ref()` *不会* 让程序在它是剩余的唯一套接字时退出（默认行为）。 如果套接字是 `ref` 的，再次调用 `ref` 将不起作用。

### `socket.remoteAddress` {#socketremoteaddress}

**新增于: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

远程 IP 地址的字符串表示。 例如，`'74.125.127.100'` 或 `'2001:4860:a005::68'`。 如果套接字被销毁（例如，如果客户端断开连接），则值可能为 `undefined`。

### `socket.remoteFamily` {#socketremotefamily}

**新增于: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

远程 IP 族的字符串表示。 `'IPv4'` 或 `'IPv6'`。 如果套接字被销毁（例如，如果客户端断开连接），则值可能为 `undefined`。


### `socket.remotePort` {#socketremoteport}

**Added in: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

远程端口的数字表示。例如，`80` 或 `21`。如果 socket 被销毁（例如，如果客户端断开连接），则值可能为 `undefined`。

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Added in: v18.3.0, v16.17.0**

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

通过发送 RST 数据包并销毁流来关闭 TCP 连接。 如果此 TCP socket 处于连接状态，它将在连接后发送 RST 数据包并销毁此 TCP socket。 否则，它将使用 `ERR_SOCKET_CLOSED` 错误调用 `socket.destroy`。 如果这不是 TCP socket（例如，管道），则调用此方法将立即抛出 `ERR_INVALID_HANDLE_TYPE` 错误。

### `socket.resume()` {#socketresume}

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) socket 本身。

在调用 [`socket.pause()`](/zh/nodejs/api/net#socketpause) 后恢复读取。

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Added in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) socket 本身。

将 socket 的编码设置为 [Readable Stream](/zh/nodejs/api/stream#class-streamreadable)。 更多信息请参阅 [`readable.setEncoding()`](/zh/nodejs/api/stream#readablesetencodingencoding)。

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 添加了 `TCP_KEEPCNT` 和 `TCP_KEEPINTVL` socket 选项的新默认值。 |
| v0.1.92 | 添加于: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) socket 本身。

启用/禁用 keep-alive 功能，并可选择设置在空闲 socket 上发送第一个 keepalive 探测之前的初始延迟。

设置 `initialDelay`（以毫秒为单位）以设置接收到的最后一个数据包与第一个 keepalive 探测之间的延迟。 将 `initialDelay` 设置为 `0` 将使该值与默认值（或先前）设置保持不变。

启用 keep-alive 功能将设置以下 socket 选项：

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Added in: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
- Returns: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) The socket itself.

启用/禁用 Nagle 算法的使用。

当创建 TCP 连接时，默认会启用 Nagle 算法。

Nagle 算法会在数据通过网络发送之前延迟数据。 它试图以牺牲延迟为代价来优化吞吐量。

为 `noDelay` 传递 `true` 或不传递参数将禁用套接字的 Nagle 算法。 为 `noDelay` 传递 `false` 将启用 Nagle 算法。

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) The socket itself.

设置套接字在套接字上不活动 `timeout` 毫秒后超时。 默认情况下，`net.Socket` 没有超时。

当触发空闲超时时，套接字将收到一个 [`'timeout'`](/zh/nodejs/api/net#event-timeout) 事件，但连接不会断开。 用户必须手动调用 [`socket.end()`](/zh/nodejs/api/net#socketenddata-encoding-callback) 或 [`socket.destroy()`](/zh/nodejs/api/net#socketdestroyerror) 来结束连接。

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
如果 `timeout` 为 0，则现有的空闲超时将被禁用。

可选的 `callback` 参数将作为 [`'timeout'`](/zh/nodejs/api/net#event-timeout) 事件的一次性监听器添加。


### `socket.timeout` {#sockettimeout}

**Added in: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

套接字的超时时间，以毫秒为单位，由 [`socket.setTimeout()`](/zh/nodejs/api/net#socketsettimeouttimeout-callback) 设置。 如果未设置超时，则为 `undefined`。

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 套接字本身。

在套接字上调用 `unref()` 将允许程序退出，如果这是事件系统中唯一活跃的套接字。 如果套接字已经被 `unref`，则再次调用 `unref()` 将不起作用。

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Added in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 仅当 data 是 `string` 时使用。 **默认值:** `utf8`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在套接字上发送数据。 第二个参数指定字符串情况下的编码。 默认为 UTF8 编码。

如果整个数据已成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据已在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，将发出 [`'drain'`](/zh/nodejs/api/net#event-drain)。

可选的 `callback` 参数将在数据最终写入时执行，这可能不会立即发生。

有关更多信息，请参见 `Writable` 流 [`write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 方法。


### `socket.readyState` {#socketreadystate}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此属性表示连接的状态，是一个字符串。

- 如果流正在连接中，则 `socket.readyState` 为 `opening`。
- 如果流可读且可写，则为 `open`。
- 如果流可读但不可写，则为 `readOnly`。
- 如果流不可读且可写，则为 `writeOnly`。

## `net.connect()` {#netconnect}

是 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 的别名。

可能的签名：

- [`net.connect(options[, connectListener])`](/zh/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/zh/nodejs/api/net#netconnectpath-connectlistener) 用于 [IPC](/zh/nodejs/api/net#ipc-support) 连接。
- [`net.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#netconnectport-host-connectlistener) 用于 TCP 连接。

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Added in: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

是 [`net.createConnection(options[, connectListener])`](/zh/nodejs/api/net#netcreateconnectionoptions-connectlistener) 的别名。

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

是 [`net.createConnection(path[, connectListener])`](/zh/nodejs/api/net#netcreateconnectionpath-connectlistener) 的别名。

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

是 [`net.createConnection(port[, host][, connectListener])`](/zh/nodejs/api/net#netcreateconnectionport-host-connectlistener) 的别名。


## `net.createConnection()` {#netcreateconnection}

一个工厂函数，创建一个新的 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)，立即使用 [`socket.connect()`](/zh/nodejs/api/net#socketconnect) 启动连接，然后返回启动连接的 `net.Socket`。

当连接建立时，将在返回的套接字上触发一个 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件。 最后一个参数 `connectListener`，如果提供，将作为 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器**一次**添加。

可能的签名：

- [`net.createConnection(options[, connectListener])`](/zh/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/zh/nodejs/api/net#netcreateconnectionpath-connectlistener) 用于 [IPC](/zh/nodejs/api/net#ipc-support) 连接。
- [`net.createConnection(port[, host][, connectListener])`](/zh/nodejs/api/net#netcreateconnectionport-host-connectlistener) 用于 TCP 连接。

[`net.connect()`](/zh/nodejs/api/net#netconnect) 函数是此函数的别名。

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**新增于: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必需。 将传递给 [`new net.Socket([options])`](/zh/nodejs/api/net#new-netsocketoptions) 调用和 [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 方法。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 函数的通用参数。 如果提供，将作为返回的套接字上的 [`'connect'`](/zh/nodejs/api/net#event-connect) 事件的监听器添加一次。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 用于启动连接的新创建的套接字。

对于可用的选项，请参阅 [`new net.Socket([options])`](/zh/nodejs/api/net#new-netsocketoptions) 和 [`socket.connect(options[, connectListener])`](/zh/nodejs/api/net#socketconnectoptions-connectlistener)。

附加选项：

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果设置，将用于在创建套接字之后，但在启动连接之前调用 [`socket.setTimeout(timeout)`](/zh/nodejs/api/net#socketsettimeouttimeout-callback)。

以下是 [`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener) 部分中描述的回显服务器的客户端示例：

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 监听器。
  console.log('连接到服务器！');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('与服务器断开连接');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 监听器。
  console.log('连接到服务器！');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('与服务器断开连接');
});
```
:::

要在套接字 `/tmp/echo.sock` 上连接：

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
以下是使用 `port` 和 `onread` 选项的客户端示例。 在这种情况下，`onread` 选项将仅用于调用 `new net.Socket([options])`，而 `port` 选项将用于调用 `socket.connect(options[, connectListener])`。

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // 为每次从套接字读取重复使用一个 4KiB 的 Buffer。
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 收到的数据在 `buf` 中从 0 到 `nread` 可用。
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // 为每次从套接字读取重复使用一个 4KiB 的 Buffer。
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 收到的数据在 `buf` 中从 0 到 `nread` 可用。
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字应连接到的路径。 将传递给 [`socket.connect(path[, connectListener])`](/zh/nodejs/api/net#socketconnectpath-connectlistener)。 参见 [识别 IPC 连接的路径](/zh/nodejs/api/net#identifying-paths-for-ipc-connections)。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 函数的通用参数，启动套接字上 `'connect'` 事件的 "once" 监听器。 将传递给 [`socket.connect(path[, connectListener])`](/zh/nodejs/api/net#socketconnectpath-connectlistener)。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 用于启动连接的新创建的套接字。

启动 [IPC](/zh/nodejs/api/net#ipc-support) 连接。

此函数创建一个新的 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)，所有选项都设置为默认值，立即使用 [`socket.connect(path[, connectListener])`](/zh/nodejs/api/net#socketconnectpath-connectlistener) 启动连接，然后返回启动连接的 `net.Socket`。

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字应连接到的端口。 将传递给 [`socket.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#socketconnectport-host-connectlistener)。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字应连接到的主机。 将传递给 [`socket.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#socketconnectport-host-connectlistener)。 **默认值:** `'localhost'`。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnection) 函数的通用参数，启动套接字上 `'connect'` 事件的 "once" 监听器。 将传递给 [`socket.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#socketconnectport-host-connectlistener)。
- 返回: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 用于启动连接的新创建的套接字。

启动 TCP 连接。

此函数创建一个新的 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)，所有选项都设置为默认值，立即使用 [`socket.connect(port[, host][, connectListener])`](/zh/nodejs/api/net#socketconnectport-host-connectlistener) 启动连接，然后返回启动连接的 `net.Socket`。


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 现在支持 `highWaterMark` 选项。 |
| v17.7.0, v16.15.0 | 现在支持 `noDelay`、`keepAlive` 和 `keepAliveInitialDelay` 选项。 |
| v0.5.0 | 添加于: v0.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `false`，则当可读端结束时，套接字将自动结束可写端。 **默认值:** `false`。
  - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选地覆盖所有 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的 `readableHighWaterMark` 和 `writableHighWaterMark`。 **默认值:** 参见 [`stream.getDefaultHighWaterMark()`](/zh/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode)。
  - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在收到新的传入连接后立即启用套接字上的保持活动功能，类似于在 [`socket.setKeepAlive()`](/zh/nodejs/api/net#socketsetkeepaliveenable-initialdelay) 中所做的操作。 **默认值:** `false`。
  - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果设置为正数，则设置在空闲套接字上发送第一个保持活动探测之前的初始延迟。 **默认值:** `0`。
  - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在收到新的传入连接后立即禁用 Nagle 算法的使用。 **默认值:** `false`。
  - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示是否应在传入连接上暂停套接字。 **默认值:** `false`。
  - `blockList` [\<net.BlockList\>](/zh/nodejs/api/net#class-netblocklist) `blockList` 可用于禁用对特定 IP 地址、IP 范围或 IP 子网的入站访问。 如果服务器位于反向代理、NAT 等之后，则这不起作用，因为针对阻止列表检查的地址是代理的地址，或 NAT 指定的地址。

- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 自动设置为 [`'connection'`](/zh/nodejs/api/net#event-connection) 事件的监听器。
- 返回: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

创建一个新的 TCP 或 [IPC](/zh/nodejs/api/net#ipc-support) 服务器。

如果 `allowHalfOpen` 设置为 `true`，当套接字的另一端发出传输结束信号时，服务器只有在显式调用 [`socket.end()`](/zh/nodejs/api/net#socketenddata-encoding-callback) 时才会发回传输结束信号。 例如，在 TCP 的上下文中，当收到 FIN 数据包时，只有在显式调用 [`socket.end()`](/zh/nodejs/api/net#socketenddata-encoding-callback) 时才会发回 FIN 数据包。 在此之前，连接是半关闭的（不可读但仍然可写）。 有关更多信息，请参阅 [`'end'`](/zh/nodejs/api/net#event-end) 事件和 [RFC 1122](https://tools.ietf.org/html/rfc1122)（第 4.2.2.13 节）。

如果 `pauseOnConnect` 设置为 `true`，则与每个传入连接关联的套接字将被暂停，并且不会从其句柄读取任何数据。 这允许在进程之间传递连接，而无需原始进程读取任何数据。 要开始从暂停的套接字读取数据，请调用 [`socket.resume()`](/zh/nodejs/api/net#socketresume)。

服务器可以是 TCP 服务器或 [IPC](/zh/nodejs/api/net#ipc-support) 服务器，具体取决于它 [`listen()`](/zh/nodejs/api/net#serverlisten) 到什么。

这是一个 TCP 回显服务器的示例，它侦听端口 8124 上的连接：

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' 监听器。
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' 监听器。
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

使用 `telnet` 进行测试：

```bash [BASH]
telnet localhost 8124
```
要在套接字 `/tmp/echo.sock` 上监听：

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
使用 `nc` 连接到 Unix 域套接字服务器：

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**新增于: v19.4.0**

获取 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 的 `autoSelectFamily` 选项的当前默认值。 初始默认值为 `true`，除非提供了命令行选项 `--no-network-family-autoselection`。

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `autoSelectFamily` 选项的当前默认值。

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**新增于: v19.4.0**

设置 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 的 `autoSelectFamily` 选项的默认值。

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 新的默认值。 初始默认值为 `true`，除非提供了命令行选项 `--no-network-family-autoselection`。

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**新增于: v19.8.0, v18.18.0**

获取 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 的 `autoSelectFamilyAttemptTimeout` 选项的当前默认值。 初始默认值为 `250` 或通过命令行选项 `--network-family-autoselection-attempt-timeout` 指定的值。

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `autoSelectFamilyAttemptTimeout` 选项的当前默认值。

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**新增于: v19.8.0, v18.18.0**

设置 [`socket.connect(options)`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 的 `autoSelectFamilyAttemptTimeout` 选项的默认值。

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新的默认值，必须为正数。 如果该数字小于 `10`，则改用值 `10`。 初始默认值为 `250` 或通过命令行选项 `--network-family-autoselection-attempt-timeout` 指定的值。


## `net.isIP(input)` {#netisipinput}

**新增于: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

如果 `input` 是 IPv6 地址，则返回 `6`。 如果 `input` 是没有前导零的 [点分十进制表示法](https://en.wikipedia.org/wiki/Dot-decimal_notation) 的 IPv4 地址，则返回 `4`。 否则，返回 `0`。

```js [ESM]
net.isIP('::1'); // 返回 6
net.isIP('127.0.0.1'); // 返回 4
net.isIP('127.000.000.001'); // 返回 0
net.isIP('127.0.0.1/24'); // 返回 0
net.isIP('fhqwhgads'); // 返回 0
```
## `net.isIPv4(input)` {#netisipv4input}

**新增于: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `input` 是没有前导零的 [点分十进制表示法](https://en.wikipedia.org/wiki/Dot-decimal_notation) 的 IPv4 地址，则返回 `true`。 否则，返回 `false`。

```js [ESM]
net.isIPv4('127.0.0.1'); // 返回 true
net.isIPv4('127.000.000.001'); // 返回 false
net.isIPv4('127.0.0.1/24'); // 返回 false
net.isIPv4('fhqwhgads'); // 返回 false
```
## `net.isIPv6(input)` {#netisipv6input}

**新增于: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `input` 是 IPv6 地址，则返回 `true`。 否则，返回 `false`。

```js [ESM]
net.isIPv6('::1'); // 返回 true
net.isIPv6('fhqwhgads'); // 返回 false
```
