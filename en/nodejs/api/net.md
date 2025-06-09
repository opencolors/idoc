---
title: Node.js Documentation - Net
description: The 'net' module in Node.js provides an asynchronous network API for creating stream-based TCP or IPC servers and clients. It includes methods for creating connections, servers, and handling socket operations.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - Net | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The 'net' module in Node.js provides an asynchronous network API for creating stream-based TCP or IPC servers and clients. It includes methods for creating connections, servers, and handling socket operations.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - Net | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The 'net' module in Node.js provides an asynchronous network API for creating stream-based TCP or IPC servers and clients. It includes methods for creating connections, servers, and handling socket operations.
---

# Net {#net}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/net.js](https://github.com/nodejs/node/blob/v23.8.0/lib/net.js)

The `node:net` module provides an asynchronous network API for creating stream-based TCP or [IPC](/nodejs/api/net#ipc-support) servers ([`net.createServer()`](/nodejs/api/net#netcreateserveroptions-connectionlistener)) and clients ([`net.createConnection()`](/nodejs/api/net#netcreateconnection)).

It can be accessed using:



::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## IPC support {#ipc-support}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.8.0 | Support binding to abstract Unix domain socket path like `\0abstract`. We can bind '\0' for Node.js `\< v20.4.0`. |
:::

The `node:net` module supports IPC with named pipes on Windows, and Unix domain sockets on other operating systems.

### Identifying paths for IPC connections {#identifying-paths-for-ipc-connections}

[`net.connect()`](/nodejs/api/net#netconnect), [`net.createConnection()`](/nodejs/api/net#netcreateconnection), [`server.listen()`](/nodejs/api/net#serverlisten), and [`socket.connect()`](/nodejs/api/net#socketconnect) take a `path` parameter to identify IPC endpoints.

On Unix, the local domain is also known as the Unix domain. The path is a file system pathname. It will throw an error when the length of pathname is greater than the length of `sizeof(sockaddr_un.sun_path)`. Typical values are 107 bytes on Linux and 103 bytes on macOS. If a Node.js API abstraction creates the Unix domain socket, it will unlink the Unix domain socket as well. For example, [`net.createServer()`](/nodejs/api/net#netcreateserveroptions-connectionlistener) may create a Unix domain socket and [`server.close()`](/nodejs/api/net#serverclosecallback) will unlink it. But if a user creates the Unix domain socket outside of these abstractions, the user will need to remove it. The same applies when a Node.js API creates a Unix domain socket but the program then crashes. In short, a Unix domain socket will be visible in the file system and will persist until unlinked. On Linux, You can use Unix abstract socket by adding `\0` to the beginning of the path, such as `\0abstract`. The path to the Unix abstract socket is not visible in the file system and it will disappear automatically when all open references to the socket are closed.

On Windows, the local domain is implemented using a named pipe. The path *must* refer to an entry in `\\?\pipe\` or `\\.\pipe\`. Any characters are permitted, but the latter may do some processing of pipe names, such as resolving `..` sequences. Despite how it might look, the pipe namespace is flat. Pipes will *not persist*. They are removed when the last reference to them is closed. Unlike Unix domain sockets, Windows will close and remove the pipe when the owning process exits.

JavaScript string escaping requires paths to be specified with extra backslash escaping such as:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```
## Class: `net.BlockList` {#class-netblocklist}

**Added in: v15.0.0, v14.18.0**

The `BlockList` object can be used with some network APIs to specify rules for disabling inbound or outbound access to specific IP addresses, IP ranges, or IP subnets.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Added in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) An IPv4 or IPv6 address.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Either `'ipv4'` or `'ipv6'`. **Default:** `'ipv4'`.

Adds a rule to block the given IP address.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Added in: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) The starting IPv4 or IPv6 address in the range.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) The ending IPv4 or IPv6 address in the range.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Either `'ipv4'` or `'ipv6'`. **Default:** `'ipv4'`.

Adds a rule to block a range of IP addresses from `start` (inclusive) to `end` (inclusive).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Added in: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) The network IPv4 or IPv6 address.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of CIDR prefix bits. For IPv4, this must be a value between `0` and `32`. For IPv6, this must be between `0` and `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Either `'ipv4'` or `'ipv6'`. **Default:** `'ipv4'`.

Adds a rule to block a range of IP addresses specified as a subnet mask.

### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Added in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) The IP address to check
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Either `'ipv4'` or `'ipv6'`. **Default:** `'ipv4'`.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Returns `true` if the given IP address matches any of the rules added to the `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6 notation for IPv4 addresses works:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```
### `blockList.rules` {#blocklistrules}

**Added in: v15.0.0, v14.18.0**

- Type: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The list of rules added to the blocklist.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Added in: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Any JS value
- Returns `true` if the `value` is a `net.BlockList`.

## Class: `net.SocketAddress` {#class-netsocketaddress}

**Added in: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Added in: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The network address as either an IPv4 or IPv6 string. **Default**: `'127.0.0.1'` if `family` is `'ipv4'`; `'::'` if `family` is `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) One of either `'ipv4'` or `'ipv6'`. **Default**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) An IPv6 flow-label used only if `family` is `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) An IP port.
  
 

### `socketaddress.address` {#socketaddressaddress}

**Added in: v15.14.0, v14.18.0**

- Type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Added in: v15.14.0, v14.18.0**

- Type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Either `'ipv4'` or `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Added in: v15.14.0, v14.18.0**

- Type [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Added in: v15.14.0, v14.18.0**

- Type [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Added in: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) An input string containing an IP address and optional port, e.g. `123.1.2.3:1234` or `[1::1]:1234`.
- Returns: [\<net.SocketAddress\>](/nodejs/api/net#class-netsocketaddress) Returns a `SocketAddress` if parsing was successful. Otherwise returns `undefined`.

## Class: `net.Server` {#class-netserver}

**Added in: v0.1.90**

- Extends: [\<EventEmitter\>](/nodejs/api/events#class-eventemitter)

This class is used to create a TCP or [IPC](/nodejs/api/net#ipc-support) server.

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) See [`net.createServer([options][, connectionListener])`](/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Automatically set as a listener for the [`'connection'`](/nodejs/api/net#event-connection) event.
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

`net.Server` is an [`EventEmitter`](/nodejs/api/events#class-eventemitter) with the following events:

### Event: `'close'` {#event-close}

**Added in: v0.5.0**

Emitted when the server closes. If connections exist, this event is not emitted until all connections are ended.

### Event: `'connection'` {#event-connection}

**Added in: v0.1.90**

- [\<net.Socket\>](/nodejs/api/net#class-netsocket) The connection object

Emitted when a new connection is made. `socket` is an instance of `net.Socket`.

### Event: `'error'` {#event-error}

**Added in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs. Unlike [`net.Socket`](/nodejs/api/net#class-netsocket), the [`'close'`](/nodejs/api/net#event-close) event will **not** be emitted directly following this event unless [`server.close()`](/nodejs/api/net#serverclosecallback) is manually called. See the example in discussion of [`server.listen()`](/nodejs/api/net#serverlisten).

### Event: `'listening'` {#event-listening}

**Added in: v0.1.90**

Emitted when the server has been bound after calling [`server.listen()`](/nodejs/api/net#serverlisten).

### Event: `'drop'` {#event-drop}

**Added in: v18.6.0, v16.17.0**

When the number of connections reaches the threshold of `server.maxConnections`, the server will drop new connections and emit `'drop'` event instead. If it is a TCP server, the argument is as follows, otherwise the argument is `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The argument passed to event listener. 
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)  Local address.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Local port.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Local family.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Remote address.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remote port.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Remote IP family. `'IPv4'` or `'IPv6'`.
  
 

### `server.address()` {#serveraddress}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0 | The `family` property now returns a string instead of a number. |
| v18.0.0 | The `family` property now returns a number instead of a string. |
| v0.1.90 | Added in: v0.1.90 |
:::

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Returns the bound `address`, the address `family` name, and `port` of the server as reported by the operating system if listening on an IP socket (useful to find which port was assigned when getting an OS-assigned address): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

For a server listening on a pipe or Unix domain socket, the name is returned as a string.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
```
`server.address()` returns `null` before the `'listening'` event has been emitted or after calling `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Added in: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Called when the server is closed.
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Stops the server from accepting new connections and keeps existing connections. This function is asynchronous, the server is finally closed when all connections are ended and the server emits a [`'close'`](/nodejs/api/net#event-close) event. The optional `callback` will be called once the `'close'` event occurs. Unlike that event, it will be called with an `Error` as its only argument if the server was not open when it was closed.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Calls [`server.close()`](/nodejs/api/net#serverclosecallback) and returns a promise that fulfills when the server has closed.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Added in: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Asynchronously get the number of concurrent connections on the server. Works when sockets were sent to forks.

Callback should take two arguments `err` and `count`.

### `server.listen()` {#serverlisten}

Start a server listening for connections. A `net.Server` can be a TCP or an [IPC](/nodejs/api/net#ipc-support) server depending on what it listens to.

Possible signatures:

- [`server.listen(handle[, backlog][, callback])`](/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/nodejs/api/net#serverlistenpath-backlog-callback) for [IPC](/nodejs/api/net#ipc-support) servers
- [`server.listen([port[, host[, backlog]]][, callback])`](/nodejs/api/net#serverlistenport-host-backlog-callback) for TCP servers

This function is asynchronous. When the server starts listening, the [`'listening'`](/nodejs/api/net#event-listening) event will be emitted. The last parameter `callback` will be added as a listener for the [`'listening'`](/nodejs/api/net#event-listening) event.

All `listen()` methods can take a `backlog` parameter to specify the maximum length of the queue of pending connections. The actual length will be determined by the OS through sysctl settings such as `tcp_max_syn_backlog` and `somaxconn` on Linux. The default value of this parameter is 511 (not 512).

All [`net.Socket`](/nodejs/api/net#class-netsocket) are set to `SO_REUSEADDR` (see [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) for details).

The `server.listen()` method can be called again if and only if there was an error during the first `server.listen()` call or `server.close()` has been called. Otherwise, an `ERR_SERVER_ALREADY_LISTEN` error will be thrown.

One of the most common errors raised when listening is `EADDRINUSE`. This happens when another server is already listening on the requested `port`/`path`/`handle`. One way to handle this would be to retry after a certain amount of time:

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

**Added in: v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Common parameter of [`server.listen()`](/nodejs/api/net#serverlisten) functions
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Start a server listening for connections on a given `handle` that has already been bound to a port, a Unix domain socket, or a Windows named pipe.

The `handle` object can be either a server, a socket (anything with an underlying `_handle` member), or an object with an `fd` member that is a valid file descriptor.

Listening on a file descriptor is not supported on Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.1.0 | The `reusePort` option is supported. |
| v15.6.0 | AbortSignal support was added. |
| v11.4.0 | The `ipv6Only` option is supported. |
| v0.11.14 | Added in: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Required. Supports the following properties: 
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Common parameter of [`server.listen()`](/nodejs/api/net#serverlisten) functions.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) For TCP servers, setting `ipv6Only` to `true` will disable dual-stack support, i.e., binding to host `::` won't make `0.0.0.0` be bound. **Default:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) For TCP servers, setting `reusePort` to `true` allows multiple sockets on the same host to bind to the same port. Incoming connections are distributed by the operating system to listening sockets. This option is available only on some platforms, such as Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4, and AIX 7.2.5+. **Default:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Will be ignored if `port` is specified. See [Identifying paths for IPC connections](/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) For IPC servers makes the pipe readable for all users. **Default:** `false`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An AbortSignal that may be used to close a listening server.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) For IPC servers makes the pipe writable for all users. **Default:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

If `port` is specified, it behaves the same as [`server.listen([port[, host[, backlog]]][, callback])`](/nodejs/api/net#serverlistenport-host-backlog-callback). Otherwise, if `path` is specified, it behaves the same as [`server.listen(path[, backlog][, callback])`](/nodejs/api/net#serverlistenpath-backlog-callback). If none of them is specified, an error will be thrown.

If `exclusive` is `false` (default), then cluster workers will use the same underlying handle, allowing connection handling duties to be shared. When `exclusive` is `true`, the handle is not shared, and attempted port sharing results in an error. An example which listens on an exclusive port is shown below.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
When `exclusive` is `true` and the underlying handle is shared, it is possible that several workers query a handle with different backlogs. In this case, the first `backlog` passed to the master process will be used.

Starting an IPC server as root may cause the server path to be inaccessible for unprivileged users. Using `readableAll` and `writableAll` will make the server accessible for all users.

If the `signal` option is enabled, calling `.abort()` on the corresponding `AbortController` is similar to calling `.close()` on the server:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Later, when you want to close the server.
controller.abort();
```
#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Path the server should listen to. See [Identifying paths for IPC connections](/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Common parameter of [`server.listen()`](/nodejs/api/net#serverlisten) functions.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Start an [IPC](/nodejs/api/net#ipc-support) server listening for connections on the given `path`.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Common parameter of [`server.listen()`](/nodejs/api/net#serverlisten) functions.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Start a TCP server listening for connections on the given `port` and `host`.

If `port` is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using `server.address().port` after the [`'listening'`](/nodejs/api/net#event-listening) event has been emitted.

If `host` is omitted, the server will accept connections on the [unspecified IPv6 address](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) when IPv6 is available, or the [unspecified IPv4 address](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) otherwise.

In most operating systems, listening to the [unspecified IPv6 address](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) may cause the `net.Server` to also listen on the [unspecified IPv4 address](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).

### `server.listening` {#serverlistening}

**Added in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indicates whether or not the server is listening for connections.

### `server.maxConnections` {#servermaxconnections}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | Setting `maxConnections` to `0` drops all the incoming connections. Previously, it was interpreted as `Infinity`. |
| v0.2.0 | Added in: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

When the number of connections reaches the `server.maxConnections` threshold:

It is not recommended to use this option once a socket has been sent to a child with [`child_process.fork()`](/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Added in: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Set this property to `true` to begin closing connections once the number of connections reaches the [`server.maxConnections`][] threshold. This setting is only effective in cluster mode.

### `server.ref()` {#serverref}

**Added in: v0.9.1**

- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Opposite of `unref()`, calling `ref()` on a previously `unref`ed server will *not* let the program exit if it's the only server left (the default behavior). If the server is `ref`ed calling `ref()` again will have no effect.

### `server.unref()` {#serverunref}

**Added in: v0.9.1**

- Returns: [\<net.Server\>](/nodejs/api/net#class-netserver)

Calling `unref()` on a server will allow the program to exit if this is the only active server in the event system. If the server is already `unref`ed calling `unref()` again will have no effect.

## Class: `net.Socket` {#class-netsocket}

**Added in: v0.3.4**

- Extends: [\<stream.Duplex\>](/nodejs/api/stream#class-streamduplex)

This class is an abstraction of a TCP socket or a streaming [IPC](/nodejs/api/net#ipc-support) endpoint (uses named pipes on Windows, and Unix domain sockets otherwise). It is also an [`EventEmitter`](/nodejs/api/events#class-eventemitter).

A `net.Socket` can be created by the user and used directly to interact with a server. For example, it is returned by [`net.createConnection()`](/nodejs/api/net#netcreateconnection), so the user can use it to talk to the server.

It can also be created by Node.js and passed to the user when a connection is received. For example, it is passed to the listeners of a [`'connection'`](/nodejs/api/net#event-connection) event emitted on a [`net.Server`](/nodejs/api/net#class-netserver), so the user can use it to interact with the client.

### `new net.Socket([options])` {#new-netsocketoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.14.0 | AbortSignal support was added. |
| v12.10.0 | Added `onread` option. |
| v0.3.4 | Added in: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Available options are: 
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `false`, then the socket will automatically end the writable side when the readable side ends. See [`net.createServer()`](/nodejs/api/net#netcreateserveroptions-connectionlistener) and the [`'end'`](/nodejs/api/net#event-end) event for details. **Default:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) If specified, incoming data is stored in a single `buffer` and passed to the supplied `callback` when data arrives on the socket. This will cause the streaming functionality to not provide any data. The socket will emit events like `'error'`, `'end'`, and `'close'` as usual. Methods like `pause()` and `resume()` will also behave as expected. 
    - `buffer` [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Either a reusable chunk of memory to use for storing incoming data or a function that returns such.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) This function is called for every chunk of incoming data. Two arguments are passed to it: the number of bytes written to `buffer` and a reference to `buffer`. Return `false` from this function to implicitly `pause()` the socket. This function will be executed in the global context.
  
 
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Allow reads on the socket when an `fd` is passed, otherwise ignored. **Default:** `false`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An Abort signal that may be used to destroy the socket.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Allow writes on the socket when an `fd` is passed, otherwise ignored. **Default:** `false`.
  
 
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Creates a new socket object.

The newly created socket can be either a TCP socket or a streaming [IPC](/nodejs/api/net#ipc-support) endpoint, depending on what it [`connect()`](/nodejs/api/net#socketconnect) to.

### Event: `'close'` {#event-close_1}

**Added in: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if the socket had a transmission error.

Emitted once the socket is fully closed. The argument `hadError` is a boolean which says if the socket was closed due to a transmission error.

### Event: `'connect'` {#event-connect}

**Added in: v0.1.90**

Emitted when a socket connection is successfully established. See [`net.createConnection()`](/nodejs/api/net#netcreateconnection).

### Event: `'connectionAttempt'` {#event-connectionattempt}

**Added in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The IP which the socket is attempting to connect to.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The port which the socket is attempting to connect to.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The family of the IP. It can be `6` for IPv6 or `4` for IPv4.

Emitted when a new connection attempt is started. This may be emitted multiple times if the family autoselection algorithm is enabled in [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener).

### Event: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Added in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The IP which the socket attempted to connect to.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The port which the socket attempted to connect to.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The family of the IP. It can be `6` for IPv6 or `4` for IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) The error associated with the failure.

Emitted when a connection attempt failed. This may be emitted multiple times if the family autoselection algorithm is enabled in [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener).

### Event: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Added in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The IP which the socket attempted to connect to.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The port which the socket attempted to connect to.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The family of the IP. It can be `6` for IPv6 or `4` for IPv4.

Emitted when a connection attempt timed out. This is only emitted (and may be emitted multiple times) if the family autoselection algorithm is enabled in [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener).

### Event: `'data'` {#event-data}

**Added in: v0.1.90**

- [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Emitted when data is received. The argument `data` will be a `Buffer` or `String`. Encoding of data is set by [`socket.setEncoding()`](/nodejs/api/net#socketsetencodingencoding).

The data will be lost if there is no listener when a `Socket` emits a `'data'` event.

### Event: `'drain'` {#event-drain}

**Added in: v0.1.90**

Emitted when the write buffer becomes empty. Can be used to throttle uploads.

See also: the return values of `socket.write()`.

### Event: `'end'` {#event-end}

**Added in: v0.1.90**

Emitted when the other end of the socket signals the end of transmission, thus ending the readable side of the socket.

By default (`allowHalfOpen` is `false`) the socket will send an end of transmission packet back and destroy its file descriptor once it has written out its pending write queue. However, if `allowHalfOpen` is set to `true`, the socket will not automatically [`end()`](/nodejs/api/net#socketenddata-encoding-callback) its writable side, allowing the user to write arbitrary amounts of data. The user must call [`end()`](/nodejs/api/net#socketenddata-encoding-callback) explicitly to close the connection (i.e. sending a FIN packet back).

### Event: `'error'` {#event-error_1}

**Added in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs. The `'close'` event will be called directly following this event.

### Event: `'lookup'` {#event-lookup}


::: info [History]
| Version | Changes |
| --- | --- |
| v5.10.0 | The `host` parameter is supported now. |
| v0.11.3 | Added in: v0.11.3 |
:::

Emitted after resolving the host name but before connecting. Not applicable to Unix sockets.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) The error object. See [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The IP address.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) The address type. See [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The host name.

### Event: `'ready'` {#event-ready}

**Added in: v9.11.0**

Emitted when a socket is ready to be used.

Triggered immediately after `'connect'`.

### Event: `'timeout'` {#event-timeout}

**Added in: v0.1.90**

Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.

See also: [`socket.setTimeout()`](/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0 | The `family` property now returns a string instead of a number. |
| v18.0.0 | The `family` property now returns a number instead of a string. |
| v0.1.90 | Added in: v0.1.90 |
:::

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Returns the bound `address`, the address `family` name and `port` of the socket as reported by the operating system: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Added in: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This property is only present if the family autoselection algorithm is enabled in [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener) and it is an array of the addresses that have been attempted.

Each address is a string in the form of `$IP:$PORT`. If the connection was successful, then the last address is the one that the socket is currently connected to.

### `socket.bufferSize` {#socketbuffersize}

**Added in: v0.3.8**

**Deprecated since: v14.6.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/nodejs/api/documentation#stability-index) [Stability: 0](/nodejs/api/documentation#stability-index) - Deprecated: Use [`writable.writableLength`](/nodejs/api/stream#writablewritablelength) instead.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

This property shows the number of characters buffered for writing. The buffer may contain strings whose length after encoding is not yet known. So this number is only an approximation of the number of bytes in the buffer.

`net.Socket` has the property that `socket.write()` always works. This is to help users get up and running quickly. The computer cannot always keep up with the amount of data that is written to a socket. The network connection simply might be too slow. Node.js will internally queue up the data written to a socket and send it out over the wire when it is possible.

The consequence of this internal buffering is that memory may grow. Users who experience large or growing `bufferSize` should attempt to "throttle" the data flows in their program with [`socket.pause()`](/nodejs/api/net#socketpause) and [`socket.resume()`](/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Added in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The amount of received bytes.

### `socket.bytesWritten` {#socketbyteswritten}

**Added in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The amount of bytes sent.

### `socket.connect()` {#socketconnect}

Initiate a connection on a given socket.

Possible signatures:

- [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/nodejs/api/net#socketconnectpath-connectlistener) for [IPC](/nodejs/api/net#ipc-support) connections.
- [`socket.connect(port[, host][, connectListener])`](/nodejs/api/net#socketconnectport-host-connectlistener) for TCP connections.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

This function is asynchronous. When the connection is established, the [`'connect'`](/nodejs/api/net#event-connect) event will be emitted. If there is a problem connecting, instead of a [`'connect'`](/nodejs/api/net#event-connect) event, an [`'error'`](/nodejs/api/net#event-error_1) event will be emitted with the error passed to the [`'error'`](/nodejs/api/net#event-error_1) listener. The last parameter `connectListener`, if supplied, will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event **once**.

This function should only be used for reconnecting a socket after `'close'` has been emitted or otherwise it may lead to undefined behavior.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.4.0 | The default value for autoSelectFamily option can be changed at runtime using `setDefaultAutoSelectFamily` or via the command line option `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | The default value for the autoSelectFamily option is now true. The `--enable-network-family-autoselection` CLI flag has been renamed to `--network-family-autoselection`. The old name is now an alias but it is discouraged. |
| v19.3.0, v18.13.0 | Added the `autoSelectFamily` option. |
| v17.7.0, v16.15.0 | The `noDelay`, `keepAlive`, and `keepAliveInitialDelay` options are supported now. |
| v6.0.0 | The `hints` option defaults to `0` in all cases now. Previously, in the absence of the `family` option it would default to `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | The `hints` option is supported now. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of [`socket.connect()`](/nodejs/api/net#socketconnect) methods. Will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event once.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Initiate a connection on a given socket. Normally this method is not needed, the socket should be created and opened with [`net.createConnection()`](/nodejs/api/net#netcreateconnection). Use this only when implementing a custom Socket.

For TCP connections, available `options` are:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): If set to `true`, it enables a family autodetection algorithm that loosely implements section 5 of [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). The `all` option passed to lookup is set to `true` and the sockets attempts to connect to all obtained IPv6 and IPv4 addresses, in sequence, until a connection is established. The first returned AAAA address is tried first, then the first returned A address, then the second returned AAAA address and so on. Each connection attempt (but the last one) is given the amount of time specified by the `autoSelectFamilyAttemptTimeout` option before timing out and trying the next address. Ignored if the `family` option is not `0` or if `localAddress` is set. Connection errors are not emitted if at least one connection succeeds. If all connections attempts fails, a single `AggregateError` with all failed attempts is emitted. **Default:** [`net.getDefaultAutoSelectFamily()`](/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): The amount of time in milliseconds to wait for a connection attempt to finish before trying the next address when using the `autoSelectFamily` option. If set to a positive integer less than `10`, then the value `10` will be used instead. **Default:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Version of IP stack. Must be `4`, `6`, or `0`. The value `0` indicates that both IPv4 and IPv6 addresses are allowed. **Default:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optional [`dns.lookup()` hints](/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host the socket should connect to. **Default:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `true`, it enables keep-alive functionality on the socket immediately after the connection is established, similarly on what is done in [`socket.setKeepAlive()`](/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Default:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket. **Default:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Local address the socket should connect from.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Local port the socket should connect from.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Custom lookup function. **Default:** [`dns.lookup()`](/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `true`, it disables the use of Nagle's algorithm immediately after the socket is established. **Default:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Required. Port the socket should connect to.
- `blockList` [\<net.BlockList\>](/nodejs/api/net#class-netblocklist) `blockList` can be used for disabling outbound access to specific IP addresses, IP ranges, or IP subnets.

For [IPC](/nodejs/api/net#ipc-support) connections, available `options` are:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Required. Path the client should connect to. See [Identifying paths for IPC connections](/nodejs/api/net#identifying-paths-for-ipc-connections). If provided, the TCP-specific options above are ignored.

#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Path the client should connect to. See [Identifying paths for IPC connections](/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of [`socket.connect()`](/nodejs/api/net#socketconnect) methods. Will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event once.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Initiate an [IPC](/nodejs/api/net#ipc-support) connection on the given socket.

Alias to [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener) called with `{ path: path }` as `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port the client should connect to.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host the client should connect to.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of [`socket.connect()`](/nodejs/api/net#socketconnect) methods. Will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event once.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Initiate a TCP connection on the given socket.

Alias to [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener) called with `{port: port, host: host}` as `options`.

### `socket.connecting` {#socketconnecting}

**Added in: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

If `true`, [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener) was called and has not yet finished. It will stay `true` until the socket becomes connected, then it is set to `false` and the `'connect'` event is emitted. Note that the [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener) callback is a listener for the `'connect'` event.

### `socket.destroy([error])` {#socketdestroyerror}

**Added in: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Ensures that no more I/O activity happens on this socket. Destroys the stream and closes the connection.

See [`writable.destroy()`](/nodejs/api/stream#writabledestroyerror) for further details.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indicates if the connection is destroyed or not. Once a connection is destroyed no further data can be transferred using it.

See [`writable.destroyed`](/nodejs/api/stream#writabledestroyed) for further details.

### `socket.destroySoon()` {#socketdestroysoon}

**Added in: v0.3.4**

Destroys the socket after all data is written. If the `'finish'` event was already emitted the socket is destroyed immediately. If the socket is still writable it implicitly calls `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Added in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Only used when data is `string`. **Default:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optional callback for when the socket is finished.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Half-closes the socket. i.e., it sends a FIN packet. It is possible the server will still send some data.

See [`writable.end()`](/nodejs/api/stream#writableendchunk-encoding-callback) for further details.

### `socket.localAddress` {#socketlocaladdress}

**Added in: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The string representation of the local IP address the remote client is connecting on. For example, in a server listening on `'0.0.0.0'`, if a client connects on `'192.168.1.1'`, the value of `socket.localAddress` would be `'192.168.1.1'`.

### `socket.localPort` {#socketlocalport}

**Added in: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The numeric representation of the local port. For example, `80` or `21`.

### `socket.localFamily` {#socketlocalfamily}

**Added in: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The string representation of the local IP family. `'IPv4'` or `'IPv6'`.

### `socket.pause()` {#socketpause}

- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Pauses the reading of data. That is, [`'data'`](/nodejs/api/net#event-data) events will not be emitted. Useful to throttle back an upload.

### `socket.pending` {#socketpending}

**Added in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

This is `true` if the socket is not connected yet, either because `.connect()` has not yet been called or because it is still in the process of connecting (see [`socket.connecting`](/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Added in: v0.9.1**

- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Opposite of `unref()`, calling `ref()` on a previously `unref`ed socket will *not* let the program exit if it's the only socket left (the default behavior). If the socket is `ref`ed calling `ref` again will have no effect.

### `socket.remoteAddress` {#socketremoteaddress}

**Added in: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The string representation of the remote IP address. For example, `'74.125.127.100'` or `'2001:4860:a005::68'`. Value may be `undefined` if the socket is destroyed (for example, if the client disconnected).

### `socket.remoteFamily` {#socketremotefamily}

**Added in: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The string representation of the remote IP family. `'IPv4'` or `'IPv6'`. Value may be `undefined` if the socket is destroyed (for example, if the client disconnected).

### `socket.remotePort` {#socketremoteport}

**Added in: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The numeric representation of the remote port. For example, `80` or `21`. Value may be `undefined` if the socket is destroyed (for example, if the client disconnected).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Added in: v18.3.0, v16.17.0**

- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Close the TCP connection by sending an RST packet and destroy the stream. If this TCP socket is in connecting status, it will send an RST packet and destroy this TCP socket once it is connected. Otherwise, it will call `socket.destroy` with an `ERR_SOCKET_CLOSED` Error. If this is not a TCP socket (for example, a pipe), calling this method will immediately throw an `ERR_INVALID_HANDLE_TYPE` Error.

### `socket.resume()` {#socketresume}

- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Resumes reading after a call to [`socket.pause()`](/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Added in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Set the encoding for the socket as a [Readable Stream](/nodejs/api/stream#class-streamreadable). See [`readable.setEncoding()`](/nodejs/api/stream#readablesetencodingencoding) for more information.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | New defaults for `TCP_KEEPCNT` and `TCP_KEEPINTVL` socket options were added. |
| v0.1.92 | Added in: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Enable/disable keep-alive functionality, and optionally set the initial delay before the first keepalive probe is sent on an idle socket.

Set `initialDelay` (in milliseconds) to set the delay between the last data packet received and the first keepalive probe. Setting `0` for `initialDelay` will leave the value unchanged from the default (or previous) setting.

Enabling the keep-alive functionality will set the following socket options:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`

### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Added in: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Enable/disable the use of Nagle's algorithm.

When a TCP connection is created, it will have Nagle's algorithm enabled.

Nagle's algorithm delays data before it is sent via the network. It attempts to optimize throughput at the expense of latency.

Passing `true` for `noDelay` or not passing an argument will disable Nagle's algorithm for the socket. Passing `false` for `noDelay` will enable Nagle's algorithm.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Sets the socket to timeout after `timeout` milliseconds of inactivity on the socket. By default `net.Socket` do not have a timeout.

When an idle timeout is triggered the socket will receive a [`'timeout'`](/nodejs/api/net#event-timeout) event but the connection will not be severed. The user must manually call [`socket.end()`](/nodejs/api/net#socketenddata-encoding-callback) or [`socket.destroy()`](/nodejs/api/net#socketdestroyerror) to end the connection.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
If `timeout` is 0, then the existing idle timeout is disabled.

The optional `callback` parameter will be added as a one-time listener for the [`'timeout'`](/nodejs/api/net#event-timeout) event.

### `socket.timeout` {#sockettimeout}

**Added in: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

The socket timeout in milliseconds as set by [`socket.setTimeout()`](/nodejs/api/net#socketsettimeouttimeout-callback). It is `undefined` if a timeout has not been set.

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The socket itself.

Calling `unref()` on a socket will allow the program to exit if this is the only active socket in the event system. If the socket is already `unref`ed calling `unref()` again will have no effect.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Added in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Only used when data is `string`. **Default:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sends data on the socket. The second parameter specifies the encoding in the case of a string. It defaults to UTF8 encoding.

Returns `true` if the entire data was flushed successfully to the kernel buffer. Returns `false` if all or part of the data was queued in user memory. [`'drain'`](/nodejs/api/net#event-drain) will be emitted when the buffer is again free.

The optional `callback` parameter will be executed when the data is finally written out, which may not be immediately.

See `Writable` stream [`write()`](/nodejs/api/stream#writablewritechunk-encoding-callback) method for more information.

### `socket.readyState` {#socketreadystate}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This property represents the state of the connection as a string.

- If the stream is connecting `socket.readyState` is `opening`.
- If the stream is readable and writable, it is `open`.
- If the stream is readable and not writable, it is `readOnly`.
- If the stream is not readable and writable, it is `writeOnly`.

## `net.connect()` {#netconnect}

Aliases to [`net.createConnection()`](/nodejs/api/net#netcreateconnection).

Possible signatures:

- [`net.connect(options[, connectListener])`](/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/nodejs/api/net#netconnectpath-connectlistener) for [IPC](/nodejs/api/net#ipc-support) connections.
- [`net.connect(port[, host][, connectListener])`](/nodejs/api/net#netconnectport-host-connectlistener) for TCP connections.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Added in: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Alias to [`net.createConnection(options[, connectListener])`](/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Alias to [`net.createConnection(path[, connectListener])`](/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket)

Alias to [`net.createConnection(port[, host][, connectListener])`](/nodejs/api/net#netcreateconnectionport-host-connectlistener).

## `net.createConnection()` {#netcreateconnection}

A factory function, which creates a new [`net.Socket`](/nodejs/api/net#class-netsocket), immediately initiates connection with [`socket.connect()`](/nodejs/api/net#socketconnect), then returns the `net.Socket` that starts the connection.

When the connection is established, a [`'connect'`](/nodejs/api/net#event-connect) event will be emitted on the returned socket. The last parameter `connectListener`, if supplied, will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event **once**.

Possible signatures:

- [`net.createConnection(options[, connectListener])`](/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/nodejs/api/net#netcreateconnectionpath-connectlistener) for [IPC](/nodejs/api/net#ipc-support) connections.
- [`net.createConnection(port[, host][, connectListener])`](/nodejs/api/net#netcreateconnectionport-host-connectlistener) for TCP connections.

The [`net.connect()`](/nodejs/api/net#netconnect) function is an alias to this function.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Added in: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Required. Will be passed to both the [`new net.Socket([options])`](/nodejs/api/net#new-netsocketoptions) call and the [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener) method.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of the [`net.createConnection()`](/nodejs/api/net#netcreateconnection) functions. If supplied, will be added as a listener for the [`'connect'`](/nodejs/api/net#event-connect) event on the returned socket once.
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The newly created socket used to start the connection.

For available options, see [`new net.Socket([options])`](/nodejs/api/net#new-netsocketoptions) and [`socket.connect(options[, connectListener])`](/nodejs/api/net#socketconnectoptions-connectlistener).

Additional options:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) If set, will be used to call [`socket.setTimeout(timeout)`](/nodejs/api/net#socketsettimeouttimeout-callback) after the socket is created, but before it starts the connection.

Following is an example of a client of the echo server described in the [`net.createServer()`](/nodejs/api/net#netcreateserveroptions-connectionlistener) section:



::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

To connect on the socket `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
Following is an example of a client using the `port` and `onread` option. In this case, the `onread` option will be only used to call `new net.Socket([options])` and the `port` option will be used to call `socket.connect(options[, connectListener])`.



::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
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
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::

### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Path the socket should connect to. Will be passed to [`socket.connect(path[, connectListener])`](/nodejs/api/net#socketconnectpath-connectlistener). See [Identifying paths for IPC connections](/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of the [`net.createConnection()`](/nodejs/api/net#netcreateconnection) functions, an "once" listener for the `'connect'` event on the initiating socket. Will be passed to [`socket.connect(path[, connectListener])`](/nodejs/api/net#socketconnectpath-connectlistener).
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The newly created socket used to start the connection.

Initiates an [IPC](/nodejs/api/net#ipc-support) connection.

This function creates a new [`net.Socket`](/nodejs/api/net#class-netsocket) with all options set to default, immediately initiates connection with [`socket.connect(path[, connectListener])`](/nodejs/api/net#socketconnectpath-connectlistener), then returns the `net.Socket` that starts the connection.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port the socket should connect to. Will be passed to [`socket.connect(port[, host][, connectListener])`](/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host the socket should connect to. Will be passed to [`socket.connect(port[, host][, connectListener])`](/nodejs/api/net#socketconnectport-host-connectlistener). **Default:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Common parameter of the [`net.createConnection()`](/nodejs/api/net#netcreateconnection) functions, an "once" listener for the `'connect'` event on the initiating socket. Will be passed to [`socket.connect(port[, host][, connectListener])`](/nodejs/api/net#socketconnectport-host-connectlistener).
- Returns: [\<net.Socket\>](/nodejs/api/net#class-netsocket) The newly created socket used to start the connection.

Initiates a TCP connection.

This function creates a new [`net.Socket`](/nodejs/api/net#class-netsocket) with all options set to default, immediately initiates connection with [`socket.connect(port[, host][, connectListener])`](/nodejs/api/net#socketconnectport-host-connectlistener), then returns the `net.Socket` that starts the connection.

## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | The `highWaterMark` option is supported now. |
| v17.7.0, v16.15.0 | The `noDelay`, `keepAlive`, and `keepAliveInitialDelay` options are supported now. |
| v0.5.0 | Added in: v0.5.0 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `false`, then the socket will automatically end the writable side when the readable side ends. **Default:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionally overrides all [`net.Socket`](/nodejs/api/net#class-netsocket)s' `readableHighWaterMark` and `writableHighWaterMark`. **Default:** See [`stream.getDefaultHighWaterMark()`](/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `true`, it enables keep-alive functionality on the socket immediately after a new incoming connection is received, similarly on what is done in [`socket.setKeepAlive()`](/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Default:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket. **Default:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `true`, it disables the use of Nagle's algorithm immediately after a new incoming connection is received. **Default:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indicates whether the socket should be paused on incoming connections. **Default:** `false`.
    - `blockList` [\<net.BlockList\>](/nodejs/api/net#class-netblocklist) `blockList` can be used for disabling inbound access to specific IP addresses, IP ranges, or IP subnets. This does not work if the server is behind a reverse proxy, NAT, etc. because the address checked against the block list is the address of the proxy, or the one specified by the NAT.
  
 
-  `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Automatically set as a listener for the [`'connection'`](/nodejs/api/net#event-connection) event. 
-  Returns: [\<net.Server\>](/nodejs/api/net#class-netserver) 

Creates a new TCP or [IPC](/nodejs/api/net#ipc-support) server.

If `allowHalfOpen` is set to `true`, when the other end of the socket signals the end of transmission, the server will only send back the end of transmission when [`socket.end()`](/nodejs/api/net#socketenddata-encoding-callback) is explicitly called. For example, in the context of TCP, when a FIN packed is received, a FIN packed is sent back only when [`socket.end()`](/nodejs/api/net#socketenddata-encoding-callback) is explicitly called. Until then the connection is half-closed (non-readable but still writable). See [`'end'`](/nodejs/api/net#event-end) event and [RFC 1122](https://tools.ietf.org/html/rfc1122) (section 4.2.2.13) for more information.

If `pauseOnConnect` is set to `true`, then the socket associated with each incoming connection will be paused, and no data will be read from its handle. This allows connections to be passed between processes without any data being read by the original process. To begin reading data from a paused socket, call [`socket.resume()`](/nodejs/api/net#socketresume).

The server can be a TCP server or an [IPC](/nodejs/api/net#ipc-support) server, depending on what it [`listen()`](/nodejs/api/net#serverlisten) to.

Here is an example of a TCP echo server which listens for connections on port 8124:



::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
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
  // 'connection' listener.
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

Test this by using `telnet`:

```bash [BASH]
telnet localhost 8124
```
To listen on the socket `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Use `nc` to connect to a Unix domain socket server:

```bash [BASH]
nc -U /tmp/echo.sock
```
## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Added in: v19.4.0**

Gets the current default value of the `autoSelectFamily` option of [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener). The initial default value is `true`, unless the command line option `--no-network-family-autoselection` is provided.

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) The current default value of the `autoSelectFamily` option.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Added in: v19.4.0**

Sets the default value of the `autoSelectFamily` option of [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) The new default value. The initial default value is `true`, unless the command line option `--no-network-family-autoselection` is provided.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Added in: v19.8.0, v18.18.0**

Gets the current default value of the `autoSelectFamilyAttemptTimeout` option of [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener). The initial default value is `250` or the value specified via the command line option `--network-family-autoselection-attempt-timeout`.

- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The current default value of the `autoSelectFamilyAttemptTimeout` option.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Added in: v19.8.0, v18.18.0**

Sets the default value of the `autoSelectFamilyAttemptTimeout` option of [`socket.connect(options)`](/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The new default value, which must be a positive number. If the number is less than `10`, the value `10` is used instead. The initial default value is `250` or the value specified via the command line option `--network-family-autoselection-attempt-timeout`.

## `net.isIP(input)` {#netisipinput}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Returns `6` if `input` is an IPv6 address. Returns `4` if `input` is an IPv4 address in [dot-decimal notation](https://en.wikipedia.org/wiki/Dot-decimal_notation) with no leading zeroes. Otherwise, returns `0`.

```js [ESM]
net.isIP('::1'); // returns 6
net.isIP('127.0.0.1'); // returns 4
net.isIP('127.000.000.001'); // returns 0
net.isIP('127.0.0.1/24'); // returns 0
net.isIP('fhqwhgads'); // returns 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Returns `true` if `input` is an IPv4 address in [dot-decimal notation](https://en.wikipedia.org/wiki/Dot-decimal_notation) with no leading zeroes. Otherwise, returns `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // returns true
net.isIPv4('127.000.000.001'); // returns false
net.isIPv4('127.0.0.1/24'); // returns false
net.isIPv4('fhqwhgads'); // returns false
```
## `net.isIPv6(input)` {#netisipv6input}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Returns `true` if `input` is an IPv6 address. Otherwise, returns `false`.

```js [ESM]
net.isIPv6('::1'); // returns true
net.isIPv6('fhqwhgads'); // returns false
```
