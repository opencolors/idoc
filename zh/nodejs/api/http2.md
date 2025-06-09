---
title: Node.js 文档 - HTTP/2
description: 此页面提供了 Node.js 中 HTTP/2 模块的详细文档，介绍了其 API、使用方法以及实现 HTTP/2 服务器和客户端的示例。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 此页面提供了 Node.js 中 HTTP/2 模块的详细文档，介绍了其 API、使用方法以及实现 HTTP/2 服务器和客户端的示例。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 此页面提供了 Node.js 中 HTTP/2 模块的详细文档，介绍了其 API、使用方法以及实现 HTTP/2 服务器和客户端的示例。
---


# HTTP/2 {#http/2}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 现在可以发送/接收带有 `host` 标头（无论是否带有 `:authority`）的请求。 |
| v15.3.0, v14.17.0 | 可以使用 AbortSignal 中止请求。 |
| v10.10.0 | HTTP/2 现在是稳定的。 以前，它是实验性的。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

`node:http2` 模块提供了 [HTTP/2](https://tools.ietf.org/html/rfc7540) 协议的实现。 可以使用以下方式访问它：

```js [ESM]
const http2 = require('node:http2');
```
## 确定 crypto 支持是否不可用 {#determining-if-crypto-support-is-unavailable}

Node.js 有可能在构建时未包含对 `node:crypto` 模块的支持。 在这种情况下，尝试从 `node:http2` 进行 `import` 或调用 `require('node:http2')` 将导致抛出错误。

使用 CommonJS 时，可以使用 try/catch 捕获抛出的错误：

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 支持已禁用!');
}
```
使用词法 ESM `import` 关键字时，只有在尝试加载模块之前注册了 `process.on('uncaughtException')` 的处理程序（例如，使用预加载模块）才能捕获该错误。

使用 ESM 时，如果代码有可能在未启用 crypto 支持的 Node.js 版本上运行，请考虑使用 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 函数而不是词法 `import` 关键字：

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 支持已禁用!');
}
```
## 核心 API {#core-api}

核心 API 提供了一个低级接口，专门围绕对 HTTP/2 协议功能的支持而设计。 它专门*不*为与现有的 [HTTP/1](/zh/nodejs/api/http) 模块 API 兼容而设计。 但是，[兼容性 API](/zh/nodejs/api/http2#compatibility-api) 是。

`http2` 核心 API 在客户端和服务器端之间比 `http` API 更加对称。 例如，大多数事件，如 `'error'`、`'connect'` 和 `'stream'`，可以由客户端代码或服务器端代码发出。


### 服务端示例 {#server-side-example}

以下展示了一个使用 Core API 的简单 HTTP/2 服务器。由于目前没有已知浏览器支持[未加密的 HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption)，因此与浏览器客户端通信时必须使用 [`http2.createSecureServer()`](/zh/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

要为此示例生成证书和密钥，请运行：

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### 客户端示例 {#client-side-example}

以下展示了一个 HTTP/2 客户端：

::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### 类: `Http2Session` {#class-http2session}

**新增于: v8.4.0**

- 继承: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`http2.Http2Session` 类的实例表示 HTTP/2 客户端和服务器之间的活动通信会话。 此类的实例*不*打算由用户代码直接构造。

每个 `Http2Session` 实例都会表现出略有不同的行为，具体取决于它是在服务器还是客户端上运行。 `http2session.type` 属性可用于确定 `Http2Session` 的运行模式。 在服务器端，用户代码很少需要直接使用 `Http2Session` 对象，大多数操作通常通过与 `Http2Server` 或 `Http2Stream` 对象的交互来执行。

用户代码不会直接创建 `Http2Session` 实例。 服务器端的 `Http2Session` 实例由 `Http2Server` 实例在新接收到 HTTP/2 连接时创建。 客户端的 `Http2Session` 实例使用 `http2.connect()` 方法创建。

#### `Http2Session` 和套接字 {#http2session-and-sockets}

每个 `Http2Session` 实例在创建时都与一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 或 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 相关联。 当 `Socket` 或 `Http2Session` 被销毁时，两者都将被销毁。

由于 HTTP/2 协议的特定序列化和处理要求，不建议用户代码从绑定到 `Http2Session` 的 `Socket` 实例读取数据或向其写入数据。 这样做可能会使 HTTP/2 会话进入不确定状态，从而导致会话和套接字变得不可用。

一旦 `Socket` 绑定到 `Http2Session`，用户代码应仅依赖于 `Http2Session` 的 API。

#### 事件: `'close'` {#event-close}

**新增于: v8.4.0**

`'close'` 事件在 `Http2Session` 被销毁后触发。 它的侦听器不期望任何参数。

#### 事件: `'connect'` {#event-connect}

**新增于: v8.4.0**

- `session` [\<Http2Session\>](/zh/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

`'connect'` 事件在 `Http2Session` 成功连接到远程对等方并且可以开始通信时触发。

用户代码通常不会直接监听此事件。


#### 事件: `'error'` {#event-error}

**新增于: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当在处理 `Http2Session` 期间发生错误时，会触发 `'error'` 事件。

#### 事件: `'frameError'` {#event-frameerror}

**新增于: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 帧类型。
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 错误代码。
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 流 ID（如果帧与流无关，则为 `0`）。

当尝试在会话上发送帧时发生错误时，会触发 `'frameError'` 事件。 如果无法发送的帧与特定的 `Http2Stream` 相关联，则会尝试在 `Http2Stream` 上触发 `'frameError'` 事件。

如果 `'frameError'` 事件与流相关联，则在 `'frameError'` 事件之后，该流将被立即关闭和销毁。 如果事件与流无关，则在 `'frameError'` 事件之后，`Http2Session` 将被立即关闭。

#### 事件: `'goaway'` {#event-goaway}

**新增于: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `GOAWAY` 帧中指定的 HTTP/2 错误代码。
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程对等端成功处理的最后一个流的 ID（如果未指定 ID，则为 `0`）。
- `opaqueData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 如果 `GOAWAY` 帧中包含其他不透明数据，则将传递一个包含该数据的 `Buffer` 实例。

当收到 `GOAWAY` 帧时，会触发 `'goaway'` 事件。

当触发 `'goaway'` 事件时，`Http2Session` 实例将自动关闭。


#### Event: `'localSettings'` {#event-localsettings}

**新增于: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/zh/nodejs/api/http2#settings-object) 接收到的 `SETTINGS` 帧的副本。

当接收到确认的 `SETTINGS` 帧时，会触发 `'localSettings'` 事件。

当使用 `http2session.settings()` 提交新设置时，修改后的设置只有在触发 `'localSettings'` 事件后才会生效。

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* 使用新的设置 */
});
```
#### Event: `'ping'` {#event-ping}

**新增于: v10.12.0**

- `payload` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `PING` 帧的 8 字节有效负载

每当从连接的对等方接收到 `PING` 帧时，就会触发 `'ping'` 事件。

#### Event: `'remoteSettings'` {#event-remotesettings}

**新增于: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/zh/nodejs/api/http2#settings-object) 接收到的 `SETTINGS` 帧的副本。

当从连接的对等方接收到新的 `SETTINGS` 帧时，会触发 `'remoteSettings'` 事件。

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* 使用新的设置 */
});
```
#### Event: `'stream'` {#event-stream}

**新增于: v8.4.0**

- `stream` [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream) 对流的引用
- `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object) 描述标头的对象
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 关联的数字标志
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个数组，包含原始标头名称，后跟它们各自的值。

当创建新的 `Http2Stream` 时，会触发 `'stream'` 事件。

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
在服务器端，用户代码通常不会直接监听此事件，而是会为 `net.Server` 或 `tls.Server` 实例触发的 `'stream'` 事件注册一个处理程序，这些实例分别由 `http2.createServer()` 和 `http2.createSecureServer()` 返回，如下例所示：

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 创建一个未加密的 HTTP/2 服务器
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 创建一个未加密的 HTTP/2 服务器
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

即使 HTTP/2 流和网络套接字不是 1:1 的对应关系，网络错误也会销毁每个单独的流，并且必须在流级别上处理，如上所示。


#### 事件: `'timeout'` {#event-timeout}

**新增于: v8.4.0**

在使用 `http2session.setTimeout()` 方法为此 `Http2Session` 设置超时时间后，如果在配置的毫秒数后 `Http2Session` 上没有活动，则会触发 `'timeout'` 事件。其监听器不期望任何参数。

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**新增于: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

如果 `Http2Session` 尚未连接到套接字，则该值为 `undefined`；如果 `Http2Session` 未连接到 `TLSSocket`，则该值为 `h2c`；否则将返回连接的 `TLSSocket` 自身的 `alpnProtocol` 属性的值。

#### `http2session.close([callback])` {#http2sessionclosecallback}

**新增于: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

优雅地关闭 `Http2Session`，允许任何现有的流自行完成，并防止创建新的 `Http2Stream` 实例。 关闭后，如果没有打开的 `Http2Stream` 实例，则*可能*会调用 `http2session.destroy()`。

如果指定，则将 `callback` 函数注册为 `'close'` 事件的处理程序。

#### `http2session.closed` {#http2sessionclosed}

**新增于: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果此 `Http2Session` 实例已关闭，则为 `true`，否则为 `false`。

#### `http2session.connecting` {#http2sessionconnecting}

**新增于: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果此 `Http2Session` 实例仍在连接中，则为 `true`，将在触发 `connect` 事件和/或调用 `http2.connect` 回调之前设置为 `false`。

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**新增于: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 如果 `Http2Session` 因错误而被销毁，则为 `Error` 对象。
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要在最终 `GOAWAY` 帧中发送的 HTTP/2 错误代码。 如果未指定，并且 `error` 未定义，则默认值为 `INTERNAL_ERROR`，否则默认为 `NO_ERROR`。

立即终止 `Http2Session` 和关联的 `net.Socket` 或 `tls.TLSSocket`。

销毁后，`Http2Session` 将触发 `'close'` 事件。 如果 `error` 未定义，则会在 `'close'` 事件之前立即触发 `'error'` 事件。

如果 `Http2Session` 仍有任何剩余的打开的 `Http2Stream`，这些流也将被销毁。


#### `http2session.destroyed` {#http2sessiondestroyed}

**新增于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果此 `Http2Session` 实例已被销毁且不得再使用，则为 `true`，否则为 `false`。

#### `http2session.encrypted` {#http2sessionencrypted}

**新增于: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

如果 `Http2Session` 会话套接字尚未连接，则值为 `undefined`；如果 `Http2Session` 通过 `TLSSocket` 连接，则为 `true`；如果 `Http2Session` 连接到任何其他类型的套接字或流，则为 `false`。

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**新增于: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个 HTTP/2 错误码
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 上次处理的 `Http2Stream` 的数字 ID
- `opaqueData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 一个 `TypedArray` 或 `DataView` 实例，其中包含要包含在 `GOAWAY` 帧中的其他数据。

向连接的对等方发送 `GOAWAY` 帧，*不*关闭 `Http2Session`。

#### `http2session.localSettings` {#http2sessionlocalsettings}

**新增于: v8.4.0**

- [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

一个无原型对象，描述此 `Http2Session` 的当前本地设置。 本地设置是*此* `Http2Session` 实例的本地设置。

#### `http2session.originSet` {#http2sessionoriginset}

**新增于: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

如果 `Http2Session` 连接到 `TLSSocket`，则 `originSet` 属性将返回一个原点 `Array`，`Http2Session` 可被视为对这些原点具有权威性。

`originSet` 属性仅在使用安全 TLS 连接时可用。


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**加入版本: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

指示 `Http2Session` 是否正在等待发送的 `SETTINGS` 帧的确认。 在调用 `http2session.settings()` 方法后将为 `true`。 一旦所有发送的 `SETTINGS` 帧都已确认，则将为 `false`。

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.9.3 | 加入版本: v8.9.3 |
:::

- `payload` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 可选的 ping 负载。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

向连接的 HTTP/2 对等方发送 `PING` 帧。 必须提供 `callback` 函数。 如果发送了 `PING`，该方法将返回 `true`，否则返回 `false`。

未完成（未确认）ping 的最大数量由 `maxOutstandingPings` 配置选项确定。 默认最大值为 10。

如果提供，则 `payload` 必须是 `Buffer`、`TypedArray` 或 `DataView`，其中包含 8 字节的数据，这些数据将与 `PING` 一起传输，并与 ping 确认一起返回。

将使用三个参数调用回调：一个错误参数（如果 `PING` 成功确认，则为 `null`）、一个 `duration` 参数（报告自发送 ping 并收到确认以来经过的毫秒数）和一个包含 8 字节 `PING` 负载的 `Buffer`。

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
如果未指定 `payload` 参数，则默认负载将是标记 `PING` 持续时间开始的 64 位时间戳（小端）。


#### `http2session.ref()` {#http2sessionref}

**添加于: v9.4.0**

调用此 `Http2Session` 实例底层 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 上的 [`ref()`](/zh/nodejs/api/net#socketref)。

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**添加于: v8.4.0**

- [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

一个无原型对象，描述了此 `Http2Session` 的当前远程设置。 远程设置由 *已连接的* HTTP/2 对等方设置。

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**添加于: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置本地端点的窗口大小。 `windowSize` 是要设置的总窗口大小，而不是增量。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

对于 http2 客户端，正确的事件是 `'connect'` 或 `'remoteSettings'`。

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

用于设置一个回调函数，该函数在 `msecs` 毫秒后 `Http2Session` 上没有活动时被调用。 给定的 `callback` 注册为 `'timeout'` 事件的监听器。


#### `http2session.socket` {#http2sessionsocket}

**加入于: v8.4.0**

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

返回一个 `Proxy` 对象，它充当 `net.Socket` (或 `tls.TLSSocket`)，但将可用方法限制为可安全用于 HTTP/2 的方法。

`destroy`、`emit`、`end`、`pause`、`read`、`resume` 和 `write` 将抛出一个代码为 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 的错误。 更多信息请参见 [`Http2Session` 和套接字](/zh/nodejs/api/http2#http2session-and-sockets)。

`setTimeout` 方法将在此 `Http2Session` 上调用。

所有其他交互将直接路由到套接字。

#### `http2session.state` {#http2sessionstate}

**加入于: v8.4.0**

提供关于 `Http2Session` 当前状态的杂项信息。

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 当前的本地（接收）流量控制窗口大小。
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 自上次流量控制 `WINDOW_UPDATE` 以来收到的当前字节数。
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 下次由此 `Http2Session` 创建新的 `Http2Stream` 时要使用的数字标识符。
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 远程对等端可以在不接收 `WINDOW_UPDATE` 的情况下发送的字节数。
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最近接收到 `HEADERS` 或 `DATA` 帧的 `Http2Stream` 的数字 id。
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 此 `Http2Session` 在不接收 `WINDOW_UPDATE` 的情况下可以发送的字节数。
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当前在此 `Http2Session` 的出站队列中的帧数。
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 出站头压缩状态表的当前大小（以字节为单位）。
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 入站头压缩状态表的当前大小（以字节为单位）。

一个描述此 `Http2Session` 当前状态的对象。


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 会话连接后立即调用，如果会话已连接，则立即调用。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object) 更新后的 `settings` 对象。
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

更新此 `Http2Session` 的当前本地设置，并向连接的 HTTP/2 对等方发送新的 `SETTINGS` 帧。

调用后，当会话等待远程对等方确认新设置时，`http2session.pendingSettingsAck` 属性将为 `true`。

新的设置只有在收到 `SETTINGS` 确认并发出 `'localSettings'` 事件后才会生效。 在确认仍在等待时，可以发送多个 `SETTINGS` 帧。

#### `http2session.type` {#http2sessiontype}

**添加于: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

如果此 `Http2Session` 实例是服务器，则 `http2session.type` 将等于 `http2.constants.NGHTTP2_SESSION_SERVER`，如果实例是客户端，则等于 `http2.constants.NGHTTP2_SESSION_CLIENT`。

#### `http2session.unref()` {#http2sessionunref}

**添加于: v9.4.0**

在此 `Http2Session` 实例的基础 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 上调用 [`unref()`](/zh/nodejs/api/net#socketunref)。


### 类: `ServerHttp2Session` {#class-serverhttp2session}

**加入版本: v8.4.0**

- 继承: [\<Http2Session\>](/zh/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**加入版本: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对备用服务配置的描述，如 [RFC 7838](https://tools.ietf.org/html/rfc7838) 所定义。
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个 URL 字符串，指定 origin (或一个具有 `origin` 属性的 `Object`)，或者是一个激活的 `Http2Stream` 的数字标识符，由 `http2stream.id` 属性给出。

向已连接的客户端提交一个 `ALTSVC` 帧（如 [RFC 7838](https://tools.ietf.org/html/rfc7838) 所定义）。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // 为 origin https://example.org:80 设置 altsvc
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 为指定 stream 设置 altsvc
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // 为 origin https://example.org:80 设置 altsvc
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 为指定 stream 设置 altsvc
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

使用指定的 stream ID 发送一个 `ALTSVC` 帧表明，该备用服务与给定的 `Http2Stream` 的 origin 相关联。

`alt` 和 origin 字符串 *必须* 仅包含 ASCII 字节，并且被严格地解释为 ASCII 字节序列。 特殊值 `'clear'` 可以用来清除先前为给定域设置的任何备用服务。

当为 `originOrStream` 参数传入字符串时，它将被解析为 URL，并且 origin 将被推导出来。 例如，HTTP URL `'https://example.org/foo/bar'` 的 origin 是 ASCII 字符串 `'https://example.org'`。 如果给定的字符串无法被解析为 URL，或者无法推导出有效的 origin，则会抛出一个错误。

一个 `URL` 对象，或者任何带有 `origin` 属性的对象，可以作为 `originOrStream` 传入，在这种情况下，将使用 `origin` 属性的值。 `origin` 属性的值*必须*是一个正确序列化的 ASCII origin。


#### 指定备选服务 {#specifying-alternative-services}

`alt` 参数的格式由 [RFC 7838](https://tools.ietf.org/html/rfc7838) 严格定义，它是一个 ASCII 字符串，包含与特定主机和端口关联的以逗号分隔的“备选”协议列表。

例如，值 `'h2="example.org:81"'` 表示 HTTP/2 协议在 TCP/IP 端口 81 上的主机 `'example.org'` 上可用。 主机和端口 *必须* 包含在引号 (`"`) 字符中。

可以指定多个备选方案，例如：`'h2="example.org:81", h2=":82"'`。

协议标识符（示例中的 `'h2'`）可以是任何有效的 [ALPN 协议 ID](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids)。

这些值的语法未经过 Node.js 实现的验证，而是按用户提供或从对等方接收的方式传递。

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**新增于: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 作为单独参数传递的一个或多个 URL 字符串。

将 `ORIGIN` 帧（由 [RFC 8336](https://tools.ietf.org/html/rfc8336) 定义）提交到连接的客户端，以声明服务器能够提供权威响应的源的集合。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

当字符串作为 `origin` 传递时，它将被解析为 URL 并且将派生出 origin。 例如，HTTP URL `'https://example.org/foo/bar'` 的 origin 是 ASCII 字符串 `'https://example.org'`。 如果给定的字符串无法解析为 URL，或者无法派生有效的 origin，则会抛出错误。

`URL` 对象，或任何具有 `origin` 属性的对象，都可以作为 `origin` 传递，在这种情况下，将使用 `origin` 属性的值。 `origin` 属性的值*必须*是正确序列化的 ASCII origin。

或者，使用 `http2.createSecureServer()` 方法创建新的 HTTP/2 服务器时，可以使用 `origins` 选项：

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### 类: `ClientHttp2Session` {#class-clienthttp2session}

**添加于: v8.4.0**

- 继承自: [\<Http2Session\>](/zh/nodejs/api/http2#class-http2session)

#### 事件: `'altsvc'` {#event-altsvc}

**添加于: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当客户端接收到 `ALTSVC` 帧时，会触发 `'altsvc'` 事件。 该事件会携带 `ALTSVC` 值、源和流 ID 触发。 如果 `ALTSVC` 帧中未提供 `origin`，则 `origin` 将为空字符串。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### 事件: `'origin'` {#event-origin}

**添加于: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当客户端接收到 `ORIGIN` 帧时，会触发 `'origin'` 事件。 该事件会携带 `origin` 字符串数组触发。 `http2session.originSet` 将更新为包含接收到的源。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

只有在使用安全的 TLS 连接时才会触发 `'origin'` 事件。


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**新增于: v8.4.0**

-  `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果 `Http2Stream` 的 *writable* 端应该在最初关闭，则为 `true`，例如在发送不应期望有效负载主体的 `GET` 请求时。
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 并且 `parent` 标识父流时，创建的流将成为父流的唯一直接依赖项，所有其他现有依赖项将成为新创建的流的依赖项。 **默认值:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定新创建的流所依赖的流的数字标识符。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定流相对于具有相同 `parent` 的其他流的相对依赖性。 该值是介于 `1` 和 `256`（包括）之间的数字。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Http2Stream` 将在发送最终的 `DATA` 帧后发出 `'wantTrailers'` 事件。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于中止正在进行的请求的 AbortSignal。


-  返回: [\<ClientHttp2Stream\>](/zh/nodejs/api/http2#class-clienthttp2stream)

仅对于 HTTP/2 客户端 `Http2Session` 实例，`http2session.request()` 创建并返回一个 `Http2Stream` 实例，该实例可用于将 HTTP/2 请求发送到连接的服务器。

当首次创建 `ClientHttp2Session` 时，套接字可能尚未连接。 如果在此期间调用 `clienthttp2session.request()`，则实际请求将延迟到套接字准备就绪为止。 如果在执行实际请求之前关闭 `session`，则会抛出 `ERR_HTTP2_GOAWAY_SESSION`。

仅当 `http2session.type` 等于 `http2.constants.NGHTTP2_SESSION_CLIENT` 时，此方法才可用。

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

当设置了 `options.waitForTrailers` 选项时，在将要发送的最后一个有效负载数据块排队后，会立即发出 `'wantTrailers'` 事件。 然后可以调用 `http2stream.sendTrailers()` 方法以将尾部标头发送到对等方。

设置 `options.waitForTrailers` 后，`Http2Stream` 不会在传输最终的 `DATA` 帧时自动关闭。 用户代码必须调用 `http2stream.sendTrailers()` 或 `http2stream.close()` 才能关闭 `Http2Stream`。

当使用 `AbortSignal` 设置 `options.signal`，然后调用相应 `AbortController` 上的 `abort` 时，该请求将发出一个带有 `AbortError` 错误的 `'error'` 事件。

`:method` 和 `:path` 伪标头未在 `headers` 中指定，它们分别默认为：

- `:method` = `'GET'`
- `:path` = `/`


### 类: `Http2Stream` {#class-http2stream}

**加入于: v8.4.0**

- 继承: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

`Http2Stream` 类的每个实例表示 `Http2Session` 实例上的双向 HTTP/2 通信流。任何单个 `Http2Session` 在其生命周期内最多可以有 2-1 个 `Http2Stream` 实例。

用户代码不会直接构造 `Http2Stream` 实例。相反，这些实例是通过 `Http2Session` 实例创建、管理并提供给用户代码的。在服务器端，`Http2Stream` 实例的创建要么是为了响应传入的 HTTP 请求（并通过 `'stream'` 事件传递给用户代码），要么是为了响应对 `http2stream.pushStream()` 方法的调用。在客户端，`Http2Stream` 实例的创建和返回发生在调用 `http2session.request()` 方法时，或者为了响应传入的 `'push'` 事件。

`Http2Stream` 类是 [`ServerHttp2Stream`](/zh/nodejs/api/http2#class-serverhttp2stream) 和 [`ClientHttp2Stream`](/zh/nodejs/api/http2#class-clienthttp2stream) 类的基类，每个类分别专门用于服务器端或客户端。

所有 `Http2Stream` 实例都是 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。`Duplex` 的 `Writable` 端用于将数据发送到连接的对等端，而 `Readable` 端用于接收连接的对等端发送的数据。

`Http2Stream` 的默认文本字符编码是 UTF-8。当使用 `Http2Stream` 发送文本时，请使用 `'content-type'` 标头来设置字符编码。

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### `Http2Stream` 生命周期 {#http2stream-lifecycle}

##### 创建 {#creation}

在服务器端，[`ServerHttp2Stream`](/zh/nodejs/api/http2#class-serverhttp2stream) 的实例在以下情况下创建：

- 收到带有先前未使用的流 ID 的新 HTTP/2 `HEADERS` 帧；
- 调用 `http2stream.pushStream()` 方法。

在客户端，当调用 `http2session.request()` 方法时，会创建 [`ClientHttp2Stream`](/zh/nodejs/api/http2#class-clienthttp2stream) 的实例。

在客户端，如果父 `Http2Session` 尚未完全建立，则 `http2session.request()` 返回的 `Http2Stream` 实例可能不会立即准备好使用。在这种情况下，对 `Http2Stream` 调用的操作将被缓冲，直到发出 `'ready'` 事件。用户代码很少需要直接处理 `'ready'` 事件。可以通过检查 `http2stream.id` 的值来确定 `Http2Stream` 的就绪状态。如果该值为 `undefined`，则该流尚未准备好使用。


##### 销毁 {#destruction}

所有 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 实例会在以下情况下被销毁：

- 连接的对等方接收到该流的 `RST_STREAM` 帧，并且（仅对于客户端流）待处理的数据已被读取。
- 调用了 `http2stream.close()` 方法，并且（仅对于客户端流）待处理的数据已被读取。
- 调用了 `http2stream.destroy()` 或 `http2session.destroy()` 方法。

当 `Http2Stream` 实例被销毁时，将尝试向连接的对等方发送 `RST_STREAM` 帧。

当 `Http2Stream` 实例被销毁时，将触发 `'close'` 事件。 由于 `Http2Stream` 是 `stream.Duplex` 的一个实例，如果流数据当前正在流动，则也会触发 `'end'` 事件。 如果使用作为第一个参数传递的 `Error` 调用 `http2stream.destroy()`，则也可能触发 `'error'` 事件。

在 `Http2Stream` 被销毁后，`http2stream.destroyed` 属性将为 `true`，并且 `http2stream.rstCode` 属性将指定 `RST_STREAM` 错误代码。 `Http2Stream` 实例一旦被销毁，就不能再使用。

#### 事件: `'aborted'` {#event-aborted}

**新增于: v8.4.0**

每当 `Http2Stream` 实例在通信过程中异常中止时，就会触发 `'aborted'` 事件。 它的监听器不期望任何参数。

只有在 `Http2Stream` 的可写端尚未结束时，才会触发 `'aborted'` 事件。

#### 事件: `'close'` {#event-close_1}

**新增于: v8.4.0**

当 `Http2Stream` 被销毁时，会触发 `'close'` 事件。 一旦触发此事件，`Http2Stream` 实例将不再可用。

可以使用 `http2stream.rstCode` 属性检索关闭流时使用的 HTTP/2 错误代码。 如果代码是除 `NGHTTP2_NO_ERROR` (`0`) 之外的任何值，则也会触发 `'error'` 事件。

#### 事件: `'error'` {#event-error_1}

**新增于: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当在处理 `Http2Stream` 期间发生错误时，会触发 `'error'` 事件。


#### 事件: `'frameError'` {#event-frameerror_1}

**新增于: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 帧类型。
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 错误码。
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 流 ID (如果帧与流无关，则为 `0`)。

当尝试发送帧时发生错误时，会触发 `'frameError'` 事件。 调用时，处理函数将收到一个整数参数，用于标识帧类型，以及一个整数参数，用于标识错误代码。 在发出 `'frameError'` 事件后，`Http2Stream` 实例将立即销毁。

#### 事件: `'ready'` {#event-ready}

**新增于: v8.4.0**

当 `Http2Stream` 被打开，被分配一个 `id`，并且可以使用时，会触发 `'ready'` 事件。 监听器不期望任何参数。

#### 事件: `'timeout'` {#event-timeout_1}

**新增于: v8.4.0**

当在此 `Http2Stream` 中，在通过 `http2stream.setTimeout()` 设置的毫秒数内未收到任何活动时，将触发 `'timeout'` 事件。 它的监听器不期望任何参数。

#### 事件: `'trailers'` {#event-trailers}

**新增于: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object) 描述标头的对象
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 关联的数字标志

当收到与尾部标头字段关联的标头块时，会触发 `'trailers'` 事件。 监听器回调会传递与标头关联的 [HTTP/2 Headers 对象](/zh/nodejs/api/http2#headers-object) 和标志。

如果在接收到尾部之前调用 `http2stream.end()`，并且传入的数据没有被读取或监听，则可能不会触发此事件。

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### 事件: `'wantTrailers'` {#event-wanttrailers}

**添加于: v10.0.0**

当 `Http2Stream` 将要发送的最终 `DATA` 帧排队到帧上，并且 `Http2Stream` 准备好发送尾部标头时，会触发 `'wantTrailers'` 事件。当发起请求或响应时，必须设置 `waitForTrailers` 选项，才能触发此事件。

#### `http2stream.aborted` {#http2streamaborted}

**添加于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `Http2Stream` 实例被异常中止，则设置为 `true`。 设置后，将已触发 `'aborted'` 事件。

#### `http2stream.bufferSize` {#http2streambuffersize}

**添加于: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性显示当前缓冲的要写入的字符数。 有关详细信息，请参见 [`net.Socket.bufferSize`](/zh/nodejs/api/net#socketbuffersize)。

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 如果传递无效的回调到 `callback` 参数，则会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 标识错误码的无符号 32 位整数。 **默认:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`)。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 可选函数，用于注册监听 `'close'` 事件。

通过向连接的 HTTP/2 对等方发送 `RST_STREAM` 帧来关闭 `Http2Stream` 实例。

#### `http2stream.closed` {#http2streamclosed}

**添加于: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `Http2Stream` 实例已关闭，则设置为 `true`。

#### `http2stream.destroyed` {#http2streamdestroyed}

**添加于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `Http2Stream` 实例已被销毁且不再可用，则设置为 `true`。


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**加入于: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果接收到的请求或响应 HEADERS 帧中设置了 `END_STREAM` 标志，则设置为 `true`，表示不应接收其他数据，并且 `Http2Stream` 的可读端将被关闭。

#### `http2stream.id` {#http2streamid}

**加入于: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

此 `Http2Stream` 实例的数字流标识符。 如果尚未分配流标识符，则设置为 `undefined`。

#### `http2stream.pending` {#http2streampending}

**加入于: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果尚未为此 `Http2Stream` 实例分配数字流标识符，则设置为 `true`。

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**加入于: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 并且 `parent` 标识父流时，此流成为父流的唯一直接依赖项，所有其他现有依赖项都成为此流的依赖项。 **默认值:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定此流所依赖的流的数字标识符。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定流相对于具有相同 `parent` 的其他流的相对依赖性。 该值是介于 `1` 和 `256`（包括）之间的数字。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，在本地更改优先级，而不向连接的对等方发送 `PRIORITY` 帧。

更新此 `Http2Stream` 实例的优先级。


#### `http2stream.rstCode` {#http2streamrstcode}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

设置为 `RST_STREAM` [错误码](/zh/nodejs/api/http2#rst_stream-and-goaway-的错误码)，该错误码在 `Http2Stream` 因从连接的对等方接收到 `RST_STREAM` 帧、调用 `http2stream.close()` 或 `http2stream.destroy()` 后被销毁时报告。 如果 `Http2Stream` 尚未关闭，则为 `undefined`。

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Added in: v9.5.0**

- [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object)

一个对象，包含为此 `Http2Stream` 发送的出站标头。

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Added in: v9.5.0**

- [\<HTTP/2 Headers Object[]\>](/zh/nodejs/api/http2#headers-object)

一个对象数组，包含为此 `Http2Stream` 发送的出站信息性（附加）标头。

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Added in: v9.5.0**

- [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object)

一个对象，包含为此 `HttpStream` 发送的出站尾部。

#### `http2stream.session` {#http2streamsession}

**Added in: v8.4.0**

- [\<Http2Session\>](/zh/nodejs/api/http2#class-http2session)

对拥有此 `Http2Stream` 的 `Http2Session` 实例的引用。 在 `Http2Stream` 实例被销毁后，该值将为 `undefined`。

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// 如果 5 秒后没有活动，则取消流
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// 如果 5 秒后没有活动，则取消流
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**添加于: v8.4.0**

提供有关 `Http2Stream` 当前状态的各种信息。

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 连接的对等方可以为此 `Http2Stream` 发送的字节数，而无需接收 `WINDOW_UPDATE`。
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个标志，指示由 `nghttp2` 确定的 `Http2Stream` 的底层当前状态。
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果此 `Http2Stream` 已在本地关闭，则为 `1`。
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果此 `Http2Stream` 已被远程关闭，则为 `1`。
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 所有依赖于此 `Http2Stream` 的 `Http2Stream` 实例的权重之和，如使用 `PRIORITY` 帧指定。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 此 `Http2Stream` 的优先级权重。

此 `Http2Stream` 的当前状态。

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**添加于: v10.0.0**

- `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object)

向连接的 HTTP/2 对等方发送尾部的 `HEADERS` 帧。 此方法将导致 `Http2Stream` 立即关闭，并且必须仅在发出 `'wantTrailers'` 事件之后调用。 发送请求或发送响应时，必须设置 `options.waitForTrailers` 选项，以便在最终 `DATA` 帧之后保持 `Http2Stream` 打开，以便可以发送 trailers。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

HTTP/1 规范禁止 trailers 包含 HTTP/2 伪头字段（例如 `':method'`、`':path'` 等）。


### 类: `ClientHttp2Stream` {#class-clienthttp2stream}

**新增于: v8.4.0**

- 继承自 [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream)

`ClientHttp2Stream` 类是 `Http2Stream` 的扩展，专门用于 HTTP/2 客户端。客户端上的 `Http2Stream` 实例提供诸如 `'response'` 和 `'push'` 之类的事件，这些事件仅与客户端相关。

#### 事件: `'continue'` {#event-continue}

**新增于: v8.5.0**

当服务器发送 `100 Continue` 状态时触发，通常是因为请求包含 `Expect: 100-continue`。 这指示客户端应发送请求主体。

#### 事件: `'headers'` {#event-headers}

**新增于: v8.4.0**

- `headers` [\<HTTP/2 头部对象\>](/zh/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当接收到流的附加头部块时，例如当接收到 `1xx` 信息头部块时，会触发 `'headers'` 事件。 监听器回调传递 [HTTP/2 头部对象](/zh/nodejs/api/http2#headers-object) 和与头部关联的标志。

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### 事件: `'push'` {#event-push}

**新增于: v8.4.0**

- `headers` [\<HTTP/2 头部对象\>](/zh/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当接收到服务器推送流的响应头部时，会触发 `'push'` 事件。 监听器回调传递 [HTTP/2 头部对象](/zh/nodejs/api/http2#headers-object) 和与头部关联的标志。

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### 事件: `'response'` {#event-response}

**新增于: v8.4.0**

- `headers` [\<HTTP/2 头部对象\>](/zh/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当从连接的 HTTP/2 服务器接收到此流的响应 `HEADERS` 帧时，会触发 `'response'` 事件。 使用两个参数调用监听器：包含接收到的 [HTTP/2 头部对象](/zh/nodejs/api/http2#headers-object) 的 `Object` 和与头部关联的标志。



::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### 类: `ServerHttp2Stream` {#class-serverhttp2stream}

**添加于: v8.4.0**

- 继承自: [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream)

`ServerHttp2Stream` 类是 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 的一个扩展，专门用于 HTTP/2 服务器。 服务器上的 `Http2Stream` 实例提供了额外的方法，例如 `http2stream.pushStream()` 和 `http2stream.respond()`，这些方法仅在服务器上相关。

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**添加于: v8.4.0**

- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object)

向连接的 HTTP/2 对等方发送一个额外的 `HEADERS` 信息帧。

#### `http2stream.headersSent` {#http2streamheaderssent}

**添加于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果已发送标头，则为 true，否则为 false（只读）。

#### `http2stream.pushAllowed` {#http2streampushallowed}

**添加于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

只读属性，映射到远程客户端最新 `SETTINGS` 帧的 `SETTINGS_ENABLE_PUSH` 标志。 如果远程对等方接受推送流，则为 `true`，否则为 `false`。 同一个 `Http2Session` 中的每个 `Http2Stream` 的设置都相同。

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 且 `parent` 标识父流时，创建的流将成为父流的唯一直接依赖项，所有其他现有的依赖项都将成为新创建的流的依赖项。 **默认值:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定新创建的流所依赖的流的数字标识符。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一旦启动推送流，就会调用该回调。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/zh/nodejs/api/http2#class-serverhttp2stream) 返回的 `pushStream` 对象。
    - `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object) 启动 `pushStream` 时使用的标头对象。

启动一个推送流。 调用回调时，会将为推送流创建的新的 `Http2Stream` 实例作为第二个参数传递，或者将一个 `Error` 作为第一个参数传递。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

不允许在 `HEADERS` 帧中设置推送流的权重。 将 `weight` 值传递给 `http2stream.priority`，并将 `silent` 选项设置为 `true`，以启用并发流之间的服务器端带宽平衡。

不允许从推送流中调用 `http2stream.pushStream()`，否则会引发错误。


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 允许显式设置日期标头。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置为 `true` 以表明响应将不包含有效负载数据。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Http2Stream` 将在发送完最终 `DATA` 帧后发出 `'wantTrailers'` 事件。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

启动一个响应。 当 `options.waitForTrailers` 选项被设置时，`'wantTrailers'` 事件会在最后一个有效负载数据块被加入发送队列后立即发出。 `http2stream.sendTrailers()` 方法随后可用于将尾部标头字段发送给对等方。

当 `options.waitForTrailers` 被设置时，`Http2Stream` 不会在最终的 `DATA` 帧被传输时自动关闭。 用户代码必须调用 `http2stream.sendTrailers()` 或 `http2stream.close()` 来关闭 `Http2Stream`。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 允许显式设置日期标头。 |
| v12.12.0 | `fd` 选项现在可以是 `FileHandle`。 |
| v10.0.0 | 现在支持任何可读的文件描述符，不一定用于常规文件。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle) 一个可读的文件描述符。
- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Http2Stream` 将在发送完最终的 `DATA` 帧后触发 `'wantTrailers'` 事件。
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取的偏移位置。
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从 fd 发送的数据量。

启动一个响应，其数据从给定的文件描述符读取。 不会对给定的文件描述符执行验证。 如果在使用文件描述符尝试读取数据时发生错误，则 `Http2Stream` 将使用标准的 `INTERNAL_ERROR` 代码使用 `RST_STREAM` 帧关闭。

使用时，`Http2Stream` 对象的 `Duplex` 接口将自动关闭。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

可以指定可选的 `options.statCheck` 函数，以便用户代码有机会根据给定 fd 的 `fs.Stat` 详细信息设置其他内容标头。 如果提供了 `statCheck` 函数，则 `http2stream.respondWithFD()` 方法将执行 `fs.fstat()` 调用以收集有关提供的文件描述符的详细信息。

`offset` 和 `length` 选项可用于将响应限制为特定的范围子集。 例如，这可用于支持 HTTP Range 请求。

文件描述符或 `FileHandle` 在流关闭时不会关闭，因此一旦不再需要它，就需要手动关闭它。 不支持同时将同一个文件描述符用于多个流，并且可能导致数据丢失。 支持在流完成后重新使用文件描述符。

当设置了 `options.waitForTrailers` 选项时，`'wantTrailers'` 事件将在对要发送的有效负载数据的最后一个块进行排队后立即发出。 然后可以使用 `http2stream.sendTrailers()` 方法将尾部标头字段发送到对等方。

当设置了 `options.waitForTrailers` 时，`Http2Stream` 不会在传输最终的 `DATA` 帧时自动关闭。 用户代码*必须*调用 `http2stream.sendTrailers()` 或 `http2stream.close()` 来关闭 `Http2Stream`。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 允许显式设置日期标头。 |
| v10.0.0 | 现在支持任何可读文件，不一定是常规文件。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在发送前发生错误时调用的回调函数。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Http2Stream` 将在发送完最终的 `DATA` 帧后发出 `'wantTrailers'` 事件。
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取的偏移位置。
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从 fd 发送的数据量。

将常规文件作为响应发送。 `path` 必须指定一个常规文件，否则将在 `Http2Stream` 对象上发出一个 `'error'` 事件。

使用后，`Http2Stream` 对象的 `Duplex` 接口将自动关闭。

可以指定可选的 `options.statCheck` 函数，以允许用户代码根据给定文件的 `fs.Stat` 详细信息设置其他内容标头：

如果在尝试读取文件数据时发生错误，则 `Http2Stream` 将使用标准的 `INTERNAL_ERROR` 代码，使用 `RST_STREAM` 帧关闭。 如果定义了 `onError` 回调，则将调用它。 否则，流将被销毁。

使用文件路径的示例：

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // 如果流已被另一方销毁，stream.respond() 可能会抛出异常。
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 执行实际的错误处理。
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // 如果流已被另一方销毁，stream.respond() 可能会抛出异常。
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 执行实际的错误处理。
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

`options.statCheck` 函数也可以通过返回 `false` 来取消发送操作。 例如，有条件的请求可以检查 stat 结果以确定文件是否已被修改，从而返回适当的 `304` 响应：

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // 在此处检查 stat...
    stream.respond({ ':status': 304 });
    return false; // 取消发送操作
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // 在此处检查 stat...
    stream.respond({ ':status': 304 });
    return false; // 取消发送操作
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

`content-length` 标头字段将自动设置。

`offset` 和 `length` 选项可用于将响应限制为特定的范围子集。 例如，这可用于支持 HTTP Range 请求。

`options.onError` 函数也可用于处理在启动文件传送之前可能发生的所有错误。 默认行为是销毁流。

当设置了 `options.waitForTrailers` 选项时，将在对要发送的最后一个有效负载数据块进行排队后立即发出 `'wantTrailers'` 事件。 然后可以使用 `http2stream.sendTrailers()` 方法将尾部标头字段发送到对等方。

设置 `options.waitForTrailers` 后，`Http2Stream` 不会在传输最终 `DATA` 帧时自动关闭。 用户代码必须调用 `http2stream.sendTrailers()` 或 `http2stream.close()` 才能关闭 `Http2Stream`。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### 类: `Http2Server` {#class-http2server}

**添加于: v8.4.0**

- 继承: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

`Http2Server` 的实例通过 `http2.createServer()` 函数创建。`Http2Server` 类不是直接由 `node:http2` 模块导出的。

#### 事件: `'checkContinue'` {#event-checkcontinue}

**添加于: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

如果注册了 [`'request'`](/zh/nodejs/api/http2#event-request) 监听器，或者 [`http2.createServer()`](/zh/nodejs/api/http2#http2createserveroptions-onrequesthandler) 提供了回调函数，则每次收到带有 HTTP `Expect: 100-continue` 的请求时，都会触发 `'checkContinue'` 事件。 如果没有监听此事件，服务器将自动响应状态 `100 Continue` (如果适用)。

处理此事件包括在客户端应继续发送请求体时调用 [`response.writeContinue()`](/zh/nodejs/api/http2#responsewritecontinue)，或者在客户端不应继续发送请求体时生成适当的 HTTP 响应（例如 400 Bad Request）。

当触发并处理此事件时，将不会触发 [`'request'`](/zh/nodejs/api/http2#event-request) 事件。

#### 事件: `'connection'` {#event-connection}

**添加于: v8.4.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

当建立新的 TCP 流时，会触发此事件。`socket` 通常是类型为 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的对象。 通常，用户不希望访问此事件。

用户也可以显式地触发此事件，以将连接注入到 HTTP 服务器中。 在这种情况下，可以传递任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。

#### 事件: `'request'` {#event-request}

**添加于: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

每次有请求时都会触发。 每个会话可能有多个请求。 请参阅 [兼容性 API](/zh/nodejs/api/http2#compatibility-api)。


#### 事件: `'session'` {#event-session}

**添加于: v8.4.0**

- `session` [\<ServerHttp2Session\>](/zh/nodejs/api/http2#class-serverhttp2session)

当 `Http2Server` 创建一个新的 `Http2Session` 时，会触发 `'session'` 事件。

#### 事件: `'sessionError'` {#event-sessionerror}

**添加于: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/zh/nodejs/api/http2#class-serverhttp2session)

当与 `Http2Server` 关联的 `Http2Session` 对象触发 `'error'` 事件时，会触发 `'sessionError'` 事件。

#### 事件: `'stream'` {#event-stream_1}

**添加于: v8.4.0**

- `stream` [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream) 对流的引用
- `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object) 描述标头的对象
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 关联的数值标志
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含原始标头名称及其对应值的数组。

当与服务器关联的 `Http2Session` 触发 `'stream'` 事件时，会触发 `'stream'` 事件。

另请参阅 [`Http2Session` 的 `'stream'` 事件](/zh/nodejs/api/http2#event-stream)。

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### 事件: `'timeout'` {#event-timeout_2}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 默认超时时间从 120 秒更改为 0（无超时）。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

当 Server 在使用 `http2server.setTimeout()` 设置的给定毫秒数内没有活动时，会触发 `'timeout'` 事件。**默认值:** 0（无超时）

#### `server.close([callback])` {#serverclosecallback}

**添加于: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

停止服务器建立新会话。 这不会阻止由于 HTTP/2 会话的持久性而创建新的请求流。 要优雅地关闭服务器，请在所有活动会话上调用 [`http2session.close()`](/zh/nodejs/api/http2#http2sessionclosecallback)。

如果提供了 `callback`，则只有在所有活动会话都已关闭后才会调用它，即使服务器已经停止允许新会话。 有关更多详细信息，请参见 [`net.Server.close()`](/zh/nodejs/api/net#serverclosecallback)。

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**添加于: v20.4.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

调用 [`server.close()`](/zh/nodejs/api/http2#serverclosecallback) 并返回一个 promise，该 promise 在服务器关闭时兑现。

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v13.0.0 | 默认超时时间从 120 秒更改为 0（无超时）。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** 0（无超时）
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<Http2Server\>](/zh/nodejs/api/http2#class-http2server)

用于设置 http2 服务器请求的超时值，并设置一个回调函数，该函数在 `Http2Server` 在 `msecs` 毫秒后没有活动时被调用。

给定的回调被注册为 `'timeout'` 事件的监听器。

如果 `callback` 不是一个函数，将会抛出一个新的 `ERR_INVALID_ARG_TYPE` 错误。


#### `server.timeout` {#servertimeout}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 默认超时时间从 120 秒更改为 0（无超时）。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 超时时间，以毫秒为单位。**默认值:** 0（无超时）

套接字被认为超时之前的不活动毫秒数。

值为 `0` 将禁用传入连接上的超时行为。

套接字超时逻辑是在连接时设置的，因此更改此值只会影响服务器的新连接，而不会影响任何现有连接。

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**添加于: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

用于使用提供的设置更新服务器。

对于无效的 `settings` 值，抛出 `ERR_HTTP2_INVALID_SETTING_VALUE`。

对于无效的 `settings` 参数，抛出 `ERR_INVALID_ARG_TYPE`。

### 类: `Http2SecureServer` {#class-http2secureserver}

**添加于: v8.4.0**

- 继承自: [\<tls.Server\>](/zh/nodejs/api/tls#class-tlsserver)

`Http2SecureServer` 的实例是使用 `http2.createSecureServer()` 函数创建的。 `Http2SecureServer` 类不由 `node:http2` 模块直接导出。

#### 事件: `'checkContinue'` {#event-checkcontinue_1}

**添加于: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

如果注册了 [`'request'`](/zh/nodejs/api/http2#event-request) 监听器，或者 [`http2.createSecureServer()`](/zh/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) 提供了回调函数，则每次收到带有 HTTP `Expect: 100-continue` 的请求时，都会发出 `'checkContinue'` 事件。 如果未侦听此事件，服务器将自动响应状态 `100 Continue`。

处理此事件包括在客户端应继续发送请求正文时调用 [`response.writeContinue()`](/zh/nodejs/api/http2#responsewritecontinue)，或者在客户端不应继续发送请求正文时生成适当的 HTTP 响应（例如 400 Bad Request）。

当发出并处理此事件时，将不会发出 [`'request'`](/zh/nodejs/api/http2#event-request) 事件。


#### Event: `'connection'` {#event-connection_1}

**Added in: v8.4.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

当建立新的 TCP 流，且 TLS 握手开始之前，会触发该事件。 `socket` 通常是 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 类型的对象。 通常用户不会想要访问此事件。

用户也可以显式地触发此事件，以将连接注入到 HTTP 服务器中。 在这种情况下，可以传递任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。

#### Event: `'request'` {#event-request_1}

**Added in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

每次有请求时都会触发。 每个会话可能存在多个请求。 参阅 [兼容性 API](/zh/nodejs/api/http2#compatibility-api)。

#### Event: `'session'` {#event-session_1}

**Added in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/zh/nodejs/api/http2#class-serverhttp2session)

当 `Http2SecureServer` 创建新的 `Http2Session` 时，会触发 `'session'` 事件。

#### Event: `'sessionError'` {#event-sessionerror_1}

**Added in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/zh/nodejs/api/http2#class-serverhttp2session)

当与 `Http2SecureServer` 关联的 `Http2Session` 对象触发 `'error'` 事件时，会触发 `'sessionError'` 事件。

#### Event: `'stream'` {#event-stream_2}

**Added in: v8.4.0**

- `stream` [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream) 流的引用
- `headers` [\<HTTP/2 Headers Object\>](/zh/nodejs/api/http2#headers-object) 描述标头的对象
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 关联的数字标志
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 包含原始标头名称及其各自值的数组。

当与服务器关联的 `Http2Session` 触发 `'stream'` 事件时，会触发 `'stream'` 事件。

另请参阅 [`Http2Session` 的 `'stream'` 事件](/zh/nodejs/api/http2#event-stream)。

::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### 事件: `'timeout'` {#event-timeout_3}

**新增于: v8.4.0**

当 Server 在使用 `http2secureServer.setTimeout()` 设置的给定毫秒数内没有活动时，会触发 `'timeout'` 事件。**默认值:** 2 分钟。

#### 事件: `'unknownProtocol'` {#event-unknownprotocol}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 只有当客户端在 TLS 握手期间没有传输 ALPN 扩展时，才会触发此事件。 |
| v8.4.0 | 新增于: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

当连接的客户端未能协商允许的协议（即 HTTP/2 或 HTTP/1.1）时，会触发 `'unknownProtocol'` 事件。 事件处理程序接收套接字以进行处理。 如果没有为此事件注册监听器，则连接将终止。 可以使用传递给 [`http2.createSecureServer()`](/zh/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) 的 `'unknownProtocolTimeout'` 选项指定超时。

在早期版本的 Node.js 中，如果 `allowHTTP1` 为 `false`，并且在 TLS 握手期间，客户端既没有发送 ALPN 扩展，也没有发送包含 HTTP/2 (`h2`) 的 ALPN 扩展，则会触发此事件。 较新版本的 Node.js 仅在 `allowHTTP1` 为 `false` 且客户端未发送 ALPN 扩展时才触发此事件。 如果客户端发送的 ALPN 扩展不包含 HTTP/2（如果 `allowHTTP1` 为 `true`，则不包含 HTTP/1.1），则 TLS 握手将失败，并且不会建立安全连接。

参见 [兼容性 API](/zh/nodejs/api/http2#compatibility-api)。

#### `server.close([callback])` {#serverclosecallback_1}

**新增于: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

停止服务器建立新的会话。 这不会阻止由于 HTTP/2 会话的持久性而创建新的请求流。 要正常关闭服务器，请对所有活动会话调用 [`http2session.close()`](/zh/nodejs/api/http2#http2sessionclosecallback)。

如果提供了 `callback`，则直到所有活动会话都已关闭后才会调用它，尽管服务器已经停止允许新会话。 有关更多详细信息，请参阅 [`tls.Server.close()`](/zh/nodejs/api/tls#serverclosecallback)。


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 错误，而不是 `ERR_INVALID_CALLBACK` 错误。 |
| v8.4.0 | 添加于：v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值：** `120000` (2 分钟)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回值：[\<Http2SecureServer\>](/zh/nodejs/api/http2#class-http2secureserver)

用于设置 http2 安全服务器请求的超时值，并设置一个回调函数，该函数在 `Http2SecureServer` 上在 `msecs` 毫秒后没有活动时调用。

给定的回调注册为 `'timeout'` 事件的监听器。

如果 `callback` 不是一个函数，将会抛出一个新的 `ERR_INVALID_ARG_TYPE` 错误。

#### `server.timeout` {#servertimeout_1}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v13.0.0 | 默认超时时间从 120 秒更改为 0（无超时）。 |
| v8.4.0 | 添加于：v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 超时时间，以毫秒为单位。 **默认值：** 0 (无超时)

在假定套接字超时之前的不活动毫秒数。

值为 `0` 将禁用传入连接的超时行为。

套接字超时逻辑是在连接时设置的，因此更改此值只会影响服务器的新连接，而不会影响任何现有连接。

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**添加于：v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

用于使用提供的设置更新服务器。

对于无效的 `settings` 值，抛出 `ERR_HTTP2_INVALID_SETTING_VALUE`。

对于无效的 `settings` 参数，抛出 `ERR_INVALID_ARG_TYPE`。

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v23.0.0 | 添加了 `streamResetBurst` 和 `streamResetRate`。 |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` 已等同于提供 `PADDING_STRATEGY_ALIGNED`，并且已删除 `selectPadding`。 |
| v13.3.0, v12.16.0 | 添加了 `maxSessionRejectedStreams` 选项，默认值为 100。 |
| v13.3.0, v12.16.0 | 添加了 `maxSessionInvalidFrames` 选项，默认值为 1000。 |
| v12.4.0 | `options` 参数现在支持 `net.createServer()` 选项。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 添加了 `unknownProtocolTimeout` 选项，默认值为 10000。 |
| v14.4.0, v12.18.0, v10.21.0 | 添加了 `maxSettings` 选项，默认值为 32。 |
| v9.6.0 | 添加了 `Http1IncomingMessage` 和 `Http1ServerResponse` 选项。 |
| v8.9.3 | 添加了 `maxOutstandingPings` 选项，默认限制为 10。 |
| v8.9.3 | 添加了 `maxHeaderListPairs` 选项，默认限制为 128 个标头对。 |
| v8.4.0 | 添加于：v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置用于缩小标头字段的最大动态表大小。 **默认值：** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置每个 `SETTINGS` 帧的最大设置条目数。 允许的最小值为 `1`。 **默认值：** `32`。
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 `Http2Session` 允许使用的最大内存。 该值以兆字节数表示，例如 `1` 等于 1 兆字节。 允许的最小值为 `1`。 这是一个基于信用的限制，现有的 `Http2Stream` 可能会导致超过此限制，但在超过此限制时，将拒绝新的 `Http2Stream` 实例。 当前 `Http2Stream` 会话数、标头压缩表的当前内存使用量、当前排队等待发送的数据以及未确认的 `PING` 和 `SETTINGS` 帧都计入当前限制。 **默认值：** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置标头条目的最大数量。 这类似于 `node:http` 模块中的 [`server.maxHeadersCount`](/zh/nodejs/api/http#servermaxheaderscount) 或 [`request.maxHeadersCount`](/zh/nodejs/api/http#requestmaxheaderscount)。 最小值为 `4`。 **默认值：** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置未完成的、未确认的 ping 的最大数量。 **默认值：** `10`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置序列化压缩标头块的最大允许大小。 尝试发送超过此限制的标头将导致发出 `'frameError'` 事件，并关闭和销毁流。 虽然这会将整个标头块的最大允许大小设置为 `nghttp2`（内部 http2 库）对每个解压缩的键/值对的限制为 `65536`。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于确定用于 `HEADERS` 和 `DATA` 帧的填充量的策略。 **默认值：** `http2.constants.PADDING_STRATEGY_NONE`。 值可以是以下之一：
    - `http2.constants.PADDING_STRATEGY_NONE`：不应用任何填充。
    - `http2.constants.PADDING_STRATEGY_MAX`：应用内部实现确定的最大填充量。
    - `http2.constants.PADDING_STRATEGY_ALIGNED`：尝试应用足够的填充以确保总帧长度（包括 9 字节标头）是 8 的倍数。 对于每个帧，都有一个最大允许的填充字节数，该填充字节数由当前流量控制状态和设置确定。 如果此最大值小于确保对齐所需的计算量，则使用最大值，并且总帧长度不一定与 8 字节对齐。

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置远程对等方的最大并发流数，就像已收到 `SETTINGS` 帧一样。 如果远程对等方设置了自己的 `maxConcurrentStreams` 值，则将被覆盖。 **默认值：** `100`。
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置在关闭会话之前将容忍的最大无效帧数。 **默认值：** `1000`。
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置在关闭会话之前将容忍的在创建时被拒绝的最大流数。 每个拒绝都与 `NGHTTP2_ENHANCE_YOUR_CALM` 错误相关联，该错误应告知对等方不要打开更多流，因此继续打开流被认为是行为不端的对等方的标志。 **默认值：** `100`。
    - `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object) 连接时要发送到远程对等方的初始设置。
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 和 `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置传入流重置 (RST_STREAM 帧) 的速率限制。 必须同时设置这两个设置才能生效，默认值分别为 1000 和 33。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数值数组确定设置类型，这些设置类型包含在接收到的 remoteSettings 的 `CustomSettings` 属性中。 有关允许的设置类型的更多信息，请参阅 `Http2Settings` 对象的 `CustomSettings` 属性。
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage) 指定用于 HTTP/1 回退的 `IncomingMessage` 类。 用于扩展原始 `http.IncomingMessage` 非常有用。 **默认值：** `http.IncomingMessage`。
    - `Http1ServerResponse` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse) 指定用于 HTTP/1 回退的 `ServerResponse` 类。 用于扩展原始 `http.ServerResponse` 非常有用。 **默认值：** `http.ServerResponse`。
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest) 指定要使用的 `Http2ServerRequest` 类。 用于扩展原始 `Http2ServerRequest` 非常有用。 **默认值：** `Http2ServerRequest`。
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse) 指定要使用的 `Http2ServerResponse` 类。 用于扩展原始 `Http2ServerResponse` 非常有用。 **默认值：** `Http2ServerResponse`。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定服务器在发出 [`'unknownProtocol'`](/zh/nodejs/api/http2#event-unknownprotocol) 时应等待的超时时间（以毫秒为单位）。 如果在该时间之前未销毁套接字，则服务器将销毁它。 **默认值：** `10000`。
    - ...：可以提供任何 [`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener) 选项。

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 请参阅 [兼容性 API](/zh/nodejs/api/http2#compatibility-api)
- 返回值：[\<Http2Server\>](/zh/nodejs/api/http2#class-http2server)

返回一个 `net.Server` 实例，该实例创建和管理 `Http2Session` 实例。

由于已知没有浏览器支持 [未加密的 HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption)，因此在与浏览器客户端通信时，必须使用 [`http2.createSecureServer()`](/zh/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 创建一个未加密的 HTTP/2 服务器。
// 由于已知没有浏览器支持
// 未加密的 HTTP/2，因此与浏览器客户端通信时，
// 必须使用 `createSecureServer()`。
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 创建一个未加密的 HTTP/2 服务器。
// 由于已知没有浏览器支持
// 未加密的 HTTP/2，因此与浏览器客户端通信时，
// 必须使用 `http2.createSecureServer()`。
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` 已等同于提供 `PADDING_STRATEGY_ALIGNED`，并且移除了 `selectPadding`。 |
| v13.3.0, v12.16.0 | 添加了 `maxSessionRejectedStreams` 选项，默认值为 100。 |
| v13.3.0, v12.16.0 | 添加了 `maxSessionInvalidFrames` 选项，默认值为 1000。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 添加了 `unknownProtocolTimeout` 选项，默认值为 10000。 |
| v14.4.0, v12.18.0, v10.21.0 | 添加了 `maxSettings` 选项，默认值为 32。 |
| v10.12.0 | 添加了 `origins` 选项，以便在 `Http2Session` 启动时自动发送 `ORIGIN` 帧。 |
| v8.9.3 | 添加了 `maxOutstandingPings` 选项，默认限制为 10。 |
| v8.9.3 | 添加了 `maxHeaderListPairs` 选项，默认限制为 128 个 header 对。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当设置为 `true` 时，不支持 HTTP/2 的传入客户端连接将降级为 HTTP/1.x。 参见 [`'unknownProtocol'`](/zh/nodejs/api/http2#event-unknownprotocol) 事件。 参见 [ALPN 协商](/zh/nodejs/api/http2#alpn-negotiation)。 **默认:** `false`。
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置用于解压缩 header 字段的最大动态表大小。 **默认:** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置每个 `SETTINGS` 帧的最大设置条目数。 允许的最小值为 `1`。 **默认:** `32`。
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 `Http2Session` 允许使用的最大内存。 该值以兆字节数表示，例如 `1` 等于 1 兆字节。 允许的最小值为 `1`。 这是一个基于信用的限制，现有的 `Http2Stream` 可能会导致超出此限制，但是当超出此限制时，将拒绝新的 `Http2Stream` 实例。 当前的 `Http2Stream` 会话数，header 压缩表的当前内存使用量，当前排队要发送的数据以及未确认的 `PING` 和 `SETTINGS` 帧都计入当前限制。 **默认:** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 header 条目的最大数量。 这类似于 `node:http` 模块中的 [`server.maxHeadersCount`](/zh/nodejs/api/http#servermaxheaderscount) 或 [`request.maxHeadersCount`](/zh/nodejs/api/http#requestmaxheaderscount)。 最小值为 `4`。 **默认:** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置未完成的，未确认的 ping 的最大数量。 **默认:** `10`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置序列化，压缩的 header 块允许的最大大小。 尝试发送超过此限制的 header 将导致发出 `'frameError'` 事件，并且流将被关闭和销毁。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于确定 `HEADERS` 和 `DATA` 帧使用的填充量的策略。 **默认:** `http2.constants.PADDING_STRATEGY_NONE`。 该值可以是以下之一：
    - `http2.constants.PADDING_STRATEGY_NONE`: 不应用填充。
    - `http2.constants.PADDING_STRATEGY_MAX`: 应用由内部实现确定的最大填充量。
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 尝试应用足够的填充以确保总帧长度（包括 9 字节 header）是 8 的倍数。对于每个帧，填充字节的最大允许数量由当前流量控制状态和设置确定。如果此最大值小于确保对齐所需的计算量，则使用最大值，并且总帧长度不一定对齐到 8 个字节。
  
 
    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置远程对等方的最大并发流数，就像已收到 `SETTINGS` 帧一样。 如果远程对等方为其自身的 `maxConcurrentStreams` 设置了值，则将被覆盖。 **默认:** `100`。
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置在会话关闭之前将容忍的最大无效帧数。 **默认:** `1000`。
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置在会话关闭之前将容忍的最大拒绝创建的流数。 每个拒绝都与一个 `NGHTTP2_ENHANCE_YOUR_CALM` 错误相关联，该错误应该告诉对等方不要打开更多流，因此继续打开流被认为是行为不端的对等方的标志。 **默认:** `100`。
    - `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object) 连接时要发送到远程对等方的初始设置。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数值数组确定设置类型，这些设置类型包含在接收到的 remoteSettings 的 `customSettings` 属性中。 有关允许的设置类型的更多信息，请参见 `Http2Settings` 对象的 `customSettings` 属性。
    - ...: 可以提供任何 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 选项。 对于服务器，通常需要身份选项（`pfx` 或 `key` / `cert`）。
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个 origin 字符串数组，用于在新服务器 `Http2Session` 创建后立即在 `ORIGIN` 帧中发送。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定服务器在发出 [`'unknownProtocol'`](/zh/nodejs/api/http2#event-unknownprotocol) 事件时应等待的超时时间（以毫秒为单位）。 如果套接字在该时间之前未被销毁，则服务器将销毁它。 **默认:** `10000`。
  
 
- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 参见 [兼容性 API](/zh/nodejs/api/http2#compatibility-api)
- 返回: [\<Http2SecureServer\>](/zh/nodejs/api/http2#class-http2secureserver)

返回一个 `tls.Server` 实例，该实例创建并管理 `Http2Session` 实例。



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// 创建安全的 HTTP/2 服务器
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// 创建安全的 HTTP/2 服务器
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` 已等同于提供 `PADDING_STRATEGY_ALIGNED`，并且已移除 `selectPadding`。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 添加了 `unknownProtocolTimeout` 选项，默认值为 10000。 |
| v14.4.0, v12.18.0, v10.21.0 | 添加了 `maxSettings` 选项，默认值为 32。 |
| v8.9.3 | 添加了 `maxOutstandingPings` 选项，默认限制为 10。 |
| v8.9.3 | 添加了 `maxHeaderListPairs` 选项，默认限制为 128 个头部对。 |
| v8.4.0 | 在 v8.4.0 中添加。 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要连接的远程 HTTP/2 服务器。 这必须是最小有效 URL 的形式，带有 `http://` 或 `https://` 前缀、主机名和 IP 端口（如果使用非默认端口）。 URL 中的用户信息（用户 ID 和密码）、路径、查询字符串和片段详细信息将被忽略。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置用于压缩头部字段的最大动态表大小。 **默认值:** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置每个 `SETTINGS` 帧的最大设置条目数。 允许的最小值为 `1`。 **默认值:** `32`。
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置 `Http2Session` 允许使用的最大内存。 该值以兆字节为单位表示，例如 `1` 等于 1 兆字节。 允许的最小值为 `1`。 这是一个基于信用的限制，现有的 `Http2Stream` 可能会导致超过此限制，但是当超过此限制时，将拒绝新的 `Http2Stream` 实例。 当前 `Http2Stream` 会话数、头部压缩表的当前内存使用量、当前排队等待发送的数据以及未确认的 `PING` 和 `SETTINGS` 帧都计入当前限制。 **默认值:** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置头部条目的最大数量。 这类似于 `node:http` 模块中的 [`server.maxHeadersCount`](/zh/nodejs/api/http#servermaxheaderscount) 或 [`request.maxHeadersCount`](/zh/nodejs/api/http#requestmaxheaderscount)。 最小值为 `1`。 **默认值:** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置未完成的、未确认的 ping 的最大数量。 **默认值:** `10`。
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置客户端在任何给定时间将接受的最大保留推送流数。 一旦当前保留的推送流的数量超过此限制，服务器发送的新推送流将被自动拒绝。 允许的最小值为 0。 允许的最大值为 2-1。 负值将此选项设置为允许的最大值。 **默认值:** `200`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置序列化压缩的头部块允许的最大大小。 尝试发送超过此限制的头部将导致发出 `'frameError'` 事件，并且流将被关闭和销毁。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于确定 `HEADERS` 和 `DATA` 帧的填充量的策略。 **默认值:** `http2.constants.PADDING_STRATEGY_NONE`。 值可以是以下之一：
        - `http2.constants.PADDING_STRATEGY_NONE`: 不应用填充。
        - `http2.constants.PADDING_STRATEGY_MAX`: 应用由内部实现确定的最大填充量。
        - `http2.constants.PADDING_STRATEGY_ALIGNED`: 尝试应用足够的填充以确保包括 9 字节头部在内的总帧长度是 8 的倍数。 对于每个帧，都有一个最大允许的填充字节数，该字节数由当前流量控制状态和设置确定。 如果此最大值小于确保对齐所需的计算量，则使用最大值，并且总帧长度不一定对齐到 8 字节。


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置远程对等方的最大并发流数，如同已收到 `SETTINGS` 帧一样。 如果远程对等方为其自身的 `maxConcurrentStreams` 设置了值，则将被覆盖。 **默认值:** `100`。
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要连接的协议，如果未在 `authority` 中设置。 值可以是 `'http:'` 或 `'https:'`。 **默认值:** `'https:'`
    - `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object) 连接时要发送到远程对等方的初始设置。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数值数组确定设置类型，这些设置类型包含在接收到的 remoteSettings 的 `CustomSettings` 属性中。 请参阅 `Http2Settings` 对象的 `CustomSettings` 属性，以获取有关允许的设置类型的更多信息。
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个可选的回调函数，它接收传递给 `connect` 的 `URL` 实例和 `options` 对象，并返回任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流，该流将用作此会话的连接。
    - ...：可以提供任何 [`net.connect()`](/zh/nodejs/api/net#netconnect) 或 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 选项。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定服务器在发出 [`'unknownProtocol'`](/zh/nodejs/api/http2#event-unknownprotocol) 事件时应等待的超时时间（以毫秒为单位）。 如果套接字在该时间之前未被销毁，则服务器将销毁它。 **默认值:** `10000`。


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 将注册为 [`'connect'`](/zh/nodejs/api/http2#event-connect) 事件的单次监听器。
- 返回: [\<ClientHttp2Session\>](/zh/nodejs/api/http2#class-clienthttp2session)

返回一个 `ClientHttp2Session` 实例。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**加入于: v8.4.0**

#### `RST_STREAM` 和 `GOAWAY` 的错误代码 {#error-codes-for-rst_stream-and-goaway}

| 值 | 名称 | 常量 |
| --- | --- | --- |
| `0x00` | 无错误 | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | 协议错误 | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | 内部错误 | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | 流控制错误 | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | 设置超时 | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | 流已关闭 | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | 帧大小错误 | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | 拒绝流 | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | 取消 | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | 压缩错误 | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | 连接错误 | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | 缓和一下 | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | 安全不足 | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | 需要 HTTP/1.1 | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
当 `Server` 在使用 `http2server.setTimeout()` 设置的给定毫秒数内没有活动时，会触发 `'timeout'` 事件。

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**加入于: v8.4.0**

- 返回: [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

返回一个包含 `Http2Session` 实例的默认设置的对象。 此方法每次调用时都会返回一个新的对象实例，因此返回的实例可以安全地修改以供使用。

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**加入于: v8.4.0**

- `settings` [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回一个 `Buffer` 实例，其中包含给定 HTTP/2 设置的序列化表示，如 [HTTP/2](https://tools.ietf.org/html/rfc7540) 规范中所指定。 这旨在与 `HTTP2-Settings` 标头字段一起使用。

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**新增于: v8.4.0**

- `buf` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 已打包的设置。
- 返回: [\<HTTP/2 设置对象\>](/zh/nodejs/api/http2#settings-object)

返回一个 [HTTP/2 设置对象](/zh/nodejs/api/http2#settings-object)，其中包含从给定的 `Buffer` 反序列化的设置，该 `Buffer` 由 `http2.getPackedSettings()` 生成。

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**新增于: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: 可以提供任何 [`http2.createServer()`](/zh/nodejs/api/http2#http2createserveroptions-onrequesthandler) 选项。
  
 
- 返回: [\<ServerHttp2Session\>](/zh/nodejs/api/http2#class-serverhttp2session)

从现有套接字创建 HTTP/2 服务器会话。

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**新增于: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

此符号可以设置为 HTTP/2 标头对象上的属性，并带有数组值，以提供被认为是敏感的标头列表。 有关更多详细信息，请参见 [敏感标头](/zh/nodejs/api/http2#sensitive-headers)。

### 标头对象 {#headers-object}

标头表示为 JavaScript 对象上的自有属性。 属性键将被序列化为小写。 属性值应该是字符串（如果不是字符串，则将被强制转换为字符串）或字符串的 `Array`（以便为每个标头字段发送多个值）。

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
传递给回调函数的标头对象将具有 `null` 原型。 这意味着普通的 JavaScript 对象方法（例如 `Object.prototype.toString()` 和 `Object.prototype.hasOwnProperty()`）将不起作用。

对于传入标头：

- `:status` 标头将转换为 `number`。
- `:status`、`:method`、`:authority`、`:scheme`、`:path`、`:protocol`、`age`、`authorization`、`access-control-allow-credentials`、`access-control-max-age`、`access-control-request-method`、`content-encoding`、`content-language`、`content-length`、`content-location`、`content-md5`、`content-range`、`content-type`、`date`、`dnt`、`etag`、`expires`、`from`、`host`、`if-match`、`if-modified-since`、`if-none-match`、`if-range`、`if-unmodified-since`、`last-modified`、`location`、`max-forwards`、`proxy-authorization`、`range`、`referer`、`retry-after`、`tk`、`upgrade-insecure-requests`、`user-agent` 或 `x-content-type-options` 的重复项将被丢弃。
- `set-cookie` 始终是一个数组。 重复项将添加到数组中。
- 对于重复的 `cookie` 标头，这些值将使用 '; ' 连接在一起。
- 对于所有其他标头，这些值将使用 ', ' 连接在一起。



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### 敏感头部 {#sensitive-headers}

HTTP2 头部可以被标记为敏感，这意味着 HTTP/2 头部压缩算法永远不会对其进行索引。对于熵值较低且可能被攻击者认为有价值的头部值（例如 `Cookie` 或 `Authorization`）来说，这可能是有意义的。为了实现这一点，请将头部名称添加到 `[http2.sensitiveHeaders]` 属性中，作为一个数组：

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
对于某些头部，例如 `Authorization` 和短 `Cookie` 头部，此标志会自动设置。

此属性也为接收到的头部设置。它将包含所有标记为敏感的头部的名称，包括那些自动标记的头部。

### 设置对象 {#settings-object}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.12.0 | `maxConcurrentStreams` 设置更加严格。 |
| v8.9.3 | 现在严格执行 `maxHeaderListSize` 设置。 |
| v8.4.0 | 添加于：v8.4.0 |
:::

`http2.getDefaultSettings()`、`http2.getPackedSettings()`、`http2.createServer()`、`http2.createSecureServer()`、`http2session.settings()`、`http2session.localSettings` 和 `http2session.remoteSettings` API 要么返回，要么接收作为输入的对象，该对象定义了 `Http2Session` 对象的配置设置。这些对象是普通的 JavaScript 对象，包含以下属性。

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定用于头部压缩的最大字节数。允许的最小值为 0。允许的最大值为 2-1。**默认值：** `4096`。
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指定如果要在 `Http2Session` 实例上允许 HTTP/2 推送流，则为 `true`。**默认值：** `true`。
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定 *发送方* 用于流级别流量控制的初始窗口大小（以字节为单位）。允许的最小值为 0。允许的最大值为 2-1。**默认值：** `65535`。
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定最大帧有效载荷的大小（以字节为单位）。允许的最小值为 16,384。允许的最大值为 2-1。**默认值：** `16384`。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定 `Http2Session` 上允许的最大并发流数。没有默认值，这意味着，至少在理论上，在任何给定的时间，一个 `Http2Session` 中可能同时打开 2-1 个流。最小值为 0。允许的最大值为 2-1。**默认值：** `4294967295`。
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定将被接受的头部列表的最大大小（未压缩的八位字节）。允许的最小值为 0。允许的最大值为 2-1。**默认值：** `65535`。
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `maxHeaderListSize` 的别名。
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指定如果启用由 [RFC 8441](https://tools.ietf.org/html/rfc8441) 定义的“扩展连接协议”，则为 `true`。此设置仅在由服务器发送时才有意义。一旦为给定的 `Http2Session` 启用了 `enableConnectProtocol` 设置，就无法禁用它。**默认值：** `false`。
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 指定其他设置，但尚未在 node 和底层库中实现。对象的键定义了设置类型的数值（如 [RFC 7540] 建立的“HTTP/2 SETTINGS”注册表中定义的那样），值是设置的实际数值。设置类型必须是 1 到 2^16-1 范围内的整数。它不应该是 node 已经处理的设置类型，即目前它应该大于 6，虽然这不是一个错误。这些值需要是 0 到 2^32-1 范围内的无符号整数。目前，最多支持 10 个自定义设置。它仅支持发送 SETTINGS，或接收服务器或客户端对象的 `remoteCustomSettings` 选项中指定的设置值。如果某个设置在未来的 node 版本中得到原生支持，请不要将该设置 ID 的 `customSettings` 机制与本机处理的设置的接口混合使用。

设置对象上的所有其他属性都将被忽略。


### 错误处理 {#error-handling}

在使用 `node:http2` 模块时，可能会出现几种类型的错误情况：

验证错误发生在传入不正确的参数、选项或设置值时。这些错误总是通过同步 `throw` 报告。

状态错误发生在尝试在不正确的时间执行操作时（例如，在流关闭后尝试在流上发送数据）。这些错误将通过同步 `throw` 或通过 `Http2Stream`、`Http2Session` 或 HTTP/2 Server 对象上的 `'error'` 事件报告，具体取决于错误发生的位置和时间。

内部错误发生在 HTTP/2 会话意外失败时。这些错误将通过 `Http2Session` 或 HTTP/2 Server 对象上的 `'error'` 事件报告。

协议错误发生在违反各种 HTTP/2 协议约束时。这些错误将通过同步 `throw` 或通过 `Http2Stream`、`Http2Session` 或 HTTP/2 Server 对象上的 `'error'` 事件报告，具体取决于错误发生的位置和时间。

### 头部名称和值中的无效字符处理 {#invalid-character-handling-in-header-names-and-values}

与 HTTP/1 实现相比，HTTP/2 实现对 HTTP 头部名称和值中的无效字符的处理更为严格。

头部字段名称是*不区分大小写*的，并且严格作为小写字符串在线上传输。Node.js 提供的 API 允许将头部名称设置为大小写混合的字符串（例如 `Content-Type`），但会在传输时将这些字符串转换为小写（例如 `content-type`）。

头部字段名称*必须只*包含以下 ASCII 字符中的一个或多个：`a`-`z`、`A`-`Z`、`0`-`9`、`!`、`#`、`$`、`%`、`&`、`'`、`*`、`+`、`-`、`.`、`^`、`_`、`` ` `` (反引号)、`|` 和 `~`。

在 HTTP 头部字段名称中使用无效字符将导致流关闭，并报告协议错误。

头部字段值的处理方式更为宽松，但*不应*包含换行符或回车符，并且*应*限于 US-ASCII 字符，符合 HTTP 规范的要求。


### 在客户端推送流 {#push-streams-on-the-client}

要在客户端接收推送的流，请在 `ClientHttp2Session` 上设置 `'stream'` 事件的监听器：

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // 处理响应头
  });
  pushedStream.on('data', (chunk) => { /* 处理推送的数据 */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // 处理响应头
  });
  pushedStream.on('data', (chunk) => { /* 处理推送的数据 */ });
});

const req = client.request({ ':path': '/' });
```
:::

### 支持 `CONNECT` 方法 {#supporting-the-connect-method}

`CONNECT` 方法用于允许将 HTTP/2 服务器用作 TCP/IP 连接的代理。

一个简单的 TCP 服务器：

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

一个 HTTP/2 CONNECT 代理：

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // 只接受 CONNECT 请求
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // 验证主机名和端口是否是此代理应该连接到的内容，这是一个非常好的主意。
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // 只接受 CONNECT 请求
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // 验证主机名和端口是否是此代理应该连接到的内容，这是一个非常好的主意。
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

一个 HTTP/2 CONNECT 客户端：

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// 对于 CONNECT 请求，必须不指定“:path”和“:scheme”标头，否则将引发错误。
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// 对于 CONNECT 请求，必须不指定“:path”和“:scheme”标头，否则将引发错误。
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### 扩展的 `CONNECT` 协议 {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) 定义了 HTTP/2 的“扩展 CONNECT 协议”扩展，该扩展可用于引导使用 `CONNECT` 方法的 `Http2Stream` 作为其他通信协议（例如 WebSockets）的隧道。

HTTP/2 服务器通过使用 `enableConnectProtocol` 设置启用扩展 CONNECT 协议的使用：

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

一旦客户端收到来自服务器的 `SETTINGS` 帧，表明可以使用扩展的 CONNECT，它可能会发送使用 `':protocol'` HTTP/2 伪标头的 `CONNECT` 请求：

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## 兼容性 API {#compatibility-api}

兼容性 API 的目标是在使用 HTTP/2 时提供与 HTTP/1 类似的开发者体验，从而可以开发同时支持 [HTTP/1](/zh/nodejs/api/http) 和 HTTP/2 的应用程序。此 API 仅针对 [HTTP/1](/zh/nodejs/api/http) 的 **公共 API**。但是，许多模块使用内部方法或状态，由于它是完全不同的实现，因此*不支持*这些方法或状态。

以下示例使用兼容性 API 创建一个 HTTP/2 服务器：

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

为了创建一个混合的 [HTTPS](/zh/nodejs/api/https) 和 HTTP/2 服务器，请参考 [ALPN 协商](/zh/nodejs/api/http2#alpn-negotiation) 部分。不支持从非 tls HTTP/1 服务器升级。

HTTP/2 兼容性 API 由 [`Http2ServerRequest`](/zh/nodejs/api/http2#class-http2http2serverrequest) 和 [`Http2ServerResponse`](/zh/nodejs/api/http2#class-http2http2serverresponse) 组成。它们旨在与 HTTP/1 保持 API 兼容性，但它们不会隐藏协议之间的差异。例如，HTTP 代码的状态消息将被忽略。


### ALPN 协商 {#alpn-negotiation}

ALPN 协商允许在同一个 socket 上支持 [HTTPS](/zh/nodejs/api/https) 和 HTTP/2。`req` 和 `res` 对象可以是 HTTP/1 或 HTTP/2，应用程序**必须**将其自身限制在 [HTTP/1](/zh/nodejs/api/http) 的公共 API 中，并检测是否可以使用 HTTP/2 的更高级功能。

以下示例创建了一个同时支持这两种协议的服务器：

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // 检测是 HTTPS 请求还是 HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // 检测是 HTTPS 请求还是 HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

`'request'` 事件在 [HTTPS](/zh/nodejs/api/https) 和 HTTP/2 上的工作方式相同。

### 类: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Added in: v8.4.0**

- 继承: [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

`Http2ServerRequest` 对象由 [`http2.Server`](/zh/nodejs/api/http2#class-http2server) 或 [`http2.SecureServer`](/zh/nodejs/api/http2#class-http2secureserver) 创建，并作为第一个参数传递给 [`'request'`](/zh/nodejs/api/http2#event-request) 事件。 它可用于访问请求状态、标头和数据。


#### 事件: `'aborted'` {#event-aborted_1}

**新增于: v8.4.0**

每当 `Http2ServerRequest` 实例在通信过程中异常中止时，就会触发 `'aborted'` 事件。

只有在 `Http2ServerRequest` 的可写端尚未结束时，才会触发 `'aborted'` 事件。

#### 事件: `'close'` {#event-close_2}

**新增于: v8.4.0**

表示底层的 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 已关闭。 与 `'end'` 一样，此事件每个响应仅发生一次。

#### `request.aborted` {#requestaborted}

**新增于: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果请求已被中止，则 `request.aborted` 属性将为 `true`。

#### `request.authority` {#requestauthority}

**新增于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

请求授权伪标头字段。 由于 HTTP/2 允许请求设置 `：authority` 或 `host`，因此该值从 `req.headers[':authority']`（如果存在）派生。 否则，它从 `req.headers['host']` 派生。

#### `request.complete` {#requestcomplete}

**新增于: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果请求已完成、中止或销毁，则 `request.complete` 属性将为 `true`。

#### `request.connection` {#requestconnection}

**新增于: v8.4.0**

**自 v13.0.0 起已弃用**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 使用 [`request.socket`](/zh/nodejs/api/http2#requestsocket)。
:::

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

请参阅 [`request.socket`](/zh/nodejs/api/http2#requestsocket)。

#### `request.destroy([error])` {#requestdestroyerror}

**新增于: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

在接收到 [`Http2ServerRequest`](/zh/nodejs/api/http2#class-http2http2serverrequest) 的 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 上调用 `destroy()`。 如果提供了 `error`，则会发出一个 `'error'` 事件，并将 `error` 作为参数传递给该事件上的任何监听器。

如果流已被销毁，则不执行任何操作。


#### `request.headers` {#requestheaders}

**加入于: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

请求/响应标头对象。

标头名称和值的键值对。 标头名称均为小写。

```js [ESM]
// 打印类似以下内容：
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
参阅 [HTTP/2 标头对象](/zh/nodejs/api/http2#headers-object)。

在 HTTP/2 中，请求路径、主机名、协议和方法表示为带有 `:` 字符前缀的特殊标头（例如 `':path'`）。 这些特殊标头将包含在 `request.headers` 对象中。 必须小心，不要无意中修改这些特殊标头，否则可能会发生错误。 例如，从请求中删除所有标头将导致发生错误：

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // 失败，因为 :path 标头已被删除
```
#### `request.httpVersion` {#requesthttpversion}

**加入于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

对于服务器请求，为客户端发送的 HTTP 版本。 对于客户端响应，为连接到的服务器的 HTTP 版本。 返回 `'2.0'`。

此外，`message.httpVersionMajor` 是第一个整数，`message.httpVersionMinor` 是第二个整数。

#### `request.method` {#requestmethod}

**加入于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

请求方法作为字符串。 只读。 示例：`'GET'`、`'DELETE'`。

#### `request.rawHeaders` {#requestrawheaders}

**加入于: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

原始请求/响应标头列表，与接收到的完全一样。

键和值位于同一列表中。 它*不是*元组列表。 因此，偶数偏移量是键值，奇数偏移量是关联值。

标头名称未转换为小写，并且重复项未合并。

```js [ESM]
// 打印类似以下内容：
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

#### `request.rawTrailers` {#requestrawtrailers}

**新增于: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

原始请求/响应尾部键和值，与接收到的完全相同。 仅在 `'end'` 事件时填充。

#### `request.scheme` {#requestscheme}

**新增于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

请求 scheme 伪标头字段，指示目标 URL 的 scheme 部分。

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**新增于: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)

将 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 的超时值设置为 `msecs`。 如果提供了回调函数，则将其作为侦听器添加到响应对象的 `'timeout'` 事件中。

如果没有为请求、响应或服务器添加 `'timeout'` 侦听器，则 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 超时时将被销毁。 如果为请求、响应或服务器的 `'timeout'` 事件分配了处理程序，则必须显式处理超时的套接字。

#### `request.socket` {#requestsocket}

**新增于: v8.4.0**

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

返回一个 `Proxy` 对象，该对象充当 `net.Socket`（或 `tls.TLSSocket`），但应用基于 HTTP/2 逻辑的 getter、setter 和方法。

`destroyed`、`readable` 和 `writable` 属性将从 `request.stream` 中检索并在其上设置。

`destroy`、`emit`、`end`、`on` 和 `once` 方法将在 `request.stream` 上调用。

`setTimeout` 方法将在 `request.stream.session` 上调用。

`pause`、`read`、`resume` 和 `write` 将抛出一个代码为 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 的错误。 有关更多信息，请参阅 [`Http2Session` 和 Sockets](/zh/nodejs/api/http2#http2session-and-sockets)。

所有其他交互将直接路由到套接字。 通过 TLS 支持，使用 [`request.socket.getPeerCertificate()`](/zh/nodejs/api/tls#tlssocketgetpeercertificatedetailed) 来获取客户端的身份验证详细信息。


#### `request.stream` {#requeststream}

**添加于: v8.4.0**

- [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream)

支持请求的 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 对象。

#### `request.trailers` {#requesttrailers}

**添加于: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

请求/响应 trailers 对象。 仅在 `'end'` 事件时填充。

#### `request.url` {#requesturl}

**添加于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

请求 URL 字符串。 这仅包含实际 HTTP 请求中存在的 URL。 如果请求是：

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
那么 `request.url` 将是：

```js [ESM]
'/status?name=ryan'
```
要将 URL 解析为其各个部分，可以使用 `new URL()`：

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### 类: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**添加于: v8.4.0**

- 继承: [\<Stream\>](/zh/nodejs/api/stream#stream)

此对象由 HTTP 服务器在内部创建，而不是由用户创建。 它作为第二个参数传递给 [`'request'`](/zh/nodejs/api/http2#event-request) 事件。

#### 事件: `'close'` {#event-close_3}

**添加于: v8.4.0**

表示底层 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 在 [`response.end()`](/zh/nodejs/api/http2#responseenddata-encoding-callback) 被调用或能够刷新之前被终止。

#### 事件: `'finish'` {#event-finish}

**添加于: v8.4.0**

当响应已发送时发出。 更具体地说，当响应头和主体的最后一个段已被移交给 HTTP/2 多路复用以通过网络传输时，会发出此事件。 这并不意味着客户端已经收到了任何东西。

在此事件之后，响应对象上将不再发出任何事件。


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**新增于: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此方法将 HTTP 尾部标头（位于消息末尾的标头）添加到响应中。

尝试设置包含无效字符的标头字段名称或值会导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**新增于: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将单个标头值追加到标头对象。

如果该值是一个数组，则相当于多次调用此方法。

如果该标头之前没有值，则相当于调用 [`response.setHeader()`](/zh/nodejs/api/http2#responsesetheadername-value)。

尝试设置包含无效字符的标头字段名称或值会导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

```js [ESM]
// 返回包含 "set-cookie: a" 和 "set-cookie: b" 的标头
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**新增于: v8.4.0**

**自: v13.0.0 起已弃用**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。使用 [`response.socket`](/zh/nodejs/api/http2#responsesocket)。
:::

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

参见 [`response.socket`](/zh/nodejs/api/http2#responsesocket)。

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.4.0 | 新增于: v8.4.0 |
:::

- `headers` [\<HTTP/2 标头对象\>](/zh/nodejs/api/http2#headers-object) 描述标头的对象
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一旦 `http2stream.pushStream()` 完成时被调用，或者当创建推送 `Http2Stream` 的尝试失败或被拒绝时，或者在调用 `http2stream.pushStream()` 方法之前 `Http2ServerRequest` 的状态已关闭时被调用
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse) 新创建的 `Http2ServerResponse` 对象
  
 

使用给定的标头调用 [`http2stream.pushStream()`](/zh/nodejs/api/http2#http2streampushstreamheaders-options-callback)，并将给定的 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 包装在新建的 `Http2ServerResponse` 上作为回调参数（如果成功）。 当 `Http2ServerRequest` 关闭时，将使用错误 `ERR_HTTP2_INVALID_STREAM` 调用回调。


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 此方法现在返回对 `ServerResponse` 的引用。 |
| v8.4.0 | 添加于: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

此方法向服务器发出信号，表明所有响应标头和正文都已发送；服务器应认为此消息已完成。 必须在每个响应上调用 `response.end()` 方法。

如果指定了 `data`，则相当于调用 [`response.write(data, encoding)`](/zh/nodejs/api/http#responsewritechunk-encoding-callback) 之后再调用 `response.end(callback)`。

如果指定了 `callback`，则将在响应流完成时调用它。

#### `response.finished` {#responsefinished}

**添加于: v8.4.0**

**自以下版本弃用: v13.4.0, v12.16.0**

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 使用 [`response.writableEnded`](/zh/nodejs/api/http2#responsewritableended)。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

布尔值，指示响应是否已完成。 初始值为 `false`。 在 [`response.end()`](/zh/nodejs/api/http2#responseenddata-encoding-callback) 执行后，该值将为 `true`。

#### `response.getHeader(name)` {#responsegetheadername}

**添加于: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

读取已排队但尚未发送到客户端的标头。 名称不区分大小写。

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**新增于: v8.4.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个包含当前传出标头的唯一名称的数组。所有标头名称均为小写。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**新增于: v8.4.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回当前传出标头的浅拷贝。 由于使用了浅拷贝，因此可以在不额外调用各种标头相关的 http 模块方法的情况下修改数组值。 返回对象的键是标头名称，值是相应的标头值。 所有标头名称均为小写。

`response.getHeaders()` 方法返回的对象*不*从 JavaScript `Object` 原型继承。 这意味着典型的 `Object` 方法，例如 `obj.toString()`、`obj.hasOwnProperty()` 等未定义且*不起作用*。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**新增于: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果传出标头中当前设置了由 `name` 标识的标头，则返回 `true`。 标头名称匹配不区分大小写。

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**新增于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果已发送标头，则为 true，否则为 false（只读）。


#### `response.removeHeader(name)` {#responseremoveheadername}

**新增于: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

移除已加入队列，准备隐式发送的标头。

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**新增于: v15.7.0**

- [\<http2.Http2ServerRequest\>](/zh/nodejs/api/http2#class-http2http2serverrequest)

指向原始 HTTP2 `request` 对象的引用。

#### `response.sendDate` {#responsesenddate}

**新增于: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

当为 true 时，如果标头中尚未存在 Date 标头，则会自动生成该标头并在响应中发送。默认为 true。

仅应为测试禁用此项；HTTP 要求响应中包含 Date 标头。

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**新增于: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

为隐式标头设置单个标头值。 如果要发送的标头中已存在此标头，则其值将被替换。 在此处使用字符串数组以发送具有相同名称的多个标头。

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
或者

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

使用 [`response.setHeader()`](/zh/nodejs/api/http2#responsesetheadername-value) 设置标头后，它们将与传递给 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) 的任何标头合并，并优先考虑传递给 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) 的标头。

```js [ESM]
// 返回 content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**新增于: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

将 [`Http2Stream`](/zh/nodejs/api/http2#class-http2http2stream) 的超时值设置为 `msecs`。 如果提供了回调，则它作为 `'timeout'` 事件的侦听器添加到响应对象上。

如果未向请求、响应或服务器添加 `'timeout'` 侦听器，则 [`Http2Stream`](/zh/nodejs/api/http2#class-http2http2stream) 在超时时将被销毁。 如果为请求、响应或服务器的 `'timeout'` 事件分配了处理程序，则必须显式处理超时的套接字。

#### `response.socket` {#responsesocket}

**新增于: v8.4.0**

- [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

返回一个 `Proxy` 对象，该对象充当 `net.Socket`（或 `tls.TLSSocket`），但根据 HTTP/2 逻辑应用 getter、setter 和方法。

`destroyed`、`readable` 和 `writable` 属性将从 `response.stream` 中检索并在其上设置。

`destroy`、`emit`、`end`、`on` 和 `once` 方法将在 `response.stream` 上调用。

`setTimeout` 方法将在 `response.stream.session` 上调用。

`pause`、`read`、`resume` 和 `write` 将抛出代码为 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 的错误。 有关更多信息，请参见 [`Http2Session` 和套接字](/zh/nodejs/api/http2#http2session-and-sockets)。

所有其他交互将直接路由到套接字。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**添加于: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当使用隐式标头（未显式调用 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)）时，此属性控制在刷新标头时将发送给客户端的状态代码。

```js [ESM]
response.statusCode = 404;
```
在响应标头发送到客户端后，此属性指示已发送的状态代码。

#### `response.statusMessage` {#responsestatusmessage}

**添加于: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

HTTP/2 不支持状态消息 (RFC 7540 8.1.2.4)。 它返回一个空字符串。

#### `response.stream` {#responsestream}

**添加于: v8.4.0**

- [\<Http2Stream\>](/zh/nodejs/api/http2#class-http2stream)

支持响应的 [`Http2Stream`](/zh/nodejs/api/http2#class-http2stream) 对象。

#### `response.writableEnded` {#responsewritableended}

**添加于: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在调用 [`response.end()`](/zh/nodejs/api/http2#responseenddata-encoding-callback) 后为 `true`。 此属性不指示数据是否已刷新，请改用 [`writable.writableFinished`](/zh/nodejs/api/stream#writablewritablefinished)。

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**添加于: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果调用此方法并且尚未调用 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)，它将切换到隐式标头模式并刷新隐式标头。

这会发送响应正文的一个块。 可以多次调用此方法以提供正文的后续部分。

在 `node:http` 模块中，当请求是 HEAD 请求时，响应正文会被省略。 同样，`204` 和 `304` 响应*不得*包含消息正文。

`chunk` 可以是字符串或缓冲区。 如果 `chunk` 是字符串，则第二个参数指定如何将其编码为字节流。 默认情况下，`encoding` 是 `'utf8'`。 当刷新此数据块时将调用 `callback`。

这是原始的 HTTP 正文，与可能使用的高级多部分正文编码无关。

第一次调用 [`response.write()`](/zh/nodejs/api/http2#responsewritechunk-encoding-callback) 时，它会将缓冲的标头信息和正文的第一个块发送到客户端。 第二次调用 [`response.write()`](/zh/nodejs/api/http2#responsewritechunk-encoding-callback) 时，Node.js 假定数据将被流式传输，并单独发送新数据。 也就是说，响应被缓冲到正文的第一个块。

如果整个数据都成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，将发出 `'drain'`。


#### `response.writeContinue()` {#responsewritecontinue}

**加入于: v8.4.0**

向客户端发送状态码 `100 Continue`，表示应该发送请求主体。参见 `Http2Server` 和 `Http2SecureServer` 上的 [`'checkContinue'` 事件](/zh/nodejs/api/http2#event-checkcontinue)。

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**加入于: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

向客户端发送状态码 `103 Early Hints`，其中包含 Link 标头，指示用户代理可以预加载/预连接链接的资源。 `hints` 是一个对象，其中包含要与早期提示消息一起发送的标头的值。

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
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v11.10.0, v10.17.0 | 从 `writeHead()` 返回 `this`，以允许与 `end()` 链接。 |
| v8.4.0 | 加入于: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 返回: [\<http2.Http2ServerResponse\>](/zh/nodejs/api/http2#class-http2http2serverresponse)

向请求发送响应头。 状态码是一个 3 位数的 HTTP 状态码，例如 `404`。 最后一个参数 `headers` 是响应头。

返回对 `Http2ServerResponse` 的引用，以便可以链接调用。

为了与 [HTTP/1](/zh/nodejs/api/http) 兼容，可以将人类可读的 `statusMessage` 作为第二个参数传递。 但是，由于 `statusMessage` 在 HTTP/2 中没有意义，因此该参数将不起作用，并且会发出进程警告。

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` 以字节为单位给出，而不是以字符为单位。 `Buffer.byteLength()` API 可用于确定给定编码中的字节数。 在出站消息中，Node.js 不检查 Content-Length 和正在传输的正文的长度是否相等。 但是，在接收消息时，当 `Content-Length` 与实际有效负载大小不匹配时，Node.js 会自动拒绝消息。

在调用 [`response.end()`](/zh/nodejs/api/http2#responseenddata-encoding-callback) 之前，此方法最多可以在一条消息上调用一次。

如果在调用此方法之前调用了 [`response.write()`](/zh/nodejs/api/http2#responsewritechunk-encoding-callback) 或 [`response.end()`](/zh/nodejs/api/http2#responseenddata-encoding-callback)，则将计算隐式/可变标头并调用此函数。

当标头已使用 [`response.setHeader()`](/zh/nodejs/api/http2#responsesetheadername-value) 设置时，它们将与传递给 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) 的任何标头合并，并优先考虑传递给 [`response.writeHead()`](/zh/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) 的标头。

```js [ESM]
// 返回 content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## 收集 HTTP/2 性能指标 {#collecting-http/2-performance-metrics}

[Performance Observer](/zh/nodejs/api/perf_hooks) API 可用于收集每个 `Http2Session` 和 `Http2Stream` 实例的基本性能指标。

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

`PerformanceEntry` 的 `entryType` 属性将等于 `'http2'`。

`PerformanceEntry` 的 `name` 属性将等于 `'Http2Stream'` 或 `'Http2Session'`。

如果 `name` 等于 `Http2Stream`，则 `PerformanceEntry` 将包含以下附加属性：

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Stream` 接收到的 `DATA` 帧字节数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Stream` 发送的 `DATA` 帧字节数。
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 相关联的 `Http2Stream` 的标识符
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 和接收到第一个 `DATA` 帧之间经过的毫秒数。
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 和发送第一个 `DATA` 帧之间经过的毫秒数。
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 和接收到第一个标头之间经过的毫秒数。

如果 `name` 等于 `Http2Session`，则 `PerformanceEntry` 将包含以下附加属性：

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Session` 接收到的字节数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Session` 发送的字节数。
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 接收到的 HTTP/2 帧数。
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 发送的 HTTP/2 帧数。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `Http2Session` 的生命周期内同时打开的最大流数。
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 自 `PING` 帧传输和接收到其确认以来经过的毫秒数。 仅当在 `Http2Session` 上发送了 `PING` 帧时才存在。
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 所有 `Http2Stream` 实例的平均持续时间（以毫秒为单位）。
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 处理的 `Http2Stream` 实例数。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'server'` 或 `'client'`，用于标识 `Http2Session` 的类型。


## 关于 `:authority` 和 `host` 的注意事项 {#note-on-authority-and-host}

HTTP/2 要求请求必须包含 `:authority` 伪头部或 `host` 头部。当直接构造 HTTP/2 请求时，优先使用 `:authority`，而当从 HTTP/1 转换时（例如在代理中），则使用 `host`。

兼容性 API 在 `:authority` 不存在时会回退到 `host`。有关更多信息，请参阅 [`request.authority`](/zh/nodejs/api/http2#requestauthority)。但是，如果您不使用兼容性 API（或直接使用 `req.headers`），则需要自行实现任何回退行为。

