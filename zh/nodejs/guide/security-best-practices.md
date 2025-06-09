---
title: Node.js 应用程序的安全最佳实践
description: 本文提供了一个全面指南，用于保护 Node.js 应用程序，涵盖了威胁建模、最佳实践以及缓解常见漏洞的方法，例如拒绝服务、DNS 重绑定和敏感信息泄露。
head:
  - - meta
    - name: og:title
      content: Node.js 应用程序的安全最佳实践 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本文提供了一个全面指南，用于保护 Node.js 应用程序，涵盖了威胁建模、最佳实践以及缓解常见漏洞的方法，例如拒绝服务、DNS 重绑定和敏感信息泄露。
  - - meta
    - name: twitter:title
      content: Node.js 应用程序的安全最佳实践 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本文提供了一个全面指南，用于保护 Node.js 应用程序，涵盖了威胁建模、最佳实践以及缓解常见漏洞的方法，例如拒绝服务、DNS 重绑定和敏感信息泄露。
---


# 安全最佳实践

### 意图

本文档旨在扩展当前的[威胁模型](/zh/nodejs/guide/security-best-practices#threat-model)，并提供关于如何保护 Node.js 应用程序的详细指南。

## 文档内容

- 最佳实践：一种简化和凝练的方式来查看最佳实践。我们可以使用[这个 issue](https://github.com/nodejs/security-wg/issues/488) 或[这个指南](https://github.com/goldbergyoni/nodebestpractices) 作为起点。重要的是要注意，本文档专门针对 Node.js，如果您正在寻找更广泛的内容，请考虑 [OSSF 最佳实践](https://github.com/ossf/wg-best-practices-os-developers)。
- 攻击解释：用简单的英语，并尽可能用一些代码示例，来说明和记录我们在威胁模型中提到的攻击。
- 第三方库：定义威胁（拼写错误攻击、恶意包...）和关于 node 模块依赖等的最佳实践...

## 威胁列表

### HTTP 服务器拒绝服务 (CWE-400)

这是一种攻击，由于处理传入 HTTP 请求的方式，应用程序变得不可用于其设计的目的。这些请求不必由恶意行为者故意制作：配置错误或有错误的客户端也可能向服务器发送导致拒绝服务的请求模式。

HTTP 请求由 Node.js HTTP 服务器接收，并通过注册的请求处理程序传递给应用程序代码。服务器不解析请求正文的内容。因此，在请求正文的内容传递给请求处理程序之后引起的任何 DoS 都不是 Node.js 本身的漏洞，因为正确处理它是应用程序代码的责任。

确保 WebServer 正确处理套接字错误，例如，当创建服务器时没有错误处理程序，它将容易受到 DoS 攻击。

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // 这可以防止服务器崩溃
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_如果执行了错误的请求，服务器可能会崩溃。_

Slowloris 是一种并非由请求内容引起的 DoS 攻击的例子。 在此攻击中，HTTP 请求发送缓慢且碎片化，一次发送一个片段。在完整请求传递之前，服务器将保持专用于正在进行的请求的资源。 如果同时发送足够的这些请求，并发连接的数量将很快达到最大值，从而导致拒绝服务。 这就是攻击如何不依赖于请求的内容，而是依赖于发送到服务器的请求的定时和模式。


#### 缓解措施

- 使用反向代理来接收并将请求转发到 Node.js 应用程序。反向代理可以提供缓存、负载均衡、IP 黑名单等功能，从而降低 DoS 攻击的有效性。
- 正确配置服务器超时，以便可以丢弃空闲或请求到达速度过慢的连接。请参阅 `http.Server` 中的不同超时设置，特别是 `headersTimeout`、`requestTimeout`、`timeout` 和 `keepAliveTimeout`。
- 限制每个主机和总共的打开套接字数量。请参阅 [http 文档](/zh/nodejs/api/http)，特别是 `agent.maxSockets`、`agent.maxTotalSockets`、`agent.maxFreeSockets` 和 `server.maxRequestsPerSocket`。

### DNS 重绑定 (CWE-346)

这是一种攻击，它可以使用 [--inspect 开关](/zh/nodejs/guide/debugging-nodejs) 针对启用调试检查器的 Node.js 应用程序。

由于在 Web 浏览器中打开的网站可以发出 WebSocket 和 HTTP 请求，因此它们可以针对本地运行的调试检查器。这通常会被现代浏览器实现的[同源策略](/zh/nodejs/guide/debugging-nodejs)阻止，该策略禁止脚本访问来自不同来源的资源（这意味着恶意网站无法读取从本地 IP 地址请求的数据）。

但是，通过 DNS 重绑定，攻击者可以暂时控制其请求的来源，使其看起来像是来自本地 IP 地址。这是通过控制一个网站和用于解析其 IP 地址的 DNS 服务器来实现的。有关更多详细信息，请参阅 [DNS 重绑定 wiki](https://en.wikipedia.org/wiki/DNS_rebinding)。

#### 缓解措施

- 通过附加 `process.on(‘SIGUSR1’, …)` 监听器到它，在 SIGUSR1 信号上禁用检查器。
- 不要在生产环境中运行检查器协议。

### 将敏感信息暴露给未经授权的行为者 (CWE-552)

当前目录中包含的所有文件和文件夹都会在软件包发布期间推送到 npm 注册表。

有一些机制可以通过使用 `.npmignore` 和 `.gitignore` 定义一个黑名单，或者在 `package.json` 中定义一个白名单来控制此行为。


#### 缓解措施

- 使用 `npm publish --dry-run` 列出所有要发布的文件。 确保在发布软件包之前检查内容。
- 创建和维护忽略文件（如 `.gitignore` 和 `.npmignore`）也很重要。 通过这些文件，您可以指定不应发布哪些文件/文件夹。 `package.json` 中的 [files 属性](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) 允许反向操作 – 允许列表。
- 如果发生泄露，请务必[取消发布软件包](https://docs.npmjs.com/unpublishing-packages-from-the-registry)。

### HTTP 请求走私 (CWE-444)

这是一种涉及两个 HTTP 服务器（通常是代理和 Node.js 应用程序）的攻击。 客户端发送一个 HTTP 请求，该请求首先通过前端服务器（代理），然后重定向到后端服务器（应用程序）。 当前端和后端以不同的方式解释模糊的 HTTP 请求时，攻击者有可能发送前端看不到但后端会看到的恶意消息，从而有效地将恶意消息“走私”通过代理服务器。

有关更详细的描述和示例，请参见 [CWE-444](https://cwe.mitre.org/data/definitions/444.html)。

由于此攻击取决于 Node.js 以不同于（任意）HTTP 服务器的方式解释 HTTP 请求，因此成功的攻击可能是由于 Node.js、前端服务器或两者中的漏洞造成的。 如果 Node.js 解释请求的方式与 HTTP 规范一致（请参阅 [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)），则它不被认为是 Node.js 中的漏洞。

#### 缓解措施

- 创建 HTTP 服务器时，请勿使用 `insecureHTTPParser` 选项。
- 配置前端服务器以标准化模糊的请求。
- 持续监控 Node.js 和所选前端服务器中新的 HTTP 请求走私漏洞。
- 如果可能，请使用端到端的 HTTP/2 并禁用 HTTP 降级。


### 通过时间攻击暴露信息 (CWE-208)

这是一种攻击，攻击者可以通过测量应用程序响应请求所需的时间来了解潜在的敏感信息。 这种攻击并非 Node.js 独有，几乎可以针对所有运行时环境。

当应用程序在时间敏感的操作（例如，分支）中使用密钥时，这种攻击是可能的。 考虑在典型应用程序中处理身份验证。 在这里，基本身份验证方法包括电子邮件和密码作为凭据。 用户信息是从用户提供的输入中检索的，理想情况下是从 DBMS 中检索的。 检索到用户信息后，将密码与从数据库检索到的用户信息进行比较。 对于相同长度的值，使用内置的字符串比较需要更长的时间。 当此比较运行在可接受的范围内时，会无意中增加请求的响应时间。 通过比较请求响应时间，攻击者可以在大量请求中猜测密码的长度和值。

#### 缓解措施

- crypto API 公开了一个函数 `timingSafeEqual`，用于使用恒定时间算法比较实际和预期的敏感值。
- 对于密码比较，您可以使用 [scrypt](/zh/nodejs/api/crypto)，它也可以在原生 crypto 模块上使用。
- 更一般地说，应避免在可变时间操作中使用密钥。 这包括基于密钥进行分支，以及当攻击者可能位于同一基础设施上（例如，同一云机器）时，使用密钥作为内存索引。 用 JavaScript 编写恒定时间代码很困难（部分原因是 JIT）。 对于加密应用程序，请使用内置的 crypto API 或 WebAssembly（对于本地未实现的算法）。

### 恶意第三方模块 (CWE-1357)

目前，在 Node.js 中，任何包都可以访问强大的资源，例如网络访问。 此外，由于它们也可以访问文件系统，因此它们可以将任何数据发送到任何地方。

运行到节点进程中的所有代码都有能力通过使用 `eval()`（或其等价物）加载和运行额外的任意代码。 所有具有文件系统写入权限的代码都可以通过写入新的或现有的加载文件来实现相同的目的。

Node.js 有一个实验性的¹ [策略机制](/zh/nodejs/api/permissions)，用于将加载的资源声明为不受信任或受信任。 但是，默认情况下未启用此策略。 请务必锁定依赖项版本，并使用常用工作流程或 npm 脚本运行自动漏洞检查。 在安装软件包之前，请确保维护该软件包并包含您期望的所有内容。 请注意，GitHub 源代码并不总是与发布的源代码相同，请在 `node_modules` 中进行验证。


#### 供应链攻击

针对 Node.js 应用程序的供应链攻击是指其依赖项（直接或传递依赖）之一受到破坏。这可能是由于应用程序对依赖项的规范过于宽松（允许不必要的更新）和/或规范中的常见拼写错误（容易受到[域名抢注](https://en.wikipedia.org/wiki/Typosquatting)的影响）。

控制上游软件包的攻击者可以发布一个包含恶意代码的新版本。如果 Node.js 应用程序依赖于该软件包，但未严格限制使用哪个版本是安全的，则该软件包可以自动更新到最新的恶意版本，从而危及应用程序。

在 `package.json` 文件中指定的依赖项可以具有精确的版本号或范围。但是，当将依赖项锁定到精确版本时，其传递依赖项本身并未锁定。这仍然使应用程序容易受到不必要/意外的更新。

可能的攻击向量：

- 域名抢注攻击
- Lockfile 中毒
- 受损的维护者
- 恶意软件包
- 依赖项混淆

##### 防御措施

- 使用 `--ignore-scripts` 阻止 npm 执行任意脚本
  - 此外，您可以使用 `npm config set ignore-scripts true` 全局禁用它
- 将依赖项版本固定到特定的不可变版本，而不是范围或来自可变源的版本。
- 使用 lockfile，它会固定每个依赖项（直接的和传递的）。
  - 使用 [Lockfile 中毒的缓解措施](https://blog.ulisesgascon.com/lockfile-posioned)。
- 使用 CI 自动化检查新漏洞，使用诸如 [npm-audit](https://www.npmjs.com/package/npm-audit) 之类的工具。
  - 诸如 `Socket` 之类的工具可用于使用静态分析来分析软件包，以查找风险行为，例如网络或文件系统访问。
- 使用 `npm ci` 而不是 `npm install`。这强制执行 lockfile，因此 lockfile 和 `package.json` 文件之间的不一致会导致错误（而不是默默地忽略 lockfile 而倾向于 `package.json`）。
- 仔细检查 `package.json` 文件，查找依赖项名称中的错误/拼写错误。


### 内存访问违规 (CWE-284)

基于内存或堆的攻击依赖于内存管理错误和可利用的内存分配器的组合。像所有运行时一样，如果您的项目在共享机器上运行，Node.js 很容易受到这些攻击。 使用安全的堆有助于防止由于指针溢出和下溢导致敏感信息泄露。

不幸的是，Windows 上没有安全的堆。 更多信息可以在 Node.js [secure-heap 文档](/zh/nodejs/api/cli)中找到。

#### 缓解措施

- 根据您的应用程序使用 `--secure-heap=n`，其中 n 是分配的最大字节大小。
- 不要在共享机器上运行您的生产应用程序。

### Monkey Patching (CWE-349)

Monkey patching 指的是在运行时修改属性以改变现有行为。 例子：

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
```

#### 缓解措施

`--frozen-intrinsics` 标志启用了实验性的¹冻结内建函数，这意味着所有内置的 JavaScript 对象和函数都被递归冻结。 因此，以下代码段将不会覆盖 `Array.prototype.push` 的默认行为

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
// Uncaught:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object '
```

但是，重要的是要提到您仍然可以使用 `globalThis` 定义新的全局变量并替换现有的全局变量

```bash
globalThis.foo = 3; foo; // you can still define new globals 3
globalThis.Array = 4; Array; // However, you can also replace existing globals 4
```

因此，可以使用 `Object.freeze(globalThis)` 来保证不会替换任何全局变量。

### 原型污染攻击 (CWE-1321)

原型污染指的是通过滥用 \__proto_、\_constructor、prototype 以及从内置原型继承的其他属性来修改或将属性注入 Javascript 语言项目的可能性。

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// Potential DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // Uncaught TypeError: d.hasOwnProperty is not a function
```

这是从 JavaScript 语言继承的潜在漏洞。


#### 示例

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (第三方库: Lodash)

#### 缓解措施

- 避免[不安全的递归合并](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js)，参见 [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487)。
- 为外部/不受信任的请求实现 JSON Schema 验证。
- 使用 `Object.create(null)` 创建没有原型链的对象。
- 冻结原型链: `Object.freeze(MyObject.prototype)`。
- 使用 `--disable-proto` 标志禁用 `Object.prototype.__proto__` 属性。
- 检查属性是否直接存在于对象上，而不是从原型链上获取，使用 `Object.hasOwn(obj, keyFromObj)`。
- 避免使用 `Object.prototype` 中的方法。

### 不受控制的搜索路径元素 (CWE-427)

Node.js 遵循 [模块解析算法](/zh/nodejs/api/modules) 加载模块。 因此，它假定请求（require）模块的目录是可信的。

由此，意味着期望以下应用程序行为。假设以下目录结构：

- app/
  - server.js
  - auth.js
  - auth

如果 server.js 使用 `require('./auth')`，它将遵循模块解析算法并加载 auth 而不是 `auth.js`。

#### 缓解措施

使用实验性的¹ [带有完整性检查的策略机制](/zh/nodejs/api/permissions) 可以避免上述威胁。 对于上述目录，可以使用以下 `policy.json`

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

因此，当需要 auth 模块时，系统将验证完整性，如果与预期不符，则会抛出错误。

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

请注意，始终建议使用 `--policy-integrity` 以避免策略突变。


## 在生产环境中使用实验性功能

不建议在生产环境中使用实验性功能。 实验性功能可能会在需要时遭受重大更改，并且其功能在安全上不稳定。 尽管如此，我们非常感谢您的反馈。

## OpenSSF 工具

[OpenSSF](https://www.openssf.org) 正在领导一些非常有用的倡议，特别是如果您计划发布 npm 包。 这些倡议包括：

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard 使用一系列自动化的安全风险检查来评估开源项目。 您可以使用它来主动评估代码库中的漏洞和依赖项，并就接受漏洞做出明智的决定。
- [OpenSSF 最佳实践徽章计划](https://bestpractices.coreinfrastructure.org/en) 项目可以通过描述它们如何遵守每个最佳实践来自愿进行自我认证。 这将生成一个可以添加到项目的徽章。

