---
title: Node.js 文档 - HTTPS
description: Node.js 中的 HTTPS 模块提供了 TLS/SSL 协议的实现，以支持安全的 HTTP 连接。它包括创建安全服务器和客户端的方法，处理证书，以及管理安全连接。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的 HTTPS 模块提供了 TLS/SSL 协议的实现，以支持安全的 HTTP 连接。它包括创建安全服务器和客户端的方法，处理证书，以及管理安全连接。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的 HTTPS 模块提供了 TLS/SSL 协议的实现，以支持安全的 HTTP 连接。它包括创建安全服务器和客户端的方法，处理证书，以及管理安全连接。
---


# HTTPS {#https}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS 是基于 TLS/SSL 的 HTTP 协议。在 Node.js 中，它是作为一个独立的模块实现的。

## 确定是否不支持 crypto {#determining-if-crypto-support-is-unavailable}

Node.js 有可能在构建时没有包含对 `node:crypto` 模块的支持。在这种情况下，尝试从 `https` 导入或调用 `require('node:https')` 将导致抛出一个错误。

当使用 CommonJS 时，可以使用 try/catch 捕获抛出的错误：

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
当使用词法 ESM `import` 关键字时，只有在 *在* 尝试加载模块之前注册了 `process.on('uncaughtException')` 的处理程序（例如，使用预加载模块）时，才能捕获错误。

当使用 ESM 时，如果代码有可能在未启用 crypto 支持的 Node.js 构建上运行，请考虑使用 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 函数而不是词法 `import` 关键字：

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
## 类: `https.Agent` {#class-httpsagent}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v5.3.0 | 支持使用 `0` `maxCachedSessions` 来禁用 TLS 会话缓存。 |
| v2.5.0 | 在 `options` 中添加了参数 `maxCachedSessions` 以用于 TLS 会话重用。 |
| v0.4.5 | 添加于: v0.4.5 |
:::

一个用于 HTTPS 的 [`Agent`](/zh/nodejs/api/https#class-httpsagent) 对象，类似于 [`http.Agent`](/zh/nodejs/api/http#class-httpagent)。 更多信息请参阅 [`https.request()`](/zh/nodejs/api/https#httpsrequestoptions-callback)。

### `new Agent([options])` {#new-agentoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.5.0 | 如果目标主机是通过 IP 地址指定的，则不自动设置 servername。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要在代理上设置的可配置选项集。 可以具有与 [`http.Agent(options)`](/zh/nodejs/api/http#new-agentoptions) 相同的字段，以及
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TLS 缓存会话的最大数量。 使用 `0` 禁用 TLS 会话缓存。 **默认:** `100`。
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要发送到服务器的 [服务器名称指示扩展](https://en.wikipedia.org/wiki/Server_Name_Indication) 的值。 使用空字符串 `''` 禁用发送扩展。 **默认:** 目标服务器的主机名，除非目标服务器是使用 IP 地址指定的，在这种情况下，默认值为 `''`（不发送扩展）。 有关 TLS 会话重用的信息，请参阅 [`会话恢复`](/zh/nodejs/api/tls#session-resumption)。


#### 事件: `'keylog'` {#event-keylog}

**新增于: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) ASCII 文本行，采用 NSS `SSLKEYLOGFILE` 格式。
- `tlsSocket` [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 生成该事件的 `tls.TLSSocket` 实例。

当此代理管理的连接生成或接收密钥材料时（通常在握手完成之前，但并非必须如此），会发出 `keylog` 事件。 可以存储此密钥材料以进行调试，因为它允许解密捕获的 TLS 流量。 对于每个套接字，它可能会发出多次。

一个典型的用例是将接收到的行附加到公共文本文件中，该文件稍后被软件（如 Wireshark）用于解密流量：

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## 类: `https.Server` {#class-httpsserver}

**新增于: v0.3.4**

- 继承: [\<tls.Server\>](/zh/nodejs/api/tls#class-tlsserver)

更多信息请参见 [`http.Server`](/zh/nodejs/api/http#class-httpserver)。

### `server.close([callback])` {#serverclosecallback}

**新增于: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<https.Server\>](/zh/nodejs/api/https#class-httpsserver)

请参阅 `node:http` 模块中的 [`server.close()`](/zh/nodejs/api/http#serverclosecallback)。

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**新增于: v20.4.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

调用 [`server.close()`](/zh/nodejs/api/https#serverclosecallback) 并返回一个 promise，该 promise 在服务器关闭时完成。

### `server.closeAllConnections()` {#servercloseallconnections}

**新增于: v18.2.0**

请参阅 `node:http` 模块中的 [`server.closeAllConnections()`](/zh/nodejs/api/http#servercloseallconnections)。

### `server.closeIdleConnections()` {#servercloseidleconnections}

**新增于: v18.2.0**

请参阅 `node:http` 模块中的 [`server.closeIdleConnections()`](/zh/nodejs/api/http#servercloseidleconnections)。


### `server.headersTimeout` {#serverheaderstimeout}

**添加于: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `60000`

参见 `node:http` 模块中的 [`server.headersTimeout`](/zh/nodejs/api/http#serverheaderstimeout)。

### `server.listen()` {#serverlisten}

启动 HTTPS 服务器以监听加密连接。 此方法与 [`net.Server`](/zh/nodejs/api/net#class-netserver) 中的 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 相同。

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `2000`

参见 `node:http` 模块中的 [`server.maxHeadersCount`](/zh/nodejs/api/http#servermaxheaderscount)。

### `server.requestTimeout` {#serverrequesttimeout}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 默认的请求超时从没有超时更改为 300 秒（5 分钟）。 |
| v14.11.0 | 添加于: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `300000`

参见 `node:http` 模块中的 [`server.requestTimeout`](/zh/nodejs/api/http#serverrequesttimeout)。

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**添加于: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `120000`（2 分钟）
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<https.Server\>](/zh/nodejs/api/https#class-httpsserver)

参见 `node:http` 模块中的 [`server.setTimeout()`](/zh/nodejs/api/http#serversettimeoutmsecs-callback)。

### `server.timeout` {#servertimeout}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 默认超时时间从 120 秒更改为 0（无超时）。 |
| v0.11.2 | 添加于: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** 0 (无超时)

参见 `node:http` 模块中的 [`server.timeout`](/zh/nodejs/api/http#servertimeout)。


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Added in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认:** `5000` (5 秒)

参见 `node:http` 模块中的 [`server.keepAliveTimeout`](/zh/nodejs/api/http#serverkeepalivetimeout)。

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Added in: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 接受来自 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 和 [`http.createServer()`](/zh/nodejs/api/http#httpcreateserveroptions-requestlistener) 的 `options`。
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要添加到 `'request'` 事件的监听器。
- 返回: [\<https.Server\>](/zh/nodejs/api/https#class-httpsserver)

::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

或者

::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

要为此示例生成证书和密钥，请运行：

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
然后，要为此示例生成 `pfx` 证书，请运行：

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.9.0 | `url` 参数现在可以与单独的 `options` 对象一起传递。 |
| v7.5.0 | `options` 参数可以是 WHATWG `URL` 对象。 |
| v0.3.6 | 添加于：v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 接受与 [`https.request()`](/zh/nodejs/api/https#httpsrequestoptions-callback) 相同的 `options`，默认情况下，method 设置为 GET。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

类似于 [`http.get()`](/zh/nodejs/api/http#httpgetoptions-callback)，但用于 HTTPS。

`options` 可以是一个对象、一个字符串或一个 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象。 如果 `options` 是一个字符串，它会自动使用 [`new URL()`](/zh/nodejs/api/url#new-urlinput-base) 解析。 如果它是一个 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象，它将自动转换为一个普通的 `options` 对象。

::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 默认情况下，代理现在使用 HTTP Keep-Alive 和 5 秒超时。 |
| v0.5.9 | 添加于: v0.5.9 |
:::

用于所有 HTTPS 客户端请求的 [`https.Agent`](/zh/nodejs/api/https#class-httpsagent) 的全局实例。 与默认的 [`https.Agent`](/zh/nodejs/api/https#class-httpsagent) 配置不同，它启用了 `keepAlive` 并且 `timeout` 为 5 秒。

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine` 选项依赖于 OpenSSL 中的自定义引擎支持，该支持已在 OpenSSL 3 中弃用。 |
| v16.7.0, v14.18.0 | 当使用 `URL` 对象时，解析后的用户名和密码现在将被正确地 URI 解码。 |
| v14.1.0, v13.14.0 | 现在接受 `highWaterMark` 选项。 |
| v10.9.0 | 现在可以将 `url` 参数与单独的 `options` 对象一起传递。 |
| v9.3.0 | `options` 参数现在可以包含 `clientCertEngine`。 |
| v7.5.0 | `options` 参数可以是 WHATWG `URL` 对象。 |
| v0.3.6 | 添加于: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 接受来自 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback) 的所有 `options`，但在默认值上有一些差异：
    - `protocol` **默认:** `'https:'`
    - `port` **默认:** `443`
    - `agent` **默认:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

向安全 Web 服务器发出请求。

还接受来自 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 的以下附加 `options`: `ca`、`cert`、`ciphers`、`clientCertEngine` (已弃用)、`crl`、`dhparam`、`ecdhCurve`、`honorCipherOrder`、`key`、`passphrase`、`pfx`、`rejectUnauthorized`、`secureOptions`、`secureProtocol`、`servername`、`sessionIdContext`、`highWaterMark`。

`options` 可以是一个对象、一个字符串或一个 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象。 如果 `options` 是一个字符串，它会自动使用 [`new URL()`](/zh/nodejs/api/url#new-urlinput-base) 进行解析。 如果它是一个 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 对象，它将自动转换为一个普通的 `options` 对象。

`https.request()` 返回一个 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest) 类的实例。 `ClientRequest` 实例是一个可写流。 如果需要使用 POST 请求上传文件，则写入 `ClientRequest` 对象。

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

使用 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 中选项的示例：

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
或者，通过不使用 [`Agent`](/zh/nodejs/api/https#class-httpsagent) 来选择退出连接池。

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
使用 [`URL`](/zh/nodejs/api/url#the-whatwg-url-api) 作为 `options` 的示例：

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
在证书指纹或公钥上进行绑定的示例 (类似于 `pin-sha256`)：

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // 确保证书颁发给我们要连接的主机
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // 绑定公钥，类似于 HPKP pin-sha256 绑定
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // 绑定确切的证书，而不是公钥
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // 此循环仅供参考。
    // 打印链中所有证书的证书和公钥指纹。
    // 通常绑定公共互联网上的颁发者的公钥，同时绑定敏感环境中服务的公钥。
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // 确保证书颁发给我们要连接的主机
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // 绑定公钥，类似于 HPKP pin-sha256 绑定
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // 绑定确切的证书，而不是公钥
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // 此循环仅供参考。
    // 打印链中所有证书的证书和公钥指纹。
    // 通常绑定公共互联网上的颁发者的公钥，同时绑定敏感环境中服务的公钥。
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

例如输出：

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```

