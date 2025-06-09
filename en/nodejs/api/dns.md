---
title: Node.js Documentation - DNS
description: This section of the Node.js documentation covers the DNS (Domain Name System) module, which provides asynchronous network name resolution functionalities. It includes methods for resolving domain names to IP addresses, reverse lookups, and DNS record queries.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: This section of the Node.js documentation covers the DNS (Domain Name System) module, which provides asynchronous network name resolution functionalities. It includes methods for resolving domain names to IP addresses, reverse lookups, and DNS record queries.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: This section of the Node.js documentation covers the DNS (Domain Name System) module, which provides asynchronous network name resolution functionalities. It includes methods for resolving domain names to IP addresses, reverse lookups, and DNS record queries.
---

# DNS {#dns}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.8.0/lib/dns.js)

The `node:dns` module enables name resolution. For example, use it to look up IP addresses of host names.

Although named for the [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), it does not always use the DNS protocol for lookups. [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) uses the operating system facilities to perform name resolution. It may not need to perform any network communication. To perform name resolution the way other applications on the same system do, use [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback).



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

All other functions in the `node:dns` module connect to an actual DNS server to perform name resolution. They will always use the network to perform DNS queries. These functions do not use the same set of configuration files used by [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) (e.g. `/etc/hosts`). Use these functions to always perform DNS queries, bypassing other name-resolution facilities.



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

See the [Implementation considerations section](/nodejs/api/dns#implementation-considerations) for more information.

## Class: `dns.Resolver` {#class-dnsresolver}

**Added in: v8.3.0**

An independent resolver for DNS requests.

Creating a new resolver uses the default server settings. Setting the servers used for a resolver using [`resolver.setServers()`](/nodejs/api/dns#dnssetserversservers) does not affect other resolvers:



::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

The following methods from the `node:dns` module are available:

- [`resolver.getServers()`](/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.7.0, v14.18.0 | The `options` object now accepts a `tries` option. |
| v12.18.3 | The constructor now accepts an `options` object. The single supported option is `timeout`. |
| v8.3.0 | Added in: v8.3.0 |
:::

Create a new resolver.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Query timeout in milliseconds, or `-1` to use the default timeout.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of tries the resolver will try contacting each name server before giving up. **Default:** `4`
  
 

### `resolver.cancel()` {#resolvercancel}

**Added in: v8.3.0**

Cancel all outstanding DNS queries made by this resolver. The corresponding callbacks will be called with an error with code `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Added in: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string representation of an IPv4 address. **Default:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string representation of an IPv6 address. **Default:** `'::0'`

The resolver instance will send its requests from the specified IP address. This allows programs to specify outbound interfaces when used on multi-homed systems.

If a v4 or v6 address is not specified, it is set to the default and the operating system will choose a local address automatically.

The resolver will use the v4 local address when making requests to IPv4 DNS servers, and the v6 local address when making requests to IPv6 DNS servers. The `rrtype` of resolution requests has no impact on the local address used.

## `dns.getServers()` {#dnsgetservers}

**Added in: v0.11.3**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Returns an array of IP address strings, formatted according to [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), that are currently configured for DNS resolution. A string will include a port section if a custom port is used.

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
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The record family. Must be `4`, `6`, or `0`. For backward compatibility reasons,`'IPv4'` and `'IPv6'` are interpreted as `4` and `6` respectively. The value `0` indicates that either an IPv4 or IPv6 address is returned. If the value `0` is used with `{ all: true }` (see below), either one of or both IPv4 and IPv6 addresses are returned, depending on the system's DNS resolver. **Default:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) One or more [supported `getaddrinfo` flags](/nodejs/api/dns#supported-getaddrinfo-flags). Multiple flags may be passed by bitwise `OR`ing their values.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the callback returns all resolved addresses in an array. Otherwise, returns a single address. **Default:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) When `verbatim`, the resolved addresses are return unsorted. When `ipv4first`, the resolved addresses are sorted by placing IPv4 addresses before IPv6 addresses. When `ipv6first`, the resolved addresses are sorted by placing IPv6 addresses before IPv4 addresses. **Default:** `verbatim` (addresses are not reordered). Default value is configurable using [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) or [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the callback receives IPv4 and IPv6 addresses in the order the DNS resolver returned them. When `false`, IPv4 addresses are placed before IPv6 addresses. This option will be deprecated in favor of `order`. When both are specified, `order` has higher precedence. New code should only use `order`. **Default:** `true` (addresses are not reordered). Default value is configurable using [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) or [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder).
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string representation of an IPv4 or IPv6 address.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` or `6`, denoting the family of `address`, or `0` if the address is not an IPv4 or IPv6 address. `0` is a likely indicator of a bug in the name resolution service used by the operating system.
  
 

Resolves a host name (e.g. `'nodejs.org'`) into the first found A (IPv4) or AAAA (IPv6) record. All `option` properties are optional. If `options` is an integer, then it must be `4` or `6` – if `options` is not provided, then either IPv4 or IPv6 addresses, or both, are returned if found.

With the `all` option set to `true`, the arguments for `callback` change to `(err, addresses)`, with `addresses` being an array of objects with the properties `address` and `family`.

On error, `err` is an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is the error code. Keep in mind that `err.code` will be set to `'ENOTFOUND'` not only when the host name does not exist but also when the lookup fails in other ways such as no available file descriptors.

`dns.lookup()` does not necessarily have anything to do with the DNS protocol. The implementation uses an operating system facility that can associate names with addresses and vice versa. This implementation can have subtle but important consequences on the behavior of any Node.js program. Please take some time to consult the [Implementation considerations section](/nodejs/api/dns#implementation-considerations) before using `dns.lookup()`.

Example usage:



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

If this method is invoked as its [`util.promisify()`](/nodejs/api/util#utilpromisifyoriginal)ed version, and `all` is not set to `true`, it returns a `Promise` for an `Object` with `address` and `family` properties.

### Supported getaddrinfo flags {#supported-getaddrinfo-flags}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.13.0, v12.17.0 | Added support for the `dns.ALL` flag. |
:::

The following flags can be passed as hints to [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: Limits returned address types to the types of non-loopback addresses configured on the system. For example, IPv4 addresses are only returned if the current system has at least one IPv4 address configured.
- `dns.V4MAPPED`: If the IPv6 family was specified, but no IPv6 addresses were found, then return IPv4 mapped IPv6 addresses. It is not supported on some operating systems (e.g. FreeBSD 10.1).
- `dns.ALL`: If `dns.V4MAPPED` is specified, return resolved IPv6 addresses as well as IPv4 mapped IPv6 addresses.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Added in: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) e.g. `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) e.g. `http`
  
 

Resolves the given `address` and `port` into a host name and service using the operating system's underlying `getnameinfo` implementation.

If `address` is not a valid IP address, a `TypeError` will be thrown. The `port` will be coerced to a number. If it is not a legal port, a `TypeError` will be thrown.

On an error, `err` is an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is the error code.



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

If this method is invoked as its [`util.promisify()`](/nodejs/api/util#utilpromisifyoriginal)ed version, it returns a `Promise` for an `Object` with `hostname` and `service` properties.

## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Resource record type. **Default:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve a host name (e.g. `'nodejs.org'`) into an array of the resource records. The `callback` function has arguments `(err, records)`. When successful, `records` will be an array of resource records. The type and structure of individual results varies based on `rrtype`:

| `rrtype` | `records`   contains | Result type | Shorthand method |
| --- | --- | --- | --- |
| `'A'` | IPv4 addresses (default) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | IPv6 addresses | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | any records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | CA authorization records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | canonical name records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | mail exchange records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | name authority pointer records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | name server records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | pointer records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | start of authority records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | service records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | text records | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/nodejs/api/dns#dnsresolvetxthostname-callback) |
On error, `err` is an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is one of the [DNS error codes](/nodejs/api/dns#error-codes).

## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v7.2.0 | This method now supports passing `options`, specifically `options.ttl`. |
| v0.1.16 | Added in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retrieves the Time-To-Live value (TTL) of each record. When `true`, the callback receives an array of `{ address: '1.2.3.4', ttl: 60 }` objects rather than an array of strings, with the TTL expressed in seconds.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve a IPv4 addresses (`A` records) for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of IPv4 addresses (e.g. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v7.2.0 | This method now supports passing `options`, specifically `options.ttl`. |
| v0.1.16 | Added in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retrieve the Time-To-Live value (TTL) of each record. When `true`, the callback receives an array of `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` objects rather than an array of strings, with the TTL expressed in seconds.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve IPv6 addresses (`AAAA` records) for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of IPv6 addresses.

## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve all records (also known as `ANY` or `*` query). The `ret` argument passed to the `callback` function will be an array containing various types of records. Each object has a property `type` that indicates the type of the current record. And depending on the `type`, additional properties will be present on the object:

| Type | Properties |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Refer to   [`dns.resolveMx()`](/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Refer to   [`dns.resolveNaptr()`](/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Refer to   [`dns.resolveSoa()`](/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Refer to   [`dns.resolveSrv()`](/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | This type of record contains an array property called   `entries`   which refers to   [`dns.resolveTxt()`](/nodejs/api/dns#dnsresolvetxthostname-callback)  , e.g.   `{ entries: ['...'], type: 'TXT' }` |
Here is an example of the `ret` object passed to the callback:

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
DNS server operators may choose not to respond to `ANY` queries. It may be better to call individual methods like [`dns.resolve4()`](/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/nodejs/api/dns#dnsresolvemxhostname-callback), and so on. For more details, see [RFC 8482](https://tools.ietf.org/html/rfc8482).

## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Added in: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Uses the DNS protocol to resolve `CNAME` records for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of canonical name records available for the `hostname` (e.g. `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Added in: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve `CAA` records for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of certification authority authorization records available for the `hostname` (e.g. `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).

## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve mail exchange records (`MX` records) for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of objects containing both a `priority` and `exchange` property (e.g. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Added in: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve regular expression-based records (`NAPTR` records) for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of objects with the following properties:

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


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Uses the DNS protocol to resolve name server records (`NS` records) for the `hostname`. The `addresses` argument passed to the `callback` function will contain an array of name server records available for `hostname` (e.g. `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Added in: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Uses the DNS protocol to resolve pointer records (`PTR` records) for the `hostname`. The `addresses` argument passed to the `callback` function will be an array of strings containing the reply records.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Added in: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve a start of authority record (`SOA` record) for the `hostname`. The `address` argument passed to the `callback` function will be an object with the following properties:

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


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Uses the DNS protocol to resolve service records (`SRV` records) for the `hostname`. The `addresses` argument passed to the `callback` function will be an array of objects with the following properties:

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


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Uses the DNS protocol to resolve text queries (`TXT` records) for the `hostname`. The `records` argument passed to the `callback` function is a two-dimensional array of the text records available for `hostname` (e.g. `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Each sub-array contains TXT chunks of one record. Depending on the use case, these could be either joined together or treated separately.

## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Added in: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.

On error, `err` is an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is one of the [DNS error codes](/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `ipv6first` value is supported now. |
| v17.0.0 | Changed default value to `verbatim`. |
| v16.4.0, v14.18.0 | Added in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) must be `'ipv4first'`, `'ipv6first'` or `'verbatim'`.

Set the default value of `order` in [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) and [`dnsPromises.lookup()`](/nodejs/api/dns#dnspromiseslookuphostname-options). The value could be:

- `ipv4first`: sets default `order` to `ipv4first`.
- `ipv6first`: sets default `order` to `ipv6first`.
- `verbatim`: sets default `order` to `verbatim`.

The default is `verbatim` and [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) have higher priority than [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder). When using [worker threads](/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) from the main thread won't affect the default dns orders in workers.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `ipv6first` value is supported now. |
| v20.1.0, v18.17.0 | Added in: v20.1.0, v18.17.0 |
:::

Get the default value for `order` in [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) and [`dnsPromises.lookup()`](/nodejs/api/dns#dnspromiseslookuphostname-options). The value could be:

- `ipv4first`: for `order` defaulting to `ipv4first`.
- `ipv6first`: for `order` defaulting to `ipv6first`.
- `verbatim`: for `order` defaulting to `verbatim`.

## `dns.setServers(servers)` {#dnssetserversservers}

**Added in: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array of [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatted addresses

Sets the IP address and port of servers to be used when performing DNS resolution. The `servers` argument is an array of [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatted addresses. If the port is the IANA default DNS port (53) it can be omitted.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
An error will be thrown if an invalid address is provided.

The `dns.setServers()` method must not be called while a DNS query is in progress.

The [`dns.setServers()`](/nodejs/api/dns#dnssetserversservers) method affects only [`dns.resolve()`](/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` and [`dns.reverse()`](/nodejs/api/dns#dnsreverseip-callback) (and specifically *not* [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback)).

This method works much like [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). That is, if attempting to resolve with the first server provided results in a `NOTFOUND` error, the `resolve()` method will *not* attempt to resolve with subsequent servers provided. Fallback DNS servers will only be used if the earlier ones time out or result in some other error.

## DNS promises API {#dns-promises-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | Exposed as `require('dns/promises')`. |
| v11.14.0, v10.17.0 | This API is no longer experimental. |
| v10.6.0 | Added in: v10.6.0 |
:::

The `dns.promises` API provides an alternative set of asynchronous DNS methods that return `Promise` objects rather than using callbacks. The API is accessible via `require('node:dns').promises` or `require('node:dns/promises')`.

### Class: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Added in: v10.6.0**

An independent resolver for DNS requests.

Creating a new resolver uses the default server settings. Setting the servers used for a resolver using [`resolver.setServers()`](/nodejs/api/dns#dnspromisessetserversservers) does not affect other resolvers:



::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternatively, the same code can be written using async-await style.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

The following methods from the `dnsPromises` API are available:

- [`resolver.getServers()`](/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/nodejs/api/dns#dnspromisessetserversservers)

### `resolver.cancel()` {#resolvercancel_1}

**Added in: v15.3.0, v14.17.0**

Cancel all outstanding DNS queries made by this resolver. The corresponding promises will be rejected with an error with the code `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Added in: v10.6.0**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Returns an array of IP address strings, formatted according to [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), that are currently configured for DNS resolution. A string will include a port section if a custom port is used.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `verbatim` option is now deprecated in favor of the new `order` option. |
| v10.6.0 | Added in: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The record family. Must be `4`, `6`, or `0`. The value `0` indicates that either an IPv4 or IPv6 address is returned. If the value `0` is used with `{ all: true }` (see below), either one of or both IPv4 and IPv6 addresses are returned, depending on the system's DNS resolver. **Default:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) One or more [supported `getaddrinfo` flags](/nodejs/api/dns#supported-getaddrinfo-flags). Multiple flags may be passed by bitwise `OR`ing their values.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the `Promise` is resolved with all addresses in an array. Otherwise, returns a single address. **Default:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) When `verbatim`, the `Promise` is resolved with IPv4 and IPv6 addresses in the order the DNS resolver returned them. When `ipv4first`, IPv4 addresses are placed before IPv6 addresses. When `ipv6first`, IPv6 addresses are placed before IPv4 addresses. **Default:** `verbatim` (addresses are not reordered). Default value is configurable using [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) or [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder). New code should use `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the `Promise` is resolved with IPv4 and IPv6 addresses in the order the DNS resolver returned them. When `false`, IPv4 addresses are placed before IPv6 addresses. This option will be deprecated in favor of `order`. When both are specified, `order` has higher precedence. New code should only use `order`. **Default:** currently `false` (addresses are reordered) but this is expected to change in the not too distant future. Default value is configurable using [`dns.setDefaultResultOrder()`](/nodejs/api/dns#dnssetdefaultresultorderorder) or [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder).
  
 

Resolves a host name (e.g. `'nodejs.org'`) into the first found A (IPv4) or AAAA (IPv6) record. All `option` properties are optional. If `options` is an integer, then it must be `4` or `6` – if `options` is not provided, then either IPv4 or IPv6 addresses, or both, are returned if found.

With the `all` option set to `true`, the `Promise` is resolved with `addresses` being an array of objects with the properties `address` and `family`.

On error, the `Promise` is rejected with an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is the error code. Keep in mind that `err.code` will be set to `'ENOTFOUND'` not only when the host name does not exist but also when the lookup fails in other ways such as no available file descriptors.

[`dnsPromises.lookup()`](/nodejs/api/dns#dnspromiseslookuphostname-options) does not necessarily have anything to do with the DNS protocol. The implementation uses an operating system facility that can associate names with addresses and vice versa. This implementation can have subtle but important consequences on the behavior of any Node.js program. Please take some time to consult the [Implementation considerations section](/nodejs/api/dns#implementation-considerations) before using `dnsPromises.lookup()`.

Example usage:



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

// When options.all is true, the result will be an Array.
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

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::

### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**Added in: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Resolves the given `address` and `port` into a host name and service using the operating system's underlying `getnameinfo` implementation.

If `address` is not a valid IP address, a `TypeError` will be thrown. The `port` will be coerced to a number. If it is not a legal port, a `TypeError` will be thrown.

On error, the `Promise` is rejected with an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is the error code.



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

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Resource record type. **Default:** `'A'`.

Uses the DNS protocol to resolve a host name (e.g. `'nodejs.org'`) into an array of the resource records. When successful, the `Promise` is resolved with an array of resource records. The type and structure of individual results vary based on `rrtype`:

| `rrtype` | `records`   contains | Result type | Shorthand method |
| --- | --- | --- | --- |
| `'A'` | IPv4 addresses (default) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6 addresses | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | any records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | CA authorization records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | canonical name records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | mail exchange records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | name authority pointer records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | name server records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | pointer records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | start of authority records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | service records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | text records | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/nodejs/api/dns#dnspromisesresolvetxthostname) |
On error, the `Promise` is rejected with an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is one of the [DNS error codes](/nodejs/api/dns#error-codes).

### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retrieve the Time-To-Live value (TTL) of each record. When `true`, the `Promise` is resolved with an array of `{ address: '1.2.3.4', ttl: 60 }` objects rather than an array of strings, with the TTL expressed in seconds.
  
 

Uses the DNS protocol to resolve IPv4 addresses (`A` records) for the `hostname`. On success, the `Promise` is resolved with an array of IPv4 addresses (e.g. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host name to resolve.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retrieve the Time-To-Live value (TTL) of each record. When `true`, the `Promise` is resolved with an array of `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` objects rather than an array of strings, with the TTL expressed in seconds.
  
 

Uses the DNS protocol to resolve IPv6 addresses (`AAAA` records) for the `hostname`. On success, the `Promise` is resolved with an array of IPv6 addresses.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve all records (also known as `ANY` or `*` query). On success, the `Promise` is resolved with an array containing various types of records. Each object has a property `type` that indicates the type of the current record. And depending on the `type`, additional properties will be present on the object:

| Type | Properties |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Refer to   [`dnsPromises.resolveMx()`](/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Refer to   [`dnsPromises.resolveNaptr()`](/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Refer to   [`dnsPromises.resolveSoa()`](/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Refer to   [`dnsPromises.resolveSrv()`](/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | This type of record contains an array property called   `entries`   which refers to   [`dnsPromises.resolveTxt()`](/nodejs/api/dns#dnspromisesresolvetxthostname)  , e.g.   `{ entries: ['...'], type: 'TXT' }` |
Here is an example of the result object:

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

**Added in: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve `CAA` records for the `hostname`. On success, the `Promise` is resolved with an array of objects containing available certification authority authorization records available for the `hostname` (e.g. `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve `CNAME` records for the `hostname`. On success, the `Promise` is resolved with an array of canonical name records available for the `hostname` (e.g. `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve mail exchange records (`MX` records) for the `hostname`. On success, the `Promise` is resolved with an array of objects containing both a `priority` and `exchange` property (e.g. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve regular expression-based records (`NAPTR` records) for the `hostname`. On success, the `Promise` is resolved with an array of objects with the following properties:

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

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve name server records (`NS` records) for the `hostname`. On success, the `Promise` is resolved with an array of name server records available for `hostname` (e.g. `['ns1.example.com', 'ns2.example.com']`).

### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve pointer records (`PTR` records) for the `hostname`. On success, the `Promise` is resolved with an array of strings containing the reply records.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve a start of authority record (`SOA` record) for the `hostname`. On success, the `Promise` is resolved with an object with the following properties:

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

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve service records (`SRV` records) for the `hostname`. On success, the `Promise` is resolved with an array of objects with the following properties:

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

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uses the DNS protocol to resolve text queries (`TXT` records) for the `hostname`. On success, the `Promise` is resolved with a two-dimensional array of the text records available for `hostname` (e.g. `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Each sub-array contains TXT chunks of one record. Depending on the use case, these could be either joined together or treated separately.

### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Added in: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.

On error, the `Promise` is rejected with an [`Error`](/nodejs/api/errors#class-error) object, where `err.code` is one of the [DNS error codes](/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `ipv6first` value is supported now. |
| v17.0.0 | Changed default value to `verbatim`. |
| v16.4.0, v14.18.0 | Added in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) must be `'ipv4first'`, `'ipv6first'` or `'verbatim'`.

Set the default value of `order` in [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) and [`dnsPromises.lookup()`](/nodejs/api/dns#dnspromiseslookuphostname-options). The value could be:

- `ipv4first`: sets default `order` to `ipv4first`.
- `ipv6first`: sets default `order` to `ipv6first`.
- `verbatim`: sets default `order` to `verbatim`.

The default is `verbatim` and [`dnsPromises.setDefaultResultOrder()`](/nodejs/api/dns#dnspromisessetdefaultresultorderorder) have higher priority than [`--dns-result-order`](/nodejs/api/cli#--dns-result-orderorder). When using [worker threads](/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/nodejs/api/dns#dnspromisessetdefaultresultorderorder) from the main thread won't affect the default dns orders in workers.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Added in: v20.1.0, v18.17.0**

Get the value of `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Added in: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array of [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatted addresses

Sets the IP address and port of servers to be used when performing DNS resolution. The `servers` argument is an array of [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatted addresses. If the port is the IANA default DNS port (53) it can be omitted.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
An error will be thrown if an invalid address is provided.

The `dnsPromises.setServers()` method must not be called while a DNS query is in progress.

This method works much like [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). That is, if attempting to resolve with the first server provided results in a `NOTFOUND` error, the `resolve()` method will *not* attempt to resolve with subsequent servers provided. Fallback DNS servers will only be used if the earlier ones time out or result in some other error.

## Error codes {#error-codes}

Each DNS query can return one of the following error codes:

- `dns.NODATA`: DNS server returned an answer with no data.
- `dns.FORMERR`: DNS server claims query was misformatted.
- `dns.SERVFAIL`: DNS server returned general failure.
- `dns.NOTFOUND`: Domain name not found.
- `dns.NOTIMP`: DNS server does not implement the requested operation.
- `dns.REFUSED`: DNS server refused query.
- `dns.BADQUERY`: Misformatted DNS query.
- `dns.BADNAME`: Misformatted host name.
- `dns.BADFAMILY`: Unsupported address family.
- `dns.BADRESP`: Misformatted DNS reply.
- `dns.CONNREFUSED`: Could not contact DNS servers.
- `dns.TIMEOUT`: Timeout while contacting DNS servers.
- `dns.EOF`: End of file.
- `dns.FILE`: Error reading file.
- `dns.NOMEM`: Out of memory.
- `dns.DESTRUCTION`: Channel is being destroyed.
- `dns.BADSTR`: Misformatted string.
- `dns.BADFLAGS`: Illegal flags specified.
- `dns.NONAME`: Given host name is not numeric.
- `dns.BADHINTS`: Illegal hints flags specified.
- `dns.NOTINITIALIZED`: c-ares library initialization not yet performed.
- `dns.LOADIPHLPAPI`: Error loading `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Could not find `GetNetworkParams` function.
- `dns.CANCELLED`: DNS query cancelled.

The `dnsPromises` API also exports the above error codes, e.g., `dnsPromises.NODATA`.

## Implementation considerations {#implementation-considerations}

Although [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) and the various `dns.resolve*()/dns.reverse()` functions have the same goal of associating a network name with a network address (or vice versa), their behavior is quite different. These differences can have subtle but significant consequences on the behavior of Node.js programs.

### `dns.lookup()` {#dnslookup}

Under the hood, [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) uses the same operating system facilities as most other programs. For instance, [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) will almost always resolve a given name the same way as the `ping` command. On most POSIX-like operating systems, the behavior of the [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) function can be modified by changing settings in [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) and/or [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), but changing these files will change the behavior of all other programs running on the same operating system.

Though the call to `dns.lookup()` will be asynchronous from JavaScript's perspective, it is implemented as a synchronous call to [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) that runs on libuv's threadpool. This can have surprising negative performance implications for some applications, see the [`UV_THREADPOOL_SIZE`](/nodejs/api/cli#uv_threadpool_sizesize) documentation for more information.

Various networking APIs will call `dns.lookup()` internally to resolve host names. If that is an issue, consider resolving the host name to an address using `dns.resolve()` and using the address instead of a host name. Also, some networking APIs (such as [`socket.connect()`](/nodejs/api/net#socketconnectoptions-connectlistener) and [`dgram.createSocket()`](/nodejs/api/dgram#dgramcreatesocketoptions-callback)) allow the default resolver, `dns.lookup()`, to be replaced.

### `dns.resolve()`, `dns.resolve*()`, and `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

These functions are implemented quite differently than [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback). They do not use [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) and they *always* perform a DNS query on the network. This network communication is always done asynchronously and does not use libuv's threadpool.

As a result, these functions cannot have the same negative impact on other processing that happens on libuv's threadpool that [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) can have.

They do not use the same set of configuration files that [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback) uses. For instance, they do not use the configuration from `/etc/hosts`.

