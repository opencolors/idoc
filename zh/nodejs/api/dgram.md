---
title: Node.js 文档 - dgram
description: dgram 模块提供了 UDP 数据报套接字的实现，允许创建能够发送和接收数据报包的客户端和服务器应用程序。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: dgram 模块提供了 UDP 数据报套接字的实现，允许创建能够发送和接收数据报包的客户端和服务器应用程序。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: dgram 模块提供了 UDP 数据报套接字的实现，允许创建能够发送和接收数据报包的客户端和服务器应用程序。
---


# UDP/数据报套接字 {#udp/datagram-sockets}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

`node:dgram` 模块提供了 UDP 数据报套接字的实现。

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`服务器错误:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`服务器收到: ${msg} 来自 ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`服务器监听 ${address.address}:${address.port}`);
});

server.bind(41234);
// 打印: 服务器监听 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`服务器错误:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`服务器收到: ${msg} 来自 ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`服务器监听 ${address.address}:${address.port}`);
});

server.bind(41234);
// 打印: 服务器监听 0.0.0.0:41234
```
:::

## 类: `dgram.Socket` {#class-dgramsocket}

**新增于: v0.1.99**

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

封装了数据报的功能。

`dgram.Socket` 的新实例使用 [`dgram.createSocket()`](/zh/nodejs/api/dgram#dgramcreatesocketoptions-callback) 创建。 不要使用 `new` 关键字创建 `dgram.Socket` 实例。

### 事件: `'close'` {#event-close}

**新增于: v0.1.99**

当套接字通过 [`close()`](/zh/nodejs/api/dgram#socketclosecallback) 关闭后，会触发 `'close'` 事件。 触发后，此套接字上不会再触发新的 `'message'` 事件。

### 事件: `'connect'` {#event-connect}

**新增于: v12.0.0**

在成功调用 [`connect()`](/zh/nodejs/api/dgram#socketconnectport-address-callback) 后，套接字与远程地址相关联时，会触发 `'connect'` 事件。


### 事件: `'error'` {#event-error}

**加入于: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

每当发生任何错误时，都会触发 `'error'` 事件。事件处理函数会传递一个 `Error` 对象。

### 事件: `'listening'` {#event-listening}

**加入于: v0.1.99**

当 `dgram.Socket` 可寻址并且可以接收数据时，会触发一次 `'listening'` 事件。这可以通过 `socket.bind()` 显式地完成，也可以在第一次使用 `socket.send()` 发送数据时隐式地完成。在 `dgram.Socket` 监听之前，底层系统资源不存在，并且调用 `socket.address()` 和 `socket.setTTL()` 等方法将会失败。

### 事件: `'message'` {#event-message}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0 | `family` 属性现在返回一个字符串，而不是一个数字。 |
| v18.0.0 | `family` 属性现在返回一个数字，而不是一个字符串。 |
| v0.1.99 | 加入于: v0.1.99 |
:::

当套接字上有新的数据报可用时，会触发 `'message'` 事件。事件处理函数会传递两个参数：`msg` 和 `rinfo`。

- `msg` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 消息。
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 远程地址信息。
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 发送者地址。
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 地址族（`'IPv4'` 或 `'IPv6'`）。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 发送者端口。
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 消息大小。

如果传入数据包的源地址是 IPv6 链路本地地址，则接口名称将添加到 `address`。例如，在 `en0` 接口上接收到的数据包可能将其地址字段设置为 `'fe80::2618:1234:ab11:3b9c%en0'`，其中 `'%en0'` 是作为区域 ID 后缀的接口名称。


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**新增于: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

通知内核使用 `IP_ADD_MEMBERSHIP` 套接字选项加入给定 `multicastAddress` 和 `multicastInterface` 的多播组。 如果未指定 `multicastInterface` 参数，则操作系统将选择一个接口并将其添加到该接口。 要将成员资格添加到每个可用接口，请多次调用 `addMembership`，每个接口调用一次。

在未绑定的套接字上调用时，此方法将隐式绑定到随机端口，侦听所有接口。

当在多个 `cluster` 工作进程之间共享 UDP 套接字时，`socket.addMembership()` 函数必须只调用一次，否则会发生 `EADDRINUSE` 错误：

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // 工作正常。
  cluster.fork(); // 失败并显示 EADDRINUSE。
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // 工作正常。
  cluster.fork(); // 失败并显示 EADDRINUSE。
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**新增于: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

通知内核使用带有 `IP_ADD_SOURCE_MEMBERSHIP` 套接字选项的 `multicastInterface`，在给定的 `sourceAddress` 和 `groupAddress` 加入特定于源的多播通道。 如果未指定 `multicastInterface` 参数，则操作系统将选择一个接口并将其添加到该接口。 要将成员资格添加到每个可用接口，请多次调用 `socket.addSourceSpecificMembership()`，每个接口调用一次。

在未绑定的套接字上调用时，此方法将隐式绑定到随机端口，侦听所有接口。


### `socket.address()` {#socketaddress}

**Added in: v0.1.99**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个包含套接字地址信息的对象。 对于 UDP 套接字，此对象将包含 `address`、`family` 和 `port` 属性。

如果在未绑定的套接字上调用此方法，则会抛出 `EBADF`。

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v0.9.1 | 该方法已更改为异步执行模型。 遗留代码需要更改为将回调函数传递给方法调用。 |
| v0.1.99 | 添加于: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 无参数。 绑定完成后调用。

对于 UDP 套接字，使 `dgram.Socket` 在指定的 `port` 和可选的 `address` 上监听数据报消息。 如果未指定 `port` 或为 `0`，则操作系统将尝试绑定到随机端口。 如果未指定 `address`，则操作系统将尝试监听所有地址。 绑定完成后，将触发一个 `'listening'` 事件，并调用可选的 `callback` 函数。

同时指定 `'listening'` 事件监听器并将 `callback` 传递给 `socket.bind()` 方法没有坏处，但不是很有用。

绑定的数据报套接字使 Node.js 进程保持运行以接收数据报消息。

如果绑定失败，则会生成 `'error'` 事件。 在极少数情况下（例如，尝试与已关闭的套接字绑定），可能会抛出 [`Error`](/zh/nodejs/api/errors#class-error)。

UDP 服务器在端口 41234 上监听的示例：

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**添加于: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必需。支持以下属性：
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

对于 UDP 套接字，会导致 `dgram.Socket` 监听指定 `port` 和可选 `address` 上的数据报消息，它们作为 `options` 对象的属性传递，该对象作为第一个参数传递。 如果未指定 `port` 或为 `0`，操作系统将尝试绑定到随机端口。 如果未指定 `address`，操作系统将尝试监听所有地址。 绑定完成后，将发出 `'listening'` 事件，并调用可选的 `callback` 函数。

`options` 对象可能包含 `fd` 属性。 当设置大于 `0` 的 `fd` 时，它将包装具有给定文件描述符的现有套接字。 在这种情况下，`port` 和 `address` 的属性将被忽略。

指定 `'listening'` 事件监听器并向 `socket.bind()` 方法传递 `callback` 并非有害，但不是很有用。

`options` 对象可能包含一个额外的 `exclusive` 属性，该属性在使用带有 [`cluster`](/zh/nodejs/api/cluster) 模块的 `dgram.Socket` 对象时使用。 当 `exclusive` 设置为 `false` (默认值) 时，集群工作进程将使用相同的底层套接字句柄，允许共享连接处理职责。 但是，当 `exclusive` 为 `true` 时，句柄不会被共享，并且尝试端口共享会导致错误。 创建一个 `reusePort` 选项设置为 `true` 的 `dgram.Socket` 会导致 `exclusive` 在调用 `socket.bind()` 时始终为 `true`。

绑定的数据报套接字会保持 Node.js 进程运行以接收数据报消息。

如果绑定失败，则会生成 `'error'` 事件。 在极少数情况下（例如，尝试使用已关闭的套接字进行绑定），可能会抛出 [`Error`](/zh/nodejs/api/errors#class-error)。

下面显示了一个监听专用端口的套接字示例。

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**添加于: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当 socket 被关闭时调用。

关闭底层的 socket 并且停止监听其上的数据。 如果提供了回调函数，它会被添加为 [`'close'`](/zh/nodejs/api/dgram#event-close) 事件的监听器。

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**添加于: v20.5.0, v18.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

调用 [`socket.close()`](/zh/nodejs/api/dgram#socketclosecallback) 并且返回一个 promise，当 socket 关闭时 promise 会被兑现。

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**添加于: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当连接完成或发生错误时调用。

将 `dgram.Socket` 关联到远程地址和端口。 此句柄发送的每条消息都会自动发送到该目标地址。 此外，socket 将仅接收来自该远程对等方的消息。 尝试在已连接的 socket 上调用 `connect()` 将导致 [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/zh/nodejs/api/errors#err_socket_dgram_is_connected) 异常。 如果未提供 `address`，则默认使用 `'127.0.0.1'`（对于 `udp4` socket）或 `'::1'`（对于 `udp6` socket）。 连接完成后，将发出一个 `'connect'` 事件，并调用可选的 `callback` 函数。 如果发生故障，则调用 `callback`，或者，如果失败，则发出一个 `'error'` 事件。

### `socket.disconnect()` {#socketdisconnect}

**添加于: v12.0.0**

一个同步函数，用于将已连接的 `dgram.Socket` 与其远程地址解除关联。 尝试在未绑定或已断开连接的 socket 上调用 `disconnect()` 将导致 [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/zh/nodejs/api/errors#err_socket_dgram_not_connected) 异常。


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Added in: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指示内核使用 `IP_DROP_MEMBERSHIP` socket 选项离开 `multicastAddress` 上的多播组。 此方法在套接字关闭或进程终止时由内核自动调用，因此大多数应用程序都不会有理由调用此方法。

如果未指定 `multicastInterface`，则操作系统将尝试在所有有效接口上删除成员资格。

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Added in: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指示内核使用 `IP_DROP_SOURCE_MEMBERSHIP` socket 选项离开给定 `sourceAddress` 和 `groupAddress` 上的特定于源的多播通道。 此方法在套接字关闭或进程终止时由内核自动调用，因此大多数应用程序都不会有理由调用此方法。

如果未指定 `multicastInterface`，则操作系统将尝试在所有有效接口上删除成员资格。

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Added in: v8.7.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_RCVBUF` 套接字接收缓冲区大小（以字节为单位）。

如果在未绑定的套接字上调用此方法，则会抛出 [`ERR_SOCKET_BUFFER_SIZE`](/zh/nodejs/api/errors#err_socket_buffer_size)。

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Added in: v8.7.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_SNDBUF` 套接字发送缓冲区大小（以字节为单位）。

如果在未绑定的套接字上调用此方法，则会抛出 [`ERR_SOCKET_BUFFER_SIZE`](/zh/nodejs/api/errors#err_socket_buffer_size)。


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**添加于: v18.8.0, v16.19.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 队列中等待发送的字节数。

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**添加于: v18.8.0, v16.19.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 队列中当前等待处理的发送请求数。

### `socket.ref()` {#socketref}

**添加于: v0.9.1**

- 返回: [\<dgram.Socket\>](/zh/nodejs/api/dgram#class-dgramsocket)

默认情况下，绑定套接字会导致 Node.js 进程在套接字打开时阻止退出。 `socket.unref()` 方法可用于将套接字从保持 Node.js 进程处于活动状态的引用计数中排除。 `socket.ref()` 方法将套接字添加回引用计数并恢复默认行为。

多次调用 `socket.ref()` 不会产生额外的效果。

`socket.ref()` 方法返回对套接字的引用，因此可以链式调用。

### `socket.remoteAddress()` {#socketremoteaddress}

**添加于: v12.0.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个对象，其中包含远程端点的 `address`、`family` 和 `port`。 如果套接字未连接，则此方法会抛出 [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/zh/nodejs/api/errors#err_socket_dgram_not_connected) 异常。

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.0.0 | `address` 参数现在只接受 `string`、`null` 或 `undefined`。 |
| v14.5.0, v12.19.0 | `msg` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v12.0.0 | 添加了对在连接的套接字上发送数据的支持。 |
| v8.0.0 | `msg` 参数现在可以是 `Uint8Array`。 |
| v8.0.0 | `address` 参数现在始终是可选的。 |
| v6.0.0 | 成功时，`callback` 现在将使用 `null` 而不是 `0` 的 `error` 参数调用。 |
| v5.7.0 | `msg` 参数现在可以是一个数组。 此外，`offset` 和 `length` 参数现在是可选的。 |
| v0.1.99 | 添加于: v0.1.99 |
:::

- `msg` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 要发送的消息。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 消息开始的缓冲区中的偏移量。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 消息中的字节数。
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 目标端口。
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 目标主机名或 IP 地址。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 消息已发送时调用。

在套接字上广播数据报。 对于无连接套接字，必须指定目标 `port` 和 `address`。 另一方面，连接的套接字将使用其关联的远程端点，因此不得设置 `port` 和 `address` 参数。

`msg` 参数包含要发送的消息。 根据其类型，可以应用不同的行为。 如果 `msg` 是一个 `Buffer`，任何 `TypedArray` 或 `DataView`，则 `offset` 和 `length` 分别指定消息开始的 `Buffer` 中的偏移量以及消息中的字节数。 如果 `msg` 是一个 `String`，那么它会自动转换为具有 `'utf8'` 编码的 `Buffer`。 对于包含多字节字符的消息，`offset` 和 `length` 将根据 [字节长度](/zh/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) 而不是字符位置进行计算。 如果 `msg` 是一个数组，则不得指定 `offset` 和 `length`。

`address` 参数是一个字符串。 如果 `address` 的值是一个主机名，将使用 DNS 来解析该主机的地址。 如果未提供 `address` 或以其他方式为空值，则默认情况下将使用 `'127.0.0.1'`（对于 `udp4` 套接字）或 `'::1'`（对于 `udp6` 套接字）。

如果之前没有通过调用 `bind` 绑定套接字，则该套接字会被分配一个随机端口号，并绑定到“所有接口”地址（`udp4` 套接字的 `'0.0.0.0'`，`udp6` 套接字的 `'::0'`）。

可以指定一个可选的 `callback` 函数，作为报告 DNS 错误或确定何时可以安全地重用 `buf` 对象的方式。 DNS 查找会延迟至少一个 Node.js 事件循环的时间来发送。

确保数据报已发送的唯一方法是使用 `callback`。 如果发生错误并且给出了 `callback`，则该错误将作为第一个参数传递给 `callback`。 如果未给出 `callback`，则该错误将作为 `socket` 对象上的 `'error'` 事件发出。

Offset 和 length 是可选的，但如果使用其中任何一个，则 *必须* 同时设置。 仅当第一个参数是 `Buffer`、`TypedArray` 或 `DataView` 时才支持它们。

如果在一个未绑定的套接字上调用此方法，则会抛出 [`ERR_SOCKET_BAD_PORT`](/zh/nodejs/api/errors#err_socket_bad_port)。

以下示例将 UDP 数据包发送到 `localhost` 上的端口：

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

以下示例将由多个缓冲区组成的 UDP 数据包发送到 `127.0.0.1` 上的端口：

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

发送多个缓冲区可能会更快或更慢，具体取决于应用程序和操作系统。 运行基准测试以确定在具体情况下的最佳策略。 但一般来说，发送多个缓冲区会更快。

以下示例使用连接到 `localhost` 上的端口的套接字发送 UDP 数据包：

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::


#### 关于 UDP 数据报大小的注意事项 {#note-about-udp-datagram-size}

IPv4/v6 数据报的最大大小取决于 `MTU`（最大传输单元）和 `Payload Length` 字段的大小。

- `Payload Length` 字段宽度为 16 位，这意味着正常有效负载不能超过 64K 个八位字节，包括互联网标头和数据（65,507 字节 = 65,535 - 8 字节 UDP 标头 - 20 字节 IP 标头）；这通常适用于环回接口，但是对于大多数主机和网络而言，如此长的数据报消息是不切实际的。
- `MTU` 是给定的链路层技术可以支持的数据报消息的最大大小。 对于任何链路，IPv4 强制执行最小 `MTU` 为 68 个八位字节，而 IPv4 的推荐 `MTU` 为 576（通常建议用作拨号类型应用程序的 `MTU`），无论它们是完整到达还是分片到达。 对于 IPv6，最小 `MTU` 为 1280 个八位字节。 但是，强制性的最小分片重组缓冲区大小为 1500 个八位字节。 68 个八位字节的值非常小，因为当前大多数链路层技术（如以太网）的最小 `MTU` 为 1500。

不可能预先知道数据包可能经过的每个链路的 MTU。 发送大于接收方 `MTU` 的数据报将不起作用，因为数据包将被静默丢弃，而不会通知源数据未到达其预期收件人。

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**新增于: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type)

设置或清除 `SO_BROADCAST` socket 选项。 当设置为 `true` 时，UDP 数据包可以发送到本地接口的广播地址。

如果在未绑定的 socket 上调用此方法，则会抛出 `EBADF`。

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**新增于: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)

*本节中对 scope 的所有引用均指
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">IPv6 Zone Indexes</a>，其由 <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a> 定义。 以字符串形式，带有 scope 索引的 IP
写为 <code>'IP%scope'</code>，其中 scope 是接口名称或接口号。*

将 socket 的默认传出多播接口设置为所选接口或返回到系统接口选择。 `multicastInterface` 必须是来自 socket 族的 IP 的有效字符串表示形式。

对于 IPv4 socket，这应该是为所需物理接口配置的 IP。 发送到 socket 上的多播的所有数据包都将通过最近一次成功使用此调用确定的接口发送。

对于 IPv6 socket，`multicastInterface` 应包含一个 scope 以指示该接口，如以下示例所示。 在 IPv6 中，单个 `send` 调用也可以在地址中使用显式 scope，因此只有发送到未指定显式 scope 的多播地址的数据包才会受到最近一次成功使用此调用的影响。

如果在未绑定的 socket 上调用此方法，则会抛出 `EBADF`。


#### 示例：IPv6 出站多播接口 {#example-ipv6-outgoing-multicast-interface}

在大多数系统中，范围格式使用接口名称：

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
在 Windows 上，范围格式使用接口编号：

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### 示例：IPv4 出站多播接口 {#example-ipv4-outgoing-multicast-interface}

所有系统都使用主机在所需物理接口上的 IP：

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### 调用结果 {#call-results}

在未准备好发送或不再打开的套接字上调用可能会抛出 *Not running* [`Error`](/zh/nodejs/api/errors#class-error)。

如果 `multicastInterface` 无法解析为 IP，则会抛出 *EINVAL* [`System Error`](/zh/nodejs/api/errors#class-systemerror)。

在 IPv4 上，如果 `multicastInterface` 是一个有效的地址，但不匹配任何接口，或者如果该地址与地址族不匹配，则会抛出一个 [`System Error`](/zh/nodejs/api/errors#class-systemerror)，例如 `EADDRNOTAVAIL` 或 `EPROTONOSUP`。

在 IPv6 上，指定或省略范围的大多数错误将导致套接字继续使用（或返回到）系统的默认接口选择。

套接字的地址族的 ANY 地址（IPv4 `'0.0.0.0'` 或 IPv6 `'::'`）可用于将套接字默认出站接口的控制权返回给系统，以供将来的多播数据包使用。

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Added in: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

设置或清除 `IP_MULTICAST_LOOP` 套接字选项。 当设置为 `true` 时，多播数据包也将在本地接口上接收。

如果在未绑定的套接字上调用此方法，则抛出 `EBADF`。

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Added in: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置 `IP_MULTICAST_TTL` 套接字选项。 虽然 TTL 通常代表“生存时间”，但在这种情况下，它指定了数据包允许通过的 IP 跳数，特别是对于多播流量。 转发数据包的每个路由器或网关都会递减 TTL。 如果 TTL 被路由器递减到 0，则不会转发该数据包。

`ttl` 参数可以在 0 到 255 之间。 大多数系统上的默认值为 `1`。

如果在未绑定的套接字上调用此方法，则抛出 `EBADF`。


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置 `SO_RCVBUF` socket 选项。设置最大 socket 接收缓冲区，单位为字节。

如果在一个未绑定的 socket 上调用此方法，则会抛出 [`ERR_SOCKET_BUFFER_SIZE`](/zh/nodejs/api/errors#err_socket_buffer_size)。

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置 `SO_SNDBUF` socket 选项。设置最大 socket 发送缓冲区，单位为字节。

如果在一个未绑定的 socket 上调用此方法，则会抛出 [`ERR_SOCKET_BUFFER_SIZE`](/zh/nodejs/api/errors#err_socket_buffer_size)。

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Added in: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置 `IP_TTL` socket 选项。虽然 TTL 通常代表 "Time to Live"（生存时间），但在这种上下文中，它指定了数据包允许通过的 IP 跳数。 每个转发数据包的路由器或网关都会递减 TTL。 如果路由器将 TTL 递减到 0，则不会转发该数据包。 更改 TTL 值通常用于网络探测或多播。

`ttl` 参数的取值范围为 1 到 255。 大多数系统上的默认值为 64。

如果在未绑定的 socket 上调用此方法，则会抛出 `EBADF`。

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- Returns: [\<dgram.Socket\>](/zh/nodejs/api/dgram#class-dgramsocket)

默认情况下，绑定一个 socket 将会阻止 Node.js 进程退出，只要该 socket 是打开的。 `socket.unref()` 方法可用于将 socket 从保持 Node.js 进程处于活动状态的引用计数中排除，即使 socket 仍在监听，也允许进程退出。

多次调用 `socket.unref()` 不会产生额外的效果。

`socket.unref()` 方法返回对 socket 的引用，因此可以链式调用。


## `node:dgram` 模块函数 {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}

::: info [历史记录]
| 版本    | 变更                                                              |
| ------- | ----------------------------------------------------------------- |
| v23.1.0 | 支持 `reusePort` 选项。                                           |
| v15.8.0 | 添加了 AbortSignal 支持。                                          |
| v11.4.0 | 支持 `ipv6Only` 选项。                                            |
| v8.7.0  | 现在支持 `recvBufferSize` 和 `sendBufferSize` 选项。                 |
| v8.6.0  | 支持 `lookup` 选项。                                              |
| v0.11.13 | 添加于: v0.11.13                                                   |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可用选项如下:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 套接字族。 必须是 `'udp4'` 或 `'udp6'`。 必需。
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback) 将重用该地址，即使另一个进程已经绑定了该地址上的套接字，但只有一个套接字可以接收数据。 **默认值:** `false`。
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback) 将重用该端口，即使另一个进程已经绑定了该端口上的套接字。 传入的数据报将分发到侦听套接字。 该选项仅在某些平台上可用，例如 Linux 3.9+、DragonFlyBSD 3.6+、FreeBSD 12.0+、Solaris 11.4 和 AIX 7.2.5+。 在不支持的平台上，绑定套接字时，此选项会引发错误。 **默认值:** `false`。
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 将 `ipv6Only` 设置为 `true` 将禁用双栈支持，即绑定到地址 `::` 不会导致 `0.0.0.0` 被绑定。 **默认值:** `false`。
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 `SO_RCVBUF` 套接字值。
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 `SO_SNDBUF` 套接字值。
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 自定义查找函数。 **默认值:** [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于关闭套接字的 AbortSignal。
    - `receiveBlockList` [\<net.BlockList\>](/zh/nodejs/api/net#class-netblocklist) `receiveBlockList` 可用于丢弃发往特定 IP 地址、IP 范围或 IP 子网的入站数据报。 如果服务器位于反向代理、NAT 等之后，则此方法不起作用，因为针对阻止列表检查的地址是代理的地址或 NAT 指定的地址。
    - `sendBlockList` [\<net.BlockList\>](/zh/nodejs/api/net#class-netblocklist) `sendBlockList` 可用于禁用对特定 IP 地址、IP 范围或 IP 子网的出站访问。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 作为 `'message'` 事件的侦听器附加。 可选。
- 返回: [\<dgram.Socket\>](/zh/nodejs/api/dgram#class-dgramsocket)

创建 `dgram.Socket` 对象。 创建套接字后，调用 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback) 将指示套接字开始侦听数据报消息。 如果未将 `address` 和 `port` 传递给 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback)，则该方法会将套接字绑定到随机端口上的“所有接口”地址（它对 `udp4` 和 `udp6` 套接字都有效）。 可以使用 [`socket.address().address`](/zh/nodejs/api/dgram#socketaddress) 和 [`socket.address().port`](/zh/nodejs/api/dgram#socketaddress) 检索绑定的地址和端口。

如果启用了 `signal` 选项，则在相应的 `AbortController` 上调用 `.abort()` 类似于在套接字上调用 `.close()`：

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// 稍后，当您想关闭服务器时。
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**新增于: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'udp4'` 或 `'udp6'`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 作为监听器附加到 `'message'` 事件。
- 返回: [\<dgram.Socket\>](/zh/nodejs/api/dgram#class-dgramsocket)

创建指定 `type` 的 `dgram.Socket` 对象。

创建套接字后，调用 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback) 将指示套接字开始监听数据报消息。 当 `address` 和 `port` 未传递给 [`socket.bind()`](/zh/nodejs/api/dgram#socketbindport-address-callback) 时，该方法会将套接字绑定到随机端口上的“所有接口”地址（它对 `udp4` 和 `udp6` 套接字都有效）。 可以使用 [`socket.address().address`](/zh/nodejs/api/dgram#socketaddress) 和 [`socket.address().port`](/zh/nodejs/api/dgram#socketaddress) 检索绑定的地址和端口。

