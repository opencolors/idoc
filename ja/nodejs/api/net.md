---
title: Node.js ドキュメント - ネットワーク
description: Node.jsの'net'モジュールは、ストリームベースのTCPまたはIPCサーバーおよびクライアントを作成するための非同期ネットワークAPIを提供します。接続の作成、サーバーの作成、ソケット操作の処理のためのメソッドが含まれています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - ネットワーク | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの'net'モジュールは、ストリームベースのTCPまたはIPCサーバーおよびクライアントを作成するための非同期ネットワークAPIを提供します。接続の作成、サーバーの作成、ソケット操作の処理のためのメソッドが含まれています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - ネットワーク | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの'net'モジュールは、ストリームベースのTCPまたはIPCサーバーおよびクライアントを作成するための非同期ネットワークAPIを提供します。接続の作成、サーバーの作成、ソケット操作の処理のためのメソッドが含まれています。
---


# Net {#net}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

`node:net` モジュールは、ストリームベースの TCP または [IPC](/ja/nodejs/api/net#ipc-support) サーバー ([`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener)) およびクライアント ([`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)) を作成するための非同期ネットワーク API を提供します。

以下を使用してアクセスできます:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## IPC サポート {#ipc-support}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v20.8.0 | `\0abstract` のような抽象 Unix ドメインソケットパスへのバインドをサポートします。 Node.js `\< v20.4.0` では '\0' をバインドできます。 |
:::

`node:net` モジュールは、Windows の名前付きパイプ、および他のオペレーティングシステムの Unix ドメインソケットによる IPC をサポートします。

### IPC 接続のパスの識別 {#identifying-paths-for-ipc-connections}

[`net.connect()`](/ja/nodejs/api/net#netconnect)、[`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)、[`server.listen()`](/ja/nodejs/api/net#serverlisten)、および [`socket.connect()`](/ja/nodejs/api/net#socketconnect) は、IPC エンドポイントを識別するために `path` パラメータを取ります。

Unix では、ローカルドメインは Unix ドメインとしても知られています。 path はファイルシステムのパス名です。 パス名の長さが `sizeof(sockaddr_un.sun_path)` の長さを超えると、エラーがスローされます。 一般的な値は、Linux では 107 バイト、macOS では 103 バイトです。 Node.js API の抽象化が Unix ドメインソケットを作成する場合、Unix ドメインソケットのリンクも解除します。 たとえば、[`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener) は Unix ドメインソケットを作成し、[`server.close()`](/ja/nodejs/api/net#serverclosecallback) はそれをリンク解除します。 しかし、ユーザーがこれらの抽象化の外で Unix ドメインソケットを作成する場合、ユーザーはそれを削除する必要があります。 同じことが、Node.js API が Unix ドメインソケットを作成したが、プログラムがクラッシュした場合にも当てはまります。 つまり、Unix ドメインソケットはファイルシステムに表示され、リンクが解除されるまで永続化されます。 Linux では、パスの先頭に `\0` を追加して、Unix 抽象ソケットを使用できます (例: `\0abstract`)。 Unix 抽象ソケットへのパスはファイルシステムに表示されず、ソケットへの開いている参照がすべて閉じられると自動的に消えます。

Windows では、ローカルドメインは名前付きパイプを使用して実装されます。 path は `\\?\pipe\` または `\\.\pipe\` のエントリを参照 *する必要があります*。 任意の文字が許可されますが、後者は `..` シーケンスの解決など、パイプ名の処理を行う場合があります。 見た目とは異なり、パイプ名前空間はフラットです。 パイプは *永続化されません*。 パイプへの最後の参照が閉じられると削除されます。 Unix ドメインソケットとは異なり、Windows は所有プロセスが終了するとパイプを閉じて削除します。

JavaScript の文字列エスケープでは、次のように、追加のバックスラッシュエスケープでパスを指定する必要があります:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## クラス: `net.BlockList` {#class-netblocklist}

**追加: v15.0.0, v14.18.0**

`BlockList` オブジェクトは、特定の IP アドレス、IP 範囲、または IP サブネットへのインバウンドまたはアウトバウンドアクセスを無効にするためのルールを指定するために、いくつかのネットワーク API で使用できます。

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**追加: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) IPv4 または IPv6 アドレス。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` または `'ipv6'` のいずれか。 **デフォルト:** `'ipv4'`。

指定された IP アドレスをブロックするルールを追加します。

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**追加: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) 範囲の開始 IPv4 または IPv6 アドレス。
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) 範囲の終了 IPv4 または IPv6 アドレス。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` または `'ipv6'` のいずれか。 **デフォルト:** `'ipv4'`。

`start`（包括的）から `end`（包括的）までの IP アドレス範囲をブロックするルールを追加します。

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**追加: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) ネットワーク IPv4 または IPv6 アドレス。
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CIDR プレフィックスビット数。 IPv4 の場合、これは `0` から `32` までの値でなければなりません。 IPv6 の場合、これは `0` から `128` の間でなければなりません。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` または `'ipv6'` のいずれか。 **デフォルト:** `'ipv4'`。

サブネットマスクとして指定された IP アドレス範囲をブロックするルールを追加します。


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Added in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) チェックするIPアドレス
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` または `'ipv6'` のいずれか。 **デフォルト:** `'ipv4'`。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

与えられたIPアドレスが `BlockList` に追加されたルールのいずれかに一致する場合、`true` を返します。

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv4アドレスのIPv6表記は動作します:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```
### `blockList.rules` {#blocklistrules}

**Added in: v15.0.0, v14.18.0**

- Type: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ブロックリストに追加されたルールのリスト。

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Added in: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意の JS 値
- `value` が `net.BlockList` であれば、`true` を返します。

## Class: `net.SocketAddress` {#class-netsocketaddress}

**Added in: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Added in: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4またはIPv6文字列としてのネットワークアドレス。 **デフォルト**: `family`が`'ipv4'`の場合は`'127.0.0.1'`。`family`が`'ipv6'`の場合は`'::'`。
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'`または`'ipv6'`のいずれか。 **デフォルト**: `'ipv4'`。
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `family`が`'ipv6'`の場合にのみ使用されるIPv6フローラベル。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IPポート。


### `socketaddress.address` {#socketaddressaddress}

**追加:** v15.14.0, v14.18.0

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**追加:** v15.14.0, v14.18.0

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` または `'ipv6'` のいずれか。

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**追加:** v15.14.0, v14.18.0

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**追加:** v15.14.0, v14.18.0

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**追加:** v23.4.0

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPアドレスとオプションのポートを含む入力文字列。例： `123.1.2.3:1234` または `[1::1]:1234`。
- 戻り値: [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress) パースが成功した場合は `SocketAddress` を返します。 それ以外の場合は `undefined` を返します。

## Class: `net.Server` {#class-netserver}

**追加:** v0.1.90

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

このクラスは、TCPまたは[IPC](/ja/nodejs/api/net#ipc-support)サーバーを作成するために使用されます。

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`net.createServer([options][, connectionListener])`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener)を参照してください。
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connection'`](/ja/nodejs/api/net#event-connection)イベントのリスナーとして自動的に設定されます。
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

`net.Server`は、次のイベントを持つ[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter)です。

### Event: `'close'` {#event-close}

**追加:** v0.5.0

サーバーが閉じるときに発生します。 接続が存在する場合、このイベントはすべての接続が終了するまで発生しません。


### イベント: `'connection'` {#event-connection}

**追加: v0.1.90**

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) コネクションオブジェクト

新しいコネクションが確立されたときに発生します。`socket` は `net.Socket` のインスタンスです。

### イベント: `'error'` {#event-error}

**追加: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

エラーが発生したときに発生します。[`net.Socket`](/ja/nodejs/api/net#class-netsocket) とは異なり、[`'close'`](/ja/nodejs/api/net#event-close) イベントは、[`server.close()`](/ja/nodejs/api/net#serverclosecallback) が手動で呼び出されない限り、このイベントの直後には発生**しません**。 [`server.listen()`](/ja/nodejs/api/net#serverlisten) の説明の例を参照してください。

### イベント: `'listening'` {#event-listening}

**追加: v0.1.90**

[`server.listen()`](/ja/nodejs/api/net#serverlisten) の呼び出し後、サーバーがバインドされたときに発生します。

### イベント: `'drop'` {#event-drop}

**追加: v18.6.0, v16.17.0**

接続数が `server.maxConnections` の閾値に達すると、サーバーは新しい接続をドロップし、代わりに `'drop'` イベントを発行します。 TCP サーバーの場合、引数は次のようになります。それ以外の場合、引数は `undefined` です。

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) イベントリスナーに渡される引数。
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ローカルアドレス。
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ローカルポート。
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ローカルファミリー。
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リモートアドレス。
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートポート。
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リモート IP ファミリー。 `'IPv4'` または `'IPv6'`。


### `server.address()` {#serveraddress}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0 | `family` プロパティが、数値の代わりに文字列を返すようになりました。 |
| v18.0.0 | `family` プロパティが、文字列の代わりに数値を返すようになりました。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

IPソケットでリッスンしている場合、オペレーティングシステムによって報告された、バインドされた `address`、アドレスの `family` 名、およびサーバーの `port` を返します（OS割り当てのアドレスを取得するときに割り当てられたポートを見つけるのに役立ちます）。`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。

パイプまたはUnixドメインソケットでリッスンしているサーバーの場合、名前は文字列として返されます。

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // エラーをここで処理します。
  throw err;
});

// 任意の未使用ポートを取得します。
server.listen(() => {
  console.log('opened server on', server.address());
});
```
`server.address()` は、`'listening'` イベントが発行される前、または `server.close()` を呼び出した後には `null` を返します。

### `server.close([callback])` {#serverclosecallback}

**追加: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) サーバーが閉じられたときに呼び出されます。
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

サーバーが新しい接続を受け入れるのを停止し、既存の接続を維持します。 この関数は非同期であり、すべての接続が終了し、サーバーが [`'close'`](/ja/nodejs/api/net#event-close) イベントを発行すると、サーバーは最終的に閉じられます。 オプションの `callback` は、`'close'` イベントが発生すると呼び出されます。 そのイベントとは異なり、サーバーが閉じられたときに開いていなかった場合、`Error` が唯一の引数として呼び出されます。


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[`server.close()`](/ja/nodejs/api/net#serverclosecallback) を呼び出し、サーバーが閉じたときに履行される Promise を返します。

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Added in: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

サーバー上の同時接続の数を非同期で取得します。ソケットがフォークに送信された場合に機能します。

Callback は、2 つの引数 `err` と `count` を取ります。

### `server.listen()` {#serverlisten}

接続をリッスンするサーバーを開始します。`net.Server` は、リッスンするものに応じて TCP または [IPC](/ja/nodejs/api/net#ipc-support) サーバーになる可能性があります。

可能なシグネチャ:

- [`server.listen(handle[, backlog][, callback])`](/ja/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/ja/nodejs/api/net#serverlistenoptions-callback)
- [IPC](/ja/nodejs/api/net#ipc-support) サーバーの場合の [`server.listen(path[, backlog][, callback])`](/ja/nodejs/api/net#serverlistenpath-backlog-callback)
- TCP サーバーの場合の [`server.listen([port[, host[, backlog]]][, callback])`](/ja/nodejs/api/net#serverlistenport-host-backlog-callback)

この関数は非同期です。サーバーがリスニングを開始すると、[`'listening'`](/ja/nodejs/api/net#event-listening) イベントが発行されます。最後のパラメータ `callback` は、[`'listening'`](/ja/nodejs/api/net#event-listening) イベントのリスナーとして追加されます。

すべての `listen()` メソッドは、保留中の接続キューの最大長を指定するために `backlog` パラメータを取ることができます。実際の長さは、Linux 上の `tcp_max_syn_backlog` や `somaxconn` などの sysctl 設定を通じて OS によって決定されます。このパラメータのデフォルト値は 511 (512 ではない) です。

すべての [`net.Socket`](/ja/nodejs/api/net#class-netsocket) は `SO_REUSEADDR` に設定されます (詳細については [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) を参照してください)。

最初の `server.listen()` 呼び出し中にエラーが発生した場合、または `server.close()` が呼び出された場合にのみ、`server.listen()` メソッドを再度呼び出すことができます。それ以外の場合は、`ERR_SERVER_ALREADY_LISTEN` エラーがスローされます。

リスニング時に発生する最も一般的なエラーの 1 つは `EADDRINUSE` です。これは、別のサーバーが要求された `port` / `path` / `handle` で既にリスニングしている場合に発生します。これを処理する 1 つの方法は、一定時間後に再試行することです。

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
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ja/nodejs/api/net#serverlisten) 関数の共通パラメータ
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

ポート、Unixドメインソケット、またはWindows名前付きパイプにすでにバインドされている指定された`handle`で、接続をリッスンするサーバーを起動します。

`handle`オブジェクトは、サーバー、ソケット（基になる`_handle`メンバーを持つもの）、または有効なファイル記述子である`fd`メンバーを持つオブジェクトのいずれかになります。

ファイル記述子でのリスンは、Windowsではサポートされていません。

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.1.0 | `reusePort` オプションがサポートされました。 |
| v15.6.0 | AbortSignal のサポートが追加されました。 |
| v11.4.0 | `ipv6Only` オプションがサポートされました。 |
| v0.11.14 | Added in: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必須。次のプロパティをサポートします。
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ja/nodejs/api/net#serverlisten) 関数の共通パラメータ。
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) TCPサーバーの場合、`ipv6Only`を`true`に設定すると、デュアルスタックのサポートが無効になります。つまり、ホスト`::`にバインドしても`0.0.0.0`はバインドされません。 **デフォルト:** `false`。
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) TCPサーバーの場合、`reusePort`を`true`に設定すると、同じホスト上の複数のソケットが同じポートにバインドできるようになります。着信接続は、オペレーティングシステムによってリスンしているソケットに分散されます。このオプションは、Linux 3.9+、DragonFlyBSD 3.6+、FreeBSD 12.0+、Solaris 11.4、AIX 7.2.5+など、一部のプラットフォームでのみ使用できます。 **デフォルト:** `false`。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `port`が指定されている場合は無視されます。[IPC接続のパスの識別](/ja/nodejs/api/net#identifying-paths-for-ipc-connections)を参照してください。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) IPCサーバーの場合、パイプをすべてのユーザーが読み取り可能にします。 **デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) リッスンしているサーバーを閉じるために使用できるAbortSignal。
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) IPCサーバーの場合、パイプをすべてのユーザーが書き込み可能にします。 **デフォルト:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

`port`が指定されている場合、[`server.listen([port[, host[, backlog]]][, callback])`](/ja/nodejs/api/net#serverlistenport-host-backlog-callback)と同じように動作します。それ以外の場合、`path`が指定されている場合は、[`server.listen(path[, backlog][, callback])`](/ja/nodejs/api/net#serverlistenpath-backlog-callback)と同じように動作します。どちらも指定されていない場合は、エラーがスローされます。

`exclusive`が`false`（デフォルト）の場合、クラスタワーカーは同じ基になるハンドルを使用し、接続処理の責務を共有できます。`exclusive`が`true`の場合、ハンドルは共有されず、ポートの共有を試みるとエラーが発生します。排他的ポートでリスンする例を以下に示します。

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
`exclusive`が`true`で、基になるハンドルが共有されている場合、複数のワーカーが異なるバックログを持つハンドルをクエリする可能性があります。この場合、マスタープロセスに渡される最初の`backlog`が使用されます。

IPCサーバーをルートとして起動すると、特権のないユーザーがサーバーパスにアクセスできなくなる可能性があります。`readableAll`と`writableAll`を使用すると、すべてのユーザーがサーバーにアクセスできるようになります。

`signal`オプションが有効になっている場合、対応する`AbortController`で`.abort()`を呼び出すことは、サーバーで`.close()`を呼び出すのと似ています。

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// 後で、サーバーを閉じたい場合。
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サーバーがリッスンするパス。[IPC接続のパスの識別](/ja/nodejs/api/net#identifying-paths-for-ipc-connections)を参照してください。
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ja/nodejs/api/net#serverlisten) 関数の共通パラメータ。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)。
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

指定された `path` で接続をリッスンする [IPC](/ja/nodejs/api/net#ipc-support) サーバーを起動します。

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`server.listen()`](/ja/nodejs/api/net#serverlisten) 関数の共通パラメータ。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)。
- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

指定された `port` と `host` で接続をリッスンする TCP サーバーを起動します。

`port` が省略されたり、0 の場合、オペレーティングシステムは任意の未使用ポートを割り当てます。これは [`'listening'`](/ja/nodejs/api/net#event-listening) イベントが発生した後、`server.address().port` を使用して取得できます。

`host` が省略された場合、IPv6 が利用可能な場合は [未指定の IPv6 アドレス](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) で、それ以外の場合は [未指定の IPv4 アドレス](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) でサーバーは接続を受け入れます。

ほとんどのオペレーティングシステムでは、[未指定の IPv6 アドレス](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) をリッスンすると、`net.Server` が [未指定の IPv4 アドレス](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) もリッスンする可能性があります。


### `server.listening` {#serverlistening}

**追加:** v5.7.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) サーバーが接続をリッスンしているかどうかを示します。

### `server.maxConnections` {#servermaxconnections}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v21.0.0 | `maxConnections` を `0` に設定すると、すべての受信接続がドロップされます。以前は、`Infinity` として解釈されていました。 |
| v0.2.0 | 追加: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

接続数が `server.maxConnections` の閾値に達した場合:

ソケットが [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) で子プロセスに送信された後は、このオプションを使用することはお勧めしません。

### `server.dropMaxConnection` {#serverdropmaxconnection}

**追加:** v23.1.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

接続数が [`server.maxConnections`][] の閾値に達したら、接続の終了を開始するには、このプロパティを `true` に設定します。この設定は、クラスタモードでのみ有効です。

### `server.ref()` {#serverref}

**追加:** v0.9.1

- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

`unref()` の反対です。以前に `unref` されたサーバーで `ref()` を呼び出しても、それが残りの唯一のサーバーである場合、プログラムは終了しません（デフォルトの動作）。サーバーが `ref` されている場合、`ref()` を再度呼び出しても効果はありません。

### `server.unref()` {#serverunref}

**追加:** v0.9.1

- 戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

サーバーで `unref()` を呼び出すと、イベントシステムでこれが唯一のアクティブなサーバーである場合に、プログラムを終了できます。サーバーがすでに `unref` されている場合、`unref()` を再度呼び出しても効果はありません。

## クラス: `net.Socket` {#class-netsocket}

**追加:** v0.3.4

- 拡張: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このクラスは、TCPソケットまたはストリーミング[IPC](/ja/nodejs/api/net#ipc-support)エンドポイントの抽象化です（Windowsでは名前付きパイプを使用し、それ以外の場合はUnixドメインソケットを使用します）。また、[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter)でもあります。

`net.Socket`は、ユーザーが作成してサーバーと直接やり取りするために使用できます。たとえば、[`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)によって返されるため、ユーザーはそれを使用してサーバーと通信できます。

また、Node.jsによって作成され、接続を受信したときにユーザーに渡されることもあります。たとえば、[`net.Server`](/ja/nodejs/api/net#class-netserver)で発行される[`'connection'`](/ja/nodejs/api/net#event-connection)イベントのリスナーに渡されるため、ユーザーはそれを使用してクライアントとやり取りできます。


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.14.0 | AbortSignal のサポートが追加されました。 |
| v12.10.0 | `onread` オプションが追加されました。 |
| v0.3.4 | 追加: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 利用可能なオプションは次のとおりです:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` に設定すると、ソケットは読み取り側が終了したときに書き込み側を自動的に終了します。 詳細は、[`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener) と [`'end'`](/ja/nodejs/api/net#event-end) イベントを参照してください。 **デフォルト:** `false`。
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定された場合、指定されたファイルディスクリプタを持つ既存のソケットをラップします。それ以外の場合は、新しいソケットが作成されます。
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 指定された場合、受信データは単一の `buffer` に格納され、ソケットにデータが到着すると提供された `callback` に渡されます。 これにより、ストリーミング機能はデータを提供しなくなります。 ソケットは通常どおり `'error'`、`'end'`、および `'close'` などのイベントを発行します。 `pause()` や `resume()` などのメソッドも期待どおりに動作します。
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 受信データの保存に使用する再利用可能なメモリのチャンク、またはそのようなものを返す関数。
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) この関数は、受信データのチャンクごとに呼び出されます。 2 つの引数が渡されます: `buffer` に書き込まれたバイト数と `buffer` への参照。 この関数から `false` を返すと、暗黙的にソケットを `pause()` します。 この関数はグローバルコンテキストで実行されます。
  
 
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `fd` が渡されたときにソケットでの読み取りを許可します。それ以外の場合は無視されます。 **デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ソケットの破棄に使用できる Abort シグナル。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `fd` が渡されたときにソケットでの書き込みを許可します。それ以外の場合は無視されます。 **デフォルト:** `false`。
  
 
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

新しいソケットオブジェクトを作成します。

新しく作成されたソケットは、TCP ソケットまたはストリーミング [IPC](/ja/nodejs/api/net#ipc-support) エンドポイントのいずれかになります。これは、[`connect()`](/ja/nodejs/api/net#socketconnect) で接続するものによって異なります。


### イベント: `'close'` {#event-close_1}

**追加: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ソケットが伝送エラーを起こした場合 `true`。

ソケットが完全に閉じられたときに一度だけ発生します。引数 `hadError` は、ソケットが伝送エラーによって閉じられたかどうかを示すブール値です。

### イベント: `'connect'` {#event-connect}

**追加: v0.1.90**

ソケット接続が正常に確立されたときに発生します。[`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection) を参照してください。

### イベント: `'connectionAttempt'` {#event-connectionattempt}

**追加: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続を試みている IP アドレス。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットが接続を試みているポート。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP のファミリー。IPv6 の場合は `6`、IPv4 の場合は `4` になります。

新しい接続試行が開始されたときに発生します。これは、[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) でファミリーの自動選択アルゴリズムが有効になっている場合、複数回発生する可能性があります。

### イベント: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**追加: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続を試みた IP アドレス。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットが接続を試みたポート。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP のファミリー。IPv6 の場合は `6`、IPv4 の場合は `4` になります。
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 失敗に関連付けられたエラー。

接続試行が失敗したときに発生します。これは、[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) でファミリーの自動選択アルゴリズムが有効になっている場合、複数回発生する可能性があります。


### イベント: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**追加: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続を試みたIPアドレス。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットが接続を試みたポート。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IPアドレスのファミリー。IPv6の場合は`6`、IPv4の場合は`4`になります。

接続試行がタイムアウトした場合に発生します。これは、[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener)でファミリーの自動選択アルゴリズムが有効になっている場合にのみ発生します（複数回発生する可能性があります）。

### イベント: `'data'` {#event-data}

**追加: v0.1.90**

- [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

データを受信したときに発生します。引数 `data` は `Buffer` または `String` になります。データのエンコーディングは、[`socket.setEncoding()`](/ja/nodejs/api/net#socketsetencodingencoding) によって設定されます。

`Socket` が `'data'` イベントを発生させるときにリスナーがない場合、データは失われます。

### イベント: `'drain'` {#event-drain}

**追加: v0.1.90**

書き込みバッファーが空になったときに発生します。アップロードを調整するために使用できます。

参考: `socket.write()` の戻り値。

### イベント: `'end'` {#event-end}

**追加: v0.1.90**

ソケットの相手側が送信の終了を通知したときに発生し、ソケットの読み取り可能な側を終了させます。

デフォルトでは（`allowHalfOpen` が `false`）、ソケットは送信終了パケットを返送し、保留中の書き込みキューを書き出した後、ファイル記述子を破棄します。ただし、`allowHalfOpen` が `true` に設定されている場合、ソケットは自動的に書き込み可能な側を [`end()`](/ja/nodejs/api/net#socketenddata-encoding-callback) しないため、ユーザーは任意の量のデータを書き込むことができます。ユーザーは接続を閉じるために（つまり、FINパケットを返送するために）明示的に [`end()`](/ja/nodejs/api/net#socketenddata-encoding-callback) を呼び出す必要があります。


### イベント: `'error'` {#event-error_1}

**追加: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

エラーが発生したときに発生します。このイベントの直後に `'close'` イベントが呼び出されます。

### イベント: `'lookup'` {#event-lookup}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.10.0 | `host` パラメーターがサポートされるようになりました。 |
| v0.11.3 | 追加: v0.11.3 |
:::

ホスト名を解決した後、接続する前に発生します。Unixソケットには適用されません。

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) エラーオブジェクト。[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)を参照してください。
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPアドレス。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) アドレスタイプ。[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)を参照してください。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ホスト名。

### イベント: `'ready'` {#event-ready}

**追加: v9.11.0**

ソケットが使用できる状態になったときに発生します。

`'connect'` の直後にトリガーされます。

### イベント: `'timeout'` {#event-timeout}

**追加: v0.1.90**

ソケットが非アクティブのためにタイムアウトした場合に発生します。これは、ソケットがアイドル状態になったことを通知するためだけのものです。ユーザーは手動で接続を閉じる必要があります。

参照: [`socket.setTimeout()`](/ja/nodejs/api/net#socketsettimeouttimeout-callback)。

### `socket.address()` {#socketaddress}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0 | `family` プロパティが、数値ではなく文字列を返すようになりました。 |
| v18.0.0 | `family` プロパティが、文字列ではなく数値を返すようになりました。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

オペレーティングシステムによって報告された、ソケットのバインドされた `address`、アドレスの `family` 名、および `port` を返します: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**追加:** v19.4.0, v18.18.0

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このプロパティは、[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) で family autoselection アルゴリズムが有効になっている場合にのみ存在し、試行されたアドレスの配列です。

各アドレスは `$IP:$PORT` の形式の文字列です。接続が成功した場合、最後のアドレスはソケットが現在接続されているアドレスです。

### `socket.bufferSize` {#socketbuffersize}

**追加:** v0.3.8

**非推奨:** v14.6.0 以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`writable.writableLength`](/ja/nodejs/api/stream#writablewritablelength) を使用してください。
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティは、書き込みのためにバッファリングされた文字数を示します。バッファには、エンコード後の長さがまだ不明な文字列が含まれている場合があります。したがって、この数値はバッファ内のバイト数の概算にすぎません。

`net.Socket` には `socket.write()` が常に動作するという特性があります。これは、ユーザーがすばやく起動して実行できるようにするためです。コンピュータは、ソケットに書き込まれるデータの量に常に追いつくことができるとは限りません。ネットワーク接続が遅すぎるだけかもしれません。Node.js は、ソケットに書き込まれたデータを内部的にキューに入れ、可能になったらネットワーク経由で送信します。

この内部バッファリングの結果として、メモリが増加する可能性があります。`bufferSize` が大きい、または増え続けている場合は、[`socket.pause()`](/ja/nodejs/api/net#socketpause) と [`socket.resume()`](/ja/nodejs/api/net#socketresume) を使用して、プログラムのデータフローを「スロットル」することを試みる必要があります。

### `socket.bytesRead` {#socketbytesread}

**追加:** v0.5.3

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

受信したバイト数。


### `socket.bytesWritten` {#socketbyteswritten}

**Added in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

送信されたバイト数。

### `socket.connect()` {#socketconnect}

与えられたソケット上で接続を開始します。

利用可能なシグネチャ:

- [`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener)
- [IPC](/ja/nodejs/api/net#ipc-support) 接続の場合: [`socket.connect(path[, connectListener])`](/ja/nodejs/api/net#socketconnectpath-connectlistener)
- TCP 接続の場合: [`socket.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#socketconnectport-host-connectlistener)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

この関数は非同期です。接続が確立されると、[`'connect'`](/ja/nodejs/api/net#event-connect) イベントが発行されます。接続に問題がある場合、[`'connect'`](/ja/nodejs/api/net#event-connect) イベントの代わりに、エラーが [`'error'`](/ja/nodejs/api/net#event-error_1) リスナーに渡され、[`'error'`](/ja/nodejs/api/net#event-error_1) イベントが発行されます。最後のパラメーター `connectListener` が指定されている場合、[`'connect'`](/ja/nodejs/api/net#event-connect) イベントのリスナーとして**一度だけ**追加されます。

この関数は、`'close'` が発行された後、ソケットを再接続する場合にのみ使用する必要があります。そうでない場合、未定義の動作につながる可能性があります。

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.4.0 | `autoSelectFamily` オプションのデフォルト値は、`setDefaultAutoSelectFamily` またはコマンドラインオプション `--enable-network-family-autoselection` を使用して実行時に変更できます。 |
| v20.0.0, v18.18.0 | `autoSelectFamily` オプションのデフォルト値が true になりました。`--enable-network-family-autoselection` CLI フラグの名前が `--network-family-autoselection` に変更されました。古い名前はエイリアスになりましたが、推奨されません。 |
| v19.3.0, v18.13.0 | `autoSelectFamily` オプションが追加されました。 |
| v17.7.0, v16.15.0 | `noDelay`、`keepAlive`、および `keepAliveInitialDelay` オプションがサポートされるようになりました。 |
| v6.0.0 | `hints` オプションは、すべての場合においてデフォルトで `0` になりました。以前は、`family` オプションがない場合、デフォルトで `dns.ADDRCONFIG | dns.V4MAPPED` になっていました。 |
| v5.11.0 | `hints` オプションがサポートされるようになりました。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ja/nodejs/api/net#socketconnect) メソッドの共通のパラメーター。[`'connect'`](/ja/nodejs/api/net#event-connect) イベントのリスナーとして一度だけ追加されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

与えられたソケット上で接続を開始します。通常、このメソッドは不要です。ソケットは [`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection) で作成およびオープンする必要があります。カスタムソケットを実装する場合にのみこれを使用してください。

TCP 接続の場合、利用可能な `options` は次のとおりです。

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `true` に設定すると、[RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt) のセクション 5 を緩やかに実装するファミリー自動検出アルゴリズムが有効になります。lookup に渡される `all` オプションは `true` に設定され、ソケットは接続が確立されるまで、取得したすべての IPv6 および IPv4 アドレスに順番に接続を試みます。最初に返された AAAA アドレスが最初に試され、次に最初に返された A アドレス、次に 2 番目に返された AAAA アドレスというように試行されます。各接続試行 (最後の試行を除く) には、`autoSelectFamilyAttemptTimeout` オプションで指定された時間が与えられ、タイムアウトして次のアドレスを試行します。`family` オプションが `0` でない場合、または `localAddress` が設定されている場合は無視されます。少なくとも 1 つの接続が成功した場合、接続エラーは発行されません。すべての接続試行が失敗した場合、すべての失敗した試行を含む単一の `AggregateError` が発行されます。**デフォルト:** [`net.getDefaultAutoSelectFamily()`](/ja/nodejs/api/net#netgetdefaultautoselectfamily)。
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): `autoSelectFamily` オプションを使用する場合に、次のアドレスを試行する前に、接続試行が完了するのを待つ時間 (ミリ秒単位)。`10` 未満の正の整数に設定すると、代わりに値 `10` が使用されます。**デフォルト:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ja/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout)。
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): IP スタックのバージョン。`4`、`6`、または `0` である必要があります。値 `0` は、IPv4 と IPv6 の両方のアドレスが許可されることを示します。**デフォルト:** `0`。
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オプションの [`dns.lookup()` ヒント](/ja/nodejs/api/dns#supported-getaddrinfo-flags)。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続するホスト。**デフォルト:** `'localhost'`。
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、接続が確立された直後にソケットでキープアライブ機能が有効になります。これは [`socket.setKeepAlive()`](/ja/nodejs/api/net#socketsetkeepaliveenable-initialdelay) で行われることと同様です。**デフォルト:** `false`。
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 正の数に設定すると、アイドル状態のソケットで最初のキープアライブプローブが送信されるまでの初期遅延を設定します。**デフォルト:** `0`。
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続するローカルアドレス。
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットが接続するローカルポート。
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) カスタムルックアップ関数。**デフォルト:** [`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)。
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、ソケットが確立された直後に Nagle アルゴリズムの使用が無効になります。**デフォルト:** `false`。
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 必須。ソケットが接続するポート。
- `blockList` [\<net.BlockList\>](/ja/nodejs/api/net#class-netblocklist) `blockList` は、特定の IP アドレス、IP 範囲、または IP サブネットへのアウトバウンドアクセスを無効にするために使用できます。

[IPC](/ja/nodejs/api/net#ipc-support) 接続の場合、利用可能な `options` は次のとおりです。

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必須。クライアントが接続するパス。[IPC 接続のパスの識別](/ja/nodejs/api/net#identifying-paths-for-ipc-connections) を参照してください。指定された場合、上記の TCP 固有のオプションは無視されます。


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアントが接続するパス。 [IPC接続のパスの識別](/ja/nodejs/api/net#identifying-paths-for-ipc-connections) を参照してください。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ja/nodejs/api/net#socketconnect) メソッドの共通の引数。 [`'connect'`](/ja/nodejs/api/net#event-connect) イベントのリスナーとして一度だけ追加されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

指定されたソケットで [IPC](/ja/nodejs/api/net#ipc-support) 接続を開始します。

`options` として `{ path: path }` を指定して呼び出された [`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) のエイリアス。

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) クライアントが接続するポート。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアントが接続するホスト。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`socket.connect()`](/ja/nodejs/api/net#socketconnect) メソッドの共通の引数。 [`'connect'`](/ja/nodejs/api/net#event-connect) イベントのリスナーとして一度だけ追加されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

指定されたソケットで TCP 接続を開始します。

`options` として `{port: port, host: host}` を指定して呼び出された [`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) のエイリアス。

### `socket.connecting` {#socketconnecting}

**Added in: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` の場合、[`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) が呼び出され、まだ完了していません。 ソケットが接続されるまで `true` のままで、その後 `false` に設定され、`'connect'` イベントが発生します。 [`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) コールバックは `'connect'` イベントのリスナーであることに注意してください。


### `socket.destroy([error])` {#socketdestroyerror}

**Added in: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

このソケットでこれ以上 I/O アクティビティが発生しないようにします。ストリームを破棄し、接続を閉じます。

詳細については、[`writable.destroy()`](/ja/nodejs/api/stream#writabledestroyerror) を参照してください。

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 接続が破棄されたかどうかを示します。接続が破棄されると、それ以上データ転送はできません。

詳細については、[`writable.destroyed`](/ja/nodejs/api/stream#writabledestroyed) を参照してください。

### `socket.destroySoon()` {#socketdestroysoon}

**Added in: v0.3.4**

すべてのデータが書き込まれた後にソケットを破棄します。`'finish'` イベントが既に発生している場合、ソケットは直ちに破棄されます。ソケットがまだ書き込み可能な場合は、暗黙的に `socket.end()` を呼び出します。

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Added in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) data が `string` の場合のみ使用されます。**デフォルト:** `'utf8'`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ソケットが終了したときのオプションのコールバック。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

ソケットを半分閉じます。つまり、FIN パケットを送信します。サーバーがまだデータを送信する可能性があります。

詳細については、[`writable.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) を参照してください。

### `socket.localAddress` {#socketlocaladdress}

**Added in: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リモートクライアントが接続しているローカル IP アドレスの文字列表現。たとえば、`'0.0.0.0'` でリッスンしているサーバーで、クライアントが `'192.168.1.1'` で接続している場合、`socket.localAddress` の値は `'192.168.1.1'` になります。


### `socket.localPort` {#socketlocalport}

**Added in: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ローカルポートを数値で表したものです。例えば、`80` や `21` などです。

### `socket.localFamily` {#socketlocalfamily}

**Added in: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ローカルIPファミリーを文字列で表したものです。 `'IPv4'` または `'IPv6'`。

### `socket.pause()` {#socketpause}

- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

データの読み込みを一時停止します。つまり、[`'data'`](/ja/nodejs/api/net#event-data) イベントは発行されません。アップロードを抑制するのに役立ちます。

### `socket.pending` {#socketpending}

**Added in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`.connect()` がまだ呼び出されていないか、接続処理中の場合 (see [`socket.connecting`](/ja/nodejs/api/net#socketconnecting))、ソケットがまだ接続されていない場合、これは `true` です。

### `socket.ref()` {#socketref}

**Added in: v0.9.1**

- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

`unref()` の反対で、以前に `unref` されたソケットで `ref()` を呼び出しても、それが唯一のソケットの場合、プログラムは終了しません (デフォルトの動作)。ソケットが `ref` されている場合、`ref` を再度呼び出しても効果はありません。

### `socket.remoteAddress` {#socketremoteaddress}

**Added in: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リモート IP アドレスを文字列で表したものです。たとえば、`'74.125.127.100'` や `'2001:4860:a005::68'` などです。ソケットが破棄された場合 (クライアントが切断された場合など)、値は `undefined` になることがあります。

### `socket.remoteFamily` {#socketremotefamily}

**Added in: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リモート IP ファミリーを文字列で表したものです。 `'IPv4'` または `'IPv6'`。ソケットが破棄された場合 (クライアントが切断された場合など)、値は `undefined` になることがあります。


### `socket.remotePort` {#socketremoteport}

**Added in: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

リモートポートの数値表現。 たとえば、`80` や `21` です。 ソケットが破棄された場合（クライアントが切断された場合など）、値は `undefined` になる可能性があります。

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Added in: v18.3.0, v16.17.0**

- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

RST パケットを送信して TCP 接続を閉じ、ストリームを破棄します。 この TCP ソケットが接続ステータスの場合、RST パケットを送信し、接続されるとすぐにこの TCP ソケットを破棄します。 そうでない場合、`ERR_SOCKET_CLOSED` エラーで `socket.destroy` を呼び出します。 これが TCP ソケットでない場合（パイプなど）、このメソッドを呼び出すと、すぐに `ERR_INVALID_HANDLE_TYPE` エラーがスローされます。

### `socket.resume()` {#socketresume}

- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

[`socket.pause()`](/ja/nodejs/api/net#socketpause) の呼び出し後に読み取りを再開します。

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Added in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

ソケットのエンコーディングを [Readable Stream](/ja/nodejs/api/stream#class-streamreadable) として設定します。 詳細については、[`readable.setEncoding()`](/ja/nodejs/api/stream#readablesetencodingencoding) を参照してください。

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | `TCP_KEEPCNT` および `TCP_KEEPINTVL` ソケットオプションの新しいデフォルトが追加されました。 |
| v0.1.92 | Added in: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

キープアライブ機能を有効/無効にし、オプションでアイドルソケットで最初のキープアライブプローブが送信されるまでの初期遅延を設定します。

`initialDelay`（ミリ秒単位）を設定して、最後に受信したデータパケットと最初のキープアライブプローブの間の遅延を設定します。 `initialDelay` に `0` を設定すると、値はデフォルト（または以前の）設定から変更されません。

キープアライブ機能を有効にすると、次のソケットオプションが設定されます。

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Added in: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

Nagleアルゴリズムの使用を有効/無効にします。

TCP接続が作成されると、Nagleアルゴリズムが有効になります。

Nagleアルゴリズムは、データがネットワーク経由で送信される前に遅延させます。これは、レイテンシを犠牲にしてスループットを最適化しようとします。

`noDelay`に`true`を渡すか、引数を渡さないと、ソケットのNagleアルゴリズムが無効になります。`noDelay`に`false`を渡すと、Nagleアルゴリズムが有効になります。

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

ソケットで`timeout`ミリ秒の非アクティブ状態が続いた後、ソケットをタイムアウトするように設定します。デフォルトでは、`net.Socket`はタイムアウトを持ちません。

アイドルタイムアウトがトリガーされると、ソケットは[`'timeout'`](/ja/nodejs/api/net#event-timeout)イベントを受信しますが、接続は切断されません。ユーザーは、接続を終了するために、[`socket.end()`](/ja/nodejs/api/net#socketenddata-encoding-callback)または[`socket.destroy()`](/ja/nodejs/api/net#socketdestroyerror)を手動で呼び出す必要があります。

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('ソケットタイムアウト');
  socket.end();
});
```
`timeout`が0の場合、既存のアイドルタイムアウトは無効になります。

オプションの`callback`パラメーターは、[`'timeout'`](/ja/nodejs/api/net#event-timeout)イベントの1回限りのリスナーとして追加されます。


### `socket.timeout` {#sockettimeout}

**Added in: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

[`socket.setTimeout()`](/ja/nodejs/api/net#socketsettimeouttimeout-callback) で設定されたソケットのタイムアウトをミリ秒単位で表します。タイムアウトが設定されていない場合は `undefined` になります。

### `socket.unref()` {#socketunref}

**Added in: v0.9.1**

- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) ソケット自体。

ソケットで `unref()` を呼び出すと、イベントシステム内でこれが唯一のアクティブなソケットである場合に、プログラムは終了できます。ソケットがすでに `unref` されている場合、再度 `unref()` を呼び出しても効果はありません。

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Added in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` が `string` の場合のみ使用されます。**デフォルト:** `utf8`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ソケットにデータを送信します。2番目の引数は、文字列の場合のエンコーディングを指定します。デフォルトはUTF8エンコーディングです。

データ全体がカーネルバッファに正常にフラッシュされた場合は `true` を返します。データの一部または全部がユーザーメモリにキューイングされた場合は `false` を返します。バッファが再び空になったときに [`'drain'`](/ja/nodejs/api/net#event-drain) が発行されます。

オプションの `callback` パラメータは、データが最終的に書き出されたときに実行されます。これはすぐには行われない場合があります。

詳細については、`Writable` ストリームの [`write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) メソッドを参照してください。


### `socket.readyState` {#socketreadystate}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このプロパティは、接続の状態を文字列として表します。

- ストリームが接続中の場合、`socket.readyState` は `opening` です。
- ストリームが読み取り可能かつ書き込み可能な場合、`open` です。
- ストリームが読み取り可能で書き込み可能でない場合、`readOnly` です。
- ストリームが読み取り可能でなく書き込み可能な場合、`writeOnly` です。

## `net.connect()` {#netconnect}

[`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection) のエイリアス。

可能なシグネチャ:

- [`net.connect(options[, connectListener])`](/ja/nodejs/api/net#netconnectoptions-connectlistener)
- [IPC](/ja/nodejs/api/net#ipc-support) 接続の場合、[`net.connect(path[, connectListener])`](/ja/nodejs/api/net#netconnectpath-connectlistener)。
- TCP 接続の場合、[`net.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#netconnectport-host-connectlistener)。

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Added in: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

[`net.createConnection(options[, connectListener])`](/ja/nodejs/api/net#netcreateconnectionoptions-connectlistener) のエイリアス。

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

[`net.createConnection(path[, connectListener])`](/ja/nodejs/api/net#netcreateconnectionpath-connectlistener) のエイリアス。

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

[`net.createConnection(port[, host][, connectListener])`](/ja/nodejs/api/net#netcreateconnectionport-host-connectlistener) のエイリアス。


## `net.createConnection()` {#netcreateconnection}

新しい[`net.Socket`](/ja/nodejs/api/net#class-netsocket)を作成し、[`socket.connect()`](/ja/nodejs/api/net#socketconnect)で接続をすぐに開始し、接続を開始する`net.Socket`を返すファクトリ関数です。

接続が確立されると、[`'connect'`](/ja/nodejs/api/net#event-connect)イベントが返されたソケットで発生します。最後のパラメータ`connectListener`が提供された場合、[`'connect'`](/ja/nodejs/api/net#event-connect)イベントのリスナーとして**一度**追加されます。

使用可能なシグネチャ:

- [`net.createConnection(options[, connectListener])`](/ja/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [IPC](/ja/nodejs/api/net#ipc-support)接続の場合、[`net.createConnection(path[, connectListener])`](/ja/nodejs/api/net#netcreateconnectionpath-connectlistener)。
- TCP接続の場合、[`net.createConnection(port[, host][, connectListener])`](/ja/nodejs/api/net#netcreateconnectionport-host-connectlistener)。

[`net.connect()`](/ja/nodejs/api/net#netconnect)関数は、この関数のエイリアスです。

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**追加: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 必須。[`new net.Socket([options])`](/ja/nodejs/api/net#new-netsocketoptions)の呼び出しと[`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener)メソッドの両方に渡されます。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)関数の共通パラメータ。提供された場合、返されたソケットの[`'connect'`](/ja/nodejs/api/net#event-connect)イベントのリスナーとして一度追加されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 接続を開始するために使用される、新しく作成されたソケット。

利用可能なオプションについては、[`new net.Socket([options])`](/ja/nodejs/api/net#new-netsocketoptions)および[`socket.connect(options[, connectListener])`](/ja/nodejs/api/net#socketconnectoptions-connectlistener)を参照してください。

追加のオプション:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 設定されている場合、ソケットの作成後、接続を開始する前に、[`socket.setTimeout(timeout)`](/ja/nodejs/api/net#socketsettimeouttimeout-callback)を呼び出すために使用されます。

[`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener)セクションで説明されているエコーサーバーのクライアントの例を次に示します。

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' リスナー。
  console.log('サーバーに接続しました!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('サーバーから切断されました');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' リスナー。
  console.log('サーバーに接続しました!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('サーバーから切断されました');
});
```
:::

ソケット`/tmp/echo.sock`に接続するには:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```

`port`および`onread`オプションを使用するクライアントの例を次に示します。この場合、`onread`オプションは`new net.Socket([options])`を呼び出すためだけに使用され、`port`オプションは`socket.connect(options[, connectListener])`を呼び出すために使用されます。

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // ソケットからのすべての読み取りに対して4KiBのバッファーを再利用します。
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 受信したデータは、0から`nread`までの`buf`で使用できます。
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
    // ソケットからのすべての読み取りに対して4KiBのバッファーを再利用します。
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 受信したデータは、0から`nread`までの`buf`で使用できます。
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Added in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続するパス。[`socket.connect(path[, connectListener])`](/ja/nodejs/api/net#socketconnectpath-connectlistener)に渡されます。[IPC接続のパスの識別](/ja/nodejs/api/net#identifying-paths-for-ipc-connections)を参照してください。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)関数の共通パラメータで、開始ソケットの`'connect'`イベントの"once"リスナーです。[`socket.connect(path[, connectListener])`](/ja/nodejs/api/net#socketconnectpath-connectlistener)に渡されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 接続を開始するために使用される新しく作成されたソケット。

[IPC](/ja/nodejs/api/net#ipc-support)接続を開始します。

この関数は、すべてのオプションがデフォルトに設定された新しい[`net.Socket`](/ja/nodejs/api/net#class-netsocket)を作成し、[`socket.connect(path[, connectListener])`](/ja/nodejs/api/net#socketconnectpath-connectlistener)との接続を直ちに開始し、接続を開始する`net.Socket`を返します。

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Added in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットが接続するポート。[`socket.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#socketconnectport-host-connectlistener)に渡されます。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソケットが接続するホスト。[`socket.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#socketconnectport-host-connectlistener)に渡されます。 **デフォルト:** `'localhost'`。
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`net.createConnection()`](/ja/nodejs/api/net#netcreateconnection)関数の共通パラメータで、開始ソケットの`'connect'`イベントの"once"リスナーです。[`socket.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#socketconnectport-host-connectlistener)に渡されます。
- 戻り値: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 接続を開始するために使用される新しく作成されたソケット。

TCP接続を開始します。

この関数は、すべてのオプションがデフォルトに設定された新しい[`net.Socket`](/ja/nodejs/api/net#class-netsocket)を作成し、[`socket.connect(port[, host][, connectListener])`](/ja/nodejs/api/net#socketconnectport-host-connectlistener)との接続を直ちに開始し、接続を開始する`net.Socket`を返します。


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | `highWaterMark` オプションがサポートされるようになりました。 |
| v17.7.0, v16.15.0 | `noDelay`, `keepAlive`, および `keepAliveInitialDelay` オプションがサポートされるようになりました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` に設定した場合、ソケットは読み取り側が終了すると、書き込み側を自動的に終了します。 **デフォルト:** `false`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オプションで、すべての [`net.Socket`](/ja/nodejs/api/net#class-netsocket) の `readableHighWaterMark` および `writableHighWaterMark` をオーバーライドします。 **デフォルト:** [`stream.getDefaultHighWaterMark()`](/ja/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode) を参照してください。
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定した場合、[`socket.setKeepAlive()`](/ja/nodejs/api/net#socketsetkeepaliveenable-initialdelay) で行われるのと同様に、新しい受信接続を受信した直後に、ソケットで keep-alive 機能を有効にします。 **デフォルト:** `false`。
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 正の数に設定した場合、アイドル状態のソケットで最初の keepalive プローブが送信されるまでの初期遅延を設定します。 **デフォルト:** `0`。
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定した場合、新しい受信接続を受信した直後に、Nagle アルゴリズムの使用を無効にします。 **デフォルト:** `false`。
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 着信接続でソケットを一時停止するかどうかを示します。 **デフォルト:** `false`。
    - `blockList` [\<net.BlockList\>](/ja/nodejs/api/net#class-netblocklist) `blockList` は、特定の IP アドレス、IP 範囲、または IP サブネットへのインバウンドアクセスを無効にするために使用できます。 サーバーがリバースプロキシ、NAT などの背後にある場合、ブロックリストに対してチェックされるアドレスはプロキシのアドレス、または NAT によって指定されたアドレスであるため、これは機能しません。


-  `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connection'`](/ja/nodejs/api/net#event-connection) イベントのリスナーとして自動的に設定されます。
-  戻り値: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

新しい TCP または [IPC](/ja/nodejs/api/net#ipc-support) サーバーを作成します。

`allowHalfOpen` が `true` に設定されている場合、ソケットの相手側が送信の終了を通知すると、サーバーは [`socket.end()`](/ja/nodejs/api/net#socketenddata-encoding-callback) が明示的に呼び出された場合にのみ送信の終了を返送します。 たとえば、TCP のコンテキストでは、FIN パケットが受信されると、[`socket.end()`](/ja/nodejs/api/net#socketenddata-encoding-callback) が明示的に呼び出された場合にのみ FIN パケットが返送されます。 それまでは、接続はハーフクローズ（読み取り不可だが書き込み可能）です。 詳細については、[`'end'`](/ja/nodejs/api/net#event-end) イベントと [RFC 1122](https://tools.ietf.org/html/rfc1122) (セクション 4.2.2.13) を参照してください。

`pauseOnConnect` が `true` に設定されている場合、各着信接続に関連付けられたソケットは一時停止され、そのハンドルからデータは読み取られません。 これにより、データが元のプロセスによって読み取られることなく、プロセス間で接続を渡すことができます。 一時停止されたソケットからのデータの読み取りを開始するには、[`socket.resume()`](/ja/nodejs/api/net#socketresume) を呼び出します。

サーバーは、TCP サーバーまたは [IPC](/ja/nodejs/api/net#ipc-support) サーバーになる可能性があります。これは、[`listen()`](/ja/nodejs/api/net#serverlisten) 先によって異なります。

ポート 8124 で接続をリッスンする TCP エコーサーバーの例を次に示します。

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' リスナー。
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
  // 'connection' リスナー。
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

`telnet` を使用してこれをテストします。

```bash [BASH]
telnet localhost 8124
```
ソケット `/tmp/echo.sock` でリッスンするには：

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
`nc` を使用して Unix ドメインソケットサーバーに接続します。

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Added in: v19.4.0**

[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) の `autoSelectFamily` オプションの現在のデフォルト値を取得します。初期デフォルト値は `true` です。ただし、コマンドラインオプション `--no-network-family-autoselection` が指定されている場合は除きます。

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `autoSelectFamily` オプションの現在のデフォルト値。

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Added in: v19.4.0**

[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) の `autoSelectFamily` オプションのデフォルト値を設定します。

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 新しいデフォルト値。初期デフォルト値は `true` です。ただし、コマンドラインオプション `--no-network-family-autoselection` が指定されている場合は除きます。

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Added in: v19.8.0, v18.18.0**

[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) の `autoSelectFamilyAttemptTimeout` オプションの現在のデフォルト値を取得します。初期デフォルト値は `250`、またはコマンドラインオプション `--network-family-autoselection-attempt-timeout` で指定された値です。

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `autoSelectFamilyAttemptTimeout` オプションの現在のデフォルト値。

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Added in: v19.8.0, v18.18.0**

[`socket.connect(options)`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) の `autoSelectFamilyAttemptTimeout` オプションのデフォルト値を設定します。

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しいデフォルト値。正の数でなければなりません。数値が `10` 未満の場合、代わりに値 `10` が使用されます。初期デフォルト値は `250`、またはコマンドラインオプション `--network-family-autoselection-attempt-timeout` で指定された値です。


## `net.isIP(input)` {#netisipinput}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`input` が IPv6 アドレスの場合、`6` を返します。`input` が先頭にゼロのない [ドット10進表記](https://en.wikipedia.org/wiki/Dot-decimal_notation) の IPv4 アドレスの場合、`4` を返します。それ以外の場合は、`0` を返します。

```js [ESM]
net.isIP('::1'); // 6 を返す
net.isIP('127.0.0.1'); // 4 を返す
net.isIP('127.000.000.001'); // 0 を返す
net.isIP('127.0.0.1/24'); // 0 を返す
net.isIP('fhqwhgads'); // 0 を返す
```
## `net.isIPv4(input)` {#netisipv4input}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input` が先頭にゼロのない [ドット10進表記](https://en.wikipedia.org/wiki/Dot-decimal_notation) の IPv4 アドレスの場合、`true` を返します。それ以外の場合は、`false` を返します。

```js [ESM]
net.isIPv4('127.0.0.1'); // true を返す
net.isIPv4('127.000.000.001'); // false を返す
net.isIPv4('127.0.0.1/24'); // false を返す
net.isIPv4('fhqwhgads'); // false を返す
```
## `net.isIPv6(input)` {#netisipv6input}

**Added in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input` が IPv6 アドレスの場合、`true` を返します。それ以外の場合は、`false` を返します。

```js [ESM]
net.isIPv6('::1'); // true を返す
net.isIPv6('fhqwhgads'); // false を返す
```

