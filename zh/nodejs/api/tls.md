---
title: Node.js 文档 - TLS（传输层安全性）
description: Node.js文档的这一部分介绍了TLS（传输层安全性）模块，该模块提供了TLS和SSL协议的实现。内容涵盖了创建安全连接、管理证书、处理安全通信以及在Node.js应用程序中配置TLS/SSL的各种选项。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - TLS（传输层安全性） | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js文档的这一部分介绍了TLS（传输层安全性）模块，该模块提供了TLS和SSL协议的实现。内容涵盖了创建安全连接、管理证书、处理安全通信以及在Node.js应用程序中配置TLS/SSL的各种选项。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - TLS（传输层安全性） | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js文档的这一部分介绍了TLS（传输层安全性）模块，该模块提供了TLS和SSL协议的实现。内容涵盖了创建安全连接、管理证书、处理安全通信以及在Node.js应用程序中配置TLS/SSL的各种选项。
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

`node:tls` 模块提供了一个传输层安全（TLS）和安全套接层（SSL）协议的实现，该实现构建在 OpenSSL 之上。可以使用以下方式访问该模块：

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## 确定 crypto 支持是否不可用 {#determining-if-crypto-support-is-unavailable}

Node.js 有可能在构建时未包含对 `node:crypto` 模块的支持。在这种情况下，尝试从 `tls` 中 `import` 或调用 `require('node:tls')` 将导致抛出错误。

当使用 CommonJS 时，可以使用 try/catch 捕获抛出的错误：

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls 支持被禁用!');
}
```
当使用词法 ESM `import` 关键字时，只有在 *在* 尝试加载模块之前注册了 `process.on('uncaughtException')` 的处理程序（例如，使用预加载模块）才能捕获该错误。

当使用 ESM 时，如果代码有可能在未启用 crypto 支持的 Node.js 构建上运行，请考虑使用 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 函数而不是词法 `import` 关键字：

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls 支持被禁用!');
}
```
## TLS/SSL 概念 {#tls/ssl-concepts}

TLS/SSL 是一组协议，它依赖于公钥基础设施（PKI）来实现客户端和服务器之间的安全通信。对于大多数常见情况，每个服务器都必须有一个私钥。

私钥可以通过多种方式生成。下面的示例演示了使用 OpenSSL 命令行界面生成 2048 位 RSA 私钥：

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
使用 TLS/SSL，所有服务器（和某些客户端）都必须具有*证书*。证书是对应于私钥的*公钥*，并且由证书颁发机构或私钥的所有者进行数字签名（此类证书称为“自签名”）。获取证书的第一步是创建*证书签名请求*（CSR）文件。

OpenSSL 命令行界面可用于为私钥生成 CSR：

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
生成 CSR 文件后，可以将其发送到证书颁发机构进行签名，或者用于生成自签名证书。

下面的示例演示了使用 OpenSSL 命令行界面创建自签名证书：

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
生成证书后，可以使用它来生成 `.pfx` 或 `.p12` 文件：

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
其中：

- `in`: 是已签名的证书
- `inkey`: 是关联的私钥
- `certfile`: 是所有证书颁发机构（CA）证书的串联到一个文件，例如 `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### 完全前向保密 {#perfect-forward-secrecy}

术语 *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">前向保密</a>* 或 *完全前向保密* 描述了一种密钥协商（即密钥交换）方法的特性。也就是说，服务器和客户端密钥用于协商新的临时密钥，这些密钥专门且仅用于当前的通信会话。实际上，这意味着即使服务器的私钥泄露，窃听者也只有在设法获取专门为该会话生成的密钥对时，才能解密通信。

完全前向保密是通过在每次 TLS/SSL 握手时随机生成用于密钥协商的密钥对来实现的（而不是为所有会话使用相同的密钥）。实现此技术的的方法称为“短暂的”。

目前，通常使用两种方法来实现完全前向保密（请注意附加到传统缩写中的字符“E”）：

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman)：椭圆曲线 Diffie-Hellman 密钥协商协议的临时版本。
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)：Diffie-Hellman 密钥协商协议的临时版本。

默认情况下启用使用 ECDHE 的完全前向保密。 创建 TLS 服务器时可以使用 `ecdhCurve` 选项来自定义要使用的受支持 ECDH 曲线的列表。 有关更多信息，请参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)。

默认情况下禁用 DHE，但可以通过将 `dhparam` 选项设置为 `'auto'` 来与 ECDHE 一起启用它。 也支持自定义 DHE 参数，但不建议使用，而应选择自动选择的、众所周知的参数。

在 TLSv1.2 之前，完全前向保密是可选的。 从 TLSv1.3 开始，始终使用 (EC)DHE（仅限 PSK 连接除外）。

### ALPN 和 SNI {#alpn-and-sni}

ALPN（应用层协议协商扩展）和 SNI（服务器名称指示）是 TLS 握手扩展：

- ALPN：允许一个 TLS 服务器用于多个协议（HTTP，HTTP/2）
- SNI：允许一个 TLS 服务器用于具有不同证书的多个主机名。


### 预共享密钥 {#pre-shared-keys}

TLS-PSK 支持可作为基于证书的常规身份验证的替代方案。它使用预共享密钥而不是证书来验证 TLS 连接，从而提供相互身份验证。TLS-PSK 和公钥基础设施并非互斥。客户端和服务器可以同时支持两者，并在常规密码协商步骤中选择其中一个。

TLS-PSK 仅在存在安全地与每台连接机器共享密钥的方法时才是一个不错的选择，因此它不能替代大多数 TLS 用途的公钥基础设施 (PKI)。OpenSSL 中的 TLS-PSK 实现近年来出现了很多安全漏洞，主要是因为它仅被少数应用程序使用。在切换到 PSK 密码之前，请考虑所有替代解决方案。生成 PSK 时，至关重要的是使用足够的熵，如 [RFC 4086](https://tools.ietf.org/html/rfc4086) 中所述。从密码或其他低熵源派生共享密钥是不安全的。

PSK 密码默认情况下处于禁用状态，因此使用 TLS-PSK 需要使用 `ciphers` 选项显式指定密码套件。可以通过 `openssl ciphers -v 'PSK'` 检索可用密码的列表。所有 TLS 1.3 密码都有资格用于 PSK，可以通过 `openssl ciphers -v -s -tls1_3 -psk` 检索。在客户端连接上，应传递自定义 `checkServerIdentity`，因为在没有证书的情况下，默认的 `checkServerIdentity` 将失败。

根据 [RFC 4279](https://tools.ietf.org/html/rfc4279)，必须支持最大长度为 128 字节的 PSK 标识和最大长度为 64 字节的 PSK。截至 OpenSSL 1.1.0，最大标识大小为 128 字节，最大 PSK 长度为 256 字节。

由于底层 OpenSSL API 的限制，当前实现不支持异步 PSK 回调。

要使用 TLS-PSK，客户端和服务器必须指定 `pskCallback` 选项，该选项是一个函数，它返回要使用的 PSK（必须与所选密码的摘要兼容）。

它将首先在客户端上调用：

- hint：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 从服务器发送的可选消息，以帮助客户端决定在协商期间使用哪个标识。如果使用 TLS 1.3，则始终为 `null`。
- 返回：[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 格式为 `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` 或 `null`。

然后在服务器上调用：

- socket: [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 服务器套接字实例，等效于 `this`。
- identity：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 从客户端发送的标识参数。
- 返回：[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PSK (或 `null`)。

返回 `null` 会停止协商过程，并向另一方发送 `unknown_psk_identity` 警报消息。如果服务器希望隐藏 PSK 标识未知的事实，则回调必须提供一些随机数据作为 `psk`，以使连接在协商完成之前因 `decrypt_error` 而失败。


### 客户端发起的重新协商攻击缓解 {#client-initiated-renegotiation-attack-mitigation}

TLS 协议允许客户端重新协商 TLS 会话的某些方面。不幸的是，会话重新协商需要不成比例的服务器端资源，使其成为潜在的拒绝服务攻击向量。

为了降低风险，重新协商被限制为每十分钟三次。当超出此阈值时，会在 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 实例上发出一个 `'error'` 事件。这些限制是可配置的：

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定重新协商请求的数量。**默认值:** `3`。
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定重新协商时间窗口，以秒为单位。**默认值:** `600` (10 分钟)。

在完全理解其含义和风险的情况下，不应修改默认的重新协商限制。

TLSv1.3 不支持重新协商。

### 会话恢复 {#session-resumption}

建立 TLS 会话可能相对较慢。 通过保存并稍后重用会话状态可以加快此过程。 有几种机制可以做到这一点，这里从最旧到最新（和首选）进行讨论。

#### 会话标识符 {#session-identifiers}

服务器为新连接生成唯一的 ID 并将其发送给客户端。 客户端和服务器保存会话状态。 重新连接时，客户端发送其保存的会话状态的 ID，如果服务器也具有该 ID 的状态，则可以同意使用它。 否则，服务器将创建一个新会话。 有关更多信息，请参见 [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt)，第 23 和 30 页。

在使用 HTTPS 请求时，大多数 Web 浏览器都支持使用会话标识符进行恢复。

对于 Node.js，客户端等待 [`'session'`](/zh/nodejs/api/tls#event-session) 事件以获取会话数据，并将数据提供给后续 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 的 `session` 选项以重用会话。 服务器必须实现 [`'newSession'`](/zh/nodejs/api/tls#event-newsession) 和 [`'resumeSession'`](/zh/nodejs/api/tls#event-resumesession) 事件的处理程序，以使用会话 ID 作为查找键来保存和恢复会话数据，以重用会话。 要跨负载均衡器或集群工作进程重用会话，服务器必须在其会话处理程序中使用共享会话缓存（例如 Redis）。


#### 会话票证 {#session-tickets}

服务器加密整个会话状态，并将其作为“票证”发送给客户端。重新连接时，状态将在初始连接中发送到服务器。这种机制避免了对服务器端会话缓存的需求。如果服务器由于任何原因（解密失败、票证太旧等）未使用该票证，它将创建一个新会话并发送一个新票证。有关更多信息，请参见 [RFC 5077](https://tools.ietf.org/html/rfc5077)。

当发出 HTTPS 请求时，使用会话票证恢复连接正变得越来越普遍地被许多 Web 浏览器支持。

对于 Node.js，客户端使用与使用会话标识符恢复连接相同的 API 来使用会话票证恢复连接。对于调试，如果 [`tls.TLSSocket.getTLSTicket()`](/zh/nodejs/api/tls#tlssocketgettlsticket) 返回一个值，则会话数据包含一个票证，否则它包含客户端会话状态。

使用 TLSv1.3 时，请注意服务器可能会发送多个票证，从而导致多个 `'session'` 事件，有关更多信息，请参见 [`'session'`](/zh/nodejs/api/tls#event-session)。

单进程服务器不需要任何特定的实现即可使用会话票证。要在服务器重启或负载均衡器之间使用会话票证，服务器必须都具有相同的票证密钥。内部有三个 16 字节的密钥，但为了方便起见，tls API 将它们作为一个 48 字节的缓冲区公开。

可以通过在一个服务器实例上调用 [`server.getTicketKeys()`](/zh/nodejs/api/tls#servergetticketkeys) 来获取票证密钥，然后分发它们，但更合理的是安全地生成 48 字节的安全随机数据，并使用 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 的 `ticketKeys` 选项来设置它们。应该定期重新生成密钥，并且可以使用 [`server.setTicketKeys()`](/zh/nodejs/api/tls#serversetticketkeyskeys) 重置服务器的密钥。

会话票证密钥是加密密钥，它们*<strong>必须安全存储</strong>*。对于 TLS 1.2 及以下版本，如果它们被泄露，则所有使用使用它们加密的票证的会话都可以被解密。它们不应存储在磁盘上，并且应定期重新生成。

如果客户端声明支持票证，则服务器将发送它们。服务器可以通过在 `secureOptions` 中提供 `require('node:constants').SSL_OP_NO_TICKET` 来禁用票证。

会话标识符和会话票证都会超时，从而导致服务器创建新会话。可以使用 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 的 `sessionTimeout` 选项配置超时。

对于所有机制，当恢复失败时，服务器将创建新会话。由于无法恢复会话不会导致 TLS/HTTPS 连接失败，因此很容易忽略不必要的 TLS 性能下降。可以使用 OpenSSL CLI 验证服务器是否正在恢复会话。使用 `openssl s_client` 的 `-reconnect` 选项，例如：

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
通读调试输出。第一个连接应该显示“New”，例如：

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
后续连接应显示“Reused”，例如：

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## 修改默认的 TLS 密码套件 {#modifying-the-default-tls-cipher-suite}

Node.js 内置了一套默认启用和禁用的 TLS 密码。 这个默认密码列表可以在构建 Node.js 时进行配置，允许发行版提供他们自己的默认列表。

以下命令可用于显示默认密码套件：

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
这个默认值可以使用 [`--tls-cipher-list`](/zh/nodejs/api/cli#--tls-cipher-listlist) 命令行开关（直接或通过 [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 环境变量）完全替换。 例如，以下命令使 `ECDHE-RSA-AES128-GCM-SHA256:!RC4` 成为默认的 TLS 密码套件：

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
为了验证，使用以下命令显示设置的密码列表，注意 `defaultCoreCipherList` 和 `defaultCipherList` 之间的区别：

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
即 `defaultCoreCipherList` 列表是在编译时设置的，而 `defaultCipherList` 是在运行时设置的。

要从运行时修改默认密码套件，请修改 `tls.DEFAULT_CIPHERS` 变量，这必须在监听任何套接字之前执行，它不会影响已经打开的套接字。 例如：

```js [ESM]
// 移除过时的 CBC 密码和基于 RSA 密钥交换的密码，因为它们不提供完全前向保密
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
默认值也可以使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 中的 `ciphers` 选项在每个客户端或服务器的基础上进行替换，该选项也可在 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)、[`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 以及创建新的 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 时使用。

密码列表可以包含 TLSv1.3 密码套件名称（以 `'TLS_'` 开头）和 TLSv1.2 及更低版本密码套件的规范的混合。 TLSv1.2 密码支持传统的规范格式，有关详细信息，请参阅 OpenSSL [密码列表格式](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) 文档，但这些规范*不*适用于 TLSv1.3 密码。 TLSv1.3 套件只能通过在其密码列表中包含其完整名称来启用。 例如，不能使用传统的 TLSv1.2 `'EECDH'` 或 `'!EECDH'` 规范来启用或禁用它们。

尽管 TLSv1.3 和 TLSv1.2 密码套件的相对顺序如何，但 TLSv1.3 协议比 TLSv1.2 安全得多，并且如果握手表明支持该协议并且启用了任何 TLSv1.3 密码套件，则始终会选择 TLSv1.3 协议。

Node.js 中包含的默认密码套件经过精心选择，以反映当前的安全最佳实践和风险缓解措施。 更改默认密码套件会对应用程序的安全性产生重大影响。 只有在绝对必要时才应使用 `--tls-cipher-list` 开关和 `ciphers` 选项。

默认密码套件更喜欢用于 [Chrome 的“现代密码学”设置](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) 的 GCM 密码，并且更喜欢用于完美前向保密的 ECDHE 和 DHE 密码，同时提供*一些*向后兼容性。

依赖于不安全且已弃用的基于 RC4 或 DES 的密码的旧客户端（如 Internet Explorer 6）无法使用默认配置完成握手过程。 如果*必须*支持这些客户端，则 [TLS 建议](https://wiki.mozilla.org/Security/Server_Side_TLS) 可能会提供兼容的密码套件。 有关格式的更多详细信息，请参阅 OpenSSL [密码列表格式](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) 文档。

只有五个 TLSv1.3 密码套件：

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

前三个默认启用。 这两个基于 `CCM` 的套件受 TLSv1.3 支持，因为它们在受限系统上可能具有更高的性能，但由于它们提供的安全性较低，因此默认情况下不启用它们。


## OpenSSL 安全等级 {#openssl-security-level}

OpenSSL 库强制执行安全等级，以控制密码操作可接受的最低安全级别。OpenSSL 的安全等级范围为 0 到 5，每个等级都施加了更严格的安全要求。默认安全等级为 1，通常适用于大多数现代应用程序。但是，某些遗留特性和协议（例如 TLSv1）需要较低的安全等级 (`SECLEVEL=0`) 才能正常运行。有关更多详细信息，请参阅 [OpenSSL 关于安全等级的文档](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR)。

### 设置安全等级 {#setting-security-levels}

要在您的 Node.js 应用程序中调整安全等级，您可以在密码字符串中包含 `@SECLEVEL=X`，其中 `X` 是所需的安全等级。例如，要在使用默认 OpenSSL 密码列表的同时将安全等级设置为 0，您可以这样做：

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

这种方法将安全等级设置为 0，允许使用遗留功能，同时仍然利用默认的 OpenSSL 密码。

### 使用 {#using}

您还可以使用 `--tls-cipher-list=DEFAULT@SECLEVEL=X` 从命令行设置安全级别和密码，如 [修改默认 TLS 密码套件](/zh/nodejs/api/tls#modifying-the-default-tls-cipher-suite) 中所述。但是，通常不鼓励使用命令行选项设置密码，最好在应用程序代码中为各个上下文配置密码，因为这种方法提供了更精细的控制，并降低了全局降低安全级别的风险。


## X509 证书错误代码 {#x509-certificate-error-codes}

由于 OpenSSL 报告的证书错误，多个函数可能会失败。在这种情况下，该函数会通过其回调提供一个 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)，该回调具有属性 `code`，它可以采用以下值之一：

- `'UNABLE_TO_GET_ISSUER_CERT'`: 无法获取颁发者证书。
- `'UNABLE_TO_GET_CRL'`: 无法获取证书 CRL。
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: 无法解密证书的签名。
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: 无法解密 CRL 的签名。
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: 无法解码颁发者的公钥。
- `'CERT_SIGNATURE_FAILURE'`: 证书签名失败。
- `'CRL_SIGNATURE_FAILURE'`: CRL 签名失败。
- `'CERT_NOT_YET_VALID'`: 证书尚未生效。
- `'CERT_HAS_EXPIRED'`: 证书已过期。
- `'CRL_NOT_YET_VALID'`: CRL 尚未生效。
- `'CRL_HAS_EXPIRED'`: CRL 已过期。
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: 证书的 notBefore 字段中存在格式错误。
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: 证书的 notAfter 字段中存在格式错误。
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: CRL 的 lastUpdate 字段中存在格式错误。
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: CRL 的 nextUpdate 字段中存在格式错误。
- `'OUT_OF_MEM'`: 内存不足。
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: 自签名证书。
- `'SELF_SIGNED_CERT_IN_CHAIN'`: 证书链中的自签名证书。
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: 无法获取本地颁发者证书。
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: 无法验证第一个证书。
- `'CERT_CHAIN_TOO_LONG'`: 证书链太长。
- `'CERT_REVOKED'`: 证书已吊销。
- `'INVALID_CA'`: 无效的 CA 证书。
- `'PATH_LENGTH_EXCEEDED'`: 路径长度约束超出。
- `'INVALID_PURPOSE'`: 不支持的证书用途。
- `'CERT_UNTRUSTED'`: 证书不受信任。
- `'CERT_REJECTED'`: 证书被拒绝。
- `'HOSTNAME_MISMATCH'`: 主机名不匹配。


## 类: `tls.CryptoStream` {#class-tlscryptostream}

**新增于: v0.3.4**

**已弃用自: v0.11.3**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 代替。
:::

`tls.CryptoStream` 类表示加密数据的流。 此类已弃用，不应再使用。

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**新增于: v0.3.4**

**已弃用自: v0.11.3**

`cryptoStream.bytesWritten` 属性返回写入底层套接字的总字节数，*包括*实现 TLS 协议所需的字节。

## 类: `tls.SecurePair` {#class-tlssecurepair}

**新增于: v0.3.2**

**已弃用自: v0.11.3**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 代替。
:::

由 [`tls.createSecurePair()`](/zh/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options) 返回。

### 事件: `'secure'` {#event-secure}

**新增于: v0.3.2**

**已弃用自: v0.11.3**

一旦建立安全连接，`'secure'` 事件将由 `SecurePair` 对象发出。

与检查服务器 [`'secureConnection'`](/zh/nodejs/api/tls#event-secureconnection) 事件一样，应检查 `pair.cleartext.authorized` 以确认所使用的证书是否已正确授权。

## 类: `tls.Server` {#class-tlsserver}

**新增于: v0.3.2**

- 继承自: [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

接受使用 TLS 或 SSL 加密的连接。

### 事件: `'connection'` {#event-connection}

**新增于: v0.3.2**

- `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

此事件在新 TCP 流建立时发出，在 TLS 握手开始之前。 `socket` 通常是 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 类型的对象，但与从 [`net.Server`](/zh/nodejs/api/net#class-netserver) `'connection'` 事件创建的套接字不同，它不会接收事件。 通常，用户不希望访问此事件。

用户也可以显式发出此事件，以将连接注入到 TLS 服务器中。 在这种情况下，可以传递任何 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。


### Event: `'keylog'` {#event-keylog}

**添加于: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) ASCII 文本行，采用 NSS `SSLKEYLOGFILE` 格式。
- `tlsSocket` [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 生成该行的 `tls.TLSSocket` 实例。

当连接到此服务器时生成或接收到密钥材料时（通常在握手完成之前，但不一定），会发出 `keylog` 事件。可以存储此密钥材料以进行调试，因为它允许解密捕获的 TLS 流量。每个套接字可能会发出多次。

一个典型的用例是将接收到的行追加到公共文本文件中，该文件稍后被软件（如 Wireshark）用来解密流量：

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // 只记录特定 IP 的密钥
  logFile.write(line);
});
```
### Event: `'newSession'` {#event-newsession}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v0.11.12 | 现在支持 `callback` 参数。 |
| v0.9.2 | 添加于: v0.9.2 |
:::

当创建新的 TLS 会话时，会发出 `'newSession'` 事件。这可用于将会话存储在外部存储中。该数据应提供给 [`'resumeSession'`](/zh/nodejs/api/tls#event-resumesession) 回调。

调用侦听器回调时，将传递三个参数：

- `sessionId` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) TLS 会话标识符
- `sessionData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) TLS 会话数据
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个不接受任何参数的回调函数，必须调用该函数才能通过安全连接发送或接收数据。

监听此事件只会影响在添加事件侦听器之后建立的连接。

### Event: `'OCSPRequest'` {#event-ocsprequest}

**添加于: v0.11.13**

当客户端发送证书状态请求时，会发出 `'OCSPRequest'` 事件。调用侦听器回调时，将传递三个参数：

- `certificate` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 服务器证书
- `issuer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 颁发者的证书
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 必须调用以提供 OCSP 请求结果的回调函数。

可以解析服务器的当前证书以获取 OCSP URL 和证书 ID；获得 OCSP 响应后，将调用 `callback(null, resp)`，其中 `resp` 是一个包含 OCSP 响应的 `Buffer` 实例。`certificate` 和 `issuer` 都是主证书和颁发者证书的 `Buffer` DER 表示形式。这些可用于获取 OCSP 证书 ID 和 OCSP 端点 URL。

或者，可以调用 `callback(null, null)`，表明没有 OCSP 响应。

调用 `callback(err)` 将导致 `socket.destroy(err)` 调用。

OCSP 请求的典型流程如下：

如果证书是自签名证书，或者颁发者不在根证书列表中，则 `issuer` 可以为 `null`。（建立 TLS 连接时，可以通过 `ca` 选项提供颁发者。）

监听此事件只会影响在添加事件侦听器之后建立的连接。

可以使用像 [asn1.js](https://www.npmjs.com/package/asn1.js) 这样的 npm 模块来解析证书。


### 事件: `'resumeSession'` {#event-resumesession}

**加入于: v0.9.2**

当客户端请求恢复之前的 TLS 会话时，会触发 `'resumeSession'` 事件。监听器回调函数在被调用时会传入两个参数：

- `sessionId` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) TLS 会话标识符
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，当之前的会话被恢复后调用：`callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  
 

事件监听器应该使用给定的 `sessionId` 在外部存储中查找由 [`'newSession'`](/zh/nodejs/api/tls#event-newsession) 事件处理程序保存的 `sessionData`。 如果找到，调用 `callback(null, sessionData)` 以恢复会话。 如果未找到，则无法恢复会话。 必须在没有 `sessionData` 的情况下调用 `callback()`，以便握手可以继续并创建一个新会话。 可以调用 `callback(err)` 以终止传入的连接并销毁套接字。

监听此事件只会对添加事件监听器后建立的连接产生影响。

以下演示了恢复 TLS 会话：

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### 事件: `'secureConnection'` {#event-secureconnection}

**加入于: v0.3.2**

当新连接的握手过程成功完成后，会触发 `'secureConnection'` 事件。 监听器回调函数在被调用时会传入一个参数：

- `tlsSocket` [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 已建立的 TLS 套接字。

`tlsSocket.authorized` 属性是一个 `boolean` 值，指示客户端是否已通过服务器提供的证书颁发机构之一进行验证。 如果 `tlsSocket.authorized` 为 `false`，则 `socket.authorizationError` 将被设置为描述授权失败的原因。 根据 TLS 服务器的设置，未经授权的连接仍可能被接受。

`tlsSocket.alpnProtocol` 属性是一个字符串，包含所选的 ALPN 协议。 当 ALPN 没有选择协议，因为客户端或服务器没有发送 ALPN 扩展时，`tlsSocket.alpnProtocol` 等于 `false`。

`tlsSocket.servername` 属性是一个字符串，包含通过 SNI 请求的服务器名称。


### 事件: `'tlsClientError'` {#event-tlsclienterror}

**加入版本: v6.0.0**

当安全连接建立之前发生错误时，会触发 `'tlsClientError'` 事件。监听器回调函数在调用时会传递两个参数：

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 描述错误的 `Error` 对象
- `tlsSocket` [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 产生错误的 `tls.TLSSocket` 实例。

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**加入版本: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个 SNI 主机名或通配符 (例如 `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 一个包含 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) `options` 参数中任何可能属性的对象 (例如 `key`、`cert`、`ca` 等)，或一个使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 创建的 TLS 上下文对象。

`server.addContext()` 方法添加一个安全上下文，如果客户端请求的 SNI 名称与提供的 `hostname`（或通配符）匹配，则将使用该上下文。

当有多个匹配的上下文时，使用最近添加的上下文。

### `server.address()` {#serveraddress}

**加入版本: v0.6.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回操作系统报告的服务器绑定地址、地址族名称和端口。 更多信息请参见 [`net.Server.address()`](/zh/nodejs/api/net#serveraddress)。

### `server.close([callback])` {#serverclosecallback}

**加入版本: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个监听器回调函数，将被注册以监听服务器实例的 `'close'` 事件。
- 返回: [\<tls.Server\>](/zh/nodejs/api/tls#class-tlsserver)

`server.close()` 方法停止服务器接受新的连接。

此函数以异步方式运行。 当服务器没有更多打开的连接时，将发出 `'close'` 事件。


### `server.getTicketKeys()` {#servergetticketkeys}

**Added in: v3.0.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 一个包含会话票证密钥的 48 字节缓冲区。

返回会话票证密钥。

更多信息请参见 [会话恢复](/zh/nodejs/api/tls#session-resumption)。

### `server.listen()` {#serverlisten}

开始监听加密连接的服务器。 此方法与 [`net.Server`](/zh/nodejs/api/net#class-netserver) 中的 [`server.listen()`](/zh/nodejs/api/net#serverlisten) 相同。

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Added in: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个对象，包含来自 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) `options` 参数的任何可能属性（例如，`key`，`cert`，`ca` 等）。

`server.setSecureContext()` 方法替换现有服务器的安全上下文。 现有到服务器的连接不会中断。

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Added in: v3.0.0**

- `keys` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 一个包含会话票证密钥的 48 字节缓冲区。

设置会话票证密钥。

对票证密钥的更改仅对未来的服务器连接有效。 现有或当前待处理的服务器连接将使用先前的密钥。

更多信息请参见 [会话恢复](/zh/nodejs/api/tls#session-resumption)。

## Class: `tls.TLSSocket` {#class-tlstlssocket}

**Added in: v0.11.4**

- 继承自: [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

执行写入数据的透明加密和所有必需的 TLS 协商。

`tls.TLSSocket` 的实例实现了双工 [Stream](/zh/nodejs/api/stream#stream) 接口。

返回 TLS 连接元数据的方法（例如 [`tls.TLSSocket.getPeerCertificate()`](/zh/nodejs/api/tls#tlssocketgetpeercertificatedetailed)）仅在连接打开时才返回数据。


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.2.0 | 现在支持 `enableTrace` 选项。 |
| v5.0.0 | 现在支持 ALPN 选项。 |
| v0.11.4 | 添加于: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 在服务器端，任何 `Duplex` 流。 在客户端，任何 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的实例 (为了在客户端支持通用的 `Duplex` 流，必须使用 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback))。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: SSL/TLS 协议是不对称的，TLSSocket 必须知道它们是作为服务器还是客户端。 如果 `true`，则 TLS 套接字将实例化为服务器。 **默认值:** `false`。
    - `server` [\<net.Server\>](/zh/nodejs/api/net#class-netserver) 一个 [`net.Server`](/zh/nodejs/api/net#class-netserver) 实例。
    - `requestCert`: 是否通过请求证书来验证远程对等方。 客户端始终请求服务器证书。 服务器 ( `isServer` 为 true) 可以将 `requestCert` 设置为 true 以请求客户端证书。
    - `rejectUnauthorized`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 一个包含 TLS 会话的 `Buffer` 实例。
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定 OCSP 状态请求扩展将添加到客户端 hello，并且在建立安全通信之前，将在套接字上发出 `'OCSPResponse'` 事件
    - `secureContext`: 使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 创建的 TLS 上下文对象。 如果 *未* 提供 `secureContext`，则将通过将整个 `options` 对象传递给 `tls.createSecureContext()` 来创建一个。
    - ...: 如果缺少 `secureContext` 选项，则使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 选项。 否则，它们将被忽略。

从现有的 TCP 套接字构造一个新的 `tls.TLSSocket` 对象。


### 事件: `'keylog'` {#event-keylog_1}

**新增于: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) ASCII 文本行，采用 NSS `SSLKEYLOGFILE` 格式。

当套接字生成或接收到密钥材料时，`keylog` 事件会在 `tls.TLSSocket` 上发出。可以存储此密钥材料以进行调试，因为它允许解密捕获的 TLS 流量。它可能会在握手完成之前或之后多次发出。

一个典型的用例是将接收到的行附加到一个公共文本文件中，该文件稍后被软件（如 Wireshark）用于解密流量：

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### 事件: `'OCSPResponse'` {#event-ocspresponse}

**新增于: v0.11.13**

如果在创建 `tls.TLSSocket` 时设置了 `requestOCSP` 选项，并且已收到 OCSP 响应，则会发出 `'OCSPResponse'` 事件。调用侦听器回调时，会传递一个参数：

- `response` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 服务器的 OCSP 响应

通常，`response` 是服务器 CA 的数字签名对象，其中包含有关服务器证书吊销状态的信息。

### 事件: `'secureConnect'` {#event-secureconnect}

**新增于: v0.11.4**

当新连接的握手过程成功完成后，会发出 `'secureConnect'` 事件。无论服务器的证书是否经过授权，都将调用侦听器回调。客户端有责任检查 `tlsSocket.authorized` 属性，以确定服务器证书是否由指定的 CA 之一签名。如果 `tlsSocket.authorized === false`，则可以通过检查 `tlsSocket.authorizationError` 属性来找到错误。如果使用了 ALPN，则可以检查 `tlsSocket.alpnProtocol` 属性以确定协商的协议。

当使用 `new tls.TLSSocket()` 构造函数创建 [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket) 时，不会发出 `'secureConnect'` 事件。


### 事件: `'session'` {#event-session}

**加入版本: v11.10.0**

- `session` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

当新的会话或 TLS 票据可用时，客户端 `tls.TLSSocket` 上会发出 `'session'` 事件。 这可能发生在握手完成之前或之后，具体取决于协商的 TLS 协议版本。 该事件不会在服务器上发出，或者在未创建新会话时发出，例如，当连接恢复时。 对于某些 TLS 协议版本，该事件可能会多次发出，在这种情况下，所有会话都可以用于恢复。

在客户端上，可以将 `session` 提供给 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 的 `session` 选项以恢复连接。

有关更多信息，请参见 [会话恢复](/zh/nodejs/api/tls#session-resumption)。

对于 TLSv1.2 及更低版本，一旦握手完成，可以调用 [`tls.TLSSocket.getSession()`](/zh/nodejs/api/tls#tlssocketgetsession)。 对于 TLSv1.3，协议仅允许基于票据的恢复，发送多个票据，并且票据直到握手完成后才发送。 因此，必须等待 `'session'` 事件才能获取可恢复的会话。 应用程序应使用 `'session'` 事件而不是 `getSession()` 以确保它们适用于所有 TLS 版本。 仅期望获取或使用一个会话的应用程序应仅侦听此事件一次：

```js [ESM]
tlsSocket.once('session', (session) => {
  // 会话可以立即使用或稍后使用。
  tls.connect({
    session: session,
    // 其他连接选项...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.4.0 | `family` 属性现在返回一个字符串而不是一个数字。 |
| v18.0.0 | `family` 属性现在返回一个数字而不是一个字符串。 |
| v0.11.4 | 加入版本: v0.11.4 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回底层套接字的绑定 `address`、地址 `family` 名称和 `port`，由操作系统报告：`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**新增于: v0.11.4**

返回对等证书未被验证的原因。 仅当 `tlsSocket.authorized === false` 时，此属性才会被设置。

### `tlsSocket.authorized` {#tlssocketauthorized}

**新增于: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果对等证书由创建 `tls.TLSSocket` 实例时指定的 CA 之一签名，则此属性为 `true`，否则为 `false`。

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**新增于: v8.4.0**

禁用此 `TLSSocket` 实例的 TLS 重新协商。 调用后，尝试重新协商将在 `TLSSocket` 上触发 `'error'` 事件。

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**新增于: v12.2.0**

启用后，TLS 数据包跟踪信息将写入 `stderr`。 这可用于调试 TLS 连接问题。

输出格式与 `openssl s_client -trace` 或 `openssl s_server -trace` 的输出格式相同。 虽然它是由 OpenSSL 的 `SSL_trace()` 函数产生的，但该格式没有文档记录，可能会在没有通知的情况下发生变化，不应依赖它。

### `tlsSocket.encrypted` {#tlssocketencrypted}

**新增于: v0.11.4**

始终返回 `true`。 这可用于区分 TLS 套接字和常规 `net.Socket` 实例。

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**新增于: v13.10.0, v12.17.0**

- `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从密钥材料中检索的字节数
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 应用程序特定的标签，通常这将是来自 [IANA Exporter Label Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels) 的值。
- `context` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 可选地提供一个上下文。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 所需的密钥材料字节

密钥材料用于验证，以防止网络协议中的各种攻击，例如 IEEE 802.1X 的规范。

示例

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Example return value of keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
有关更多信息，请参阅 OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) 文档。


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Added in: v11.2.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回表示本地证书的对象。 返回的对象具有一些与证书字段相对应的属性。

有关证书结构的示例，请参见 [`tls.TLSSocket.getPeerCertificate()`](/zh/nodejs/api/tls#tlssocketgetpeercertificatedetailed)。

如果没有本地证书，将返回一个空对象。 如果套接字已被销毁，则将返回 `null`。

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.4.0, v12.16.0 | 以 `standardName` 返回 IETF 密码名称。 |
| v12.0.0 | 返回最小密码版本，而不是固定的字符串 (`'TLSv1/SSLv3'`)。 |
| v0.11.4 | 添加于: v0.11.4 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 密码套件的 OpenSSL 名称。
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 密码套件的 IETF 名称。
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 此密码套件支持的最小 TLS 协议版本。 有关实际协商的协议，请参见 [`tls.TLSSocket.getProtocol()`](/zh/nodejs/api/tls#tlssocketgetprotocol)。
  
 

返回一个包含有关协商的密码套件的信息的对象。

例如，带有 AES256-SHA 密码的 TLSv1.2 协议：

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
有关更多信息，请参见 [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name)。

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Added in: v5.0.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回一个对象，该对象表示客户端连接上[完全正向保密](/zh/nodejs/api/tls#perfect-forward-secrecy)中临时密钥交换的参数的类型、名称和大小。 当密钥交换不是临时的时，它返回一个空对象。 由于这仅在客户端套接字上受支持，因此如果在服务器套接字上调用，则返回 `null`。 支持的类型为 `'DH'` 和 `'ECDH'`。 仅当类型为 `'ECDH'` 时，`name` 属性才可用。

例如：`{ type: 'ECDH', name: 'prime256v1', size: 256 }`。


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**新增于: v9.9.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 作为 SSL/TLS 握手的一部分，最近发送到套接字的 `Finished` 消息，如果尚未发送任何 `Finished` 消息，则返回 `undefined`。

由于 `Finished` 消息是完整握手的消息摘要（对于 TLS 1.0 总共有 192 位，对于 SSL 3.0 更多），因此当不需要或不足以使用 SSL/TLS 提供的身份验证时，它们可以用于外部身份验证过程。

对应于 OpenSSL 中的 `SSL_get_finished` 例程，可用于实现 [RFC 5929](https://tools.ietf.org/html/rfc5929) 中的 `tls-unique` 通道绑定。

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**新增于: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则包含完整的证书链，否则仅包含对等方的证书。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 证书对象。

返回表示对等方证书的对象。 如果对等方未提供证书，则将返回一个空对象。 如果套接字已被销毁，则将返回 `null`。

如果请求了完整的证书链，则每个证书将包含一个 `issuerCertificate` 属性，其中包含表示其颁发者证书的对象。

#### 证书对象 {#certificate-object}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v19.1.0, v18.13.0 | 添加 "ca" 属性。 |
| v17.2.0, v16.14.0 | 添加 fingerprint512。 |
| v11.4.0 | 支持椭圆曲线公钥信息。 |
:::

证书对象具有对应于证书字段的属性。

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果是证书颁发机构 (CA)，则为 `true`，否则为 `false`。
- `raw` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) DER 编码的 X.509 证书数据。
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 证书主题，以国家 (`C`)、州/省 (`ST`)、城市 (`L`)、组织 (`O`)、组织单位 (`OU`) 和通用名称 (`CN`) 描述。 通用名称通常是具有 TLS 证书的 DNS 名称。 示例：`{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`。
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 证书颁发者，以与 `subject` 相同的术语描述。
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 证书有效的开始日期时间。
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 证书有效的结束日期时间。
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 证书序列号，作为十六进制字符串。 示例：`'B9B0D332A1AA5635'`。
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER 编码证书的 SHA-1 摘要。 它作为 `:` 分隔的十六进制字符串返回。 示例：`'2A:7A:C2:DD:...'`。
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER 编码证书的 SHA-256 摘要。 它作为 `:` 分隔的十六进制字符串返回。 示例：`'2A:7A:C2:DD:...'`。
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER 编码证书的 SHA-512 摘要。 它作为 `:` 分隔的十六进制字符串返回。 示例：`'2A:7A:C2:DD:...'`。
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (可选) 扩展密钥用法，一组 OID。
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (可选) 一个包含主题连接名称的字符串，是 `subject` 名称的替代方法。
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (可选) 一个描述 AuthorityInfoAccess 的数组，与 OCSP 一起使用。
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (可选) 颁发者证书对象。 对于自签名证书，这可能是一个循环引用。

证书可能包含有关公钥的信息，具体取决于密钥类型。

对于 RSA 密钥，可以定义以下属性：

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 位大小。 示例：`1024`。
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) RSA 指数，以十六进制数字表示的字符串。 示例：`'0x010001'`。
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) RSA 模数，作为十六进制字符串。 示例：`'B56CE45CB7...'`。
- `pubkey` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 公钥。

对于 EC 密钥，可以定义以下属性：

- `pubkey` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 公钥。
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密钥大小，以位为单位。 示例：`256`。
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (可选) 椭圆曲线的 OID 的 ASN.1 名称。 众所周知的曲线由 OID 标识。 虽然不常见，但曲线可能由其数学属性标识，在这种情况下它将没有 OID。 示例：`'prime256v1'`。
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (可选) 椭圆曲线的 NIST 名称（如果有）（并非所有众所周知的曲线都已由 NIST 分配名称）。 示例：`'P-256'`。

证书示例：

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**新增于: v9.9.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 作为 SSL/TLS 握手的一部分，期望或实际从套接字接收到的最新 `Finished` 消息，如果目前没有 `Finished` 消息，则返回 `undefined`。

由于 `Finished` 消息是完整握手的消息摘要（对于 TLS 1.0 总共有 192 位，对于 SSL 3.0 则更多），因此当不需要或不足以使用 SSL/TLS 提供的身份验证时，它们可用于外部身份验证过程。

对应于 OpenSSL 中的 `SSL_get_peer_finished` 例程，并且可以用于实现 [RFC 5929](https://tools.ietf.org/html/rfc5929) 中的 `tls-unique` 通道绑定。

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**新增于: v15.9.0**

- 返回: [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate)

返回对等证书作为 [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate) 对象。

如果没有对等证书，或者套接字已被销毁，将返回 `undefined`。

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**新增于: v5.7.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

返回一个字符串，其中包含当前连接的协商 SSL/TLS 协议版本。 对于尚未完成握手过程的已连接套接字，将返回值 `'unknown'`。 对于服务器套接字或已断开连接的客户端套接字，将返回值 `null`。

协议版本包括：

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

有关更多信息，请参见 OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) 文档。

### `tlsSocket.getSession()` {#tlssocketgetsession}

**新增于: v0.11.4**

- [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

如果未协商会话，则返回 TLS 会话数据，否则返回 `undefined`。 在客户端上，可以将数据提供给 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 的 `session` 选项以恢复连接。 在服务器上，它可能对调试有用。

有关更多信息，请参见[会话恢复](/zh/nodejs/api/tls#session-resumption)。

注意：`getSession()` 仅适用于 TLSv1.2 及更低版本。 对于 TLSv1.3，应用程序必须使用 [`'session'`](/zh/nodejs/api/tls#event-session) 事件（它也适用于 TLSv1.2 及更低版本）。


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**新增于: v12.11.0**

- 返回: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 服务端和客户端共享的签名算法列表，按偏好递减的顺序排列。

更多信息请参见 [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs)。

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**新增于: v0.11.4**

- [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

对于客户端，如果存在 TLS 会话票证，则返回该票证，否则返回 `undefined`。对于服务器，始终返回 `undefined`。

它可能对调试有用。

更多信息请参见 [会话恢复](/zh/nodejs/api/tls#session-resumption)。

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**新增于: v15.9.0**

- 返回: [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate)

将本地证书作为 [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate) 对象返回。

如果没有本地证书，或者套接字已被销毁，将返回 `undefined`。

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**新增于: v0.5.6**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果会话被重用，则返回 `true`，否则返回 `false`。

更多信息请参见 [会话恢复](/zh/nodejs/api/tls#session-resumption)。

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**新增于: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回本地 IP 地址的字符串表示形式。

### `tlsSocket.localPort` {#tlssocketlocalport}

**新增于: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回本地端口的数字表示形式。

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**新增于: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回远程 IP 地址的字符串表示形式。 例如，`'74.125.127.100'` 或 `'2001:4860:a005::68'`。


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**加入于: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回远程 IP 族的字符串表示形式。 `'IPv4'` 或 `'IPv6'`。

### `tlsSocket.remotePort` {#tlssocketremoteport}

**加入于: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回远程端口的数字表示形式。 例如，`443`。

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}

::: info [历史]
| 版本    | 变更                                                                                                |
| :------ | :-------------------------------------------------------------------------------------------------- |
| v18.0.0 | 将无效的回调传给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v0.11.8 | 加入于: v0.11.8                                                                                       |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不是 `false`，则服务器证书会针对提供的 CA 列表进行验证。 如果验证失败，则会发出 `'error'` 事件；`err.code` 包含 OpenSSL 错误代码。 **默认值:** `true`。
  - `requestCert`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 如果 `renegotiate()` 返回 `true`，则回调函数会附加到 `'secure'` 事件一次。 如果 `renegotiate()` 返回 `false`，则 `callback` 将在下一个 tick 中被调用，并带有一个错误，除非 `tlsSocket` 已被销毁，在这种情况下，根本不会调用 `callback`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果发起重新协商则为 `true`，否则为 `false`。

`tlsSocket.renegotiate()` 方法启动 TLS 重新协商过程。 完成后，`callback` 函数将传递一个参数，该参数要么是 `Error`（如果请求失败），要么是 `null`。

此方法可用于在建立安全连接后请求对等方的证书。

当作为服务器运行时，套接字将在 `handshakeTimeout` 超时后被销毁并出现错误。

对于 TLSv1.3，无法启动重新协商，该协议不支持。


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**新增于: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 一个对象，包含来自 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) `options` 的至少 `key` 和 `cert` 属性，或者是一个使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 创建的 TLS 上下文对象本身。

`tlsSocket.setKeyCert()` 方法设置用于套接字的私钥和证书。 如果你希望从 TLS 服务器的 `ALPNCallback` 中选择服务器证书，这主要很有用。

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**新增于: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最大 TLS 片段大小。 最大值为 `16384`。 **默认:** `16384`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`tlsSocket.setMaxSendFragment()` 方法设置最大 TLS 片段大小。 如果设置限制成功，则返回 `true`； 否则返回 `false`。

较小的片段大小会减少客户端的缓冲延迟：较大的片段由 TLS 层缓冲，直到收到整个片段并验证其完整性； 大片段可能会跨越多个往返行程，并且由于数据包丢失或重新排序，其处理可能会延迟。 但是，较小的片段会增加额外的 TLS 帧字节和 CPU 开销，这可能会降低整体服务器吞吐量。

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | 为了响应 CVE-2021-44531，已禁用对 `uniformResourceIdentifier` 主题备用名称的支持。 |
| v0.8.4 | 新增于: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要验证证书的主机名或 IP 地址。
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 代表对等证书的[证书对象](/zh/nodejs/api/tls#certificate-object)。
- 返回: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

验证证书 `cert` 是否颁发给 `hostname`。

返回 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象，如果失败，则用 `reason`、`host` 和 `cert` 填充它。 成功时，返回 [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)。

此函数旨在与传递给 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 的 `checkServerIdentity` 选项结合使用，因此它对[证书对象](/zh/nodejs/api/tls#certificate-object)进行操作。 对于其他目的，请考虑改用 [`x509.checkHost()`](/zh/nodejs/api/crypto#x509checkhostname-options)。

可以通过提供作为传递给 `tls.connect()` 的 `options.checkServerIdentity` 选项的替代函数来覆盖此函数。 覆盖函数当然可以调用 `tls.checkServerIdentity()`，以通过额外的验证来增强完成的检查。

仅当证书通过所有其他检查（例如由受信任的 CA 颁发 (`options.ca`)）时，才会调用此函数。

如果存在匹配的 `uniformResourceIdentifier` 主题备用名称，则早期版本的 Node.js 会错误地接受给定 `hostname` 的证书（请参阅 [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)）。 希望接受 `uniformResourceIdentifier` 主题备用名称的应用程序可以使用自定义 `options.checkServerIdentity` 函数来实现所需的行为。


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.1.0, v14.18.0 | 添加了 `onread` 选项。 |
| v14.1.0, v13.14.0 | 现在接受 `highWaterMark` 选项。 |
| v13.6.0, v12.16.0 | 现在支持 `pskCallback` 选项。 |
| v12.9.0 | 支持 `allowHalfOpen` 选项。 |
| v12.4.0 | 现在支持 `hints` 选项。 |
| v12.2.0 | 现在支持 `enableTrace` 选项。 |
| v11.8.0, v10.16.0 | 现在支持 `timeout` 选项。 |
| v8.0.0 | 现在支持 `lookup` 选项。 |
| v8.0.0 | `ALPNProtocols` 选项现在可以是 `TypedArray` 或 `DataView`。 |
| v5.0.0 | 现在支持 ALPN 选项。 |
| v5.3.0, v4.7.0 | 现在支持 `secureContext` 选项。 |
| v0.11.3 | 添加于: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 客户端应连接的主机。**默认值:** `'localhost'`。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 客户端应连接的端口。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 创建到路径的 Unix 套接字连接。 如果指定了此选项，则忽略 `host` 和 `port`。
    - `socket` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 在给定的套接字上建立安全连接，而不是创建新的套接字。 通常，这是 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的实例，但允许任何 `Duplex` 流。 如果指定了此选项，则忽略 `path`、`host` 和 `port`，但证书验证除外。 通常，套接字在传递给 `tls.connect()` 时已经连接，但可以稍后连接。 `socket` 的连接/断开/销毁是用户的责任； 调用 `tls.connect()` 不会导致调用 `net.connect()`。
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `false`，则当可读端结束时，套接字将自动结束可写端。 如果设置了 `socket` 选项，则此选项无效。 有关详细信息，请参阅 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的 `allowHalfOpen` 选项。 **默认值:** `false`。
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不是 `false`，则根据提供的 CA 列表验证服务器证书。 如果验证失败，则会发出 `'error'` 事件； `err.code` 包含 OpenSSL 错误代码。 **默认值:** `true`。
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 对于 TLS-PSK 协商，参见 [预共享密钥](/zh/nodejs/api/tls#pre-shared-keys)。
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 字符串、`Buffer`、`TypedArray` 或 `DataView` 的数组，或者包含支持的 ALPN 协议的单个 `Buffer`、`TypedArray` 或 `DataView`。 `Buffer` 应该具有 `[len][name][len][name]...` 格式，例如 `'\x08http/1.1\x08http/1.0'`，其中 `len` 字节是下一个协议名称的长度。 传递数组通常要简单得多，例如 `['http/1.1', 'http/1.0']`。 列表中较早的协议比列表中的较晚的协议具有更高的优先级。
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于 SNI（服务器名称指示）TLS 扩展的服务器名称。 它是要连接到的主机的名称，并且必须是主机名，而不是 IP 地址。 多宿主服务器可以使用它来选择要呈现给客户端的正确证书，参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 的 `SNICallback` 选项。
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，用于在检查服务器的主机名（或显式设置时提供的 `servername`）与证书时（代替内置的 `tls.checkServerIdentity()` 函数）。 如果验证失败，则应返回一个 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)。 如果 `servername` 和 `cert` 经过验证，则该方法应返回 `undefined`。
    - `session` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 一个 `Buffer` 实例，包含 TLS 会话。
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 接受 TLS 连接的 DH 参数的最小大小（以位为单位）。 当服务器提供的 DH 参数的大小小于 `minDHSize` 时，TLS 连接将被销毁并抛出错误。 **默认值:** `1024`。
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 与可读流 `highWaterMark` 参数一致。 **默认值:** `16 * 1024`。
    - `secureContext`: 使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 创建的 TLS 上下文对象。 如果 *未* 提供 `secureContext`，则将通过将整个 `options` 对象传递给 `tls.createSecureContext()` 来创建一个。
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果缺少 `socket` 选项，则传入的数据存储在单个 `buffer` 中，并在数据到达套接字时传递给提供的 `callback`，否则将忽略该选项。 有关详细信息，请参阅 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 的 `onread` 选项。
    - ...: 如果缺少 `secureContext` 选项，则使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 选项，否则忽略它们。
    - ...: 任何尚未列出的 [`socket.connect()`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 选项。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

如果指定了 `callback` 函数，它将被添加为 [`'secureConnect'`](/zh/nodejs/api/tls#event-secureconnect) 事件的监听器。

`tls.connect()` 返回一个 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 对象。

与 `https` API 不同，默认情况下 `tls.connect()` 不启用 SNI（服务器名称指示）扩展，这可能会导致某些服务器返回不正确的证书或完全拒绝连接。 要启用 SNI，除了 `host` 之外，还要设置 `servername` 选项。

以下示例说明了 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 中的 echo 服务器示例的客户端：

::: code-group
```js [ESM]
// 假定一个 echo 服务器正在端口 8000 上监听。
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // 仅当服务器需要客户端证书身份验证时才需要。
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // 仅当服务器使用自签名证书时才需要。
  ca: [ readFileSync('server-cert.pem') ],

  // 仅当服务器的证书不适用于“localhost”时才需要。
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```

```js [CJS]
// 假定一个 echo 服务器正在端口 8000 上监听。
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // 仅当服务器需要客户端证书身份验证时才需要。
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // 仅当服务器使用自签名证书时才需要。
  ca: [ readFileSync('server-cert.pem') ],

  // 仅当服务器的证书不适用于“localhost”时才需要。
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```
:::

要为此示例生成证书和密钥，请运行：

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
然后，要为此示例生成 `server-cert.pem` 证书，请运行：

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Added in: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.path` 的默认值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback)。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 参见 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback)。
- 返回: [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

与 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 相同，除了 `path` 可以作为参数而不是选项提供。

如果指定了 path 选项，它将优先于 path 参数。

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Added in: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `options.port` 的默认值。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.host` 的默认值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback)。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 参见 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback)。
- 返回: [\<tls.TLSSocket\>](/zh/nodejs/api/tls#class-tlstlssocket)

与 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 相同，除了 `port` 和 `host` 可以作为参数而不是选项提供。

如果指定了 port 或 host 选项，它将优先于任何 port 或 host 参数。

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.9.0, v20.18.0 | 添加了 `allowPartialTrustChain` 选项。 |
| v22.4.0, v20.16.0 | `clientCertEngine`、`privateKeyEngine` 和 `privateKeyIdentifier` 选项依赖于 OpenSSL 中的自定义引擎支持，该支持在 OpenSSL 3 中已弃用。 |
| v19.8.0, v18.16.0 | 现在可以将 `dhparam` 选项设置为 `'auto'` 以启用具有适当已知参数的 DHE。 |
| v12.12.0 | 添加了 `privateKeyIdentifier` 和 `privateKeyEngine` 选项以从 OpenSSL 引擎获取私钥。 |
| v12.11.0 | 添加了 `sigalgs` 选项以覆盖支持的签名算法。 |
| v12.0.0 | 添加了 TLSv1.3 支持。 |
| v11.5.0 | `ca:` 选项现在支持 `BEGIN TRUSTED CERTIFICATE`。 |
| v11.4.0, v10.16.0 | `minVersion` 和 `maxVersion` 可用于限制允许的 TLS 协议版本。 |
| v10.0.0 | 由于 OpenSSL 中的更改，`ecdhCurve` 不能再设置为 `false`。 |
| v9.3.0 | `options` 参数现在可以包括 `clientCertEngine`。 |
| v9.0.0 | `ecdhCurve` 选项现在可以是多个以 `':'` 分隔的曲线名称或 `'auto'`。 |
| v7.3.0 | 如果 `key` 选项是一个数组，则单个条目不再需要 `passphrase` 属性。 `Array` 条目现在也可以只是 `string` 或 `Buffer`。 |
| v5.2.0 | `ca` 选项现在可以是包含多个 CA 证书的单个字符串。 |
| v0.11.13 | 添加于: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 将信任 CA 证书列表中的中间（非自签名）证书视为可信。
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) 可选地覆盖受信任的 CA 证书。 默认是信任 Mozilla 策划的众所周知的 CA。 当使用此选项显式指定 CA 时，Mozilla 的 CA 将被完全替换。 该值可以是字符串或 `Buffer`，也可以是字符串和/或 `Buffer` 的 `Array`。 任何字符串或 `Buffer` 都可以包含多个 PEM CA 串联在一起。 对等方的证书必须可链接到服务器信任的 CA，才能验证连接。 当使用不可链接到众所周知的 CA 的证书时，证书的 CA 必须显式指定为可信，否则连接将无法验证。 如果对等方使用的证书与默认 CA 中的一个不匹配或链接到默认 CA，请使用 `ca` 选项提供对等方的证书可以匹配或链接到的 CA 证书。 对于自签名证书，该证书是其自身的 CA，并且必须提供。 对于 PEM 编码的证书，支持的类型为“TRUSTED CERTIFICATE”、“X509 CERTIFICATE”和“CERTIFICATE”。 另请参见 [`tls.rootCertificates`](/zh/nodejs/api/tls#tlsrootcertificates)。
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) PEM 格式的证书链。 每个私钥应提供一个证书链。 每个证书链应由提供的私钥的 PEM 格式证书组成 `key`，后跟 PEM 格式的中间证书（如果有），按顺序排列，不包括根 CA（根 CA 必须预先为对等方所知，请参阅 `ca`）。 当提供多个证书链时，它们不必与其私钥在 `key` 中的顺序相同。 如果未提供中间证书，对等方将无法验证证书，并且握手将失败。
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 支持的签名算法的冒号分隔列表。 该列表可以包含摘要算法（`SHA256`、`MD5` 等）、公钥算法（`RSA-PSS`、`ECDSA` 等）、两者组合（例如“RSA+SHA384”）或 TLS v1.3 方案名称（例如 `rsa_pss_pss_sha512`）。 有关更多信息，请参阅 [OpenSSL 手册页](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list)。
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 密码套件规范，替换默认值。 有关更多信息，请参阅[修改默认 TLS 密码套件](/zh/nodejs/api/tls#modifying-the-default-tls-cipher-suite)。 允许的密码可以通过 [`tls.getCiphers()`](/zh/nodejs/api/tls#tlsgetciphers) 获取。 密码名称必须大写，以便 OpenSSL 接受它们。
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可以提供客户端证书的 OpenSSL 引擎的名称。 **已弃用。**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) PEM 格式的 CRL（证书撤销列表）。
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `'auto'` 或自定义 Diffie-Hellman 参数，非 ECDHE [完全正向保密](/zh/nodejs/api/tls#perfect-forward-secrecy)所必需。 如果省略或无效，则会静默丢弃参数，并且 DHE 密码将不可用。 基于 [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) 的[完全正向保密](/zh/nodejs/api/tls#perfect-forward-secrecy)仍然可用。
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个字符串，用于描述命名曲线或以冒号分隔的曲线 NID 或名称列表，例如 `P-521:P-384:P-256`，用于 ECDH 密钥协议。 设置为 `auto` 以自动选择曲线。 使用 [`crypto.getCurves()`](/zh/nodejs/api/crypto#cryptogetcurves) 获取可用曲线名称的列表。 在最近的版本中，`openssl ecparam -list_curves` 还会显示每个可用椭圆曲线的名称和描述。 **默认值:** [`tls.DEFAULT_ECDH_CURVE`](/zh/nodejs/api/tls#tlsdefault_ecdh_curve)。
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 尝试使用服务器的密码套件首选项而不是客户端的首选项。 当为 `true` 时，会导致在 `secureOptions` 中设置 `SSL_OP_CIPHER_SERVER_PREFERENCE`，有关更多信息，请参见 [OpenSSL 选项](/zh/nodejs/api/crypto#openssl-options)。
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM 格式的私钥。 PEM 允许私钥被加密的选项。 加密的密钥将使用 `options.passphrase` 解密。 可以提供使用不同算法的多个密钥，可以作为未加密的密钥字符串或缓冲区的数组，也可以作为 `{pem: \<string|buffer\>[, passphrase: \<string\>]}` 形式的对象的数组。 对象形式只能出现在数组中。 `object.passphrase` 是可选的。 如果提供了 `object.passphrase`，加密的密钥将使用它解密，否则使用 `options.passphrase`。
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 从中获取私钥的 OpenSSL 引擎的名称。 应该与 `privateKeyIdentifier` 一起使用。 **已弃用。**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 由 OpenSSL 引擎管理的私钥的标识符。 应该与 `privateKeyEngine` 一起使用。 不应与 `key` 一起设置，因为这两个选项以不同的方式定义私钥。 **已弃用。**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选地设置允许的最大 TLS 版本。 值为 `'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'` 或 `'TLSv1'` 之一。 不能与 `secureProtocol` 选项一起指定； 使用其中一个。 **默认值:** [`tls.DEFAULT_MAX_VERSION`](/zh/nodejs/api/tls#tlsdefault_max_version)。
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选地设置允许的最小 TLS 版本。 值为 `'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'` 或 `'TLSv1'` 之一。 不能与 `secureProtocol` 选项一起指定； 使用其中一个。 避免设置为小于 TLSv1.2，但互操作性可能需要这样做。 低于 TLSv1.2 的版本可能需要降级 [OpenSSL 安全级别](/zh/nodejs/api/tls#openssl-security-level)。 **默认值:** [`tls.DEFAULT_MIN_VERSION`](/zh/nodejs/api/tls#tlsdefault_min_version)。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于单个私钥和/或 PFX 的共享密码。
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PFX 或 PKCS12 编码的私钥和证书链。 `pfx` 是单独提供 `key` 和 `cert` 的替代方法。 PFX 通常是加密的，如果是，则将使用 `passphrase` 解密它。 可以提供多个 PFX，可以作为未加密的 PFX 缓冲区的数组，也可以作为 `{buf: \<string|buffer\>[, passphrase: \<string\>]}` 形式的对象的数组。 对象形式只能出现在数组中。 `object.passphrase` 是可选的。 如果提供了 `object.passphrase`，加密的 PFX 将使用它解密，否则使用 `options.passphrase`。
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选地影响 OpenSSL 协议行为，这通常不是必需的。 应该小心使用！ 该值是来自 [OpenSSL 选项](/zh/nodejs/api/crypto#openssl-options) 的 `SSL_OP_*` 选项的数字位掩码。
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于选择要使用的 TLS 协议版本的传统机制，它不支持独立控制最小和最大版本，并且不支持将协议限制为 TLSv1.3。 请改用 `minVersion` 和 `maxVersion`。 可能的值列为 [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods)，使用函数名称作为字符串。 例如，使用 `'TLSv1_1_method'` 强制使用 TLS 版本 1.1，或使用 `'TLS_method'` 允许任何 TLS 协议版本，最高可达 TLSv1.3。 不建议使用低于 1.2 的 TLS 版本，但互操作性可能需要这样做。 **默认值:** 无，请参阅 `minVersion`。
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 服务器使用的不透明标识符，以确保会话状态不在应用程序之间共享。 客户端未使用。
    - `ticketKeys`: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 48 字节的密码学上强的伪随机数据。 有关更多信息，请参阅[会话恢复](/zh/nodejs/api/tls#session-resumption)。
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 服务器创建的 TLS 会话不再可恢复的秒数。 有关更多信息，请参阅[会话恢复](/zh/nodejs/api/tls#session-resumption)。 **默认值:** `300`。

[`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 将 `honorCipherOrder` 选项的默认值设置为 `true`，其他创建安全上下文的 API 将其保留为未设置。

[`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 使用从 `process.argv` 生成的 128 位截断的 SHA1 哈希值作为 `sessionIdContext` 选项的默认值，其他创建安全上下文的 API 没有默认值。

`tls.createSecureContext()` 方法创建一个 `SecureContext` 对象。 它可以作为几个 `tls` API 的参数使用，例如 [`server.addContext()`](/zh/nodejs/api/tls#serveraddcontexthostname-context)，但没有公共方法。 [`tls.Server`](/zh/nodejs/api/tls#class-tlsserver) 构造函数和 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 方法不支持 `secureContext` 选项。

对于使用证书的密码，密钥是*必需的*。 可以使用 `key` 或 `pfx` 来提供它。

如果未给出 `ca` 选项，则 Node.js 默认使用 [Mozilla 公开信任的 CA 列表](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt)。

不鼓励使用自定义 DHE 参数，而建议使用新的 `dhparam: 'auto'` 选项。 当设置为 `'auto'` 时，将自动选择足够强度的已知 DHE 参数。 否则，如果必要，可以使用 `openssl dhparam` 创建自定义参数。 密钥长度必须大于或等于 1024 位，否则将引发错误。 虽然允许 1024 位，但为了更强的安全性，请使用 2048 位或更大。


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v5.0.0 | 现在支持 ALPN 选项。 |
| v0.11.3 | 已弃用，自：v0.11.3 |
| v0.3.2 | 添加于：v0.3.2 |
:::

::: danger [稳定度：0 - 已弃用]
[稳定度：0](/zh/nodejs/api/documentation#stability-index) [稳定度：0](/zh/nodejs/api/documentation#stability-index) - 已弃用：请改用 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket)。
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个由 `tls.createSecureContext()` 返回的安全上下文对象
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 表示此 TLS 连接应作为服务器打开。
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 表示服务器是否应向连接的客户端请求证书。 仅在 `isServer` 为 `true` 时适用。
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不是 `false`，服务器会自动拒绝具有无效证书的客户端。 仅在 `isServer` 为 `true` 时适用。
- `options`
    - `enableTrace`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: 来自 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 TLS 上下文对象
    - `isServer`: 如果为 `true`，则 TLS 套接字将在服务器模式下实例化。 **默认值：** `false`。
    - `server` [\<net.Server\>](/zh/nodejs/api/net#class-netserver) 一个 [`net.Server`](/zh/nodejs/api/net#class-netserver) 实例
    - `requestCert`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: 参见 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 包含 TLS 会话的 `Buffer` 实例。
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则指定 OCSP 状态请求扩展将被添加到客户端 hello，并且在建立安全通信之前，将在套接字上发出一个 `'OCSPResponse'` 事件。

创建一个新的安全对对象，其中包含两个流，一个流读取和写入加密数据，另一个流读取和写入明文数据。 通常，加密流通过管道连接到传入/传出的加密数据流，而明文流用作初始加密流的替代。

`tls.createSecurePair()` 返回一个具有 `cleartext` 和 `encrypted` 流属性的 `tls.SecurePair` 对象。

使用 `cleartext` 具有与 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 相同的 API。

`tls.createSecurePair()` 方法现在已被弃用，推荐使用 `tls.TLSSocket()`。 例如，代码：

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
可以替换为：

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
其中 `secureSocket` 具有与 `pair.cleartext` 相同的 API。


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine` 选项依赖于 OpenSSL 中的自定义引擎支持，该支持在 OpenSSL 3 中已弃用。 |
| v19.0.0 | 如果设置了 `ALPNProtocols`，则发送没有受支持协议的 ALPN 扩展的传入连接将以致命的 `no_application_protocol` 警报终止。 |
| v20.4.0, v18.19.0 | `options` 参数现在可以包含 `ALPNCallback`。 |
| v12.3.0 | `options` 参数现在支持 `net.createServer()` 选项。 |
| v9.3.0 | `options` 参数现在可以包含 `clientCertEngine`。 |
| v8.0.0 | `ALPNProtocols` 选项现在可以是 `TypedArray` 或 `DataView`。 |
| v5.0.0 | 现在支持 ALPN 选项。 |
| v0.3.2 | 添加于: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 字符串、`Buffer`、`TypedArray` 或 `DataView` 的数组，或者包含受支持的 ALPN 协议的单个 `Buffer`、`TypedArray` 或 `DataView`。 `Buffer` 应采用 `[len][name][len][name]...` 格式，例如 `0x05hello0x05world`，其中第一个字节是下一个协议名称的长度。 传递数组通常更简单，例如 `['hello', 'world']`。（协议应按其优先级排序。）
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 如果设置，当客户端使用 ALPN 扩展打开连接时，将调用此函数。 将向回调传递一个参数：一个包含 `servername` 和 `protocols` 字段的对象，分别包含来自 SNI 扩展（如果有）的服务器名称和 ALPN 协议名称字符串的数组。 回调必须返回 `protocols` 中列出的字符串之一，该字符串将作为选定的 ALPN 协议返回给客户端，或者返回 `undefined`，以致命警报拒绝连接。 如果返回的字符串与客户端的 ALPN 协议之一不匹配，则会引发错误。 此选项不能与 `ALPNProtocols` 选项一起使用，并且设置两个选项都会引发错误。
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可以提供客户端证书的 OpenSSL 引擎的名称。 **已弃用。**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则将在新连接上调用 [`tls.TLSSocket.enableTrace()`](/zh/nodejs/api/tls#tlssocketenabletrace)。 可以在建立安全连接后启用跟踪，但必须使用此选项来跟踪安全连接设置。 **默认值:** `false`。
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果 SSL/TLS 握手未在指定的毫秒数内完成，则中止连接。 每当握手超时时，都会在 `tls.Server` 对象上发出 `'tlsClientError'`。 **默认值:** `120000`（120 秒）。
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果不为 `false`，服务器将拒绝任何未经提供的 CA 列表授权的连接。 此选项仅在 `requestCert` 为 `true` 时才有效。 **默认值:** `true`。
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，服务器将请求连接的客户端提供证书，并尝试验证该证书。 **默认值:** `false`。
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 服务器创建的 TLS 会话在多少秒后不再可恢复。 有关更多信息，请参见[会话恢复](/zh/nodejs/api/tls#session-resumption)。 **默认值:** `300`。
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 如果客户端支持 SNI TLS 扩展，将调用该函数。 调用时将传递两个参数：`servername` 和 `callback`。 `callback` 是一个错误优先的回调，它接受两个可选参数：`error` 和 `ctx`。 `ctx`（如果提供）是 `SecureContext` 实例。 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 可用于获取正确的 `SecureContext`。 如果使用 falsy `ctx` 参数调用 `callback`，则将使用服务器的默认安全上下文。 如果未提供 `SNICallback`，则将使用带有高级 API 的默认回调（见下文）。
    - `ticketKeys`: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 48 字节的密码学上强的伪随机数据。 有关更多信息，请参见[会话恢复](/zh/nodejs/api/tls#session-resumption)。
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 对于 TLS-PSK 协商，请参见[预共享密钥](/zh/nodejs/api/tls#pre-shared-keys)。
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选提示，发送给客户端以帮助在 TLS-PSK 协商期间选择身份。 在 TLS 1.3 中将被忽略。 如果无法设置 pskIdentityHint，将发出代码为 `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'` 的 `'tlsClientError'`。
    - ...: 可以提供任何 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 选项。 对于服务器，通常需要身份选项（`pfx`、`key`/`cert` 或 `pskCallback`）。
    - ...: 可以提供任何 [`net.createServer()`](/zh/nodejs/api/net#netcreateserveroptions-connectionlistener) 选项。


- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<tls.Server\>](/zh/nodejs/api/tls#class-tlsserver)

创建一个新的 [`tls.Server`](/zh/nodejs/api/tls#class-tlsserver)。 如果提供了 `secureConnectionListener`，则会自动将其设置为 [`'secureConnection'`](/zh/nodejs/api/tls#event-secureconnection) 事件的侦听器。

`ticketKeys` 选项在 `node:cluster` 模块工作进程之间自动共享。

以下说明了一个简单的回显服务器：

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // 仅在使用客户端证书认证时才需要。
  requestCert: true,

  // 仅当客户端使用自签名证书时才需要。
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // 仅在使用客户端证书认证时才需要。
  requestCert: true,

  // 仅当客户端使用自签名证书时才需要。
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```
:::

要为此示例生成证书和密钥，请运行：

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
然后，要为此示例生成 `client-cert.pem` 证书，请运行：

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
可以使用 [`tls.connect()`](/zh/nodejs/api/tls#tlsconnectoptions-callback) 中的示例客户端连接到服务器来对其进行测试。


## `tls.getCiphers()` {#tlsgetciphers}

**新增于: v0.10.2**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个包含支持的 TLS 密码套件名称的数组。 由于历史原因，这些名称是小写的，但必须大写才能在 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 `ciphers` 选项中使用。

并非所有支持的密码套件默认都启用。 参见 [修改默认 TLS 密码套件](/zh/nodejs/api/tls#modifying-the-default-tls-cipher-suite)。

以 `'tls_'` 开头的密码套件名称用于 TLSv1.3，所有其他密码套件名称用于 TLSv1.2 及更低版本。

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**新增于: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

一个不可变的字符串数组，表示来自捆绑的 Mozilla CA 存储的根证书（以 PEM 格式），由当前的 Node.js 版本提供。

Node.js 提供的捆绑 CA 存储是 Mozilla CA 存储的快照，该快照在发布时是固定的。 它在所有受支持的平台上都是相同的。

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v10.0.0 | 默认值更改为 `'auto'`。 |
| v0.11.13 | 新增于: v0.11.13 |
:::

在 tls 服务器中用于 ECDH 密钥协商的默认曲线名称。 默认值为 `'auto'`。 更多信息参见 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions)。

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**新增于: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 `maxVersion` 选项的默认值。 它可以被赋值为任何支持的 TLS 协议版本，`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'` 或 `'TLSv1'`。 **默认值:** `'TLSv1.3'`，除非使用 CLI 选项更改。 使用 `--tls-max-v1.2` 将默认值设置为 `'TLSv1.2'`。 使用 `--tls-max-v1.3` 将默认值设置为 `'TLSv1.3'`。 如果提供了多个选项，则使用最高的上限。


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**新增于: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 `minVersion` 选项的默认值。 它可以被赋值为任何支持的 TLS 协议版本，`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'` 或 `'TLSv1'`。 TLSv1.2 之前的版本可能需要降低 [OpenSSL 安全级别](/zh/nodejs/api/tls#openssl-security-level)。 **默认值:** `'TLSv1.2'`，除非使用 CLI 选项更改。 使用 `--tls-min-v1.0` 将默认值设置为 `'TLSv1'`。 使用 `--tls-min-v1.1` 将默认值设置为 `'TLSv1.1'`。 使用 `--tls-min-v1.3` 将默认值设置为 `'TLSv1.3'`。 如果提供了多个选项，则使用最低的最小值。

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**新增于: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 `ciphers` 选项的默认值。 它可以被赋值为任何支持的 OpenSSL 密码。 默认为 `crypto.constants.defaultCoreCipherList` 的内容，除非使用 CLI 选项 `--tls-default-ciphers` 更改。

