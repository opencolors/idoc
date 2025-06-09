---
title: Node.js ドキュメント - dgram
description: dgramモジュールはUDPデータグラムソケットの実装を提供し、データグラムパケットを送受信できるクライアントおよびサーバーアプリケーションの作成を可能にします。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: dgramモジュールはUDPデータグラムソケットの実装を提供し、データグラムパケットを送受信できるクライアントおよびサーバーアプリケーションの作成を可能にします。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: dgramモジュールはUDPデータグラムソケットの実装を提供し、データグラムパケットを送受信できるクライアントおよびサーバーアプリケーションの作成を可能にします。
---


# UDP/データグラムソケット {#udp/datagram-sockets}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

`node:dgram` モジュールは、UDPデータグラムソケットの実装を提供します。

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

## Class: `dgram.Socket` {#class-dgramsocket}

**追加:** v0.1.99

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

データグラムの機能をカプセル化します。

`dgram.Socket` の新しいインスタンスは、[`dgram.createSocket()`](/ja/nodejs/api/dgram#dgramcreatesocketoptions-callback) を使用して作成されます。 `new` キーワードは、`dgram.Socket` インスタンスの作成には使用されません。

### Event: `'close'` {#event-close}

**追加:** v0.1.99

`'close'` イベントは、ソケットが [`close()`](/ja/nodejs/api/dgram#socketclosecallback) で閉じられた後に発生します。 トリガーされると、このソケットで新しい `'message'` イベントは発生しません。

### Event: `'connect'` {#event-connect}

**追加:** v12.0.0

`'connect'` イベントは、[`connect()`](/ja/nodejs/api/dgram#socketconnectport-address-callback) の呼び出しが成功した結果、ソケットがリモートアドレスに関連付けられた後に発生します。


### イベント: `'error'` {#event-error}

**追加: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` イベントは、何らかのエラーが発生するたびに発生します。イベントハンドラー関数には、単一の `Error` オブジェクトが渡されます。

### イベント: `'listening'` {#event-listening}

**追加: v0.1.99**

`'listening'` イベントは、`dgram.Socket` がアドレス可能になり、データを受信できるようになったときに一度だけ発生します。これは、`socket.bind()` で明示的に行うか、`socket.send()` を使用して最初にデータを送信するときに暗黙的に行われます。`dgram.Socket` がリスニング状態になるまで、基盤となるシステムリソースは存在せず、`socket.address()` や `socket.setTTL()` などの呼び出しは失敗します。

### イベント: `'message'` {#event-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0 | `family` プロパティが数値の代わりに文字列を返すようになりました。 |
| v18.0.0 | `family` プロパティが文字列の代わりに数値を返すようになりました。 |
| v0.1.99 | 追加: v0.1.99 |
:::

`'message'` イベントは、新しいデータグラムがソケットで利用可能になると発生します。イベントハンドラー関数には、`msg` と `rinfo` の 2 つの引数が渡されます。

- `msg` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) メッセージ。
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) リモートアドレス情報。
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 送信元アドレス。
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) アドレスファミリ (`'IPv4'` または `'IPv6'`）。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 送信元ポート。
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メッセージサイズ。

受信パケットの送信元アドレスが IPv6 リンクローカルアドレスの場合、インターフェース名が `address` に追加されます。 たとえば、`en0` インターフェースで受信されたパケットの場合、アドレスフィールドは `'fe80::2618:1234:ab11:3b9c%en0'` に設定されている可能性があります。`'%en0'` はゾーン ID サフィックスとしてのインターフェース名です。


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**追加: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

カーネルに、指定された `multicastAddress` および `multicastInterface` で `IP_ADD_MEMBERSHIP` ソケットオプションを使用して、マルチキャストグループに参加するように指示します。 `multicastInterface` 引数が指定されていない場合、オペレーティングシステムが1つのインターフェースを選択し、それにメンバーシップを追加します。 利用可能なすべてのインターフェースにメンバーシップを追加するには、インターフェースごとに1回、`addMembership` を複数回呼び出します。

バインドされていないソケットで呼び出されると、このメソッドは暗黙的にランダムなポートにバインドされ、すべてのインターフェースでリッスンします。

複数の `cluster` worker で UDP ソケットを共有する場合、`socket.addMembership()` 関数は1回だけ呼び出す必要があります。そうしないと、`EADDRINUSE` エラーが発生します。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // 正常に動作します。
  cluster.fork(); // EADDRINUSE で失敗します。
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
  cluster.fork(); // 正常に動作します。
  cluster.fork(); // EADDRINUSE で失敗します。
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**追加: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

カーネルに、`IP_ADD_SOURCE_MEMBERSHIP` ソケットオプションを使用して、指定された `sourceAddress` および `groupAddress` でソース固有のマルチキャストチャネルに参加するように指示します。`multicastInterface` 引数が指定されていない場合、オペレーティングシステムが1つのインターフェースを選択し、それにメンバーシップを追加します。利用可能なすべてのインターフェースにメンバーシップを追加するには、インターフェースごとに1回、`socket.addSourceSpecificMembership()` を複数回呼び出します。

バインドされていないソケットで呼び出されると、このメソッドは暗黙的にランダムなポートにバインドされ、すべてのインターフェースでリッスンします。


### `socket.address()` {#socketaddress}

**Added in: v0.1.99**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ソケットのアドレス情報を含むオブジェクトを返します。UDPソケットの場合、このオブジェクトには、`address`、`family`、および`port`プロパティが含まれます。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF`をスローします。

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v0.9.1 | このメソッドは非同期実行モデルに変更されました。レガシーコードは、メソッド呼び出しにコールバック関数を渡すように変更する必要があります。 |
| v0.1.99 | Added in: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) パラメータはありません。バインディングが完了すると呼び出されます。

UDPソケットの場合、指定された`port`およびオプションの`address`で、`dgram.Socket`がデータグラムメッセージをリッスンするようにします。`port`が指定されていないか、`0`の場合、オペレーティングシステムはランダムなポートにバインドしようとします。`address`が指定されていない場合、オペレーティングシステムはすべてのアドレスでリッスンしようとします。バインディングが完了すると、`'listening'`イベントが発行され、オプションの`callback`関数が呼び出されます。

`'listening'`イベントリスナーを指定し、`socket.bind()`メソッドに`callback`を渡すことは有害ではありませんが、あまり役に立ちません。

バインドされたデータグラムソケットは、データグラムメッセージを受信するためにNode.jsプロセスを実行し続けます。

バインディングが失敗すると、`'error'`イベントが生成されます。まれに（たとえば、閉じられたソケットでバインドしようとした場合）、[`Error`](/ja/nodejs/api/errors#class-error)がスローされることがあります。

ポート41234でリッスンしているUDPサーバーの例：



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

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必須。以下のプロパティをサポートします:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

UDPソケットの場合、`dgram.Socket` に、最初の引数として渡される `options` オブジェクトのプロパティとして渡される、名前付きの `port` およびオプションの `address` でデータグラムメッセージをリッスンさせます。`port` が指定されていないか、`0` の場合、オペレーティングシステムはランダムなポートへのバインドを試みます。`address` が指定されていない場合、オペレーティングシステムはすべてのアドレスでリッスンしようとします。バインドが完了すると、`'listening'` イベントが発生し、オプションの `callback` 関数が呼び出されます。

`options` オブジェクトには `fd` プロパティが含まれている場合があります。`0` より大きい `fd` が設定されている場合、指定されたファイル記述子を持つ既存のソケットをラップします。この場合、`port` および `address` のプロパティは無視されます。

`'listening'` イベントリスナーを指定し、`socket.bind()` メソッドに `callback` を渡すことは有害ではありませんが、あまり役に立ちません。

`options` オブジェクトには、[`cluster`](/ja/nodejs/api/cluster) モジュールで `dgram.Socket` オブジェクトを使用する場合に使用される追加の `exclusive` プロパティが含まれる場合があります。`exclusive` が `false` (デフォルト) に設定されている場合、クラスタワーカーは同じ基盤となるソケットハンドルを使用し、接続処理の役割を共有できます。ただし、`exclusive` が `true` の場合、ハンドルは共有されず、ポートの共有を試みるとエラーが発生します。`reusePort` オプションが `true` に設定された `dgram.Socket` を作成すると、`socket.bind()` が呼び出されたときに常に `exclusive` が `true` になります。

バインドされたデータグラムソケットは、データグラムメッセージを受信するために Node.js プロセスを実行し続けます。

バインドに失敗すると、`'error'` イベントが生成されます。まれなケース (たとえば、閉じられたソケットでバインドしようとする) では、[`Error`](/ja/nodejs/api/errors#class-error) がスローされる可能性があります。

排他的なポートでリッスンするソケットの例を以下に示します。

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Added in: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ソケットが閉じられたときに呼び出されます。[`'close'`](/ja/nodejs/api/dgram#event-close) イベントのリスナーとして追加されます。

基になるソケットを閉じ、データのリッスンを停止します。 callback が提供された場合、[`'close'`](/ja/nodejs/api/dgram#event-close) イベントのリスナーとして追加されます。

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[`socket.close()`](/ja/nodejs/api/dgram#socketclosecallback) を呼び出し、ソケットが閉じられたときに解決される Promise を返します。

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Added in: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 接続が完了したとき、またはエラーが発生したときに呼び出されます。

`dgram.Socket` をリモートアドレスとポートに関連付けます。このハンドルによって送信されるすべてのメッセージは、自動的にその宛先に送信されます。また、ソケットはそのリモートピアからのメッセージのみを受信します。すでに接続されているソケットで `connect()` を呼び出そうとすると、[`ERR_SOCKET_DGRAM_IS_CONNECTED`](/ja/nodejs/api/errors#err_socket_dgram_is_connected) 例外が発生します。`address` が提供されていない場合、`'127.0.0.1'` (`udp4` ソケットの場合) または `'::1'` (`udp6` ソケットの場合) がデフォルトで使用されます。接続が完了すると、`'connect'` イベントが発生し、オプションの `callback` 関数が呼び出されます。失敗した場合、`callback` が呼び出されるか、失敗した場合は `'error'` イベントが発生します。

### `socket.disconnect()` {#socketdisconnect}

**Added in: v12.0.0**

接続された `dgram.Socket` をリモートアドレスから関連付け解除する同期関数。バインドされていない、またはすでに接続が解除されているソケットで `disconnect()` を呼び出そうとすると、[`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ja/nodejs/api/errors#err_socket_dgram_not_connected) 例外が発生します。


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Added in: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`IP_DROP_MEMBERSHIP`ソケットオプションを使用して、カーネルに`multicastAddress`のマルチキャストグループから離れるように指示します。このメソッドは、ソケットが閉じられたとき、またはプロセスが終了したときにカーネルによって自動的に呼び出されるため、ほとんどのアプリでこれを呼び出す理由はありません。

`multicastInterface`が指定されていない場合、オペレーティングシステムは、すべての有効なインターフェースでメンバシップを解除しようとします。

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Added in: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`IP_DROP_SOURCE_MEMBERSHIP`ソケットオプションを使用して、カーネルに指定された`sourceAddress`および`groupAddress`のソース固有のマルチキャストチャネルから離れるように指示します。このメソッドは、ソケットが閉じられたとき、またはプロセスが終了したときにカーネルによって自動的に呼び出されるため、ほとんどのアプリでこれを呼び出す理由はありません。

`multicastInterface`が指定されていない場合、オペレーティングシステムは、すべての有効なインターフェースでメンバシップを解除しようとします。

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Added in: v8.7.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_RCVBUF`ソケット受信バッファサイズ（バイト単位）。

アンバウンドソケットで呼び出された場合、このメソッドは[`ERR_SOCKET_BUFFER_SIZE`](/ja/nodejs/api/errors#err_socket_buffer_size)を投げます。

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Added in: v8.7.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_SNDBUF`ソケット送信バッファサイズ（バイト単位）。

アンバウンドソケットで呼び出された場合、このメソッドは[`ERR_SOCKET_BUFFER_SIZE`](/ja/nodejs/api/errors#err_socket_buffer_size)を投げます。


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Added in: v18.8.0, v16.19.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 送信待ちのバイト数。

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Added in: v18.8.0, v16.19.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 現在キューで処理を待っている送信リクエストの数。

### `socket.ref()` {#socketref}

**Added in: v0.9.1**

- 戻り値: [\<dgram.Socket\>](/ja/nodejs/api/dgram#class-dgramsocket)

デフォルトでは、ソケットをバインドすると、ソケットが開いている限り、Node.js プロセスが終了するのをブロックします。 `socket.unref()` メソッドは、Node.js プロセスをアクティブに保つ参照カウントからソケットを除外するために使用できます。 `socket.ref()` メソッドは、ソケットを参照カウントに戻し、デフォルトの動作を復元します。

`socket.ref()` を複数回呼び出しても、追加の効果はありません。

`socket.ref()` メソッドは、呼び出しをチェーンできるように、ソケットへの参照を返します。

### `socket.remoteAddress()` {#socketremoteaddress}

**Added in: v12.0.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

リモートエンドポイントの `address`、`family`、および `port` を含むオブジェクトを返します。 ソケットが接続されていない場合、このメソッドは [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ja/nodejs/api/errors#err_socket_dgram_not_connected) 例外をスローします。

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.0.0 | `address` パラメーターは `string`、`null`、または `undefined` のみを受け入れるようになりました。 |
| v14.5.0, v12.19.0 | `msg` パラメーターは、任意の `TypedArray` または `DataView` を指定できるようになりました。 |
| v12.0.0 | 接続されたソケットでのデータ送信のサポートが追加されました。 |
| v8.0.0 | `msg` パラメーターは `Uint8Array` にできるようになりました。 |
| v8.0.0 | `address` パラメーターは常にオプションになりました。 |
| v6.0.0 | 成功した場合、`callback` は `0` ではなく `null` の `error` 引数で呼び出されるようになりました。 |
| v5.7.0 | `msg` パラメーターは配列にできるようになりました。 また、`offset` パラメーターと `length` パラメーターはオプションになりました。 |
| v0.1.99 | Added in: v0.1.99 |
:::

- `msg` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 送信するメッセージ。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メッセージが開始されるバッファー内のオフセット。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メッセージ内のバイト数。
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 宛先ポート。
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 宛先ホスト名または IP アドレス。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) メッセージが送信されたときに呼び出されます。

ソケット上でデータグラムをブロードキャストします。 コネクションレスソケットの場合、宛先 `port` および `address` を指定する必要があります。 一方、接続されたソケットは、関連付けられたリモートエンドポイントを使用するため、`port` および `address` 引数は設定しないでください。

`msg` 引数には、送信するメッセージが含まれています。 そのタイプに応じて、さまざまな動作が適用される場合があります。 `msg` が `Buffer`、任意の `TypedArray`、または `DataView` の場合、`offset` と `length` は、メッセージが開始される `Buffer` 内のオフセットと、メッセージ内のバイト数をそれぞれ指定します。 `msg` が `String` の場合、`'utf8'` エンコーディングで自動的に `Buffer` に変換されます。 マルチバイト文字を含むメッセージの場合、`offset` と `length` は、文字位置ではなく [バイト長](/ja/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) を基準に計算されます。 `msg` が配列の場合、`offset` と `length` は指定しないでください。

`address` 引数は文字列です。 `address` の値がホスト名の場合、DNS が使用されてホストのアドレスが解決されます。 `address` が指定されていない場合、または nullish の場合、`'127.0.0.1'` ( `udp4` ソケットの場合) または `'::1'` ( `udp6` ソケットの場合) がデフォルトで使用されます。

ソケットが `bind` の呼び出しで以前にバインドされていない場合、ソケットにはランダムなポート番号が割り当てられ、「すべてのインターフェイス」アドレス (`'0.0.0.0'` ( `udp4` ソケットの場合)、`'::0'` ( `udp6` ソケットの場合)) にバインドされます。

DNS エラーを報告したり、`buf` オブジェクトを安全に再利用できる時期を判断したりする方法として、オプションの `callback` 関数を指定できます。 DNS ルックアップでは、Node.js イベントループの少なくとも 1 つのティックの送信時間が遅延します。

データグラムが送信されたことを確実に知る唯一の方法は、`callback` を使用することです。 エラーが発生し、`callback` が指定されている場合、エラーは `callback` への最初の引数として渡されます。 `callback` が指定されていない場合、エラーは `socket` オブジェクトで `'error'` イベントとして発生します。

オフセットと長さはオプションですが、いずれかを使用する場合は両方を *必ず* 設定する必要があります。 これらは、最初の引数が `Buffer`、`TypedArray`、または `DataView` の場合にのみサポートされます。

このメソッドは、バインドされていないソケットで呼び出された場合、[`ERR_SOCKET_BAD_PORT`](/ja/nodejs/api/errors#err_socket_bad_port) をスローします。

`localhost` のポートに UDP パケットを送信する例;

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

複数のバッファーで構成される UDP パケットを `127.0.0.1` のポートに送信する例;

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
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

複数のバッファーを送信すると、アプリケーションとオペレーティングシステムによっては、高速になったり低速になったりする可能性があります。 ケースバイケースで最適な戦略を決定するために、ベンチマークを実行してください。 ただし、一般的に言って、複数のバッファーを送信する方が高速です。

`localhost` のポートに接続されたソケットを使用して UDP パケットを送信する例:

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


#### UDPデータグラムサイズに関する注意点 {#note-about-udp-datagram-size}

IPv4/v6データグラムの最大サイズは、`MTU`（Maximum Transmission Unit：最大伝送単位）と`Payload Length`（ペイロード長）フィールドのサイズに依存します。

- `Payload Length`フィールドは16ビット幅であるため、通常のペイロードは、インターネットヘッダーとデータを含めて64Kオクテットを超えることはできません（65,507バイト = 65,535 - 8バイトUDPヘッダー - 20バイトIPヘッダー）。これは一般的にループバックインターフェースに当てはまりますが、このような長いデータグラムメッセージは、ほとんどのホストやネットワークにとって実用的ではありません。
- `MTU`は、特定のリンク層テクノロジーがデータグラムメッセージでサポートできる最大サイズです。IPv4の場合、あらゆるリンクに対して、最小`MTU`は68オクテットであることが義務付けられており、推奨されるIPv4の`MTU`は576です（通常、ダイヤルアップタイプのアプリケーションの`MTU`として推奨されます）。これらは、全体として到着する場合でも、フラグメント化されて到着する場合でも同様です。IPv6の場合、最小`MTU`は1280オクテットです。ただし、必須の最小フラグメント再構築バッファーサイズは1500オクテットです。68オクテットという値は非常に小さいです。なぜなら、イーサネットのような現在のほとんどのリンク層テクノロジーは、最小`MTU`が1500だからです。

パケットが通過する可能性のある各リンクのMTUを事前に知ることは不可能です。受信者の`MTU`よりも大きいデータグラムを送信しても機能しません。なぜなら、データが意図した受信者に到達しなかったことを送信元に通知することなく、パケットは黙って破棄されるからです。

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Added in: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`SO_BROADCAST`ソケットオプションを設定またはクリアします。 `true`に設定すると、UDPパケットをローカルインターフェースのブロードキャストアドレスに送信できます。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF`をスローします。

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Added in: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*このセクションにおけるスコープへのすべての言及は、<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">IPv6ゾーンインデックス</a>を指しており、これは<a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>で定義されています。文字列形式では、スコープインデックスを持つIPは、<code>'IP%scope'</code>として記述されます。ここで、scopeはインターフェース名またはインターフェース番号です。*

ソケットのデフォルトの送信マルチキャストインターフェースを選択されたインターフェースに設定するか、システムインターフェース選択に戻します。`multicastInterface`は、ソケットのファミリーからのIPの有効な文字列表現である必要があります。

IPv4ソケットの場合、これは目的の物理インターフェースに設定されたIPである必要があります。ソケットでマルチキャストに送信されるすべてのパケットは、この呼び出しの最新の成功した使用によって決定されたインターフェースで送信されます。

IPv6ソケットの場合、`multicastInterface`は、以下の例のようにインターフェースを示すスコープを含める必要があります。IPv6では、個々の`send`呼び出しでアドレスに明示的なスコープを使用することもできるため、明示的なスコープを指定せずにマルチキャストアドレスに送信されるパケットのみが、この呼び出しの最新の成功した使用の影響を受けます。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF`をスローします。


#### 例: IPv6 送信マルチキャストインターフェース {#example-ipv6-outgoing-multicast-interface}

ほとんどのシステムでは、スコープ形式はインターフェース名を使用します。

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
Windows では、スコープ形式はインターフェース番号を使用します。

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### 例: IPv4 送信マルチキャストインターフェース {#example-ipv4-outgoing-multicast-interface}

すべてのシステムは、目的の物理インターフェース上のホストの IP を使用します。

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### 呼び出し結果 {#call-results}

送信準備ができていない、またはもはや開いていないソケットに対する呼び出しは、*実行されていない* [`Error`](/ja/nodejs/api/errors#class-error) をスローする可能性があります。

`multicastInterface` を IP に解析できない場合は、*EINVAL* [`System Error`](/ja/nodejs/api/errors#class-systemerror) がスローされます。

IPv4 では、`multicastInterface` が有効なアドレスであるが、どのインターフェースにも一致しない場合、またはアドレスがファミリーに一致しない場合は、`EADDRNOTAVAIL` または `EPROTONOSUP` などの [`System Error`](/ja/nodejs/api/errors#class-systemerror) がスローされます。

IPv6 では、スコープの指定または省略に関するほとんどのエラーにより、ソケットはシステムのデフォルトのインターフェース選択を使用し続ける（または戻る）ことになります。

ソケットのアドレスファミリーの ANY アドレス (IPv4 `'0.0.0.0'` または IPv6 `'::'`) を使用して、将来のマルチキャストパケットのためにソケットのデフォルトの送信インターフェースの制御をシステムに戻すことができます。

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**追加:** v0.3.8

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`IP_MULTICAST_LOOP` ソケットオプションを設定またはクリアします。`true` に設定すると、マルチキャストパケットはローカルインターフェースでも受信されます。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF` をスローします。

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**追加:** v0.3.8

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`IP_MULTICAST_TTL` ソケットオプションを設定します。TTL は一般的に "Time to Live" を意味しますが、このコンテキストでは、パケットが通過できる IP ホップの数を指定します。特に、マルチキャストトラフィックの場合です。パケットを転送する各ルーターまたはゲートウェイは、TTL をデクリメントします。ルーターによって TTL が 0 にデクリメントされた場合、転送されません。

`ttl` 引数は 0 から 255 の間である必要があります。ほとんどのシステムでのデフォルトは `1` です。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF` をスローします。


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`SO_RCVBUF` ソケットオプションを設定します。ソケットの最大受信バッファーをバイト単位で設定します。

このメソッドは、バインドされていないソケットで呼び出された場合、[`ERR_SOCKET_BUFFER_SIZE`](/ja/nodejs/api/errors#err_socket_buffer_size) をスローします。

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Added in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`SO_SNDBUF` ソケットオプションを設定します。ソケットの最大送信バッファーをバイト単位で設定します。

このメソッドは、バインドされていないソケットで呼び出された場合、[`ERR_SOCKET_BUFFER_SIZE`](/ja/nodejs/api/errors#err_socket_buffer_size) をスローします。

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Added in: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`IP_TTL` ソケットオプションを設定します。TTL は一般的に "Time to Live" を意味しますが、ここではパケットが通過できる IP ホップの数を指定します。パケットを転送する各ルーターまたはゲートウェイは TTL をデクリメントします。ルーターによって TTL が 0 にデクリメントされると、転送されません。TTL 値の変更は、通常、ネットワークプローブやマルチキャストの場合に行われます。

`ttl` 引数は 1 から 255 の間で指定できます。ほとんどのシステムのデフォルトは 64 です。

このメソッドは、バインドされていないソケットで呼び出された場合、`EBADF` をスローします。

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- 戻り値: [\<dgram.Socket\>](/ja/nodejs/api/dgram#class-dgramsocket)

デフォルトでは、ソケットをバインドすると、ソケットが開いている限り、Node.js プロセスが終了するのをブロックします。`socket.unref()` メソッドを使用すると、ソケットを Node.js プロセスをアクティブに保つ参照カウントから除外し、ソケットがまだリッスンしている場合でもプロセスを終了させることができます。

`socket.unref()` を複数回呼び出しても、追加の効果はありません。

`socket.unref()` メソッドは、呼び出しをチェーンできるように、ソケットへの参照を返します。


## `node:dgram` モジュール関数 {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.1.0 | `reusePort` オプションがサポートされました。 |
| v15.8.0 | AbortSignal のサポートが追加されました。 |
| v11.4.0 | `ipv6Only` オプションがサポートされました。 |
| v8.7.0 | `recvBufferSize` と `sendBufferSize` オプションがサポートされるようになりました。 |
| v8.6.0 | `lookup` オプションがサポートされました。 |
| v0.11.13 | 追加: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 使用可能なオプション:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットのファミリ。 `'udp4'` または `'udp6'` のいずれかでなければなりません。 必須。
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、[`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) は、たとえ別のプロセスがすでにソケットをバインドしていても、アドレスを再利用します。ただし、データを受信できるのは 1 つのソケットのみです。 **デフォルト:** `false`。
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、[`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) は、たとえ別のプロセスがすでにソケットをバインドしていても、ポートを再利用します。 入ってくるデータグラムは、リスニングしているソケットに配信されます。 このオプションは、Linux 3.9 以降、DragonFlyBSD 3.6 以降、FreeBSD 12.0 以降、Solaris 11.4、AIX 7.2.5 以降など、一部のプラットフォームでのみ利用可能です。 サポートされていないプラットフォームでは、ソケットがバインドされるとこのオプションはエラーを発生させます。 **デフォルト:** `false`。
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `ipv6Only` を `true` に設定すると、デュアルスタックサポートが無効になります。つまり、アドレス `::` にバインドしても、`0.0.0.0` がバインドされることはありません。 **デフォルト:** `false`。
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_RCVBUF` ソケット値を設定します。
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SO_SNDBUF` ソケット値を設定します。
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) カスタムのルックアップ関数。 **デフォルト:** [`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ソケットを閉じるために使用できる AbortSignal。
    - `receiveBlockList` [\<net.BlockList\>](/ja/nodejs/api/net#class-netblocklist) `receiveBlockList` は、特定の IP アドレス、IP 範囲、または IP サブネットへのインバウンドデータグラムを破棄するために使用できます。 サーバーがリバースプロキシ、NAT などの背後にある場合、ブロックリストに対してチェックされるアドレスはプロキシアドレス、または NAT によって指定されたアドレスであるため、これは機能しません。
    - `sendBlockList` [\<net.BlockList\>](/ja/nodejs/api/net#class-netblocklist) `sendBlockList` は、特定の IP アドレス、IP 範囲、または IP サブネットへのアウトバウンドアクセスを無効にするために使用できます。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'message'` イベントのリスナーとしてアタッチされます。 省略可能です。
- 戻り値: [\<dgram.Socket\>](/ja/nodejs/api/dgram#class-dgramsocket)

`dgram.Socket` オブジェクトを作成します。 ソケットが作成されたら、[`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) を呼び出すと、ソケットにデータグラムメッセージの受信を開始するように指示します。 `address` と `port` が [`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) に渡されない場合、このメソッドはソケットをランダムなポートの "すべてのインターフェース" アドレスにバインドします (これは `udp4` と `udp6` の両方のソケットに対して適切に処理します)。 バインドされたアドレスとポートは、[`socket.address().address`](/ja/nodejs/api/dgram#socketaddress) と [`socket.address().port`](/ja/nodejs/api/dgram#socketaddress) を使用して取得できます。

`signal` オプションが有効になっている場合、対応する `AbortController` で `.abort()` を呼び出すことは、ソケットで `.close()` を呼び出すのと似ています。

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// 後で、サーバーを閉じたい場合。
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Added in: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'udp4'` または `'udp6'` のいずれか。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'message'` イベントのリスナーとしてアタッチされます。
- 戻り値: [\<dgram.Socket\>](/ja/nodejs/api/dgram#class-dgramsocket)

指定された `type` の `dgram.Socket` オブジェクトを作成します。

ソケットが作成されると、[`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) を呼び出すことで、ソケットにデータグラムメッセージのリスニングを開始するように指示します。`address` と `port` が [`socket.bind()`](/ja/nodejs/api/dgram#socketbindport-address-callback) に渡されない場合、メソッドはソケットをランダムなポートの "すべてのインターフェース" アドレスにバインドします (これは `udp4` と `udp6` の両方のソケットに対して適切に動作します)。バインドされたアドレスとポートは、[`socket.address().address`](/ja/nodejs/api/dgram#socketaddress) と [`socket.address().port`](/ja/nodejs/api/dgram#socketaddress) を使用して取得できます。

