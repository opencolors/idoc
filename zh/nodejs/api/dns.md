---
title: Node.js 文档 - DNS
description: Node.js 文档的这一部分介绍了 DNS（域名系统）模块，该模块提供异步网络名称解析功能。包括将域名解析为IP地址、反向查找和DNS记录查询的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 文档的这一部分介绍了 DNS（域名系统）模块，该模块提供异步网络名称解析功能。包括将域名解析为IP地址、反向查找和DNS记录查询的方法。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 文档的这一部分介绍了 DNS（域名系统）模块，该模块提供异步网络名称解析功能。包括将域名解析为IP地址、反向查找和DNS记录查询的方法。
---


# DNS {#dns}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [Stability: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

`node:dns` 模块启用名称解析。 例如，使用它来查找主机名的 IP 地址。

虽然以 [域名系统 (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System) 命名，但它并不总是使用 DNS 协议进行查找。 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 使用操作系统工具来执行名称解析。 它可能不需要执行任何网络通信。 要以与同一系统上的其他应用程序相同的方式执行名称解析，请使用 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```

```js [CJS]
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```
:::

`node:dns` 模块中的所有其他函数都连接到实际的 DNS 服务器以执行名称解析。 它们将始终使用网络执行 DNS 查询。 这些函数不使用与 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 相同的配置文件集（例如 `/etc/hosts`）。 使用这些函数始终执行 DNS 查询，绕过其他名称解析工具。

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```

```js [CJS]
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```
:::

有关更多信息，请参阅 [实现注意事项部分](/zh/nodejs/api/dns#implementation-considerations)。


## 类: `dns.Resolver` {#class-dnsresolver}

**添加于: v8.3.0**

用于 DNS 请求的独立解析器。

创建新的解析器会使用默认的服务器设置。使用 [`resolver.setServers()`](/zh/nodejs/api/dns#dnssetserversservers) 设置用于解析器的服务器不会影响其他解析器：

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 此请求将使用 4.4.4.4 上的服务器，独立于全局设置。
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 此请求将使用 4.4.4.4 上的服务器，独立于全局设置。
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

`node:dns` 模块中的以下方法可用：

- [`resolver.getServers()`](/zh/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/zh/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/zh/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/zh/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/zh/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/zh/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/zh/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/zh/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/zh/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/zh/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/zh/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/zh/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/zh/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/zh/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/zh/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/zh/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [历史记录]
| 版本 | 变更                                    |
| ---- | --------------------------------------- |
| v16.7.0, v14.18.0 | `options` 对象现在接受 `tries` 选项。     |
| v12.18.3 | 构造函数现在接受 `options` 对象。 支持的唯一选项是 `timeout`。 |
| v8.3.0  | 添加于: v8.3.0                        |
:::

创建一个新的解析器。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 查询超时时间（以毫秒为单位），或 `-1` 使用默认超时时间。
  - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在放弃之前，解析器将尝试联系每个域名服务器的次数。 **默认:** `4`


### `resolver.cancel()` {#resolvercancel}

**Added in: v8.3.0**

取消此解析器发出的所有未完成的 DNS 查询。 相应的回调函数将被调用，并返回带有代码 `ECANCELLED` 的错误。

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Added in: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 地址的字符串表示形式。 **默认值:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv6 地址的字符串表示形式。 **默认值:** `'::0'`

解析器实例将从指定的 IP 地址发送其请求。 这允许程序在多宿主系统上使用时指定出站接口。

如果未指定 v4 或 v6 地址，则将其设置为默认值，并且操作系统将自动选择本地地址。

解析器在向 IPv4 DNS 服务器发出请求时将使用 v4 本地地址，在向 IPv6 DNS 服务器发出请求时将使用 v6 本地地址。 解析请求的 `rrtype` 对所使用的本地地址没有影响。

## `dns.getServers()` {#dnsgetservers}

**Added in: v0.11.3**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回当前为 DNS 解析配置的 IP 地址字符串数组，按照 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 格式化。 如果使用了自定义端口，则字符串将包含端口部分。

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `verbatim` option is now deprecated in favor of the new `order` option. |
| v18.4.0 | For compatibility with `node:net`, when passing an option object the `family` option can be the string `'IPv4'` or the string `'IPv6'`. |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v17.0.0 | The `verbatim` options defaults to `true` now. |
| v8.5.0 | The `verbatim` option is supported now. |
| v1.2.0 | The `all` option is supported now. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 记录族。 必须是 `4`、`6` 或 `0`。 出于向后兼容的原因，`'IPv4'` 和 `'IPv6'` 分别被解释为 `4` 和 `6`。 值 `0` 表示返回 IPv4 或 IPv6 地址。 如果将值 `0` 与 `{ all: true }` 一起使用（见下文），则返回 IPv4 和 IPv6 地址中的一个或两个，具体取决于系统的 DNS 解析器。 **默认值:** `0`。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个或多个[支持的 `getaddrinfo` 标志](/zh/nodejs/api/dns#supported-getaddrinfo-flags)。 可以通过按位 `OR` 运算传递多个标志的值。
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，回调函数返回数组中的所有已解析地址。 否则，返回单个地址。 **默认值:** `false`。
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `verbatim` 时，返回的已解析地址未排序。 当 `ipv4first` 时，已解析地址通过将 IPv4 地址置于 IPv6 地址之前进行排序。 当 `ipv6first` 时，已解析地址通过将 IPv6 地址置于 IPv4 地址之前进行排序。 **默认值:** `verbatim` (地址未重新排序)。 默认值可以使用 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 或 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder) 进行配置。
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，回调函数接收 DNS 解析器返回的 IPv4 和 IPv6 地址的顺序。 当 `false` 时，IPv4 地址位于 IPv6 地址之前。 此选项将被弃用，而改用 `order`。 如果两者都指定，则 `order` 具有更高的优先级。 新代码应仅使用 `order`。 **默认值:** `true` (地址未重新排序)。 默认值可以使用 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 或 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder) 进行配置。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 或 IPv6 地址的字符串表示形式。
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` 或 `6`，表示 `address` 的族，如果地址不是 IPv4 或 IPv6 地址，则为 `0`。 `0` 可能是操作系统使用的名称解析服务中存在错误的指标。
  
 

将主机名（例如 `'nodejs.org'`）解析为找到的第一个 A (IPv4) 或 AAAA (IPv6) 记录。 所有 `option` 属性都是可选的。 如果 `options` 是整数，则它必须是 `4` 或 `6` – 如果未提供 `options`，则返回 IPv4 或 IPv6 地址或两者（如果找到）。

如果 `all` 选项设置为 `true`，则 `callback` 的参数将更改为 `(err, addresses)`，其中 `addresses` 是一个对象数组，其属性为 `address` 和 `family`。

如果发生错误，则 `err` 是一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是错误代码。 请记住，仅当主机名不存在时，才会将 `err.code` 设置为 `'ENOTFOUND'`，而且当查找以其他方式失败时（例如没有可用的文件描述符）。

`dns.lookup()` 不一定与 DNS 协议有关。 该实现使用操作系统工具，可以将名称与地址相互关联。 这种实现方式会对任何 Node.js 程序的行为产生微妙但重要的影响。 在使用 `dns.lookup()` 之前，请花一些时间查阅[实现注意事项部分](/zh/nodejs/api/dns#implementation-considerations)。

用法示例：



::: code-group
```js [ESM]
import dns from 'node:dns';
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```

```js [CJS]
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
:::

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 化的版本调用，并且 `all` 未设置为 `true`，则它会为具有 `address` 和 `family` 属性的 `Object` 返回 `Promise`。


### 支持的 getaddrinfo 标志 {#supported-getaddrinfo-flags}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.13.0, v12.17.0 | 增加了对 `dns.ALL` 标志的支持。 |
:::

以下标志可以作为提示传递给 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback)。

- `dns.ADDRCONFIG`: 将返回的地址类型限制为系统上配置的非环回地址的类型。 例如，只有当当前系统至少配置了一个 IPv4 地址时，才会返回 IPv4 地址。
- `dns.V4MAPPED`: 如果指定了 IPv6 族，但没有找到 IPv6 地址，则返回 IPv4 映射的 IPv6 地址。 某些操作系统（例如 FreeBSD 10.1）不支持此功能。
- `dns.ALL`: 如果指定了 `dns.V4MAPPED`，则返回已解析的 IPv6 地址以及 IPv4 映射的 IPv6 地址。

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.11.14 | 添加于: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例如：`example.com`
  - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例如：`http`

使用操作系统的底层 `getnameinfo` 实现将给定的 `address` 和 `port` 解析为主机名和服务。

如果 `address` 不是有效的 IP 地址，则会抛出 `TypeError`。 `port` 将被强制转换为数字。 如果它不是合法的端口，则会抛出 `TypeError`。

如果发生错误，`err` 是一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是错误代码。

::: code-group
```js [ESM]
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```

```js [CJS]
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```
:::

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 版本调用，它将返回一个 `Promise`，其值为具有 `hostname` 和 `service` 属性的 `Object`。


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.1.27 | 添加于: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 资源记录类型。**默认:** `'A'`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用 DNS 协议将主机名（例如 `'nodejs.org'`）解析为资源记录数组。 `callback` 函数具有参数 `(err, records)`。 成功时，`records` 将是一个资源记录数组。 各个结果的类型和结构因 `rrtype` 而异：

| `rrtype` | `records` 包含 | 结果类型 | 简写方法 |
| --- | --- | --- | --- |
| `'A'` | IPv4 地址（默认） | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/zh/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | IPv6 地址 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/zh/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | 任何记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/zh/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | CA 授权记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/zh/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | 规范名称记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/zh/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | 邮件交换记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/zh/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | 名称权限指针记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/zh/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | 名称服务器记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/zh/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | 指针记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/zh/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | 权限起始记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/zh/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | 服务记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/zh/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | 文本记录 | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/zh/nodejs/api/dns#dnsresolvetxthostname-callback) |

出错时，`err` 是一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是 [DNS 错误代码](/zh/nodejs/api/dns#error-codes) 之一。


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v7.2.0 | 此方法现在支持传递 `options`，特别是 `options.ttl`。 |
| v0.1.16 | 添加于: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 检索每个记录的生存时间 (TTL) 值。 当 `true` 时，回调接收一个 `{ address: '1.2.3.4', ttl: 60 }` 对象数组，而不是一个字符串数组，其中 TTL 以秒为单位表示。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



使用 DNS 协议解析 `hostname` 的 IPv4 地址（`A` 记录）。 传递给 `callback` 函数的 `addresses` 参数将包含一个 IPv4 地址数组（例如 `['74.125.79.104', '74.125.79.105', '74.125.79.106']`）。

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v7.2.0 | 此方法现在支持传递 `options`，特别是 `options.ttl`。 |
| v0.1.16 | 添加于: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 检索每个记录的生存时间 (TTL) 值。 当 `true` 时，回调接收一个 `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` 对象数组，而不是一个字符串数组，其中 TTL 以秒为单位表示。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



使用 DNS 协议解析 `hostname` 的 IPv6 地址（`AAAA` 记录）。 传递给 `callback` 函数的 `addresses` 参数将包含一个 IPv6 地址数组。


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用 DNS 协议解析所有记录（也称为 `ANY` 或 `*` 查询）。 传递给 `callback` 函数的 `ret` 参数将是一个包含各种类型记录的数组。 每个对象都有一个 `type` 属性，指示当前记录的类型。 并且根据 `type`，对象上将存在其他属性：

| 类型 | 属性 |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | 请参阅 [`dns.resolveMx()`](/zh/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | 请参阅 [`dns.resolveNaptr()`](/zh/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | 请参阅 [`dns.resolveSoa()`](/zh/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | 请参阅 [`dns.resolveSrv()`](/zh/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | 此类型的记录包含一个名为 `entries` 的数组属性，该属性引用 [`dns.resolveTxt()`](/zh/nodejs/api/dns#dnsresolvetxthostname-callback)，例如 `{ entries: ['...'], type: 'TXT' }` |

以下是传递给回调的 `ret` 对象的示例：

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```

DNS 服务器运营商可以选择不响应 `ANY` 查询。 最好调用诸如 [`dns.resolve4()`](/zh/nodejs/api/dns#dnsresolve4hostname-options-callback)、[`dns.resolveMx()`](/zh/nodejs/api/dns#dnsresolvemxhostname-callback) 等单独的方法。 有关更多详细信息，请参见 [RFC 8482](https://tools.ietf.org/html/rfc8482)。


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.3.2 | 添加于: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议来解析 `hostname` 的 `CNAME` 记录。 传递给 `callback` 函数的 `addresses` 参数将包含可用于 `hostname` 的规范名称记录数组（例如 `['bar.example.com']`）。

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.0.0, v14.17.0 | 添加于: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用 DNS 协议来解析 `hostname` 的 `CAA` 记录。 传递给 `callback` 函数的 `addresses` 参数将包含可用于 `hostname` 的证书颁发机构授权记录数组 (例如 `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`)。


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.1.27 | 添加于: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用 DNS 协议解析 `hostname` 的邮件交换记录（`MX` 记录）。 传递给 `callback` 函数的 `addresses` 参数将包含一个对象数组，其中包含 `priority` 和 `exchange` 属性（例如 `[{priority: 10, exchange: 'mx.example.com'}, ...]`）。

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.9.12 | 添加于: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用 DNS 协议解析 `hostname` 的基于正则表达式的记录（`NAPTR` 记录）。 传递给 `callback` 函数的 `addresses` 参数将包含一个具有以下属性的对象数组：

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```

## `dns.resolveNs(hostname, callback)` {#dnsresolvenshostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 如果传递给 `callback` 参数的不是有效的回调函数，现在会抛出 `ERR_INVALID_ARG_TYPE` 错误，而不是 `ERR_INVALID_CALLBACK`。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

使用 DNS 协议来解析 `hostname` 的域名服务器记录（`NS` 记录）。 传递给 `callback` 函数的 `addresses` 参数将包含一个可用于 `hostname` 的域名服务器记录数组（例如 `['ns1.example.com', 'ns2.example.com']`）。

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 如果传递给 `callback` 参数的不是有效的回调函数，现在会抛出 `ERR_INVALID_ARG_TYPE` 错误，而不是 `ERR_INVALID_CALLBACK`。 |
| v6.0.0 | 添加于: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

使用 DNS 协议来解析 `hostname` 的指针记录（`PTR` 记录）。 传递给 `callback` 函数的 `addresses` 参数将是一个包含回复记录的字符串数组。

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 如果传递给 `callback` 参数的不是有效的回调函数，现在会抛出 `ERR_INVALID_ARG_TYPE` 错误，而不是 `ERR_INVALID_CALLBACK`。 |
| v0.11.10 | 添加于: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

使用 DNS 协议来解析 `hostname` 的起始授权记录（`SOA` 记录）。 传递给 `callback` 函数的 `address` 参数将是一个包含以下属性的对象：

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```

## `dns.resolveSrv(hostname, callback)` {#dnsresolvesrvhostname-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.1.27 | 添加于: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

使用 DNS 协议来解析 `hostname` 的服务记录（`SRV` 记录）。 传递给 `callback` 函数的 `addresses` 参数将是一个对象数组，具有以下属性：

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
## `dns.resolveTxt(hostname, callback)` {#dnsresolvetxthostname-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数将抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.1.27 | 添加于: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

使用 DNS 协议来解析 `hostname` 的文本查询（`TXT` 记录）。 传递给 `callback` 函数的 `records` 参数是 `hostname` 可用的文本记录的二维数组（例如 `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`）。 每个子数组包含一个记录的 TXT 块。 根据用例，这些可以连接在一起或单独处理。


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**新增于: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

执行反向 DNS 查询，将 IPv4 或 IPv6 地址解析为主机名数组。

如果出错，`err` 是一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是 [DNS 错误代码](/zh/nodejs/api/dns#error-codes) 之一。

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在支持 `ipv6first` 值。 |
| v17.0.0 | 将默认值更改为 `verbatim`。 |
| v16.4.0, v14.18.0 | 新增于: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'ipv4first'`、`'ipv6first'` 或 `'verbatim'`。

设置 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和 [`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 中 `order` 的默认值。 该值可以是：

- `ipv4first`：将默认 `order` 设置为 `ipv4first`。
- `ipv6first`：将默认 `order` 设置为 `ipv6first`。
- `verbatim`：将默认 `order` 设置为 `verbatim`。

默认值为 `verbatim`，并且 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 的优先级高于 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder)。 当使用 [工作线程](/zh/nodejs/api/worker_threads) 时，来自主线程的 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 不会影响工作线程中的默认 dns 顺序。

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在支持 `ipv6first` 值。 |
| v20.1.0, v18.17.0 | 新增于: v20.1.0, v18.17.0 |
:::

获取 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和 [`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 中 `order` 的默认值。 该值可以是：

- `ipv4first`：对于默认设置为 `ipv4first` 的 `order`。
- `ipv6first`：对于默认设置为 `ipv6first` 的 `order`。
- `verbatim`：对于默认设置为 `verbatim` 的 `order`。


## `dns.setServers(servers)` {#dnssetserversservers}

**添加于: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 格式的地址数组

设置执行 DNS 解析时要使用的服务器的 IP 地址和端口。 `servers` 参数是 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 格式的地址数组。 如果端口是 IANA 默认 DNS 端口 (53)，则可以省略。

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```

如果提供了无效的地址，则会抛出错误。

在 DNS 查询正在进行时，不能调用 `dns.setServers()` 方法。

[`dns.setServers()`](/zh/nodejs/api/dns#dnssetserversservers) 方法仅影响 [`dns.resolve()`](/zh/nodejs/api/dns#dnsresolvehostname-rrtype-callback)， `dns.resolve*()` 和 [`dns.reverse()`](/zh/nodejs/api/dns#dnsreverseip-callback) (特别 *不* 包括 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback))。

此方法的工作方式与 [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5) 非常相似。 也就是说，如果尝试使用提供的第一个服务器进行解析导致 `NOTFOUND` 错误，则 `resolve()` 方法将*不会*尝试使用提供的后续服务器进行解析。 仅当较早的服务器超时或导致其他错误时，才会使用备用 DNS 服务器。

## DNS promises API {#dns-promises-api}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v15.0.0 | 作为 `require('dns/promises')` 暴露。 |
| v11.14.0, v10.17.0 | 此 API 不再是实验性的。 |
| v10.6.0 | 添加于: v10.6.0 |
:::

`dns.promises` API 提供了一组替代的异步 DNS 方法，这些方法返回 `Promise` 对象而不是使用回调。 该 API 可通过 `require('node:dns').promises` 或 `require('node:dns/promises')` 访问。

### 类: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**添加于: v10.6.0**

用于 DNS 请求的独立解析器。

创建新的解析器使用默认的服务器设置。 使用 [`resolver.setServers()`](/zh/nodejs/api/dns#dnspromisessetserversservers) 设置用于解析器的服务器不会影响其他解析器：

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 此请求将使用 4.4.4.4 上的服务器，独立于全局设置。
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 此请求将使用 4.4.4.4 上的服务器，独立于全局设置。
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// 或者，可以使用 async-await 风格编写相同的代码。
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

以下来自 `dnsPromises` API 的方法可用：

- [`resolver.getServers()`](/zh/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/zh/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/zh/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/zh/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/zh/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/zh/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/zh/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/zh/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/zh/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/zh/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/zh/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/zh/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/zh/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/zh/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/zh/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/zh/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**添加于: v15.3.0, v14.17.0**

取消此解析器发出的所有未完成的 DNS 查询。 相应的 Promise 将因代码为 `ECANCELLED` 的错误而被拒绝。

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**添加于: v10.6.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回当前为 DNS 解析配置的 IP 地址字符串数组，格式符合 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)。 如果使用自定义端口，则字符串将包含端口部分。

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.1.0, v20.13.0 | `verbatim` 选项现在已弃用，改用新的 `order` 选项。 |
| v10.6.0 | 添加于: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 记录族。 必须为 `4`、`6` 或 `0`。 值 `0` 表示返回 IPv4 或 IPv6 地址。 如果值 `0` 与 `{ all: true }` (见下文) 一起使用，则返回 IPv4 和 IPv6 地址之一或两者，具体取决于系统的 DNS 解析器。 **默认:** `0`。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个或多个[支持的 `getaddrinfo` 标志](/zh/nodejs/api/dns#supported-getaddrinfo-flags)。 可以通过按位 `OR` 运算它们的值来传递多个标志。
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Promise` 会解析为数组中的所有地址。 否则，返回单个地址。 **默认:** `false`。
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当为 `verbatim` 时，`Promise` 会解析为 DNS 解析器返回顺序的 IPv4 和 IPv6 地址。 当为 `ipv4first` 时，IPv4 地址位于 IPv6 地址之前。 当为 `ipv6first` 时，IPv6 地址位于 IPv4 地址之前。 **默认:** `verbatim` (不重新排序地址)。 默认值可以使用 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 或 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder) 配置。 新代码应使用 `{ order: 'verbatim' }`。
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`Promise` 会解析为 DNS 解析器返回顺序的 IPv4 和 IPv6 地址。 当为 `false` 时，IPv4 地址位于 IPv6 地址之前。 此选项将被弃用，改用 `order`。 如果两者都指定，则 `order` 具有更高的优先级。 新代码应仅使用 `order`。 **默认:** 当前为 `false` (地址已重新排序)，但预计在不久的将来会发生变化。 默认值可以使用 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 或 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder) 配置。
  
 

将主机名 (例如 `'nodejs.org'`) 解析为找到的第一个 A (IPv4) 或 AAAA (IPv6) 记录。 所有 `option` 属性都是可选的。 如果 `options` 是一个整数，那么它必须是 `4` 或 `6` – 如果未提供 `options`，则如果找到，则返回 IPv4 或 IPv6 地址，或两者都返回。

当 `all` 选项设置为 `true` 时，`Promise` 会解析为 `addresses`，它是一个具有属性 `address` 和 `family` 的对象数组。

出错时，`Promise` 会被拒绝，并返回一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是错误代码。 请记住，`err.code` 将设置为 `'ENOTFOUND'`，不仅当主机名不存在时，而且当查找因其他方式失败时，例如没有可用的文件描述符。

[`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 不一定与 DNS 协议有任何关系。 该实现使用操作系统工具，可以将名称与地址关联起来，反之亦然。 此实现可能对任何 Node.js 程序的行为产生微妙但重要的影响。 在使用 `dnsPromises.lookup()` 之前，请花一些时间查阅[实现注意事项部分](/zh/nodejs/api/dns#implementation-considerations)。

用法示例：



::: code-group
```js [ESM]
import dns from 'node:dns';
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// 当 options.all 为 true 时，结果将是一个数组。
options.all = true;
await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```

```js [CJS]
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// 当 options.all 为 true 时，结果将是一个数组。
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::


### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**新增于: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

使用操作系统底层的 `getnameinfo` 实现，将给定的 `address` 和 `port` 解析为主机名和服务。

如果 `address` 不是有效的 IP 地址，则会抛出 `TypeError`。 `port` 将被强制转换为数字。 如果它不是合法的端口，则会抛出 `TypeError`。

如果发生错误，则 `Promise` 会被拒绝，并返回一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是错误代码。

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Prints: localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Prints: localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**新增于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 资源记录类型。 **默认:** `'A'`。

使用 DNS 协议将主机名（例如 `'nodejs.org'`）解析为资源记录数组。 成功时，`Promise` 将解析为一个资源记录数组。 单个结果的类型和结构根据 `rrtype` 而有所不同：

| `rrtype` | `records` 包含 | 结果类型 | 简写方法 |
| --- | --- | --- | --- |
| `'A'` | IPv4 地址 (默认) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/zh/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6 地址 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/zh/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | 任何记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/zh/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | CA 授权记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/zh/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | 规范名称记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/zh/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | 邮件交换记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/zh/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | 名称权威指针记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/zh/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | 名称服务器记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/zh/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | 指针记录 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/zh/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | 授权起始记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/zh/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | 服务记录 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/zh/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | 文本记录 | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/zh/nodejs/api/dns#dnspromisesresolvetxthostname) |

如果发生错误，则 `Promise` 会被拒绝，并返回一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象，其中 `err.code` 是 [DNS 错误代码](/zh/nodejs/api/dns#error-codes) 之一。


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 检索每个记录的生存时间 (TTL) 值。 当 `true` 时，`Promise` 会解析为一个 `{ address: '1.2.3.4', ttl: 60 }` 对象数组，而不是一个字符串数组，TTL 以秒为单位表示。

使用 DNS 协议解析 `hostname` 的 IPv4 地址（`A` 记录）。 成功后，`Promise` 会解析为一个 IPv4 地址数组（例如 `['74.125.79.104', '74.125.79.105', '74.125.79.106']`）。

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的主机名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 检索每个记录的生存时间 (TTL) 值。 当 `true` 时，`Promise` 会解析为一个 `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` 对象数组，而不是一个字符串数组，TTL 以秒为单位表示。

使用 DNS 协议解析 `hostname` 的 IPv6 地址（`AAAA` 记录）。 成功后，`Promise` 会解析为一个 IPv6 地址数组。

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析所有记录（也称为 `ANY` 或 `*` 查询）。 成功后，`Promise` 会解析为一个包含各种类型记录的数组。 每个对象都有一个 `type` 属性，指示当前记录的类型。 并且根据 `type`，对象上会出现其他属性：

| 类型 | 属性 |
| --- | --- |
| `'A'` | `address` / `ttl` |
| `'AAAA'` | `address` / `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | 参考 [`dnsPromises.resolveMx()`](/zh/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | 参考 [`dnsPromises.resolveNaptr()`](/zh/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | 参考 [`dnsPromises.resolveSoa()`](/zh/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | 参考 [`dnsPromises.resolveSrv()`](/zh/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | 这种类型的记录包含一个名为 `entries` 的数组属性，该属性指向 [`dnsPromises.resolveTxt()`](/zh/nodejs/api/dns#dnspromisesresolvetxthostname)，例如 `{ entries: ['...'], type: 'TXT' }` |
这是一个结果对象的示例：

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```

### `dnsPromises.resolveCaa(hostname)` {#dnspromisesresolvecaahostname}

**加入于: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的 `CAA` 记录。 成功时，`Promise` 会被解析为一个对象数组，其中包含可用于 `hostname` 的可用证书颁发机构授权记录（例如 `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`）。

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的 `CNAME` 记录。 成功时，`Promise` 会被解析为一个可用于 `hostname` 的规范名称记录数组（例如 `['bar.example.com']`）。

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的邮件交换记录（`MX` 记录）。 成功时，`Promise` 会被解析为一个对象数组，其中包含 `priority` 和 `exchange` 属性（例如 `[{priority: 10, exchange: 'mx.example.com'}, ...]`）。

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的基于正则表达式的记录（`NAPTR` 记录）。 成功时，`Promise` 会被解析为一个具有以下属性的对象数组：

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```
### `dnsPromises.resolveNs(hostname)` {#dnspromisesresolvenshostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的域名服务器记录（`NS` 记录）。 成功时，`Promise` 会被解析为一个可用于 `hostname` 的域名服务器记录数组（例如 `['ns1.example.com', 'ns2.example.com']`）。


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的指针记录（`PTR` 记录）。 成功时，`Promise` 将解析为一个包含回复记录的字符串数组。

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的起始授权记录（`SOA` 记录）。 成功时，`Promise` 将解析为一个具有以下属性的对象：

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```
### `dnsPromises.resolveSrv(hostname)` {#dnspromisesresolvesrvhostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的服务记录（`SRV` 记录）。 成功时，`Promise` 将解析为一个具有以下属性的对象数组：

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
### `dnsPromises.resolveTxt(hostname)` {#dnspromisesresolvetxthostname}

**加入于: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 DNS 协议解析 `hostname` 的文本查询（`TXT` 记录）。 成功时，`Promise` 将解析为一个 `hostname` 可用的文本记录的二维数组（例如 `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`）。 每个子数组包含一个记录的 TXT 块。 根据用例，这些可以连接在一起或单独处理。


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**新增于: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

执行反向 DNS 查询，将 IPv4 或 IPv6 地址解析为主机名数组。

如果发生错误，则 `Promise` 会被一个 [`Error`](/zh/nodejs/api/errors#class-error) 对象拒绝，其中 `err.code` 是 [DNS 错误代码](/zh/nodejs/api/dns#error-codes) 之一。

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在支持 `ipv6first` 值。 |
| v17.0.0 | 更改默认值为 `verbatim`。 |
| v16.4.0, v14.18.0 | 新增于: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'ipv4first'`、`'ipv6first'` 或 `'verbatim'`。

设置 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和 [`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 中 `order` 的默认值。 该值可以是：

- `ipv4first`: 设置默认 `order` 为 `ipv4first`。
- `ipv6first`: 设置默认 `order` 为 `ipv6first`。
- `verbatim`: 设置默认 `order` 为 `verbatim`。

默认值为 `verbatim`，并且 [`dnsPromises.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnspromisessetdefaultresultorderorder) 的优先级高于 [`--dns-result-order`](/zh/nodejs/api/cli#--dns-result-orderorder)。 当使用 [工作线程](/zh/nodejs/api/worker_threads) 时，主线程中的 [`dnsPromises.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnspromisessetdefaultresultorderorder) 不会影响工作线程中的默认 dns 顺序。

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**新增于: v20.1.0, v18.17.0**

获取 `dnsOrder` 的值。

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**新增于: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 格式的地址数组

设置在执行 DNS 解析时要使用的服务器的 IP 地址和端口。 `servers` 参数是一个 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 格式的地址数组。 如果端口是 IANA 默认 DNS 端口 (53)，则可以省略它。

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
如果提供了无效地址，将抛出错误。

在 DNS 查询正在进行时，不得调用 `dnsPromises.setServers()` 方法。

此方法的工作方式与 [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5) 非常相似。 也就是说，如果尝试使用提供的第一个服务器解析导致 `NOTFOUND` 错误，则 `resolve()` 方法将*不会*尝试使用提供的后续服务器进行解析。 仅当较早的 DNS 服务器超时或导致其他错误时，才会使用备用 DNS 服务器。


## 错误代码 {#error-codes}

每个 DNS 查询都可能返回以下错误代码之一：

- `dns.NODATA`: DNS 服务器返回了一个没有数据的应答。
- `dns.FORMERR`: DNS 服务器声称查询格式错误。
- `dns.SERVFAIL`: DNS 服务器返回了一般性故障。
- `dns.NOTFOUND`: 未找到域名。
- `dns.NOTIMP`: DNS 服务器未实现请求的操作。
- `dns.REFUSED`: DNS 服务器拒绝查询。
- `dns.BADQUERY`: DNS 查询格式错误。
- `dns.BADNAME`: 主机名格式错误。
- `dns.BADFAMILY`: 不支持的地址族。
- `dns.BADRESP`: DNS 回复格式错误。
- `dns.CONNREFUSED`: 无法连接 DNS 服务器。
- `dns.TIMEOUT`: 联系 DNS 服务器时超时。
- `dns.EOF`: 文件结束。
- `dns.FILE`: 读取文件时出错。
- `dns.NOMEM`: 内存不足。
- `dns.DESTRUCTION`: 通道正在被销毁。
- `dns.BADSTR`: 字符串格式错误。
- `dns.BADFLAGS`: 指定了非法标志。
- `dns.NONAME`: 给定的主机名不是数字。
- `dns.BADHINTS`: 指定了非法 hints 标志。
- `dns.NOTINITIALIZED`: c-ares 库尚未初始化。
- `dns.LOADIPHLPAPI`: 加载 `iphlpapi.dll` 时出错。
- `dns.ADDRGETNETWORKPARAMS`: 无法找到 `GetNetworkParams` 函数。
- `dns.CANCELLED`: DNS 查询已取消。

`dnsPromises` API 也导出了上述错误代码，例如 `dnsPromises.NODATA`。

## 实现注意事项 {#implementation-considerations}

尽管 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和各种 `dns.resolve*()/dns.reverse()` 函数的目标相同，即将网络名称与网络地址关联（或反之），但它们的行为却大相径庭。 这些差异可能会对 Node.js 程序的行为产生微妙但重要的影响。

### `dns.lookup()` {#dnslookup}

在底层，[`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 使用与大多数其他程序相同的操作系统设施。 例如，[`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 几乎总是以与 `ping` 命令相同的方式解析给定的名称。 在大多数类 POSIX 操作系统上，可以通过更改 [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) 和/或 [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5) 中的设置来修改 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 函数的行为，但更改这些文件将更改运行在同一操作系统上的所有其他程序的行为。

虽然从 JavaScript 的角度来看，调用 `dns.lookup()` 将是异步的，但它被实现为对 [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) 的同步调用，该调用在 libuv 的线程池上运行。 这可能会对某些应用程序产生令人惊讶的负面性能影响，请参阅 [`UV_THREADPOOL_SIZE`](/zh/nodejs/api/cli#uv_threadpool_sizesize) 文档以获取更多信息。

各种网络 API 将在内部调用 `dns.lookup()` 以解析主机名。 如果这是一个问题，请考虑使用 `dns.resolve()` 将主机名解析为地址，并使用该地址而不是主机名。 此外，某些网络 API（例如 [`socket.connect()`](/zh/nodejs/api/net#socketconnectoptions-connectlistener) 和 [`dgram.createSocket()`](/zh/nodejs/api/dgram#dgramcreatesocketoptions-callback)）允许替换默认解析器 `dns.lookup()`。


### `dns.resolve()`, `dns.resolve*()`, 和 `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

这些函数的实现方式与 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 截然不同。它们不使用 [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3)，并且*总是*在网络上执行 DNS 查询。此网络通信始终以异步方式完成，并且不使用 libuv 的线程池。

因此，这些函数不会像 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 那样对 libuv 线程池上发生的其他处理产生相同的负面影响。

它们不使用与 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 相同的一组配置文件。例如，它们不使用来自 `/etc/hosts` 的配置。

