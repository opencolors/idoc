---
title: Node.js HTTPモジュールのドキュメント
description: Node.jsの公式HTTPモジュールのドキュメントで、HTTPサーバーとクライアントの作成、リクエストとレスポンスの処理、およびさまざまなHTTPメソッドとヘッダーの管理方法を詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js HTTPモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの公式HTTPモジュールのドキュメントで、HTTPサーバーとクライアントの作成、リクエストとレスポンスの処理、およびさまざまなHTTPメソッドとヘッダーの管理方法を詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js HTTPモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの公式HTTPモジュールのドキュメントで、HTTPサーバーとクライアントの作成、リクエストとレスポンスの処理、およびさまざまなHTTPメソッドとヘッダーの管理方法を詳述しています。
---


# HTTP {#http}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

クライアントとサーバーの両方を含むこのモジュールは、`require('node:http')` (CommonJS) または `import * as http from 'node:http'` (ES module) を介してインポートできます。

Node.js の HTTP インターフェースは、従来使いにくかったプロトコルの多くの機能をサポートするように設計されています。 特に、大きな、場合によってはチャンクエンコードされたメッセージです。 インターフェースは、リクエストまたはレスポンス全体をバッファリングしないように注意されているため、ユーザーはデータをストリームできます。

HTTP メッセージヘッダーは、次のようなオブジェクトで表されます。

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
キーは小文字に変換されます。 値は変更されません。

可能な HTTP アプリケーションの全範囲をサポートするために、Node.js HTTP API は非常に低レベルです。 ストリーム処理とメッセージ解析のみを扱います。 メッセージをヘッダーとボディに解析しますが、実際のヘッダーまたはボディは解析しません。

重複するヘッダーの処理方法の詳細については、[`message.headers`](/ja/nodejs/api/http#messageheaders) を参照してください。

受信したとおりの生のヘッダーは、`rawHeaders` プロパティに保持されます。これは `[key, value, key2, value2, ...]` の配列です。 たとえば、前のメッセージヘッダーオブジェクトには、次のような `rawHeaders` リストが含まれている可能性があります。

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## クラス: `http.Agent` {#class-httpagent}

**追加:** v0.3.4

`Agent` は、HTTP クライアントの接続の永続性と再利用を管理する役割を担います。 特定のホストとポートの保留中のリクエストのキューを維持し、キューが空になるまで、各リクエストに対して単一のソケット接続を再利用します。キューが空になると、ソケットは破棄されるか、同じホストとポートへのリクエストに再度使用されるようにプールに入れられます。 破棄されるかプールされるかは、[`keepAlive`](/ja/nodejs/api/http#new-agentoptions) [オプション] に依存します。

プールされた接続では TCP Keep-Alive が有効になっていますが、サーバーはアイドル接続を閉じることがあります。その場合、アイドル接続はプールから削除され、新しい HTTP リクエストがそのホストとポートに対して行われると、新しい接続が確立されます。 サーバーが同じ接続で複数のリクエストを許可しない場合もあります。その場合、接続はリクエストごとに再作成する必要があり、プールすることはできません。 `Agent` は引き続きそのサーバーにリクエストを行いますが、それぞれが新しい接続で行われます。

接続がクライアントまたはサーバーによって閉じられると、接続はプールから削除されます。 プール内の未使用のソケットは、未処理のリクエストがない場合に Node.js プロセスが実行され続けないように、unref されます ([`socket.unref()`](/ja/nodejs/api/net#socketunref) を参照)。

未使用のソケットは OS リソースを消費するため、`Agent` インスタンスが不要になった場合は、[`destroy()`](/ja/nodejs/api/http#agentdestroy) することをお勧めします。

ソケットは、ソケットが `'close'` イベントまたは `'agentRemove'` イベントのいずれかを発行すると、エージェントから削除されます。 1 つの HTTP リクエストをエージェントに保持せずに長時間開いておきたい場合は、次のようなことを行うことができます。

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
エージェントは個々のリクエストにも使用できます。 `http.get()` または `http.request()` 関数へのオプションとして `{agent: false}` を指定することにより、デフォルトオプションの 1 回限りの使用 `Agent` がクライアント接続に使用されます。

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // このリクエストのためだけに新しいエージェントを作成します
}, (res) => {
  // レスポンスで何か処理を行う
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.6.0, v14.17.0 | デフォルトのスケジューリングを 'fifo' から 'lifo' に変更しました。 |
| v14.5.0, v12.20.0 | 空きソケットのスケジューリング戦略を指定するための `scheduling` オプションを追加しました。 |
| v14.5.0, v12.19.0 | エージェントのコンストラクターに `maxTotalSockets` オプションを追加しました。 |
| v0.3.4 | 追加: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) エージェントに設定する構成可能なオプションのセット。以下のフィールドを持つことができます:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 未処理のリクエストがない場合でもソケットを保持し、TCP接続を再確立することなく将来のリクエストに使用できるようにします。`Connection` ヘッダーの `keep-alive` 値と混同しないようにしてください。`Connection: keep-alive` ヘッダーは、`Connection` ヘッダーが明示的に指定されている場合、または `keepAlive` および `maxSockets` オプションがそれぞれ `false` および `Infinity` に設定されている場合を除き、エージェントを使用する際に常に送信されます。この場合、`Connection: close` が使用されます。**デフォルト:** `false`。
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `keepAlive` オプションを使用する場合、TCP Keep-Alive パケットの[初期遅延](/ja/nodejs/api/net#socketsetkeepaliveenable-initialdelay)を指定します。`keepAlive` オプションが `false` または `undefined` の場合は無視されます。**デフォルト:** `1000`。
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ホストごとに許可されるソケットの最大数。同じホストが複数の同時接続を開く場合、各リクエストは `maxSockets` 値に達するまで新しいソケットを使用します。ホストが `maxSockets` よりも多くの接続を開こうとすると、追加のリクエストは保留リクエストキューに入り、既存の接続が終了するとアクティブな接続状態になります。これにより、特定のホストからのアクティブな接続数が常に `maxSockets` 以下になることが保証されます。**デフォルト:** `Infinity`。
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) すべてのホストで許可されるソケットの合計最大数。各リクエストは、最大数に達するまで新しいソケットを使用します。**デフォルト:** `Infinity`。
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フリー状態で開いたままにするホストごとのソケットの最大数。`keepAlive` が `true` に設定されている場合にのみ関連します。**デフォルト:** `256`。
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 次に使用する空きソケットを選択する際に適用するスケジューリング戦略。`'fifo'` または `'lifo'` を指定できます。2つのスケジューリング戦略の主な違いは、`'lifo'` は最後に使用されたソケットを選択し、`'fifo'` は最も使用頻度の低いソケットを選択することです。1秒あたりのリクエスト数が少ない場合、`'lifo'` スケジューリングは、非アクティブのためにサーバーによって閉じられた可能性のあるソケットを選択するリスクを軽減します。1秒あたりのリクエスト数が多い場合、`'fifo'` スケジューリングはオープンソケットの数を最大化し、`'lifo'` スケジューリングはそれを可能な限り低く抑えます。**デフォルト:** `'lifo'`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットタイムアウト（ミリ秒単位）。これは、ソケットが作成されたときにタイムアウトを設定します。

`options` in [`socket.connect()`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) もサポートされています。

それらのいずれかを構成するには、カスタム [`http.Agent`](/ja/nodejs/api/http#class-httpagent) インスタンスを作成する必要があります。

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**追加:** v0.11.4

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) コネクションの詳細を含むオプション。オプションの形式については、[`net.createConnection()`](/ja/nodejs/api/net#netcreateconnectionoptions-connectlistener) を確認してください。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 作成されたソケットを受け取るコールバック関数。
- 戻り値: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

HTTP リクエストで使用されるソケット/ストリームを生成します。

デフォルトでは、この関数は [`net.createConnection()`](/ja/nodejs/api/net#netcreateconnectionoptions-connectlistener) と同じです。 ただし、より高い柔軟性が必要な場合、カスタムエージェントはこのメソッドをオーバーライドできます。

ソケット/ストリームは、この関数からソケット/ストリームを返すか、ソケット/ストリームを `callback` に渡すかのいずれかの方法で提供できます。

このメソッドは、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラス ([\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラス) のインスタンスを返すことが保証されています。ただし、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定した場合を除きます。

`callback` のシグネチャは `(err, stream)` です。

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**追加:** v8.1.0

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

`socket` がリクエストから切り離され、`Agent` によって維持できる場合に呼び出されます。 デフォルトの動作は次のとおりです。

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```

このメソッドは、特定の `Agent` サブクラスによってオーバーライドできます。 このメソッドが falsy 値を返す場合、ソケットは次のリクエストで使用するために維持されるのではなく、破棄されます。

`socket` 引数は、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) のインスタンス、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラスにすることができます。

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**追加:** v8.1.0

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

keep-alive オプションのために維持された後、`socket` が `request` にアタッチされるときに呼び出されます。 デフォルトの動作は次のとおりです。

```js [ESM]
socket.ref();
```

このメソッドは、特定の `Agent` サブクラスによってオーバーライドできます。

`socket` 引数は、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) のインスタンス、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラスにすることができます。


### `agent.destroy()` {#agentdestroy}

**Added in: v0.11.4**

エージェントが現在使用しているすべてのソケットを破棄します。

通常、これを行う必要はありません。ただし、`keepAlive` を有効にしてエージェントを使用している場合は、不要になったときにエージェントを明示的にシャットダウンすることをお勧めします。そうしないと、サーバーがソケットを終了するまでに、ソケットが非常に長い間開いたままになる可能性があります。

### `agent.freeSockets` {#agentfreesockets}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | このプロパティは `null` プロトタイプを持つようになりました。 |
| v0.11.4 | Added in: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`keepAlive` が有効になっている場合に、エージェントによる使用を現在待機しているソケットの配列を含むオブジェクト。変更しないでください。

`freeSockets` リスト内のソケットは、`'timeout'` で自動的に破棄され、配列から削除されます。

### `agent.getName([options])` {#agentgetnameoptions}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.7.0, v16.15.0 | `options` パラメータはオプションになりました。 |
| v0.11.4 | Added in: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 名前生成のための情報を提供するオプションのセット
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストを発行するサーバーのドメイン名またはIPアドレス
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートサーバーのポート
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストを発行する際にネットワーク接続にバインドするローカルインターフェース
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) これが `undefined` と等しくない場合、4または6でなければなりません。
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

接続を再利用できるかどうかを判断するために、リクエストオプションのセットに対して一意の名前を取得します。 HTTPエージェントの場合、これは `host:port:localAddress` または `host:port:localAddress:family` を返します。 HTTPSエージェントの場合、名前には、CA、証明書、暗号、およびソケットの再利用性を決定するその他のHTTPS/TLS固有のオプションが含まれます。


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Added in: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

デフォルトでは 256 に設定されています。`keepAlive` が有効なエージェントの場合、これは空き状態のままにしておくソケットの最大数を設定します。

### `agent.maxSockets` {#agentmaxsockets}

**Added in: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

デフォルトでは `Infinity` に設定されています。エージェントがオリジンごとに開くことができる同時ソケットの数を決定します。オリジンは、[`agent.getName()`](/ja/nodejs/api/http#agentgetnameoptions) によって返される値です。

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Added in: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

デフォルトでは `Infinity` に設定されています。エージェントが開くことができる同時ソケットの数を決定します。`maxSockets` とは異なり、このパラメーターはすべてのオリジンに適用されます。

### `agent.requests` {#agentrequests}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | プロパティは `null` プロトタイプを持つようになりました。 |
| v0.5.9 | Added in: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ソケットにまだ割り当てられていないリクエストのキューを含むオブジェクト。変更しないでください。

### `agent.sockets` {#agentsockets}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | プロパティは `null` プロトタイプを持つようになりました。 |
| v0.3.6 | Added in: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

エージェントによって現在使用されているソケットの配列を含むオブジェクト。変更しないでください。

## Class: `http.ClientRequest` {#class-httpclientrequest}

**Added in: v0.1.17**

- 拡張元: [\<http.OutgoingMessage\>](/ja/nodejs/api/http#class-httpoutgoingmessage)

このオブジェクトは内部で作成され、[`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) から返されます。これは、ヘッダーがすでにキューに入れられている *進行中* のリクエストを表します。ヘッダーは、[`setHeader(name, value)`](/ja/nodejs/api/http#requestsetheadername-value)、[`getHeader(name)`](/ja/nodejs/api/http#requestgetheadername)、[`removeHeader(name)`](/ja/nodejs/api/http#requestremoveheadername) API を使用して変更可能です。実際のヘッダーは、最初のデータチャンクとともに、または [`request.end()`](/ja/nodejs/api/http#requestenddata-encoding-callback) を呼び出すときに送信されます。

レスポンスを取得するには、リクエストオブジェクトに [`'response'`](/ja/nodejs/api/http#event-response) のリスナーを追加します。レスポンスヘッダーが受信されると、[`'response'`](/ja/nodejs/api/http#event-response) がリクエストオブジェクトから発行されます。[`'response'`](/ja/nodejs/api/http#event-response) イベントは、[`http.IncomingMessage`](/ja/nodejs/api/http#class-httpincomingmessage) のインスタンスである 1 つの引数で実行されます。

[`'response'`](/ja/nodejs/api/http#event-response) イベント中に、レスポンスオブジェクトにリスナーを追加できます。特に `'data'` イベントをリッスンします。

[`'response'`](/ja/nodejs/api/http#event-response) ハンドラーが追加されていない場合、レスポンスは完全に破棄されます。ただし、[`'response'`](/ja/nodejs/api/http#event-response) イベントハンドラーが追加されている場合、レスポンスオブジェクトからのデータは、`'readable'` イベントがあるたびに `response.read()` を呼び出すか、`'data'` ハンドラーを追加するか、`.resume()` メソッドを呼び出すことによって **消費される必要があります**。データが消費されるまで、`'end'` イベントは発生しません。また、データが読み取られるまで、メモリを消費し続け、最終的には「process out of memory」エラーにつながる可能性があります。

下位互換性のため、`res` は `'error'` リスナーが登録されている場合にのみ `'error'` を発行します。

レスポンスボディのサイズを制限するには、`Content-Length` ヘッダーを設定します。[`response.strictContentLength`](/ja/nodejs/api/http#responsestrictcontentlength) が `true` に設定されている場合、`Content-Length` ヘッダー値が一致しないと、`code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ja/nodejs/api/errors#err_http_content_length_mismatch) で識別される `Error` がスローされます。

`Content-Length` の値は、文字ではなくバイト単位である必要があります。`Buffer.byteLength()`](/ja/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) を使用して、ボディの長さをバイト単位で決定します。


### Event: `'abort'` {#event-abort}

**Added in: v1.4.1**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。代わりに `'close'` イベントをリッスンしてください。
:::

クライアントによってリクエストが中断されたときに発生します。このイベントは、`abort()` の最初の呼び出しでのみ発生します。

### Event: `'close'` {#event-close}

**Added in: v0.5.4**

リクエストが完了したか、またはその基になる接続が (レスポンスの完了前に) 途中で終了したことを示します。

### Event: `'connect'` {#event-connect}

**Added in: v0.7.0**

- `response` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

サーバーが `CONNECT` メソッドでリクエストに応答するたびに発生します。このイベントがリッスンされていない場合、`CONNECT` メソッドを受信するクライアントは接続を閉じられます。

このイベントは、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラス ([\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラス) のインスタンスを渡されることが保証されます。ただし、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定した場合は除きます。

`'connect'` イベントをリッスンする方法を示すクライアントとサーバーのペア:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// HTTPトンネリングプロキシを作成する
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // オリジンサーバーに接続する
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// プロキシが実行されたので
proxy.listen(1337, '127.0.0.1', () => {

  // トンネリングプロキシにリクエストを行う
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // HTTPトンネルを介してリクエストを行う
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// HTTPトンネリングプロキシを作成する
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // オリジンサーバーに接続する
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// プロキシが実行されたので
proxy.listen(1337, '127.0.0.1', () => {

  // トンネリングプロキシにリクエストを行う
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // HTTPトンネルを介してリクエストを行う
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### イベント: `'continue'` {#event-continue}

**追加: v0.3.2**

通常、リクエストに 'Expect: 100-continue' が含まれている場合に、サーバーが '100 Continue' HTTP レスポンスを送信したときに発生します。 これは、クライアントがリクエストボディを送信する必要があるという指示です。

### イベント: `'finish'` {#event-finish}

**追加: v0.3.6**

リクエストが送信されたときに発生します。 より具体的には、このイベントは、レスポンスヘッダーとボディの最後のセグメントが、ネットワーク経由で送信するためにオペレーティングシステムに引き渡されたときに発生します。 これは、サーバーがまだ何かを受信したことを意味するものではありません。

### イベント: `'information'` {#event-information}

**追加: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サーバーが 1xx 中間レスポンス (101 Upgrade を除く) を送信したときに発生します。 このイベントのリスナーは、HTTP バージョン、ステータスコード、ステータスメッセージ、キーと値のヘッダーオブジェクト、および生のヘッダー名とそのそれぞれの値が続く配列を含むオブジェクトを受信します。

::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

101 Upgrade ステータスは、Web ソケット、インプレース TLS アップグレード、HTTP 2.0 など、従来の HTTP リクエスト/レスポンスチェーンからの分離のため、このイベントを発生させません。 101 Upgrade 通知を受け取るには、代わりに [`'upgrade'`](/ja/nodejs/api/http#event-upgrade) イベントをリッスンしてください。


### Event: `'response'` {#event-response}

**追加: v0.1.0**

- `response` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)

このリクエストに対するレスポンスを受信したときに発生します。このイベントは一度だけ発生します。

### Event: `'socket'` {#event-socket}

**追加: v0.5.3**

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このイベントには、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラス（[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラス）のインスタンスが渡されることが保証されます。ただし、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定した場合は除きます。

### Event: `'timeout'` {#event-timeout}

**追加: v0.7.8**

基になるソケットが非アクティブ状態からタイムアウトしたときに発生します。これは、ソケットがアイドル状態になったことを通知するだけです。リクエストは手動で破棄する必要があります。

参照: [`request.setTimeout()`](/ja/nodejs/api/http#requestsettimeouttimeout-callback)。

### Event: `'upgrade'` {#event-upgrade}

**追加: v0.1.94**

- `response` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

サーバーがアップグレードを伴うリクエストに応答するたびに発生します。このイベントがリッスンされておらず、応答ステータスコードが 101 Switching Protocols の場合、アップグレードヘッダーを受信するクライアントは接続を閉じられます。

このイベントには、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラス（[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラス）のインスタンスが渡されることが保証されます。ただし、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定した場合は除きます。

`'upgrade'` イベントをリッスンする方法を示すクライアントサーバーのペア。

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// HTTPサーバーを作成する
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// サーバーが実行されたので
server.listen(1337, '127.0.0.1', () => {

  // リクエストを作成する
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// HTTPサーバーを作成する
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// サーバーが実行されたので
server.listen(1337, '127.0.0.1', () => {

  // リクエストを作成する
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Added in: v0.3.8**

**Deprecated since: v14.1.0, v13.14.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに[`request.destroy()`](/ja/nodejs/api/http#requestdestroyerror)を使用してください。
:::

リクエストを中断としてマークします。これを呼び出すと、レスポンス内の残りのデータが破棄され、ソケットが破棄されます。

### `request.aborted` {#requestaborted}

::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0, v16.12.0 | Deprecated since: v17.0.0, v16.12.0 |
| v11.0.0 | `aborted` プロパティはタイムスタンプの数値ではなくなりました。 |
| v0.11.14 | Added in: v0.11.14 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated. 代わりに[`request.destroyed`](/ja/nodejs/api/http#requestdestroyed)を確認してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`request.aborted` プロパティは、リクエストが中断された場合に `true` になります。

### `request.connection` {#requestconnection}

**Added in: v0.3.0**

**Deprecated since: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated. [`request.socket`](/ja/nodejs/api/http#requestsocket)を使用してください。
:::

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

[`request.socket`](/ja/nodejs/api/http#requestsocket)を参照してください。

### `request.cork()` {#requestcork}

**Added in: v13.2.0, v12.16.0**

[`writable.cork()`](/ja/nodejs/api/stream#writablecork)を参照してください。

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `data` パラメータは `Uint8Array` になりました。 |
| v10.0.0 | このメソッドは `ClientRequest` への参照を返すようになりました。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

リクエストの送信を完了します。ボディの一部が送信されていない場合は、ストリームにフラッシュします。リクエストがチャンクされている場合、これは終端の `'0\r\n\r\n'` を送信します。

`data` が指定されている場合、[`request.write(data, encoding)`](/ja/nodejs/api/http#requestwritechunk-encoding-callback) の呼び出しに続いて `request.end(callback)` を呼び出すのと同じです。

`callback` が指定されている場合、リクエストストリームが完了すると呼び出されます。


### `request.destroy([error])` {#requestdestroyerror}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.5.0 | 他の Readable ストリームとの一貫性のために、この関数は `this` を返します。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) オプション。`'error'` イベントで発生させるエラー。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

リクエストを破棄します。オプションで、`'error'` イベントを発生させ、`'close'` イベントを発生させます。これを呼び出すと、レスポンス内の残りのデータが破棄され、ソケットが破棄されます。

詳細については、[`writable.destroy()`](/ja/nodejs/api/stream#writabledestroyerror) を参照してください。

#### `request.destroyed` {#requestdestroyed}

**Added in: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.destroy()`](/ja/nodejs/api/http#requestdestroyerror) が呼び出された後、`true` になります。

詳細については、[`writable.destroyed`](/ja/nodejs/api/stream#writabledestroyed) を参照してください。

### `request.finished` {#requestfinished}

**Added in: v0.0.1**

**Deprecated since: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated。[`request.writableEnded`](/ja/nodejs/api/http#requestwritableended) を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.end()`](/ja/nodejs/api/http#requestenddata-encoding-callback) が呼び出された場合、`request.finished` プロパティは `true` になります。リクエストが [`http.get()`](/ja/nodejs/api/http#httpgetoptions-callback) 経由で開始された場合、`request.end()` が自動的に呼び出されます。

### `request.flushHeaders()` {#requestflushheaders}

**Added in: v1.6.0**

リクエストヘッダーをフラッシュします。

効率上の理由から、Node.js は通常、`request.end()` が呼び出されるか、最初のリクエストデータのチャンクが書き込まれるまで、リクエストヘッダーをバッファリングします。次に、リクエストヘッダーとデータを 1 つの TCP パケットにまとめようとします。

これは通常望ましいことですが（TCP ラウンドトリップを節約できます）、最初のデータが後で送信される場合は望ましくありません。`request.flushHeaders()` は最適化をバイパスし、リクエストをキックスタートします。


### `request.getHeader(name)` {#requestgetheadername}

**追加:** v1.6.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

リクエストのヘッダーを読み取ります。名前は大文字小文字を区別しません。戻り値の型は、[`request.setHeader()`](/ja/nodejs/api/http#requestsetheadername-value) に提供された引数によって異なります。

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' は 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' は数値型
const cookie = request.getHeader('Cookie');
// 'cookie' は string[] 型
```
### `request.getHeaderNames()` {#requestgetheadernames}

**追加:** v7.7.0

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在の送信ヘッダーの一意の名前を含む配列を返します。すべてのヘッダー名は小文字です。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**追加:** v7.7.0

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在の送信ヘッダーのシャローコピーを返します。シャローコピーが使用されているため、さまざまなヘッダー関連の http モジュールメソッドを別途呼び出すことなく、配列値を変更できます。返されるオブジェクトのキーはヘッダー名であり、値はそれぞれのヘッダー値です。すべてのヘッダー名は小文字です。

`request.getHeaders()` メソッドによって返されるオブジェクトは、JavaScript の `Object` から原型的に継承 *しません*。これは、`obj.toString()`、`obj.hasOwnProperty()` などの典型的な `Object` メソッドが定義されておらず、*機能しない* ことを意味します。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**追加:** v15.13.0, v14.17.0

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在の送信する生のヘッダーの一意な名前を含む配列を返します。ヘッダー名は、正確な大文字小文字の設定で返されます。

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**追加:** v7.7.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name` で識別されるヘッダーが現在、送信ヘッダーに設定されている場合は `true` を返します。ヘッダー名のマッチングは大文字小文字を区別しません。

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `2000`

最大レスポンスヘッダー数を制限します。0 に設定すると、制限は適用されません。

### `request.path` {#requestpath}

**追加:** v0.4.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストパス。

### `request.method` {#requestmethod}

**追加:** v0.1.97

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストメソッド。

### `request.host` {#requesthost}

**追加:** v14.5.0, v12.19.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストホスト。

### `request.protocol` {#requestprotocol}

**追加:** v14.5.0, v12.19.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストプロトコル。

### `request.removeHeader(name)` {#requestremoveheadername}

**追加:** v1.6.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ヘッダーオブジェクトに既に定義されているヘッダーを削除します。

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**追加:** v13.0.0, v12.16.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) リクエストが再利用されたソケットを通じて送信されたかどうか。

keep-alive が有効なエージェントを通じてリクエストを送信する場合、基になるソケットが再利用されることがあります。ただし、サーバーが都合の悪いタイミングで接続を閉じると、クライアントは 'ECONNRESET' エラーに遭遇する可能性があります。

::: code-group
```js [ESM]
import http from 'node:http';

// サーバーのデフォルトの keep-alive タイムアウトは 5 秒です
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // keep-alive エージェントの採用
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 何もしない
    });
  });
}, 5000); // 5 秒間隔でリクエストを送信するので、アイドルタイムアウトに当たりやすい
```

```js [CJS]
const http = require('node:http');

// サーバーのデフォルトの keep-alive タイムアウトは 5 秒です
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // keep-alive エージェントの採用
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 何もしない
    });
  });
}, 5000); // 5 秒間隔でリクエストを送信するので、アイドルタイムアウトに当たりやすい
```
:::

リクエストがソケットを再利用したかどうかをマークすることで、それに基づいて自動エラー再試行を実行できます。

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 再試行が必要かどうかを確認する
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 再試行が必要かどうかを確認する
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Added in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

headers オブジェクトの単一のヘッダー値を設定します。送信されるヘッダーにこのヘッダーが既に存在する場合、その値は置き換えられます。同じ名前で複数のヘッダーを送信するには、文字列の配列を使用します。文字列以外の値は変更されずに保存されます。したがって、[`request.getHeader()`](/ja/nodejs/api/http#requestgetheadername) は文字列以外の値を返す場合があります。ただし、文字列以外の値は、ネットワーク送信のために文字列に変換されます。

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
または

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
値が文字列の場合、`latin1` エンコーディング以外の文字が含まれていると例外がスローされます。

UTF-8 文字を値に渡す必要がある場合は、[RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt) 標準を使用して値をエンコードしてください。

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Added in: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ソケットがこのリクエストに割り当てられ、接続されると、[`socket.setNoDelay()`](/ja/nodejs/api/net#socketsetnodelaynodelay) が呼び出されます。

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Added in: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ソケットがこのリクエストに割り当てられ、接続されると、[`socket.setKeepAlive()`](/ja/nodejs/api/net#socketsetkeepaliveenable-initialdelay) が呼び出されます。


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | ソケットのタイムアウトは、ソケットが接続されたときにのみ一貫して設定されます。 |
| v0.5.9 | 追加: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リクエストがタイムアウトするまでのミリ秒数。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) タイムアウトが発生したときに呼び出されるオプションの関数。`'timeout'` イベントにバインドするのと同じです。
- 戻り値: [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

ソケットがこのリクエストに割り当てられ、接続されると、[`socket.setTimeout()`](/ja/nodejs/api/net#socketsettimeouttimeout-callback) が呼び出されます。

### `request.socket` {#requestsocket}

**追加: v0.3.0**

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

基になるソケットへの参照。 通常、ユーザーはこのプロパティにアクセスしたくないでしょう。 特に、プロトコルパーサーがソケットにアタッチする方法のため、ソケットは `'readable'` イベントを発行しません。

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

このプロパティは、ユーザーが[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)以外のソケットタイプを指定しない限り、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)クラス、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)のサブクラスのインスタンスであることが保証されています。


### `request.uncork()` {#requestuncork}

**Added in: v13.2.0, v12.16.0**

[`writable.uncork()`](/ja/nodejs/api/stream#writableuncork)を参照してください。

### `request.writableEnded` {#requestwritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.end()`](/ja/nodejs/api/http#requestenddata-encoding-callback) が呼び出された後、`true` になります。このプロパティは、データがフラッシュされたかどうかを示すものではありません。そのためには、代わりに [`request.writableFinished`](/ja/nodejs/api/http#requestwritablefinished) を使用してください。

### `request.writableFinished` {#requestwritablefinished}

**Added in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

すべてのデータが基盤となるシステムにフラッシュされた場合、[`'finish'`](/ja/nodejs/api/http#event-finish) イベントが発生する直前に `true` になります。

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | `chunk` パラメータが `Uint8Array` になりました。 |
| v0.1.29 | Added in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

本文のチャンクを送信します。このメソッドは複数回呼び出すことができます。`Content-Length` が設定されていない場合、データは自動的に HTTP チャンク転送エンコーディングでエンコードされ、サーバーはデータの終了時期を知ることができます。`Transfer-Encoding: chunked` ヘッダーが追加されます。リクエストの送信を完了するには、[`request.end()`](/ja/nodejs/api/http#requestenddata-encoding-callback) を呼び出す必要があります。

`encoding` 引数は省略可能で、`chunk` が文字列の場合にのみ適用されます。デフォルトは `'utf8'` です。

`callback` 引数は省略可能で、このデータのチャンクがフラッシュされたときに呼び出されます。ただし、チャンクが空でない場合に限ります。

データ全体がカーネルバッファに正常にフラッシュされた場合は `true` を返します。データの一部または全部がユーザーメモリにキューイングされた場合は `false` を返します。バッファが再び空になると `'drain'` が発生します。

`write` 関数が空の文字列またはバッファで呼び出された場合、何もせず、さらなる入力を待ちます。


## クラス: `http.Server` {#class-httpserver}

**追加: v0.1.17**

- 拡張: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

### イベント: `'checkContinue'` {#event-checkcontinue}

**追加: v0.3.0**

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

HTTP `Expect: 100-continue` を伴うリクエストを受信するたびに発生します。このイベントがリッスンされない場合、サーバーは必要に応じて自動的に `100 Continue` で応答します。

このイベントの処理には、クライアントがリクエスト本文の送信を継続する必要がある場合は [`response.writeContinue()`](/ja/nodejs/api/http#responsewritecontinue) を呼び出すか、クライアントがリクエスト本文の送信を継続しない場合は適切な HTTP 応答 (例: 400 Bad Request) を生成することが含まれます。

このイベントが発生して処理されると、[`'request'`](/ja/nodejs/api/http#event-request) イベントは発生しません。

### イベント: `'checkExpectation'` {#event-checkexpectation}

**追加: v5.5.0**

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

HTTP `Expect` ヘッダーを伴うリクエストを受信するたびに発生します。値が `100-continue` でない場合。このイベントがリッスンされない場合、サーバーは必要に応じて自動的に `417 Expectation Failed` で応答します。

このイベントが発生して処理されると、[`'request'`](/ja/nodejs/api/http#event-request) イベントは発生しません。

### イベント: `'clientError'` {#event-clienterror}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | HPE_HEADER_OVERFLOW エラーが発生した場合、デフォルトの動作は 431 Request Header Fields Too Large を返します。 |
| v9.4.0 | `rawPacket` は、解析されたばかりの現在のバッファーです。このバッファーを `'clientError'` イベントのエラーオブジェクトに追加することで、開発者は破損したパケットをログに記録できます。 |
| v6.0.0 | `'clientError'` のリスナーがアタッチされている場合、`socket` での `.destroy()` の呼び出しのデフォルトのアクションは実行されなくなります。 |
| v0.1.94 | 追加: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

クライアント接続が `'error'` イベントを発生させた場合、ここに転送されます。このイベントのリスナーは、基になるソケットを閉じる/破棄する責任があります。たとえば、接続を突然切断するのではなく、カスタム HTTP 応答を使用してソケットをより優雅に閉じたい場合があります。リスナーが終了する前に、ソケット**を閉じるか破棄する必要があります**。

このイベントは、ユーザーが[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)以外のソケットタイプを指定しない限り、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)のサブクラスである[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)クラスのインスタンスに渡されることが保証されます。

デフォルトの動作は、HTTP '400 Bad Request'、または[`HPE_HEADER_OVERFLOW`](/ja/nodejs/api/errors#hpe_header_overflow)エラーの場合は HTTP '431 Request Header Fields Too Large' でソケットを閉じようとすることです。ソケットが書き込み可能でないか、現在のアタッチされた[`http.ServerResponse`](/ja/nodejs/api/http#class-httpserverresponse)のヘッダーが送信されている場合、すぐに破棄されます。

`socket` は、エラーの発生元の [`net.Socket`](/ja/nodejs/api/net#class-netsocket) オブジェクトです。

::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

`'clientError'` イベントが発生した場合、`request` オブジェクトまたは `response` オブジェクトがないため、応答ヘッダーやペイロードを含むすべての HTTP 応答は、`socket` オブジェクトに直接書き込む *必要があります*。応答が適切にフォーマットされた HTTP 応答メッセージであることを確認するように注意する必要があります。

`err` は、2つの追加の列を持つ `Error` のインスタンスです。

- `bytesParsed`: Node.js が正しく解析した可能性のあるリクエストパケットのバイト数。
- `rawPacket`: 現在のリクエストの生のパケット。

場合によっては、`ECONNRESET` エラーの場合のように、クライアントがすでに応答を受信しているか、ソケットがすでに破棄されていることがあります。ソケットにデータを送信する前に、ソケットがまだ書き込み可能かどうかを確認することをお勧めします。

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### イベント: `'close'` {#event-close_1}

**追加: v0.1.4**

サーバーが閉じるときに発生します。

### イベント: `'connect'` {#event-connect_1}

**追加: v0.7.0**

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage) HTTPリクエストの引数。[`'request'`](/ja/nodejs/api/http#event-request)イベントの場合と同様
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) サーバーとクライアント間のネットワークソケット
- `head` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) トンネリングストリームの最初のパケット（空の場合があります）

クライアントがHTTP `CONNECT`メソッドを要求するたびに発生します。このイベントがリッスンされない場合、`CONNECT`メソッドを要求するクライアントの接続は閉じられます。

このイベントは、ユーザーが[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)以外のソケットタイプを指定しない限り、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)のサブクラスである[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)クラスのインスタンスに渡されることが保証されています。

このイベントが発生した後、リクエストのソケットには`'data'`イベントリスナーがありません。つまり、そのソケットでサーバーに送信されたデータを処理するには、バインドする必要があります。

### イベント: `'connection'` {#event-connection}

**追加: v0.1.0**

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このイベントは、新しいTCPストリームが確立されたときに発生します。`socket`は通常、[`net.Socket`](/ja/nodejs/api/net#class-netsocket)型のオブジェクトです。通常、ユーザーはこのイベントにアクセスしたくないでしょう。特に、ソケットにプロトコルパーサーがどのようにアタッチされるかにより、ソケットは`'readable'`イベントを発生させません。 `socket`は`request.socket`でもアクセスできます。

このイベントは、HTTPサーバーに接続を注入するために、ユーザーが明示的に発生させることもできます。その場合、任意の[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームを渡すことができます。

ここで`socket.setTimeout()`が呼び出された場合、ソケットがリクエストを処理すると、タイムアウトは`server.keepAliveTimeout`に置き換えられます（`server.keepAliveTimeout`がゼロでない場合）。

このイベントは、ユーザーが[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)以外のソケットタイプを指定しない限り、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)のサブクラスである[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)クラスのインスタンスに渡されることが保証されています。


### イベント: `'dropRequest'` {#event-droprequest}

**追加:** v18.7.0, v16.17.0

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage) HTTPリクエストの引数。[`'request'`](/ja/nodejs/api/http#event-request) イベントと同様です。
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) サーバーとクライアント間のネットワークソケット

ソケット上のリクエスト数が `server.maxRequestsPerSocket` の閾値に達すると、サーバーは新しいリクエストをドロップし、代わりに `'dropRequest'` イベントを発行し、クライアントに `503` を送信します。

### イベント: `'request'` {#event-request}

**追加:** v0.1.0

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

リクエストがあるたびに発行されます。接続ごとに複数のリクエストが存在する場合があります（HTTP Keep-Alive接続の場合）。

### イベント: `'upgrade'` {#event-upgrade_1}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | クライアントがUpgradeヘッダーを送信した場合でも、このイベントをリッスンしないことによってソケットが破棄されなくなりました。 |
| v0.1.94 | 追加: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage) HTTPリクエストの引数。[`'request'`](/ja/nodejs/api/http#event-request) イベントと同様です。
- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) サーバーとクライアント間のネットワークソケット
- `head` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) アップグレードされたストリームの最初のパケット（空の場合があります）

クライアントがHTTPアップグレードを要求するたびに発行されます。このイベントのリスンはオプションであり、クライアントはプロトコルの変更を主張できません。

このイベントが発行された後、リクエストのソケットには `'data'` イベントリスナーがありません。つまり、そのソケットでサーバーに送信されるデータを処理するにはバインドする必要があります。

ユーザーが[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)以外のソケットタイプを指定しない限り、このイベントには[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)クラス（[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)のサブクラス）のインスタンスが渡されることが保証されています。


### `server.close([callback])` {#serverclosecallback}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | メソッドは、戻る前にアイドル状態の接続を閉じます。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

サーバーが新しい接続を受け入れるのを停止し、リクエストを送信していないか、レスポンスを待機していない、このサーバーに接続されているすべての接続を閉じます。 [`net.Server.close()`](/ja/nodejs/api/net#serverclosecallback) を参照してください。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒後にサーバーを閉じます
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Added in: v18.2.0**

アクティブな接続を含め、このサーバーに接続されているすべての確立された HTTP(S) 接続を閉じます。これには、リクエストを送信しているか、レスポンスを待機している接続も含まれます。 これは、WebSocket や HTTP/2 など、別のプロトコルにアップグレードされたソケットを破棄*しません*。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒後にサーバーを閉じます
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // すべての接続を閉じ、サーバーが正常に閉じるようにします
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Added in: v18.2.0**

リクエストを送信していないか、レスポンスを待機していない、このサーバーに接続されているすべての接続を閉じます。

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10 秒後にサーバーを閉じます
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // keep-alive接続など、アイドル状態の接続を閉じます。 残りのアクティブな接続が終了すると、サーバーは閉じます
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.4.0, v18.14.0 | デフォルト値が 60000 (60 秒) または `requestTimeout` の小さい方に設定されるようになりました。 |
| v11.3.0, v10.14.0 | 追加: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** [`server.requestTimeout`](/ja/nodejs/api/http#serverrequesttimeout) または `60000` の小さい方。

パーサーが HTTP ヘッダーを完全に受信するまで待機する時間を制限します。

タイムアウトが切れると、サーバーはリクエストリスナーにリクエストを転送せずにステータス 408 で応答し、接続を閉じます。

サーバーがリバースプロキシなしでデプロイされている場合に、潜在的なサービス拒否攻撃から保護するには、ゼロ以外の値 (例: 120 秒) に設定する必要があります。

### `server.listen()` {#serverlisten}

HTTP サーバーを起動し、接続をリッスンします。このメソッドは、[`net.Server`](/ja/nodejs/api/net#class-netserver) の [`server.listen()`](/ja/nodejs/api/net#serverlisten) と同じです。

### `server.listening` {#serverlistening}

**追加: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) サーバーが接続をリッスンしているかどうかを示します。

### `server.maxHeadersCount` {#servermaxheaderscount}

**追加: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `2000`

受信ヘッダーの最大数を制限します。0 に設定すると、制限は適用されません。

### `server.requestTimeout` {#serverrequesttimeout}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | デフォルトのリクエストタイムアウトが無期限から 300 秒 (5 分) に変更されました。 |
| v14.11.0 | 追加: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `300000`

クライアントからリクエスト全体を受信するまでのタイムアウト値をミリ秒単位で設定します。

タイムアウトが切れると、サーバーはリクエストリスナーにリクエストを転送せずにステータス 408 で応答し、接続を閉じます。

サーバーがリバースプロキシなしでデプロイされている場合に、潜在的なサービス拒否攻撃から保護するには、ゼロ以外の値 (例: 120 秒) に設定する必要があります。


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v0.9.12 | 追加: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** 0 (タイムアウトなし)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.Server\>](/ja/nodejs/api/http#class-httpserver)

ソケットのタイムアウト値を設定し、タイムアウトが発生した場合、ソケットを引数として渡して、Server オブジェクトで `'timeout'` イベントを発行します。

Server オブジェクトに `'timeout'` イベントリスナーがある場合、タイムアウトしたソケットを引数として呼び出されます。

デフォルトでは、Server はソケットをタイムアウトさせません。ただし、コールバックが Server の `'timeout'` イベントに割り当てられている場合、タイムアウトは明示的に処理する必要があります。

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**追加: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ソケットごとのリクエスト数。 **デフォルト:** 0 (制限なし)

keep-alive 接続を閉じる前にソケットが処理できる最大リクエスト数。

値 `0` は制限を無効にします。

制限に達すると、`Connection` ヘッダーの値が `close` に設定されますが、実際には接続は閉じられません。制限に達した後に送信された後続のリクエストは、レスポンスとして `503 Service Unavailable` を受け取ります。

### `server.timeout` {#servertimeout}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v0.9.12 | 追加: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タイムアウト（ミリ秒単位）。 **デフォルト:** 0 (タイムアウトなし)

ソケットがタイムアウトしたと見なされるまでの非アクティブなミリ秒数。

値 `0` は、受信接続に対するタイムアウト動作を無効にします。

ソケットのタイムアウトロジックは接続時に設定されるため、この値を変更しても、サーバーへの新しい接続にのみ影響し、既存の接続には影響しません。


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**追加:** v8.0.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タイムアウト（ミリ秒単位）。 **デフォルト:** `5000` (5 秒)。

サーバーが最後のレスポンスの書き込みを終えた後、ソケットが破棄されるまでに追加の受信データを待つ必要がある、非アクティブな状態のミリ秒数。 キープアライブタイムアウトが発生する前にサーバーが新しいデータを受信した場合、通常の非アクティブタイムアウト（つまり、[`server.timeout`](/ja/nodejs/api/http#servertimeout)）がリセットされます。

値 `0` を指定すると、受信接続でのキープアライブタイムアウト動作が無効になります。 値 `0` を指定すると、HTTPサーバーはキープアライブタイムアウトがなかったNode.jsの8.0.0より前のバージョンと同様に動作します。

ソケットタイムアウトロジックは接続時に設定されるため、この値を変更しても、サーバーへの新しい接続にのみ影響し、既存の接続には影響しません。

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**追加:** v20.4.0

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

[`server.close()`](/ja/nodejs/api/http#serverclosecallback) を呼び出し、サーバーが閉じたときに履行されるpromiseを返します。

## クラス: `http.ServerResponse` {#class-httpserverresponse}

**追加:** v0.1.17

- 拡張: [\<http.OutgoingMessage\>](/ja/nodejs/api/http#class-httpoutgoingmessage)

このオブジェクトは、ユーザーではなく、HTTPサーバーによって内部的に作成されます。 これは、[`'request'`](/ja/nodejs/api/http#event-request) イベントの2番目のパラメータとして渡されます。

### イベント: `'close'` {#event-close_2}

**追加:** v0.6.7

レスポンスが完了したか、またはその基になる接続が（レスポンスの完了前に）早期に終了したことを示します。

### イベント: `'finish'` {#event-finish_1}

**追加:** v0.3.6

レスポンスが送信されたときに発生します。 より具体的には、このイベントは、レスポンスヘッダーと本体の最後のセグメントが、ネットワーク経由で送信するためにオペレーティングシステムに引き渡されたときに発生します。 クライアントがまだ何かを受信したことを意味するものではありません。


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Added in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

このメソッドは、HTTPトレーラーヘッダー（メッセージの最後にあるヘッダー）をレスポンスに追加します。

トレーラーは、レスポンスにチャンクエンコーディングが使用されている場合に**のみ**送信されます。そうでない場合（例えば、リクエストがHTTP/1.0の場合）、トレーラーは黙って破棄されます。

HTTPでは、トレーラーを送信するために、値にヘッダーフィールドのリストを含む`Trailer`ヘッダーを送信する必要があります。例：

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror)がスローされます。

### `response.connection` {#responseconnection}

**Added in: v0.3.0**

**Deprecated since: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。[`response.socket`](/ja/nodejs/api/http#responsesocket)を使用してください。
:::

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

[`response.socket`](/ja/nodejs/api/http#responsesocket)を参照してください。

### `response.cork()` {#responsecork}

**Added in: v13.2.0, v12.16.0**

[`writable.cork()`](/ja/nodejs/api/stream#writablecork)を参照してください。

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `data` パラメータに `Uint8Array` が使用できるようになりました。 |
| v10.0.0 | このメソッドは `ServerResponse` への参照を返すようになりました。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

このメソッドは、すべてのレスポンスヘッダーとボディが送信されたことをサーバーに通知します。サーバーはこのメッセージが完了したと見なす必要があります。このメソッド、`response.end()`は、各レスポンスで呼び出す**必要**があります。

`data`が指定された場合、[`response.write(data, encoding)`](/ja/nodejs/api/http#responsewritechunk-encoding-callback)を呼び出し、その後に`response.end(callback)`を呼び出すのと同様の効果があります。

`callback`が指定された場合、レスポンスストリームが終了したときに呼び出されます。


### `response.finished` {#responsefinished}

**Added in: v0.0.2**

**Deprecated since: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated. [`response.writableEnded`](/ja/nodejs/api/http#responsewritableended) を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`response.finished` プロパティは、[`response.end()`](/ja/nodejs/api/http#responseenddata-encoding-callback) が呼び出された場合に `true` になります。

### `response.flushHeaders()` {#responseflushheaders}

**Added in: v1.6.0**

レスポンスヘッダーをフラッシュします。以下も参照してください: [`request.flushHeaders()`](/ja/nodejs/api/http#requestflushheaders)。

### `response.getHeader(name)` {#responsegetheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

すでにキューに入れられているが、クライアントに送信されていないヘッダーを読み取ります。名前は大文字と小文字を区別しません。戻り値の型は、[`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value) に指定された引数によって異なります。

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Added in: v7.7.0**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在送信中のヘッダーの一意な名前を含む配列を返します。すべてのヘッダー名は小文字です。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Added in: v7.7.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在の送信ヘッダーのシャローコピーを返します。シャローコピーが使用されるため、様々なヘッダー関連の http モジュールメソッドへの追加の呼び出しなしに、配列の値を変更できます。返されるオブジェクトのキーはヘッダー名であり、値はそれぞれのヘッダー値です。すべてのヘッダー名は小文字です。

`response.getHeaders()` メソッドによって返されるオブジェクトは、JavaScript の `Object` からプロトタイプ的に継承 *しません*。これは、`obj.toString()`、`obj.hasOwnProperty()` などの典型的な `Object` メソッドが定義されておらず、*機能しない* ことを意味します。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Added in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name` で識別されるヘッダーが現在の送信ヘッダーに設定されている場合は `true` を返します。ヘッダー名のマッチングでは大文字と小文字は区別されません。

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Added in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Boolean (読み取り専用)。ヘッダーが送信された場合は true、そうでない場合は false。

### `response.removeHeader(name)` {#responseremoveheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

暗黙的な送信のためにキューに入れられたヘッダーを削除します。

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Added in: v15.7.0**

- [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)

元の HTTP `request` オブジェクトへの参照。


### `response.sendDate` {#responsesenddate}

**追加:** v0.7.5

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true の場合、Date ヘッダーがヘッダーにまだ存在しない場合、自動的に生成され、レスポンスで送信されます。 デフォルトは true です。

これはテストでのみ無効にする必要があります。 HTTP ではレスポンスに Date ヘッダーが必要です。

### `response.setHeader(name, value)` {#responsesetheadername-value}

**追加:** v0.4.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

応答オブジェクトを返します。

暗黙的なヘッダーに対して単一のヘッダー値を設定します。 このヘッダーが送信されるヘッダーに既に存在する場合、その値は置き換えられます。 同じ名前で複数のヘッダーを送信するには、ここで文字列の配列を使用します。 文字列以外の値は、変更せずに保存されます。 したがって、[`response.getHeader()`](/ja/nodejs/api/http#responsegetheadername) は文字列以外の値を返す場合があります。 ただし、文字列以外の値はネットワーク送信のために文字列に変換されます。 呼び出し元がメソッドチェーンを有効にするために、同じ応答オブジェクトが返されます。

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
または

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

ヘッダーが [`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value) で設定されている場合、それらは [`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーとマージされ、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーが優先されます。

```js [ESM]
// content-type = text/plain を返します
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) メソッドが呼び出され、このメソッドが呼び出されていない場合、内部的にキャッシュせずに、指定されたヘッダー値をネットワークチャネルに直接書き込みます。ヘッダーの [`response.getHeader()`](/ja/nodejs/api/http#responsegetheadername) は期待される結果を生成しません。 将来の取得と変更の可能性のあるヘッダーの段階的な設定が必要な場合は、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) の代わりに [`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value) を使用してください。


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Added in: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

Socket のタイムアウト値を `msecs` に設定します。コールバックが提供された場合、レスポンスオブジェクトの `'timeout'` イベントのリスナーとして追加されます。

リクエスト、レスポンス、またはサーバーに `'timeout'` リスナーが追加されていない場合、タイムアウトするとソケットは破棄されます。ハンドラーがリクエスト、レスポンス、またはサーバーの `'timeout'` イベントに割り当てられている場合、タイムアウトしたソケットは明示的に処理する必要があります。

### `response.socket` {#responsesocket}

**Added in: v0.3.0**

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

基になるソケットへの参照です。通常、ユーザーはこのプロパティにアクセスする必要はありません。特に、プロトコルパーサーがソケットにアタッチする方法により、ソケットは `'readable'` イベントを発行しません。`response.end()` の後、プロパティは null になります。

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

このプロパティは、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラス（[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラス）のインスタンスであることが保証されています。ただし、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定した場合を除きます。

### `response.statusCode` {#responsestatuscode}

**Added in: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `200`

暗黙的なヘッダーを使用している場合 ([`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) を明示的に呼び出さない場合)、このプロパティは、ヘッダーがフラッシュされるときにクライアントに送信されるステータスコードを制御します。

```js [ESM]
response.statusCode = 404;
```
レスポンスヘッダーがクライアントに送信された後、このプロパティは送信されたステータスコードを示します。


### `response.statusMessage` {#responsestatusmessage}

**Added in: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

暗黙的なヘッダー（明示的に[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)を呼び出さない）を使用する場合、このプロパティは、ヘッダーがフラッシュされるときにクライアントに送信されるステータスメッセージを制御します。これを`undefined`のままにすると、ステータスコードの標準メッセージが使用されます。

```js [ESM]
response.statusMessage = 'Not found';
```
レスポンスヘッダーがクライアントに送信された後、このプロパティは送信されたステータスメッセージを示します。

### `response.strictContentLength` {#responsestrictcontentlength}

**Added in: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`

`true`に設定すると、Node.jsは`Content-Length`ヘッダーの値と本文のサイズ（バイト単位）が等しいかどうかを確認します。`Content-Length`ヘッダーの値が一致しない場合、`Error`がスローされ、`code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ja/nodejs/api/errors#err_http_content_length_mismatch)で識別されます。

### `response.uncork()` {#responseuncork}

**Added in: v13.2.0, v12.16.0**

[`writable.uncork()`](/ja/nodejs/api/stream#writableuncork)を参照してください。

### `response.writableEnded` {#responsewritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`response.end()`](/ja/nodejs/api/http#responseenddata-encoding-callback)が呼び出された後、`true`になります。このプロパティはデータがフラッシュされたかどうかを示すものではありません。代わりに、[`response.writableFinished`](/ja/nodejs/api/http#responsewritablefinished)を使用してください。

### `response.writableFinished` {#responsewritablefinished}

**Added in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

すべてのデータが基盤となるシステムにフラッシュされた場合、[`'finish'`](/ja/nodejs/api/http#event-finish)イベントが発行される直前に`true`になります。

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `chunk`パラメータは`Uint8Array`にすることができます。 |
| v0.1.29 | Added in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このメソッドが呼び出され、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)が呼び出されていない場合、暗黙的なヘッダーモードに切り替わり、暗黙的なヘッダーをフラッシュします。

これは、レスポンスボディのチャンクを送信します。このメソッドは、ボディの連続した部分を提供するために複数回呼び出すことができます。

`createServer`で`rejectNonStandardBodyWrites`がtrueに設定されている場合、リクエストメソッドまたはレスポンスステータスがコンテンツをサポートしていない場合、本文への書き込みは許可されません。HEADリクエストまたは`204`または`304`レスポンスの一部として本文に書き込もうとすると、コード`ERR_HTTP_BODY_NOT_ALLOWED`を持つ同期的な`Error`がスローされます。

`chunk`は、文字列またはバッファーにすることができます。`chunk`が文字列の場合、2番目のパラメータは、それをバイトストリームにエンコードする方法を指定します。このデータのチャンクがフラッシュされると、`callback`が呼び出されます。

これは生のHTTPボディであり、使用される可能性のある高レベルのマルチパートボディエンコーディングとは関係ありません。

[`response.write()`](/ja/nodejs/api/http#responsewritechunk-encoding-callback)が最初に呼び出されると、バッファリングされたヘッダー情報とボディの最初のチャンクがクライアントに送信されます。2回目に[`response.write()`](/ja/nodejs/api/http#responsewritechunk-encoding-callback)が呼び出されると、Node.jsはデータがストリーミングされると見なし、新しいデータを個別に送信します。つまり、レスポンスはボディの最初のチャンクまでバッファリングされます。

データ全体がカーネルバッファーに正常にフラッシュされた場合、`true`を返します。データの一部またはすべてがユーザーメモリにキューイングされた場合、`false`を返します。バッファーが再び空になると、`'drain'`が発行されます。


### `response.writeContinue()` {#responsewritecontinue}

**Added in: v0.3.0**

リクエストボディを送信すべきであることを示すHTTP/1.1 100 Continueメッセージをクライアントに送信します。`Server`の[`'checkContinue'`](/ja/nodejs/api/http#event-checkcontinue)イベントを参照してください。

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.11.0 | ヒントをオブジェクトとして渡せるようになりました。 |
| v18.11.0 | Added in: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

リンクされたリソースをユーザーエージェントがプリロード/プリコネクトできることを示すLinkヘッダーとともに、HTTP/1.1 103 Early Hintsメッセージをクライアントに送信します。`hints`は、Early Hintsメッセージとともに送信されるヘッダーの値を含むオブジェクトです。オプションの`callback`引数は、レスポンスメッセージが書き込まれたときに呼び出されます。

**例**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.14.0 | ヘッダーを配列として渡せるようになりました。 |
| v11.10.0, v10.17.0 | `writeHead()`から`this`を返すことで、`end()`との連鎖を可能にしました。 |
| v5.11.0, v4.4.5 | `statusCode`が`[100, 999]`の範囲の数値でない場合、`RangeError`がスローされます。 |
| v0.1.30 | Added in: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 戻り値: [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

リクエストに応答ヘッダーを送信します。ステータスコードは、`404`のような3桁のHTTPステータスコードです。最後の引数`headers`は、応答ヘッダーです。オプションで、人間が読める`statusMessage`を2番目の引数として指定できます。

`headers`は、キーと値が同じリストにある`Array`にすることができます。これはタプルのリスト*ではありません*。したがって、偶数番目のオフセットはキーの値であり、奇数番目のオフセットは関連付けられた値です。配列は`request.rawHeaders`と同じ形式です。

`ServerResponse`への参照を返します。これにより、呼び出しをチェーンできます。

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
このメソッドは、メッセージに対して1回だけ呼び出す必要があり、[`response.end()`](/ja/nodejs/api/http#responseenddata-encoding-callback)が呼び出される前に呼び出す必要があります。

[`response.write()`](/ja/nodejs/api/http#responsewritechunk-encoding-callback)または[`response.end()`](/ja/nodejs/api/http#responseenddata-encoding-callback)がこれを呼び出す前に呼び出された場合、暗黙的/可変ヘッダーが計算され、この関数が呼び出されます。

ヘッダーが[`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value)で設定されている場合、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)に渡されるヘッダーが優先され、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)に渡されるヘッダーとマージされます。

このメソッドが呼び出され、[`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value)が呼び出されていない場合、内部的にキャッシュせずに、指定されたヘッダー値をネットワークチャネルに直接書き込みます。また、ヘッダーの[`response.getHeader()`](/ja/nodejs/api/http#responsegetheadername)は期待される結果を生成しません。潜在的な将来の取得と変更によるヘッダーの段階的な設定が必要な場合は、代わりに[`response.setHeader()`](/ja/nodejs/api/http#responsesetheadername-value)を使用してください。

```js [ESM]
// Content-type = text/plainを返します
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length`は、文字数ではなくバイト単位で読み取られます。[`Buffer.byteLength()`](/ja/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)を使用して、本文の長さをバイト単位で判別します。Node.jsは、`Content-Length`と送信された本文の長さが等しいかどうかを確認します。

無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`Error`][]がスローされます。


### `response.writeProcessing()` {#responsewriteprocessing}

**Added in: v10.0.0**

HTTP/1.1 102 Processingメッセージをクライアントに送信し、リクエストボディを送信する必要があることを示します。

## Class: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.5.0 | 受信データが消費されると、`destroyed` の値が `true` を返します。 |
| v13.1.0, v12.16.0 | `readableHighWaterMark` の値がソケットの値を反映します。 |
| v0.1.17 | Added in: v0.1.17 |
:::

- 拡張: [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

`IncomingMessage` オブジェクトは、[`http.Server`](/ja/nodejs/api/http#class-httpserver) または [`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest) によって作成され、[`'request'`](/ja/nodejs/api/http#event-request) および [`'response'`](/ja/nodejs/api/http#event-response) イベントのそれぞれに最初の引数として渡されます。 レスポンスステータス、ヘッダー、およびデータにアクセスするために使用できます。

[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラスであるその `socket` の値とは異なり、`IncomingMessage` 自体は [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) を拡張し、着信する HTTP ヘッダーとペイロードを解析および発行するために個別に作成されます。これは、基になるソケットがキープアライブの場合に複数回再利用される可能性があるためです。

### イベント: `'aborted'` {#event-aborted}

**Added in: v0.3.8**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。代わりに `'close'` イベントをリッスンしてください。
:::

リクエストが中断されたときに発行されます。

### イベント: `'close'` {#event-close_3}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | リクエストが完了したときに、基になるソケットが閉じられたときではなく、close イベントが発行されるようになりました。 |
| v0.4.2 | Added in: v0.4.2 |
:::

リクエストが完了したときに発行されます。

### `message.aborted` {#messageaborted}

**Added in: v10.1.0**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。[\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) から `message.destroyed` を確認してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

リクエストが中断された場合、`message.aborted` プロパティは `true` になります。


### `message.complete` {#messagecomplete}

**Added in: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`message.complete` プロパティは、HTTPメッセージが完全に受信され、正常に解析された場合に `true` になります。

このプロパティは、クライアントまたはサーバーが接続を終了する前にメッセージを完全に送信したかどうかを判断する手段として特に役立ちます。

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```
### `message.connection` {#messageconnection}

**Added in: v0.1.90**

**Deprecated since: v16.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated. [`message.socket`](/ja/nodejs/api/http#messagesocket) を使用してください。
:::

[`message.socket`](/ja/nodejs/api/http#messagesocket) のエイリアスです。

### `message.destroy([error])` {#messagedestroyerror}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.5.0, v12.19.0 | その関数は、他の Readable ストリームとの整合性のために `this` を返します。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`IncomingMessage` を受信したソケットで `destroy()` を呼び出します。`error` が提供されている場合、`'error'` イベントがソケット上で発行され、`error` がイベントのリスナーへの引数として渡されます。

### `message.headers` {#messageheaders}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.5.0, v18.14.0 | `http.request()` および `http.createServer()` 関数内の `joinDuplicateHeaders` オプションを使用すると、重複するヘッダーが破棄されず、RFC 9110 セクション 5.3 に従って、コンマ区切り文字を使用して結合されるようになります。 |
| v15.1.0 | `message.headers` はプロトタイプのアクセサープロパティを使用して遅延計算されるようになり、列挙できなくなりました。 |
| v0.1.5 | Added in: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

リクエスト/レスポンスヘッダーオブジェクト。

ヘッダー名と値のキーと値のペア。 ヘッダー名は小文字です。

```js [ESM]
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
生のヘッダーの重複は、ヘッダー名に応じて、次の方法で処理されます。

- `age`、`authorization`、`content-length`、`content-type`、`etag`、`expires`、`from`、`host`、`if-modified-since`、`if-unmodified-since`、`last-modified`、`location`、`max-forwards`、`proxy-authorization`、`referer`、`retry-after`、`server`、または `user-agent` の重複は破棄されます。 上記のヘッダーの重複した値を結合できるようにするには、[`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) および [`http.createServer()`](/ja/nodejs/api/http#httpcreateserveroptions-requestlistener) で `joinDuplicateHeaders` オプションを使用します。 詳細については、RFC 9110 セクション 5.3 を参照してください。
- `set-cookie` は常に配列です。 重複は配列に追加されます。
- 重複する `cookie` ヘッダーの場合、値は `; ` で結合されます。
- 他のすべてのヘッダーの場合、値は `, ` で結合されます。


### `message.headersDistinct` {#messageheadersdistinct}

**Added in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`message.headers`](/ja/nodejs/api/http#messageheaders) と似ていますが、結合ロジックがなく、値は常に文字列の配列です。ヘッダーが1回だけ受信された場合でも同様です。

```js [ESM]
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Added in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サーバーリクエストの場合、クライアントによって送信されたHTTPバージョンです。クライアントレスポンスの場合、接続されたサーバーのHTTPバージョンです。おそらく `'1.1'` または `'1.0'` です。

また、`message.httpVersionMajor` は最初の整数で、`message.httpVersionMinor` は2番目の整数です。

### `message.method` {#messagemethod}

**Added in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpserver"><code>http.Server</code></a> から取得したリクエストに対してのみ有効です。**

リクエストメソッドを文字列として表します。読み取り専用です。例： `'GET'`, `'DELETE'`。

### `message.rawHeaders` {#messagerawheaders}

**Added in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生のリクエスト/レスポンスヘッダーのリストは、受信したとおりに正確に記述されています。

キーと値は同じリスト内にあります。タプルのリストでは*ありません*。したがって、偶数番号のオフセットはキーの値であり、奇数番号のオフセットは関連する値です。

ヘッダー名は小文字に変換されず、重複はマージされません。

```js [ESM]
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```
### `message.rawTrailers` {#messagerawtrailers}

**Added in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生のリクエスト/レスポンストレーラーのキーと値は、受信したとおりに正確に記述されています。`'end'` イベントでのみ入力されます。


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Added in: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)

`message.socket.setTimeout(msecs, callback)` を呼び出します。

### `message.socket` {#messagesocket}

**Added in: v0.3.0**

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

コネクションに関連付けられた [`net.Socket`](/ja/nodejs/api/net#class-netsocket) オブジェクト。

HTTPS サポートでは、クライアントの認証詳細を取得するために [`request.socket.getPeerCertificate()`](/ja/nodejs/api/tls#tlssocketgetpeercertificatedetailed) を使用してください。

このプロパティは、ユーザーが [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) 以外のソケットタイプを指定したり、内部的に null にしたりしない限り、[\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) のサブクラスである [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) クラスのインスタンスであることが保証されています。

### `message.statusCode` {#messagestatuscode}

**Added in: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**<a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> から取得したレスポンスでのみ有効です。**

3 桁の HTTP レスポンスステータスコード。例: `404`。

### `message.statusMessage` {#messagestatusmessage}

**Added in: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> から取得したレスポンスでのみ有効です。**

HTTP レスポンスステータスメッセージ（理由句）。例: `OK` または `Internal Server Error`。

### `message.trailers` {#messagetrailers}

**Added in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

リクエスト/レスポンスのトレーラーオブジェクト。 `'end'` イベントでのみ設定されます。

### `message.trailersDistinct` {#messagetrailersdistinct}

**Added in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`message.trailers`](/ja/nodejs/api/http#messagetrailers) と似ていますが、結合ロジックはなく、値は常に文字列の配列になります。これは、一度だけ受信したヘッダーでも同様です。 `'end'` イベントでのみ設定されます。


### `message.url` {#messageurl}

**Added in: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpserver"><code>http.Server</code></a> から取得したリクエストでのみ有効です。**

リクエストの URL 文字列。これには、実際の HTTP リクエストに存在する URL のみが含まれます。次のリクエストを例にとります。

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
URL をそのパーツに解析するには:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
`request.url` が `'/status?name=ryan'` で、`process.env.HOST` が未定義の場合:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
`process.env.HOST` をサーバーのホスト名に設定するか、この部分を完全に置き換えることを検討してください。 `req.headers.host` を使用する場合は、クライアントがカスタム `Host` ヘッダーを指定する可能性があるため、適切な検証が使用されていることを確認してください。

## Class: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Added in: v0.1.17**

- 拡張: [\<Stream\>](/ja/nodejs/api/stream#stream)

このクラスは、[`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest) と [`http.ServerResponse`](/ja/nodejs/api/http#class-httpserverresponse) の親クラスとして機能します。これは、HTTP トランザクションの参加者の視点から見た抽象的なアウトゴーイングメッセージです。

### Event: `'drain'` {#event-drain}

**Added in: v0.3.6**

メッセージのバッファが再び空いたときに発生します。

### Event: `'finish'` {#event-finish_2}

**Added in: v0.1.17**

送信が正常に完了したときに発生します。

### Event: `'prefinish'` {#event-prefinish}

**Added in: v0.11.6**

`outgoingMessage.end()` が呼び出された後に発生します。イベントが発生すると、すべてのデータが処理されますが、必ずしも完全にフラッシュされるとは限りません。


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Added in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

HTTPトレーラー（メッセージの最後にあるヘッダー）をメッセージに追加します。

トレーラーは、メッセージがチャンクエンコードされている場合に**のみ**出力されます。そうでない場合、トレーラーは暗黙的に破棄されます。

HTTPでは、トレーラーを出力するために、`Trailer`ヘッダーを送信する必要があります。このヘッダーの値には、ヘッダーフィールド名のリストが含まれます。例：

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
無効な文字を含むヘッダーフィールド名または値を設定しようとすると、`TypeError`がスローされます。

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Added in: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヘッダー名
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヘッダー値
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

単一のヘッダー値をヘッダーオブジェクトに追加します。

値が配列の場合、これはこのメソッドを複数回呼び出すのと同じです。

ヘッダーに以前の値がない場合、これは[`outgoingMessage.setHeader(name, value)`](/ja/nodejs/api/http#outgoingmessagesetheadername-value)を呼び出すのと同じです。

クライアントリクエストまたはサーバーが作成されたときの`options.uniqueHeaders`の値に応じて、ヘッダーが複数回送信されるか、`; `を使用して値を結合して1回だけ送信されます。

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Added in: v0.3.0**

**Deprecated since: v15.12.0, v14.17.1**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに[`outgoingMessage.socket`](/ja/nodejs/api/http#outgoingmessagesocket)を使用してください。
:::

[`outgoingMessage.socket`](/ja/nodejs/api/http#outgoingmessagesocket)のエイリアス。


### `outgoingMessage.cork()` {#outgoingmessagecork}

**追加:** v13.2.0, v12.16.0

[`writable.cork()`](/ja/nodejs/api/stream#writablecork) を参照してください。

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**追加:** v0.3.0

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 省略可能。`error` イベントで発生するエラー。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

メッセージを破棄します。ソケットがメッセージに関連付けられ、接続されると、そのソケットも破棄されます。

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | `chunk` パラメーターは `Uint8Array` になりました。 |
| v0.11.6 | `callback` 引数を追加。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 省略可能、**デフォルト**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 省略可能
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

送信メッセージを終了します。本文の一部が送信されていない場合は、それらを基盤となるシステムにフラッシュします。メッセージがチャンク化されている場合は、終端チャンク `0\r\n\r\n` を送信し、トレーラー (存在する場合) を送信します。

`chunk` が指定されている場合、`outgoingMessage.write(chunk, encoding)` を呼び出し、その後に `outgoingMessage.end(callback)` を呼び出すのと同じです。

`callback` が指定されている場合、メッセージが終了したときに呼び出されます ( `'finish'` イベントのリスナーと同等)。

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**追加:** v1.6.0

メッセージヘッダーをフラッシュします。

効率上の理由から、Node.jsは通常、`outgoingMessage.end()`が呼び出されるか、メッセージデータの最初のチャンクが書き込まれるまで、メッセージヘッダーをバッファーに保持します。次に、ヘッダーとデータを1つのTCPパケットにパックしようとします。

通常は望ましいですが（TCPラウンドトリップを節約できます）、最初のデータがかなり後になるまで送信されない場合はそうではありません。`outgoingMessage.flushHeaders()` は最適化をバイパスし、メッセージを開始します。


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヘッダーの名前
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

指定された名前の HTTP ヘッダーの値を取得します。 そのヘッダーが設定されていない場合、返される値は `undefined` になります。

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Added in: v7.7.0**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在の送信ヘッダーの一意な名前を含む配列を返します。 すべての名前は小文字です。

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Added in: v7.7.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在の送信ヘッダーの浅いコピーを返します。 浅いコピーが使用されるため、さまざまなヘッダー関連の HTTP モジュールメソッドを別途呼び出すことなく、配列値を変更できます。 返されるオブジェクトのキーはヘッダー名であり、値はそれぞれのヘッダー値です。 すべてのヘッダー名は小文字です。

`outgoingMessage.getHeaders()` メソッドによって返されるオブジェクトは、JavaScript の `Object` からプロトタイプ的に継承しません。 これは、`obj.toString()`、`obj.hasOwnProperty()` などの一般的な `Object` メソッドが定義されておらず、機能しないことを意味します。

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Added in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name` で識別されるヘッダーが送信ヘッダーに現在設定されている場合は `true` を返します。 ヘッダー名は大文字と小文字を区別しません。

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Added in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

読み取り専用。 ヘッダーが送信された場合は `true`、そうでない場合は `false`。

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Added in: v9.0.0**

`http.OutgoingMessage` の親クラスであるレガシー `Stream` クラスから継承された `stream.pipe()` メソッドをオーバーライドします。

このメソッドを呼び出すと、`outgoingMessage` は書き込み専用ストリームであるため、`Error` がスローされます。

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヘッダー名

暗黙的な送信のためにキューに入れられたヘッダーを削除します。

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヘッダー名
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ヘッダー値
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

単一のヘッダー値を設定します。 送信されるヘッダーにヘッダーがすでに存在する場合、その値は置き換えられます。 同じ名前で複数のヘッダーを送信するには、文字列の配列を使用します。

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Added in: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

暗黙的なヘッダーの複数のヘッダー値を設定します。 `headers` は [`Headers`](/ja/nodejs/api/globals#class-headers) または `Map` のインスタンスである必要があります。送信されるヘッダーにヘッダーがすでに存在する場合、その値は置き換えられます。

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
または

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
ヘッダーが [`outgoingMessage.setHeaders()`](/ja/nodejs/api/http#outgoingmessagesetheadersheaders) で設定されている場合、それらは [`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) に渡されるヘッダーとマージされ、[`response.writeHead()`](/ja/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) に渡されるヘッダーが優先されます。

```js [ESM]
// content-type = text/plain を返します
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Added in: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) タイムアウトが発生したときに呼び出されるオプションの関数。`timeout` イベントへのバインドと同じです。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ソケットがメッセージに関連付けられ、接続されると、[`socket.setTimeout()`](/ja/nodejs/api/net#socketsettimeouttimeout-callback) が最初のパラメーターとして `msecs` を指定して呼び出されます。

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Added in: v0.3.0**

- [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

基になるソケットへの参照。通常、ユーザーはこのプロパティにアクセスする必要はありません。

`outgoingMessage.end()` を呼び出した後、このプロパティは null になります。

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Added in: v13.2.0, v12.16.0**

[`writable.uncork()`](/ja/nodejs/api/stream#writableuncork) を参照してください。

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Added in: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`outgoingMessage.cork()` が呼び出された回数。

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`outgoingMessage.end()` が呼び出された場合、`true` です。このプロパティは、データがフラッシュされたかどうかを示すものではありません。その目的のために、代わりに `message.writableFinished` を使用してください。

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Added in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

すべてのデータが基盤となるシステムにフラッシュされた場合、`true` です。

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Added in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

割り当てられている場合は、基になるソケットの `highWaterMark`。それ以外の場合、[`writable.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) が false (`16384`) を返し始めるときのデフォルトのバッファーレベル。


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Added in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

バッファリングされたバイト数。

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

常に `false`。

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | `chunk` パラメーターは `Uint8Array` になりました。 |
| v0.11.6 | `callback` 引数が追加されました。 |
| v0.1.29 | Added in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

本体のチャンクを送信します。このメソッドは複数回呼び出すことができます。

`encoding` 引数は、`chunk` が文字列の場合にのみ関係します。デフォルトは `'utf8'` です。

`callback` 引数は省略可能で、このデータのチャンクがフラッシュされるときに呼び出されます。

データ全体がカーネルバッファに正常にフラッシュされた場合は `true` を返します。データの一部または全部がユーザーメモリにキューイングされた場合は `false` を返します。バッファが再び空き状態になると、`'drain'` イベントが発生します。

## `http.METHODS` {#httpmethods}

**Added in: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

パーサーでサポートされている HTTP メソッドのリスト。

## `http.STATUS_CODES` {#httpstatus_codes}

**Added in: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

すべての標準 HTTP レスポンスステータスコードと、それぞれの簡単な説明のコレクション。たとえば、`http.STATUS_CODES[404] === 'Not Found'` です。


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | `highWaterMark` オプションがサポートされました。 |
| v18.0.0 | `requestTimeout`、`headersTimeout`、`keepAliveTimeout`、および `connectionsCheckingInterval` オプションがサポートされました。 |
| v18.0.0 | `noDelay` オプションのデフォルトが `true` になりました。 |
| v17.7.0, v16.15.0 | `noDelay`、`keepAlive`、および `keepAliveInitialDelay` オプションがサポートされました。 |
| v13.3.0 | `maxHeaderSize` オプションがサポートされました。 |
| v13.8.0, v12.15.0, v10.19.0 | `insecureHTTPParser` オプションがサポートされました。 |
| v9.6.0, v8.12.0 | `options` 引数がサポートされました。 |
| v0.1.13 | 追加: v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: 不完全なリクエストにおけるリクエストとヘッダーのタイムアウトをチェックする間隔をミリ秒単位で設定します。**デフォルト:** `30000`。
    - `headersTimeout`: クライアントから完全なHTTPヘッダーを受信するまでのタイムアウト値をミリ秒単位で設定します。詳細については、[`server.headersTimeout`](/ja/nodejs/api/http#serverheaderstimeout)を参照してください。**デフォルト:** `60000`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 必要に応じて、すべての`socket`の`readableHighWaterMark`と`writableHighWaterMark`をオーバーライドします。これは、`IncomingMessage`と`ServerResponse`の両方の`highWaterMark`プロパティに影響します。**デフォルト:** [`stream.getDefaultHighWaterMark()`](/ja/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode)を参照してください。
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、寛容フラグが有効になっているHTTPパーサーを使用します。安全でないパーサーの使用は避けるべきです。詳細については、[`--insecure-http-parser`](/ja/nodejs/api/cli#--insecure-http-parser)を参照してください。**デフォルト:** `false`。
    - `IncomingMessage` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage) 使用する`IncomingMessage`クラスを指定します。オリジナルの`IncomingMessage`を拡張するのに役立ちます。**デフォルト:** `IncomingMessage`。
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、このオプションは、重複を破棄する代わりに、リクエスト内の複数のヘッダーのフィールドライン値をコンマ（`, `）で結合することを許可します。詳細については、[`message.headers`](/ja/nodejs/api/http#messageheaders)を参照してください。**デフォルト:** `false`。
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、新しい受信接続を受信した直後に、[`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]で行われるのと同様に、ソケットでkeep-alive機能が有効になります。**デフォルト:** `false`。
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 正の数に設定すると、アイドル状態のソケットで最初のkeepaliveプローブが送信される前に、初期遅延を設定します。**デフォルト:** `0`。
    - `keepAliveTimeout`: サーバーが最後の応答の書き込みを完了した後、ソケットが破棄される前に、追加の受信データを待機する必要がある非アクティブ時間（ミリ秒単位）。詳細については、[`server.keepAliveTimeout`](/ja/nodejs/api/http#serverkeepalivetimeout)を参照してください。**デフォルト:** `5000`。
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 必要に応じて、このサーバーが受信したリクエストの[`--max-http-header-size`](/ja/nodejs/api/cli#--max-http-header-sizesize)の値をオーバーライドします。これは、リクエストヘッダーの最大長（バイト単位）です。**デフォルト:** 16384 (16 KiB)。
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、新しい受信接続を受信した直後に、Nagleアルゴリズムの使用を無効にします。**デフォルト:** `true`。
    - `requestTimeout`: クライアントからリクエスト全体を受信するまでのタイムアウト値をミリ秒単位で設定します。詳細については、[`server.requestTimeout`](/ja/nodejs/api/http#serverrequesttimeout)を参照してください。**デフォルト:** `300000`。
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、仕様で義務付けられているHostヘッダーがないHTTP/1.1リクエストメッセージに対して、サーバーが400（Bad Request）ステータスコードで応答するように強制します。**デフォルト:** `true`。
    - `ServerResponse` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse) 使用する`ServerResponse`クラスを指定します。オリジナルの`ServerResponse`を拡張するのに役立ちます。**デフォルト:** `ServerResponse`。
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 1回だけ送信する必要があるレスポンスヘッダーのリスト。ヘッダーの値が配列の場合、アイテムは`; `を使用して結合されます。
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`に設定すると、ボディを持たないHTTPレスポンスに書き込むときにエラーがスローされます。**デフォルト:** `false`。
  
 
-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  戻り値: [\<http.Server\>](/ja/nodejs/api/http#class-httpserver) 

[`http.Server`](/ja/nodejs/api/http#class-httpserver)の新しいインスタンスを返します。

`requestListener`は、[`'request'`](/ja/nodejs/api/http#event-request)イベントに自動的に追加される関数です。



::: code-group
```js [ESM]
import http from 'node:http';

// データを受信するローカルサーバーを作成する
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// データを受信するローカルサーバーを作成する
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::



::: code-group
```js [ESM]
import http from 'node:http';

// データを受信するローカルサーバーを作成する
const server = http.createServer();

// request イベントをリッスンする
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// データを受信するローカルサーバーを作成する
const server = http.createServer();

// request イベントをリッスンする
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v10.9.0 | `url` パラメータを個別の `options` オブジェクトとともに渡せるようになりました。 |
| v7.5.0 | `options` パラメータは WHATWG `URL` オブジェクトにできます。 |
| v0.3.6 | 追加: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) デフォルトで GET に設定されたメソッドで、[`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) と同じ `options` を受け付けます。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

ほとんどのリクエストはボディのない GET リクエストであるため、Node.js はこの便利なメソッドを提供します。このメソッドと [`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) の唯一の違いは、メソッドをデフォルトで GET に設定し、`req.end()` を自動的に呼び出すことです。コールバックは、[`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest) セクションで述べられている理由から、応答データを消費するように注意する必要があります。

`callback` は、[`http.IncomingMessage`](/ja/nodejs/api/http#class-httpincomingmessage) のインスタンスである単一の引数で呼び出されます。

JSON フェッチの例:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // 2xx ステータスコードはすべて成功した応答を示しますが、
  // ここでは 200 のみをチェックしています。
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // メモリを解放するために応答データを消費します
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// データを受信するローカルサーバーを作成します
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | エージェントはデフォルトでHTTP Keep-Aliveと5秒のタイムアウトを使用するようになりました。 |
| v0.5.9 | Added in: v0.5.9 |
:::

- [\<http.Agent\>](/ja/nodejs/api/http#class-httpagent)

`Agent` のグローバルインスタンスであり、すべての HTTP クライアントリクエストのデフォルトとして使用されます。 `keepAlive` が有効で、`timeout` が 5 秒である点が、デフォルトの `Agent` 構成とは異なります。

## `http.maxHeaderSize` {#httpmaxheadersize}

**Added in: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HTTPヘッダーの最大許容サイズをバイト単位で指定する読み取り専用のプロパティ。デフォルトは16 KiBです。[`--max-http-header-size`](/ja/nodejs/api/cli#--max-http-header-sizesize) CLIオプションを使用して構成可能です。

これは、`maxHeaderSize`オプションを渡すことによって、サーバーとクライアントのリクエストで上書きできます。

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v16.7.0, v14.18.0 | `URL` オブジェクトを使用する場合、解析されたユーザー名とパスワードは適切に URI デコードされるようになりました。 |
| v15.3.0, v14.17.0 | AbortSignal を使用してリクエストを中断できるようになりました。 |
| v13.3.0 | `maxHeaderSize` オプションがサポートされるようになりました。 |
| v13.8.0, v12.15.0, v10.19.0 | `insecureHTTPParser` オプションがサポートされるようになりました。 |
| v10.9.0 | `url` パラメーターを個別の `options` オブジェクトと一緒に渡せるようになりました。 |
| v7.5.0 | `options` パラメーターは WHATWG `URL` オブジェクトにできます。 |
| v0.3.6 | Added in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/ja/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`Agent`](/ja/nodejs/api/http#class-httpagent) の動作を制御します。 可能な値:
    - `undefined` (デフォルト): このホストとポートには [`http.globalAgent`](/ja/nodejs/api/http#httpglobalagent) を使用します。
    - `Agent` オブジェクト: 渡された `Agent` を明示的に使用します。
    - `false`: デフォルト値を持つ新しい `Agent` が使用されます。
 
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Authorization ヘッダーを計算するための基本的な認証 (`'user:password'`)。
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `agent` オプションが使用されていない場合に、リクエストに使用するソケット/ストリームを生成する関数。 これは、デフォルトの `createConnection` 関数をオーバーライドするためだけにカスタム `Agent` クラスを作成することを避けるために使用できます。 詳細については、[`agent.createConnection()`](/ja/nodejs/api/http#agentcreateconnectionoptions-callback) を参照してください。 任意の [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームは有効な戻り値です。
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロトコルのデフォルトポート。 **デフォルト:** `Agent` が使用されている場合は `agent.defaultPort`、それ以外の場合は `undefined`。
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `host` または `hostname` を解決する際に使用する IP アドレスファミリー。 有効な値は `4` または `6` です。 指定しない場合、IP v4 と v6 の両方が使用されます。
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) リクエストヘッダーを含むオブジェクト。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オプションの [`dns.lookup()` ヒント](/ja/nodejs/api/dns#supported-getaddrinfo-flags)。
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストを発行するサーバーのドメイン名または IP アドレス。 **デフォルト:** `'localhost'`。
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `host` のエイリアス。 [`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) をサポートするために、`host` と `hostname` の両方が指定されている場合は `hostname` が使用されます。
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、寛容フラグが有効になっている HTTP パーサーが使用されます。 不安なパーサーの使用は避ける必要があります。 詳細については、[`--insecure-http-parser`](/ja/nodejs/api/cli#--insecure-http-parser) を参照してください。 **デフォルト:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) リクエスト内の複数のヘッダーのフィールド行の値を、重複を破棄する代わりに `, ` で結合します。 詳細については、[`message.headers`](/ja/nodejs/api/http#messageheaders) を参照してください。 **デフォルト:** `false`。
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ネットワーク接続をバインドするローカルインターフェース。
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 接続元のローカルポート。
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) カスタムルックアップ関数。 **デフォルト:** [`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)。
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サーバーから受信した応答の [`--max-http-header-size`](/ja/nodejs/api/cli#--max-http-header-sizesize) (応答ヘッダーの最大長（バイト単位）) の値をオプションでオーバーライドします。 **デフォルト:** 16384 (16 KiB)。
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) HTTPリクエストメソッドを指定する文字列。 **デフォルト:** `'GET'`。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストパス。 クエリ文字列が含まれている必要があります。 例: `'/index.html?page=12'`。 リクエストパスに不正な文字が含まれている場合は、例外がスローされます。 現在、スペースのみが拒否されますが、将来変更される可能性があります。 **デフォルト:** `'/'`。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートサーバーのポート。 **デフォルト:** 設定されている場合は `defaultPort`、それ以外の場合は `80`。
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するプロトコル。 **デフォルト:** `'http:'`。
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `Connection`、`Content-Length`、`Transfer-Encoding`、`Host` などのデフォルトのヘッダーを自動的に追加するかどうかを指定します。 `false` に設定した場合、必要なすべてのヘッダーを手動で追加する必要があります。 デフォルトは `true` です。
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `Host` ヘッダーを自動的に追加するかどうかを指定します。 指定した場合、これは `setDefaultHeaders` をオーバーライドします。 デフォルトは `true` です。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal): 進行中のリクエストを中断するために使用できる AbortSignal。
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Unix ドメインソケット。 `host` または `port` のいずれかが指定されている場合は使用できません。これらは TCP ソケットを指定するためです。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): ソケットのタイムアウトをミリ秒単位で指定する数値。 これは、ソケットが接続される前にタイムアウトを設定します。
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 1回だけ送信する必要があるリクエストヘッダーのリスト。 ヘッダーの値が配列の場合、アイテムは `; ` を使用して結合されます。
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

[`socket.connect()`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) の `options` もサポートされています。

Node.js は、HTTP リクエストを行うためにサーバーごとに複数の接続を維持します。 この関数を使用すると、リクエストを透過的に発行できます。

`url` は文字列または [`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトにすることができます。 `url` が文字列の場合、[`new URL()`](/ja/nodejs/api/url#new-urlinput-base) で自動的に解析されます。 [`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトの場合、自動的に通常の `options` オブジェクトに変換されます。

`url` と `options` の両方が指定されている場合、オブジェクトはマージされ、`options` プロパティが優先されます。

オプションの `callback` パラメーターは、[`'response'`](/ja/nodejs/api/http#event-response) イベントの 1 回限りのリスナーとして追加されます。

`http.request()` は、[`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest) クラスのインスタンスを返します。 `ClientRequest` インスタンスは書き込み可能なストリームです。 POST リクエストでファイルをアップロードする必要がある場合は、`ClientRequest` オブジェクトに書き込みます。

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

この例では、`req.end()` が呼び出されました。 `http.request()` では、リクエスト本文に書き込まれるデータがない場合でも、リクエストの終了を示すために常に `req.end()` を呼び出す必要があります。

リクエスト中にエラーが発生した場合 (DNS 解決、TCP レベルのエラー、または実際の HTTP 解析エラー)、`'error'` イベントが返されたリクエストオブジェクトで発行されます。 すべての `'error'` イベントと同様に、リスナーが登録されていない場合、エラーがスローされます。

注意すべきいくつかの特別なヘッダーがあります。

- 'Connection: keep-alive' を送信すると、Node.js はサーバーへの接続を次のリクエストまで維持する必要があることを通知します。
- 'Content-Length' ヘッダーを送信すると、デフォルトのチャンクエンコーディングが無効になります。
- 'Expect' ヘッダーを送信すると、リクエストヘッダーがすぐに送信されます。 通常、'Expect: 100-continue' を送信する場合は、タイムアウトと `'continue'` イベントのリスナーの両方を設定する必要があります。 詳細については、RFC 2616 セクション 8.2.3 を参照してください。
- Authorization ヘッダーを送信すると、`auth` オプションを使用して基本的な認証を計算することがオーバーライドされます。

[`URL`](/ja/nodejs/api/url#the-whatwg-url-api) を `options` として使用する例:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
リクエストが成功した場合、次のイベントが次の順序で発行されます。

- `'socket'`
- `'response'`
    - `res` オブジェクトで `'data'` が任意の回数発行されます (応答本文が空の場合、たとえばほとんどのリダイレクトでは `'data'` はまったく発行されません)
    - `res` オブジェクトで `'end'` が発行されます
- `'close'`

接続エラーが発生した場合、次のイベントが発行されます。

- `'socket'`
- `'error'`
- `'close'`

応答を受信する前に接続が途中で切断された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- メッセージ `'Error: socket hang up'` およびコード `'ECONNRESET'` を持つエラーを含む `'error'`
- `'close'`

応答を受信した後に接続が途中で切断された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- `'response'`
    - `res` オブジェクトで `'data'` が任意の回数発行されます
- (ここで接続が閉じられました)
- `res` オブジェクトで `'aborted'` が発行されます
- `'close'`
- メッセージ `'Error: aborted'` およびコード `'ECONNRESET'` を持つエラーを含む `res` オブジェクトで `'error'` が発行されます
- `res` オブジェクトで `'close'` が発行されます

ソケットが割り当てられる前に `req.destroy()` が呼び出された場合、次のイベントが次の順序で発行されます。

- (`req.destroy()` がここで呼び出されました)
- メッセージ `'Error: socket hang up'` およびコード `'ECONNRESET'` を持つエラー、または `req.destroy()` が呼び出されたエラーを含む `'error'`
- `'close'`

接続が成功する前に `req.destroy()` が呼び出された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- (`req.destroy()` がここで呼び出されました)
- メッセージ `'Error: socket hang up'` およびコード `'ECONNRESET'` を持つエラー、または `req.destroy()` が呼び出されたエラーを含む `'error'`
- `'close'`

応答を受信した後に `req.destroy()` が呼び出された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- `'response'`
    - `res` オブジェクトで `'data'` が任意の回数発行されます
- (`req.destroy()` がここで呼び出されました)
- `res` オブジェクトで `'aborted'` が発行されます
- `'close'`
- メッセージ `'Error: aborted'` およびコード `'ECONNRESET'` を持つエラー、または `req.destroy()` が呼び出されたエラーを含む `res` オブジェクトで `'error'` が発行されます
- `res` オブジェクトで `'close'` が発行されます

ソケットが割り当てられる前に `req.abort()` が呼び出された場合、次のイベントが次の順序で発行されます。

- (`req.abort()` がここで呼び出されました)
- `'abort'`
- `'close'`

接続が成功する前に `req.abort()` が呼び出された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- (`req.abort()` がここで呼び出されました)
- `'abort'`
- メッセージ `'Error: socket hang up'` およびコード `'ECONNRESET'` を持つエラーを含む `'error'`
- `'close'`

応答を受信した後に `req.abort()` が呼び出された場合、次のイベントが次の順序で発行されます。

- `'socket'`
- `'response'`
    - `res` オブジェクトで `'data'` が任意の回数発行されます
- (`req.abort()` がここで呼び出されました)
- `'abort'`
- `res` オブジェクトで `'aborted'` が発行されます
- メッセージ `'Error: aborted'` およびコード `'ECONNRESET'` を持つエラーを含む `res` オブジェクトで `'error'` が発行されます。
- `'close'`
- `res` オブジェクトで `'close'` が発行されます

`timeout` オプションを設定するか、`setTimeout()` 関数を使用しても、リクエストは中断されず、`'timeout'` イベントが追加される以外は何もしません。

`AbortSignal` を渡し、対応する `AbortController` で `abort()` を呼び出すと、リクエストで `.destroy()` を呼び出すのと同じように動作します。 具体的には、`'error'` イベントは、メッセージ `'AbortError: The operation was aborted'`、コード `'ABORT_ERR'`、および `cause` (指定されている場合) を含むエラーで発行されます。


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.5.0, v18.14.0 | `label` パラメーターが追加されました。 |
| v14.3.0 | 追加: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エラーメッセージのラベル。 **デフォルト:** `'Header name'`。

`res.setHeader(name, value)` が呼び出されたときに行われる、指定された `name` に対する低レベルの検証を実行します。

不正な値を `name` として渡すと、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされ、`code: 'ERR_INVALID_HTTP_TOKEN'` で識別されます。

ヘッダーを HTTP リクエストまたはレスポンスに渡す前に、このメソッドを使用する必要はありません。 HTTP モジュールは、そのようなヘッダーを自動的に検証します。

例:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**追加: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`res.setHeader(name, value)` が呼び出されたときに行われる、指定された `value` に対する低レベルの検証を実行します。

不正な値を `value` として渡すと、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

- 未定義の値のエラーは、`code: 'ERR_HTTP_INVALID_HEADER_VALUE'` で識別されます。
- 無効な値の文字のエラーは、`code: 'ERR_INVALID_CHAR'` で識別されます。

ヘッダーを HTTP リクエストまたはレスポンスに渡す前に、このメソッドを使用する必要はありません。 HTTP モジュールは、そのようなヘッダーを自動的に検証します。

例:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**Added in: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `1000`.

アイドル状態の HTTP パーサーの最大数を設定します。

## `WebSocket` {#websocket}

**Added in: v22.5.0**

[`WebSocket`](/ja/nodejs/api/http#websocket) のブラウザ互換実装。

