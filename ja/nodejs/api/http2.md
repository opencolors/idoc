---
title: Node.js ドキュメント - HTTP/2
description: このページでは、Node.jsのHTTP/2モジュールに関する包括的なドキュメントを提供し、そのAPI、使用方法、HTTP/2サーバーおよびクライアントの実装例を詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsのHTTP/2モジュールに関する包括的なドキュメントを提供し、そのAPI、使用方法、HTTP/2サーバーおよびクライアントの実装例を詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsのHTTP/2モジュールに関する包括的なドキュメントを提供し、そのAPI、使用方法、HTTP/2サーバーおよびクライアントの実装例を詳述しています。
---


# HTTP/2 {#http/2}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | `host` ヘッダー（`:authority` の有無に関わらず）を持つリクエストの送受信が可能になりました。 |
| v15.3.0, v14.17.0 | AbortSignal でリクエストを中断できるようになりました。 |
| v10.10.0 | HTTP/2 が安定版になりました。以前は実験的でした。 |
| v8.4.0 | 追加: v8.4.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

`node:http2` モジュールは、[HTTP/2](https://tools.ietf.org/html/rfc7540) プロトコルの実装を提供します。以下を使用してアクセスできます。

```js [ESM]
const http2 = require('node:http2');
```
## crypto サポートが利用できない場合の判断 {#determining-if-crypto-support-is-unavailable}

Node.js は、`node:crypto` モジュールのサポートを含めずにビルドされる可能性があります。そのような場合、`node:http2` から `import` しようとしたり、`require('node:http2')` を呼び出そうとすると、エラーがスローされます。

CommonJS を使用する場合、スローされたエラーは try/catch を使用してキャッチできます。

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 のサポートは無効です！');
}
```
字句 ESM `import` キーワードを使用する場合、エラーは、モジュールをロードする試行を行う *前* に `process.on('uncaughtException')` のハンドラーが登録されている場合にのみキャッチできます（たとえば、プリロードモジュールを使用）。

ESM を使用する場合、コードが crypto サポートが有効になっていない Node.js のビルドで実行される可能性がある場合は、字句 `import` キーワードの代わりに [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 関数を使用することを検討してください。

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 のサポートは無効です！');
}
```
## コア API {#core-api}

コア API は、HTTP/2 プロトコルの機能をサポートするために特別に設計された低レベルのインターフェイスを提供します。既存の [HTTP/1](/ja/nodejs/api/http) モジュール API との互換性は *意図されていません*。ただし、[互換性 API](/ja/nodejs/api/http2#compatibility-api) は互換性があります。

`http2` コア API は、`http` API よりもクライアントとサーバーの間で非常に対称的です。たとえば、`'error'`、`'connect'`、`'stream'` などのほとんどのイベントは、クライアント側のコードまたはサーバー側のコードのいずれかによって発生する可能性があります。


### サーバー側の例 {#server-side-example}

以下は、Core API を使用したシンプルな HTTP/2 サーバーを示しています。[暗号化されていない HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption)をサポートするブラウザーは知られていないため、ブラウザーのクライアントと通信する場合は、[`http2.createSecureServer()`](/ja/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) の使用が必須です。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

この例の証明書と鍵を生成するには、以下を実行します。

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### クライアント側の例 {#client-side-example}

以下は、HTTP/2 クライアントを示しています。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### クラス: `Http2Session` {#class-http2session}

**追加: v8.4.0**

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`http2.Http2Session` クラスのインスタンスは、HTTP/2 クライアントとサーバー間のアクティブな通信セッションを表します。このクラスのインスタンスは、ユーザーコードによって直接構築されることを意図していません。

各 `Http2Session` インスタンスは、サーバーまたはクライアントとして動作しているかどうかに応じて、わずかに異なる動作を示します。`http2session.type` プロパティを使用して、`Http2Session` が動作しているモードを判断できます。サーバー側では、ユーザーコードが `Http2Session` オブジェクトを直接操作する機会はほとんどなく、通常、ほとんどのアクションは `Http2Server` または `Http2Stream` オブジェクトとのやり取りを通じて行われます。

ユーザーコードは `Http2Session` インスタンスを直接作成しません。サーバー側の `Http2Session` インスタンスは、新しい HTTP/2 接続が受信されると、`Http2Server` インスタンスによって作成されます。クライアント側の `Http2Session` インスタンスは、`http2.connect()` メソッドを使用して作成されます。

#### `Http2Session` とソケット {#http2session-and-sockets}

すべての `Http2Session` インスタンスは、作成時に正確に 1 つの [`net.Socket`](/ja/nodejs/api/net#class-netsocket) または [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) に関連付けられています。`Socket` または `Http2Session` のいずれかが破棄されると、両方とも破棄されます。

HTTP/2 プロトコルによって課せられる特定のシリアライズおよび処理要件のため、ユーザーコードが `Http2Session` にバインドされた `Socket` インスタンスからデータを読み取ったり、データを書き込んだりすることはお勧めしません。そうすることで、HTTP/2 セッションが不定状態になり、セッションとソケットが使用できなくなる可能性があります。

`Socket` が `Http2Session` にバインドされたら、ユーザーコードは `Http2Session` の API のみに依存する必要があります。

#### イベント: `'close'` {#event-close}

**追加: v8.4.0**

`'close'` イベントは、`Http2Session` が破棄されると発生します。リスナーは引数を想定していません。

#### イベント: `'connect'` {#event-connect}

**追加: v8.4.0**

- `session` [\<Http2Session\>](/ja/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

`'connect'` イベントは、`Http2Session` がリモートピアに正常に接続され、通信を開始できると発生します。

ユーザーコードは通常、このイベントを直接リッスンしません。


#### イベント: `'error'` {#event-error}

**追加: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` イベントは、`Http2Session` の処理中にエラーが発生したときに発生します。

#### イベント: `'frameError'` {#event-frameerror}

**追加: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フレームタイプ。
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) エラーコード。
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリーム ID (またはフレームがストリームに関連付けられていない場合は `0`)。

`'frameError'` イベントは、セッションでフレームを送信しようとしたときにエラーが発生した場合に発生します。送信できなかったフレームが特定の `Http2Stream` に関連付けられている場合、`Http2Stream` で `'frameError'` イベントを発生させる試みが行われます。

`'frameError'` イベントがストリームに関連付けられている場合、ストリームは `'frameError'` イベントの直後に閉じられ、破棄されます。イベントがストリームに関連付けられていない場合、`Http2Session` は `'frameError'` イベントの直後にシャットダウンされます。

#### イベント: `'goaway'` {#event-goaway}

**追加: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `GOAWAY` フレームで指定された HTTP/2 エラーコード。
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートピアが正常に処理した最後のストリームの ID (または ID が指定されていない場合は `0`)。
- `opaqueData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 追加の不透明なデータが `GOAWAY` フレームに含まれている場合は、そのデータを含む `Buffer` インスタンスが渡されます。

`'goaway'` イベントは、`GOAWAY` フレームを受信したときに発生します。

`Http2Session` インスタンスは、`'goaway'` イベントが発生すると自動的にシャットダウンされます。


#### Event: `'localSettings'` {#event-localsettings}

**追加:** v8.4.0

- `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object) 受信した`SETTINGS`フレームのコピー。

`'localSettings'`イベントは、確認応答`SETTINGS`フレームが受信されたときに発行されます。

新しい設定を送信するために`http2session.settings()`を使用する場合、変更された設定は`'localSettings'`イベントが発行されるまで有効になりません。

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Use the new settings */
});
```
#### Event: `'ping'` {#event-ping}

**追加:** v10.12.0

- `payload` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `PING`フレームの8バイトのペイロード

`'ping'`イベントは、接続されたピアから`PING`フレームが受信されるたびに発行されます。

#### Event: `'remoteSettings'` {#event-remotesettings}

**追加:** v8.4.0

- `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object) 受信した`SETTINGS`フレームのコピー。

`'remoteSettings'`イベントは、新しい`SETTINGS`フレームが接続されたピアから受信されたときに発行されます。

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Use the new settings */
});
```
#### Event: `'stream'` {#event-stream}

**追加:** v8.4.0

- `stream` [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream) ストリームへの参照
- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object) ヘッダーを記述するオブジェクト
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連する数値フラグ
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) それぞれの値が続く生のヘッダー名を含む配列。

`'stream'`イベントは、新しい`Http2Stream`が作成されたときに発行されます。

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
サーバー側では、通常、ユーザーコードはこのイベントを直接リッスンしません。代わりに、以下の例のように、`http2.createServer()`および`http2.createSecureServer()`によって返される`net.Server`または`tls.Server`インスタンスによって発行される`'stream'`イベントのハンドラーを登録します。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 暗号化されていないHTTP/2サーバーを作成
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 暗号化されていないHTTP/2サーバーを作成
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

HTTP/2ストリームとネットワークソケットは1対1の対応関係にはありませんが、ネットワークエラーは個々のストリームを破棄し、上記のようにストリームレベルで処理する必要があります。


#### イベント: `'timeout'` {#event-timeout}

**追加: v8.4.0**

`http2session.setTimeout()` メソッドを使用してこの `Http2Session` のタイムアウト期間を設定した後、設定されたミリ秒数が経過しても `Http2Session` でアクティビティがない場合、`'timeout'` イベントが発生します。リスナーは引数を期待しません。

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**追加: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session` がまだソケットに接続されていない場合、値は `undefined` になります。`Http2Session` が `TLSSocket` に接続されていない場合は `h2c` になり、接続された `TLSSocket` 自身の `alpnProtocol` プロパティの値を返します。

#### `http2session.close([callback])` {#http2sessionclosecallback}

**追加: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`Http2Session` を正常に閉じます。既存のストリームが独自に完了することを許可し、新しい `Http2Stream` インスタンスが作成されないようにします。閉じられると、オープンな `Http2Stream` インスタンスがない場合、`http2session.destroy()` が呼び出される *可能性があります*。

指定された場合、`callback` 関数は `'close'` イベントのハンドラーとして登録されます。

#### `http2session.closed` {#http2sessionclosed}

**追加: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この `Http2Session` インスタンスが閉じられている場合は `true`、そうでない場合は `false` になります。

#### `http2session.connecting` {#http2sessionconnecting}

**追加: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この `Http2Session` インスタンスがまだ接続中の場合は `true` になり、`connect` イベントの発生前および/または `http2.connect` コールバックの呼び出し前に `false` に設定されます。

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**追加: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) `Http2Session` がエラーにより破棄されている場合は `Error` オブジェクト。
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最後の `GOAWAY` フレームで送信する HTTP/2 エラーコード。指定されておらず、`error` が undefined でない場合、デフォルトは `INTERNAL_ERROR` になり、それ以外の場合はデフォルトで `NO_ERROR` になります。

`Http2Session` および関連する `net.Socket` または `tls.TLSSocket` を即座に終了します。

破棄されると、`Http2Session` は `'close'` イベントを発生させます。`error` が undefined でない場合、`'close'` イベントの直前に `'error'` イベントが発生します。

`Http2Session` に関連付けられている未処理の `Http2Stream` が残っている場合、それらも破棄されます。


#### `http2session.destroyed` {#http2sessiondestroyed}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この `Http2Session` インスタンスが破棄されていて、もはや使用すべきでない場合は `true`、そうでなければ `false` になります。

#### `http2session.encrypted` {#http2sessionencrypted}

**Added in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session` セッションソケットがまだ接続されていない場合、値は `undefined`、`Http2Session` が `TLSSocket` で接続されている場合は `true`、`Http2Session` が他の種類のソケットまたはストリームに接続されている場合は `false` になります。

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Added in: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) HTTP/2 エラーコード
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最後に処理された `Http2Stream` の数値 ID
- `opaqueData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `GOAWAY` フレーム内に格納される追加データを含む `TypedArray` または `DataView` インスタンス。

`Http2Session` をシャットダウン*せずに*、接続されたピアに `GOAWAY` フレームを送信します。

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Added in: v8.4.0**

- [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object)

この `Http2Session` の現在のローカル設定を記述するプロトタイプのないオブジェクト。 ローカル設定は、*この* `Http2Session` インスタンスにローカルです。

#### `http2session.originSet` {#http2sessionoriginset}

**Added in: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session` が `TLSSocket` に接続されている場合、`originSet` プロパティは `Http2Session` が権威があると見なされる可能性のあるオリジンの `Array` を返します。

`originSet` プロパティは、セキュアな TLS 接続を使用している場合にのみ使用できます。


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Session`が送信された`SETTINGS`フレームの確認応答を現在待機しているかどうかを示します。`http2session.settings()`メソッドを呼び出した後、`true`になります。送信されたすべての`SETTINGS`フレームが確認応答されると、`false`になります。

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v8.9.3 | Added in: v8.9.3 |
:::

- `payload` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) オプションのpingペイロード。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

接続されたHTTP/2ピアに`PING`フレームを送信します。`callback`関数を指定する必要があります。このメソッドは、`PING`が送信された場合は`true`、それ以外の場合は`false`を返します。

未処理（未確認応答）のpingの最大数は、`maxOutstandingPings`構成オプションによって決定されます。デフォルトの最大値は10です。

指定された場合、`payload`は、`PING`とともに送信され、ping確認応答とともに返される8バイトのデータを含む`Buffer`、`TypedArray`、または`DataView`である必要があります。

コールバックは、3つの引数で呼び出されます。`PING`が正常に確認応答された場合は`null`になるエラー引数、pingの送信から確認応答の受信までの経過時間をミリ秒単位で報告する`duration`引数、および8バイトの`PING`ペイロードを含む`Buffer`です。

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
`payload`引数が指定されていない場合、デフォルトのペイロードは、`PING`期間の開始を示す64ビットのタイムスタンプ（リトルエンディアン）になります。


#### `http2session.ref()` {#http2sessionref}

**Added in: v9.4.0**

この`Http2Session`インスタンスの基になる[`net.Socket`](/ja/nodejs/api/net#class-netsocket)で[`ref()`](/ja/nodejs/api/net#socketref)を呼び出します。

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Added in: v8.4.0**

- [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object)

この`Http2Session`の現在のリモート設定を記述するプロトタイプのないオブジェクト。リモート設定は、*接続された*HTTP/2ピアによって設定されます。

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Added in: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ローカルエンドポイントのウィンドウサイズを設定します。`windowSize`は、設定するウィンドウサイズの合計であり、デルタではありません。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

http2クライアントの場合、適切なイベントは`'connect'`または`'remoteSettings'`のいずれかです。

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`msecs`ミリ秒後に`Http2Session`でアクティビティがない場合に呼び出されるコールバック関数を設定するために使用されます。指定された`callback`は、`'timeout'`イベントのリスナーとして登録されます。


#### `http2session.socket` {#http2sessionsocket}

**追加:** v8.4.0

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`net.Socket` (または `tls.TLSSocket`) として動作する `Proxy` オブジェクトを返しますが、HTTP/2 で安全に使用できるメソッドに利用可能なメソッドを制限します。

`destroy`、`emit`、`end`、`pause`、`read`、`resume`、`write` は、コード `ERR_HTTP2_NO_SOCKET_MANIPULATION` でエラーをスローします。詳細については、[`Http2Session` とソケット](/ja/nodejs/api/http2#http2session-and-sockets) を参照してください。

`setTimeout` メソッドは、この `Http2Session` で呼び出されます。

他のすべてのインタラクションはソケットに直接ルーティングされます。

#### `http2session.state` {#http2sessionstate}

**追加:** v8.4.0

`Http2Session` の現在の状態に関するさまざまな情報を提供します。

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` の現在のローカル（受信）フロー制御ウィンドウサイズ。
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最後のフロー制御 `WINDOW_UPDATE` 以降に受信された現在のバイト数。
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 次回この `Http2Session` によって新しい `Http2Stream` が作成されるときに使用される数値識別子。
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートピアが `WINDOW_UPDATE` を受信せずに送信できるバイト数。
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` または `DATA` フレームが最後に受信された `Http2Stream` の数値 ID。
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Session` が `WINDOW_UPDATE` を受信せずに送信できるバイト数。
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Session` のアウトバウンドキュー内にある現在のフレーム数。
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) アウトバウンドヘッダー圧縮状態テーブルの現在のサイズ（バイト単位）。
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) インバウンドヘッダー圧縮状態テーブルの現在のサイズ（バイト単位）。

この `Http2Session` の現在のステータスを記述するオブジェクト。


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) セッションが接続されたとき、またはセッションがすでに接続されている場合はすぐに呼び出されるコールバック。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object) 更新された `settings` オブジェクト。
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

この `Http2Session` の現在のローカル設定を更新し、接続された HTTP/2 ピアに新しい `SETTINGS` フレームを送信します。

一度呼び出すと、リモートピアが新しい設定を確認するのをセッションが待機している間、`http2session.pendingSettingsAck` プロパティは `true` になります。

新しい設定は、`SETTINGS` 確認応答を受信し、`'localSettings'` イベントが発生するまで有効になりません。 確認応答が保留中の場合でも、複数の `SETTINGS` フレームを送信できます。

#### `http2session.type` {#http2sessiontype}

**追加: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`http2session.type` は、この `Http2Session` インスタンスがサーバーである場合は `http2.constants.NGHTTP2_SESSION_SERVER` と等しくなり、インスタンスがクライアントである場合は `http2.constants.NGHTTP2_SESSION_CLIENT` と等しくなります。

#### `http2session.unref()` {#http2sessionunref}

**追加: v9.4.0**

この `Http2Session` インスタンスの基になる [`net.Socket`](/ja/nodejs/api/net#class-netsocket) で [`unref()`](/ja/nodejs/api/net#socketunref) を呼び出します。


### クラス: `ServerHttp2Session` {#class-serverhttp2session}

**追加:** v8.4.0

- 拡張: [\<Http2Session\>](/ja/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**追加:** v9.4.0

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 7838](https://tools.ietf.org/html/rfc7838) で定義されている代替サービス構成の説明。
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) オリジンを指定するURL文字列（または`origin`プロパティを持つ`Object`）、あるいは、`http2stream.id`プロパティで与えられるアクティブな`Http2Stream`の数値識別子。

接続されたクライアントに、[RFC 7838](https://tools.ietf.org/html/rfc7838) で定義されている `ALTSVC` フレームを送信します。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // origin https://example.org:80 の altsvc を設定
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 特定のストリームの altsvc を設定
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // origin https://example.org:80 の altsvc を設定
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 特定のストリームの altsvc を設定
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

特定のストリーム ID で `ALTSVC` フレームを送信すると、代替サービスが指定された `Http2Stream` のオリジンに関連付けられていることを示します。

`alt` および origin 文字列は *ASCII バイトのみ* を含める必要があり、ASCII バイトのシーケンスとして厳密に解釈されます。 特定のドメインに対して以前に設定された代替サービスをクリアするために、特別な値 `'clear'` を渡すことができます。

`originOrStream` 引数に文字列が渡されると、URLとして解析され、オリジンが導出されます。 たとえば、HTTP URL `'https://example.org/foo/bar'` のオリジンは、ASCII 文字列 `'https://example.org'` です。 指定された文字列をURLとして解析できない場合、または有効なオリジンを導出できない場合、エラーがスローされます。

`URL` オブジェクト、または `origin` プロパティを持つオブジェクトは、`originOrStream` として渡すことができ、その場合、`origin` プロパティの値が使用されます。 `origin` プロパティの値は、適切にシリアライズされた ASCII オリジン *でなければなりません*。


#### 代替サービスの指定 {#specifying-alternative-services}

`alt` パラメーターの形式は、特定のホストとポートに関連付けられた「代替」プロトコルのコンマ区切りリストを含む ASCII 文字列として、[RFC 7838](https://tools.ietf.org/html/rfc7838) によって厳密に定義されています。

たとえば、値 `'h2="example.org:81"'` は、HTTP/2 プロトコルが TCP/IP ポート 81 でホスト `'example.org'` で利用可能であることを示します。ホストとポートは、引用符 (`"`) 文字で囲む *必要があります*。

複数の代替を指定できます。例：`'h2="example.org:81", h2=":82"'`。

プロトコル識別子 (例の `'h2'`) は、有効な [ALPN プロトコル ID](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) にすることができます。

これらの値の構文は、Node.js 実装によって検証されず、ユーザーによって提供されるか、ピアから受信されたとおりに渡されます。

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**追加: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 複数の URL 文字列が個別の引数として渡されます。

サーバーが権威ある応答を提供できるオリジンのセットをアドバタイズするために、接続されたクライアントに `ORIGIN` フレーム ([RFC 8336](https://tools.ietf.org/html/rfc8336) で定義) を送信します。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

文字列が `origin` として渡されると、URL として解析され、オリジンが派生します。たとえば、HTTP URL `'https://example.org/foo/bar'` のオリジンは、ASCII 文字列 `'https://example.org'` です。指定された文字列を URL として解析できない場合、または有効なオリジンを派生できない場合は、エラーがスローされます。

`URL` オブジェクト、または `origin` プロパティを持つ任意のオブジェクトを `origin` として渡すことができます。その場合、`origin` プロパティの値が使用されます。`origin` プロパティの値は、適切にシリアル化された ASCII オリジン *である必要* があります。

あるいは、`origins` オプションは、`http2.createSecureServer()` メソッドを使用して新しい HTTP/2 サーバーを作成するときに使用できます。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### クラス: `ClientHttp2Session` {#class-clienthttp2session}

**追加:** v8.4.0

- 拡張: [\<Http2Session\>](/ja/nodejs/api/http2#class-http2session)

#### イベント: `'altsvc'` {#event-altsvc}

**追加:** v9.4.0

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'altsvc'` イベントは、クライアントが `ALTSVC` フレームを受信するたびに発生します。イベントは、`ALTSVC` の値、オリジン、およびストリーム ID とともに発生します。`ALTSVC` フレームに `origin` が提供されない場合、`origin` は空の文字列になります。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### イベント: `'origin'` {#event-origin}

**追加:** v10.12.0

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`'origin'` イベントは、クライアントが `ORIGIN` フレームを受信するたびに発生します。イベントは、`origin` 文字列の配列とともに発生します。`http2session.originSet` は、受信したオリジンを含むように更新されます。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

`'origin'` イベントは、セキュアな TLS 接続を使用している場合にのみ発生します。


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Added in: v8.4.0**

-  `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Http2Stream` の *書き込み可能* 側を最初に閉じる必要がある場合は `true`。ペイロード本体を予期すべきでない `GET` リクエストを送信する場合など。
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` であり、`parent` が親ストリームを識別する場合、作成されたストリームは親の唯一の直接の依存関係になり、他の既存の依存関係は新しく作成されたストリームの依存関係になります。**デフォルト:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しく作成されたストリームが依存するストリームの数値識別子を指定します。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 同じ `parent` を持つ他のストリームとの関係におけるストリームの相対的な依存関係を指定します。値は `1` から `256` (両端を含む) までの数値です。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Http2Stream` は、最後の `DATA` フレームが送信された後、`'wantTrailers'` イベントを発行します。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のリクエストを中断するために使用できる AbortSignal。
  
 
-  Returns: [\<ClientHttp2Stream\>](/ja/nodejs/api/http2#class-clienthttp2stream) 

HTTP/2 クライアントの `Http2Session` インスタンスのみの場合、`http2session.request()` は、接続されたサーバーに HTTP/2 リクエストを送信するために使用できる `Http2Stream` インスタンスを作成して返します。

`ClientHttp2Session` が最初に作成されるとき、ソケットはまだ接続されていない可能性があります。この間に `clienthttp2session.request()` が呼び出された場合、実際のリクエストはソケットの準備が整うまで延期されます。実際のリクエストが実行される前に `session` が閉じられた場合、`ERR_HTTP2_GOAWAY_SESSION` がスローされます。

このメソッドは、`http2session.type` が `http2.constants.NGHTTP2_SESSION_CLIENT` と等しい場合にのみ使用できます。

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

`options.waitForTrailers` オプションが設定されている場合、送信されるペイロードデータの最後のチャンクをキューに入れた直後に、`'wantTrailers'` イベントが発行されます。その後、`http2stream.sendTrailers()` メソッドを呼び出して、トレーラーヘッダーをピアに送信できます。

`options.waitForTrailers` が設定されている場合、`Http2Stream` は最後の `DATA` フレームが送信されても自動的に閉じません。ユーザーコードは、`Http2Stream` を閉じるために `http2stream.sendTrailers()` または `http2stream.close()` のいずれかを呼び出す必要があります。

`options.signal` が `AbortSignal` で設定され、対応する `AbortController` で `abort` が呼び出されると、リクエストは `AbortError` エラーとともに `'error'` イベントを発行します。

`:method` および `:path` 擬似ヘッダーが `headers` 内で指定されていない場合、それぞれデフォルトで次のようになります。

- `:method` = `'GET'`
- `:path` = `/`


### クラス: `Http2Stream` {#class-http2stream}

**追加: v8.4.0**

- 拡張: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

`Http2Stream`クラスの各インスタンスは、`Http2Session`インスタンスを介した双方向のHTTP/2通信ストリームを表します。単一の`Http2Session`は、そのライフサイクル全体で最大2-1個の`Http2Stream`インスタンスを持つことができます。

ユーザーコードは`Http2Stream`インスタンスを直接構築しません。代わりに、これらは`Http2Session`インスタンスを通じて作成、管理され、ユーザーコードに提供されます。サーバーでは、`Http2Stream`インスタンスは、受信HTTPリクエスト（および`'stream'`イベントを介してユーザーコードに引き渡される）に応答して、または`http2stream.pushStream()`メソッドの呼び出しに応答して作成されます。クライアントでは、`Http2Stream`インスタンスは、`http2session.request()`メソッドが呼び出されたとき、または受信`'push'`イベントに応答して作成され、返されます。

`Http2Stream`クラスは、[`ServerHttp2Stream`](/ja/nodejs/api/http2#class-serverhttp2stream)クラスおよび[`ClientHttp2Stream`](/ja/nodejs/api/http2#class-clienthttp2stream)クラスの基底クラスであり、それぞれサーバー側またはクライアント側で個別に使用されます。

すべての`Http2Stream`インスタンスは、[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームです。`Duplex`の`Writable`側は、接続されたピアにデータを送信するために使用され、`Readable`側は、接続されたピアから送信されたデータを受信するために使用されます。

`Http2Stream`のデフォルトのテキスト文字エンコーディングはUTF-8です。`Http2Stream`を使用してテキストを送信する場合は、`'content-type'`ヘッダーを使用して文字エンコーディングを設定します。

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### `Http2Stream`のライフサイクル {#http2stream-lifecycle}

##### 作成 {#creation}

サーバー側では、[`ServerHttp2Stream`](/ja/nodejs/api/http2#class-serverhttp2stream)のインスタンスは、次のいずれかの場合に作成されます。

- 以前に使用されていないストリームIDを持つ新しいHTTP/2 `HEADERS`フレームを受信した場合。
- `http2stream.pushStream()`メソッドが呼び出された場合。

クライアント側では、[`ClientHttp2Stream`](/ja/nodejs/api/http2#class-clienthttp2stream)のインスタンスは、`http2session.request()`メソッドが呼び出されたときに作成されます。

クライアントでは、`http2session.request()`によって返される`Http2Stream`インスタンスは、親`Http2Session`がまだ完全に確立されていない場合、すぐには使用できない場合があります。そのような場合、`Http2Stream`で呼び出された操作は、`'ready'`イベントが発行されるまでバッファリングされます。ユーザーコードは、`'ready'`イベントを直接処理する必要はほとんどありません。`Http2Stream`の準備完了状態は、`http2stream.id`の値を確認することで判断できます。値が`undefined`の場合、ストリームはまだ使用できません。


##### 破棄 {#destruction}

すべての [`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) インスタンスは、以下のいずれかの時に破棄されます。

- ストリームに対する `RST_STREAM` フレームが接続されたピアによって受信され、（クライアントストリームの場合のみ）保留中のデータが読み込まれたとき。
- `http2stream.close()` メソッドが呼び出され、（クライアントストリームの場合のみ）保留中のデータが読み込まれたとき。
- `http2stream.destroy()` または `http2session.destroy()` メソッドが呼び出されたとき。

`Http2Stream` インスタンスが破棄されると、接続されたピアに `RST_STREAM` フレームを送信しようとします。

`Http2Stream` インスタンスが破棄されると、`'close'` イベントが発生します。`Http2Stream` は `stream.Duplex` のインスタンスであるため、ストリームデータが現在流れている場合は `'end'` イベントも発生します。`http2stream.destroy()` が最初の引数として `Error` を渡して呼び出された場合は、`'error'` イベントも発生する可能性があります。

`Http2Stream` が破棄された後、`http2stream.destroyed` プロパティは `true` になり、`http2stream.rstCode` プロパティは `RST_STREAM` エラーコードを指定します。`Http2Stream` インスタンスは、破棄されると使用できなくなります。

#### Event: `'aborted'` {#event-aborted}

**Added in: v8.4.0**

`'aborted'` イベントは、`Http2Stream` インスタンスが通信の途中で異常に中断された場合に常に発生します。そのリスナーは引数を期待しません。

`'aborted'` イベントは、`Http2Stream` の書き込み可能側が終了していない場合にのみ発生します。

#### Event: `'close'` {#event-close_1}

**Added in: v8.4.0**

`'close'` イベントは、`Http2Stream` が破棄されると発生します。このイベントが発生すると、`Http2Stream` インスタンスは使用できなくなります。

ストリームを閉じるときに使用された HTTP/2 エラーコードは、`http2stream.rstCode` プロパティを使用して取得できます。コードが `NGHTTP2_NO_ERROR`（`0`）以外の値である場合、`'error'` イベントも発生します。

#### Event: `'error'` {#event-error_1}

**Added in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` イベントは、`Http2Stream` の処理中にエラーが発生した場合に発生します。


#### イベント: `'frameError'` {#event-frameerror_1}

**追加: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フレームの種類。
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) エラーコード。
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームID（フレームがストリームに関連付けられていない場合は`0`）。

`'frameError'`イベントは、フレームの送信を試みているときにエラーが発生した場合に発生します。 呼び出されると、ハンドラー関数はフレームタイプを識別する整数引数と、エラーコードを識別する整数引数を受け取ります。 `'frameError'`イベントが発生した直後に`Http2Stream`インスタンスは破棄されます。

#### イベント: `'ready'` {#event-ready}

**追加: v8.4.0**

`'ready'`イベントは、`Http2Stream`が開かれ、`id`が割り当てられ、使用できるようになったときに発生します。 リスナーは引数を期待しません。

#### イベント: `'timeout'` {#event-timeout_1}

**追加: v8.4.0**

`'timeout'`イベントは、`http2stream.setTimeout()`を使用して設定されたミリ秒数以内に、この`Http2Stream`でアクティビティが受信されなかった場合に発生します。 そのリスナーは引数を期待しません。

#### イベント: `'trailers'` {#event-trailers}

**追加: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object) ヘッダーを記述するオブジェクト
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連する数値フラグ

`'trailers'`イベントは、トレーラーヘッダーフィールドに関連付けられたヘッダーのブロックを受信したときに発生します。 リスナーコールバックには、[HTTP/2ヘッダーオブジェクト](/ja/nodejs/api/http2#headers-object)とヘッダーに関連付けられたフラグが渡されます。

トレーラーを受信する前に`http2stream.end()`が呼び出され、受信データが読み取られていないか、リッスンされていない場合、このイベントは発生しない可能性があります。

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### イベント: `'wantTrailers'` {#event-wanttrailers}

**追加:** v10.0.0

`Http2Stream`がフレーム上で送信される最後の`DATA`フレームをキューに入れ、`Http2Stream`がトレーラーヘッダーを送信する準備ができている場合に、`'wantTrailers'`イベントが発行されます。リクエストまたはレスポンスを開始するときに、このイベントを発行するには、`waitForTrailers`オプションを設定する必要があります。

#### `http2stream.aborted` {#http2streamaborted}

**追加:** v8.4.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream`インスタンスが異常終了した場合、`true`に設定されます。設定されている場合、`'aborted'`イベントが発行されています。

#### `http2stream.bufferSize` {#http2streambuffersize}

**追加:** v11.2.0, v10.16.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティは、書き込まれるために現在バッファリングされている文字数を示します。詳細については、[`net.Socket.bufferSize`](/ja/nodejs/api/net#socketbuffersize)を参照してください。

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) エラーコードを識別する符号なし32ビット整数。**デフォルト:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`)。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'close'`イベントをリッスンするために登録されたオプションの関数。

接続されたHTTP/2ピアに`RST_STREAM`フレームを送信することにより、`Http2Stream`インスタンスを閉じます。

#### `http2stream.closed` {#http2streamclosed}

**追加:** v9.4.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream`インスタンスが閉じられている場合、`true`に設定されます。

#### `http2stream.destroyed` {#http2streamdestroyed}

**追加:** v8.4.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream`インスタンスが破棄され、使用できなくなった場合、`true`に設定されます。


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Added in: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

受信したリクエストまたはレスポンスの HEADERS フレームで `END_STREAM` フラグが設定されている場合に `true` に設定します。これは追加のデータを受信すべきではなく、`Http2Stream` の読み取り可能な側が閉じられることを示します。

#### `http2stream.id` {#http2streamid}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

この `Http2Stream` インスタンスの数値ストリーム識別子。ストリーム識別子がまだ割り当てられていない場合は `undefined` に設定されます。

#### `http2stream.pending` {#http2streampending}

**Added in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream` インスタンスにまだ数値ストリーム識別子が割り当てられていない場合は `true` に設定されます。

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Added in: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` で、`parent` が親ストリームを識別する場合、このストリームは親の唯一の直接の依存関係になり、他の既存の依存関係はすべてこのストリームの依存関係になります。 **デフォルト:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このストリームが依存するストリームの数値識別子を指定します。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 同じ `parent` を持つ他のストリームに対するストリームの相対的な依存関係を指定します。値は `1` から `256` (両端を含む) の間の数値です。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、接続されたピアに `PRIORITY` フレームを送信せずに、ローカルで優先度を変更します。

この `Http2Stream` インスタンスの優先度を更新します。


#### `http2stream.rstCode` {#http2streamrstcode}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Http2Stream`が、接続されたピアから`RST_STREAM`フレームを受信した後、`http2stream.close()`を呼び出すか、`http2stream.destroy()`を呼び出して破棄された場合に報告される`RST_STREAM` [エラーコード](/ja/nodejs/api/http2#error-codes-for-rst_stream-and-goaway)に設定されます。 `Http2Stream`が閉じられていない場合は、`undefined`になります。

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Added in: v9.5.0**

- [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)

この`Http2Stream`に送信された送信ヘッダーを含むオブジェクト。

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Added in: v9.5.0**

- [\<HTTP/2 ヘッダーオブジェクト[]\>](/ja/nodejs/api/http2#headers-object)

この`Http2Stream`に送信された送信情報（追加）ヘッダーを含むオブジェクトの配列。

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Added in: v9.5.0**

- [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)

この`HttpStream`に送信された送信トレーラーを含むオブジェクト。

#### `http2stream.session` {#http2streamsession}

**Added in: v8.4.0**

- [\<Http2Session\>](/ja/nodejs/api/http2#class-http2session)

この`Http2Stream`を所有する`Http2Session`インスタンスへの参照。 `Http2Stream`インスタンスが破棄された後、値は`undefined`になります。

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Added in: v8.4.0**

`Http2Stream`の現在の状態に関する雑多な情報を提供します。

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 接続されたピアが `WINDOW_UPDATE` を受信せずに、この `Http2Stream` に対して送信できるバイト数。
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `nghttp2` によって決定される、`Http2Stream` の低レベルの現在の状態を示すフラグ。
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Stream` がローカルで閉じられている場合は `1`。
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Stream` がリモートで閉じられている場合は `1`。
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PRIORITY` フレームを使用して指定された、この `Http2Stream` に依存するすべての `Http2Stream` インスタンスの重みの合計。
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Stream` の優先度の重み。

この `Http2Stream` の現在の状態。

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Added in: v10.0.0**

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object)

末尾の `HEADERS` フレームを接続された HTTP/2 ピアに送信します。このメソッドは `Http2Stream` を直ちに閉じ、`'wantTrailers'` イベントが発行された後にのみ呼び出す必要があります。リクエストの送信時またはレスポンスの送信時に、トレーラーを送信できるように、最後の `DATA` フレームの後に `Http2Stream` を開いたままにするには、`options.waitForTrailers` オプションを設定する必要があります。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

HTTP/1 仕様では、トレーラーに HTTP/2 疑似ヘッダーフィールド (例: `':method'`, `':path'`, など) を含めることは禁止されています。


### クラス: `ClientHttp2Stream` {#class-clienthttp2stream}

**追加: v8.4.0**

- 拡張: [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream)

`ClientHttp2Stream`クラスは、HTTP/2クライアントでのみ使用される`Http2Stream`の拡張です。クライアント上の`Http2Stream`インスタンスは、クライアントにのみ関連する`'response'`や`'push'`などのイベントを提供します。

#### イベント: `'continue'` {#event-continue}

**追加: v8.5.0**

通常、リクエストに`Expect: 100-continue`が含まれているため、サーバーが`100 Continue`ステータスを送信したときに発生します。これは、クライアントがリクエストボディを送信する必要があるという指示です。

#### イベント: `'headers'` {#event-headers}

**追加: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'headers'`イベントは、`1xx`のインフォメーションヘッダーのブロックが受信された場合など、ストリームに追加のヘッダーブロックが受信されたときに発生します。リスナーコールバックには、[HTTP/2 Headers Object](/ja/nodejs/api/http2#headers-object)とヘッダーに関連付けられたフラグが渡されます。

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### イベント: `'push'` {#event-push}

**追加: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'push'`イベントは、サーバープッシュストリームのレスポンスヘッダーが受信されたときに発生します。リスナーコールバックには、[HTTP/2 Headers Object](/ja/nodejs/api/http2#headers-object)とヘッダーに関連付けられたフラグが渡されます。

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### イベント: `'response'` {#event-response}

**追加: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'response'`イベントは、接続されたHTTP/2サーバーからこのストリームのレスポンス`HEADERS`フレームを受信したときに発生します。リスナーは、受信した[HTTP/2 Headers Object](/ja/nodejs/api/http2#headers-object)を含む`Object`と、ヘッダーに関連付けられたフラグの2つの引数で呼び出されます。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### クラス: `ServerHttp2Stream` {#class-serverhttp2stream}

**追加:** v8.4.0

- 継承元: [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream)

`ServerHttp2Stream` クラスは、HTTP/2 サーバーでのみ排他的に使用される [`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) の拡張です。サーバー上の `Http2Stream` インスタンスは、`http2stream.pushStream()` や `http2stream.respond()` などのサーバーでのみ関連する追加のメソッドを提供します。

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**追加:** v8.4.0

- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)

追加の通知 `HEADERS` フレームを接続された HTTP/2 ピアに送信します。

#### `http2stream.headersSent` {#http2streamheaderssent}

**追加:** v8.4.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ヘッダーが送信された場合は true、それ以外の場合は false (読み取り専用)。

#### `http2stream.pushAllowed` {#http2streampushallowed}

**追加:** v8.4.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

リモートクライアントの最新の `SETTINGS` フレームの `SETTINGS_ENABLE_PUSH` フラグにマッピングされた読み取り専用プロパティ。リモートピアがプッシュストリームを受け入れる場合は `true`、それ以外の場合は `false` になります。設定は、同じ `Http2Session` 内のすべての `Http2Stream` で同じです。

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` であり、`parent` が親ストリームを識別する場合、作成されたストリームは親の唯一の直接依存関係になり、他の既存の依存関係は新しく作成されたストリームの依存関係になります。**デフォルト:** `false`。
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しく作成されたストリームが依存するストリームの数値識別子を指定します。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) プッシュストリームが開始されると呼び出されるコールバック。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/ja/nodejs/api/http2#class-serverhttp2stream) 返された `pushStream` オブジェクト。
    - `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object) `pushStream` が開始されたヘッダーオブジェクト。
  
 

プッシュストリームを開始します。コールバックは、プッシュストリーム用に作成された新しい `Http2Stream` インスタンスが 2 番目の引数として渡されるか、`Error` が最初の引数として渡されて呼び出されます。



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

プッシュストリームの重みを `HEADERS` フレームで設定することはできません。サーバー側の同時ストリーム間の帯域幅バランシングを有効にするには、`silent` オプションを `true` に設定して、`weight` 値を `http2stream.priority` に渡します。

プッシュされたストリーム内から `http2stream.pushStream()` を呼び出すことは許可されておらず、エラーがスローされます。


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.5.0, v12.19.0 | 明示的に日付ヘッダーを設定できるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) レスポンスにペイロードデータが含まれないことを示す場合は、`true` に設定します。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Http2Stream` は最後の `DATA` フレームが送信された後に `'wantTrailers'` イベントを発生させます。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

レスポンスを開始します。 `options.waitForTrailers` オプションが設定されている場合、送信されるペイロードデータの最後のチャンクをキューに入れた直後に `'wantTrailers'` イベントが発生します。 その後、`http2stream.sendTrailers()` メソッドを使用して、トレーラーヘッダーフィールドをピアに送信できます。

`options.waitForTrailers` が設定されている場合、`Http2Stream` は最後の `DATA` フレームが送信されたときに自動的に閉じません。 ユーザーコードは、`http2stream.sendTrailers()` または `http2stream.close()` のいずれかを呼び出して、`Http2Stream` を閉じる必要があります。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.5.0, v12.19.0 | 明示的な日付ヘッダーの設定を許可。 |
| v12.12.0 | `fd` オプションが `FileHandle` になることが可能に。 |
| v10.0.0 | 必ずしも通常のファイルである必要はなく、読み取り可能なファイル記述子がサポートされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) 読み取り可能なファイル記述子。
- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、最後の `DATA` フレームが送信された後、`Http2Stream` は `'wantTrailers'` イベントを発行します。
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始するオフセット位置。
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) fd から送信するデータの量。

指定されたファイル記述子からデータが読み取られるレスポンスを開始します。 指定されたファイル記述子に対して検証は実行されません。 ファイル記述子を使用してデータを読み取ろうとしているときにエラーが発生した場合、`Http2Stream` は標準の `INTERNAL_ERROR` コードを使用して `RST_STREAM` フレームで閉じられます。

使用すると、`Http2Stream` オブジェクトの `Duplex` インターフェイスは自動的に閉じられます。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

オプションの `options.statCheck` 関数を指定すると、ユーザーコードは指定された fd の `fs.Stat` の詳細に基づいて追加のコンテンツヘッダーを設定する機会を得られます。 `statCheck` 関数が指定されている場合、`http2stream.respondWithFD()` メソッドは `fs.fstat()` 呼び出しを実行して、指定されたファイル記述子の詳細を収集します。

`offset` および `length` オプションを使用して、応答を特定の範囲のサブセットに制限できます。 これは、たとえば、HTTP Range リクエストをサポートするために使用できます。

ファイル記述子または `FileHandle` はストリームが閉じられたときに閉じられないため、不要になったら手動で閉じる必要があります。 複数のストリームで同じファイル記述子を同時に使用することはサポートされておらず、データが失われる可能性があります。 ストリームが終了した後、ファイル記述子を再利用することはサポートされています。

`options.waitForTrailers` オプションが設定されている場合、送信されるペイロードデータの最後のチャンクをキューに入れた直後に `'wantTrailers'` イベントが発生します。 次に、`http2stream.sendTrailers()` メソッドを使用して、末尾のヘッダーフィールドをピアに送信できます。

`options.waitForTrailers` が設定されている場合、最後の `DATA` フレームが送信されても `Http2Stream` は自動的に閉じられません。 ユーザーコードは、`Http2Stream` を閉じるために、`http2stream.sendTrailers()` または `http2stream.close()` のいずれかを*必ず*呼び出す必要があります。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v14.5.0, v12.19.0 | 明示的に日付ヘッダーを設定できるようにしました。 |
| v10.0.0 | 必ずしも通常のファイルである必要はなく、読み取り可能なファイルがサポートされるようになりました。 |
| v8.4.0 | v8.4.0 で追加されました |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 送信する前にエラーが発生した場合に呼び出されるコールバック関数。
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Http2Stream` は最後の `DATA` フレームが送信された後に `'wantTrailers'` イベントを発行します。
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始するオフセット位置。
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) fd から送信するデータの量。

通常のファイルをレスポンスとして送信します。 `path` は通常のファイルを指定する必要があります。そうでない場合、`Http2Stream` オブジェクトで `'error'` イベントが発生します。

使用すると、`Http2Stream` オブジェクトの `Duplex` インターフェースは自動的に閉じられます。

オプションの `options.statCheck` 関数を指定して、ユーザーコードが指定されたファイルの `fs.Stat` の詳細に基づいて追加のコンテンツヘッダーを設定する機会を与えることができます。

ファイルデータの読み取りを試行中にエラーが発生した場合、`Http2Stream` は標準の `INTERNAL_ERROR` コードを使用して `RST_STREAM` フレームを使用して閉じられます。 `onError` コールバックが定義されている場合は、それが呼び出されます。それ以外の場合、ストリームは破棄されます。

ファイルパスを使用する例:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() は、ストリームが相手側によって破棄された場合にスローされる可能性があります。
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 実際のエラー処理を実行します。
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() は、ストリームが相手側によって破棄された場合にスローされる可能性があります。
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 実際のエラー処理を実行します。
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

`options.statCheck` 関数を使用して、`false` を返すことによって送信操作をキャンセルすることもできます。 たとえば、条件付きリクエストは stat 結果をチェックして、ファイルが変更されたかどうかを判断し、適切な `304` レスポンスを返すことができます。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // stat をここでチェックします...
    stream.respond({ ':status': 304 });
    return false; // 送信操作をキャンセルします
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // stat をここでチェックします...
    stream.respond({ ':status': 304 });
    return false; // 送信操作をキャンセルします
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

`content-length` ヘッダーフィールドは自動的に設定されます。

`offset` および `length` オプションを使用して、レスポンスを特定の範囲サブセットに制限できます。 たとえば、これは HTTP Range リクエストをサポートするために使用できます。

`options.onError` 関数を使用して、ファイルの配信が開始される前に発生する可能性のあるすべてのエラーを処理することもできます。 デフォルトの動作は、ストリームを破棄することです。

`options.waitForTrailers` オプションが設定されている場合、送信されるペイロードデータの最後のチャンクをキューに入れた直後に `'wantTrailers'` イベントが発行されます。 次に、`http2stream.sendTrailers()` メソッドを使用して、トレーラーヘッダーフィールドをピアに送信できます。

`options.waitForTrailers` が設定されている場合、最後の `DATA` フレームが送信されても `Http2Stream` は自動的に閉じません。 ユーザーコードは、`Http2Stream` を閉じるために `http2stream.sendTrailers()` または `http2stream.close()` のいずれかを呼び出す必要があります。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### クラス: `Http2Server` {#class-http2server}

**追加:** v8.4.0

- 拡張: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

`Http2Server`のインスタンスは、`http2.createServer()`関数を使用して作成されます。`Http2Server`クラスは、`node:http2`モジュールによって直接エクスポートされません。

#### イベント: `'checkContinue'` {#event-checkcontinue}

**追加:** v8.5.0

- `request` [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

[`'request'`](/ja/nodejs/api/http2#event-request)リスナーが登録されている場合、または[`http2.createServer()`](/ja/nodejs/api/http2#http2createserveroptions-onrequesthandler)にコールバック関数が提供されている場合、HTTP `Expect: 100-continue`を含むリクエストを受信するたびに、`'checkContinue'`イベントが発生します。このイベントがリッスンされない場合、サーバーはステータス`100 Continue`で適切に自動的に応答します。

このイベントを処理するには、クライアントがリクエストボディの送信を継続する必要がある場合は[`response.writeContinue()`](/ja/nodejs/api/http2#responsewritecontinue)を呼び出すか、クライアントがリクエストボディの送信を継続する必要がない場合は適切なHTTP応答（例：400 Bad Request）を生成します。

このイベントが発生して処理される場合、[`'request'`](/ja/nodejs/api/http2#event-request)イベントは発生しません。

#### イベント: `'connection'` {#event-connection}

**追加:** v8.4.0

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このイベントは、新しいTCPストリームが確立されたときに発生します。`socket`は通常、[`net.Socket`](/ja/nodejs/api/net#class-netsocket)型のオブジェクトです。通常、ユーザーはこのイベントにアクセスする必要はありません。

このイベントは、HTTPサーバーに接続を注入するために、ユーザーが明示的に発生させることもできます。その場合、任意の[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームを渡すことができます。

#### イベント: `'request'` {#event-request}

**追加:** v8.4.0

- `request` [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

リクエストがあるたびに発生します。セッションごとに複数のリクエストがある場合があります。[互換性API](/ja/nodejs/api/http2#compatibility-api)を参照してください。


#### イベント: `'session'` {#event-session}

**追加: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ja/nodejs/api/http2#class-serverhttp2session)

`'session'` イベントは、新しい `Http2Session` が `Http2Server` によって作成されたときに発生します。

#### イベント: `'sessionError'` {#event-sessionerror}

**追加: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ja/nodejs/api/http2#class-serverhttp2session)

`'sessionError'` イベントは、`Http2Server` に関連付けられた `Http2Session` オブジェクトによって `'error'` イベントが発生したときに発生します。

#### イベント: `'stream'` {#event-stream_1}

**追加: v8.4.0**

- `stream` [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream) ストリームへの参照
- `headers` [\<HTTP/2 Headers Object\>](/ja/nodejs/api/http2#headers-object) ヘッダーを記述するオブジェクト
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連付けられた数値フラグ
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 生のヘッダー名とそれぞれの値を含む配列。

`'stream'` イベントは、サーバーに関連付けられた `Http2Session` によって `'stream'` イベントが発生したときに発生します。

[`Http2Session` の `'stream'` イベント](/ja/nodejs/api/http2#event-stream)も参照してください。



::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Event: `'timeout'` {#event-timeout_2}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v8.4.0 | Added in: v8.4.0 |
:::

`'timeout'` イベントは、`http2server.setTimeout()` を使用して設定されたミリ秒数でサーバーにアクティビティがない場合に発生します。**デフォルト:** 0 (タイムアウトなし)

#### `server.close([callback])` {#serverclosecallback}

**Added in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function)

サーバーが新しいセッションを確立するのを停止します。これにより、HTTP/2 セッションの永続的な性質により、新しいリクエストストリームが作成されるのを防ぐことはできません。サーバーを正常にシャットダウンするには、すべてのアクティブなセッションで [`http2session.close()`](/ja/nodejs/api/http2#http2sessionclosecallback) を呼び出します。

`callback` が提供されている場合、サーバーが新しいセッションを許可することをすでに停止していても、すべてのアクティブなセッションが閉じられるまで呼び出されません。詳細については、[`net.Server.close()`](/ja/nodejs/api/net#serverclosecallback) を参照してください。

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.4.0**

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[`server.close()`](/ja/nodejs/api/http2#serverclosecallback) を呼び出し、サーバーが閉じたときに解決される Promise を返します。

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** 0 (タイムアウトなし)
- `callback` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<Http2Server\>](/ja/nodejs/api/http2#class-http2server)

http2 サーバーのリクエストのタイムアウト値を設定するために使用し、`msecs` ミリ秒後に `Http2Server` でアクティビティがない場合に呼び出されるコールバック関数を設定します。

指定されたコールバックは、`'timeout'` イベントのリスナーとして登録されます。

`callback` が関数でない場合、新しい `ERR_INVALID_ARG_TYPE` エラーがスローされます。


#### `server.timeout` {#servertimeout}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タイムアウトまでの時間 (ミリ秒単位)。**デフォルト:** 0 (タイムアウトなし)

ソケットがタイムアウトしたと見なされるまでの非アクティブな時間 (ミリ秒単位)。

`0` の値を指定すると、受信接続でのタイムアウト動作が無効になります。

ソケットのタイムアウトロジックは接続時に設定されるため、この値を変更しても、サーバーへの新しい接続にのみ影響し、既存の接続には影響しません。

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**追加: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object)

提供された設定でサーバーを更新するために使用されます。

無効な `settings` 値の場合、`ERR_HTTP2_INVALID_SETTING_VALUE` をスローします。

無効な `settings` 引数の場合、`ERR_INVALID_ARG_TYPE` をスローします。

### クラス: `Http2SecureServer` {#class-http2secureserver}

**追加: v8.4.0**

- 拡張: [\<tls.Server\>](/ja/nodejs/api/tls#class-tlsserver)

`Http2SecureServer` のインスタンスは、`http2.createSecureServer()` 関数を使用して作成されます。`Http2SecureServer` クラスは、`node:http2` モジュールによって直接エクスポートされません。

#### イベント: `'checkContinue'` {#event-checkcontinue_1}

**追加: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

[`'request'`](/ja/nodejs/api/http2#event-request) リスナーが登録されているか、[`http2.createSecureServer()`](/ja/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) にコールバック関数が指定されている場合、HTTP `Expect: 100-continue` を持つリクエストを受信するたびに `'checkContinue'` イベントが発生します。このイベントがリッスンされていない場合、サーバーは必要に応じてステータス `100 Continue` で自動的に応答します。

このイベントを処理するには、クライアントがリクエスト本文を送信し続ける場合は [`response.writeContinue()`](/ja/nodejs/api/http2#responsewritecontinue) を呼び出し、クライアントがリクエスト本文を送信し続けるべきでない場合は適切な HTTP 応答 (例: 400 Bad Request) を生成します。

このイベントが発生して処理される場合、[`'request'`](/ja/nodejs/api/http2#event-request) イベントは発生しません。


#### イベント: `'connection'` {#event-connection_1}

**追加: v8.4.0**

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このイベントは、TLSハンドシェイクが始まる前に、新しいTCPストリームが確立されたときに発生します。`socket`は通常、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) 型のオブジェクトです。通常、ユーザーはこのイベントにアクセスする必要はありません。

このイベントは、HTTPサーバーに接続を注入するために、ユーザーによって明示的に発生させることもできます。その場合、任意の [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームを渡すことができます。

#### イベント: `'request'` {#event-request_1}

**追加: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

リクエストがあるたびに発生します。セッションごとに複数のリクエストがある場合があります。[互換性 API](/ja/nodejs/api/http2#compatibility-api) を参照してください。

#### イベント: `'session'` {#event-session_1}

**追加: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ja/nodejs/api/http2#class-serverhttp2session)

`'session'` イベントは、`Http2Session` が `Http2SecureServer` によって作成されたときに発生します。

#### イベント: `'sessionError'` {#event-sessionerror_1}

**追加: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ja/nodejs/api/http2#class-serverhttp2session)

`'sessionError'` イベントは、`Http2SecureServer` に関連付けられた `Http2Session` オブジェクトによって `'error'` イベントが発生したときに発生します。

#### イベント: `'stream'` {#event-stream_2}

**追加: v8.4.0**

- `stream` [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream) ストリームへの参照
- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object) ヘッダーを記述するオブジェクト
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連付けられた数値フラグ
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 生のヘッダー名とそれぞれの値を含む配列。

`'stream'` イベントは、サーバーに関連付けられた `Http2Session` によって `'stream'` イベントが発生したときに発生します。

[`Http2Session` の `'stream'` イベント](/ja/nodejs/api/http2#event-stream) も参照してください。

::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### イベント: `'timeout'` {#event-timeout_3}

**追加:** v8.4.0

`'timeout'` イベントは、`http2secureServer.setTimeout()` で設定されたミリ秒数だけサーバー上でアクティビティがない場合に発生します。 **デフォルト:** 2 分。

#### イベント: `'unknownProtocol'` {#event-unknownprotocol}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | クライアントが TLS ハンドシェイク中に ALPN 拡張を送信しなかった場合にのみ、このイベントが発生します。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

`'unknownProtocol'` イベントは、接続クライアントが許可されたプロトコル (HTTP/2 または HTTP/1.1) のネゴシエーションに失敗した場合に発生します。イベントハンドラーは処理のためにソケットを受け取ります。このイベントに対してリスナーが登録されていない場合、接続は終了されます。タイムアウトは、[`http2.createSecureServer()`](/ja/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) に渡される `'unknownProtocolTimeout'` オプションを使用して指定できます。

Node.js の以前のバージョンでは、`allowHTTP1` が `false` であり、TLS ハンドシェイク中に、クライアントが ALPN 拡張を送信しないか、HTTP/2 (`h2`) を含まない ALPN 拡張を送信した場合に、このイベントが発生していました。新しいバージョンの Node.js では、`allowHTTP1` が `false` であり、クライアントが ALPN 拡張を送信しない場合にのみ、このイベントが発生します。クライアントが HTTP/2 (または `allowHTTP1` が `true` の場合は HTTP/1.1) を含まない ALPN 拡張を送信した場合、TLS ハンドシェイクは失敗し、セキュアな接続は確立されません。

[互換性 API](/ja/nodejs/api/http2#compatibility-api) を参照してください。

#### `server.close([callback])` {#serverclosecallback_1}

**追加:** v8.4.0

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

サーバーが新しいセッションを確立するのを停止します。これは、HTTP/2 セッションの永続的な性質により、新しいリクエストストリームの作成を妨げるものではありません。サーバーを正常にシャットダウンするには、すべてのアクティブなセッションで [`http2session.close()`](/ja/nodejs/api/http2#http2sessionclosecallback) を呼び出してください。

`callback` が提供されている場合、サーバーが新しいセッションを許可しなくなっていても、すべてのアクティブなセッションが閉じられるまで呼び出されません。詳細については、[`tls.Server.close()`](/ja/nodejs/api/tls#serverclosecallback) を参照してください。


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `120000` (2 分)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<Http2SecureServer\>](/ja/nodejs/api/http2#class-http2secureserver)

http2 セキュアサーバーリクエストのタイムアウト値を設定するために使用され、`msecs` ミリ秒後に `Http2SecureServer` でアクティビティがない場合に呼び出されるコールバック関数を設定します。

指定されたコールバックは、`'timeout'` イベントのリスナーとして登録されます。

`callback` が関数でない場合、新しい `ERR_INVALID_ARG_TYPE` エラーがスローされます。

#### `server.timeout` {#servertimeout_1}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タイムアウト時間 (ミリ秒単位)。 **デフォルト:** 0 (タイムアウトなし)

ソケットがタイムアウトしたと見なされるまでの非アクティブ時間 (ミリ秒単位)。

値が `0` の場合、受信接続でのタイムアウト動作が無効になります。

ソケットのタイムアウトロジックは接続時に設定されるため、この値を変更しても、既存の接続には影響せず、サーバーへの新しい接続にのみ影響します。

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**追加: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object)

指定された設定でサーバーを更新するために使用されます。

無効な `settings` 値に対して `ERR_HTTP2_INVALID_SETTING_VALUE` をスローします。

無効な `settings` 引数に対して `ERR_INVALID_ARG_TYPE` をスローします。

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | `streamResetBurst` と `streamResetRate` が追加されました。 |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` は、`PADDING_STRATEGY_ALIGNED` を指定するのと同じになり、`selectPadding` は削除されました。 |
| v13.3.0, v12.16.0 | デフォルト値が 100 の `maxSessionRejectedStreams` オプションが追加されました。 |
| v13.3.0, v12.16.0 | デフォルト値が 1000 の `maxSessionInvalidFrames` オプションが追加されました。 |
| v12.4.0 | `options` パラメーターが `net.createServer()` オプションをサポートするようになりました。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | デフォルト値が 10000 の `unknownProtocolTimeout` オプションが追加されました。 |
| v14.4.0, v12.18.0, v10.21.0 | デフォルト値が 32 の `maxSettings` オプションが追加されました。 |
| v9.6.0 | `Http1IncomingMessage` および `Http1ServerResponse` オプションが追加されました。 |
| v8.9.3 | デフォルトの制限が 10 の `maxOutstandingPings` オプションが追加されました。 |
| v8.9.3 | デフォルトの制限が 128 ヘッダーペアの `maxHeaderListPairs` オプションが追加されました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーフィールドをデフレートするための最大動的テーブルサイズを設定します。 **デフォルト:** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` フレームごとの設定エントリの最大数を設定します。 許可される最小値は `1` です。 **デフォルト:** `32`。
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` が使用を許可されている最大メモリを設定します。 値はメガバイト数で表されます (例: `1` は 1 メガバイトに相当します)。 許可される最小値は `1` です。 これはクレジットベースの制限であり、既存の `Http2Stream` によってこの制限を超える可能性がありますが、この制限を超えている間は新しい `Http2Stream` インスタンスは拒否されます。 現在の `Http2Stream` セッション数、ヘッダー圧縮テーブルの現在のメモリ使用量、送信待ちの現在のデータ、および未確認の `PING` および `SETTINGS` フレームはすべて、現在の制限にカウントされます。 **デフォルト:** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーエントリの最大数を設定します。 これは、`node:http` モジュールの [`server.maxHeadersCount`](/ja/nodejs/api/http#servermaxheaderscount) または [`request.maxHeadersCount`](/ja/nodejs/api/http#requestmaxheaderscount) と似ています。 最小値は `4` です。 **デフォルト:** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 未処理の、未確認の ping の最大数を設定します。 **デフォルト:** `10`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) シリアル化され、圧縮されたヘッダーのブロックの最大許容サイズを設定します。 この制限を超えるヘッダーを送信しようとすると、`'frameError'` イベントが発生し、ストリームが閉じられ、破棄されます。 これはヘッダーのブロック全体の最大許容サイズを設定しますが、`nghttp2` (内部 http2 ライブラリ) には、圧縮されていないキーと値のペアごとに `65536` の制限があります。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` フレームと `DATA` フレームに使用するパディングの量を決定するために使用される戦略。 **デフォルト:** `http2.constants.PADDING_STRATEGY_NONE`。 値は次のいずれかになります。
    - `http2.constants.PADDING_STRATEGY_NONE`: パディングは適用されません。
    - `http2.constants.PADDING_STRATEGY_MAX`: 内部実装によって決定される、最大量のパディングが適用されます。
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 合計フレーム長 (9 バイトのヘッダーを含む) が 8 の倍数になるように、十分なパディングを適用しようとします。 各フレームについて、現在のフロー制御の状態と設定によって決定される、パディングバイトの最大許容数があります。 この最大値が、アライメントを保証するために必要な計算量よりも小さい場合、最大値が使用され、合計フレーム長が必ずしも 8 バイトでアライメントされるとは限りません。

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` フレームを受信したかのように、リモートピアの同時ストリームの最大数を設定します。 リモートピアが `maxConcurrentStreams` の独自の値を設定している場合、上書きされます。 **デフォルト:** `100`。
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) セッションが閉じられるまでに許容される無効なフレームの最大数を設定します。 **デフォルト:** `1000`。
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) セッションが閉じられるまでに許容される、作成時に拒否されたストリームの最大数を設定します。 各拒否は、ピアにこれ以上ストリームを開かないように指示する必要がある `NGHTTP2_ENHANCE_YOUR_CALM` エラーに関連付けられています。したがって、ストリームを開き続けることは、誤った動作をするピアの兆候と見なされます。 **デフォルト:** `100`。
    - `settings` [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object) 接続時にリモートピアに送信する初期設定。
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) および `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 受信ストリームリセット (RST_STREAM フレーム) のレート制限を設定します。 いずれかの効果を得るには、両方の設定を設定する必要があり、デフォルトはそれぞれ 1000 と 33 です。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数の値の配列は、受信した remoteSettings の `CustomSettings` プロパティに含まれる設定タイプを決定します。 許可される設定タイプに関する詳細については、`Http2Settings` オブジェクトの `CustomSettings` プロパティを参照してください。
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage) HTTP/1 フォールバックに使用される `IncomingMessage` クラスを指定します。 元の `http.IncomingMessage` を拡張するのに役立ちます。 **デフォルト:** `http.IncomingMessage`。
    - `Http1ServerResponse` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse) HTTP/1 フォールバックに使用される `ServerResponse` クラスを指定します。 元の `http.ServerResponse` を拡張するのに役立ちます。 **デフォルト:** `http.ServerResponse`。
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest) 使用する `Http2ServerRequest` クラスを指定します。 元の `Http2ServerRequest` を拡張するのに役立ちます。 **デフォルト:** `Http2ServerRequest`。
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse) 使用する `Http2ServerResponse` クラスを指定します。 元の `Http2ServerResponse` を拡張するのに役立ちます。 **デフォルト:** `Http2ServerResponse`。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サーバーが [`'unknownProtocol'`](/ja/nodejs/api/http2#event-unknownprotocol) が発行されたときに待機する必要があるタイムアウトをミリ秒単位で指定します。 その時間までにソケットが破棄されていない場合、サーバーはそれを破棄します。 **デフォルト:** `10000`。
    - ...: [`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener) オプションはすべて指定できます。

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [互換性 API](/ja/nodejs/api/http2#compatibility-api) を参照してください
- 戻り値: [\<Http2Server\>](/ja/nodejs/api/http2#class-http2server)

`Http2Session` インスタンスを作成および管理する `net.Server` インスタンスを返します。

[暗号化されていない HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption) をサポートする既知のブラウザがないため、ブラウザクライアントと通信する場合は [`http2.createSecureServer()`](/ja/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) の使用が必要です。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 暗号化されていない HTTP/2 サーバーを作成します。
// 暗号化されていない HTTP/2 をサポートする既知のブラウザがないため、
// ブラウザクライアントと通信する場合は `createSecureServer()` の使用が必要です。
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 暗号化されていない HTTP/2 サーバーを作成します。
// 暗号化されていない HTTP/2 をサポートする既知のブラウザがないため、
// ブラウザクライアントと通信する場合は `http2.createSecureServer()` の使用が必要です。
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` が `PADDING_STRATEGY_ALIGNED` の提供と同等になり、`selectPadding` が削除されました。 |
| v13.3.0, v12.16.0 | デフォルト値が 100 の `maxSessionRejectedStreams` オプションが追加されました。 |
| v13.3.0, v12.16.0 | デフォルト値が 1000 の `maxSessionInvalidFrames` オプションが追加されました。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | デフォルト値が 10000 の `unknownProtocolTimeout` オプションが追加されました。 |
| v14.4.0, v12.18.0, v10.21.0 | デフォルト値が 32 の `maxSettings` オプションが追加されました。 |
| v10.12.0 | `Http2Session` の起動時に `ORIGIN` フレームを自動的に送信する `origins` オプションが追加されました。 |
| v8.9.3 | デフォルトの制限値が 10 の `maxOutstandingPings` オプションが追加されました。 |
| v8.9.3 | デフォルトの制限値が 128 ヘッダーペアの `maxHeaderListPairs` オプションが追加されました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) HTTP/2 をサポートしていない着信クライアント接続は、`true` に設定すると HTTP/1.x にダウングレードされます。[`'unknownProtocol'`](/ja/nodejs/api/http2#event-unknownprotocol) イベントを参照してください。[ALPN ネゴシエーション](/ja/nodejs/api/http2#alpn-negotiation) を参照してください。**デフォルト:** `false`。
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーフィールドをデフレートするための最大動的テーブルサイズを設定します。**デフォルト:** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` フレームあたりの設定エントリの最大数を設定します。許可される最小値は `1` です。**デフォルト:** `32`。
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` が使用できる最大メモリを設定します。値はメガバイト単位で表されます。たとえば、`1` は 1 メガバイトに相当します。許可される最小値は `1` です。これはクレジットベースの制限であり、既存の `Http2Stream` がこの制限を超える可能性がありますが、この制限を超えている間は新しい `Http2Stream` インスタンスは拒否されます。現在の `Http2Stream` セッション数、ヘッダー圧縮テーブルの現在のメモリ使用量、送信キューに入れられた現在のデータ、および未確認の `PING` および `SETTINGS` フレームはすべて、現在の制限に対してカウントされます。**デフォルト:** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーエントリの最大数を設定します。これは、`node:http` モジュールの [`server.maxHeadersCount`](/ja/nodejs/api/http#servermaxheaderscount) または [`request.maxHeadersCount`](/ja/nodejs/api/http#requestmaxheaderscount) と同様です。最小値は `4` です。**デフォルト:** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 未処理で未確認の ping の最大数を設定します。**デフォルト:** `10`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) シリアル化された圧縮ヘッダーブロックの最大許容サイズを設定します。この制限を超えるヘッダーを送信しようとすると、`'frameError'` イベントが発生し、ストリームが閉じて破棄されます。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` および `DATA` フレームに使用するパディングの量を決定するために使用される戦略。**デフォルト:** `http2.constants.PADDING_STRATEGY_NONE`。値は次のいずれかになります。
    - `http2.constants.PADDING_STRATEGY_NONE`: パディングは適用されません。
    - `http2.constants.PADDING_STRATEGY_MAX`: 内部実装によって決定されるパディングの最大量が適用されます。
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 9 バイトのヘッダーを含む合計フレーム長が 8 の倍数になるように、十分なパディングを適用しようとします。フレームごとに、現在のフロー制御の状態と設定によって決定される、許可されるパディングバイトの最大数があります。この最大値がアライメントを保証するために必要な計算された量よりも小さい場合、最大値が使用され、合計フレーム長は必ずしも 8 バイトでアライメントされません。
    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` フレームを受信した場合と同様に、リモートピアの同時ストリームの最大数を設定します。リモートピアが `maxConcurrentStreams` の独自の値に設定すると、オーバーライドされます。**デフォルト:** `100`。
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) セッションが閉じられるまでに許容される無効なフレームの最大数を設定します。**デフォルト:** `1000`。
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) セッションが閉じられるまでに許容される、作成時に拒否されたストリームの最大数を設定します。各拒否は `NGHTTP2_ENHANCE_YOUR_CALM` エラーに関連付けられており、ピアにこれ以上ストリームを開かないように指示する必要があります。したがって、ストリームを開き続けることは、不正なピアの兆候と見なされます。**デフォルト:** `100`。
    - `settings` [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object) 接続時にリモートピアに送信する初期設定。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数の値の配列は、受信した remoteSettings の `customSettings` プロパティに含まれる設定タイプを決定します。許可される設定タイプについては、`Http2Settings` オブジェクトの `customSettings` プロパティを参照してください。
    - ...: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) オプションはすべて指定できます。サーバーの場合、ID オプション (`pfx` または `key`/`cert`) は通常必要です。
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しいサーバー `Http2Session` の作成直後に `ORIGIN` フレーム内で送信するオリジン文字列の配列。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サーバーが [`'unknownProtocol'`](/ja/nodejs/api/http2#event-unknownprotocol) イベントが発行されたときに待機する必要があるタイムアウトをミリ秒単位で指定します。ソケットがその時間までに破棄されていない場合、サーバーはそれを破棄します。**デフォルト:** `10000`。

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [互換性 API](/ja/nodejs/api/http2#compatibility-api) を参照してください。
- 戻り値: [\<Http2SecureServer\>](/ja/nodejs/api/http2#class-http2secureserver)

`Http2Session` インスタンスを作成および管理する `tls.Server` インスタンスを返します。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` が `PADDING_STRATEGY_ALIGNED` を提供するのと同じになり、`selectPadding` が削除されました。 |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | デフォルト値が 10000 の `unknownProtocolTimeout` オプションが追加されました。 |
| v14.4.0, v12.18.0, v10.21.0 | デフォルト値が 32 の `maxSettings` オプションが追加されました。 |
| v8.9.3 | デフォルト制限が 10 の `maxOutstandingPings` オプションが追加されました。 |
| v8.9.3 | デフォルト制限が 128 ヘッダーペアの `maxHeaderListPairs` オプションが追加されました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 接続先のリモート HTTP/2 サーバー。これは、`http://` または `https://` プレフィックス、ホスト名、および IP ポート（デフォルト以外のポートが使用されている場合）を持つ最小限の有効な URL の形式である必要があります。URL のユーザー情報（ユーザー ID とパスワード）、パス、クエリストリング、およびフラグメントの詳細は無視されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーフィールドをデフレートするための最大の動的テーブルサイズを設定します。**デフォルト:** `4Kib`。
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` フレームあたりの設定エントリの最大数を設定します。許容される最小値は `1` です。**デフォルト:** `32`。
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` が使用できる最大のメモリを設定します。値はメガバイト数で表されます（例：`1` は 1 メガバイトに相当）。許容される最小値は `1` です。これはクレジットベースの制限であり、既存の `Http2Stream` によってこの制限を超える可能性がありますが、この制限を超えている間は新しい `Http2Stream` インスタンスは拒否されます。現在の `Http2Stream` セッション数、ヘッダー圧縮テーブルの現在のメモリ使用量、送信待ちの現在のデータ、未確認の `PING` および `SETTINGS` フレームはすべて、現在の制限にカウントされます。**デフォルト:** `10`。
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダーエントリの最大数を設定します。これは、`node:http` モジュールの [`server.maxHeadersCount`](/ja/nodejs/api/http#servermaxheaderscount) または [`request.maxHeadersCount`](/ja/nodejs/api/http#requestmaxheaderscount) と同様です。最小値は `1` です。**デフォルト:** `128`。
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 未処理の、未確認の ping の最大数を設定します。**デフォルト:** `10`。
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) クライアントが任意の時点で受け入れる予約済みプッシュストリームの最大数を設定します。現在予約されているプッシュストリームの数がこの制限に達すると、サーバーから送信された新しいプッシュストリームは自動的に拒否されます。許容される最小値は 0 です。許容される最大値は 2-1 です。負の値はこのオプションを許容される最大値に設定します。**デフォルト:** `200`。
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) シリアライズされ、圧縮されたヘッダーのブロックに対して許可される最大サイズを設定します。この制限を超えるヘッダーを送信しようとすると、`'frameError'` イベントが発行され、ストリームが閉じられて破棄されます。
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` および `DATA` フレームに使用するパディングの量を決定するために使用される戦略。**デフォルト:** `http2.constants.PADDING_STRATEGY_NONE`。値は次のいずれかになります。
    - `http2.constants.PADDING_STRATEGY_NONE`: パディングは適用されません。
    - `http2.constants.PADDING_STRATEGY_MAX`: 内部実装によって決定される、最大のパディング量が適用されます。
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 9 バイトのヘッダーを含む合計フレーム長が 8 の倍数になるように、十分なパディングを適用しようとします。各フレームには、現在のフロー制御の状態と設定によって決定される、許可されるパディングバイトの最大数があります。この最大数が、アラインメントを確保するために必要な計算量よりも少ない場合、最大値が使用され、合計フレーム長が必ずしも 8 バイトでアラインメントされるとは限りません。
  
 
    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートピアの同時ストリームの最大数を、`SETTINGS` フレームを受信したかのように設定します。リモートピアが `maxConcurrentStreams` の独自の値​​を設定している場合は、オーバーライドされます。**デフォルト:** `100`。
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `authority` で設定されていない場合、接続に使用するプロトコル。値は `'http:'` または `'https:'` のいずれかになります。**デフォルト:** `'https:'`
    - `settings` [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object) 接続時にリモートピアに送信する初期設定。
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 整数の値の配列は、受信した remoteSettings の `CustomSettings` プロパティに含まれる設定タイプを決定します。許可される設定タイプに関する詳細については、`Http2Settings` オブジェクトの `CustomSettings` プロパティを参照してください。
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `connect` に渡された `URL` インスタンスと `options` オブジェクトを受け取り、このセッションの接続として使用される任意の [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームを返すオプションのコールバック。
    - ...: 任意の [`net.connect()`](/ja/nodejs/api/net#netconnect) または [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) オプションを指定できます。
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`'unknownProtocol'`](/ja/nodejs/api/http2#event-unknownprotocol) イベントが発行されたときにサーバーが待機する必要があるタイムアウトをミリ秒単位で指定します。ソケットがその時間までに破棄されていない場合、サーバーはそれを破棄します。**デフォルト:** `10000`。
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connect'`](/ja/nodejs/api/http2#event-connect) イベントの 1 回限りのリスナーとして登録されます。
- 戻り値: [\<ClientHttp2Session\>](/ja/nodejs/api/http2#class-clienthttp2session)

`ClientHttp2Session` インスタンスを返します。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Added in: v8.4.0**

#### `RST_STREAM`と`GOAWAY`のエラーコード {#error-codes-for-rst_stream-and-goaway}

| 値 | 名前 | 定数 |
| --- | --- | --- |
| `0x00` | No Error | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Protocol Error | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Internal Error | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Flow Control Error | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Settings Timeout | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Stream Closed | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Frame Size Error | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Refused Stream | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Cancel | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Compression Error | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Connect Error | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Enhance Your Calm | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Inadequate Security | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 Required | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
`'timeout'` イベントは、`http2server.setTimeout()` を使用して設定された指定されたミリ秒数、サーバーでアクティビティがない場合に発生します。

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Added in: v8.4.0**

- 戻り値: [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object)

`Http2Session` インスタンスのデフォルト設定を含むオブジェクトを返します。このメソッドは呼び出されるたびに新しいオブジェクトインスタンスを返すため、返されたインスタンスは安全に使用するために変更できます。

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Added in: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/ja/nodejs/api/http2#settings-object)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

[HTTP/2](https://tools.ietf.org/html/rfc7540) 仕様で指定されている、指定されたHTTP/2設定のシリアル化された表現を含む `Buffer` インスタンスを返します。これは `HTTP2-Settings` ヘッダーフィールドで使用することを目的としています。

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Added in: v8.4.0**

- `buf` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) パックされた設定。
- 戻り値: [\<HTTP/2 設定オブジェクト\>](/ja/nodejs/api/http2#settings-object)

`http2.getPackedSettings()` によって生成された、指定された `Buffer` からデシリアライズされた設定を含む、[HTTP/2 設定オブジェクト](/ja/nodejs/api/http2#settings-object) を返します。

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Added in: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: [`http2.createServer()`](/ja/nodejs/api/http2#http2createserveroptions-onrequesthandler) のオプションはどれでも指定できます。


- 戻り値: [\<ServerHttp2Session\>](/ja/nodejs/api/http2#class-serverhttp2session)

既存のソケットから HTTP/2 サーバーセッションを作成します。

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Added in: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

このシンボルは、機密と見なされるヘッダーのリストを提供するために、配列値を持つ HTTP/2 ヘッダーオブジェクトのプロパティとして設定できます。詳細については、[機密ヘッダー](/ja/nodejs/api/http2#sensitive-headers) を参照してください。

### ヘッダーオブジェクト {#headers-object}

ヘッダーは、JavaScript オブジェクトの独自のプロパティとして表されます。プロパティキーは小文字にシリアライズされます。プロパティ値は文字列である必要があります (そうでない場合は文字列に強制変換されます)。または、文字列の `Array` (ヘッダーフィールドごとに複数の値を送信するため) である必要があります。

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
コールバック関数に渡されるヘッダーオブジェクトは、`null` プロトタイプを持ちます。これは、`Object.prototype.toString()` や `Object.prototype.hasOwnProperty()` などの通常の JavaScript オブジェクトメソッドが機能しないことを意味します。

受信ヘッダーの場合:

- `:status` ヘッダーは `number` に変換されます。
- `:status`、`:method`、`:authority`、`:scheme`、`:path`、`:protocol`、`age`、`authorization`、`access-control-allow-credentials`、`access-control-max-age`、`access-control-request-method`、`content-encoding`、`content-language`、`content-length`、`content-location`、`content-md5`、`content-range`、`content-type`、`date`、`dnt`、`etag`、`expires`、`from`、`host`、`if-match`、`if-modified-since`、`if-none-match`、`if-range`、`if-unmodified-since`、`last-modified`、`location`、`max-forwards`、`proxy-authorization`、`range`、`referer`、`retry-after`、`tk`、`upgrade-insecure-requests`、`user-agent`、または `x-content-type-options` の重複は破棄されます。
- `set-cookie` は常に配列です。重複は配列に追加されます。
- 重複する `cookie` ヘッダーの場合、値は '; ' で結合されます。
- 他のすべてのヘッダーの場合、値は ', ' で結合されます。



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### センシティブなヘッダー {#sensitive-headers}

HTTP2ヘッダーはセンシティブとしてマークできます。これは、HTTP/2ヘッダー圧縮アルゴリズムがそれらをインデックスしないことを意味します。これは、エントロピーが低く、攻撃者にとって価値があると見なされる可能性があるヘッダー値（例：`Cookie`や`Authorization`）にとって意味があります。これを実現するには、ヘッダー名を配列として`[http2.sensitiveHeaders]`プロパティに追加します。

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
`Authorization`や短い`Cookie`ヘッダーなど、一部のヘッダーでは、このフラグは自動的に設定されます。

このプロパティは、受信したヘッダーにも設定されます。これには、自動的にマークされたものを含め、センシティブとしてマークされたすべてのヘッダーの名前が含まれます。

### Settingsオブジェクト {#settings-object}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.12.0 | `maxConcurrentStreams`設定がより厳密になりました。 |
| v8.9.3 | `maxHeaderListSize`設定が厳密に適用されるようになりました。 |
| v8.4.0 | v8.4.0で追加 |
:::

`http2.getDefaultSettings()`、`http2.getPackedSettings()`、`http2.createServer()`、`http2.createSecureServer()`、`http2session.settings()`、`http2session.localSettings`、および`http2session.remoteSettings` APIは、`Http2Session`オブジェクトの構成設定を定義するオブジェクトを返すか、入力として受信します。これらのオブジェクトは、次のプロパティを含む通常のJavaScriptオブジェクトです。

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ヘッダー圧縮に使用される最大バイト数を指定します。許可される最小値は0です。許可される最大値は2^32-1です。 **デフォルト:** `4096`。
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) HTTP/2プッシュストリームを`Http2Session`インスタンスで許可する場合は`true`を指定します。 **デフォルト:** `true`。
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームレベルのフロー制御のために、*送信者*の初期ウィンドウサイズをバイト単位で指定します。許可される最小値は0です。許可される最大値は2^32-1です。 **デフォルト:** `65535`。
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最大フレームペイロードのサイズをバイト単位で指定します。許可される最小値は16,384です。許可される最大値は2^24-1です。 **デフォルト:** `16384`。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`で許可される同時ストリームの最大数を指定します。デフォルト値はありません。これは、少なくとも理論的には、`Http2Session`で任意の時点で2^31-1ストリームを同時に開くことができることを意味します。最小値は0です。許可される最大値は2^31-1です。 **デフォルト:** `4294967295`。
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 受け入れられるヘッダーリストの最大サイズ（圧縮されていないオクテット）を指定します。許可される最小値は0です。許可される最大値は2^32-1です。 **デフォルト:** `65535`。
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `maxHeaderListSize`のエイリアス。
- `enableConnectProtocol` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [RFC 8441](https://tools.ietf.org/html/rfc8441)で定義されている「拡張コネクトプロトコル」を有効にする場合は`true`を指定します。この設定は、サーバーから送信された場合にのみ意味があります。特定の`Http2Session`で`enableConnectProtocol`設定が有効になると、無効にすることはできません。 **デフォルト:** `false`。
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) ノードおよび基盤となるライブラリにまだ実装されていない追加の設定を指定します。オブジェクトのキーは、設定タイプの数値（[RFC 7540]によって確立された「HTTP/2 SETTINGS」レジストリで定義されている）を定義し、値は設定の実際の数値を定義します。設定タイプは、1から2^16-1の範囲の整数でなければなりません。ノードですでに処理されている設定タイプ、つまり現在6よりも大きいものであってはなりませんが、エラーではありません。値は、0から2^32-1の範囲の符号なし整数である必要があります。現在、最大10個のカスタム設定がサポートされています。これは、SETTINGSの送信、またはサーバーまたはクライアントオブジェクトの`remoteCustomSettings`オプションで指定された設定値の受信でのみサポートされています。設定が将来のノードバージョンでネイティブにサポートされる場合に備えて、ネイティブに処理される設定のインターフェイスで、設定IDの`customSettings`メカニズムを混在させないでください。

settingsオブジェクトのその他すべてのプロパティは無視されます。


### エラー処理 {#error-handling}

`node:http2` モジュールを使用する際に発生する可能性のあるエラー条件はいくつかあります。

検証エラーは、不正な引数、オプション、または設定値が渡された場合に発生します。これらは常に同期的な `throw` によって報告されます。

状態エラーは、誤ったタイミングでアクションが試行された場合に発生します（たとえば、ストリームが閉じた後にストリームでデータを送信しようとするなど）。これらは、エラーが発生する場所とタイミングに応じて、同期的な `throw` または `Http2Stream`、`Http2Session`、または HTTP/2 Server オブジェクトの `'error'` イベントを介して報告されます。

内部エラーは、HTTP/2 セッションが予期せず失敗した場合に発生します。これらは、`Http2Session` または HTTP/2 Server オブジェクトの `'error'` イベントを介して報告されます。

プロトコルエラーは、さまざまな HTTP/2 プロトコルの制約に違反した場合に発生します。これらは、エラーが発生する場所とタイミングに応じて、同期的な `throw` または `Http2Stream`、`Http2Session`、または HTTP/2 Server オブジェクトの `'error'` イベントを介して報告されます。

### ヘッダー名と値における無効な文字の処理 {#invalid-character-handling-in-header-names-and-values}

HTTP/2 の実装では、HTTP ヘッダー名と値における無効な文字の処理が HTTP/1 の実装よりも厳密になっています。

ヘッダーフィールド名は*大文字と小文字を区別しません*。また、ワイヤ上では厳密に小文字の文字列として送信されます。Node.js によって提供される API では、ヘッダー名を混合ケースの文字列（例：`Content-Type`）として設定できますが、送信時に小文字（例：`content-type`）に変換されます。

ヘッダーフィールド名には、次の ASCII 文字の 1 つ以上のみを含める*必要があります*：`a`-`z`、`A`-`Z`、`0`-`9`、`!`、`#`、`$`、`%`、`&`、`'`、`*`、`+`、`-`、`.`、`^`、`_`、`` ` ``（バッククォート）、`|`、および `~`。

HTTP ヘッダーフィールド名内で無効な文字を使用すると、プロトコルエラーが報告されてストリームが閉じられます。

ヘッダーフィールド値はより寛容に処理されますが、HTTP 仕様の要件に従って、改行文字またはキャリッジリターン文字を含めるべきではなく、US-ASCII 文字に制限する*必要があります*。


### クライアントでプッシュストリームをプッシュする {#push-streams-on-the-client}

クライアントでプッシュされたストリームを受信するには、`ClientHttp2Session` で `'stream'` イベントのリスナーを設定します。

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // レスポンスヘッダーを処理する
  });
  pushedStream.on('data', (chunk) => { /* プッシュされたデータを処理する */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // レスポンスヘッダーを処理する
  });
  pushedStream.on('data', (chunk) => { /* プッシュされたデータを処理する */ });
});

const req = client.request({ ':path': '/' });
```
:::

### `CONNECT` メソッドのサポート {#supporting-the-connect-method}

`CONNECT` メソッドは、HTTP/2 サーバーが TCP/IP 接続のプロキシとして使用されることを許可するために使用されます。

シンプルな TCP サーバー：

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

HTTP/2 CONNECT プロキシ：

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // CONNECT リクエストのみを受け入れる
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // ホスト名とポートが、このプロキシが接続するべきものかどうかを検証することを強くお勧めします。
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // CONNECT リクエストのみを受け入れる
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // ホスト名とポートが、このプロキシが接続するべきものかどうかを検証することを強くお勧めします。
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

HTTP/2 CONNECT クライアント：

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// CONNECT リクエストでは ':path' および ':scheme' ヘッダーを指定してはいけません
// そうしないとエラーがスローされます。
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// CONNECT リクエストでは ':path' および ':scheme' ヘッダーを指定してはいけません
// そうしないとエラーがスローされます。
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### 拡張 `CONNECT` プロトコル {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) は、HTTP/2 に対する "拡張 CONNECT プロトコル" 拡張を定義しています。これは、他の通信プロトコル (WebSockets など) のトンネルとして `CONNECT` メソッドを使用して `Http2Stream` の使用を開始するために使用できます。

拡張 CONNECT プロトコルの使用は、HTTP/2 サーバーが `enableConnectProtocol` 設定を使用することによって有効になります。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

クライアントが拡張 CONNECT を使用できることを示す `SETTINGS` フレームをサーバーから受信すると、`':protocol'` HTTP/2 疑似ヘッダーを使用する `CONNECT` リクエストを送信できます。

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## 互換性 API {#compatibility-api}

互換性 API は、HTTP/2 を使用する際に HTTP/1 と同様の開発者体験を提供し、[HTTP/1](/ja/nodejs/api/http) と HTTP/2 の両方をサポートするアプリケーションを開発できるようにすることを目的としています。この API は、[HTTP/1](/ja/nodejs/api/http) の **パブリック API** のみを対象としています。ただし、多くのモジュールは内部メソッドまたは状態を使用しており、それらは完全に異なる実装であるため、*サポートされていません*。

次の例は、互換性 API を使用して HTTP/2 サーバーを作成します。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

[HTTPS](/ja/nodejs/api/https) および HTTP/2 サーバーを混在させて作成するには、[ALPN ネゴシエーション](/ja/nodejs/api/http2#alpn-negotiation) セクションを参照してください。非 TLS HTTP/1 サーバーからのアップグレードはサポートされていません。

HTTP/2 互換性 API は、[`Http2ServerRequest`](/ja/nodejs/api/http2#class-http2http2serverrequest) および [`Http2ServerResponse`](/ja/nodejs/api/http2#class-http2http2serverresponse) で構成されています。これらは HTTP/1 との API 互換性を目指していますが、プロトコル間の違いを隠蔽していません。例として、HTTP コードのステータスメッセージは無視されます。


### ALPN ネゴシエーション {#alpn-negotiation}

ALPN ネゴシエーションにより、同じソケット上で [HTTPS](/ja/nodejs/api/https) と HTTP/2 の両方をサポートできます。 `req` および `res` オブジェクトは HTTP/1 または HTTP/2 のいずれかであり、アプリケーションは [HTTP/1](/ja/nodejs/api/http) の公開 API のみに制限し、HTTP/2 のより高度な機能を使用できるかどうかを検出**する必要があります**。

次の例は、両方のプロトコルをサポートするサーバーを作成します。

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // HTTPS リクエストか HTTP/2 かを検出します
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // HTTPS リクエストか HTTP/2 かを検出します
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

`'request'` イベントは、[HTTPS](/ja/nodejs/api/https) と HTTP/2 の両方で同じように動作します。

### Class: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**追加:** v8.4.0

- 拡張: [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

`Http2ServerRequest` オブジェクトは、[`http2.Server`](/ja/nodejs/api/http2#class-http2server) または [`http2.SecureServer`](/ja/nodejs/api/http2#class-http2secureserver) によって作成され、[`'request'`](/ja/nodejs/api/http2#event-request) イベントの最初の引数として渡されます。 リクエストのステータス、ヘッダー、およびデータにアクセスするために使用できます。


#### イベント: `'aborted'` {#event-aborted_1}

**追加: v8.4.0**

`'aborted'` イベントは、`Http2ServerRequest`インスタンスが通信中に異常に中断された場合に発生します。

`'aborted'` イベントは、`Http2ServerRequest`の書き込み側がまだ終了していない場合にのみ発生します。

#### イベント: `'close'` {#event-close_2}

**追加: v8.4.0**

基になる[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream)が閉じられたことを示します。 `'end'` と同様に、このイベントはレスポンスごとに一度だけ発生します。

#### `request.aborted` {#requestaborted}

**追加: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

リクエストが中断された場合、`request.aborted`プロパティは`true`になります。

#### `request.authority` {#requestauthority}

**追加: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リクエストのオーソリティ擬似ヘッダーフィールド。 HTTP/2 ではリクエストで `:authority` または `host` のいずれかを設定できるため、この値は、`req.headers[':authority']` が存在する場合はそこから導出されます。 そうでない場合は、`req.headers['host']` から導出されます。

#### `request.complete` {#requestcomplete}

**追加: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

リクエストが完了、中断、または破棄された場合、`request.complete`プロパティは`true`になります。

#### `request.connection` {#requestconnection}

**追加: v8.4.0**

**非推奨: v13.0.0 から**

::: danger [安定性: 0 - 非推奨]
[安定性: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 [`request.socket`](/ja/nodejs/api/http2#requestsocket) を使用してください。
:::

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

[`request.socket`](/ja/nodejs/api/http2#requestsocket) を参照してください。

#### `request.destroy([error])` {#requestdestroyerror}

**追加: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Http2ServerRequest`](/ja/nodejs/api/http2#class-http2http2serverrequest) を受信した [`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) で `destroy()` を呼び出します。 `error` が指定された場合、`'error'` イベントが発生し、`error` がイベントのリスナーに引数として渡されます。

ストリームがすでに破棄されている場合は何も行いません。


#### `request.headers` {#requestheaders}

**Added in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

リクエスト/レスポンスヘッダーオブジェクト。

ヘッダー名と値のキーと値のペア。ヘッダー名は小文字化されます。

```js [ESM]
// 以下のような内容が出力されます:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
[HTTP/2 ヘッダーオブジェクト](/ja/nodejs/api/http2#headers-object) を参照してください。

HTTP/2 では、リクエストパス、ホスト名、プロトコル、およびメソッドは、`:` 文字で始まる特別なヘッダーとして表されます (例: `':path'`)。これらの特別なヘッダーは `request.headers` オブジェクトに含まれます。これらの特別なヘッダーを誤って変更しないように注意する必要があります。変更するとエラーが発生する可能性があります。たとえば、リクエストからすべてのヘッダーを削除するとエラーが発生します。

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // :path ヘッダーが削除されたため失敗します
```
#### `request.httpVersion` {#requesthttpversion}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サーバーリクエストの場合、クライアントによって送信された HTTP バージョン。クライアントレスポンスの場合、接続先のサーバーの HTTP バージョン。 `'2.0'` を返します。

また、`message.httpVersionMajor` は最初の整数であり、`message.httpVersionMinor` は 2 番目の整数です。

#### `request.method` {#requestmethod}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

文字列としてのリクエストメソッド。読み取り専用。例: `'GET'`, `'DELETE'`。

#### `request.rawHeaders` {#requestrawheaders}

**Added in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

受信したとおりの未加工のリクエスト/レスポンスヘッダーのリスト。

キーと値は同じリストにあります。これはタプルのリスト *ではありません*。したがって、偶数番号のオフセットはキー値であり、奇数番号のオフセットは関連付けられた値です。

ヘッダー名は小文字化されず、重複はマージされません。

```js [ESM]
// 以下のような内容が出力されます:
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

#### `request.rawTrailers` {#requestrawtrailers}

**Added in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生のリクエスト/レスポンスのトレーラーキーと値は、受信したとおりに正確に表現されます。 `'end'` イベントでのみ設定されます。

#### `request.scheme` {#requestscheme}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ターゲットURLのスキーム部分を示すリクエストスキームの疑似ヘッダーフィールド。

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Added in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)

[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) のタイムアウト値を `msecs` に設定します。callback が指定された場合、レスポンスオブジェクトの `'timeout'` イベントのリスナーとして追加されます。

リクエスト、レスポンス、またはサーバーに `'timeout'` リスナーが追加されていない場合、[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) はタイムアウト時に破棄されます。ハンドラーがリクエスト、レスポンス、またはサーバーの `'timeout'` イベントに割り当てられている場合、タイムアウトしたソケットは明示的に処理する必要があります。

#### `request.socket` {#requestsocket}

**Added in: v8.4.0**

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`net.Socket` (または `tls.TLSSocket`) として機能する `Proxy` オブジェクトを返しますが、HTTP/2 ロジックに基づいてゲッター、セッター、およびメソッドを適用します。

`destroyed`、`readable`、および `writable` プロパティは、`request.stream` から取得され、`request.stream` に設定されます。

`destroy`、`emit`、`end`、`on`、および `once` メソッドは、`request.stream` で呼び出されます。

`setTimeout` メソッドは、`request.stream.session` で呼び出されます。

`pause`、`read`、`resume`、および `write` は、コード `ERR_HTTP2_NO_SOCKET_MANIPULATION` でエラーをスローします。詳細については、[`Http2Session` とソケット](/ja/nodejs/api/http2#http2session-and-sockets) を参照してください。

他のすべてのインタラクションはソケットに直接ルーティングされます。TLS サポートを使用すると、[`request.socket.getPeerCertificate()`](/ja/nodejs/api/tls#tlssocketgetpeercertificatedetailed) を使用して、クライアントの認証の詳細を取得できます。


#### `request.stream` {#requeststream}

**Added in: v8.4.0**

- [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream)

リクエストをバックアップする[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream)オブジェクト。

#### `request.trailers` {#requesttrailers}

**Added in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

リクエスト/レスポンスのトレーラーオブジェクト。`'end'`イベントでのみ設定されます。

#### `request.url` {#requesturl}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リクエストURL文字列。これには、実際のHTTPリクエストに存在するURLのみが含まれます。リクエストが次のとおりである場合：

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
次に、`request.url`は次のようになります。

```js [ESM]
'/status?name=ryan'
```
URLをその部分に解析するには、`new URL()`を使用できます。

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### クラス: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Added in: v8.4.0**

- 継承元: [\<Stream\>](/ja/nodejs/api/stream#stream)

このオブジェクトは、ユーザーではなくHTTPサーバーによって内部的に作成されます。これは、[`'request'`](/ja/nodejs/api/http2#event-request)イベントへの2番目のパラメータとして渡されます。

#### イベント: `'close'` {#event-close_3}

**Added in: v8.4.0**

基になる[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream)が、[`response.end()`](/ja/nodejs/api/http2#responseenddata-encoding-callback)が呼び出されるか、フラッシュできるようになる前に終了したことを示します。

#### イベント: `'finish'` {#event-finish}

**Added in: v8.4.0**

レスポンスが送信されたときに発生します。より具体的には、このイベントは、レスポンスヘッダーと本文の最後のセグメントが、ネットワーク経由で送信するためにHTTP/2多重化に引き渡されたときに発生します。これは、クライアントがまだ何かを受信したことを意味するものではありません。

このイベントの後、レスポンスオブジェクトでイベントが発生することはもうありません。


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**追加:** v8.4.0

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

このメソッドは、HTTPトレーラーヘッダー（メッセージの最後にあるヘッダー）をレスポンスに追加します。

無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror)がスローされます。

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**追加:** v21.7.0, v20.12.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ヘッダーオブジェクトに単一のヘッダー値を追加します。

値が配列の場合、これはこのメソッドを複数回呼び出すのと同じです。

ヘッダーに以前の値がない場合、これは[`response.setHeader()`](/ja/nodejs/api/http2#responsesetheadername-value)を呼び出すのと同じです。

無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror)がスローされます。

```js [ESM]
// "set-cookie: a" および "set-cookie: b" を含むヘッダーを返します
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**追加:** v8.4.0

**非推奨:** v13.0.0 以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 [`response.socket`](/ja/nodejs/api/http2#responsesocket)を使用してください。
:::

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

[`response.socket`](/ja/nodejs/api/http2#responsesocket)を参照してください。

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v8.4.0 | 追加: v8.4.0 |
:::

- `headers` [\<HTTP/2 ヘッダーオブジェクト\>](/ja/nodejs/api/http2#headers-object) ヘッダーを記述するオブジェクト
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `http2stream.pushStream()`が終了したとき、またはプッシュされた`Http2Stream`の作成試行が失敗または拒否されたとき、あるいは`http2stream.pushStream()`メソッドを呼び出す前に`Http2ServerRequest`の状態が閉じられた場合に一度呼び出されます
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse) 新しく作成された`Http2ServerResponse`オブジェクト
  
 

与えられたヘッダーで[`http2stream.pushStream()`](/ja/nodejs/api/http2#http2streampushstreamheaders-options-callback)を呼び出し、成功した場合に、新しく作成された`Http2ServerResponse`上の与えられた[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream)をコールバックパラメータとしてラップします。 `Http2ServerRequest`が閉じられると、コールバックはエラー`ERR_HTTP2_INVALID_STREAM`で呼び出されます。


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | このメソッドは `ServerResponse` への参照を返すようになりました。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

このメソッドは、すべてのレスポンスヘッダーとボディが送信されたことをサーバーに通知します。サーバーは、このメッセージが完了したと見なす必要があります。メソッド `response.end()` は、各レスポンスで呼び出す必要があります。

`data` が指定されている場合、[`response.write(data, encoding)`](/ja/nodejs/api/http#responsewritechunk-encoding-callback) を呼び出した後に `response.end(callback)` を呼び出すのと同じです。

`callback` が指定されている場合、レスポンスストリームが終了したときに呼び出されます。

#### `response.finished` {#responsefinished}

**Added in: v8.4.0**

**Deprecated since: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated. [`response.writableEnded`](/ja/nodejs/api/http2#responsewritableended) を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

レスポンスが完了したかどうかを示すブール値。最初は `false` です。[`response.end()`](/ja/nodejs/api/http2#responseenddata-encoding-callback) が実行されると、値は `true` になります。

#### `response.getHeader(name)` {#responsegetheadername}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

すでにキューに入れられているが、クライアントに送信されていないヘッダーを読み出します。名前は大文字と小文字を区別しません。

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Added in: v8.4.0**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在の送信ヘッダーの一意な名前を含む配列を返します。 すべてのヘッダー名は小文字です。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Added in: v8.4.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在の送信ヘッダーのシャローコピーを返します。 シャローコピーが使用されるため、さまざまなヘッダー関連の http モジュールメソッドを追加で呼び出すことなく、配列値を変更できます。 返されるオブジェクトのキーはヘッダー名であり、値はそれぞれのヘッダー値です。 すべてのヘッダー名は小文字です。

`response.getHeaders()` メソッドによって返されるオブジェクトは、JavaScript の `Object` からプロトタイプ的に継承*しません*。 これは、`obj.toString()`、`obj.hasOwnProperty()` などの典型的な `Object` メソッドが定義されておらず、*動作しない*ことを意味します。

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name` で識別されるヘッダーが現在の送信ヘッダーに設定されている場合は `true` を返します。 ヘッダー名の大文字と小文字は区別されません。

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ヘッダーが送信された場合は true、そうでない場合は false（読み取り専用）。


#### `response.removeHeader(name)` {#responseremoveheadername}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

暗黙的な送信のためにキューに入れられたヘッダーを削除します。

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Added in: v15.7.0**

- [\<http2.Http2ServerRequest\>](/ja/nodejs/api/http2#class-http2http2serverrequest)

元の HTTP2 `request` オブジェクトへの参照。

#### `response.sendDate` {#responsesenddate}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true の場合、Date ヘッダーがヘッダーにまだ存在しない場合、自動的に生成され、レスポンスで送信されます。デフォルトは true です。

これはテストでのみ無効にする必要があります。HTTP ではレスポンスに Date ヘッダーが必要です。

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

暗黙的なヘッダーに対して単一のヘッダー値を設定します。このヘッダーが送信されるヘッダーに既に存在する場合、その値は置き換えられます。同じ名前で複数のヘッダーを送信するには、文字列の配列を使用します。

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
または

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

ヘッダーが [`response.setHeader()`](/ja/nodejs/api/http2#responsesetheadername-value) で設定されている場合、それらは [`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーとマージされ、[`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーが優先されます。

```js [ESM]
// content-type = text/plain を返します
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Added in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) のタイムアウト値を `msecs` に設定します。callback が提供された場合、レスポンスオブジェクトの `'timeout'` イベントのリスナーとして追加されます。

リクエスト、レスポンス、またはサーバーに `'timeout'` リスナーが追加されていない場合、[`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) はタイムアウト時に破棄されます。ハンドラーがリクエスト、レスポンス、またはサーバーの `'timeout'` イベントに割り当てられている場合、タイムアウトしたソケットは明示的に処理する必要があります。

#### `response.socket` {#responsesocket}

**Added in: v8.4.0**

- [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`net.Socket` (または `tls.TLSSocket`) として動作する `Proxy` オブジェクトを返しますが、HTTP/2 ロジックに基づいてゲッター、セッター、およびメソッドを適用します。

`destroyed`、`readable`、および `writable` プロパティは、`response.stream` から取得され、設定されます。

`destroy`、`emit`、`end`、`on`、および `once` メソッドは、`response.stream` で呼び出されます。

`setTimeout` メソッドは、`response.stream.session` で呼び出されます。

`pause`、`read`、`resume`、および `write` は、コード `ERR_HTTP2_NO_SOCKET_MANIPULATION` でエラーをスローします。詳細については、[`Http2Session` とソケット](/ja/nodejs/api/http2#http2session-and-sockets) を参照してください。

他のすべてのインタラクションは、ソケットに直接ルーティングされます。

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**追加: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

暗黙的なヘッダーを使用している場合（[`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)を明示的に呼び出さない場合）、このプロパティは、ヘッダーがフラッシュされるときにクライアントに送信されるステータスコードを制御します。

```js [ESM]
response.statusCode = 404;
```

レスポンスヘッダーがクライアントに送信された後、このプロパティは送信されたステータスコードを示します。

#### `response.statusMessage` {#responsestatusmessage}

**追加: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ステータスメッセージは HTTP/2 でサポートされていません (RFC 7540 8.1.2.4)。 空の文字列を返します。

#### `response.stream` {#responsestream}

**追加: v8.4.0**

- [\<Http2Stream\>](/ja/nodejs/api/http2#class-http2stream)

レスポンスをサポートする [`Http2Stream`](/ja/nodejs/api/http2#class-http2stream) オブジェクト。

#### `response.writableEnded` {#responsewritableended}

**追加: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`response.end()`](/ja/nodejs/api/http2#responseenddata-encoding-callback) が呼び出された後 `true` になります。 このプロパティは、データがフラッシュされたかどうかを示すものではありません。代わりに [`writable.writableFinished`](/ja/nodejs/api/stream#writablewritablefinished) を使用してください。

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**追加: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このメソッドが呼び出され、[`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) が呼び出されていない場合、暗黙的なヘッダーモードに切り替わり、暗黙的なヘッダーをフラッシュします。

これは、レスポンスボディのチャンクを送信します。 このメソッドは、ボディの連続した部分を提供するために複数回呼び出すことができます。

`node:http` モジュールでは、リクエストが HEAD リクエストの場合、レスポンスボディは省略されます。 同様に、`204` および `304` レスポンスには、メッセージボディを含めては*なりません*。

`chunk` は文字列またはバッファにすることができます。 `chunk` が文字列の場合、2 番目のパラメータは、それをバイトストリームにエンコードする方法を指定します。 デフォルトでは、`encoding` は `'utf8'` です。 データチャンクがフラッシュされると `callback` が呼び出されます。

これは生の HTTP ボディであり、使用される可能性のある高レベルのマルチパートボディエンコーディングとは関係ありません。

[`response.write()`](/ja/nodejs/api/http2#responsewritechunk-encoding-callback) が最初に呼び出されると、バッファリングされたヘッダー情報とボディの最初のチャンクがクライアントに送信されます。 2 回目に [`response.write()`](/ja/nodejs/api/http2#responsewritechunk-encoding-callback) が呼び出されると、Node.js はデータがストリーミングされるとみなし、新しいデータを個別に送信します。 つまり、レスポンスはボディの最初のチャンクまでバッファリングされます。

データ全体がカーネルバッファに正常にフラッシュされた場合は `true` を返します。 データの一部またはすべてがユーザメモリにキューイングされた場合は `false` を返します。 バッファが再び空になると、`'drain'` が発行されます。


#### `response.writeContinue()` {#responsewritecontinue}

**Added in: v8.4.0**

リクエストボディを送信する必要があることを示すステータス `100 Continue` をクライアントに送信します。`Http2Server` および `Http2SecureServer` の [`'checkContinue'`](/ja/nodejs/api/http2#event-checkcontinue) イベントを参照してください。

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Added in: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ユーザーエージェントがリンクされたリソースをプリロード/プリコネクトできることを示す、Linkヘッダーを持つステータス `103 Early Hints` をクライアントに送信します。`hints` は、early hintsメッセージとともに送信されるヘッダーの値を含むオブジェクトです。

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
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [History]
| Version | Changes |
| --- | --- |
| v11.10.0, v10.17.0 | `end()` とのチェーンを可能にするために、`writeHead()` から `this` を返します。 |
| v8.4.0 | Added in: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 戻り値: [\<http2.Http2ServerResponse\>](/ja/nodejs/api/http2#class-http2http2serverresponse)

リクエストに応答ヘッダーを送信します。ステータスコードは、`404` のような3桁のHTTPステータスコードです。最後の引数 `headers` は、応答ヘッダーです。

`Http2ServerResponse` への参照を返し、呼び出しをチェーンできるようにします。

[HTTP/1](/ja/nodejs/api/http) との互換性のために、人間が読める `statusMessage` を2番目の引数として渡すことができます。ただし、`statusMessage` は HTTP/2 内では意味がないため、引数は効果がなく、プロセスの警告が発生します。

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` は文字数ではなくバイト数で指定します。`Buffer.byteLength()` API を使用して、指定されたエンコーディングのバイト数を決定できます。送信メッセージでは、Node.js は Content-Length と送信される本文の長さが等しいかどうかを確認しません。ただし、メッセージを受信するとき、Node.js は `Content-Length` が実際のペイロードサイズと一致しない場合に、メッセージを自動的に拒否します。

このメソッドは、[`response.end()`](/ja/nodejs/api/http2#responseenddata-encoding-callback) が呼び出される前に、メッセージに対して最大で1回呼び出すことができます。

[`response.write()`](/ja/nodejs/api/http2#responsewritechunk-encoding-callback) または [`response.end()`](/ja/nodejs/api/http2#responseenddata-encoding-callback) がこれを呼び出す前に呼び出された場合、暗黙的/可変ヘッダーが計算され、この関数が呼び出されます。

ヘッダーが [`response.setHeader()`](/ja/nodejs/api/http2#responsesetheadername-value) で設定されている場合、[`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーとマージされ、[`response.writeHead()`](/ja/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) に渡されたヘッダーが優先されます。

```js [ESM]
// content-type = text/plain を返します
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
無効な文字を含むヘッダーフィールド名または値を設定しようとすると、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## HTTP/2 パフォーマンスメトリクスの収集 {#collecting-http/2-performance-metrics}

[`Performance Observer`](/ja/nodejs/api/perf_hooks) APIを使用すると、各`Http2Session`および`Http2Stream`インスタンスの基本的なパフォーマンスメトリクスを収集できます。

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

`PerformanceEntry`の`entryType`プロパティは、`'http2'`と等しくなります。

`PerformanceEntry`の`name`プロパティは、`'Http2Stream'`または`'Http2Session'`のいずれかと等しくなります。

`name`が`Http2Stream`と等しい場合、`PerformanceEntry`には次の追加プロパティが含まれます。

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この`Http2Stream`で受信した`DATA`フレームのバイト数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この`Http2Stream`で送信した`DATA`フレームのバイト数。
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連付けられた`Http2Stream`の識別子
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry`の`startTime`から最初の`DATA`フレームの受信までの経過ミリ秒数。
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry`の`startTime`から最初の`DATA`フレームの送信までの経過ミリ秒数。
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry`の`startTime`から最初のヘッダーの受信までの経過ミリ秒数。

`name`が`Http2Session`と等しい場合、`PerformanceEntry`には次の追加プロパティが含まれます。

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この`Http2Session`で受信したバイト数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この`Http2Session`で送信したバイト数。
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`が受信したHTTP/2フレームの数。
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`が送信したHTTP/2フレームの数。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`の有効期間中に同時に開かれたストリームの最大数。
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PING`フレームの送信とその応答の受信からの経過ミリ秒数。 `PING`フレームが`Http2Session`で送信された場合にのみ存在します。
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) すべての`Http2Stream`インスタンスの平均期間（ミリ秒単位）。
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`によって処理された`Http2Stream`インスタンスの数。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `Http2Session`のタイプを識別するための`'server'`または`'client'`。


## `:authority` と `host` に関する注意 {#note-on-authority-and-host}

HTTP/2 では、リクエストに `:authority` 疑似ヘッダーまたは `host` ヘッダーのいずれかが必要です。HTTP/2 リクエストを直接構築する場合は `:authority` を優先し、(例えばプロキシなどで) HTTP/1 から変換する場合は `host` を優先します。

互換性 API は、`:authority` が存在しない場合、`host` にフォールバックします。詳細については、[`request.authority`](/ja/nodejs/api/http2#requestauthority) を参照してください。ただし、互換性 API を使用しない場合 (または `req.headers` を直接使用する場合) は、フォールバック動作を自分で実装する必要があります。

