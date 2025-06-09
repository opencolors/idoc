---
title: Node.js ドキュメント - HTTPS
description: Node.jsのHTTPSモジュールは、TLS/SSLプロトコルの実装を提供し、安全なHTTP接続を可能にします。安全なサーバーとクライアントの作成、証明書の処理、および安全な接続の管理のためのメソッドが含まれています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのHTTPSモジュールは、TLS/SSLプロトコルの実装を提供し、安全なHTTP接続を可能にします。安全なサーバーとクライアントの作成、証明書の処理、および安全な接続の管理のためのメソッドが含まれています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのHTTPSモジュールは、TLS/SSLプロトコルの実装を提供し、安全なHTTP接続を可能にします。安全なサーバーとクライアントの作成、証明書の処理、および安全な接続の管理のためのメソッドが含まれています。
---


# HTTPS {#https}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPSは、TLS/SSL上のHTTPプロトコルです。Node.jsでは、これは別のモジュールとして実装されています。

## cryptoサポートが利用できないかの判断 {#determining-if-crypto-support-is-unavailable}

Node.jsは、`node:crypto`モジュールのサポートを含めずにビルドされる可能性があります。そのような場合、`https`からの`import`を試みるか、`require('node:https')`を呼び出すと、エラーがスローされます。

CommonJSを使用する場合、スローされたエラーはtry/catchを使用してキャッチできます。

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('httpsサポートは無効になっています!');
}
```
字句ESMの`import`キーワードを使用する場合、エラーは、モジュールをロードする試みの*前に* `process.on('uncaughtException')`のハンドラーが登録されている場合にのみキャッチできます（たとえば、プリロードモジュールを使用）。

ESMを使用する場合、コードがcryptoサポートが有効になっていないNode.jsのビルドで実行される可能性がある場合は、字句`import`キーワードの代わりに[`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)関数を使用することを検討してください。

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('httpsサポートは無効になっています!');
}
```
## Class: `https.Agent` {#class-httpsagent}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.3.0 | TLSセッションキャッシュを無効にするために `0` `maxCachedSessions` をサポート |
| v2.5.0 | TLSセッションの再利用のために `options` にパラメータ `maxCachedSessions` が追加 |
| v0.4.5 | v0.4.5 で追加 |
:::

[`http.Agent`](/ja/nodejs/api/http#class-httpagent)と同様のHTTPS用の[`Agent`](/ja/nodejs/api/https#class-httpsagent)オブジェクト。詳細は[`https.request()`](/ja/nodejs/api/https#httpsrequestoptions-callback)を参照してください。

### `new Agent([options])` {#new-agentoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.5.0 | ターゲットホストがIPアドレスを使用して指定されている場合は、servernameを自動的に設定しない |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) エージェントに設定する設定可能なオプションのセット。[`http.Agent(options)`](/ja/nodejs/api/http#new-agentoptions)と同じフィールドを持つことができ、
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TLSキャッシュセッションの最大数。TLSセッションキャッシュを無効にするには `0` を使用します。**デフォルト:** `100`。
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サーバーに送信される[Server Name Indication extension](https://en.wikipedia.org/wiki/Server_Name_Indication)の値。拡張の送信を無効にするには、空の文字列 `''` を使用します。**デフォルト:** ターゲットサーバーのホスト名。ただし、ターゲットサーバーがIPアドレスを使用して指定されている場合は、デフォルトは `''` （拡張なし）です。TLSセッションの再利用に関する情報は、[`Session Resumption`](/ja/nodejs/api/tls#session-resumption)を参照してください。


#### イベント: `'keylog'` {#event-keylog}

**追加: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) NSS の `SSLKEYLOGFILE` 形式の ASCII テキスト行。
- `tlsSocket` [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) それが生成された `tls.TLSSocket` インスタンス。

`keylog` イベントは、このエージェントによって管理されている接続でキーマテリアルが生成または受信されたときに発生します（通常はハンドシェイクが完了する前ですが、必ずしもそうとは限りません）。このキーマテリアルは、キャプチャされたTLSトラフィックを復号化できるため、デバッグ用に保存できます。ソケットごとに複数回発生する可能性があります。

典型的なユースケースは、受信した行を共通のテキストファイルに追加し、後でソフトウェア（Wiresharkなど）がトラフィックを復号化するために使用することです。

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## クラス: `https.Server` {#class-httpsserver}

**追加: v0.3.4**

- 拡張: [\<tls.Server\>](/ja/nodejs/api/tls#class-tlsserver)

詳細については、[`http.Server`](/ja/nodejs/api/http#class-httpserver) を参照してください。

### `server.close([callback])` {#serverclosecallback}

**追加: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<https.Server\>](/ja/nodejs/api/https#class-httpsserver)

`node:http` モジュールの [`server.close()`](/ja/nodejs/api/http#serverclosecallback) を参照してください。

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**追加: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[`server.close()`](/ja/nodejs/api/https#serverclosecallback) を呼び出し、サーバーが閉じられたときに解決される Promise を返します。

### `server.closeAllConnections()` {#servercloseallconnections}

**追加: v18.2.0**

`node:http` モジュールの [`server.closeAllConnections()`](/ja/nodejs/api/http#servercloseallconnections) を参照してください。

### `server.closeIdleConnections()` {#servercloseidleconnections}

**追加: v18.2.0**

`node:http` モジュールの [`server.closeIdleConnections()`](/ja/nodejs/api/http#servercloseidleconnections) を参照してください。


### `server.headersTimeout` {#serverheaderstimeout}

**Added in: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `60000`

`node:http` モジュールの [`server.headersTimeout`](/ja/nodejs/api/http#serverheaderstimeout) を参照してください。

### `server.listen()` {#serverlisten}

暗号化された接続をリッスンする HTTPS サーバーを起動します。このメソッドは、[`net.Server`](/ja/nodejs/api/net#class-netserver) の [`server.listen()`](/ja/nodejs/api/net#serverlisten) と同じです。

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `2000`

`node:http` モジュールの [`server.maxHeadersCount`](/ja/nodejs/api/http#servermaxheaderscount) を参照してください。

### `server.requestTimeout` {#serverrequesttimeout}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | デフォルトのリクエストタイムアウトが、タイムアウトなしから 300 秒 (5 分) に変更されました。 |
| v14.11.0 | Added in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `300000`

`node:http` モジュールの [`server.requestTimeout`](/ja/nodejs/api/http#serverrequesttimeout) を参照してください。

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Added in: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `120000` (2 minutes)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<https.Server\>](/ja/nodejs/api/https#class-httpsserver)

`node:http` モジュールの [`server.setTimeout()`](/ja/nodejs/api/http#serversettimeoutmsecs-callback) を参照してください。

### `server.timeout` {#servertimeout}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | デフォルトのタイムアウトが 120 秒から 0 (タイムアウトなし) に変更されました。 |
| v0.11.2 | Added in: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** 0 (タイムアウトなし)

`node:http` モジュールの [`server.timeout`](/ja/nodejs/api/http#servertimeout) を参照してください。


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**追加: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `5000` (5 秒)

`node:http` モジュールの [`server.keepAliveTimeout`](/ja/nodejs/api/http#serverkeepalivetimeout) を参照してください。

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**追加: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)、[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions)、および [`http.createServer()`](/ja/nodejs/api/http#httpcreateserveroptions-requestlistener) からの `options` を受け入れます。
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'request'` イベントに追加されるリスナー。
- 戻り値: [\<https.Server\>](/ja/nodejs/api/https#class-httpsserver)

::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

または

::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

この例の証明書とキーを生成するには、次を実行します。

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
次に、この例の `pfx` 証明書を生成するには、次を実行します。

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.9.0 | `url` パラメーターを個別の `options` オブジェクトとともに渡せるようになりました。 |
| v7.5.0 | `options` パラメーターは WHATWG `URL` オブジェクトにできます。 |
| v0.3.6 | 追加: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) デフォルトで method が GET に設定されている、[`https.request()`](/ja/nodejs/api/https#httpsrequestoptions-callback) と同じ `options` を受け入れます。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

[`http.get()`](/ja/nodejs/api/http#httpgetoptions-callback) と同様ですが、HTTPS 用です。

`options` は、オブジェクト、文字列、または [`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトにできます。 `options` が文字列の場合、[`new URL()`](/ja/nodejs/api/url#new-urlinput-base) で自動的に解析されます。 [`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトの場合、通常の `options` オブジェクトに自動的に変換されます。

::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | エージェントはデフォルトで HTTP Keep-Alive と 5 秒のタイムアウトを使用するようになりました。 |
| v0.5.9 | 追加: v0.5.9 |
:::

すべての HTTPS クライアントリクエストに対する [`https.Agent`](/ja/nodejs/api/https#class-httpsagent) のグローバルインスタンス。`keepAlive` が有効で、`timeout` が 5 秒である点で、デフォルトの [`https.Agent`](/ja/nodejs/api/https#class-httpsagent) 設定とは異なります。

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine` オプションは、OpenSSL のカスタムエンジンサポートに依存していますが、OpenSSL 3 では非推奨です。 |
| v16.7.0, v14.18.0 | `URL` オブジェクトを使用する場合、解析されたユーザー名とパスワードは適切に URI デコードされるようになりました。 |
| v14.1.0, v13.14.0 | `highWaterMark` オプションが受け入れられるようになりました。 |
| v10.9.0 | `url` パラメータを個別の `options` オブジェクトとともに渡すことができるようになりました。 |
| v9.3.0 | `options` パラメータに `clientCertEngine` を含めることができるようになりました。 |
| v7.5.0 | `options` パラメータは WHATWG `URL` オブジェクトにすることができます。 |
| v0.3.6 | 追加: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) [`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) からすべての `options` を受け入れますが、デフォルト値にはいくつかの違いがあります。
    - `protocol` **デフォルト:** `'https:'`
    - `port` **デフォルト:** `443`
    - `agent` **デフォルト:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

セキュアなウェブサーバーにリクエストを送信します。

[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) の以下の追加の `options` も受け入れられます: `ca`, `cert`, `ciphers`, `clientCertEngine` (非推奨), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` は、オブジェクト、文字列、または [`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトにすることができます。`options` が文字列の場合、[`new URL()`](/ja/nodejs/api/url#new-urlinput-base) で自動的に解析されます。[`URL`](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトの場合、自動的に通常の `options` オブジェクトに変換されます。

`https.request()` は、[`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest) クラスのインスタンスを返します。`ClientRequest` インスタンスは書き込み可能なストリームです。POST リクエストでファイルをアップロードする必要がある場合は、`ClientRequest` オブジェクトに書き込みます。

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) からのオプションを使用した例:

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
あるいは、[`Agent`](/ja/nodejs/api/https#class-httpsagent) を使用しないことで、接続プーリングをオプトアウトします。

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
[`URL`](/ja/nodejs/api/url#the-whatwg-url-api) を `options` として使用する例:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
証明書のフィンガープリント、または公開鍵（`pin-sha256` と同様）に固定する例:

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

出力例:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```
