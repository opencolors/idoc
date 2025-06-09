---
title: Node.js 문서 - 네트워크
description: Node.js의 'net' 모듈은 스트림 기반의 TCP 또는 IPC 서버 및 클라이언트를 비동기적으로 생성하기 위한 네트워크 API를 제공합니다. 연결 생성, 서버 생성, 소켓 작업 처리를 위한 메서드가 포함되어 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 네트워크 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 'net' 모듈은 스트림 기반의 TCP 또는 IPC 서버 및 클라이언트를 비동기적으로 생성하기 위한 네트워크 API를 제공합니다. 연결 생성, 서버 생성, 소켓 작업 처리를 위한 메서드가 포함되어 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 네트워크 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 'net' 모듈은 스트림 기반의 TCP 또는 IPC 서버 및 클라이언트를 비동기적으로 생성하기 위한 네트워크 API를 제공합니다. 연결 생성, 서버 생성, 소켓 작업 처리를 위한 메서드가 포함되어 있습니다.
---


# Net {#net}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

`node:net` 모듈은 스트림 기반 TCP 또는 [IPC](/ko/nodejs/api/net#ipc-support) 서버([`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener)) 및 클라이언트([`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection))를 만들기 위한 비동기 네트워크 API를 제공합니다.

다음을 사용하여 액세스할 수 있습니다.

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## IPC 지원 {#ipc-support}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0 | `\0abstract`와 같은 추상 Unix 도메인 소켓 경로에 바인딩하는 지원. Node.js `\< v20.4.0`의 경우 '\0'에 바인딩할 수 있습니다. |
:::

`node:net` 모듈은 Windows에서는 명명된 파이프를, 다른 운영 체제에서는 Unix 도메인 소켓을 사용하는 IPC를 지원합니다.

### IPC 연결 경로 식별 {#identifying-paths-for-ipc-connections}

[`net.connect()`](/ko/nodejs/api/net#netconnect), [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection), [`server.listen()`](/ko/nodejs/api/net#serverlisten) 및 [`socket.connect()`](/ko/nodejs/api/net#socketconnect)는 IPC 엔드포인트를 식별하기 위해 `path` 매개변수를 사용합니다.

Unix에서는 로컬 도메인을 Unix 도메인이라고도 합니다. 경로는 파일 시스템 경로 이름입니다. 경로 이름의 길이가 `sizeof(sockaddr_un.sun_path)`의 길이보다 크면 오류가 발생합니다. 일반적인 값은 Linux에서는 107바이트, macOS에서는 103바이트입니다. Node.js API 추상화가 Unix 도메인 소켓을 생성하는 경우 Unix 도메인 소켓도 연결 해제합니다. 예를 들어 [`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener)는 Unix 도메인 소켓을 생성할 수 있고 [`server.close()`](/ko/nodejs/api/net#serverclosecallback)는 연결을 해제합니다. 그러나 사용자가 이러한 추상화 외부에서 Unix 도메인 소켓을 생성하는 경우 사용자가 제거해야 합니다. Node.js API가 Unix 도메인 소켓을 생성했지만 프로그램이 충돌하는 경우에도 마찬가지입니다. 요약하자면, Unix 도메인 소켓은 파일 시스템에 표시되고 연결이 해제될 때까지 유지됩니다. Linux에서는 경로 시작 부분에 `\0`을 추가하여 Unix 추상 소켓을 사용할 수 있습니다(예: `\0abstract`). Unix 추상 소켓 경로는 파일 시스템에 표시되지 않으며 소켓에 대한 모든 열린 참조가 닫히면 자동으로 사라집니다.

Windows에서는 로컬 도메인이 명명된 파이프를 사용하여 구현됩니다. 경로는 `\\?\pipe\` 또는 `\\.\pipe\`의 항목을 *참조해야 합니다*. 모든 문자가 허용되지만 후자는 `..` 시퀀스 해결과 같은 파이프 이름에 대한 일부 처리를 수행할 수 있습니다. 보이는 것과는 달리 파이프 네임스페이스는 평면적입니다. 파이프는 *유지되지 않습니다*. 파이프에 대한 마지막 참조가 닫히면 제거됩니다. Unix 도메인 소켓과 달리 Windows는 소유 프로세스가 종료될 때 파이프를 닫고 제거합니다.

JavaScript 문자열 이스케이프를 사용하려면 다음과 같이 추가 백슬래시 이스케이프를 사용하여 경로를 지정해야 합니다.

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## 클래스: `net.BlockList` {#class-netblocklist}

**추가됨: v15.0.0, v14.18.0**

`BlockList` 객체는 특정 IP 주소, IP 범위 또는 IP 서브넷에 대한 인바운드 또는 아웃바운드 액세스를 비활성화하기 위한 규칙을 지정하기 위해 일부 네트워크 API와 함께 사용할 수 있습니다.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**추가됨: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) IPv4 또는 IPv6 주소.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'`. **기본값:** `'ipv4'`.

지정된 IP 주소를 차단하는 규칙을 추가합니다.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**추가됨: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) 범위의 시작 IPv4 또는 IPv6 주소.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) 범위의 끝 IPv4 또는 IPv6 주소.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'`. **기본값:** `'ipv4'`.

`start`(포함)에서 `end`(포함)까지의 IP 주소 범위를 차단하는 규칙을 추가합니다.

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**추가됨: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) 네트워크 IPv4 또는 IPv6 주소.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CIDR 프리픽스 비트 수. IPv4의 경우 `0`에서 `32` 사이의 값이어야 합니다. IPv6의 경우 `0`에서 `128` 사이여야 합니다.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'`. **기본값:** `'ipv4'`.

서브넷 마스크로 지정된 IP 주소 범위를 차단하는 규칙을 추가합니다.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Added in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) 확인할 IP 주소
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'`. **기본값:** `'ipv4'`.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

주어진 IP 주소가 `BlockList`에 추가된 규칙과 일치하면 `true`를 반환합니다.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv4 주소에 대한 IPv6 표기법이 작동합니다:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```
### `blockList.rules` {#blocklistrules}

**Added in: v15.0.0, v14.18.0**

- 타입: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

블록리스트에 추가된 규칙 목록입니다.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Added in: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 임의의 JS 값
- `value`가 `net.BlockList`이면 `true`를 반환합니다.

## Class: `net.SocketAddress` {#class-netsocketaddress}

**Added in: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Added in: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 또는 IPv6 문자열로 된 네트워크 주소. **기본값**: `family`가 `'ipv4'`이면 `'127.0.0.1'`; `family`가 `'ipv6'`이면 `'::'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'` 중 하나. **기본값**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `family`가 `'ipv6'`인 경우에만 사용되는 IPv6 플로우 레이블.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP 포트.


### `socketaddress.address` {#socketaddressaddress}

**Added in: v15.14.0, v14.18.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Added in: v15.14.0, v14.18.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` 또는 `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Added in: v15.14.0, v14.18.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Added in: v15.14.0, v14.18.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Added in: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP 주소와 선택적 포트가 포함된 입력 문자열 (예: `123.1.2.3:1234` 또는 `[1::1]:1234`).
- 반환: [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress) 구문 분석에 성공하면 `SocketAddress`를 반환합니다. 그렇지 않으면 `undefined`를 반환합니다.

## 클래스: `net.Server` {#class-netserver}

**Added in: v0.1.90**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

이 클래스는 TCP 또는 [IPC](/ko/nodejs/api/net#ipc-support) 서버를 만드는 데 사용됩니다.

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`net.createServer([options][, connectionListener])`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener)를 참조하십시오.
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connection'`](/ko/nodejs/api/net#event-connection) 이벤트의 리스너로 자동 설정됩니다.
- 반환: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

`net.Server`는 다음 이벤트가 있는 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)입니다.

### 이벤트: `'close'` {#event-close}

**Added in: v0.5.0**

서버가 닫힐 때 발생합니다. 연결이 있는 경우, 이 이벤트는 모든 연결이 종료될 때까지 발생하지 않습니다.


### 이벤트: `'connection'` {#event-connection}

**추가된 버전: v0.1.90**

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 연결 객체

새로운 연결이 이루어질 때 발생합니다. `socket`은 `net.Socket`의 인스턴스입니다.

### 이벤트: `'error'` {#event-error}

**추가된 버전: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

오류가 발생했을 때 발생합니다. [`net.Socket`](/ko/nodejs/api/net#class-netsocket)과 달리, [`'close'`](/ko/nodejs/api/net#event-close) 이벤트는 [`server.close()`](/ko/nodejs/api/net#serverclosecallback)가 수동으로 호출되지 않는 한 이 이벤트 직후에 발생**하지 않습니다**. [`server.listen()`](/ko/nodejs/api/net#serverlisten)에 대한 설명에서 예제를 참조하십시오.

### 이벤트: `'listening'` {#event-listening}

**추가된 버전: v0.1.90**

[`server.listen()`](/ko/nodejs/api/net#serverlisten)을 호출한 후 서버가 바인딩되었을 때 발생합니다.

### 이벤트: `'drop'` {#event-drop}

**추가된 버전: v18.6.0, v16.17.0**

연결 수가 `server.maxConnections` 임계값에 도달하면 서버는 새 연결을 삭제하고 대신 `'drop'` 이벤트를 발생시킵니다. TCP 서버인 경우 인수는 다음과 같고, 그렇지 않으면 인수는 `undefined`입니다.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이벤트 리스너에 전달되는 인수입니다.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 로컬 주소입니다.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 로컬 포트입니다.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 로컬 패밀리입니다.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 원격 주소입니다.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 포트입니다.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 원격 IP 패밀리입니다. `'IPv4'` 또는 `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0 | `family` 속성이 이제 숫자가 아닌 문자열을 반환합니다. |
| v18.0.0 | `family` 속성이 이제 문자열이 아닌 숫자를 반환합니다. |
| v0.1.90 | 추가됨: v0.1.90 |
:::

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

IP 소켓에서 수신 대기하는 경우 운영 체제에서 보고한 바인딩된 `address`, 주소 `family` 이름 및 서버의 `port`를 반환합니다(OS 할당 주소를 가져올 때 할당된 포트를 찾는 데 유용함): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

파이프 또는 Unix 도메인 소켓에서 수신 대기하는 서버의 경우 이름은 문자열로 반환됩니다.

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
`server.address()`는 `'listening'` 이벤트가 발생하기 전이나 `server.close()`를 호출한 후에 `null`을 반환합니다.

### `server.close([callback])` {#serverclosecallback}

**추가됨: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 서버가 닫힐 때 호출됩니다.
- 반환: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

서버가 새 연결을 수락하지 않도록 중지하고 기존 연결을 유지합니다. 이 함수는 비동기적이며, 모든 연결이 종료되고 서버가 [`'close'`](/ko/nodejs/api/net#event-close) 이벤트를 발생시키면 서버가 최종적으로 닫힙니다. 선택적 `callback`은 `'close'` 이벤트가 발생하면 호출됩니다. 해당 이벤트와 달리 서버가 닫힐 때 열려 있지 않은 경우 `Error`를 유일한 인수로 사용하여 호출됩니다.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`server.close()`](/ko/nodejs/api/net#serverclosecallback)를 호출하고 서버가 닫히면 완료되는 Promise를 반환합니다.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Added in: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

비동기적으로 서버의 동시 연결 수를 가져옵니다. 소켓이 포크로 전송된 경우에 작동합니다.

콜백은 두 개의 인자 `err`와 `count`를 받아야 합니다.

### `server.listen()` {#serverlisten}

연결을 수신하기 위해 서버를 시작합니다. `net.Server`는 수신하는 내용에 따라 TCP 또는 [IPC](/ko/nodejs/api/net#ipc-support) 서버가 될 수 있습니다.

가능한 서명:

- [`server.listen(handle[, backlog][, callback])`](/ko/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/ko/nodejs/api/net#serverlistenoptions-callback)
- [IPC](/ko/nodejs/api/net#ipc-support) 서버의 경우 [`server.listen(path[, backlog][, callback])`](/ko/nodejs/api/net#serverlistenpath-backlog-callback)
- TCP 서버의 경우 [`server.listen([port[, host[, backlog]]][, callback])`](/ko/nodejs/api/net#serverlistenport-host-backlog-callback)

이 함수는 비동기적입니다. 서버가 수신을 시작하면 [`'listening'`](/ko/nodejs/api/net#event-listening) 이벤트가 발생합니다. 마지막 매개변수 `callback`은 [`'listening'`](/ko/nodejs/api/net#event-listening) 이벤트의 리스너로 추가됩니다.

모든 `listen()` 메서드는 보류 중인 연결 큐의 최대 길이를 지정하는 `backlog` 매개변수를 사용할 수 있습니다. 실제 길이는 Linux의 `tcp_max_syn_backlog` 및 `somaxconn`과 같은 sysctl 설정을 통해 OS에 의해 결정됩니다. 이 매개변수의 기본값은 511(512 아님)입니다.

모든 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)은 `SO_REUSEADDR`로 설정됩니다(자세한 내용은 [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) 참조).

`server.listen()` 메서드는 첫 번째 `server.listen()` 호출 중에 오류가 발생했거나 `server.close()`가 호출된 경우에만 다시 호출할 수 있습니다. 그렇지 않으면 `ERR_SERVER_ALREADY_LISTEN` 오류가 발생합니다.

수신 시 발생하는 가장 일반적인 오류 중 하나는 `EADDRINUSE`입니다. 이는 다른 서버가 요청된 `port`/`path`/`handle`에서 이미 수신 중인 경우에 발생합니다. 이를 처리하는 한 가지 방법은 특정 시간 후에 다시 시도하는 것입니다.

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
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ko/nodejs/api/net#serverlisten) 함수의 공통 매개변수
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

포트, 유닉스 도메인 소켓 또는 Windows 명명된 파이프에 이미 바인딩된 주어진 `handle`에서 연결을 수신하는 서버를 시작합니다.

`handle` 객체는 서버, 소켓(기본 `_handle` 멤버가 있는 모든 것) 또는 유효한 파일 디스크립터인 `fd` 멤버가 있는 객체가 될 수 있습니다.

파일 디스크립터에서 수신하는 것은 Windows에서 지원되지 않습니다.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.1.0 | `reusePort` 옵션이 지원됩니다. |
| v15.6.0 | AbortSignal 지원이 추가되었습니다. |
| v11.4.0 | `ipv6Only` 옵션이 지원됩니다. |
| v0.11.14 | Added in: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 필수 항목입니다. 다음 속성을 지원합니다.
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ko/nodejs/api/net#serverlisten) 함수의 공통 매개변수.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) TCP 서버의 경우 `ipv6Only`를 `true`로 설정하면 듀얼 스택 지원이 비활성화됩니다. 즉, 호스트 `::`에 바인딩해도 `0.0.0.0`이 바인딩되지 않습니다. **기본값:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) TCP 서버의 경우 `reusePort`를 `true`로 설정하면 동일한 호스트의 여러 소켓이 동일한 포트에 바인딩될 수 있습니다. 들어오는 연결은 운영 체제에서 수신 소켓으로 배포됩니다. 이 옵션은 Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 및 AIX 7.2.5+와 같은 일부 플랫폼에서만 사용할 수 있습니다. **기본값:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `port`가 지정되면 무시됩니다. [IPC 연결에 대한 경로 식별](/ko/nodejs/api/net#identifying-paths-for-ipc-connections)을 참조하십시오.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) IPC 서버의 경우 모든 사용자가 파이프를 읽을 수 있도록 합니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 수신 서버를 닫는 데 사용할 수 있는 AbortSignal입니다.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) IPC 서버의 경우 모든 사용자가 파이프에 쓸 수 있도록 합니다. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- 반환: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

`port`가 지정되면 [`server.listen([port[, host[, backlog]]][, callback])`](/ko/nodejs/api/net#serverlistenport-host-backlog-callback)과 동일하게 작동합니다. 그렇지 않고 `path`가 지정되면 [`server.listen(path[, backlog][, callback])`](/ko/nodejs/api/net#serverlistenpath-backlog-callback)과 동일하게 작동합니다. 둘 다 지정되지 않으면 오류가 발생합니다.

`exclusive`가 `false`(기본값)이면 클러스터 작업자는 동일한 기본 핸들을 사용하여 연결 처리 의무를 공유할 수 있습니다. `exclusive`가 `true`이면 핸들이 공유되지 않으며 포트 공유를 시도하면 오류가 발생합니다. 독점 포트에서 수신하는 예제가 아래에 나와 있습니다.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
`exclusive`가 `true`이고 기본 핸들이 공유되는 경우 여러 작업자가 서로 다른 백로그로 핸들을 쿼리할 수 있습니다. 이 경우 마스터 프로세스에 전달된 첫 번째 `backlog`가 사용됩니다.

IPC 서버를 루트로 시작하면 권한이 없는 사용자가 서버 경로에 액세스하지 못할 수 있습니다. `readableAll` 및 `writableAll`을 사용하면 모든 사용자가 서버에 액세스할 수 있습니다.

`signal` 옵션이 활성화된 경우 해당 `AbortController`에서 `.abort()`를 호출하는 것은 서버에서 `.close()`를 호출하는 것과 유사합니다.

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// 나중에 서버를 닫으려면
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**추가된 버전: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 서버가 수신해야 하는 경로입니다. [IPC 연결을 위한 경로 식별](/ko/nodejs/api/net#identifying-paths-for-ipc-connections)을 참조하세요.
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ko/nodejs/api/net#serverlisten) 함수의 공통 매개변수입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- 반환값: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

지정된 `path`에서 연결을 수신하는 [IPC](/ko/nodejs/api/net#ipc-support) 서버를 시작합니다.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**추가된 버전: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ko/nodejs/api/net#serverlisten) 함수의 공통 매개변수입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- 반환값: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

지정된 `port` 및 `host`에서 연결을 수신하는 TCP 서버를 시작합니다.

`port`가 생략되거나 0인 경우 운영 체제는 임의의 사용되지 않는 포트를 할당하며, 이는 [`'listening'`](/ko/nodejs/api/net#event-listening) 이벤트가 발생한 후 `server.address().port`를 사용하여 검색할 수 있습니다.

`host`가 생략되면 서버는 IPv6을 사용할 수 있는 경우 [지정되지 않은 IPv6 주소](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address)(`::`) 또는 [지정되지 않은 IPv4 주소](https://en.wikipedia.org/wiki/0.0.0.0)(`0.0.0.0`)에서 연결을 수락합니다.

대부분의 운영 체제에서 [지정되지 않은 IPv6 주소](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address)(`::`)를 수신하면 `net.Server`가 [지정되지 않은 IPv4 주소](https://en.wikipedia.org/wiki/0.0.0.0)(`0.0.0.0`)도 수신하게 될 수 있습니다.


### `server.listening` {#serverlistening}

**Added in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 서버가 연결을 수신 대기 중인지 여부를 나타냅니다.

### `server.maxConnections` {#servermaxconnections}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | `maxConnections`를 `0`으로 설정하면 모든 들어오는 연결이 삭제됩니다. 이전에는 `Infinity`로 해석되었습니다. |
| v0.2.0 | Added in: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

연결 수가 `server.maxConnections` 임계값에 도달하면:

소켓이 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)를 사용하여 자식에게 전송된 후에는 이 옵션을 사용하지 않는 것이 좋습니다.

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Added in: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

연결 수가 [`server.maxConnections`][] 임계값에 도달하면 연결을 닫기 시작하려면 이 속성을 `true`로 설정하십시오. 이 설정은 클러스터 모드에서만 유효합니다.

### `server.ref()` {#serverref}

**Added in: v0.9.1**

- Returns: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

`unref()`의 반대이며, 이전에 `unref`된 서버에서 `ref()`를 호출해도 프로그램이 유일하게 남은 서버인 경우 (기본 동작) 종료되지 않습니다. 서버가 `ref`된 경우 `ref()`를 다시 호출해도 아무런 효과가 없습니다.

### `server.unref()` {#serverunref}

**Added in: v0.9.1**

- Returns: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

서버에서 `unref()`를 호출하면 이벤트 시스템에서 이것이 유일한 활성 서버인 경우 프로그램이 종료될 수 있습니다. 서버가 이미 `unref`된 경우 `unref()`를 다시 호출해도 아무런 효과가 없습니다.

## Class: `net.Socket` {#class-netsocket}

**Added in: v0.3.4**

- Extends: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

이 클래스는 TCP 소켓 또는 스트리밍 [IPC](/ko/nodejs/api/net#ipc-support) 엔드포인트 (Windows에서는 명명된 파이프, 그 외에는 Unix 도메인 소켓 사용)의 추상화입니다. 또한 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)입니다.

`net.Socket`은 사용자가 생성하여 서버와 직접 상호 작용하는 데 사용할 수 있습니다. 예를 들어 [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection)에서 반환되므로 사용자는 이를 사용하여 서버와 통신할 수 있습니다.

Node.js에서 생성되어 연결이 수신되면 사용자에게 전달될 수도 있습니다. 예를 들어 [`net.Server`](/ko/nodejs/api/net#class-netserver)에서 발생하는 [`'connection'`](/ko/nodejs/api/net#event-connection) 이벤트의 리스너에게 전달되므로 사용자는 이를 사용하여 클라이언트와 상호 작용할 수 있습니다.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.14.0 | AbortSignal 지원이 추가되었습니다. |
| v12.10.0 | `onread` 옵션이 추가되었습니다. |
| v0.3.4 | 추가됨: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 사용 가능한 옵션은 다음과 같습니다.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 소켓은 읽기 가능한 측면이 끝나면 쓰기 가능한 측면을 자동으로 종료합니다. 자세한 내용은 [`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener) 및 [`'end'`](/ko/nodejs/api/net#event-end) 이벤트를 참조하십시오. **기본값:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 지정된 경우 주어진 파일 디스크립터로 기존 소켓을 래핑합니다. 그렇지 않으면 새 소켓이 생성됩니다.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 지정된 경우 들어오는 데이터는 단일 `buffer`에 저장되고 소켓에 데이터가 도착하면 제공된 `callback`에 전달됩니다. 이렇게 하면 스트리밍 기능이 데이터를 제공하지 않습니다. 소켓은 평소와 같이 `'error'`, `'end'`, `'close'`와 같은 이벤트를 발생시킵니다. `pause()` 및 `resume()`과 같은 메서드도 예상대로 작동합니다.
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 들어오는 데이터를 저장하는 데 사용할 재사용 가능한 메모리 청크 또는 그러한 청크를 반환하는 함수입니다.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이 함수는 들어오는 데이터의 각 청크에 대해 호출됩니다. 두 개의 인수가 전달됩니다. `buffer`에 쓰여진 바이트 수와 `buffer`에 대한 참조입니다. 이 함수에서 `false`를 반환하여 소켓을 암시적으로 `pause()`합니다. 이 함수는 전역 컨텍스트에서 실행됩니다.

    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `fd`가 전달될 때 소켓에서 읽기를 허용합니다. 그렇지 않으면 무시됩니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 소켓을 파괴하는 데 사용할 수 있는 Abort 신호입니다.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `fd`가 전달될 때 소켓에서 쓰기를 허용합니다. 그렇지 않으면 무시됩니다. **기본값:** `false`.

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

새 소켓 객체를 생성합니다.

새로 생성된 소켓은 [`connect()`](/ko/nodejs/api/net#socketconnect)에 연결되는 항목에 따라 TCP 소켓 또는 스트리밍 [IPC](/ko/nodejs/api/net#ipc-support) 엔드포인트가 될 수 있습니다.


### 이벤트: `'close'` {#event-close_1}

**추가된 버전: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 소켓에 전송 오류가 발생한 경우 `true`입니다.

소켓이 완전히 닫히면 한 번 발생합니다. 인수 `hadError`는 소켓이 전송 오류로 인해 닫혔는지 여부를 나타내는 부울입니다.

### 이벤트: `'connect'` {#event-connect}

**추가된 버전: v0.1.90**

소켓 연결이 성공적으로 설정되면 발생합니다. [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection)을 참조하세요.

### 이벤트: `'connectionAttempt'` {#event-connectionattempt}

**추가된 버전: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결을 시도하는 IP입니다.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓이 연결을 시도하는 포트입니다.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP의 패밀리입니다. IPv6의 경우 `6`, IPv4의 경우 `4`일 수 있습니다.

새 연결 시도가 시작될 때 발생합니다. 패밀리 자동 선택 알고리즘이 [`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)에서 활성화된 경우 여러 번 발생할 수 있습니다.

### 이벤트: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**추가된 버전: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결을 시도한 IP입니다.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓이 연결을 시도한 포트입니다.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP의 패밀리입니다. IPv6의 경우 `6`, IPv4의 경우 `4`일 수 있습니다.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 실패와 관련된 오류입니다.

연결 시도가 실패하면 발생합니다. 패밀리 자동 선택 알고리즘이 [`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)에서 활성화된 경우 여러 번 발생할 수 있습니다.


### 이벤트: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**추가된 버전: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결을 시도한 IP입니다.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓이 연결을 시도한 포트입니다.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP의 패밀리입니다. IPv6의 경우 `6`이고 IPv4의 경우 `4`일 수 있습니다.

연결 시도가 시간 초과되었을 때 발생합니다. [`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)에서 패밀리 자동 선택 알고리즘이 활성화된 경우에만 발생합니다 (그리고 여러 번 발생할 수 있습니다).

### 이벤트: `'data'` {#event-data}

**추가된 버전: v0.1.90**

- [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

데이터를 수신할 때 발생합니다. 인수 `data`는 `Buffer` 또는 `String`이 됩니다. 데이터 인코딩은 [`socket.setEncoding()`](/ko/nodejs/api/net#socketsetencodingencoding)에 의해 설정됩니다.

`Socket`이 `'data'` 이벤트를 발생시킬 때 리스너가 없으면 데이터가 손실됩니다.

### 이벤트: `'drain'` {#event-drain}

**추가된 버전: v0.1.90**

쓰기 버퍼가 비워질 때 발생합니다. 업로드를 조절하는 데 사용할 수 있습니다.

참조: `socket.write()`의 반환 값.

### 이벤트: `'end'` {#event-end}

**추가된 버전: v0.1.90**

소켓의 다른 쪽 끝이 전송 종료 신호를 보내 소켓의 읽기 가능한 쪽이 종료될 때 발생합니다.

기본적으로 (`allowHalfOpen`이 `false`) 소켓은 보류 중인 쓰기 큐를 모두 쓰면 전송 종료 패킷을 다시 보내고 파일 설명자를 파괴합니다. 그러나 `allowHalfOpen`이 `true`로 설정된 경우 소켓은 쓰기 가능한 쪽을 자동으로 [`end()`](/ko/nodejs/api/net#socketenddata-encoding-callback)하지 않아 사용자가 임의의 양의 데이터를 쓸 수 있습니다. 사용자는 연결을 닫기 위해 (즉, FIN 패킷을 다시 보내기 위해) 명시적으로 [`end()`](/ko/nodejs/api/net#socketenddata-encoding-callback)를 호출해야 합니다.


### Event: `'error'` {#event-error_1}

**Added in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

오류가 발생했을 때 발생합니다. `'close'` 이벤트는 이 이벤트 직후에 호출됩니다.

### Event: `'lookup'` {#event-lookup}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.10.0 | 이제 `host` 매개변수가 지원됩니다. |
| v0.11.3 | Added in: v0.11.3 |
:::

호스트 이름 확인 후 연결하기 전에 발생합니다. Unix 소켓에는 적용되지 않습니다.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 오류 객체. [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)을 참조하세요.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IP 주소.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 주소 유형. [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)을 참조하세요.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 호스트 이름.

### Event: `'ready'` {#event-ready}

**Added in: v9.11.0**

소켓을 사용할 준비가 되었을 때 발생합니다.

`'connect'` 직후에 트리거됩니다.

### Event: `'timeout'` {#event-timeout}

**Added in: v0.1.90**

소켓이 비활성 상태로 인해 시간 초과되면 발생합니다. 이는 소켓이 유휴 상태임을 알리기 위한 것입니다. 사용자가 연결을 수동으로 닫아야 합니다.

참조: [`socket.setTimeout()`](/ko/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0 | 이제 `family` 속성이 숫자가 아닌 문자열을 반환합니다. |
| v18.0.0 | 이제 `family` 속성이 문자열이 아닌 숫자를 반환합니다. |
| v0.1.90 | Added in: v0.1.90 |
:::

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

운영 체제에서 보고한 대로 소켓의 바인딩된 `address`, 주소 `family` 이름 및 `port`를 반환합니다. `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Added in: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 속성은 [`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)에서 패밀리 자동 선택 알고리즘이 활성화된 경우에만 존재하며 시도된 주소의 배열입니다.

각 주소는 `$IP:$PORT` 형식의 문자열입니다. 연결이 성공하면 마지막 주소가 소켓이 현재 연결된 주소입니다.

### `socket.bufferSize` {#socketbuffersize}

**Added in: v0.3.8**

**Deprecated since: v14.6.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - Deprecated: [`writable.writableLength`](/ko/nodejs/api/stream#writablewritablelength)를 대신 사용하십시오.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 쓰기를 위해 버퍼링된 문자 수를 보여줍니다. 버퍼에는 인코딩 후 길이가 아직 알려지지 않은 문자열이 포함될 수 있습니다. 따라서 이 숫자는 버퍼에 있는 바이트 수의 근사치일 뿐입니다.

`net.Socket`에는 `socket.write()`가 항상 작동하는 속성이 있습니다. 이는 사용자가 빠르게 시작하고 실행할 수 있도록 돕기 위한 것입니다. 컴퓨터가 소켓에 기록되는 데이터의 양을 항상 따라갈 수 있는 것은 아닙니다. 네트워크 연결이 너무 느릴 수도 있습니다. Node.js는 내부적으로 소켓에 기록된 데이터를 큐에 넣고 가능한 경우 전선을 통해 보냅니다.

이러한 내부 버퍼링의 결과는 메모리가 증가할 수 있다는 것입니다. 크거나 증가하는 `bufferSize`를 경험하는 사용자는 [`socket.pause()`](/ko/nodejs/api/net#socketpause) 및 [`socket.resume()`](/ko/nodejs/api/net#socketresume)를 사용하여 프로그램의 데이터 흐름을 "조절"하려고 시도해야 합니다.

### `socket.bytesRead` {#socketbytesread}

**Added in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

수신된 바이트 수입니다.


### `socket.bytesWritten` {#socketbyteswritten}

**추가된 버전: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

보낸 바이트 수입니다.

### `socket.connect()` {#socketconnect}

주어진 소켓에서 연결을 시작합니다.

사용 가능한 시그니처:

- [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)
- [IPC](/ko/nodejs/api/net#ipc-support) 연결의 경우 [`socket.connect(path[, connectListener])`](/ko/nodejs/api/net#socketconnectpath-connectlistener)입니다.
- TCP 연결의 경우 [`socket.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#socketconnectport-host-connectlistener)입니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

이 함수는 비동기입니다. 연결이 설정되면 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트가 발생합니다. 연결에 문제가 있는 경우 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트 대신 [`'error'`](/ko/nodejs/api/net#event-error_1) 이벤트가 발생하고 오류가 [`'error'`](/ko/nodejs/api/net#event-error_1) 리스너로 전달됩니다. 마지막 매개변수 `connectListener`가 제공되면 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 **한 번** 추가됩니다.

이 함수는 `'close'`가 발생한 후 소켓을 다시 연결하는 데만 사용해야 하며, 그렇지 않으면 정의되지 않은 동작이 발생할 수 있습니다.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.4.0 | `setDefaultAutoSelectFamily`를 사용하거나 `--enable-network-family-autoselection` 명령줄 옵션을 통해 런타임에 autoSelectFamily 옵션의 기본값을 변경할 수 있습니다. |
| v20.0.0, v18.18.0 | autoSelectFamily 옵션의 기본값이 이제 true입니다. `--enable-network-family-autoselection` CLI 플래그의 이름이 `--network-family-autoselection`으로 변경되었습니다. 이전 이름은 이제 별칭이지만 사용하지 않는 것이 좋습니다. |
| v19.3.0, v18.13.0 | `autoSelectFamily` 옵션이 추가되었습니다. |
| v17.7.0, v16.15.0 | 이제 `noDelay`, `keepAlive` 및 `keepAliveInitialDelay` 옵션이 지원됩니다. |
| v6.0.0 | `hints` 옵션은 이제 모든 경우에 `0`으로 기본 설정됩니다. 이전에는 `family` 옵션이 없는 경우 `dns.ADDRCONFIG | dns.V4MAPPED`로 기본 설정되었습니다. |
| v5.11.0 | 이제 `hints` 옵션이 지원됩니다. |
| v0.1.90 | 추가된 버전: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ko/nodejs/api/net#socketconnect) 메서드의 공통 매개변수입니다. [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 한 번 추가됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

주어진 소켓에서 연결을 시작합니다. 일반적으로 이 메서드는 필요하지 않으며, 소켓은 [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection)으로 생성 및 열어야 합니다. 사용자 정의 소켓을 구현할 때만 사용하십시오.

TCP 연결의 경우 사용 가능한 `options`는 다음과 같습니다.

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `true`로 설정하면 [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt)의 섹션 5를 느슨하게 구현하는 패밀리 자동 감지 알고리즘이 활성화됩니다. 조회에 전달된 `all` 옵션이 `true`로 설정되고 소켓이 연결에 성공할 때까지 얻은 모든 IPv6 및 IPv4 주소에 순차적으로 연결을 시도합니다. 첫 번째로 반환된 AAAA 주소를 먼저 시도한 다음 첫 번째로 반환된 A 주소, 그런 다음 두 번째로 반환된 AAAA 주소 등을 시도합니다. 각 연결 시도(마지막 시도 제외)에는 `autoSelectFamilyAttemptTimeout` 옵션으로 지정된 시간 제한 전에 다음 주소를 시도하기 전에 해당 시간이 주어집니다. `family` 옵션이 `0`이 아니거나 `localAddress`가 설정된 경우 무시됩니다. 하나 이상의 연결이 성공하면 연결 오류가 발생하지 않습니다. 모든 연결 시도가 실패하면 모든 실패한 시도가 포함된 단일 `AggregateError`가 발생합니다. **기본값:** [`net.getDefaultAutoSelectFamily()`](/ko/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): `autoSelectFamily` 옵션을 사용할 때 다음 주소를 시도하기 전에 연결 시도가 완료될 때까지 기다리는 시간(밀리초)입니다. 양의 정수로 설정된 값이 `10`보다 작으면 대신 `10` 값이 사용됩니다. **기본값:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ko/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): IP 스택 버전입니다. `4`, `6` 또는 `0`이어야 합니다. `0` 값은 IPv4 및 IPv6 주소가 모두 허용됨을 나타냅니다. **기본값:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적 [`dns.lookup()` 힌트](/ko/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결해야 하는 호스트입니다. **기본값:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 연결이 설정된 직후에 소켓에서 keep-alive 기능이 활성화됩니다. [`socket.setKeepAlive()`](/ko/nodejs/api/net#socketsetkeepaliveenable-initialdelay)에서 수행되는 것과 유사합니다. **기본값:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 양수로 설정하면 유휴 소켓에서 첫 번째 keepalive 프로브가 전송되기 전의 초기 지연이 설정됩니다. **기본값:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결해야 하는 로컬 주소입니다.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓이 연결해야 하는 로컬 포트입니다.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 사용자 정의 조회 함수입니다. **기본값:** [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 소켓이 설정된 직후 Nagle 알고리즘 사용이 비활성화됩니다. **기본값:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 필수 항목입니다. 소켓이 연결해야 하는 포트입니다.
- `blockList` [\<net.BlockList\>](/ko/nodejs/api/net#class-netblocklist) `blockList`는 특정 IP 주소, IP 범위 또는 IP 서브넷에 대한 아웃바운드 액세스를 비활성화하는 데 사용할 수 있습니다.

[IPC](/ko/nodejs/api/net#ipc-support) 연결의 경우 사용 가능한 `options`는 다음과 같습니다.

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 필수 항목입니다. 클라이언트가 연결해야 하는 경로입니다. [IPC 연결에 대한 경로 식별](/ko/nodejs/api/net#identifying-paths-for-ipc-connections)을 참조하십시오. 제공된 경우 위의 TCP 관련 옵션은 무시됩니다.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트가 연결해야 하는 경로. [IPC 연결을 위한 경로 식별](/ko/nodejs/api/net#identifying-paths-for-ipc-connections)을 참조하십시오.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ko/nodejs/api/net#socketconnect) 메서드의 공통 매개변수. [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 한 번 추가됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

주어진 소켓에서 [IPC](/ko/nodejs/api/net#ipc-support) 연결을 시작합니다.

`options`로 `{ path: path }`를 사용하여 호출된 [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 별칭입니다.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**추가된 버전: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 클라이언트가 연결해야 하는 포트.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 클라이언트가 연결해야 하는 호스트.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ko/nodejs/api/net#socketconnect) 메서드의 공통 매개변수. [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 한 번 추가됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

주어진 소켓에서 TCP 연결을 시작합니다.

`options`로 `{port: port, host: host}`를 사용하여 호출된 [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 별칭입니다.

### `socket.connecting` {#socketconnecting}

**추가된 버전: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`인 경우, [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)가 호출되었지만 아직 완료되지 않았습니다. 소켓이 연결될 때까지 `true`로 유지된 다음 `false`로 설정되고 `'connect'` 이벤트가 발생합니다. [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener) 콜백은 `'connect'` 이벤트에 대한 리스너입니다.


### `socket.destroy([error])` {#socketdestroyerror}

**추가된 버전: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

이 소켓에서 더 이상의 I/O 활동이 발생하지 않도록 합니다. 스트림을 파괴하고 연결을 닫습니다.

자세한 내용은 [`writable.destroy()`](/ko/nodejs/api/stream#writabledestroyerror)를 참조하세요.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 연결이 파괴되었는지 여부를 나타냅니다. 연결이 파괴되면 더 이상 데이터를 전송할 수 없습니다.

자세한 내용은 [`writable.destroyed`](/ko/nodejs/api/stream#writabledestroyed)를 참조하세요.

### `socket.destroySoon()` {#socketdestroysoon}

**추가된 버전: v0.3.4**

모든 데이터가 기록된 후 소켓을 파괴합니다. `'finish'` 이벤트가 이미 발생한 경우 소켓은 즉시 파괴됩니다. 소켓이 여전히 쓰기 가능한 경우 암묵적으로 `socket.end()`를 호출합니다.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**추가된 버전: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) data가 `string`인 경우에만 사용됩니다. **기본값:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 소켓이 완료될 때 사용할 선택적 콜백입니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

소켓을 절반 닫습니다. 즉, FIN 패킷을 보냅니다. 서버가 여전히 일부 데이터를 보낼 수 있습니다.

자세한 내용은 [`writable.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback)를 참조하세요.

### `socket.localAddress` {#socketlocaladdress}

**추가된 버전: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

원격 클라이언트가 연결하고 있는 로컬 IP 주소의 문자열 표현입니다. 예를 들어 `'0.0.0.0'`에서 수신 대기하는 서버에서 클라이언트가 `'192.168.1.1'`에 연결하는 경우 `socket.localAddress`의 값은 `'192.168.1.1'`이 됩니다.


### `socket.localPort` {#socketlocalport}

**Added in: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

로컬 포트의 숫자 표현입니다. 예를 들어, `80` 또는 `21`입니다.

### `socket.localFamily` {#socketlocalfamily}

**Added in: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

로컬 IP 패밀리의 문자열 표현입니다. `'IPv4'` 또는 `'IPv6'`입니다.

### `socket.pause()` {#socketpause}

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

데이터 읽기를 일시 중지합니다. 즉, [`'data'`](/ko/nodejs/api/net#event-data) 이벤트가 발생하지 않습니다. 업로드를 제한하는 데 유용합니다.

### `socket.pending` {#socketpending}

**Added in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`.connect()`가 아직 호출되지 않았거나 연결 과정에 있기 때문에 소켓이 아직 연결되지 않은 경우 `true`입니다( [`socket.connecting`](/ko/nodejs/api/net#socketconnecting) 참조).

### `socket.ref()` {#socketref}

**Added in: v0.9.1**

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

`unref()`의 반대입니다. 이전에 `unref`된 소켓에서 `ref()`를 호출하면 프로그램이 유일하게 남은 소켓인 경우 종료되지 않습니다(기본 동작). 소켓이 `ref`인 경우 `ref`를 다시 호출해도 아무런 효과가 없습니다.

### `socket.remoteAddress` {#socketremoteaddress}

**Added in: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

원격 IP 주소의 문자열 표현입니다. 예를 들어, `'74.125.127.100'` 또는 `'2001:4860:a005::68'`입니다. 소켓이 파괴된 경우(예: 클라이언트가 연결을 끊은 경우) 값은 `undefined`일 수 있습니다.

### `socket.remoteFamily` {#socketremotefamily}

**Added in: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

원격 IP 패밀리의 문자열 표현입니다. `'IPv4'` 또는 `'IPv6'`입니다. 소켓이 파괴된 경우(예: 클라이언트가 연결을 끊은 경우) 값은 `undefined`일 수 있습니다.


### `socket.remotePort` {#socketremoteport}

**추가된 버전: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

원격 포트의 숫자 표현입니다. 예를 들어 `80` 또는 `21`입니다. 소켓이 파괴된 경우 (예: 클라이언트 연결이 끊어진 경우) 값은 `undefined`일 수 있습니다.

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**추가된 버전: v18.3.0, v16.17.0**

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

RST 패킷을 전송하여 TCP 연결을 닫고 스트림을 파괴합니다. 이 TCP 소켓이 연결 중 상태인 경우 연결되는 즉시 RST 패킷을 전송하고 이 TCP 소켓을 파괴합니다. 그렇지 않으면 `ERR_SOCKET_CLOSED` 오류와 함께 `socket.destroy`를 호출합니다. 이것이 TCP 소켓이 아닌 경우 (예: 파이프), 이 메서드를 호출하면 즉시 `ERR_INVALID_HANDLE_TYPE` 오류가 발생합니다.

### `socket.resume()` {#socketresume}

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

[`socket.pause()`](/ko/nodejs/api/net#socketpause) 호출 후 읽기를 재개합니다.

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**추가된 버전: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

소켓의 인코딩을 [Readable Stream](/ko/nodejs/api/stream#class-streamreadable)으로 설정합니다. 자세한 내용은 [`readable.setEncoding()`](/ko/nodejs/api/stream#readablesetencodingencoding)을 참조하십시오.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | `TCP_KEEPCNT` 및 `TCP_KEEPINTVL` 소켓 옵션에 대한 새로운 기본값이 추가되었습니다. |
| v0.1.92 | 추가된 버전: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체입니다.

Keep-alive 기능을 활성화/비활성화하고, 선택적으로 유휴 소켓에서 첫 번째 keepalive 프로브가 전송되기 전의 초기 지연을 설정합니다.

`initialDelay`(밀리초)를 설정하여 마지막으로 수신된 데이터 패킷과 첫 번째 keepalive 프로브 사이의 지연을 설정합니다. `initialDelay`에 `0`을 설정하면 값이 기본값 (또는 이전 설정)에서 변경되지 않습니다.

Keep-alive 기능을 활성화하면 다음 소켓 옵션이 설정됩니다.

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**추가된 버전: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

Nagle 알고리즘 사용을 활성화/비활성화합니다.

TCP 연결이 생성되면 Nagle 알고리즘이 활성화됩니다.

Nagle 알고리즘은 네트워크를 통해 전송되기 전에 데이터를 지연시킵니다. 이는 지연 시간을 희생하여 처리량을 최적화하려고 시도합니다.

`noDelay`에 대해 `true`를 전달하거나 인수를 전달하지 않으면 소켓에 대해 Nagle 알고리즘이 비활성화됩니다. `noDelay`에 대해 `false`를 전달하면 Nagle 알고리즘이 활성화됩니다.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.1.90 | 추가된 버전: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

소켓에서 `timeout` 밀리초 동안 활동이 없으면 소켓을 타임아웃되도록 설정합니다. 기본적으로 `net.Socket`에는 타임아웃이 없습니다.

유휴 타임아웃이 트리거되면 소켓은 [`'timeout'`](/ko/nodejs/api/net#event-timeout) 이벤트를 받지만 연결이 끊어지지는 않습니다. 사용자는 연결을 종료하기 위해 [`socket.end()`](/ko/nodejs/api/net#socketenddata-encoding-callback) 또는 [`socket.destroy()`](/ko/nodejs/api/net#socketdestroyerror)를 수동으로 호출해야 합니다.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
`timeout`이 0이면 기존 유휴 타임아웃이 비활성화됩니다.

선택적 `callback` 매개변수는 [`'timeout'`](/ko/nodejs/api/net#event-timeout) 이벤트에 대한 일회성 리스너로 추가됩니다.


### `socket.timeout` {#sockettimeout}

**추가된 버전: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

[`socket.setTimeout()`](/ko/nodejs/api/net#socketsettimeouttimeout-callback)으로 설정된 소켓 타임아웃(밀리초)입니다. 타임아웃이 설정되지 않은 경우 `undefined`입니다.

### `socket.unref()` {#socketunref}

**추가된 버전: v0.9.1**

- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 소켓 자체.

소켓에서 `unref()`를 호출하면 이벤트 시스템에서 활성 소켓이 이것뿐인 경우 프로그램이 종료될 수 있습니다. 소켓이 이미 `unref` 상태인 경우 `unref()`를 다시 호출해도 아무런 효과가 없습니다.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**추가된 버전: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) data가 `string`인 경우에만 사용됩니다. **기본값:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

소켓에 데이터를 보냅니다. 두 번째 매개변수는 문자열의 경우 인코딩을 지정합니다. 기본값은 UTF8 인코딩입니다.

전체 데이터가 커널 버퍼로 성공적으로 플러시되면 `true`를 반환합니다. 데이터의 전부 또는 일부가 사용자 메모리에 대기 중인 경우 `false`를 반환합니다. 버퍼가 다시 비워지면 [`'drain'`](/ko/nodejs/api/net#event-drain)이 발생합니다.

선택적 `callback` 매개변수는 데이터가 최종적으로 기록될 때 실행되며, 즉시 실행되지 않을 수 있습니다.

자세한 내용은 `Writable` 스트림 [`write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback) 메서드를 참조하십시오.


### `socket.readyState` {#socketreadystate}

**추가된 버전: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 속성은 연결 상태를 문자열로 나타냅니다.

- 스트림이 연결 중인 경우 `socket.readyState`는 `opening`입니다.
- 스트림이 읽기 및 쓰기가 가능한 경우 `open`입니다.
- 스트림이 읽기 가능하고 쓰기 불가능한 경우 `readOnly`입니다.
- 스트림이 읽기 불가능하고 쓰기 가능한 경우 `writeOnly`입니다.

## `net.connect()` {#netconnect}

[`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection)의 별칭입니다.

가능한 시그니처:

- [`net.connect(options[, connectListener])`](/ko/nodejs/api/net#netconnectoptions-connectlistener)
- [IPC](/ko/nodejs/api/net#ipc-support) 연결의 경우 [`net.connect(path[, connectListener])`](/ko/nodejs/api/net#netconnectpath-connectlistener)
- TCP 연결의 경우 [`net.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#netconnectport-host-connectlistener)

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**추가된 버전: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

[`net.createConnection(options[, connectListener])`](/ko/nodejs/api/net#netcreateconnectionoptions-connectlistener)의 별칭입니다.

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**추가된 버전: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

[`net.createConnection(path[, connectListener])`](/ko/nodejs/api/net#netcreateconnectionpath-connectlistener)의 별칭입니다.

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**추가된 버전: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

[`net.createConnection(port[, host][, connectListener])`](/ko/nodejs/api/net#netcreateconnectionport-host-connectlistener)의 별칭입니다.


## `net.createConnection()` {#netcreateconnection}

새로운 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)을 생성하고 즉시 [`socket.connect()`](/ko/nodejs/api/net#socketconnect)으로 연결을 시작한 다음 연결을 시작하는 `net.Socket`을 반환하는 팩토리 함수입니다.

연결이 설정되면 반환된 소켓에서 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트가 발생합니다. 마지막 매개변수 `connectListener`가 제공되면 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 **한 번** 추가됩니다.

가능한 서명:

- [`net.createConnection(options[, connectListener])`](/ko/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/ko/nodejs/api/net#netcreateconnectionpath-connectlistener) [IPC](/ko/nodejs/api/net#ipc-support) 연결의 경우.
- [`net.createConnection(port[, host][, connectListener])`](/ko/nodejs/api/net#netcreateconnectionport-host-connectlistener) TCP 연결의 경우.

[`net.connect()`](/ko/nodejs/api/net#netconnect) 함수는 이 함수의 별칭입니다.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**추가된 버전: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 필수. [`new net.Socket([options])`](/ko/nodejs/api/net#new-netsocketoptions) 호출과 [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener) 메서드 모두에 전달됩니다.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection) 함수의 공통 매개변수입니다. 제공되면 반환된 소켓에서 [`'connect'`](/ko/nodejs/api/net#event-connect) 이벤트에 대한 리스너로 한 번 추가됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 연결을 시작하는 데 사용되는 새로 생성된 소켓입니다.

사용 가능한 옵션은 [`new net.Socket([options])`](/ko/nodejs/api/net#new-netsocketoptions) 및 [`socket.connect(options[, connectListener])`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)를 참조하십시오.

추가 옵션:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 설정된 경우 소켓이 생성된 후 연결을 시작하기 전에 [`socket.setTimeout(timeout)`](/ko/nodejs/api/net#socketsettimeouttimeout-callback)을 호출하는 데 사용됩니다.

다음은 [`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener) 섹션에 설명된 에코 서버의 클라이언트 예제입니다.

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 리스너.
  console.log('서버에 연결되었습니다!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('서버에서 연결이 끊어졌습니다.');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 리스너.
  console.log('서버에 연결되었습니다!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('서버에서 연결이 끊어졌습니다.');
});
```
:::

소켓 `/tmp/echo.sock`에 연결하려면:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```

다음은 `port` 및 `onread` 옵션을 사용하는 클라이언트의 예입니다. 이 경우 `onread` 옵션은 `new net.Socket([options])`를 호출하는 데만 사용되고 `port` 옵션은 `socket.connect(options[, connectListener])`를 호출하는 데 사용됩니다.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // 소켓에서 읽을 때마다 4KiB 버퍼를 재사용합니다.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 수신된 데이터는 0에서 `nread`까지 `buf`에서 사용할 수 있습니다.
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
    // 소켓에서 읽을 때마다 4KiB 버퍼를 재사용합니다.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 수신된 데이터는 0에서 `nread`까지 `buf`에서 사용할 수 있습니다.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**추가된 버전: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결해야 하는 경로입니다. [`socket.connect(path[, connectListener])`](/ko/nodejs/api/net#socketconnectpath-connectlistener)로 전달됩니다. [IPC 연결을 위한 경로 식별](/ko/nodejs/api/net#identifying-paths-for-ipc-connections)을 참조하십시오.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection) 함수의 공통 매개변수이며, 시작 소켓의 `'connect'` 이벤트에 대한 "once" 리스너입니다. [`socket.connect(path[, connectListener])`](/ko/nodejs/api/net#socketconnectpath-connectlistener)로 전달됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 연결을 시작하는 데 사용되는 새로 생성된 소켓입니다.

[IPC](/ko/nodejs/api/net#ipc-support) 연결을 시작합니다.

이 함수는 모든 옵션이 기본값으로 설정된 새 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)을 만들고, [`socket.connect(path[, connectListener])`](/ko/nodejs/api/net#socketconnectpath-connectlistener)를 사용하여 즉시 연결을 시작한 다음, 연결을 시작하는 `net.Socket`을 반환합니다.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**추가된 버전: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓이 연결해야 하는 포트입니다. [`socket.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#socketconnectport-host-connectlistener)로 전달됩니다.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓이 연결해야 하는 호스트입니다. [`socket.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#socketconnectport-host-connectlistener)로 전달됩니다. **기본값:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnection) 함수의 공통 매개변수이며, 시작 소켓의 `'connect'` 이벤트에 대한 "once" 리스너입니다. [`socket.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#socketconnectport-host-connectlistener)로 전달됩니다.
- 반환: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 연결을 시작하는 데 사용되는 새로 생성된 소켓입니다.

TCP 연결을 시작합니다.

이 함수는 모든 옵션이 기본값으로 설정된 새 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)을 만들고, [`socket.connect(port[, host][, connectListener])`](/ko/nodejs/api/net#socketconnectport-host-connectlistener)를 사용하여 즉시 연결을 시작한 다음, 연결을 시작하는 `net.Socket`을 반환합니다.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | 이제 `highWaterMark` 옵션이 지원됩니다. |
| v17.7.0, v16.15.0 | 이제 `noDelay`, `keepAlive` 및 `keepAliveInitialDelay` 옵션이 지원됩니다. |
| v0.5.0 | v0.5.0에서 추가됨 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 소켓은 읽을 수 있는 쪽이 끝나면 쓰기 가능한 쪽을 자동으로 종료합니다. **기본값:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적으로 모든 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)의 `readableHighWaterMark` 및 `writableHighWaterMark`를 재정의합니다. **기본값:** [`stream.getDefaultHighWaterMark()`](/ko/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode)를 참조하세요.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 새 인바운드 연결이 수신된 직후 소켓에서 keep-alive 기능이 활성화됩니다. 이는 [`socket.setKeepAlive()`](/ko/nodejs/api/net#socketsetkeepaliveenable-initialdelay)에서 수행되는 것과 유사합니다. **기본값:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 양수로 설정하면 유휴 소켓에서 첫 번째 keepalive 프로브가 전송되기 전의 초기 지연 시간을 설정합니다. **기본값:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 새 인바운드 연결이 수신된 직후 Nagle 알고리즘 사용이 비활성화됩니다. **기본값:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 인바운드 연결에서 소켓을 일시 중지해야 하는지 여부를 나타냅니다. **기본값:** `false`.
    - `blockList` [\<net.BlockList\>](/ko/nodejs/api/net#class-netblocklist) `blockList`는 특정 IP 주소, IP 범위 또는 IP 서브넷에 대한 인바운드 액세스를 비활성화하는 데 사용할 수 있습니다. 서버가 리버스 프록시, NAT 등에 있는 경우 차단 목록에 대해 확인되는 주소가 프록시 주소이거나 NAT에서 지정한 주소이므로 작동하지 않습니다.


-  `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connection'`](/ko/nodejs/api/net#event-connection) 이벤트에 대한 리스너로 자동 설정됩니다.
-  반환: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

새 TCP 또는 [IPC](/ko/nodejs/api/net#ipc-support) 서버를 만듭니다.

`allowHalfOpen`이 `true`로 설정된 경우 소켓의 다른 쪽 끝에서 전송 종료를 알리면 서버는 [`socket.end()`](/ko/nodejs/api/net#socketenddata-encoding-callback)가 명시적으로 호출된 경우에만 전송 종료를 다시 보냅니다. 예를 들어 TCP 컨텍스트에서 FIN 패킷이 수신되면 [`socket.end()`](/ko/nodejs/api/net#socketenddata-encoding-callback)가 명시적으로 호출된 경우에만 FIN 패킷이 다시 전송됩니다. 그때까지 연결은 반쯤 닫힌 상태(읽을 수 없지만 여전히 쓸 수 있음)입니다. 자세한 내용은 [`'end'`](/ko/nodejs/api/net#event-end) 이벤트 및 [RFC 1122](https://tools.ietf.org/html/rfc1122) (섹션 4.2.2.13)를 참조하세요.

`pauseOnConnect`가 `true`로 설정되면 각 인바운드 연결과 연결된 소켓이 일시 중지되고 해당 핸들에서 데이터가 읽히지 않습니다. 이를 통해 원래 프로세스에서 데이터를 읽지 않고도 프로세스 간에 연결을 전달할 수 있습니다. 일시 중지된 소켓에서 데이터 읽기를 시작하려면 [`socket.resume()`](/ko/nodejs/api/net#socketresume)을 호출하세요.

서버는 [`listen()`](/ko/nodejs/api/net#serverlisten)하는 항목에 따라 TCP 서버 또는 [IPC](/ko/nodejs/api/net#ipc-support) 서버가 될 수 있습니다.

다음은 포트 8124에서 연결을 수신하는 TCP 에코 서버의 예입니다.

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' 리스너.
  console.log('클라이언트가 연결되었습니다.');
  c.on('end', () => {
    console.log('클라이언트 연결이 끊어졌습니다.');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('서버가 바인딩되었습니다.');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' 리스너.
  console.log('클라이언트가 연결되었습니다.');
  c.on('end', () => {
    console.log('클라이언트 연결이 끊어졌습니다.');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('서버가 바인딩되었습니다.');
});
```
:::

`telnet`을 사용하여 테스트합니다.

```bash [BASH]
telnet localhost 8124
```
소켓 `/tmp/echo.sock`에서 수신하려면:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('서버가 바인딩되었습니다.');
});
```
`nc`를 사용하여 Unix 도메인 소켓 서버에 연결합니다.

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**추가된 버전: v19.4.0**

[`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `autoSelectFamily` 옵션의 현재 기본값을 가져옵니다. 명령줄 옵션 `--no-network-family-autoselection`이 제공되지 않는 한 초기 기본값은 `true`입니다.

- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `autoSelectFamily` 옵션의 현재 기본값입니다.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**추가된 버전: v19.4.0**

[`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `autoSelectFamily` 옵션의 기본값을 설정합니다.

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 새로운 기본값입니다. 명령줄 옵션 `--no-network-family-autoselection`이 제공되지 않는 한 초기 기본값은 `true`입니다.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**추가된 버전: v19.8.0, v18.18.0**

[`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `autoSelectFamilyAttemptTimeout` 옵션의 현재 기본값을 가져옵니다. 초기 기본값은 `250`이거나 명령줄 옵션 `--network-family-autoselection-attempt-timeout`을 통해 지정된 값입니다.

- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `autoSelectFamilyAttemptTimeout` 옵션의 현재 기본값입니다.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**추가된 버전: v19.8.0, v18.18.0**

[`socket.connect(options)`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `autoSelectFamilyAttemptTimeout` 옵션의 기본값을 설정합니다.

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새로운 기본값으로, 양수여야 합니다. 숫자가 `10`보다 작으면 대신 `10` 값이 사용됩니다. 초기 기본값은 `250`이거나 명령줄 옵션 `--network-family-autoselection-attempt-timeout`을 통해 지정된 값입니다.


## `net.isIP(input)` {#netisipinput}

**추가된 버전: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`input`이 IPv6 주소이면 `6`을 반환합니다. `input`이 선행 0이 없는 [점십진 표기법](https://en.wikipedia.org/wiki/Dot-decimal_notation)의 IPv4 주소이면 `4`를 반환합니다. 그렇지 않으면 `0`을 반환합니다.

```js [ESM]
net.isIP('::1'); // 6 반환
net.isIP('127.0.0.1'); // 4 반환
net.isIP('127.000.000.001'); // 0 반환
net.isIP('127.0.0.1/24'); // 0 반환
net.isIP('fhqwhgads'); // 0 반환
```
## `net.isIPv4(input)` {#netisipv4input}

**추가된 버전: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input`이 선행 0이 없는 [점십진 표기법](https://en.wikipedia.org/wiki/Dot-decimal_notation)의 IPv4 주소이면 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

```js [ESM]
net.isIPv4('127.0.0.1'); // true 반환
net.isIPv4('127.000.000.001'); // false 반환
net.isIPv4('127.0.0.1/24'); // false 반환
net.isIPv4('fhqwhgads'); // false 반환
```
## `net.isIPv6(input)` {#netisipv6input}

**추가된 버전: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input`이 IPv6 주소이면 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

```js [ESM]
net.isIPv6('::1'); // true 반환
net.isIPv6('fhqwhgads'); // false 반환
```
