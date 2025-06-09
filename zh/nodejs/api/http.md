---
title: Node.js HTTP 模块文档
description: Node.js 官方 HTTP 模块的文档，详细介绍如何创建 HTTP 服务器和客户端，处理请求和响应，以及管理各种 HTTP 方法和头信息。
head:
  - - meta
    - name: og:title
      content: Node.js HTTP 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 官方 HTTP 模块的文档，详细介绍如何创建 HTTP 服务器和客户端，处理请求和响应，以及管理各种 HTTP 方法和头信息。
  - - meta
    - name: twitter:title
      content: Node.js HTTP 模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 官方 HTTP 模块的文档，详细介绍如何创建 HTTP 服务器和客户端，处理请求和响应，以及管理各种 HTTP 方法和头信息。
---


# HTTP {#http}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

此模块包含客户端和服务器，可以通过 `require('node:http')` (CommonJS) 或 `import * as http from 'node:http'` (ES 模块) 导入。

Node.js 中的 HTTP 接口旨在支持协议的许多传统上难以使用的功能。 特别是，大型的，可能采用分块编码的消息。 该接口非常小心，永远不会缓冲整个请求或响应，因此用户能够流式传输数据。

HTTP 消息头由如下对象表示：

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
键是小写的。 值不会被修改。

为了支持所有可能的 HTTP 应用程序，Node.js HTTP API 非常底层。 它只处理流处理和消息解析。 它将消息解析为标头和主体，但不解析实际的标头或主体。

有关如何处理重复标头的详细信息，请参阅 [`message.headers`](/zh/nodejs/api/http#messageheaders)。

原始标头（按接收时的样子）保留在 `rawHeaders` 属性中，该属性是 `[key, value, key2, value2, ...]` 的数组。 例如，先前的消息头对象可能具有如下 `rawHeaders` 列表：

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## 类: `http.Agent` {#class-httpagent}

**加入于: v0.3.4**

`Agent` 负责管理 HTTP 客户端的连接持久性和重用。 它维护给定主机和端口的挂起请求队列，为每个请求重用单个套接字连接，直到队列为空为止，此时套接字将被销毁或放入池中，以供再次用于对同一主机和端口的请求。 它是被销毁还是被放入池中取决于 `keepAlive` [选项](/zh/nodejs/api/http#new-agentoptions)。

池化连接启用了 TCP Keep-Alive，但服务器仍然可以关闭空闲连接，在这种情况下，它们将从池中删除，并且当为该主机和端口发出新的 HTTP 请求时，将建立新的连接。 服务器也可能拒绝允许通过同一连接发送多个请求，在这种情况下，必须为每个请求重新建立连接，并且无法进行池化。 `Agent` 仍将向该服务器发出请求，但每个请求都将通过新连接进行。

当连接被客户端或服务器关闭时，它将从池中删除。 池中任何未使用的套接字都将被取消引用，以便在没有未完成的请求时不会使 Node.js 进程保持运行。 （请参阅 [`socket.unref()`](/zh/nodejs/api/net#socketunref)）。

最佳实践是在不再使用 `Agent` 实例时 [`destroy()`](/zh/nodejs/api/http#agentdestroy) 它，因为未使用的套接字会消耗操作系统资源。

当套接字发出 `'close'` 事件或 `'agentRemove'` 事件时，将从代理中删除套接字。 当打算保持一个 HTTP 请求打开很长时间而不将其保留在代理中时，可以执行以下操作：

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
代理也可以用于单个请求。 通过将 `{agent: false}` 作为选项提供给 `http.get()` 或 `http.request()` 函数，将使用具有默认选项的一次性使用 `Agent` 用于客户端连接。

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.6.0, v14.17.0 | 将默认调度从 'fifo' 更改为 'lifo'。 |
| v14.5.0, v12.20.0 | 添加 `scheduling` 选项以指定空闲套接字调度策略。 |
| v14.5.0, v12.19.0 | 向 agent 构造函数添加 `maxTotalSockets` 选项。 |
| v0.3.4 | 添加于: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 在 agent 上设置的可配置选项集。可以有以下字段：
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 即使没有未完成的请求，也保持套接字处于打开状态，以便它们可以用于未来的请求，而无需重新建立 TCP 连接。不要与 `Connection` 标头的 `keep-alive` 值混淆。使用 agent 时，始终发送 `Connection: keep-alive` 标头，除非显式指定 `Connection` 标头，或者分别将 `keepAlive` 和 `maxSockets` 选项设置为 `false` 和 `Infinity`，在这种情况下将使用 `Connection: close`。**默认值:** `false`。
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当使用 `keepAlive` 选项时，指定 TCP Keep-Alive 数据包的[初始延迟](/zh/nodejs/api/net#socketsetkeepaliveenable-initialdelay)。当 `keepAlive` 选项为 `false` 或 `undefined` 时，将被忽略。**默认值:** `1000`。
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 每个主机允许的最大套接字数。如果同一主机打开多个并发连接，则每个请求将使用新的套接字，直到达到 `maxSockets` 值。如果主机尝试打开比 `maxSockets` 更多的连接，则其他请求将进入待处理请求队列，并在现有连接终止时进入活动连接状态。这确保在任何时间点，来自给定主机的活动连接最多为 `maxSockets` 个。**默认值:** `Infinity`。
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 所有主机总共允许的最大套接字数。每个请求将使用一个新的套接字，直到达到最大值。**默认值:** `Infinity`。
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 每个主机在空闲状态下保持打开的最大套接字数。仅当 `keepAlive` 设置为 `true` 时才相关。**默认值:** `256`。
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 选择下一个要使用的空闲套接字时要应用的调度策略。它可以是 `'fifo'` 或 `'lifo'`。两种调度策略的主要区别在于 `'lifo'` 选择最近使用的套接字，而 `'fifo'` 选择最近最少使用的套接字。在每秒请求速率较低的情况下，`'lifo'` 调度将降低选择可能因不活动而被服务器关闭的套接字的风险。在每秒请求速率较高的情况下，`'fifo'` 调度将最大化打开的套接字数，而 `'lifo'` 调度将使其保持尽可能低。**默认值:** `'lifo'`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 套接字超时（以毫秒为单位）。这将在创建套接字时设置超时。

`socket.connect()` 中的 `options` 也支持。

要配置其中的任何一个，必须创建一个自定义的 [`http.Agent`](/zh/nodejs/api/http#class-httpagent) 实例。

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**加入于: v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含连接详情的选项。有关选项的格式，请查看 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 接收已创建套接字的函数回调
- 返回: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

产生一个用于 HTTP 请求的套接字/流。

默认情况下，此函数与 [`net.createConnection()`](/zh/nodejs/api/net#netcreateconnectionoptions-connectlistener) 相同。 但是，如果需要更大的灵活性，自定义代理可能会覆盖此方法。

可以通过两种方式提供套接字/流：通过从此函数返回套接字/流，或通过将套接字/流传递给 `callback`。

保证此方法返回 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的一个实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的一个子类，除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 以外的套接字类型。

`callback` 的签名为 `(err, stream)`。

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**加入于: v8.1.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

当 `socket` 从请求中分离并且可以被 `Agent` 持久化时调用。 默认行为是：

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
可以通过特定的 `Agent` 子类覆盖此方法。 如果此方法返回一个假值，则套接字将被销毁，而不是为了与下一个请求一起使用而保留它。

`socket` 参数可以是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 的一个实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的一个子类。

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**加入于: v8.1.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

由于 keep-alive 选项，在 `socket` 被持久化后附加到 `request` 时调用。 默认行为是：

```js [ESM]
socket.ref();
```
可以通过特定的 `Agent` 子类覆盖此方法。

`socket` 参数可以是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 的一个实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的一个子类。


### `agent.destroy()` {#agentdestroy}

**添加于: v0.11.4**

销毁代理当前正在使用的任何套接字。

通常不需要这样做。但是，如果使用启用了 `keepAlive` 的代理，则最好在不再需要该代理时显式关闭它。否则，套接字可能会保持打开状态很长时间，直到服务器终止它们。

### `agent.freeSockets` {#agentfreesockets}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 该属性现在具有 `null` 原型。 |
| v0.11.4 | 添加于: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个对象，其中包含当 `keepAlive` 启用时，代理当前正在等待使用的套接字数组。不要修改。

`freeSockets` 列表中的套接字将被自动销毁，并在 `'timeout'` 时从数组中移除。

### `agent.getName([options])` {#agentgetnameoptions}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.7.0, v16.15.0 | `options` 参数现在是可选的。 |
| v0.11.4 | 添加于: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一组选项，提供用于名称生成的信息
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要向其发出请求的服务器的域名或 IP 地址
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程服务器的端口
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 发出请求时要绑定到网络连接的本地接口
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果它不等于 `undefined`，则必须是 4 或 6。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取一组请求选项的唯一名称，以确定是否可以重复使用连接。 对于 HTTP 代理，这将返回 `host:port:localAddress` 或 `host:port:localAddress:family`。 对于 HTTPS 代理，该名称包括 CA、证书、密码和其他 HTTPS/TLS 特定的选项，这些选项决定了套接字的可重用性。


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Added in: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

默认值为 256。对于启用了 `keepAlive` 的代理，此设置将指定空闲状态下保持打开的最大套接字数。

### `agent.maxSockets` {#agentmaxsockets}

**Added in: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

默认值为 `Infinity`。确定代理可以为每个源打开的并发套接字数。源是 [`agent.getName()`](/zh/nodejs/api/http#agentgetnameoptions) 返回的值。

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Added in: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

默认值为 `Infinity`。确定代理可以打开的并发套接字数。与 `maxSockets` 不同，此参数适用于所有源。

### `agent.requests` {#agentrequests}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v16.0.0 | 该属性现在有一个 `null` 原型。 |
| v0.5.9 | Added in: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个对象，其中包含尚未分配给套接字的请求队列。请勿修改。

### `agent.sockets` {#agentsockets}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v16.0.0 | 该属性现在有一个 `null` 原型。 |
| v0.3.6 | Added in: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个对象，其中包含代理当前正在使用的套接字数组。请勿修改。

## 类: `http.ClientRequest` {#class-httpclientrequest}

**Added in: v0.1.17**

- 继承自: [\<http.OutgoingMessage\>](/zh/nodejs/api/http#class-httpoutgoingmessage)

此对象在内部创建并从 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 返回。它表示一个 *正在进行中* 的请求，其标头已经排队。可以使用 [`setHeader(name, value)`](/zh/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/zh/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/zh/nodejs/api/http#requestremoveheadername) API 修改标头。实际的标头将与第一个数据块一起发送，或者在调用 [`request.end()`](/zh/nodejs/api/http#requestenddata-encoding-callback) 时发送。

要获取响应，请向请求对象添加 [`'response'`](/zh/nodejs/api/http#event-response) 的监听器。当接收到响应头时，将从请求对象发出 [`'response'`](/zh/nodejs/api/http#event-response)。[`'response'`](/zh/nodejs/api/http#event-response) 事件使用一个参数执行，该参数是 [`http.IncomingMessage`](/zh/nodejs/api/http#class-httpincomingmessage) 的实例。

在 [`'response'`](/zh/nodejs/api/http#event-response) 事件期间，可以向响应对象添加监听器；特别是监听 `'data'` 事件。

如果未添加任何 [`'response'`](/zh/nodejs/api/http#event-response) 处理程序，则响应将被完全丢弃。但是，如果添加了 [`'response'`](/zh/nodejs/api/http#event-response) 事件处理程序，则**必须**消耗响应对象中的数据，可以通过在每次出现 `'readable'` 事件时调用 `response.read()`，或者通过添加 `'data'` 处理程序，或者通过调用 `.resume()` 方法来实现。在消耗数据之前，`'end'` 事件不会触发。此外，在读取数据之前，它将消耗内存，最终可能导致“进程内存不足”错误。

为了向后兼容，`res` 只有在注册了 `'error'` 监听器时才会发出 `'error'`。

设置 `Content-Length` 标头以限制响应主体大小。如果 [`response.strictContentLength`](/zh/nodejs/api/http#responsestrictcontentlength) 设置为 `true`，则 `Content-Length` 标头值不匹配将导致抛出 `Error`，并通过 `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/zh/nodejs/api/errors#err_http_content_length_mismatch) 识别。

`Content-Length` 值应以字节为单位，而不是字符。使用 [`Buffer.byteLength()`](/zh/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) 确定主体长度（以字节为单位）。


### 事件: `'abort'` {#event-abort}

**新增于: v1.4.1**

**自以下版本弃用: v17.0.0, v16.12.0**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。请监听 `'close'` 事件。
:::

当客户端中止请求时触发。 此事件仅在第一次调用 `abort()` 时触发。

### 事件: `'close'` {#event-close}

**新增于: v0.5.4**

表明请求已完成，或者其底层连接过早终止（在响应完成之前）。

### 事件: `'connect'` {#event-connect}

**新增于: v0.7.0**

- `response` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

每次服务器使用 `CONNECT` 方法响应请求时触发。 如果未监听此事件，则接收 `CONNECT` 方法的客户端将关闭其连接。

此事件保证传递一个 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类，除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型。

一个客户端和服务器的例子，演示了如何监听 `'connect'` 事件：

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// 创建一个 HTTP 隧道代理
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 连接到源服务器
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 现在代理正在运行
proxy.listen(1337, '127.0.0.1', () => {

  // 向隧道代理发出请求
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // 通过 HTTP 隧道发出请求
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// 创建一个 HTTP 隧道代理
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 连接到源服务器
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 现在代理正在运行
proxy.listen(1337, '127.0.0.1', () => {

  // 向隧道代理发出请求
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // 通过 HTTP 隧道发出请求
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### 事件: `'continue'` {#event-continue}

**新增于: v0.3.2**

当服务器发送“100 Continue”HTTP 响应时触发，通常是因为请求包含“Expect: 100-continue”。这是一个客户端应该发送请求体的指令。

### 事件: `'finish'` {#event-finish}

**新增于: v0.3.6**

当请求已发送时触发。更具体地说，此事件在响应头和主体的最后一段已交给操作系统，以便通过网络传输时触发。这并不意味着服务器已经接收到任何东西。

### 事件: `'information'` {#event-information}

**新增于: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当服务器发送 1xx 中间响应（不包括 101 Upgrade）时触发。此事件的监听器将接收到一个对象，其中包含 HTTP 版本、状态码、状态消息、键值对 header 对象，以及一个包含原始 header 名称及其对应值的数组。

::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

101 Upgrade 状态不会触发此事件，因为它们与传统的 HTTP 请求/响应链断裂，例如 web sockets、就地 TLS 升级或 HTTP 2.0。要获得 101 Upgrade 通知，请监听 [`'upgrade'`](/zh/nodejs/api/http#event-upgrade) 事件。


### 事件: `'response'` {#event-response}

**加入版本: v0.1.0**

- `response` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)

当收到对此请求的响应时触发。此事件仅触发一次。

### 事件: `'socket'` {#event-socket}

**加入版本: v0.5.3**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

此事件保证传递一个 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类，除非用户指定了除 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型。

### 事件: `'timeout'` {#event-timeout}

**加入版本: v0.7.8**

当底层套接字因不活动而超时时发出。 这仅通知套接字已空闲。 必须手动销毁请求。

另见: [`request.setTimeout()`](/zh/nodejs/api/http#requestsettimeouttimeout-callback)。

### 事件: `'upgrade'` {#event-upgrade}

**加入版本: v0.1.94**

- `response` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

每次服务器响应升级请求时发出。 如果没有监听此事件且响应状态码为 101 Switching Protocols，则接收升级标头的客户端将关闭其连接。

此事件保证传递一个 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类，除非用户指定了除 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型。

一个客户端服务器对，演示如何监听 `'upgrade'` 事件。

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// 现在服务器正在运行
server.listen(1337, '127.0.0.1', () => {

  // 发送一个请求
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// 现在服务器正在运行
server.listen(1337, '127.0.0.1', () => {

  // 发送一个请求
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Added in: v0.3.8**

**Deprecated since: v14.1.0, v13.14.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 弃用: 请改用 [`request.destroy()`](/zh/nodejs/api/http#requestdestroyerror)。
:::

将请求标记为中止。调用此方法将导致响应中剩余的数据被丢弃，并且套接字将被销毁。

### `request.aborted` {#requestaborted}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0, v16.12.0 | Deprecated since: v17.0.0, v16.12.0 |
| v11.0.0 | The `aborted` property is no longer a timestamp number. |
| v11.0.0 | `aborted` 属性不再是时间戳数字。 |
| v0.11.14 | Added in: v0.11.14 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 弃用。请检查 [`request.destroyed`](/zh/nodejs/api/http#requestdestroyed) 代替。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果请求已被中止，则 `request.aborted` 属性将为 `true`。

### `request.connection` {#requestconnection}

**Added in: v0.3.0**

**Deprecated since: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 弃用。请使用 [`request.socket`](/zh/nodejs/api/http#requestsocket)。
:::

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

参见 [`request.socket`](/zh/nodejs/api/http#requestsocket)。

### `request.cork()` {#requestcork}

**Added in: v13.2.0, v12.16.0**

参见 [`writable.cork()`](/zh/nodejs/api/stream#writablecork)。

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | The `data` parameter can now be a `Uint8Array`. |
| v15.0.0 | `data` 参数现在可以是 `Uint8Array`。 |
| v10.0.0 | This method now returns a reference to `ClientRequest`. |
| v10.0.0 | 此方法现在返回对 `ClientRequest` 的引用。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

完成发送请求。如果主体的任何部分未发送，它会将它们刷新到流。如果请求是分块的，这将发送终止符 `'0\r\n\r\n'`。

如果指定了 `data`，它等效于调用 [`request.write(data, encoding)`](/zh/nodejs/api/http#requestwritechunk-encoding-callback) 之后调用 `request.end(callback)`。

如果指定了 `callback`，它将在请求流完成时被调用。


### `request.destroy([error])` {#requestdestroyerror}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.5.0 | 为了与其他 Readable 流保持一致，该函数返回 `this`。 |
| v0.3.0 | 添加于：v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 可选，一个随 `'error'` 事件发出的错误。
- 返回值: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

销毁请求。 可选地发出一个 `'error'` 事件，并发出一个 `'close'` 事件。 调用此方法将导致响应中的剩余数据被丢弃，并且套接字被销毁。

有关更多详细信息，请参阅 [`writable.destroy()`](/zh/nodejs/api/stream#writabledestroyerror)。

#### `request.destroyed` {#requestdestroyed}

**添加于: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [`request.destroy()`](/zh/nodejs/api/http#requestdestroyerror) 已被调用，则为 `true`。

有关更多详细信息，请参阅 [`writable.destroyed`](/zh/nodejs/api/stream#writabledestroyed)。

### `request.finished` {#requestfinished}

**添加于: v0.0.1**

**已弃用: v13.4.0, v12.16.0**

::: danger [Stable: 0 - 弃用]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 使用 [`request.writableEnded`](/zh/nodejs/api/http#requestwritableended)。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [`request.end()`](/zh/nodejs/api/http#requestenddata-encoding-callback) 已被调用，则 `request.finished` 属性将为 `true`。 如果请求是通过 [`http.get()`](/zh/nodejs/api/http#httpgetoptions-callback) 发起的，则会自动调用 `request.end()`。

### `request.flushHeaders()` {#requestflushheaders}

**添加于: v1.6.0**

刷新请求头。

出于效率原因，Node.js 通常会缓冲请求头，直到调用 `request.end()` 或写入第一个请求数据块。 然后，它会尝试将请求头和数据打包到单个 TCP 数据包中。

这通常是期望的（它可以节省 TCP 往返行程），但并非在可能很晚才发送第一个数据时。 `request.flushHeaders()` 绕过优化并启动请求。


### `request.getHeader(name)` {#requestgetheadername}

**Added in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

读取请求中的一个头部。名称不区分大小写。返回值的类型取决于提供给 [`request.setHeader()`](/zh/nodejs/api/http#requestsetheadername-value) 的参数。

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' 是 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' 是 number 类型
const cookie = request.getHeader('Cookie');
// 'cookie' 是 string[] 类型
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Added in: v7.7.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个数组，包含当前传出头部的唯一名称。所有头部名称都是小写的。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Added in: v7.7.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回当前传出头部的浅拷贝。 由于使用了浅拷贝，因此可以修改数组值，而无需额外调用各种与头部相关的 http 模块方法。 返回对象的键是头部名称，值是相应的头部值。 所有头部名称都是小写的。

`request.getHeaders()` 方法返回的对象*不是*从 JavaScript `Object` 原型继承的。 这意味着典型的 `Object` 方法（例如 `obj.toString()`、`obj.hasOwnProperty()` 等）未定义且*不起作用*。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**加入于: v15.13.0, v14.17.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个数组，其中包含当前传出的原始标头的唯一名称。标头名称以其精确的大小写设置返回。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**加入于: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果传出标头中当前设置了由 `name` 标识的标头，则返回 `true`。 标头名称匹配不区分大小写。

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `2000`

限制最大响应标头计数。 如果设置为 0，则不应用任何限制。

### `request.path` {#requestpath}

**加入于: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求路径。

### `request.method` {#requestmethod}

**加入于: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求方法。

### `request.host` {#requesthost}

**加入于: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求主机。

### `request.protocol` {#requestprotocol}

**加入于: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求协议。

### `request.removeHeader(name)` {#requestremoveheadername}

**加入于: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

删除已在标头对象中定义的标头。

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**新增于: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 请求是否通过重用套接字发送。

当通过启用 keep-alive 的代理发送请求时，底层的套接字可能会被重用。但是，如果服务器在不适当的时候关闭连接，客户端可能会遇到 'ECONNRESET' 错误。

::: code-group
```js [ESM]
import http from 'node:http';

// 默认情况下，服务器具有 5 秒的 keep-alive 超时
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // 适配一个 keep-alive 代理
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 什么也不做
    });
  });
}, 5000); // 以 5 秒的间隔发送请求，因此很容易达到空闲超时
```

```js [CJS]
const http = require('node:http');

// 默认情况下，服务器具有 5 秒的 keep-alive 超时
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // 适配一个 keep-alive 代理
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 什么也不做
    });
  });
}, 5000); // 以 5 秒的间隔发送请求，因此很容易达到空闲超时
```
:::

通过标记请求是否重用了套接字，我们可以基于它进行自动错误重试。

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 检查是否需要重试
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 检查是否需要重试
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**添加于: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

为 headers 对象设置单个 header 值。 如果此 header 已经存在于待发送的 headers 中，则其值将被替换。 在此处使用字符串数组可以发送具有相同名称的多个 headers。 非字符串值将不经修改地存储。 因此，[`request.getHeader()`](/zh/nodejs/api/http#requestgetheadername) 可能会返回非字符串值。 但是，非字符串值将在网络传输时转换为字符串。

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
或者

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
当 value 是字符串时，如果它包含 `latin1` 编码之外的字符，则会抛出异常。

如果需要在 value 中传递 UTF-8 字符，请使用 [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt) 标准对 value 进行编码。

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**添加于: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一旦将 socket 分配给此请求并建立连接，将调用 [`socket.setNoDelay()`](/zh/nodejs/api/net#socketsetnodelaynodelay)。

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**添加于: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

一旦将 socket 分配给此请求并建立连接，将调用 [`socket.setKeepAlive()`](/zh/nodejs/api/net#socketsetkeepaliveenable-initialdelay)。


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 仅在套接字连接时才一致地设置套接字超时。 |
| v0.5.9 | 添加于: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 请求超时的毫秒数。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 超时发生时要调用的可选函数。 与绑定到 `'timeout'` 事件相同。
- 返回: [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

一旦将套接字分配给此请求并连接后，将调用 [`socket.setTimeout()`](/zh/nodejs/api/net#socketsettimeouttimeout-callback)。

### `request.socket` {#requestsocket}

**添加于: v0.3.0**

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

对底层套接字的引用。 通常，用户不会希望访问此属性。 特别是，由于协议解析器附加到套接字的方式，套接字不会发出 `'readable'` 事件。

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型，否则此属性保证是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，[\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类。


### `request.uncork()` {#requestuncork}

**Added in: v13.2.0, v12.16.0**

参见 [`writable.uncork()`](/zh/nodejs/api/stream#writableuncork)。

### `request.writableEnded` {#requestwritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [`request.end()`](/zh/nodejs/api/http#requestenddata-encoding-callback) 已经被调用，则为 `true`。此属性不指示数据是否已刷新，要判断数据是否已刷新请使用 [`request.writableFinished`](/zh/nodejs/api/http#requestwritablefinished) 代替。

### `request.writableFinished` {#requestwritablefinished}

**Added in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果所有数据都已刷新到底层系统，则为 `true`，紧接在发出 [`'finish'`](/zh/nodejs/api/http#event-finish) 事件之前。

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v15.0.0 | `chunk` 参数现在可以是 `Uint8Array`。 |
| v0.1.29 | 添加于: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

发送正文的一个数据块。 此方法可以多次调用。 如果未设置 `Content-Length`，则数据将自动以 HTTP 分块传输编码进行编码，以便服务器知道数据何时结束。 将添加 `Transfer-Encoding: chunked` 标头。 需要调用 [`request.end()`](/zh/nodejs/api/http#requestenddata-encoding-callback) 来完成请求的发送。

`encoding` 参数是可选的，仅在 `chunk` 是字符串时适用。 默认为 `'utf8'`。

`callback` 参数是可选的，并且仅当数据块为非空时，才会在刷新此数据块时调用该参数。

如果整个数据成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，将发出 `'drain'`。

当使用空字符串或缓冲区调用 `write` 函数时，它不执行任何操作并等待更多输入。


## 类：`http.Server` {#class-httpserver}

**添加于：v0.1.17**

- 继承自：[\<net.Server\>](/zh/nodejs/api/net#class-netserver)

### 事件：`'checkContinue'` {#event-checkcontinue}

**添加于：v0.3.0**

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

每次收到带有 HTTP `Expect: 100-continue` 的请求时触发。 如果未监听此事件，服务器将自动响应 `100 Continue` (如果适用)。

处理此事件包括调用 [`response.writeContinue()`](/zh/nodejs/api/http#responsewritecontinue)，如果客户端应继续发送请求体，或者生成适当的 HTTP 响应（例如 400 Bad Request），如果客户端不应继续发送请求体。

当此事件被触发和处理时，`'request'` 事件（[/api/http#event-request]）将不会被触发。

### 事件：`'checkExpectation'` {#event-checkexpectation}

**添加于：v5.5.0**

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

每次收到带有 HTTP `Expect` 头的请求时触发，其中该值不是 `100-continue`。 如果未监听此事件，服务器将自动响应 `417 Expectation Failed` (如果适用)。

当此事件被触发和处理时，`'request'` 事件（[/api/http#event-request]）将不会被触发。

### 事件：`'clientError'` {#event-clienterror}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 如果发生 HPE_HEADER_OVERFLOW 错误，默认行为将返回 431 Request Header Fields Too Large。 |
| v9.4.0 | `rawPacket` 是刚解析的当前缓冲区。 将此缓冲区添加到 `'clientError'` 事件的错误对象中，使开发人员可以记录损坏的数据包。 |
| v6.0.0 | 如果附加了 `'clientError'` 的监听器，则不再执行在 `socket` 上调用 `.destroy()` 的默认操作。 |
| v0.1.94 | 添加于：v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

如果客户端连接发出 `'error'` 事件，它将转发到此处。 此事件的监听器负责关闭/销毁底层套接字。 例如，人们可能希望使用自定义 HTTP 响应更优雅地关闭套接字，而不是突然断开连接。 套接字**必须在监听器结束之前关闭或销毁**。

保证此事件传递一个 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类，除非用户指定了除 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型。

默认行为是尝试使用 HTTP '400 Bad Request' 关闭套接字，或者在出现 [`HPE_HEADER_OVERFLOW`](/zh/nodejs/api/errors#hpe_header_overflow) 错误的情况下，使用 HTTP '431 Request Header Fields Too Large' 关闭套接字。 如果套接字不可写或当前附加的 [`http.ServerResponse`](/zh/nodejs/api/http#class-httpserverresponse) 的标头已发送，则立即销毁它。

`socket` 是发生错误的 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 对象。

::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

当 `'clientError'` 事件发生时，没有 `request` 或 `response` 对象，因此发送的任何 HTTP 响应，包括响应头和有效负载，*必须*直接写入 `socket` 对象。 必须小心确保响应是格式正确的 HTTP 响应消息。

`err` 是 `Error` 的一个实例，带有两个额外的列：

- `bytesParsed`：Node.js 可能已正确解析的请求数据包的字节数计数；
- `rawPacket`：当前请求的原始数据包。

在某些情况下，客户端已经收到响应，并且/或者套接字已经被销毁，例如在 `ECONNRESET` 错误的情况下。 在尝试向套接字发送数据之前，最好检查它是否仍然可写。

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Event: `'close'` {#event-close_1}

**添加于: v0.1.4**

服务器关闭时触发。

### Event: `'connect'` {#event-connect_1}

**添加于: v0.7.0**

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage) HTTP 请求的参数，与 [`'request'`](/zh/nodejs/api/http#event-request) 事件中的参数相同。
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 服务器和客户端之间的网络套接字
- `head` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 隧道流的第一个数据包（可能为空）

每次客户端请求 HTTP `CONNECT` 方法时都会触发。 如果没有监听此事件，则请求 `CONNECT` 方法的客户端的连接将被关闭。

保证此事件传递的是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的一个实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的一个子类，除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 以外的套接字类型。

在此事件发出后，请求的套接字将没有 `'data'` 事件监听器，这意味着需要绑定它才能处理发送到该套接字上服务器的数据。

### Event: `'connection'` {#event-connection}

**添加于: v0.1.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

当建立新的 TCP 流时，将触发此事件。 `socket` 通常是 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 类型的对象。 通常，用户不希望访问此事件。 特别是，由于协议解析器如何附加到套接字，因此套接字不会发出 `'readable'` 事件。 也可以在 `request.socket` 访问该 `socket`。

用户也可以显式地触发此事件，以将连接注入到 HTTP 服务器中。 在这种情况下，可以传递任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。

如果在此处调用 `socket.setTimeout()`，则当套接字处理完一个请求时，超时将被 `server.keepAliveTimeout` 替换（如果 `server.keepAliveTimeout` 非零）。

保证此事件传递的是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的一个实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的一个子类，除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 以外的套接字类型。


### 事件: `'dropRequest'` {#event-droprequest}

**加入于: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage) HTTP 请求的参数，与 [`'request'`](/zh/nodejs/api/http#event-request) 事件中的参数相同
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 服务器和客户端之间的网络套接字

当套接字上的请求数达到 `server.maxRequestsPerSocket` 的阈值时，服务器将丢弃新请求并发出 `'dropRequest'` 事件，然后向客户端发送 `503`。

### 事件: `'request'` {#event-request}

**加入于: v0.1.0**

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

每次收到请求时都会触发。 每个连接可能有多个请求（在 HTTP Keep-Alive 连接的情况下）。

### 事件: `'upgrade'` {#event-upgrade_1}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 如果客户端发送 Upgrade 标头，则不再监听此事件将不会导致套接字被销毁。 |
| v0.1.94 | 加入于: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage) HTTP 请求的参数，与 [`'request'`](/zh/nodejs/api/http#event-request) 事件中的参数相同
- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 服务器和客户端之间的网络套接字
- `head` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 升级流的第一个数据包（可能为空）

每次客户端请求 HTTP 升级时都会触发。 监听此事件是可选的，客户端不能坚持协议更改。

在此事件发出后，请求的套接字将没有 `'data'` 事件侦听器，这意味着需要绑定它才能处理通过该套接字发送到服务器的数据。

保证此事件传递一个 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类，除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型。


### `server.close([callback])` {#serverclosecallback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法在返回前关闭空闲连接。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

停止服务器接受新的连接，并关闭所有连接到此服务器的连接，这些连接未发送请求或等待响应。 参见 [`net.Server.close()`](/zh/nodejs/api/net#serverclosecallback)。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒后关闭服务器
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**添加于: v18.2.0**

关闭所有已建立的连接到此服务器的 HTTP(S) 连接，包括发送请求或等待响应的活动连接。 这 *不* 会销毁升级到不同协议的套接字，例如 WebSocket 或 HTTP/2。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒后关闭服务器
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // 关闭所有连接，确保服务器成功关闭
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**添加于: v18.2.0**

关闭所有连接到此服务器的连接，这些连接未发送请求或等待响应。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒后关闭服务器
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // 关闭空闲连接，例如 keep-alive 连接。 一旦剩余的活动连接终止，服务器将关闭
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.4.0, v18.14.0 | 默认值现在设置为 60000（60 秒）或 `requestTimeout` 中的最小值。 |
| v11.3.0, v10.14.0 | 添加于: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** [`server.requestTimeout`](/zh/nodejs/api/http#serverrequesttimeout) 或 `60000` 中的最小值。

限制解析器等待接收完整 HTTP 标头的时间量。

如果超时到期，服务器将响应状态 408，而不会将请求转发到请求侦听器，然后关闭连接。

必须将其设置为非零值（例如 120 秒），以防止在服务器部署时前面没有反向代理的情况下，可能发生的拒绝服务攻击。

### `server.listen()` {#serverlisten}

启动 HTTP 服务器以侦听连接。 此方法与 [`net.Server`](/zh/nodejs/api/net#class-netserver) 中的 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 相同。

### `server.listening` {#serverlistening}

**添加于: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指示服务器是否正在侦听连接。

### `server.maxHeadersCount` {#servermaxheaderscount}

**添加于: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `2000`

限制最大传入标头计数。 如果设置为 0，则不应用任何限制。

### `server.requestTimeout` {#serverrequesttimeout}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 默认请求超时从无超时更改为 300 秒（5 分钟）。 |
| v14.11.0 | 添加于: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `300000`

设置从客户端接收整个请求的超时值（以毫秒为单位）。

如果超时到期，服务器将响应状态 408，而不会将请求转发到请求侦听器，然后关闭连接。

必须将其设置为非零值（例如 120 秒），以防止在服务器部署时前面没有反向代理的情况下，可能发生的拒绝服务攻击。


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 默认超时时间从 120 秒更改为 0 (无超时)。 |
| v0.9.12 | 加入于: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** 0 (无超时)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.Server\>](/zh/nodejs/api/http#class-httpserver)

设置套接字的超时值，并在 Server 对象上触发 `'timeout'` 事件，如果发生超时，则将套接字作为参数传递。

如果 Server 对象上有 `'timeout'` 事件侦听器，则将使用超时的套接字作为参数调用它。

默认情况下，Server 不会使套接字超时。 但是，如果将回调分配给 Server 的 `'timeout'` 事件，则必须显式处理超时。

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**加入于: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 每个套接字的请求数。 **默认值:** 0 (无限制)

套接字在关闭 keep alive 连接之前可以处理的最大请求数。

值为 `0` 将禁用限制。

达到限制时，它会将 `Connection` 标头值设置为 `close`，但实际上不会关闭连接，达到限制后发送的后续请求将获得 `503 Service Unavailable` 作为响应。

### `server.timeout` {#servertimeout}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 默认超时时间从 120 秒更改为 0 (无超时)。 |
| v0.9.12 | 加入于: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 超时时间，以毫秒为单位。 **默认值:** 0 (无超时)

在假定套接字已超时之前的不活动毫秒数。

值为 `0` 将禁用传入连接的超时行为。

套接字超时逻辑是在连接时设置的，因此更改此值只会影响到服务器的新连接，而不会影响任何现有连接。


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**新增于: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 超时时间，单位为毫秒。 **默认值:** `5000` (5 秒)。

服务器在完成写入最后一个响应后，需要等待额外传入数据的非活动毫秒数，超过此时间后，套接字将被销毁。 如果服务器在 keep-alive 超时触发之前收到新数据，它将重置常规的非活动超时，即 [`server.timeout`](/zh/nodejs/api/http#servertimeout)。

值为 `0` 将禁用传入连接上的 keep-alive 超时行为。 值为 `0` 使 http 服务器的行为类似于 Node.js 8.0.0 之前的版本，这些版本没有 keep-alive 超时。

套接字超时逻辑是在连接时设置的，因此更改此值只会影响到服务器的新连接，而不会影响任何现有连接。

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**新增于: v20.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

调用 [`server.close()`](/zh/nodejs/api/http#serverclosecallback) 并返回一个在服务器关闭时完成的 promise。

## 类: `http.ServerResponse` {#class-httpserverresponse}

**新增于: v0.1.17**

- 继承自: [\<http.OutgoingMessage\>](/zh/nodejs/api/http#class-httpoutgoingmessage)

此对象由 HTTP 服务器在内部创建，而不是由用户创建。 它作为第二个参数传递给 [`'request'`](/zh/nodejs/api/http#event-request) 事件。

### 事件: `'close'` {#event-close_2}

**新增于: v0.6.7**

表明响应已完成，或其底层连接已提前终止（在响应完成之前）。

### 事件: `'finish'` {#event-finish_1}

**新增于: v0.3.6**

当响应已发送时触发。 更具体地说，当响应头和主体的最后一段已交给操作系统以便通过网络传输时，会触发此事件。 这并不意味着客户端已经收到了任何东西。


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**新增于: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此方法向响应添加 HTTP 尾部标头（位于消息末尾的标头）。

仅当响应使用分块编码时才会发出尾部；如果不是（例如，如果请求是 HTTP/1.0），则它们将被静默丢弃。

HTTP 要求发送 `Trailer` 标头才能发出尾部，并在其值中包含标头字段列表。例如：

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

### `response.connection` {#responseconnection}

**新增于: v0.3.0**

**自 v13.0.0 起已弃用**

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。使用 [`response.socket`](/zh/nodejs/api/http#responsesocket)。
:::

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

参见 [`response.socket`](/zh/nodejs/api/http#responsesocket)。

### `response.cork()` {#responsecork}

**新增于: v13.2.0, v12.16.0**

参见 [`writable.cork()`](/zh/nodejs/api/stream#writablecork)。

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `data` 参数现在可以是 `Uint8Array`。 |
| v10.0.0 | 此方法现在返回对 `ServerResponse` 的引用。 |
| v0.1.90 | 新增于: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

此方法向服务器发出信号，表明所有响应标头和正文都已发送；服务器应认为此消息已完成。 必须在每个响应上调用方法 `response.end()`。

如果指定了 `data`，则其效果类似于调用 [`response.write(data, encoding)`](/zh/nodejs/api/http#responsewritechunk-encoding-callback)，然后调用 `response.end(callback)`。

如果指定了 `callback`，则当响应流完成时将调用它。


### `response.finished` {#responsefinished}

**添加于: v0.0.2**

**自 v13.4.0, v12.16.0 起已弃用**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 使用 [`response.writableEnded`](/zh/nodejs/api/http#responsewritableended)。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 [`response.end()`](/zh/nodejs/api/http#responseenddata-encoding-callback) 已被调用，`response.finished` 属性将为 `true`。

### `response.flushHeaders()` {#responseflushheaders}

**添加于: v1.6.0**

刷新响应头。 另请参阅: [`request.flushHeaders()`](/zh/nodejs/api/http#requestflushheaders)。

### `response.getHeader(name)` {#responsegetheadername}

**添加于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

读取一个已经排队但尚未发送给客户端的标头。 名称不区分大小写。 返回值的类型取决于提供给 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value) 的参数。

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**添加于: v7.7.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个数组，其中包含当前传出标头的唯一名称。 所有标头名称均为小写。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**新增于: v7.7.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回当前传出标头的浅拷贝。由于使用了浅拷贝，数组值可能会被修改，而无需额外调用各种与标头相关的 http 模块方法。返回对象的键是标头名称，值是相应的标头值。所有标头名称都是小写的。

`response.getHeaders()` 方法返回的对象 *不* 以原型方式继承自 JavaScript `Object`。 这意味着典型的 `Object` 方法，例如 `obj.toString()`、`obj.hasOwnProperty()` 等未定义且 *不起作用*。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**新增于: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果传出标头中当前设置了由 `name` 标识的标头，则返回 `true`。 标头名称匹配不区分大小写。

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**新增于: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

布尔值（只读）。 如果已发送标头，则为 true，否则为 false。

### `response.removeHeader(name)` {#responseremoveheadername}

**新增于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

删除排队等待隐式发送的标头。

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**新增于: v15.7.0**

- [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)

对原始 HTTP `request` 对象的引用。


### `response.sendDate` {#responsesenddate}

**新增于: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果日期标头尚未出现在标头中，则当为 true 时，将在响应中自动生成并发送日期标头。默认为 true。

仅应在测试时禁用此项；HTTP 要求响应中包含 Date 标头。

### `response.setHeader(name, value)` {#responsesetheadername-value}

**新增于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

返回响应对象。

为隐式标头设置单个标头值。 如果要发送的标头中已存在此标头，则其值将被替换。 在此处使用字符串数组以发送具有相同名称的多个标头。 非字符串值将未经修改地存储。 因此，[`response.getHeader()`](/zh/nodejs/api/http#responsegetheadername) 可能会返回非字符串值。 但是，非字符串值将转换为字符串以进行网络传输。 将相同的响应对象返回给调用者，以启用调用链。

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
或

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

当使用 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value) 设置标头时，它们将与传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的任何标头合并，传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的标头优先。

```js [ESM]
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
如果调用了 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 方法并且尚未调用此方法，它将直接将提供的标头值写入网络通道，而不在内部进行缓存，并且标头上的 [`response.getHeader()`](/zh/nodejs/api/http#responsegetheadername) 将不会产生预期的结果。 如果需要逐步填充标头，并可能在将来进行检索和修改，请使用 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value) 而不是 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)。


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**加入于: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

设置 Socket 的超时值为 `msecs`。 如果提供了回调函数，则会将其作为侦听器添加到响应对象上的 `'timeout'` 事件。

如果没有将 `'timeout'` 侦听器添加到请求、响应或服务器，则套接字会在超时时被销毁。 如果将处理程序分配给请求、响应或服务器的 `'timeout'` 事件，则必须显式处理超时的套接字。

### `response.socket` {#responsesocket}

**加入于: v0.3.0**

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

引用底层套接字。 通常用户不希望访问此属性。 特别是，由于协议解析器附加到套接字的方式，套接字不会发出 `'readable'` 事件。 `response.end()` 之后，该属性将为空。

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

除非用户指定了 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型，否则此属性保证是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类。

### `response.statusCode` {#responsestatuscode}

**加入于: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `200`

当使用隐式标头（不显式调用 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)）时，此属性控制在刷新标头时将发送到客户端的状态码。

```js [ESM]
response.statusCode = 404;
```
在将响应标头发送到客户端之后，此属性指示已发送出的状态码。


### `response.statusMessage` {#responsestatusmessage}

**加入版本: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当使用隐式标头（未显式调用 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)）时，此属性控制在刷新标头时将发送给客户端的状态消息。如果将其保留为 `undefined`，则将使用状态代码的标准消息。

```js [ESM]
response.statusMessage = 'Not found';
```
在将响应标头发送到客户端后，此属性指示已发送出的状态消息。

### `response.strictContentLength` {#responsestrictcontentlength}

**加入版本: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `false`

如果设置为 `true`，Node.js 将检查 `Content-Length` 标头值和正文的大小（以字节为单位）是否相等。如果 `Content-Length` 标头值不匹配，则会抛出 `Error`，其 `code:` 为 [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/zh/nodejs/api/errors#err_http_content_length_mismatch)。

### `response.uncork()` {#responseuncork}

**加入版本: v13.2.0, v12.16.0**

参见 [`writable.uncork()`](/zh/nodejs/api/stream#writableuncork)。

### `response.writableEnded` {#responsewritableended}

**加入版本: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在调用 [`response.end()`](/zh/nodejs/api/http#responseenddata-encoding-callback) 后为 `true`。此属性不指示数据是否已刷新，为此请改用 [`response.writableFinished`](/zh/nodejs/api/http#responsewritablefinished)。

### `response.writableFinished` {#responsewritablefinished}

**加入版本: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果所有数据都已刷新到底层系统，则为 `true`，紧接在发出 [`'finish'`](/zh/nodejs/api/http#event-finish) 事件之前。

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

::: info [历史记录]
| 版本    | 变更                                   |
| :------ | :------------------------------------- |
| v15.0.0 | `chunk` 参数现在可以是 `Uint8Array`。 |
| v0.1.29 | 加入版本: v0.1.29                      |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果调用此方法且尚未调用 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)，它将切换到隐式标头模式并刷新隐式标头。

这会发送响应正文的块。可以多次调用此方法以提供正文的后续部分。

如果在 `createServer` 中将 `rejectNonStandardBodyWrites` 设置为 true，则当请求方法或响应状态不支持内容时，不允许写入正文。如果尝试为 HEAD 请求或作为 `204` 或 `304` 响应的一部分写入正文，则会同步抛出一个代码为 `ERR_HTTP_BODY_NOT_ALLOWED` 的 `Error`。

`chunk` 可以是字符串或缓冲区。 如果 `chunk` 是字符串，则第二个参数指定如何将其编码为字节流。 `callback` 将在此数据块刷新时被调用。

这是原始的 HTTP 正文，与可能使用的高级多部分正文编码无关。

第一次调用 [`response.write()`](/zh/nodejs/api/http#responsewritechunk-encoding-callback) 时，它会将缓冲的标头信息和正文的第一个块发送到客户端。 第二次调用 [`response.write()`](/zh/nodejs/api/http#responsewritechunk-encoding-callback) 时，Node.js 假定数据将被流式传输，并单独发送新数据。 也就是说，响应会被缓冲到正文的第一个块。

如果所有数据都已成功刷新到内核缓冲区，则返回 `true`。 如果所有或部分数据都在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，将发出 `'drain'`。


### `response.writeContinue()` {#responsewritecontinue}

**Added in: v0.3.0**

向客户端发送一个 HTTP/1.1 100 Continue 消息，表明请求体应该被发送。参见 `Server` 上的 [`'checkContinue'`](/zh/nodejs/api/http#event-checkcontinue) 事件。

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.11.0 | 允许将提示作为对象传递。 |
| v18.11.0 | 添加于：v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

向客户端发送带有 Link 标头的 HTTP/1.1 103 Early Hints 消息，表明用户代理可以预加载/预连接链接的资源。 `hints` 是一个包含要随早期提示消息发送的标头值的对象。 当响应消息已写入时，将调用可选的 `callback` 参数。

**示例**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.14.0 | 允许将标头作为数组传递。 |
| v11.10.0, v10.17.0 | 从 `writeHead()` 返回 `this`，以允许与 `end()` 链接。 |
| v5.11.0, v4.4.5 | 如果 `statusCode` 不是 `[100, 999]` 范围内的数字，则会抛出 `RangeError`。 |
| v0.1.30 | 添加于：v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 返回: [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

向请求发送响应标头。 状态码是一个 3 位数的 HTTP 状态码，例如 `404`。 最后一个参数 `headers` 是响应头。 可选地，可以将人类可读的 `statusMessage` 作为第二个参数给出。

`headers` 可以是一个 `Array`，其中键和值在同一个列表中。 它 *不是* 元组的列表。 因此，偶数偏移量是键值，奇数偏移量是关联值。 数组的格式与 `request.rawHeaders` 相同。

返回对 `ServerResponse` 的引用，以便可以链接调用。

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
此方法只能在消息上调用一次，并且必须在调用 [`response.end()`](/zh/nodejs/api/http#responseenddata-encoding-callback) 之前调用。

如果在调用此方法之前调用了 [`response.write()`](/zh/nodejs/api/http#responsewritechunk-encoding-callback) 或 [`response.end()`](/zh/nodejs/api/http#responseenddata-encoding-callback)，则将计算隐式/可变标头并调用此函数。

当使用 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value) 设置标头时，它们将与传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的任何标头合并，并且传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的标头具有优先权。

如果调用此方法并且尚未调用 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value)，它将直接将提供的标头值写入网络通道，而无需在内部缓存，并且标头上的 [`response.getHeader()`](/zh/nodejs/api/http#responsegetheadername) 将不会产生预期的结果。 如果需要逐步填充标头，并可能在将来检索和修改，请改用 [`response.setHeader()`](/zh/nodejs/api/http#responsesetheadername-value)。

```js [ESM]
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` 以字节而不是字符读取。 使用 [`Buffer.byteLength()`](/zh/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) 确定正文的字节长度。 Node.js 将检查 `Content-Length` 与已传输的正文的长度是否相等。

尝试设置包含无效字符的标头字段名称或值将导致抛出 [`Error`][]。


### `response.writeProcessing()` {#responsewriteprocessing}

**Added in: v10.0.0**

向客户端发送 HTTP/1.1 102 Processing 消息，指示应该发送请求体。

## 类: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.5.0 | 在传入数据被消耗后，`destroyed` 值返回 `true`。 |
| v13.1.0, v12.16.0 | `readableHighWaterMark` 值反映了套接字的值。 |
| v0.1.17 | 添加于: v0.1.17 |
:::

- 继承自: [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

`IncomingMessage` 对象由 [`http.Server`](/zh/nodejs/api/http#class-httpserver) 或 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest) 创建，并分别作为第一个参数传递给 [`'request'`](/zh/nodejs/api/http#event-request) 和 [`'response'`](/zh/nodejs/api/http#event-response) 事件。它可用于访问响应状态、标头和数据。

与它的 `socket` 值（[\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类）不同，`IncomingMessage` 本身继承自 [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)，并被单独创建以解析和发出传入的 HTTP 标头和有效负载，因为在保持活动的情况下，底层套接字可能会被多次重用。

### 事件: `'aborted'` {#event-aborted}

**Added in: v0.3.8**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [Stable: 0 - 废弃]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 废弃。 监听 `'close'` 事件代替。
:::

当请求被中止时发出。

### 事件: `'close'` {#event-close_3}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 当请求已完成时（而不是在底层套接字关闭时），现在会发出 close 事件。 |
| v0.4.2 | 添加于: v0.4.2 |
:::

当请求已完成时发出。

### `message.aborted` {#messageaborted}

**Added in: v10.1.0**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [Stable: 0 - 废弃]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 废弃。 从 [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) 检查 `message.destroyed`。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果请求已被中止，则 `message.aborted` 属性将为 `true`。


### `message.complete` {#messagecomplete}

**Added in: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果已接收到完整的 HTTP 消息并已成功解析，则 `message.complete` 属性将为 `true`。

此属性特别有用，可以用来确定客户端或服务器在连接终止之前是否完全传输了消息：

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        '连接在消息仍在发送时终止');
  });
});
```
### `message.connection` {#messageconnection}

**Added in: v0.1.90**

**Deprecated since: v16.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 请使用 [`message.socket`](/zh/nodejs/api/http#messagesocket)。
:::

[`message.socket`](/zh/nodejs/api/http#messagesocket) 的别名。

### `message.destroy([error])` {#messagedestroyerror}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.5.0, v12.19.0 | 此函数返回 `this`，与其他可读流保持一致。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

在接收到 `IncomingMessage` 的套接字上调用 `destroy()`。 如果提供了 `error`，则会在套接字上发出 `'error'` 事件，并将 `error` 作为参数传递给该事件上的任何侦听器。

### `message.headers` {#messageheaders}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.5.0, v18.14.0 | `http.request()` 和 `http.createServer()` 函数中的 `joinDuplicateHeaders` 选项确保不会丢弃重复的标头，而是根据 RFC 9110 第 5.3 节的规定，使用逗号分隔符组合在一起。 |
| v15.1.0 | 现在使用原型上的访问器属性延迟计算 `message.headers`，并且不再可枚举。 |
| v0.1.5 | Added in: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

请求/响应标头对象。

标头名称和值的键值对。 标头名称为小写。

```js [ESM]
// 打印类似于：
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
根据标头名称，以下列方式处理原始标头中的重复项：

- 丢弃 `age`、`authorization`、`content-length`、`content-type`、`etag`、`expires`、`from`、`host`、`if-modified-since`、`if-unmodified-since`、`last-modified`、`location`、`max-forwards`、`proxy-authorization`、`referer`、`retry-after`、`server` 或 `user-agent` 的重复项。 要允许联接上面列出的标头的重复值，请在 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 和 [`http.createServer()`](/zh/nodejs/api/http#httpcreateserveroptions-requestlistener) 中使用选项 `joinDuplicateHeaders`。 有关更多信息，请参见 RFC 9110 第 5.3 节。
- `set-cookie` 始终是一个数组。 将重复项添加到数组中。
- 对于重复的 `cookie` 标头，这些值使用 `; ` 连接在一起。
- 对于所有其他标头，这些值使用 `, ` 连接在一起。


### `message.headersDistinct` {#messageheadersdistinct}

**新增于: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

类似于 [`message.headers`](/zh/nodejs/api/http#messageheaders)，但没有连接逻辑，并且这些值始终是字符串数组，即使对于只接收一次的标头也是如此。

```js [ESM]
// 打印如下内容：
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**新增于: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果是服务器请求，则为客户端发送的 HTTP 版本。 如果是客户端响应，则为连接到的服务器的 HTTP 版本。 可能是 `'1.1'` 或 `'1.0'`。

此外，`message.httpVersionMajor` 是第一个整数，`message.httpVersionMinor` 是第二个整数。

### `message.method` {#messagemethod}

**新增于: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**仅对从 <a href="#class-httpserver"><code>http.Server</code></a> 获取的请求有效。**

请求方法作为字符串。 只读。 示例：`'GET'`，`'DELETE'`。

### `message.rawHeaders` {#messagerawheaders}

**新增于: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

原始的请求/响应标头列表，与接收到的完全一样。

键和值在同一个列表中。 它*不是*元组列表。 因此，偶数偏移量是键值，奇数偏移量是关联的值。

标头名称未小写，并且重复项未合并。

```js [ESM]
// 打印如下内容：
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```
### `message.rawTrailers` {#messagerawtrailers}

**新增于: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

原始的请求/响应尾部键和值，与接收到的完全一样。 仅在 `'end'` 事件中填充。


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**加入于: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)

调用 `message.socket.setTimeout(msecs, callback)`。

### `message.socket` {#messagesocket}

**加入于: v0.3.0**

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

与连接关联的 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 对象。

通过 HTTPS 支持，使用 [`request.socket.getPeerCertificate()`](/zh/nodejs/api/tls#tlssocketgetpeercertificatedetailed) 获取客户端的身份验证详情。

除非用户指定了除 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 之外的套接字类型或内部置空，否则此属性保证是 [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 类的实例，它是 [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 的子类。

### `message.statusCode` {#messagestatuscode}

**加入于: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**仅对从 <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> 获取的响应有效。**

3 位 HTTP 响应状态码。 例如 `404`。

### `message.statusMessage` {#messagestatusmessage}

**加入于: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**仅对从 <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> 获取的响应有效。**

HTTP 响应状态消息（原因短语）。 例如 `OK` 或 `Internal Server Error`。

### `message.trailers` {#messagetrailers}

**加入于: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

请求/响应 trailers 对象。 仅在 `'end'` 事件时填充。

### `message.trailersDistinct` {#messagetrailersdistinct}

**加入于: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

类似于 [`message.trailers`](/zh/nodejs/api/http#messagetrailers)，但没有连接逻辑，并且这些值始终是字符串数组，即使对于只收到一次的标头也是如此。 仅在 `'end'` 事件时填充。


### `message.url` {#messageurl}

**添加于: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**仅对从 <a href="#class-httpserver"><code>http.Server</code></a> 获取的请求有效。**

请求 URL 字符串。 这仅包含实际 HTTP 请求中存在的 URL。 以下面的请求为例：

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
要将 URL 解析为其各个部分：

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
当 `request.url` 为 `'/status?name=ryan'` 且 `process.env.HOST` 未定义时：

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
确保将 `process.env.HOST` 设置为服务器的主机名，或者考虑完全替换此部分。 如果使用 `req.headers.host`，请确保使用正确的验证，因为客户端可能会指定自定义 `Host` 标头。

## 类: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**添加于: v0.1.17**

- 继承自: [\<Stream\>](/zh/nodejs/api/stream#stream)

此类是 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest) 和 [`http.ServerResponse`](/zh/nodejs/api/http#class-httpserverresponse) 的父类。 从 HTTP 事务参与者的角度来看，它是一个抽象的传出消息。

### 事件: `'drain'` {#event-drain}

**添加于: v0.3.6**

当消息的缓冲区再次空闲时触发。

### 事件: `'finish'` {#event-finish_2}

**添加于: v0.1.17**

当传输成功完成时触发。

### 事件: `'prefinish'` {#event-prefinish}

**添加于: v0.11.6**

在调用 `outgoingMessage.end()` 之后触发。 触发此事件时，所有数据都已处理，但不一定完全刷新。


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**添加于: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

将 HTTP 尾部（消息末尾的头部）添加到消息中。

只有当消息是分块编码时，才会发出尾部。 否则，尾部将被静默丢弃。

HTTP 要求发送 `Trailer` 头部才能发出尾部，其值包含头部字段名称的列表，例如：

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
尝试设置包含无效字符的头部字段名称或值将导致抛出 `TypeError`。

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**添加于: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 头部名称
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 头部值
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

将单个头部值附加到头部对象。

如果该值是一个数组，则相当于多次调用此方法。

如果该头部之前没有值，则相当于调用 [`outgoingMessage.setHeader(name, value)`](/zh/nodejs/api/http#outgoingmessagesetheadername-value)。

根据创建客户端请求或服务器时 `options.uniqueHeaders` 的值，这将导致头部被多次发送，或者使用 `; ` 连接的值单次发送。

### `outgoingMessage.connection` {#outgoingmessageconnection}

**添加于: v0.3.0**

**已弃用: v15.12.0, v14.17.1**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`outgoingMessage.socket`](/zh/nodejs/api/http#outgoingmessagesocket)。
:::

[`outgoingMessage.socket`](/zh/nodejs/api/http#outgoingmessagesocket) 的别名。


### `outgoingMessage.cork()` {#outgoingmessagecork}

**新增于: v13.2.0, v12.16.0**

参见 [`writable.cork()`](/zh/nodejs/api/stream#writablecork)。

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**新增于: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 可选，随 `error` 事件发出的错误
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

销毁消息。 一旦套接字与消息关联并连接，该套接字也将被销毁。

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `chunk` 参数现在可以是 `Uint8Array`。 |
| v0.11.6 | 添加 `callback` 参数。 |
| v0.1.90 | 新增于: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选，**默认:** `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 可选
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

完成传出消息。 如果正文的任何部分未发送，它将刷新到底层系统。 如果消息是分块的，它将发送终止块 `0\r\n\r\n`，并发送尾部（如果有）。

如果指定了 `chunk`，则相当于调用 `outgoingMessage.write(chunk, encoding)`，然后调用 `outgoingMessage.end(callback)`。

如果提供了 `callback`，它将在消息完成时被调用（相当于 `'finish'` 事件的监听器）。

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**新增于: v1.6.0**

刷新消息头。

出于效率原因，Node.js 通常会缓冲消息头，直到调用 `outgoingMessage.end()` 或写入第一块消息数据。 然后，它尝试将头和数据打包到单个 TCP 数据包中。

通常这是期望的（它可以节省 TCP 往返），但当第一批数据直到很久以后才发送时则不然。 `outgoingMessage.flushHeaders()` 绕过优化并启动消息。


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**添加于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 头部名称
- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

获取具有给定名称的 HTTP 头部的值。如果未设置该头部，则返回的值将为 `undefined`。

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**添加于: v7.7.0**

- 返回值: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个数组，其中包含当前传出标头的唯一名称。 所有名称均为小写。

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**添加于: v7.7.0**

- 返回值: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回当前传出标头的浅拷贝。 由于使用了浅拷贝，因此可以更改数组值，而无需额外调用各种与标头相关的 HTTP 模块方法。 返回对象的键是标头名称，值是相应的标头值。 所有标头名称均为小写。

`outgoingMessage.getHeaders()` 方法返回的对象不以原型方式继承自 JavaScript `Object`。 这意味着典型的 `Object` 方法（例如 `obj.toString()`、`obj.hasOwnProperty()` 等）未定义且将不起作用。

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**添加于: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回值: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果传出标头中当前设置了由 `name` 标识的标头，则返回 `true`。 标头名称不区分大小写。

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**加入于: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

只读。如果已发送标头，则为 `true`，否则为 `false`。

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**加入于: v9.0.0**

覆盖了从传统 `Stream` 类继承的 `stream.pipe()` 方法，该类是 `http.OutgoingMessage` 的父类。

调用此方法将抛出一个 `Error`，因为 `outgoingMessage` 是一个只写流。

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**加入于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 标头名称

删除已排队等待隐式发送的标头。

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**加入于: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 标头名称
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 标头值
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

设置单个标头值。 如果标头已存在于要发送的标头中，其值将被替换。 使用字符串数组来发送具有相同名称的多个标头。

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**加入于: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

为隐式标头设置多个标头值。 `headers` 必须是 [`Headers`](/zh/nodejs/api/globals#class-headers) 或 `Map` 的一个实例，如果标头已经存在于将要发送的标头中，它的值将被替换。

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
或者

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
当标头已经通过 [`outgoingMessage.setHeaders()`](/zh/nodejs/api/http#outgoingmessagesetheadersheaders) 设置时，它们会与任何传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的标头合并，并且传递给 [`response.writeHead()`](/zh/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 的标头具有优先权。

```js [ESM]
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**新增于: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 可选函数，在发生超时时调用。 与绑定到 `timeout` 事件相同。
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

一旦套接字与消息关联并连接，将以 `msecs` 作为第一个参数调用 [`socket.setTimeout()`](/zh/nodejs/api/net#socketsettimeouttimeout-callback)。

### `outgoingMessage.socket` {#outgoingmessagesocket}

**新增于: v0.3.0**

- [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

对底层套接字的引用。 通常，用户不希望访问此属性。

在调用 `outgoingMessage.end()` 之后，此属性将被置为 null。

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**新增于: v13.2.0, v12.16.0**

参见 [`writable.uncork()`](/zh/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**新增于: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`outgoingMessage.cork()` 被调用的次数。

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**新增于: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果已调用 `outgoingMessage.end()`，则为 `true`。 此属性不指示数据是否已刷新。 为此，请改用 `message.writableFinished`。

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**新增于: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果所有数据都已刷新到基础系统，则为 `true`。

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**新增于: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

如果已分配，则为底层套接字的 `highWaterMark`。 否则，当 [`writable.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 开始返回 false 时的默认缓冲区级别 (`16384`)。


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Added in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

缓冲字节数。

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

始终为 `false`。

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `chunk` 参数现在可以是 `Uint8Array`。 |
| v0.11.6 | 添加了 `callback` 参数。 |
| v0.1.29 | 添加于: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

发送主体的区块。 可以多次调用此方法。

`encoding` 参数仅在 `chunk` 是字符串时相关。 默认为 `'utf8'`。

`callback` 参数是可选的，将在刷新此数据块时调用。

如果整个数据已成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据已在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，将发出 `'drain'` 事件。

## `http.METHODS` {#httpmethods}

**Added in: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

解析器支持的 HTTP 方法的列表。

## `http.STATUS_CODES` {#httpstatus_codes}

**Added in: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

所有标准 HTTP 响应状态代码的集合，以及每个状态代码的简短描述。 例如，`http.STATUS_CODES[404] === 'Not Found'`。


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 现在支持 `highWaterMark` 选项。 |
| v18.0.0 | 现在支持 `requestTimeout`、`headersTimeout`、`keepAliveTimeout` 和 `connectionsCheckingInterval` 选项。 |
| v18.0.0 | `noDelay` 选项现在默认为 `true`。 |
| v17.7.0, v16.15.0 | 现在支持 `noDelay`、`keepAlive` 和 `keepAliveInitialDelay` 选项。 |
| v13.3.0 | 现在支持 `maxHeaderSize` 选项。 |
| v13.8.0, v12.15.0, v10.19.0 | 现在支持 `insecureHTTPParser` 选项。 |
| v9.6.0, v8.12.0 | 现在支持 `options` 参数。 |
| v0.1.13 | 添加于: v0.1.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: 设置检查不完整请求中的请求和标头超时的间隔值，以毫秒为单位。**默认值:** `30000`。
    - `headersTimeout`: 设置从客户端接收完整 HTTP 标头的超时值，以毫秒为单位。 有关更多信息，请参见 [`server.headersTimeout`](/zh/nodejs/api/http#serverheaderstimeout)。**默认值:** `60000`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选地覆盖所有 `socket` 的 `readableHighWaterMark` 和 `writableHighWaterMark`。 这会影响 `IncomingMessage` 和 `ServerResponse` 的 `highWaterMark` 属性。**默认值:** 请参见 [`stream.getDefaultHighWaterMark()`](/zh/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode)。
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，它将使用启用宽松标志的 HTTP 解析器。 应避免使用不安全的解析器。 有关更多信息，请参见 [`--insecure-http-parser`](/zh/nodejs/api/cli#--insecure-http-parser)。**默认值:** `false`。
    - `IncomingMessage` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage) 指定要使用的 `IncomingMessage` 类。 用于扩展原始 `IncomingMessage`。**默认值:** `IncomingMessage`。
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则此选项允许使用逗号 (`, `) 连接请求中多个标头的字段行值，而不是丢弃重复项。 有关更多信息，请参阅 [`message.headers`](/zh/nodejs/api/http#messageheaders)。**默认值:** `false`。
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则会在收到新的传入连接后立即在套接字上启用 keep-alive 功能，类似于在 [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`] 中所做的事情。**默认值:** `false`。
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果设置为正数，则在空闲套接字上发送第一个 keepalive 探测之前，它会设置初始延迟。**默认值:** `0`。
    - `keepAliveTimeout`: 服务器在完成写入最后一个响应后，需要等待额外传入数据不活动状态的毫秒数，之后套接字将被销毁。 有关更多信息，请参见 [`server.keepAliveTimeout`](/zh/nodejs/api/http#serverkeepalivetimeout)。**默认值:** `5000`。
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选地覆盖此服务器收到的请求的 [`--max-http-header-size`](/zh/nodejs/api/cli#--max-http-header-sizesize) 的值，即请求标头的最大长度（以字节为单位）。**默认值:** 16384 (16 KiB)。
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则会在收到新的传入连接后立即禁用 Nagle 算法的使用。**默认值:** `true`。
    - `requestTimeout`: 设置从客户端接收整个请求的超时值，以毫秒为单位。 有关更多信息，请参见 [`server.requestTimeout`](/zh/nodejs/api/http#serverrequesttimeout)。**默认值:** `300000`。
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，它会强制服务器对任何缺少 Host 标头的 HTTP/1.1 请求消息（按照规范的要求）以 400（错误请求）状态代码进行响应。**默认值:** `true`。
    - `ServerResponse` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse) 指定要使用的 `ServerResponse` 类。 用于扩展原始 `ServerResponse`。**默认值:** `ServerResponse`。
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 应该只发送一次的响应标头的列表。 如果标头的值是一个数组，则这些项将使用 `; ` 连接。
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在写入没有主体的 HTTP 响应时会抛出错误。**默认值:** `false`。
  
 
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.Server\>](/zh/nodejs/api/http#class-httpserver)

返回 [`http.Server`](/zh/nodejs/api/http#class-httpserver) 的新实例。

`requestListener` 是一个函数，它会自动添加到 [`'request'`](/zh/nodejs/api/http#event-request) 事件。

::: code-group
```js [ESM]
import http from 'node:http';

// 创建一个本地服务器来接收数据
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// 创建一个本地服务器来接收数据
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::

::: code-group
```js [ESM]
import http from 'node:http';

// 创建一个本地服务器来接收数据
const server = http.createServer();

// 监听 request 事件
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// 创建一个本地服务器来接收数据
const server = http.createServer();

// 监听 request 事件
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.9.0 | `url` 参数现在可以与单独的 `options` 对象一起传递。 |
| v7.5.0 | `options` 参数可以是 WHATWG `URL` 对象。 |
| v0.3.6 | 添加于: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 接受与 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 相同的 `options`，默认情况下，方法设置为 GET。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

由于大多数请求都是没有主体的 GET 请求，因此 Node.js 提供了这个便捷的方法。 此方法与 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 之间的唯一区别是它默认将方法设置为 GET 并自动调用 `req.end()`。 `callback` 必须注意使用响应数据，原因在 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest) 部分中说明。

`callback` 使用单个参数调用，该参数是 [`http.IncomingMessage`](/zh/nodejs/api/http#class-httpincomingmessage) 的实例。

JSON 获取示例：

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // 任何 2xx 状态码都表示响应成功，但
  // 这里我们只检查 200。
  if (statusCode !== 200) {
    error = new Error('请求失败。\n' +
                      `状态码: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('无效的内容类型。\n' +
                      `期望 application/json 但收到 ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // 使用响应数据以释放内存
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`出现错误: ${e.message}`);
});

// 创建一个本地服务器来接收数据
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 默认情况下，代理现在使用 HTTP Keep-Alive 和 5 秒超时。 |
| v0.5.9 | 添加于: v0.5.9 |
:::

- [\<http.Agent\>](/zh/nodejs/api/http#class-httpagent)

`Agent` 的全局实例，用作所有 HTTP 客户端请求的默认值。与默认 `Agent` 配置的不同之处在于，它启用了 `keepAlive` 并且 `timeout` 为 5 秒。

## `http.maxHeaderSize` {#httpmaxheadersize}

**添加于: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

只读属性，指定 HTTP 标头的最大允许大小（以字节为单位）。默认为 16 KiB。可使用 [`--max-http-header-size`](/zh/nodejs/api/cli#--max-http-header-sizesize) CLI 选项进行配置。

可以通过传递 `maxHeaderSize` 选项来为服务器和客户端请求覆盖此设置。

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.7.0, v14.18.0 | 当使用 `URL` 对象时，解析后的用户名和密码现在将被正确地进行 URI 解码。 |
| v15.3.0, v14.17.0 | 可以使用 AbortSignal 中止请求。 |
| v13.3.0 | 现在支持 `maxHeaderSize` 选项。 |
| v13.8.0, v12.15.0, v10.19.0 | 现在支持 `insecureHTTPParser` 选项。 |
| v10.9.0 | 现在可以传递 `url` 参数以及单独的 `options` 对象。 |
| v7.5.0 | `options` 参数可以是 WHATWG `URL` 对象。 |
| v0.3.6 | 添加于: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/zh/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 控制 [`Agent`](/zh/nodejs/api/http#class-httpagent) 的行为。可能的值：
    - `undefined` (默认): 对此主机和端口使用 [`http.globalAgent`](/zh/nodejs/api/http#httpglobalagent)。
    - `Agent` 对象: 显式地使用传入的 `Agent`。
    - `false`: 导致使用具有默认值的新 `Agent`。

    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于计算 Authorization 标头的基本身份验证（`'user:password'`）。
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个函数，用于生成当不使用 `agent` 选项时用于请求的套接字/流。这可用于避免创建自定义 `Agent` 类，仅仅是为了覆盖默认的 `createConnection` 函数。有关更多详细信息，请参阅 [`agent.createConnection()`](/zh/nodejs/api/http#agentcreateconnectionoptions-callback)。任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流都是有效的返回值。
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 协议的默认端口。 **默认:** 如果使用 `Agent`，则为 `agent.defaultPort`，否则为 `undefined`。
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 解析 `host` 或 `hostname` 时要使用的 IP 地址族。有效值为 `4` 或 `6`。如果未指定，将同时使用 IP v4 和 v6。
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含请求标头的对象。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选的 [`dns.lookup()` 提示](/zh/nodejs/api/dns#supported-getaddrinfo-flags)。
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要向其发出请求的服务器的域名或 IP 地址。 **默认:** `'localhost'`。
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `host` 的别名。为了支持 [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)，如果同时指定了 `host` 和 `hostname`，则将使用 `hostname`。
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，它将使用启用宽松标志的 HTTP 解析器。应避免使用不安全的解析器。有关更多信息，请参见 [`--insecure-http-parser`](/zh/nodejs/api/cli#--insecure-http-parser)。 **默认:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 它在请求中用 `, ` 连接多个标头的字段行值，而不是丢弃重复项。有关更多信息，请参见 [`message.headers`](/zh/nodejs/api/http#messageheaders)。 **默认:** `false`。
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于网络连接的本地接口。
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从中连接的本地端口。
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 自定义查找函数。 **默认:** [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选地覆盖从服务器收到的响应的 [`--max-http-header-size`](/zh/nodejs/api/cli#--max-http-header-sizesize) 的值（响应标头的最大长度，以字节为单位）。 **默认:** 16384 (16 KiB)。
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定 HTTP 请求方法的字符串。 **默认:** `'GET'`。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求路径。应包括查询字符串（如果有）。例如 `'/index.html?page=12'`。如果请求路径包含非法字符，则会引发异常。当前，仅拒绝空格，但将来可能会更改。 **默认:** `'/'`。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程服务器的端口。 **默认:** 如果设置了 `defaultPort`，则为 `defaultPort`，否则为 `80`。
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的协议。 **默认:** `'http:'`。
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): 指定是否自动添加默认标头，例如 `Connection`、`Content-Length`、`Transfer-Encoding` 和 `Host`。 如果设置为 `false`，则必须手动添加所有必需的标头。 默认为 `true`。
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): 指定是否自动添加 `Host` 标头。 如果提供此选项，则它会覆盖 `setDefaultHeaders`。 默认为 `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal): 可用于中止正在进行的请求的 AbortSignal。
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Unix 域套接字。如果指定了 `host` 或 `port` 之一，则不能使用，因为它们指定了一个 TCP 套接字。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): 指定套接字超时的毫秒数。 这将在连接套接字之前设置超时。
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 应该只发送一次的请求标头的列表。 如果标头的值是一个数组，则这些项将使用 `; ` 连接。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

也支持 [`socket.connect()`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 中的 `options`。

Node.js 为每个服务器维护多个连接以发出 HTTP 请求。 此函数允许透明地发出请求。

`url` 可以是字符串或 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象。 如果 `url` 是字符串，则会自动使用 [`new URL()`](/zh/nodejs/api/url#new-urlinput-base) 进行解析。 如果它是 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象，则会自动转换为普通的 `options` 对象。

如果同时指定了 `url` 和 `options`，则会将这些对象合并，并且 `options` 属性优先。

可选的 `callback` 参数将作为 [`'response'`](/zh/nodejs/api/http#event-response) 事件的一次性监听器添加。

`http.request()` 返回 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest) 类的一个实例。 `ClientRequest` 实例是一个可写流。 如果需要使用 POST 请求上传文件，则写入 `ClientRequest` 对象。

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

在示例中调用了 `req.end()`。 使用 `http.request()` 必须始终调用 `req.end()` 以表示请求的结束 - 即使没有数据写入请求主体。

如果在请求期间遇到任何错误（无论是 DNS 解析、TCP 级别错误还是实际的 HTTP 解析错误），都会在返回的请求对象上发出 `'error'` 事件。 与所有 `'error'` 事件一样，如果没有注册监听器，则会抛出错误。

有一些特殊的标头应该注意。

- 发送 'Connection: keep-alive' 将通知 Node.js，与服务器的连接应保持到下一个请求。
- 发送 'Content-Length' 标头将禁用默认的块编码。
- 发送 'Expect' 标头将立即发送请求标头。 通常，在发送 'Expect: 100-continue' 时，应同时设置超时和 `'continue'` 事件的监听器。 有关更多信息，请参见 RFC 2616 第 8.2.3 节。
- 发送 Authorization 标头将覆盖使用 `auth` 选项来计算基本身份验证。

使用 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 作为 `options` 的示例：

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
在成功的请求中，将按以下顺序发出以下事件：

- `'socket'`
- `'response'`
    - `'data'` 任意次数，在 `res` 对象上（如果响应主体为空，则根本不会发出 `'data'`，例如，在大多数重定向中）
    - `res` 对象上的 `'end'`

- `'close'`

如果发生连接错误，将发出以下事件：

- `'socket'`
- `'error'`
- `'close'`

如果在收到响应之前过早地关闭连接，将按以下顺序发出以下事件：

- `'socket'`
- `'error'`，错误消息为 `'Error: socket hang up'`，代码为 `'ECONNRESET'`
- `'close'`

如果在收到响应后过早地关闭连接，将按以下顺序发出以下事件：

- `'socket'`
- `'response'`
    - `'data'` 任意次数，在 `res` 对象上

- （在此处关闭连接）
- `res` 对象上的 `'aborted'`
- `'close'`
- `res` 对象上的 `'error'`，错误消息为 `'Error: aborted'`，代码为 `'ECONNRESET'`
- `res` 对象上的 `'close'`

如果在分配套接字之前调用 `req.destroy()`，将按以下顺序发出以下事件：

-（在此处调用 `req.destroy()`）
- `'error'`，错误消息为 `'Error: socket hang up'`，代码为 `'ECONNRESET'`，或调用 `req.destroy()` 时出现的错误
- `'close'`

如果在连接成功之前调用 `req.destroy()`，将按以下顺序发出以下事件：

- `'socket'`
-（在此处调用 `req.destroy()`）
- `'error'`，错误消息为 `'Error: socket hang up'`，代码为 `'ECONNRESET'`，或调用 `req.destroy()` 时出现的错误
- `'close'`

如果在收到响应后调用 `req.destroy()`，将按以下顺序发出以下事件：

- `'socket'`
- `'response'`
    - `'data'` 任意次数，在 `res` 对象上

-（在此处调用 `req.destroy()`）
- `res` 对象上的 `'aborted'`
- `'close'`
- `res` 对象上的 `'error'`，错误消息为 `'Error: aborted'`，代码为 `'ECONNRESET'`，或调用 `req.destroy()` 时出现的错误
- `res` 对象上的 `'close'`

如果在分配套接字之前调用 `req.abort()`，将按以下顺序发出以下事件：

-（在此处调用 `req.abort()`）
- `'abort'`
- `'close'`

如果在连接成功之前调用 `req.abort()`，将按以下顺序发出以下事件：

- `'socket'`
-（在此处调用 `req.abort()`）
- `'abort'`
- `'error'`，错误消息为 `'Error: socket hang up'`，代码为 `'ECONNRESET'`
- `'close'`

如果在收到响应后调用 `req.abort()`，将按以下顺序发出以下事件：

- `'socket'`
- `'response'`
    - `'data'` 任意次数，在 `res` 对象上

-（在此处调用 `req.abort()`）
- `'abort'`
- `res` 对象上的 `'aborted'`
- `res` 对象上的 `'error'`，错误消息为 `'Error: aborted'`，代码为 `'ECONNRESET'`。
- `'close'`
- `res` 对象上的 `'close'`

设置 `timeout` 选项或使用 `setTimeout()` 函数不会中止请求，除了添加 `'timeout'` 事件外，什么也不会做。

传递 `AbortSignal`，然后在相应的 `AbortController` 上调用 `abort()`，其行为与在请求上调用 `.destroy()` 相同。 具体来说，`'error'` 事件将发出一个错误，错误消息为 `'AbortError: The operation was aborted'`，代码为 `'ABORT_ERR'` 以及 `cause`（如果提供了）。


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.5.0, v18.14.0 | 添加了 `label` 参数。 |
| v14.3.0 | 添加于: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 错误消息的标签。 **默认值:** `'Header name'`。

对提供的 `name` 执行底层验证，这些验证在调用 `res.setHeader(name, value)` 时完成。

将非法值作为 `name` 传递将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)，由 `code: 'ERR_INVALID_HTTP_TOKEN'` 标识。

没有必要在将标头传递给 HTTP 请求或响应之前使用此方法。 HTTP 模块将自动验证此类标头。

例子：

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**添加于: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

对提供的 `value` 执行底层验证，这些验证在调用 `res.setHeader(name, value)` 时完成。

将非法值作为 `value` 传递将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

- 未定义的值错误由 `code: 'ERR_HTTP_INVALID_HEADER_VALUE'` 标识。
- 无效值字符错误由 `code: 'ERR_INVALID_CHAR'` 标识。

没有必要在将标头传递给 HTTP 请求或响应之前使用此方法。 HTTP 模块将自动验证此类标头。

例子：

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**加入于: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `1000`.

设置空闲 HTTP 解析器的最大数量。

## `WebSocket` {#websocket}

**加入于: v22.5.0**

与浏览器兼容的 [`WebSocket`](/zh/nodejs/api/http#websocket) 实现。

