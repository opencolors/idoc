---
title: Node.js 문서 - dgram
description: dgram 모듈은 UDP 데이터그램 소켓의 구현을 제공하여 데이터그램 패킷을 송수신할 수 있는 클라이언트 및 서버 애플리케이션을 생성할 수 있게 합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: dgram 모듈은 UDP 데이터그램 소켓의 구현을 제공하여 데이터그램 패킷을 송수신할 수 있는 클라이언트 및 서버 애플리케이션을 생성할 수 있게 합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: dgram 모듈은 UDP 데이터그램 소켓의 구현을 제공하여 데이터그램 패킷을 송수신할 수 있는 클라이언트 및 서버 애플리케이션을 생성할 수 있게 합니다.
---


# UDP/데이터그램 소켓 {#udp/datagram-sockets}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

`node:dgram` 모듈은 UDP 데이터그램 소켓의 구현을 제공합니다.

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

## 클래스: `dgram.Socket` {#class-dgramsocket}

**추가된 버전: v0.1.99**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

데이터그램 기능을 캡슐화합니다.

`dgram.Socket`의 새로운 인스턴스는 [`dgram.createSocket()`](/ko/nodejs/api/dgram#dgramcreatesocketoptions-callback)을 사용하여 생성됩니다. `new` 키워드는 `dgram.Socket` 인스턴스를 생성하는 데 사용해서는 안 됩니다.

### 이벤트: `'close'` {#event-close}

**추가된 버전: v0.1.99**

`'close'` 이벤트는 소켓이 [`close()`](/ko/nodejs/api/dgram#socketclosecallback)로 닫힌 후에 발생합니다. 트리거되면 이 소켓에서 새로운 `'message'` 이벤트가 발생하지 않습니다.

### 이벤트: `'connect'` {#event-connect}

**추가된 버전: v12.0.0**

`'connect'` 이벤트는 성공적인 [`connect()`](/ko/nodejs/api/dgram#socketconnectport-address-callback) 호출의 결과로 소켓이 원격 주소와 연결된 후에 발생합니다.


### Event: `'error'` {#event-error}

**Added in: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` 이벤트는 오류가 발생할 때마다 발생합니다. 이벤트 핸들러 함수에는 단일 `Error` 객체가 전달됩니다.

### Event: `'listening'` {#event-listening}

**Added in: v0.1.99**

`'listening'` 이벤트는 `dgram.Socket`이 주소 지정 가능하고 데이터를 수신할 수 있게 되면 한 번 발생합니다. 이는 `socket.bind()`를 사용하여 명시적으로 발생하거나 `socket.send()`를 사용하여 처음으로 데이터를 보낼 때 암시적으로 발생합니다. `dgram.Socket`이 수신 대기 중일 때까지 기본 시스템 리소스가 존재하지 않으며 `socket.address()` 및 `socket.setTTL()`과 같은 호출이 실패합니다.

### Event: `'message'` {#event-message}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0 | `family` 속성이 이제 숫자가 아닌 문자열을 반환합니다. |
| v18.0.0 | `family` 속성이 이제 문자열이 아닌 숫자를 반환합니다. |
| v0.1.99 | 추가됨: v0.1.99 |
:::

`'message'` 이벤트는 소켓에서 새 데이터그램을 사용할 수 있을 때 발생합니다. 이벤트 핸들러 함수에는 두 개의 인수인 `msg`와 `rinfo`가 전달됩니다.

- `msg` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 메시지입니다.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 원격 주소 정보입니다.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 발신자 주소입니다.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 주소 패밀리(`'IPv4'` 또는 `'IPv6'`)입니다.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 발신자 포트입니다.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메시지 크기입니다.
  
 

수신 패킷의 소스 주소가 IPv6 링크-로컬 주소인 경우 인터페이스 이름이 `address`에 추가됩니다. 예를 들어 `en0` 인터페이스에서 수신된 패킷의 주소 필드는 `'fe80::2618:1234:ab11:3b9c%en0'`으로 설정될 수 있으며, 여기서 `'%en0'`은 영역 ID 접미사로서의 인터페이스 이름입니다.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**추가된 버전: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

커널에게 주어진 `multicastAddress`와 `multicastInterface`에서 `IP_ADD_MEMBERSHIP` 소켓 옵션을 사용하여 멀티캐스트 그룹에 가입하도록 지시합니다. `multicastInterface` 인수가 지정되지 않은 경우 운영 체제가 하나의 인터페이스를 선택하고 해당 인터페이스에 멤버십을 추가합니다. 사용 가능한 모든 인터페이스에 멤버십을 추가하려면 인터페이스마다 한 번씩 `addMembership`를 여러 번 호출하세요.

바인딩되지 않은 소켓에서 호출되면 이 메서드는 암시적으로 임의의 포트에 바인딩되어 모든 인터페이스에서 수신 대기합니다.

여러 `cluster` 작업자 간에 UDP 소켓을 공유할 때 `socket.addMembership()` 함수는 한 번만 호출해야 합니다. 그렇지 않으면 `EADDRINUSE` 오류가 발생합니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // 정상 작동.
  cluster.fork(); // EADDRINUSE 오류 발생.
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
  cluster.fork(); // 정상 작동.
  cluster.fork(); // EADDRINUSE 오류 발생.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**추가된 버전: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

커널에게 주어진 `sourceAddress`와 `groupAddress`에서 `IP_ADD_SOURCE_MEMBERSHIP` 소켓 옵션을 사용하여 `multicastInterface`를 통해 소스 특정 멀티캐스트 채널에 가입하도록 지시합니다. `multicastInterface` 인수가 지정되지 않은 경우 운영 체제가 하나의 인터페이스를 선택하고 해당 인터페이스에 멤버십을 추가합니다. 사용 가능한 모든 인터페이스에 멤버십을 추가하려면 인터페이스마다 한 번씩 `socket.addSourceSpecificMembership()`을 여러 번 호출하세요.

바인딩되지 않은 소켓에서 호출되면 이 메서드는 암시적으로 임의의 포트에 바인딩되어 모든 인터페이스에서 수신 대기합니다.


### `socket.address()` {#socketaddress}

**Added in: v0.1.99**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

소켓의 주소 정보를 담고 있는 객체를 반환합니다. UDP 소켓의 경우, 이 객체는 `address`, `family`, 그리고 `port` 속성을 포함합니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF` 오류를 발생시킵니다.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v0.9.1 | 이 메서드는 비동기 실행 모델로 변경되었습니다. 기존 코드는 메서드 호출에 콜백 함수를 전달하도록 변경해야 합니다. |
| v0.1.99 | Added in: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` 매개변수 없이 [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)입니다. 바인딩이 완료되면 호출됩니다.

UDP 소켓의 경우, `dgram.Socket`이 명명된 `port`와 선택적 `address`에서 데이터그램 메시지를 수신하도록 합니다. `port`가 지정되지 않았거나 `0`인 경우, 운영 체제는 임의의 포트에 바인딩을 시도합니다. `address`가 지정되지 않은 경우, 운영 체제는 모든 주소에서 수신을 시도합니다. 바인딩이 완료되면 `'listening'` 이벤트가 발생하고 선택적 `callback` 함수가 호출됩니다.

`'listening'` 이벤트 리스너를 지정하고 `socket.bind()` 메서드에 `callback`을 전달하는 것은 해롭지는 않지만 그다지 유용하지 않습니다.

바인딩된 데이터그램 소켓은 데이터그램 메시지를 수신하기 위해 Node.js 프로세스를 계속 실행합니다.

바인딩에 실패하면 `'error'` 이벤트가 생성됩니다. 드문 경우 (예: 닫힌 소켓으로 바인딩을 시도하는 경우) [`Error`](/ko/nodejs/api/errors#class-error)가 발생할 수 있습니다.

포트 41234에서 수신하는 UDP 서버의 예:

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

**Added in: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 필수 항목. 다음 속성을 지원합니다.
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

UDP 소켓의 경우, `dgram.Socket`이 첫 번째 인수로 전달된 `options` 객체의 속성으로 전달되는 명명된 `port`와 선택적 `address`에서 데이터그램 메시지를 수신하도록 합니다. `port`가 지정되지 않거나 `0`이면 운영 체제는 임의의 포트에 바인딩하려고 시도합니다. `address`가 지정되지 않은 경우 운영 체제는 모든 주소에서 수신하려고 시도합니다. 바인딩이 완료되면 `'listening'` 이벤트가 발생하고 선택적 `callback` 함수가 호출됩니다.

`options` 객체는 `fd` 속성을 포함할 수 있습니다. `0`보다 큰 `fd`가 설정되면 지정된 파일 설명자로 기존 소켓을 래핑합니다. 이 경우 `port` 및 `address` 속성은 무시됩니다.

`'listening'` 이벤트 리스너를 지정하고 `socket.bind()` 메서드에 `callback`을 전달하는 것은 해롭지는 않지만 그다지 유용하지 않습니다.

`options` 객체는 [`cluster`](/ko/nodejs/api/cluster) 모듈과 함께 `dgram.Socket` 객체를 사용할 때 사용되는 추가 `exclusive` 속성을 포함할 수 있습니다. `exclusive`가 `false`(기본값)로 설정되면 클러스터 작업자는 동일한 기본 소켓 핸들을 사용하여 연결 처리 의무를 공유할 수 있습니다. 그러나 `exclusive`가 `true`이면 핸들이 공유되지 않고 포트 공유 시도 결과 오류가 발생합니다. `reusePort` 옵션이 `true`로 설정된 상태로 `dgram.Socket`을 만들면 `socket.bind()`가 호출될 때 `exclusive`가 항상 `true`가 됩니다.

바인딩된 데이터그램 소켓은 Node.js 프로세스를 실행하여 데이터그램 메시지를 수신합니다.

바인딩에 실패하면 `'error'` 이벤트가 생성됩니다. 드문 경우 (예: 닫힌 소켓으로 바인딩을 시도하는 경우) [`Error`](/ko/nodejs/api/errors#class-error)가 발생할 수 있습니다.

독점 포트에서 수신하는 소켓의 예는 아래와 같습니다.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**추가된 버전: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 소켓이 닫힐 때 호출됩니다.

기본 소켓을 닫고 데이터 수신을 중단합니다. 콜백이 제공되면 [`'close'`](/ko/nodejs/api/dgram#event-close) 이벤트에 대한 리스너로 추가됩니다.

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**추가된 버전: v20.5.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`socket.close()`](/ko/nodejs/api/dgram#socketclosecallback)를 호출하고 소켓이 닫히면 이행되는 프로미스를 반환합니다.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**추가된 버전: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 연결이 완료되거나 오류가 발생했을 때 호출됩니다.

`dgram.Socket`을 원격 주소 및 포트에 연결합니다. 이 핸들에서 보내는 모든 메시지는 자동으로 해당 대상으로 전송됩니다. 또한 소켓은 해당 원격 피어로부터만 메시지를 수신합니다. 이미 연결된 소켓에서 `connect()`를 호출하려고 하면 [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/ko/nodejs/api/errors#err_socket_dgram_is_connected) 예외가 발생합니다. `address`가 제공되지 않으면 `'127.0.0.1'`(`udp4` 소켓의 경우) 또는 `'::1'`(`udp6` 소켓의 경우)이 기본적으로 사용됩니다. 연결이 완료되면 `'connect'` 이벤트가 발생하고 선택적 `callback` 함수가 호출됩니다. 실패한 경우 `callback`이 호출되거나, 그렇지 않으면 `'error'` 이벤트가 발생합니다.

### `socket.disconnect()` {#socketdisconnect}

**추가된 버전: v12.0.0**

연결된 `dgram.Socket`을 해당 원격 주소에서 분리하는 동기 함수입니다. 바인딩되지 않았거나 이미 연결이 끊어진 소켓에서 `disconnect()`를 호출하려고 하면 [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ko/nodejs/api/errors#err_socket_dgram_not_connected) 예외가 발생합니다.


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Added in: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

커널에 `IP_DROP_MEMBERSHIP` 소켓 옵션을 사용하여 `multicastAddress`에서 멀티캐스트 그룹을 나가도록 지시합니다. 이 메서드는 소켓이 닫히거나 프로세스가 종료될 때 커널에 의해 자동으로 호출되므로 대부분의 앱은 이 메서드를 호출할 이유가 없습니다.

`multicastInterface`가 지정되지 않은 경우 운영 체제는 모든 유효한 인터페이스에서 멤버십을 삭제하려고 시도합니다.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Added in: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

커널에 `IP_DROP_SOURCE_MEMBERSHIP` 소켓 옵션을 사용하여 지정된 `sourceAddress` 및 `groupAddress`에서 소스 특정 멀티캐스트 채널을 나가도록 지시합니다. 이 메서드는 소켓이 닫히거나 프로세스가 종료될 때 커널에 의해 자동으로 호출되므로 대부분의 앱은 이 메서드를 호출할 이유가 없습니다.

`multicastInterface`가 지정되지 않은 경우 운영 체제는 모든 유효한 인터페이스에서 멤버십을 삭제하려고 시도합니다.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Added in: v8.7.0**

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 바이트 단위의 `SO_RCVBUF` 소켓 수신 버퍼 크기입니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 [`ERR_SOCKET_BUFFER_SIZE`](/ko/nodejs/api/errors#err_socket_buffer_size)를 던집니다.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Added in: v8.7.0**

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 바이트 단위의 `SO_SNDBUF` 소켓 전송 버퍼 크기입니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 [`ERR_SOCKET_BUFFER_SIZE`](/ko/nodejs/api/errors#err_socket_buffer_size)를 던집니다.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**추가된 버전: v18.8.0, v16.19.0**

- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 전송을 위해 대기 중인 바이트 수입니다.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**추가된 버전: v18.8.0, v16.19.0**

- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 현재 처리 대기 중인 대기열에 있는 전송 요청 수입니다.

### `socket.ref()` {#socketref}

**추가된 버전: v0.9.1**

- 반환값: [\<dgram.Socket\>](/ko/nodejs/api/dgram#class-dgramsocket)

기본적으로 소켓을 바인딩하면 소켓이 열려 있는 동안 Node.js 프로세스가 종료되는 것을 막습니다. `socket.unref()` 메서드를 사용하면 Node.js 프로세스를 활성 상태로 유지하는 참조 횟수에서 소켓을 제외할 수 있습니다. `socket.ref()` 메서드는 소켓을 참조 횟수에 다시 추가하고 기본 동작을 복원합니다.

`socket.ref()`를 여러 번 호출해도 추가적인 효과는 없습니다.

`socket.ref()` 메서드는 소켓에 대한 참조를 반환하므로 호출을 연결할 수 있습니다.

### `socket.remoteAddress()` {#socketremoteaddress}

**추가된 버전: v12.0.0**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

원격 엔드포인트의 `address`, `family` 및 `port`를 포함하는 객체를 반환합니다. 소켓이 연결되지 않은 경우 이 메서드는 [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ko/nodejs/api/errors#err_socket_dgram_not_connected) 예외를 발생시킵니다.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0 | 이제 `address` 매개변수는 `string`, `null` 또는 `undefined`만 허용합니다. |
| v14.5.0, v12.19.0 | 이제 `msg` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v12.0.0 | 연결된 소켓에서 데이터 전송에 대한 지원이 추가되었습니다. |
| v8.0.0 | 이제 `msg` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v8.0.0 | 이제 `address` 매개변수는 항상 선택 사항입니다. |
| v6.0.0 | 성공 시 `callback`은 이제 `0` 대신 `null`의 `error` 인수로 호출됩니다. |
| v5.7.0 | 이제 `msg` 매개변수는 배열이 될 수 있습니다. 또한 `offset` 및 `length` 매개변수는 이제 선택 사항입니다. |
| v0.1.99 | 추가된 버전: v0.1.99 |
:::

- `msg` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 보낼 메시지입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메시지가 시작되는 버퍼의 오프셋입니다.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메시지의 바이트 수입니다.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 대상 포트입니다.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 대상 호스트 이름 또는 IP 주소입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 메시지가 전송되었을 때 호출됩니다.

소켓에서 데이터그램을 브로드캐스트합니다. 연결 없는 소켓의 경우 대상 `port` 및 `address`를 지정해야 합니다. 반면에 연결된 소켓은 연결된 원격 엔드포인트를 사용하므로 `port` 및 `address` 인수를 설정해서는 안 됩니다.

`msg` 인수는 보낼 메시지를 포함합니다. 해당 유형에 따라 다른 동작이 적용될 수 있습니다. `msg`가 `Buffer`, `TypedArray` 또는 `DataView`인 경우 `offset` 및 `length`는 메시지가 시작되는 `Buffer` 내의 오프셋과 메시지의 바이트 수를 각각 지정합니다. `msg`가 `String`인 경우 `'utf8'` 인코딩으로 자동으로 `Buffer`로 변환됩니다. 멀티바이트 문자를 포함하는 메시지를 사용하면 `offset` 및 `length`는 문자 위치가 아닌 [바이트 길이](/ko/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)를 기준으로 계산됩니다. `msg`가 배열인 경우 `offset` 및 `length`를 지정하면 안 됩니다.

`address` 인수는 문자열입니다. `address` 값이 호스트 이름인 경우 DNS를 사용하여 호스트 주소를 확인합니다. `address`가 제공되지 않거나 nullish인 경우 기본적으로 `'127.0.0.1'`(`udp4` 소켓의 경우) 또는 `'::1'`(`udp6` 소켓의 경우)이 사용됩니다.

소켓이 이전에 `bind` 호출로 바인딩되지 않은 경우 소켓에 임의의 포트 번호가 할당되고 "모든 인터페이스" 주소(`udp4` 소켓의 경우 `'0.0.0.0'`, `udp6` 소켓의 경우 `'::0'`)에 바인딩됩니다.

선택적 `callback` 함수는 DNS 오류를 보고하거나 `buf` 객체를 다시 사용하기에 안전한 시기를 결정하는 방법으로 지정할 수 있습니다. DNS 조회는 Node.js 이벤트 루프의 최소 한 틱 동안 전송 시간을 지연시킵니다.

데이터그램이 전송되었는지 확실히 알 수 있는 유일한 방법은 `callback`을 사용하는 것입니다. 오류가 발생하고 `callback`이 제공되면 오류가 `callback`에 대한 첫 번째 인수로 전달됩니다. `callback`이 제공되지 않으면 오류가 `socket` 객체에서 `'error'` 이벤트로 발생합니다.

오프셋과 길이는 선택 사항이지만 둘 중 하나를 사용하는 경우 둘 다 *반드시* 설정해야 합니다. 첫 번째 인수가 `Buffer`, `TypedArray` 또는 `DataView`인 경우에만 지원됩니다.

이 메서드는 바인딩되지 않은 소켓에서 호출된 경우 [`ERR_SOCKET_BAD_PORT`](/ko/nodejs/api/errors#err_socket_bad_port)를 발생시킵니다.

`localhost`의 포트로 UDP 패킷을 보내는 예제;



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

여러 버퍼로 구성된 UDP 패킷을 `127.0.0.1`의 포트로 보내는 예제;



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
const { Buffer } = require('node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

여러 버퍼를 보내는 것은 애플리케이션 및 운영 체제에 따라 더 빠르거나 느릴 수 있습니다. 벤치마크를 실행하여 사례별로 최적의 전략을 결정하십시오. 그러나 일반적으로 여러 버퍼를 보내는 것이 더 빠릅니다.

`localhost`의 포트에 연결된 소켓을 사용하여 UDP 패킷을 보내는 예제:



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


#### UDP 데이터그램 크기에 대한 참고 사항 {#note-about-udp-datagram-size}

IPv4/v6 데이터그램의 최대 크기는 `MTU`(최대 전송 단위)와 `Payload Length` 필드 크기에 따라 결정됩니다.

- `Payload Length` 필드는 16비트 너비이므로 일반적인 페이로드는 인터넷 헤더 및 데이터를 포함하여 64K 옥텟(65,507바이트 = 65,535 − 8바이트 UDP 헤더 − 20바이트 IP 헤더)을 초과할 수 없습니다. 이는 일반적으로 루프백 인터페이스에 해당하지만, 이러한 긴 데이터그램 메시지는 대부분의 호스트 및 네트워크에 실용적이지 않습니다.
- `MTU`는 주어진 링크 레이어 기술이 데이터그램 메시지에 대해 지원할 수 있는 가장 큰 크기입니다. 모든 링크에 대해 IPv4는 최소 `MTU`를 68 옥텟으로 의무화하고 IPv4의 권장 `MTU`는 576입니다(일반적으로 다이얼업 유형 애플리케이션의 `MTU`로 권장됨). 전체적으로 도착하든 조각으로 도착하든 상관없습니다. IPv6의 경우 최소 `MTU`는 1280 옥텟입니다. 그러나 필수 최소 조각 재조립 버퍼 크기는 1500 옥텟입니다. 68 옥텟 값은 매우 작습니다. 이더넷과 같은 대부분의 현재 링크 레이어 기술은 최소 `MTU`가 1500이기 때문입니다.

패킷이 통과할 수 있는 각 링크의 MTU를 미리 알 수 없습니다. 수신자 `MTU`보다 큰 데이터그램을 보내면 데이터가 의도한 수신자에게 도달하지 못했다는 것을 소스에 알리지 않고 패킷이 자동으로 삭제되므로 작동하지 않습니다.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**추가된 버전: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`SO_BROADCAST` 소켓 옵션을 설정하거나 해제합니다. `true`로 설정하면 UDP 패킷을 로컬 인터페이스의 브로드캐스트 주소로 보낼 수 있습니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF`를 발생시킵니다.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**추가된 버전: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*이 섹션의 모든 범위 참조는 <a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">IPv6 영역 인덱스</a>를 참조하며, 이는 <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>에 의해 정의됩니다. 문자열 형식에서 범위 인덱스가 있는 IP는 scope가 인터페이스 이름 또는 인터페이스 번호인 <code>'IP%scope'</code>로 작성됩니다.*

소켓의 기본 나가는 멀티캐스트 인터페이스를 선택한 인터페이스로 설정하거나 시스템 인터페이스 선택으로 되돌립니다. `multicastInterface`는 소켓 패밀리의 유효한 IP 문자열 표현이어야 합니다.

IPv4 소켓의 경우 원하는 물리적 인터페이스에 대해 구성된 IP여야 합니다. 소켓에서 멀티캐스트로 전송된 모든 패킷은 이 호출의 가장 최근 성공적인 사용에 의해 결정된 인터페이스에서 전송됩니다.

IPv6 소켓의 경우 `multicastInterface`는 아래 예와 같이 인터페이스를 나타내는 범위를 포함해야 합니다. IPv6에서 개별 `send` 호출은 주소에서 명시적 범위를 사용할 수도 있으므로 명시적 범위를 지정하지 않고 멀티캐스트 주소로 전송된 패킷만 이 호출의 가장 최근 성공적인 사용의 영향을 받습니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF`를 발생시킵니다.


#### 예제: IPv6 아웃바운드 멀티캐스트 인터페이스 {#example-ipv6-outgoing-multicast-interface}

대부분의 시스템에서 범위 형식은 인터페이스 이름을 사용합니다.

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
Windows에서는 범위 형식이 인터페이스 번호를 사용합니다.

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### 예제: IPv4 아웃바운드 멀티캐스트 인터페이스 {#example-ipv4-outgoing-multicast-interface}

모든 시스템은 원하는 물리적 인터페이스에서 호스트의 IP를 사용합니다.

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### 호출 결과 {#call-results}

전송 준비가 되지 않았거나 더 이상 열려 있지 않은 소켓에 대한 호출은 *실행 중 아님* [`오류`](/ko/nodejs/api/errors#class-error)를 발생시킬 수 있습니다.

`multicastInterface`를 IP로 구문 분석할 수 없는 경우 *EINVAL* [`시스템 오류`](/ko/nodejs/api/errors#class-systemerror)가 발생합니다.

IPv4에서 `multicastInterface`가 유효한 주소이지만 인터페이스와 일치하지 않거나 주소가 패밀리와 일치하지 않으면 `EADDRNOTAVAIL` 또는 `EPROTONOSUP`과 같은 [`시스템 오류`](/ko/nodejs/api/errors#class-systemerror)가 발생합니다.

IPv6에서 범위를 지정하거나 생략하는 대부분의 오류는 소켓이 시스템의 기본 인터페이스 선택을 계속 사용하거나 되돌아가게 합니다.

소켓의 주소 패밀리의 ANY 주소(IPv4 `'0.0.0.0'` 또는 IPv6 `'::'`)를 사용하여 소켓의 기본 아웃바운드 인터페이스 제어를 향후 멀티캐스트 패킷을 위해 시스템에 반환할 수 있습니다.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**추가된 버전: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`IP_MULTICAST_LOOP` 소켓 옵션을 설정하거나 지웁니다. `true`로 설정하면 멀티캐스트 패킷도 로컬 인터페이스에서 수신됩니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF`를 발생시킵니다.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**추가된 버전: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`IP_MULTICAST_TTL` 소켓 옵션을 설정합니다. TTL은 일반적으로 "Time to Live"를 나타내지만 이 컨텍스트에서는 패킷이 특히 멀티캐스트 트래픽에 대해 통과할 수 있는 IP 홉 수를 지정합니다. 패킷을 전달하는 각 라우터 또는 게이트웨이는 TTL을 감소시킵니다. 라우터에서 TTL이 0으로 감소되면 전달되지 않습니다.

`ttl` 인수는 0에서 255 사이일 수 있습니다. 대부분의 시스템에서 기본값은 `1`입니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF`를 발생시킵니다.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`SO_RCVBUF` 소켓 옵션을 설정합니다. 최대 소켓 수신 버퍼를 바이트 단위로 설정합니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 [`ERR_SOCKET_BUFFER_SIZE`](/ko/nodejs/api/errors#err_socket_buffer_size)를 던집니다.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`SO_SNDBUF` 소켓 옵션을 설정합니다. 최대 소켓 송신 버퍼를 바이트 단위로 설정합니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 [`ERR_SOCKET_BUFFER_SIZE`](/ko/nodejs/api/errors#err_socket_buffer_size)를 던집니다.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Added in: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`IP_TTL` 소켓 옵션을 설정합니다. TTL은 일반적으로 "Time to Live"를 의미하지만, 이 컨텍스트에서는 패킷이 통과할 수 있는 IP 홉 수를 지정합니다. 패킷을 전달하는 각 라우터 또는 게이트웨이는 TTL을 감소시킵니다. 라우터에 의해 TTL이 0으로 감소되면 전달되지 않습니다. TTL 값 변경은 일반적으로 네트워크 프로브 또는 멀티캐스팅 시 수행됩니다.

`ttl` 인수는 1에서 255 사이일 수 있습니다. 대부분의 시스템에서 기본값은 64입니다.

이 메서드는 바인딩되지 않은 소켓에서 호출되면 `EBADF`를 던집니다.

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- Returns: [\<dgram.Socket\>](/ko/nodejs/api/dgram#class-dgramsocket)

기본적으로 소켓을 바인딩하면 소켓이 열려 있는 동안 Node.js 프로세스의 종료를 막습니다. `socket.unref()` 메서드를 사용하여 소켓이 Node.js 프로세스를 활성 상태로 유지하는 참조 카운팅에서 제외되도록 할 수 있으므로 소켓이 여전히 수신 중이더라도 프로세스를 종료할 수 있습니다.

`socket.unref()`를 여러 번 호출해도 추가적인 효과는 없습니다.

`socket.unref()` 메서드는 소켓에 대한 참조를 반환하므로 호출을 체인으로 연결할 수 있습니다.


## `node:dgram` 모듈 함수 {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.1.0 | `reusePort` 옵션이 지원됩니다. |
| v15.8.0 | AbortSignal 지원이 추가되었습니다. |
| v11.4.0 | `ipv6Only` 옵션이 지원됩니다. |
| v8.7.0 | `recvBufferSize` 및 `sendBufferSize` 옵션이 이제 지원됩니다. |
| v8.6.0 | `lookup` 옵션이 지원됩니다. |
| v0.11.13 | v0.11.13에 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 사용 가능한 옵션은 다음과 같습니다.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소켓의 패밀리. `'udp4'` 또는 `'udp6'` 중 하나여야 합니다. 필수.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)는 다른 프로세스가 이미 소켓을 바인딩했더라도 주소를 재사용하지만 하나의 소켓만 데이터를 수신할 수 있습니다. **기본값:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)는 다른 프로세스가 이미 소켓을 바인딩했더라도 포트를 재사용합니다. 들어오는 데이터그램은 수신 대기 소켓에 배포됩니다. 이 옵션은 Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 및 AIX 7.2.5+와 같은 일부 플랫폼에서만 사용할 수 있습니다. 지원되지 않는 플랫폼에서는 소켓이 바인딩될 때 이 옵션으로 인해 오류가 발생합니다. **기본값:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `ipv6Only`를 `true`로 설정하면 이중 스택 지원이 비활성화됩니다. 즉, 주소 `::`에 바인딩해도 `0.0.0.0`이 바인딩되지 않습니다. **기본값:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_RCVBUF` 소켓 값을 설정합니다.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_SNDBUF` 소켓 값을 설정합니다.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 사용자 정의 lookup 함수. **기본값:** [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 소켓을 닫는 데 사용할 수 있는 AbortSignal입니다.
    - `receiveBlockList` [\<net.BlockList\>](/ko/nodejs/api/net#class-netblocklist) `receiveBlockList`는 특정 IP 주소, IP 범위 또는 IP 서브넷으로의 인바운드 데이터그램을 삭제하는 데 사용할 수 있습니다. 서버가 리버스 프록시, NAT 등 뒤에 있는 경우 블록 목록에 대해 확인된 주소가 프록시 주소이거나 NAT에서 지정한 주소이므로 작동하지 않습니다.
    - `sendBlockList` [\<net.BlockList\>](/ko/nodejs/api/net#class-netblocklist) `sendBlockList`는 특정 IP 주소, IP 범위 또는 IP 서브넷에 대한 아웃바운드 액세스를 비활성화하는 데 사용할 수 있습니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'message'` 이벤트에 대한 리스너로 첨부됩니다. 선택 사항.
- 반환: [\<dgram.Socket\>](/ko/nodejs/api/dgram#class-dgramsocket)

`dgram.Socket` 객체를 만듭니다. 소켓이 생성되면 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)를 호출하면 소켓이 데이터그램 메시지 수신을 시작하도록 지시합니다. `address` 및 `port`가 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)에 전달되지 않으면 메서드는 소켓을 임의 포트의 "모든 인터페이스" 주소에 바인딩합니다(`udp4` 및 `udp6` 소켓 모두에 대해 올바르게 수행합니다). 바인딩된 주소와 포트는 [`socket.address().address`](/ko/nodejs/api/dgram#socketaddress) 및 [`socket.address().port`](/ko/nodejs/api/dgram#socketaddress)를 사용하여 검색할 수 있습니다.

`signal` 옵션이 활성화된 경우 해당 `AbortController`에서 `.abort()`를 호출하는 것은 소켓에서 `.close()`를 호출하는 것과 유사합니다.

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// 나중에 서버를 닫으려는 경우.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Added in: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'udp4'` 또는 `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'message'` 이벤트에 리스너로 첨부됩니다.
- 반환: [\<dgram.Socket\>](/ko/nodejs/api/dgram#class-dgramsocket)

지정된 `type`의 `dgram.Socket` 객체를 생성합니다.

소켓이 생성되면 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)를 호출하면 소켓이 데이터그램 메시지 수신을 시작하도록 지시합니다. `address`와 `port`가 [`socket.bind()`](/ko/nodejs/api/dgram#socketbindport-address-callback)에 전달되지 않으면 메서드는 소켓을 임의의 포트의 "모든 인터페이스" 주소에 바인딩합니다(`udp4` 및 `udp6` 소켓 모두에 대해 올바르게 작동합니다). 바인딩된 주소와 포트는 [`socket.address().address`](/ko/nodejs/api/dgram#socketaddress) 및 [`socket.address().port`](/ko/nodejs/api/dgram#socketaddress)를 사용하여 검색할 수 있습니다.

