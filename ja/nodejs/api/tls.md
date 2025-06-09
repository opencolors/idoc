---
title: Node.js ドキュメント - TLS（トランスポート層セキュリティ）
description: Node.jsのこのドキュメントセクションでは、TLS（トランスポート層セキュリティ）モジュールについて説明しています。このモジュールはTLSおよびSSLプロトコルの実装を提供します。安全な接続の作成、証明書の管理、安全な通信の処理、およびNode.jsアプリケーションでのTLS/SSLの設定に関するさまざまなオプションが含まれています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - TLS（トランスポート層セキュリティ） | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのこのドキュメントセクションでは、TLS（トランスポート層セキュリティ）モジュールについて説明しています。このモジュールはTLSおよびSSLプロトコルの実装を提供します。安全な接続の作成、証明書の管理、安全な通信の処理、およびNode.jsアプリケーションでのTLS/SSLの設定に関するさまざまなオプションが含まれています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - TLS（トランスポート層セキュリティ） | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのこのドキュメントセクションでは、TLS（トランスポート層セキュリティ）モジュールについて説明しています。このモジュールはTLSおよびSSLプロトコルの実装を提供します。安全な接続の作成、証明書の管理、安全な通信の処理、およびNode.jsアプリケーションでのTLS/SSLの設定に関するさまざまなオプションが含まれています。
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

`node:tls` モジュールは、OpenSSL上に構築されたTransport Layer Security（TLS）およびSecure Socket Layer（SSL）プロトコルの実装を提供します。このモジュールは以下を使ってアクセスできます:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## crypto サポートが利用できないかどうかの判定 {#determining-if-crypto-support-is-unavailable}

Node.js は、`node:crypto` モジュールのサポートを含めずにビルドされる可能性があります。 そのような場合、`tls` から `import` を試みるか、`require('node:tls')` を呼び出すと、エラーがスローされます。

CommonJS を使用する場合、スローされたエラーは try/catch を使用してキャッチできます:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
字句 ESM `import` キーワードを使用する場合、モジュールをロードする試みを行う *前に* `process.on('uncaughtException')` のハンドラーが登録されている場合にのみ、エラーをキャッチできます (たとえば、プリロードモジュールを使用)。

ESM を使用する場合、コードが crypto サポートが有効になっていない Node.js のビルドで実行される可能性がある場合は、字句 `import` キーワードの代わりに [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 関数を使用することを検討してください。

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## TLS/SSL の概念 {#tls/ssl-concepts}

TLS/SSL は、公開鍵基盤 (PKI) に依存してクライアントとサーバー間の安全な通信を可能にするプロトコルのセットです。 ほとんどの一般的なケースでは、各サーバーは秘密鍵を持っている必要があります。

秘密鍵は複数の方法で生成できます。 次の例は、OpenSSL コマンドラインインターフェイスを使用して 2048 ビットの RSA 秘密鍵を生成する方法を示しています。

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
TLS/SSL では、すべてのサーバー (および一部のクライアント) が *証明書* を持っている必要があります。 証明書は、秘密鍵に対応する *公開鍵* であり、認証局または秘密鍵の所有者のいずれかによってデジタル署名されています (そのような証明書は「自己署名」と呼ばれます)。 証明書を取得する最初のステップは、*証明書署名要求* (CSR) ファイルを作成することです。

OpenSSL コマンドラインインターフェイスを使用して、秘密鍵の CSR を生成できます。

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
CSR ファイルが生成されたら、認証局に署名を依頼するか、自己署名証明書を生成するために使用できます。

OpenSSL コマンドラインインターフェイスを使用して自己署名証明書を作成する例を以下に示します。

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
証明書が生成されると、`.pfx` または `.p12` ファイルを生成するために使用できます。

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
場所:

- `in`: 署名付き証明書
- `inkey`: 関連する秘密鍵
- `certfile`: すべての認証局 (CA) 証明書を 1 つのファイルに連結したもの (例: `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`)


### 完全転送秘密 {#perfect-forward-secrecy}

*<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">前方秘匿性</a>*または*完全転送秘密*という用語は、鍵合意（すなわち鍵交換）方式の機能を指します。つまり、サーバーとクライアントの鍵を使用して、現在の通信セッション専用に新しい一時鍵をネゴシエートします。実際には、サーバーの秘密鍵が侵害された場合でも、攻撃者がセッション専用に生成された鍵ペアを入手した場合にのみ、傍受者による通信の解読が可能であることを意味します。

完全転送秘密は、すべての TLS/SSL ハンドシェイクで鍵合意のための鍵ペアをランダムに生成することによって実現されます（すべてのセッションで同じ鍵を使用するのとは対照的）。この手法を実装する方式は「エフェメラル」と呼ばれます。

現在、完全転送秘密を実現するために一般的に使用されている2つの方式があります（従来の略語に文字「E」が付加されていることに注意してください）。

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman)：楕円曲線 Diffie-Hellman 鍵合意プロトコルのエフェメラル版。
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)：Diffie-Hellman 鍵合意プロトコルのエフェメラル版。

ECDHE を使用した完全転送秘密はデフォルトで有効になっています。`ecdhCurve` オプションは、TLS サーバーの作成時に、使用するサポート対象の ECDH 曲線リストをカスタマイズするために使用できます。詳細については、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。

DHE はデフォルトで無効になっていますが、`dhparam` オプションを `'auto'` に設定することで、ECDHE と共に有効にできます。カスタム DHE パラメーターもサポートされていますが、自動的に選択された既知のパラメーターを使用することをお勧めします。

完全転送秘密は、TLSv1.2 まではオプションでした。TLSv1.3 以降、(EC)DHE は常に使用されます (PSK のみの接続を除く)。

### ALPN と SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) および SNI (Server Name Indication) は、TLS ハンドシェイク拡張機能です。

- ALPN: 複数のプロトコル (HTTP, HTTP/2) に 1 つの TLS サーバーを使用できます。
- SNI: 異なる証明書を持つ複数のホスト名に 1 つの TLS サーバーを使用できます。


### 事前共有鍵 {#pre-shared-keys}

TLS-PSKサポートは、通常の証明書ベース認証の代替手段として利用可能です。これは、証明書の代わりに事前共有鍵を使用してTLS接続を認証し、相互認証を提供します。TLS-PSKと公開鍵基盤は相互に排他的ではありません。クライアントとサーバーは両方に対応でき、通常の暗号ネゴシエーションステップ中にどちらかを選択できます。

TLS-PSKは、接続するすべてのマシンと鍵を安全に共有する手段が存在する場合にのみ適した選択肢であり、ほとんどのTLS用途において公開鍵基盤（PKI）を置き換えるものではありません。OpenSSLのTLS-PSK実装は近年、多くのセキュリティ上の欠陥が見られます。これは、主に少数のアプリケーションでのみ使用されるためです。PSK暗号に切り替える前に、すべての代替ソリューションを検討してください。PSKを生成する際には、[RFC 4086](https://tools.ietf.org/html/rfc4086)で説明されているように、十分なエントロピーを使用することが非常に重要です。パスワードまたはその他の低エントロピーソースから共有シークレットを導出することは安全ではありません。

PSK暗号はデフォルトで無効になっており、TLS-PSKを使用するには、`ciphers`オプションで暗号スイートを明示的に指定する必要があります。利用可能な暗号のリストは、`openssl ciphers -v 'PSK'`で取得できます。すべてのTLS 1.3暗号はPSKの対象となり、`openssl ciphers -v -s -tls1_3 -psk`で取得できます。クライアント接続では、証明書がない場合にデフォルトで失敗するため、カスタムの`checkServerIdentity`を渡す必要があります。

[RFC 4279](https://tools.ietf.org/html/rfc4279)によると、最大128バイトの長さのPSK IDと最大64バイトの長さのPSKがサポートされている必要があります。OpenSSL 1.1.0の時点では、最大IDサイズは128バイト、最大PSK長は256バイトです。

現在の実装では、基盤となるOpenSSL APIの制限により、非同期PSKコールバックはサポートされていません。

TLS-PSKを使用するには、クライアントとサーバーは`pskCallback`オプション、つまり使用するPSKを返す関数（選択した暗号のダイジェストと互換性がある必要があります）を指定する必要があります。

これは最初にクライアントで呼び出されます。

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ネゴシエーション中にクライアントが使用するIDを決定するのに役立つ、サーバーから送信されたオプションのメッセージ。TLS 1.3を使用する場合は常に`null`です。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }`の形式、または`null`。

次にサーバーで呼び出されます。

- socket: [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) サーバーソケットインスタンス。`this`と同等です。
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアントから送信されたIDパラメータ。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PSK（または`null`）。

戻り値が`null`の場合、ネゴシエーションプロセスが停止し、`unknown_psk_identity`アラートメッセージが相手に送信されます。サーバーがPSK IDが不明であることを隠したい場合は、ネゴシエーションが完了する前に`decrypt_error`で接続が失敗するように、コールバックは`psk`としていくつかのランダムデータを提供する必要があります。


### クライアント起因の再ネゴシエーション攻撃の軽減 {#client-initiated-renegotiation-attack-mitigation}

TLSプロトコルは、クライアントがTLSセッションの特定の側面を再ネゴシエーションすることを許可します。残念ながら、セッションの再ネゴシエーションにはサーバー側のリソースが不均衡に必要となるため、サービス拒否攻撃の潜在的なベクターとなります。

リスクを軽減するために、再ネゴシエーションは10分ごとに3回に制限されています。この閾値を超えると、[`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket)インスタンスで`'error'`イベントが発生します。制限は構成可能です。

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再ネゴシエーション要求の数を指定します。 **デフォルト:** `3`。
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再ネゴシエーションウィンドウの時間を秒単位で指定します。 **デフォルト:** `600` (10分)。

デフォルトの再ネゴシエーション制限は、影響とリスクを完全に理解せずに変更しないでください。

TLSv1.3は再ネゴシエーションをサポートしていません。

### セッション再開 {#session-resumption}

TLSセッションの確立には比較的時間がかかる場合があります。セッション状態を保存して後で再利用することで、プロセスを高速化できます。これを行うためのメカニズムがいくつかあり、ここでは最も古いものから最新のもの（および推奨されるもの）について説明します。

#### セッション識別子 {#session-identifiers}

サーバーは新しい接続に対して一意のIDを生成し、クライアントに送信します。クライアントとサーバーはセッション状態を保存します。再接続時、クライアントは保存されたセッション状態のIDを送信し、サーバーもそのIDの状態を持っている場合、それを使用することに同意できます。それ以外の場合、サーバーは新しいセッションを作成します。詳細については、[RFC 2246](https://www.ietf.org/rfc/rfc2246.txt)の23ページと30ページを参照してください。

セッション識別子を使用した再開は、HTTPSリクエストを行う際にほとんどのWebブラウザーでサポートされています。

Node.jsの場合、クライアントは[`'session'`](/ja/nodejs/api/tls#event-session)イベントを待ってセッションデータを取得し、後続の[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)の`session`オプションにデータを提供して、セッションを再利用します。サーバーは、[`'newSession'`](/ja/nodejs/api/tls#event-newsession)および[`'resumeSession'`](/ja/nodejs/api/tls#event-resumesession)イベントのハンドラーを実装して、セッションIDをルックアップキーとして使用してセッションデータを保存および復元し、セッションを再利用する必要があります。ロードバランサーまたはクラスタワーカー間でセッションを再利用するには、サーバーはセッションハンドラーで共有セッションキャッシュ（Redisなど）を使用する必要があります。


#### セッションチケット {#session-tickets}

サーバーはセッション状態全体を暗号化し、「チケット」としてクライアントに送信します。再接続時には、その状態が最初の接続時にサーバーに送信されます。このメカニズムにより、サーバー側のセッションキャッシュが不要になります。サーバーが何らかの理由（復号化の失敗、古すぎるなど）でチケットを使用しない場合、新しいセッションを作成し、新しいチケットを送信します。詳細については、[RFC 5077](https://tools.ietf.org/html/rfc5077)を参照してください。

セッションチケットを使用した再開は、HTTPSリクエストを行う際に多くのWebブラウザーで一般的にサポートされるようになっています。

Node.jsの場合、クライアントはセッション識別子を使用した再開と同じAPIを、セッションチケットを使用した再開にも使用します。デバッグのために、[`tls.TLSSocket.getTLSTicket()`](/ja/nodejs/api/tls#tlssocketgettlsticket) が値を返す場合、セッションデータにはチケットが含まれており、そうでない場合はクライアント側のセッション状態が含まれています。

TLSv1.3では、サーバーから複数のチケットが送信される可能性があり、その結果、複数の `'session'` イベントが発生することに注意してください。詳細については、[`'session'`](/ja/nodejs/api/tls#event-session) を参照してください。

シングルプロセスサーバーは、セッションチケットを使用するために特別な実装は必要ありません。サーバーの再起動やロードバランサーをまたいでセッションチケットを使用するには、サーバーがすべて同じチケットキーを持っている必要があります。内部的には3つの16バイトのキーがありますが、tls APIは便宜上、それらを単一の48バイトのバッファーとして公開しています。

[`server.getTicketKeys()`](/ja/nodejs/api/tls#servergetticketkeys) を1つのサーバーインスタンスで呼び出してチケットキーを取得し、それらを配布することも可能ですが、セキュアな乱数データ48バイトを安全に生成し、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) の `ticketKeys` オプションで設定する方が理にかなっています。キーは定期的に再生成する必要があり、サーバーのキーは [`server.setTicketKeys()`](/ja/nodejs/api/tls#serversetticketkeyskeys) でリセットできます。

セッションチケットキーは暗号化キーであり、*<strong>安全に保管する必要が</strong>* あります。TLS 1.2以下では、それらが侵害された場合、それらで暗号化されたチケットを使用したすべてのセッションを復号化できます。それらはディスクに保存すべきではなく、定期的に再生成する必要があります。

クライアントがチケットのサポートをアドバタイズする場合、サーバーはそれらを送信します。サーバーは、`secureOptions` で `require('node:constants').SSL_OP_NO_TICKET` を指定することにより、チケットを無効にできます。

セッション識別子とセッションチケットはどちらもタイムアウトし、サーバーに新しいセッションを作成させます。タイムアウトは、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) の `sessionTimeout` オプションで設定できます。

すべてのメカニズムにおいて、再開が失敗した場合、サーバーは新しいセッションを作成します。セッションの再開に失敗しても、TLS/HTTPS接続の失敗にはつながらないため、不必要にTLSのパフォーマンスが低いことに気づきにくい場合があります。OpenSSL CLIを使用して、サーバーがセッションを再開していることを確認できます。`openssl s_client` に `-reconnect` オプションを使用します。例：

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
デバッグ出力を読みます。最初の接続は「New」と表示されるはずです。例：

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
後続の接続は「Reused」と表示されるはずです。例：

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## デフォルトの TLS 暗号スイートの変更 {#modifying-the-default-tls-cipher-suite}

Node.js は、有効および無効な TLS 暗号のデフォルトスイートで構築されています。このデフォルトの暗号リストは、Node.js を構築する際に構成して、ディストリビューションが独自のデフォルトリストを提供できるようにすることができます。

次のコマンドを使用して、デフォルトの暗号スイートを表示できます。

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
このデフォルトは、[`--tls-cipher-list`](/ja/nodejs/api/cli#--tls-cipher-listlist) コマンドラインスイッチ (直接、または [`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) 環境変数を介して) を使用して完全に置き換えることができます。たとえば、次のコマンドは `ECDHE-RSA-AES128-GCM-SHA256:!RC4` をデフォルトの TLS 暗号スイートにします。

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
確認するには、次のコマンドを使用して設定された暗号リストを表示します。`defaultCoreCipherList` と `defaultCipherList` の違いに注意してください。

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
つまり、`defaultCoreCipherList` リストはコンパイル時に設定され、`defaultCipherList` は実行時に設定されます。

実行時にデフォルトの暗号スイートを変更するには、`tls.DEFAULT_CIPHERS` 変数を変更します。これは、ソケットでリッスンする前に実行する必要があります。すでに開いているソケットには影響しません。例：

```js [ESM]
// Remove Obsolete CBC Ciphers and RSA Key Exchange based Ciphers as they don't provide Forward Secrecy
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
デフォルトは、[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `ciphers` オプションを使用して、クライアントまたはサーバーごとに置き換えることもできます。これは、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)、および新しい [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) を作成する際にも使用できます。

暗号リストには、TLSv1.3 暗号スイート名 ( `'TLS_'` で始まるもの) と、TLSv1.2 以下の暗号スイートの仕様を混在させることができます。TLSv1.2 暗号は、レガシー仕様形式をサポートしています。詳細については、OpenSSL の [暗号リスト形式](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) のドキュメントを参照してください。ただし、これらの仕様は TLSv1.3 暗号には適用されません。TLSv1.3 スイートは、暗号リストにそのフルネームを含めることによってのみ有効にできます。たとえば、レガシー TLSv1.2 の `'EECDH'` または `'!EECDH'` 仕様を使用して有効または無効にすることはできません。

TLSv1.3 と TLSv1.2 の暗号スイートの相対的な順序にもかかわらず、TLSv1.3 プロトコルは TLSv1.2 よりも大幅に安全であり、ハンドシェイクでサポートされていることが示され、TLSv1.3 暗号スイートが有効になっている場合は、常に TLSv1.2 よりも選択されます。

Node.js に含まれるデフォルトの暗号スイートは、現在のセキュリティのベストプラクティスとリスク軽減を反映するように慎重に選択されています。デフォルトの暗号スイートを変更すると、アプリケーションのセキュリティに大きな影響を与える可能性があります。`--tls-cipher-list` スイッチと `ciphers` オプションは、どうしても必要な場合にのみ使用する必要があります。

デフォルトの暗号スイートは、[Chrome の「最新の暗号化」設定](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) 用に GCM 暗号を優先し、完全な前方秘匿性のために ECDHE および DHE 暗号も優先しますが、*一部* の下位互換性を提供します。

安全でない廃止された RC4 または DES ベースの暗号 (Internet Explorer 6 など) に依存する古いクライアントは、デフォルト構成でハンドシェイクプロセスを完了できません。これらのクライアントを *サポートする必要がある* 場合は、[TLS の推奨事項](https://wiki.mozilla.org/Security/Server_Side_TLS) が互換性のある暗号スイートを提供する場合があります。形式の詳細については、OpenSSL の [暗号リスト形式](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) のドキュメントを参照してください。

TLSv1.3 暗号スイートは 5 つしかありません。

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

最初の 3 つはデフォルトで有効になっています。2 つの `CCM` ベースのスイートは、制約のあるシステムではパフォーマンスが向上する可能性があるため、TLSv1.3 でサポートされていますが、セキュリティが低いため、デフォルトでは有効になっていません。


## OpenSSLのセキュリティレベル {#openssl-security-level}

OpenSSLライブラリは、暗号操作の最小許容セキュリティレベルを制御するためにセキュリティレベルを適用します。OpenSSLのセキュリティレベルは0から5の範囲で、各レベルはより厳格なセキュリティ要件を課します。デフォルトのセキュリティレベルは1で、これは通常、ほとんどの最新アプリケーションに適しています。ただし、TLSv1などの一部のレガシー機能とプロトコルは、正常に機能するために低いセキュリティレベル(`SECLEVEL=0`)が必要です。詳細については、[セキュリティレベルに関するOpenSSLドキュメント](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR)を参照してください。

### セキュリティレベルの設定 {#setting-security-levels}

Node.jsアプリケーションでセキュリティレベルを調整するには、暗号文字列内に`@SECLEVEL=X`を含めることができます。ここで、`X`は目的のセキュリティレベルです。たとえば、デフォルトのOpenSSL暗号リストを使用しながらセキュリティレベルを0に設定するには、次のようにします。

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

このアプローチは、セキュリティレベルを0に設定し、デフォルトのOpenSSL暗号を利用しながら、レガシー機能の使用を許可します。

### 使用 {#using}

[デフォルトのTLS暗号スイートの変更](/ja/nodejs/api/tls#modifying-the-default-tls-cipher-suite)で説明されているように、`--tls-cipher-list=DEFAULT@SECLEVEL=X`を使用して、コマンドラインからセキュリティレベルと暗号を設定することもできます。ただし、一般的に、暗号を設定するためにコマンドラインオプションを使用することは推奨されていません。アプリケーションコード内の個々のコンテキストに対して暗号を構成することをお勧めします。このアプローチは、よりきめ細かい制御を提供し、セキュリティレベルをグローバルにダウングレードするリスクを軽減するためです。


## X509証明書のエラーコード {#x509-certificate-error-codes}

複数の関数が、OpenSSLによって報告される証明書エラーによって失敗する可能性があります。そのような場合、関数は、以下のいずれかの値を取ることができるプロパティ`code`を持つ[\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)をコールバックを通じて提供します。

- `'UNABLE_TO_GET_ISSUER_CERT'`: 発行者証明書を取得できません。
- `'UNABLE_TO_GET_CRL'`: 証明書CRLを取得できません。
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: 証明書の署名を復号化できません。
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: CRLの署名を復号化できません。
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: 発行者の公開鍵をデコードできません。
- `'CERT_SIGNATURE_FAILURE'`: 証明書の署名が失敗しました。
- `'CRL_SIGNATURE_FAILURE'`: CRLの署名が失敗しました。
- `'CERT_NOT_YET_VALID'`: 証明書はまだ有効ではありません。
- `'CERT_HAS_EXPIRED'`: 証明書の有効期限が切れました。
- `'CRL_NOT_YET_VALID'`: CRLはまだ有効ではありません。
- `'CRL_HAS_EXPIRED'`: CRLの有効期限が切れました。
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: 証明書のnotBeforeフィールドに形式エラーがあります。
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: 証明書のnotAfterフィールドに形式エラーがあります。
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: CRLのlastUpdateフィールドに形式エラーがあります。
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: CRLのnextUpdateフィールドに形式エラーがあります。
- `'OUT_OF_MEM'`: メモリ不足です。
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: 自己署名証明書です。
- `'SELF_SIGNED_CERT_IN_CHAIN'`: 証明書チェーン内の自己署名証明書です。
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: ローカル発行者証明書を取得できません。
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: 最初の証明書を検証できません。
- `'CERT_CHAIN_TOO_LONG'`: 証明書チェーンが長すぎます。
- `'CERT_REVOKED'`: 証明書は失効しました。
- `'INVALID_CA'`: 無効なCA証明書です。
- `'PATH_LENGTH_EXCEEDED'`: パス長の制約を超えました。
- `'INVALID_PURPOSE'`: サポートされていない証明書の目的です。
- `'CERT_UNTRUSTED'`: 証明書は信頼されていません。
- `'CERT_REJECTED'`: 証明書は拒否されました。
- `'HOSTNAME_MISMATCH'`: ホスト名が一致しません。


## クラス: `tls.CryptoStream` {#class-tlscryptostream}

**追加: v0.3.4**

**非推奨: v0.11.3 以降**

::: danger [安定: 0 - 非推奨]
[安定: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) を使用してください。
:::

`tls.CryptoStream` クラスは、暗号化されたデータのストリームを表します。このクラスは非推奨であり、もはや使用すべきではありません。

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**追加: v0.3.4**

**非推奨: v0.11.3 以降**

`cryptoStream.bytesWritten` プロパティは、TLS プロトコルの実装に必要なバイト数*を含む*、基になるソケットに書き込まれたバイト数の合計を返します。

## クラス: `tls.SecurePair` {#class-tlssecurepair}

**追加: v0.3.2**

**非推奨: v0.11.3 以降**

::: danger [安定: 0 - 非推奨]
[安定: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) を使用してください。
:::

[`tls.createSecurePair()`](/ja/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options) によって返されます。

### イベント: `'secure'` {#event-secure}

**追加: v0.3.2**

**非推奨: v0.11.3 以降**

`'secure'` イベントは、安全な接続が確立されると `SecurePair` オブジェクトによって発行されます。

サーバーの [`'secureConnection'`](/ja/nodejs/api/tls#event-secureconnection) イベントの確認と同様に、使用された証明書が適切に認証されているかどうかを確認するために `pair.cleartext.authorized` を検査する必要があります。

## クラス: `tls.Server` {#class-tlsserver}

**追加: v0.3.2**

- 継承元: [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

TLS または SSL を使用して暗号化された接続を受け入れます。

### イベント: `'connection'` {#event-connection}

**追加: v0.3.2**

- `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

このイベントは、TLS ハンドシェイクが始まる前に、新しい TCP ストリームが確立されたときに発行されます。`socket` は通常、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) 型のオブジェクトですが、[`net.Server`](/ja/nodejs/api/net#class-netserver) `'connection'` イベントから作成されたソケットとは異なり、イベントを受信しません。通常、ユーザーはこのイベントにアクセスしたくないでしょう。

このイベントは、ユーザーが TLS サーバーに接続を注入するために明示的に発行することもできます。その場合、任意の [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームを渡すことができます。


### イベント: `'keylog'` {#event-keylog}

**追加:** v12.3.0, v10.20.0

- `line` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) NSS `SSLKEYLOGFILE` 形式の ASCII テキスト行。
- `tlsSocket` [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) それが生成された `tls.TLSSocket` インスタンス。

`keylog` イベントは、このサーバーへの接続によってキーマテリアルが生成または受信されたときに発行されます (通常はハンドシェイクが完了する前ですが、必ずしもそうではありません)。このキーマテリアルは、キャプチャされた TLS トラフィックを復号化できるため、デバッグ用に保存できます。ソケットごとに複数回発行されることがあります。

典型的な使用例は、受信した行を共通のテキストファイルに追加し、後でソフトウェア (Wireshark など) でトラフィックを復号化することです。

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // 特定の IP のキーのみをログに記録
  logFile.write(line);
});
```
### イベント: `'newSession'` {#event-newsession}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v0.11.12 | `callback` 引数がサポートされるようになりました。 |
| v0.9.2 | 追加: v0.9.2 |
:::

`'newSession'` イベントは、新しい TLS セッションの作成時に発行されます。これは、セッションを外部ストレージに保存するために使用できます。データは、[`'resumeSession'`](/ja/nodejs/api/tls#event-resumesession) コールバックに提供される必要があります。

リスナーコールバックは、呼び出されると3つの引数が渡されます。

- `sessionId` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLS セッション識別子
- `sessionData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLS セッションデータ
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) セキュアな接続を介してデータが送受信されるためには、引数なしで呼び出す必要があるコールバック関数。

このイベントをリッスンすると、イベントリスナーの追加後に確立された接続にのみ影響します。

### イベント: `'OCSPRequest'` {#event-ocsprequest}

**追加:** v0.11.13

`'OCSPRequest'` イベントは、クライアントが証明書ステータス要求を送信したときに発行されます。リスナーコールバックは、呼び出されると3つの引数が渡されます。

- `certificate` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) サーバー証明書
- `issuer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 発行者の証明書
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) OCSP 要求の結果を提供するために呼び出す必要があるコールバック関数。

サーバーの現在の証明書を解析して、OCSP URL と証明書 ID を取得できます。OCSP 応答を取得した後、`callback(null, resp)` が呼び出されます。ここで、`resp` は OCSP 応答を含む `Buffer` インスタンスです。`certificate` と `issuer` はどちらも、プライマリ証明書と発行者の証明書の `Buffer` DER 表現です。これらを使用して、OCSP 証明書 ID と OCSP エンドポイント URL を取得できます。

または、OCSP 応答がないことを示す `callback(null, null)` を呼び出すこともできます。

`callback(err)` を呼び出すと、`socket.destroy(err)` 呼び出しが発生します。

OCSP 要求の典型的な流れは次のとおりです。

証明書が自己署名であるか、発行者がルート証明書リストにない場合、`issuer` は `null` になる可能性があります。(TLS 接続を確立するときに、`ca` オプションを介して発行者を提供できます。)

このイベントをリッスンすると、イベントリスナーの追加後に確立された接続にのみ影響します。

[asn1.js](https://www.npmjs.com/package/asn1.js) のような npm モジュールを使用して、証明書を解析できます。


### Event: `'resumeSession'` {#event-resumesession}

**追加:** v0.9.2

`'resumeSession'` イベントは、クライアントが以前の TLS セッションの再開を要求したときに発生します。リスナーのコールバックは、呼び出されたときに次の2つの引数を渡されます。

- `sessionId` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLSセッション識別子
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 以前のセッションが回復されたときに呼び出されるコールバック関数: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 

イベントリスナーは、指定された `sessionId` を使用して、[`'newSession'`](/ja/nodejs/api/tls#event-newsession) イベントハンドラーによって保存された `sessionData` を外部ストレージで検索する必要があります。見つかった場合は、`callback(null, sessionData)` を呼び出してセッションを再開します。見つからない場合、セッションは再開できません。ハンドシェイクを続行して新しいセッションを作成できるように、`sessionData` なしで `callback()` を呼び出す必要があります。 `callback(err)` を呼び出して、受信接続を終了し、ソケットを破棄することができます。

このイベントをリッスンすることは、イベントリスナーの追加後に確立された接続にのみ影響します。

以下は、TLSセッションの再開を示すものです。

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### Event: `'secureConnection'` {#event-secureconnection}

**追加:** v0.3.2

`'secureConnection'` イベントは、新しい接続のハンドシェイクプロセスが正常に完了した後に発生します。リスナーのコールバックは、呼び出されたときに単一の引数を渡されます。

- `tlsSocket` [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) 確立されたTLSソケット。

`tlsSocket.authorized` プロパティは、クライアントがサーバーに提供された認証局のいずれかによって検証されたかどうかを示す `boolean` です。 `tlsSocket.authorized` が `false` の場合、`socket.authorizationError` は認証が失敗した理由を説明するように設定されます。TLSサーバーの設定によっては、未承認の接続が引き続き受け入れられる場合があります。

`tlsSocket.alpnProtocol` プロパティは、選択されたALPNプロトコルを含む文字列です。クライアントまたはサーバーがALPN拡張を送信しなかったため、ALPNに選択されたプロトコルがない場合、`tlsSocket.alpnProtocol` は `false` になります。

`tlsSocket.servername` プロパティは、SNIを介して要求されたサーバー名を含む文字列です。


### イベント: `'tlsClientError'` {#event-tlsclienterror}

**追加:** v6.0.0

`'tlsClientError'` イベントは、安全な接続が確立される前にエラーが発生した場合に発生します。リスナーのコールバックは、呼び出されるときに次の2つの引数が渡されます。

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) エラーを記述する `Error` オブジェクト
- `tlsSocket` [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) エラーが発生した `tls.TLSSocket` インスタンス

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**追加:** v0.5.3

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SNI ホスト名またはワイルドカード (例: `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `options` 引数 (例: `key`、`cert`、`ca` など) から可能なプロパティを含むオブジェクト、または [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) 自体で作成された TLS コンテキストオブジェクト。

`server.addContext()` メソッドは、クライアントのリクエストの SNI 名が指定された `hostname` (またはワイルドカード) と一致する場合に使用される安全なコンテキストを追加します。

複数のマッチするコンテキストがある場合、最後に登録されたものが使用されます。

### `server.address()` {#serveraddress}

**追加:** v0.6.0

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

オペレーティングシステムによって報告された、サーバーのバインドされたアドレス、アドレスファミリ名、およびポートを返します。詳細については、[`net.Server.address()`](/ja/nodejs/api/net#serveraddress) を参照してください。

### `server.close([callback])` {#serverclosecallback}

**追加:** v0.3.2

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) サーバーインスタンスの `'close'` イベントをリッスンするために登録されるリスナーコールバック。
- 戻り値: [\<tls.Server\>](/ja/nodejs/api/tls#class-tlsserver)

`server.close()` メソッドは、サーバーが新しい接続を受け入れるのを停止します。

この関数は非同期的に動作します。サーバーに開いている接続がなくなると、`'close'` イベントが発生します。


### `server.getTicketKeys()` {#servergetticketkeys}

**Added in: v3.0.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) セッションチケットキーを含む48バイトのバッファ。

セッションチケットキーを返します。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。

### `server.listen()` {#serverlisten}

暗号化された接続をリッスンするサーバーを起動します。このメソッドは、[`net.Server`](/ja/nodejs/api/net#class-netserver)の[`server.listen()`](/ja/nodejs/api/net#serverlisten) と同一です。

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Added in: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `options` 引数 (例: `key`、`cert`、`ca` など) から使用可能なプロパティを含むオブジェクト。

`server.setSecureContext()` メソッドは、既存のサーバーのセキュアコンテキストを置き換えます。サーバーへの既存の接続は中断されません。

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Added in: v3.0.0**

- `keys` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) セッションチケットキーを含む48バイトのバッファ。

セッションチケットキーを設定します。

チケットキーへの変更は、今後のサーバー接続に対してのみ有効です。既存のサーバー接続または現在保留中のサーバー接続は、以前のキーを使用します。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。

## Class: `tls.TLSSocket` {#class-tlstlssocket}

**Added in: v0.11.4**

- 拡張: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

書き込まれたデータの透過的な暗号化と、必要なすべてのTLSネゴシエーションを実行します。

`tls.TLSSocket` のインスタンスは、duplex [Stream](/ja/nodejs/api/stream#stream) インターフェースを実装します。

TLS接続メタデータ (例: [`tls.TLSSocket.getPeerCertificate()`](/ja/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) を返すメソッドは、接続が開いている間のみデータを返します。


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.2.0 | `enableTrace` オプションがサポートされるようになりました。 |
| v5.0.0 | ALPN オプションがサポートされるようになりました。 |
| v0.11.4 | 追加: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) サーバー側では、任意の `Duplex` ストリーム。クライアント側では、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) の任意のインスタンス (クライアント側での一般的な `Duplex` ストリームのサポートには、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) を使用する必要があります)。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。
    - `isServer`: SSL/TLS プロトコルは非対称であるため、TLSSocket はサーバーとして動作するかクライアントとして動作するかを知る必要があります。 `true` の場合、TLS ソケットはサーバーとしてインスタンス化されます。**デフォルト:** `false`。
    - `server` [\<net.Server\>](/ja/nodejs/api/net#class-netserver) [`net.Server`](/ja/nodejs/api/net#class-netserver) インスタンス。
    - `requestCert`: 証明書を要求してリモートピアを認証するかどうか。 クライアントは常にサーバー証明書を要求します。 サーバー (`isServer` が true) は、クライアント証明書を要求するために `requestCert` を true に設定できます。
    - `rejectUnauthorized`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。
    - `ALPNProtocols`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。
    - `SNICallback`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。
    - `session` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLS セッションを含む `Buffer` インスタンス。
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、OCSP ステータスリクエスト拡張がクライアント hello に追加され、セキュアな通信を確立する前に `'OCSPResponse'` イベントがソケットで発行されることを指定します。
    - `secureContext`: [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) で作成された TLS コンテキストオブジェクト。 `secureContext` が提供*されない*場合、`options` オブジェクト全体を `tls.createSecureContext()` に渡すことで作成されます。
    - ...: `secureContext` オプションがない場合に使用される [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) オプション。 それ以外の場合は無視されます。

既存の TCP ソケットから新しい `tls.TLSSocket` オブジェクトを構築します。


### Event: `'keylog'` {#event-keylog_1}

**追加:** v12.3.0, v10.20.0

- `line` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) NSS `SSLKEYLOGFILE` 形式の ASCII テキスト行。

`keylog` イベントは、キーマテリアルがソケットによって生成または受信されたときに `tls.TLSSocket` で発生します。このキーマテリアルは、キャプチャされた TLS トラフィックを復号化できるため、デバッグ用に保存できます。ハンドシェイクが完了する前または後に、複数回発生する可能性があります。

一般的なユースケースは、受信した行を共通のテキストファイルに追加し、後でソフトウェア (Wireshark など) がトラフィックを復号化するために使用することです。

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Event: `'OCSPResponse'` {#event-ocspresponse}

**追加:** v0.11.13

`'OCSPResponse'` イベントは、`tls.TLSSocket` が作成されたときに `requestOCSP` オプションが設定され、OCSP レスポンスが受信された場合に発生します。リスナーコールバックが呼び出されるときに、単一の引数が渡されます。

- `response` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) サーバーの OCSP レスポンス

通常、`response` は、サーバーの証明書の失効ステータスに関する情報を含む、サーバーの CA からのデジタル署名されたオブジェクトです。

### Event: `'secureConnect'` {#event-secureconnect}

**追加:** v0.11.4

`'secureConnect'` イベントは、新しい接続のハンドシェイクプロセスが正常に完了した後に発生します。リスナーコールバックは、サーバーの証明書が承認されたかどうかに関係なく呼び出されます。サーバー証明書が指定された CA のいずれかによって署名されたかどうかを判断するのはクライアントの責任です。`tlsSocket.authorized === false` の場合、エラーは `tlsSocket.authorizationError` プロパティを調べることで見つけることができます。ALPN が使用された場合、`tlsSocket.alpnProtocol` プロパティをチェックして、ネゴシエートされたプロトコルを判断できます。

`'secureConnect'` イベントは、`new tls.TLSSocket()` コンストラクターを使用して [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket) が作成された場合には発生しません。


### Event: `'session'` {#event-session}

**Added in: v11.10.0**

- `session` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`'session'` イベントは、新しいセッションまたは TLS チケットが利用可能な場合に、クライアントの `tls.TLSSocket` で発行されます。これは、ネゴシエートされた TLS プロトコルバージョンによっては、ハンドシェイクが完了する前である場合とそうでない場合があります。このイベントはサーバーでは発行されません。また、接続が再開された場合など、新しいセッションが作成されなかった場合も発行されません。一部の TLS プロトコルバージョンでは、イベントが複数回発行される場合があり、その場合、すべてのセッションを再開に使用できます。

クライアントでは、`session` を [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) の `session` オプションに指定して、接続を再開できます。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption) を参照してください。

TLSv1.2 以下では、ハンドシェイクが完了すると、[`tls.TLSSocket.getSession()`](/ja/nodejs/api/tls#tlssocketgetsession) を呼び出すことができます。TLSv1.3 では、プロトコルによってチケットベースの再開のみが許可され、複数のチケットが送信され、ハンドシェイクが完了するまでチケットは送信されません。したがって、再開可能なセッションを取得するには、`'session'` イベントを待つ必要があります。アプリケーションは、すべての TLS バージョンで動作するように、`getSession()` の代わりに `'session'` イベントを使用する必要があります。1 つのセッションのみを取得または使用することを想定するアプリケーションは、このイベントを 1 回だけリッスンする必要があります。

```js [ESM]
tlsSocket.once('session', (session) => {
  // セッションは、すぐに、または後で使用できます。
  tls.connect({
    session: session,
    // その他の接続オプション...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.4.0 | `family` プロパティが、数値ではなく文字列を返すようになりました。 |
| v18.0.0 | `family` プロパティが、文字列ではなく数値を返すようになりました。 |
| v0.11.4 | Added in: v0.11.4 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

オペレーティングシステムによって報告される、基になるソケットのバインドされた `address`、アドレス `family` 名、および `port` を返します: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Added in: v0.11.4**

ピアの証明書が検証されなかった理由を返します。このプロパティは、`tlsSocket.authorized === false` の場合にのみ設定されます。

### `tlsSocket.authorized` {#tlssocketauthorized}

**Added in: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このプロパティは、ピア証明書が `tls.TLSSocket` インスタンスの作成時に指定された CA のいずれかによって署名されている場合は `true`、そうでない場合は `false` です。

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Added in: v8.4.0**

この `TLSSocket` インスタンスの TLS 再ネゴシエーションを無効にします。一度呼び出されると、再ネゴシエーションの試行は `TLSSocket` で `'error'` イベントをトリガーします。

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Added in: v12.2.0**

有効にすると、TLS パケットトレース情報が `stderr` に書き込まれます。これは、TLS 接続の問題をデバッグするために使用できます。

出力の形式は、`openssl s_client -trace` または `openssl s_server -trace` の出力と同じです。OpenSSL の `SSL_trace()` 関数によって生成されますが、形式はドキュメント化されておらず、予告なしに変更される可能性があり、依存すべきではありません。

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Added in: v0.11.4**

常に `true` を返します。これは、TLS ソケットを通常の `net.Socket` インスタンスと区別するために使用できます。

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Added in: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) キーマテリアルから取得するバイト数
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) アプリケーション固有のラベル。通常、これは [IANA Exporter Label Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels) の値になります。
-  `context` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オプションでコンテキストを提供します。
-  Returns: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) キーマテリアルのリクエストされたバイト数

キーマテリアルは、ネットワークプロトコルにおけるさまざまな種類の攻撃を防ぐための検証に使用されます。たとえば、IEEE 802.1X の仕様で使用されます。

例

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Example return value of keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
詳細については、OpenSSL の [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) のドキュメントを参照してください。


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Added in: v11.2.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ローカル証明書を表すオブジェクトを返します。返されるオブジェクトは、証明書のフィールドに対応するいくつかのプロパティを持ちます。

証明書の構造の例については、[`tls.TLSSocket.getPeerCertificate()`](/ja/nodejs/api/tls#tlssocketgetpeercertificatedetailed) を参照してください。

ローカル証明書がない場合は、空のオブジェクトが返されます。ソケットが破棄されている場合は、`null` が返されます。

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.4.0, v12.16.0 | IETF の暗号名を `standardName` として返します。 |
| v12.0.0 | 固定文字列 (`'TLSv1/SSLv3'`) の代わりに、最小暗号バージョンを返します。 |
| v0.11.4 | Added in: v0.11.4 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 暗号スイートの OpenSSL 名。
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 暗号スイートの IETF 名。
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) この暗号スイートがサポートする最小 TLS プロトコルバージョン。 実際にネゴシエートされたプロトコルについては、[`tls.TLSSocket.getProtocol()`](/ja/nodejs/api/tls#tlssocketgetprotocol) を参照してください。
  
 

ネゴシエートされた暗号スイートに関する情報を含むオブジェクトを返します。

たとえば、AES256-SHA 暗号を使用した TLSv1.2 プロトコル:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
詳細については、[SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) を参照してください。

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Added in: v5.0.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

クライアント接続での [完全前方秘匿性](/ja/nodejs/api/tls#perfect-forward-secrecy) における一時鍵交換のパラメータの型、名前、およびサイズを表すオブジェクトを返します。 キー交換が一時的でない場合は、空のオブジェクトを返します。 これはクライアントソケットでのみサポートされているため、サーバーソケットで呼び出された場合は `null` が返されます。 サポートされている型は `'DH'` と `'ECDH'` です。 `name` プロパティは、型が `'ECDH'` の場合にのみ使用可能です。

例: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`。


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Added in: v9.9.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) SSL/TLSハンドシェイクの一部としてソケットに送信された最新の `Finished` メッセージ、または `Finished` メッセージがまだ送信されていない場合は `undefined`。

`Finished` メッセージは、完全なハンドシェイクのメッセージダイジェストであるため（TLS 1.0では合計192ビット、SSL 3.0ではそれ以上）、SSL/TLSによって提供される認証が望ましくない場合、または十分でない場合に、外部認証手順に使用できます。

OpenSSLの `SSL_get_finished` ルーチンに対応し、[RFC 5929](https://tools.ietf.org/html/rfc5929) の `tls-unique` チャネルバインディングを実装するために使用できます。

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Added in: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、完全な証明書チェーンを含め、それ以外の場合はピアの証明書のみを含めます。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 証明書オブジェクト。

ピアの証明書を表すオブジェクトを返します。 ピアが証明書を提供しない場合、空のオブジェクトが返されます。 ソケットが破棄されている場合、`null` が返されます。

完全な証明書チェーンが要求された場合、各証明書には、その発行者の証明書を表すオブジェクトを含む `issuerCertificate` プロパティが含まれます。

#### 証明書オブジェクト {#certificate-object}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.1.0, v18.13.0 | "ca" プロパティを追加。 |
| v17.2.0, v16.14.0 | fingerprint512 を追加。 |
| v11.4.0 | 楕円曲線公開鍵情報をサポート。 |
:::

証明書オブジェクトには、証明書のフィールドに対応するプロパティがあります。

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 証明機関 (CA) の場合は `true`、それ以外の場合は `false`。
- `raw` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) DER エンコードされた X.509 証明書データ。
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 証明書のサブジェクト。国 (`C`)、州/都道府県 (`ST`)、所在地 (`L`)、組織 (`O`)、組織単位 (`OU`)、および共通名 (`CN`) で記述されます。 共通名は通常、TLS 証明書を持つ DNS 名です。 例: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`。
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 証明書の発行者。`subject` と同じ用語で記述されます。
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 証明書が有効な開始日時。
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 証明書が有効な終了日時。
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 証明書のシリアル番号 (16進文字列)。 例: `'B9B0D332A1AA5635'`。
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER エンコードされた証明書の SHA-1 ダイジェスト。 `:` で区切られた 16 進文字列として返されます。 例: `'2A:7A:C2:DD:...'`。
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER エンコードされた証明書の SHA-256 ダイジェスト。 `:` で区切られた 16 進文字列として返されます。 例: `'2A:7A:C2:DD:...'`。
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DER エンコードされた証明書の SHA-512 ダイジェスト。 `:` で区切られた 16 進文字列として返されます。 例: `'2A:7A:C2:DD:...'`。
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (オプション) 拡張キー使用法。OID のセット。
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (オプション) サブジェクトの連結された名前を含む文字列。`subject` 名の代替。
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (オプション) AuthorityInfoAccess を記述する配列。OCSP で使用されます。
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (オプション) 発行者の証明書オブジェクト。自己署名証明書の場合、これは循環参照になる場合があります。

証明書には、鍵の種類に応じて、公開鍵に関する情報が含まれている場合があります。

RSA 鍵の場合、次のプロパティが定義されている場合があります。

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA ビットサイズ。 例: `1024`。
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) RSA 指数 (16進数の文字列)。 例: `'0x010001'`。
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) RSA 係数 (16進文字列)。 例: `'B56CE45CB7...'`。
- `pubkey` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵。

EC 鍵の場合、次のプロパティが定義されている場合があります。

- `pubkey` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵。
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 鍵サイズ (ビット単位)。 例: `256`。
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (オプション) 楕円曲線の OID の ASN.1 名。既知の曲線は OID で識別されます。 通常ではありませんが、曲線がその数学的特性によって識別される場合、OID はありません。 例: `'prime256v1'`。
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (オプション) 楕円曲線の NIST 名 (名前が NIST によって割り当てられていない既知の曲線もあります)。 例: `'P-256'`。

証明書の例:

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**Added in: v9.9.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) SSL/TLSハンドシェイクの一部として、ソケットから予期されるか、実際に受信した最新の`Finished`メッセージ。まだ`Finished`メッセージがない場合は`undefined`を返します。

`Finished`メッセージは、完全なハンドシェイクのメッセージダイジェストであるため（TLS 1.0では合計192ビット、SSL 3.0ではそれ以上）、SSL/TLSによって提供される認証が望ましくないか、不十分な場合に、外部認証手順に使用できます。

OpenSSLの`SSL_get_peer_finished`ルーチンに対応し、[RFC 5929](https://tools.ietf.org/html/rfc5929)の`tls-unique`チャネルバインディングを実装するために使用できます。

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Added in: v15.9.0**

- 戻り値: [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)

ピア証明書を[\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)オブジェクトとして返します。

ピア証明書がない場合、またはソケットが破棄された場合、`undefined`が返されます。

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Added in: v5.7.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

現在の接続でネゴシエートされたSSL/TLSプロトコルバージョンを含む文字列を返します。値`'unknown'`は、ハンドシェイクプロセスが完了していない接続済みソケットに対して返されます。値`null`は、サーバーソケットまたは切断されたクライアントソケットに対して返されます。

プロトコルバージョンは次のとおりです。

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

詳細については、OpenSSLの[`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version)ドキュメントを参照してください。

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Added in: v0.11.4**

- [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

TLSセッションデータを返します。セッションがネゴシエートされていない場合は`undefined`を返します。クライアントでは、このデータを[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)の`session`オプションに指定して、接続を再開できます。サーバーでは、デバッグに役立つ場合があります。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。

注意: `getSession()`はTLSv1.2以下でのみ機能します。TLSv1.3の場合、アプリケーションは[`'session'`](/ja/nodejs/api/tls#event-session)イベントを使用する必要があります（TLSv1.2以下でも機能します）。


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Added in: v12.11.0**

- 戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) サーバーとクライアント間で共有される署名アルゴリズムのリストを、優先度の高い順に返します。

詳細については、[SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs)を参照してください。

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Added in: v0.11.4**

- [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

クライアントの場合、TLSセッションチケットが利用可能な場合はそれを返し、利用できない場合は `undefined` を返します。サーバーの場合、常に `undefined` を返します。

デバッグに役立つことがあります。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Added in: v15.9.0**

- 戻り値: [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)

ローカル証明書を [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate) オブジェクトとして返します。

ローカル証明書がない場合、またはソケットが破棄されている場合は、`undefined` が返されます。

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Added in: v0.5.6**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) セッションが再利用された場合は `true`、そうでない場合は `false`。

詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ローカルIPアドレスの文字列表現を返します。

### `tlsSocket.localPort` {#tlssocketlocalport}

**Added in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ローカルポートの数値表現を返します。

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リモートIPアドレスの文字列表現を返します。たとえば、 `'74.125.127.100'` や `'2001:4860:a005::68'` などです。


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Added in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

リモートIPファミリーの文字列形式を返します。 `'IPv4'` または `'IPv6'`。

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Added in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

リモートポートの数値表現を返します。 例えば、`443`。

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.11.8 | Added in: v0.11.8 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` でない場合、サーバー証明書は提供されたCAのリストに対して検証されます。 検証に失敗すると、`'error'` イベントが発生します。 `err.code` にはOpenSSLのエラーコードが含まれます。 **デフォルト:** `true`。
    - `requestCert`
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `renegotiate()` が `true` を返した場合、`'secure'` イベントにコールバックが一度アタッチされます。 `renegotiate()` が `false` を返した場合、`tlsSocket` が破棄されていない限り、エラーとともに次のティックで `callback` が呼び出されます。破棄された場合、`callback` はまったく呼び出されません。
-  返却値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 再ネゴシエーションが開始された場合は `true`、それ以外の場合は `false`。

`tlsSocket.renegotiate()` メソッドはTLS再ネゴシエーションプロセスを開始します。 完了すると、`callback` 関数には、`Error`（リクエストが失敗した場合）または `null` のいずれかである単一の引数が渡されます。

このメソッドは、安全な接続が確立された後に、ピアの証明書を要求するために使用できます。

サーバーとして実行する場合、ソケットは `handshakeTimeout` タイムアウト後にエラーで破棄されます。

TLSv1.3 の場合、再ネゴシエーションを開始することはできません。プロトコルでサポートされていません。


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Added in: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `options` から少なくとも `key` と `cert` プロパティを含むオブジェクト、または [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) 自体で作成された TLS コンテキストオブジェクト。

`tlsSocket.setKeyCert()` メソッドは、ソケットで使用する秘密鍵と証明書を設定します。これは主に、TLS サーバーの `ALPNCallback` からサーバー証明書を選択したい場合に役立ちます。

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Added in: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最大 TLS フラグメントサイズ。最大値は `16384` です。**デフォルト:** `16384`。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`tlsSocket.setMaxSendFragment()` メソッドは、最大 TLS フラグメントサイズを設定します。制限の設定に成功した場合は `true`、それ以外の場合は `false` を返します。

フラグメントサイズが小さいほど、クライアント側のバッファリングレイテンシーが減少します。フラグメントが大きいと、フラグメント全体が受信され、その整合性が検証されるまで TLS レイヤーによってバッファリングされます。大きなフラグメントは複数のラウンドトリップにまたがる可能性があり、パケットの損失や順序の変更により、その処理が遅れる可能性があります。ただし、フラグメントが小さいと、TLS フレームのバイト数と CPU オーバーヘッドが増加し、サーバーのスループット全体が低下する可能性があります。

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | CVE-2021-44531 に対応して、`uniformResourceIdentifier` サブジェクト代替名のサポートが無効になりました。 |
| v0.8.4 | Added in: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 証明書を検証するホスト名または IP アドレス。
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) ピアの証明書を表す [証明書オブジェクト](/ja/nodejs/api/tls#certificate-object)。
- 戻り値: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

証明書 `cert` が `hostname` に発行されていることを検証します。

失敗すると、[\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) オブジェクトを返し、`reason`、`host`、および `cert` を設定します。成功すると、[\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) を返します。

この関数は、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) に渡すことができる `checkServerIdentity` オプションと組み合わせて使用することを目的としており、[証明書オブジェクト](/ja/nodejs/api/tls#certificate-object) で動作します。その他の目的では、代わりに [`x509.checkHost()`](/ja/nodejs/api/crypto#x509checkhostname-options) の使用を検討してください。

この関数は、`tls.connect()` に渡される `options.checkServerIdentity` オプションとして代替関数を提供することで上書きできます。上書き関数は、追加の検証を行うために、もちろん `tls.checkServerIdentity()` を呼び出すことができます。

この関数は、証明書が信頼できる CA（`options.ca`）によって発行されているなど、他のすべてのチェックに合格した場合にのみ呼び出されます。

以前のバージョンの Node.js では、一致する `uniformResourceIdentifier` サブジェクト代替名が存在する場合、指定された `hostname` の証明書が誤って受け入れられました（[CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531) を参照）。`uniformResourceIdentifier` サブジェクト代替名を受け入れるアプリケーションは、目的の動作を実装するカスタムの `options.checkServerIdentity` 関数を使用できます。


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.1.0, v14.18.0 | `onread` オプションが追加されました。 |
| v14.1.0, v13.14.0 | `highWaterMark` オプションが受け入れられるようになりました。 |
| v13.6.0, v12.16.0 | `pskCallback` オプションがサポートされるようになりました。 |
| v12.9.0 | `allowHalfOpen` オプションをサポートします。 |
| v12.4.0 | `hints` オプションがサポートされるようになりました。 |
| v12.2.0 | `enableTrace` オプションがサポートされるようになりました。 |
| v11.8.0, v10.16.0 | `timeout` オプションがサポートされるようになりました。 |
| v8.0.0 | `lookup` オプションがサポートされるようになりました。 |
| v8.0.0 | `ALPNProtocols` オプションは `TypedArray` または `DataView` になれるようになりました。 |
| v5.0.0 | ALPN オプションがサポートされるようになりました。 |
| v5.3.0, v4.7.0 | `secureContext` オプションがサポートされるようになりました。 |
| v0.11.3 | 追加: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) を参照してください。
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアントが接続するホスト。**デフォルト:** `'localhost'`。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) クライアントが接続するポート。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パスへの Unix ソケット接続を作成します。 このオプションが指定された場合、`host` と `port` は無視されます。
    - `socket` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex) 新しいソケットを作成するのではなく、指定されたソケットで安全な接続を確立します。 通常、これは [`net.Socket`](/ja/nodejs/api/net#class-netsocket) のインスタンスですが、任意の `Duplex` ストリームが許可されています。 このオプションが指定された場合、証明書の検証を除き、`path`、`host`、および `port` は無視されます。 通常、ソケットは `tls.connect()` に渡されるときにすでに接続されていますが、後で接続することもできます。 `socket` の接続/切断/破棄はユーザーの責任です。`tls.connect()` を呼び出しても `net.connect()` が呼び出されることはありません。
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` に設定すると、ソケットは読み取り側が終了したときに書き込み側を自動的に終了します。 `socket` オプションが設定されている場合、このオプションは効果がありません。 詳細については、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) の `allowHalfOpen` オプションを参照してください。 **デフォルト:** `false`。
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` でない場合、サーバー証明書が提供された CA のリストと照合して検証されます。 検証に失敗すると `'error'` イベントが発生します。`err.code` には OpenSSL エラーコードが含まれます。 **デフォルト:** `true`。
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) TLS-PSK ネゴシエーションについては、[事前共有鍵](/ja/nodejs/api/tls#pre-shared-keys) を参照してください。
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) サポートされている ALPN プロトコルを含む、文字列、`Buffer`、`TypedArray`、または `DataView` の配列、または単一の `Buffer`、`TypedArray`、または `DataView`。 `Buffer` は `[len][name][len][name]...` の形式である必要があります。例えば、`'\x08http/1.1\x08http/1.0'` です。ここで `len` バイトは次のプロトコル名の長さです。 配列を渡す方が通常ははるかに簡単です。例えば、`['http/1.1', 'http/1.0']` です。 リストの前の方にあるプロトコルは、後の方にあるプロトコルよりも優先順位が高くなります。
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SNI (Server Name Indication) TLS 拡張機能のサーバー名。 これは接続先のホストの名前であり、ホスト名である必要があり、IP アドレスであってはなりません。 これは、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) の `SNICallback` オプションを参照して、マルチホームサーバーがクライアントに提示する正しい証明書を選択するために使用できます。
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) サーバーのホスト名 (または明示的に設定されている場合は指定された `servername`) を証明書と照合するときに、(組み込みの `tls.checkServerIdentity()` 関数の代わりに) 使用されるコールバック関数。 検証に失敗した場合は、[\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) を返す必要があります。 `servername` と `cert` が検証された場合、メソッドは `undefined` を返す必要があります。
    - `session` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLS セッションを含む `Buffer` インスタンス。
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TLS 接続を受け入れるための DH パラメータの最小サイズ (ビット単位)。 サーバーが `minDHSize` より小さいサイズの DH パラメータを提供すると、TLS 接続は破棄され、エラーがスローされます。 **デフォルト:** `1024`。
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Readable ストリームの `highWaterMark` パラメータと一貫性があります。 **デフォルト:** `16 * 1024`。
    - `secureContext`: [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) で作成された TLS コンテキストオブジェクト。 `secureContext` が*提供されない*場合、`options` オブジェクト全体を `tls.createSecureContext()` に渡すことによって作成されます。
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `socket` オプションがない場合、受信データは単一の `buffer` に格納され、データがソケットに到着したときに指定された `callback` に渡されます。それ以外の場合、オプションは無視されます。 詳細については、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) の `onread` オプションを参照してください。
    - ...: `secureContext` オプションがない場合に使用される [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) オプション。それ以外の場合は無視されます。
    - ...: まだリストされていない任意の [`socket.connect()`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) オプション。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`callback` 関数が指定されている場合、[`'secureConnect'`](/ja/nodejs/api/tls#event-secureconnect) イベントのリスナーとして追加されます。

`tls.connect()` は [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) オブジェクトを返します。

`https` API とは異なり、`tls.connect()` はデフォルトでは SNI (Server Name Indication) 拡張機能を有効にしません。これにより、一部のサーバーが不正な証明書を返したり、接続を完全に拒否したりする可能性があります。 SNI を有効にするには、`host` に加えて `servername` オプションを設定します。

以下は、[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) のエコーサーバーの例のクライアントを示しています。

::: code-group
```js [ESM]
// ポート 8000 でリッスンしているエコーサーバーを想定します。
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // サーバーがクライアント証明書認証を必要とする場合にのみ必要です。
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // サーバーが自己署名証明書を使用している場合にのみ必要です。
  ca: [ readFileSync('server-cert.pem') ],

  // サーバーの証明書が "localhost" 用ではない場合にのみ必要です。
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('クライアントが接続しました',
              socket.authorized ? '承認済み' : '承認されていません');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('サーバーが接続を終了しました');
});
```

```js [CJS]
// ポート 8000 でリッスンしているエコーサーバーを想定します。
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // サーバーがクライアント証明書認証を必要とする場合にのみ必要です。
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // サーバーが自己署名証明書を使用している場合にのみ必要です。
  ca: [ readFileSync('server-cert.pem') ],

  // サーバーの証明書が "localhost" 用ではない場合にのみ必要です。
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('クライアントが接続しました',
              socket.authorized ? '承認済み' : '承認されていません');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('サーバーが接続を終了しました');
});
```
:::

この例の証明書と鍵を生成するには、次を実行します。

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
次に、この例の `server-cert.pem` 証明書を生成するには、次を実行します。

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Added in: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.path` のデフォルト値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)を参照。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)を参照。
- 戻り値: [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`path` がオプションの代わりに引数として指定できることを除き、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) と同じです。

`path` オプションが指定されている場合、`path` 引数よりも優先されます。

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Added in: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `options.port` のデフォルト値。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `options.host` のデフォルト値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)を参照。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback)を参照。
- 戻り値: [\<tls.TLSSocket\>](/ja/nodejs/api/tls#class-tlstlssocket)

`port` と `host` がオプションの代わりに引数として指定できることを除き、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) と同じです。

`port` または `host` オプションが指定されている場合、`port` または `host` 引数よりも優先されます。

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.9.0, v20.18.0 | `allowPartialTrustChain` オプションが追加されました。 |
| v22.4.0, v20.16.0 | `clientCertEngine`, `privateKeyEngine`, `privateKeyIdentifier` オプションは、OpenSSL 3 で非推奨となった OpenSSL のカスタムエンジンサポートに依存します。 |
| v19.8.0, v18.16.0 | `dhparam` オプションを `'auto'` に設定して、適切な既知のパラメータで DHE を有効にできるようになりました。 |
| v12.12.0 | OpenSSL エンジンから秘密鍵を取得するための `privateKeyIdentifier` および `privateKeyEngine` オプションが追加されました。 |
| v12.11.0 | サポートされている署名アルゴリズムをオーバーライドするための `sigalgs` オプションが追加されました。 |
| v12.0.0 | TLSv1.3 のサポートが追加されました。 |
| v11.5.0 | `ca:` オプションが `BEGIN TRUSTED CERTIFICATE` をサポートするようになりました。 |
| v11.4.0, v10.16.0 | `minVersion` と `maxVersion` を使用して、許可される TLS プロトコルバージョンを制限できます。 |
| v10.0.0 | OpenSSL の変更により、`ecdhCurve` を `false` に設定できなくなりました。 |
| v9.3.0 | `options` パラメーターに `clientCertEngine` を含めることができるようになりました。 |
| v9.0.0 | `ecdhCurve` オプションは、複数の `':'` で区切られた曲線名または `'auto'` にできるようになりました。 |
| v7.3.0 | `key` オプションが配列の場合、個々のエントリに `passphrase` プロパティは不要になりました。`Array` エントリは、単なる `string` または `Buffer` でもかまいません。 |
| v5.2.0 | `ca` オプションは、複数の CA 証明書を含む単一の文字列にできるようになりました。 |
| v0.11.13 | Added in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 信頼された CA 証明書リストの中間 (自己署名されていない) 証明書を信頼されたものとして扱います。
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) 信頼された CA 証明書をオプションでオーバーライドします。デフォルトでは、Mozilla がキュレーションした既知の CA を信頼します。このオプションを使用して CA を明示的に指定すると、Mozilla の CA は完全に置き換えられます。値は、文字列、`Buffer`、または文字列と `Buffer` の `Array` にすることができます。文字列または `Buffer` には、複数の PEM CA を連結して含めることができます。接続を認証するには、ピアの証明書が、サーバーによって信頼されている CA にチェーン可能である必要があります。既知の CA にチェーン可能ではない証明書を使用する場合、証明書の CA は、信頼されているものとして明示的に指定する必要があり、そうでない場合、接続の認証は失敗します。ピアがデフォルトの CA のいずれかと一致しない証明書、またはチェーンしない証明書を使用する場合は、`ca` オプションを使用して、ピアの証明書が一致またはチェーンできる CA 証明書を提供します。自己署名証明書の場合、証明書はそれ自体の CA であり、提供する必要があります。PEM エンコードされた証明書の場合、サポートされているタイプは "TRUSTED CERTIFICATE"、"X509 CERTIFICATE"、"CERTIFICATE" です。[`tls.rootCertificates`](/ja/nodejs/api/tls#tlsrootcertificates) も参照してください。
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) PEM 形式の証明書チェーン。秘密鍵ごとに 1 つの証明書チェーンを提供する必要があります。各証明書チェーンは、提供された秘密 `key` の PEM 形式の証明書、その後に PEM 形式の中間証明書 (存在する場合)、順に構成され、ルート CA は含まれません (ルート CA はピアに事前に認識されている必要があります。`ca` を参照してください)。複数の証明書チェーンを提供する場合、それらは `key` の秘密鍵と同じ順序である必要はありません。中間証明書が提供されない場合、ピアは証明書を検証できず、ハンドシェイクは失敗します。
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サポートされている署名アルゴリズムのコロン区切りのリスト。リストには、ダイジェストアルゴリズム (`SHA256`、`MD5` など)、公開鍵アルゴリズム (`RSA-PSS`、`ECDSA` など)、両方の組み合わせ (例: 'RSA+SHA384')、または TLS v1.3 スキーム名 (例: `rsa_pss_pss_sha512`) を含めることができます。詳細については、[OpenSSL マニュアルページ](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list)を参照してください。
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 暗号スイートの仕様。デフォルトを置き換えます。詳細については、[デフォルトの TLS 暗号スイートの変更](/ja/nodejs/api/tls#modifying-the-default-tls-cipher-suite)を参照してください。許可されている暗号は、[`tls.getCiphers()`](/ja/nodejs/api/tls#tlsgetciphers) を介して取得できます。OpenSSL が受け入れるためには、暗号名はすべて大文字にする必要があります。
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアント証明書を提供できる OpenSSL エンジンの名前。**非推奨。**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) PEM 形式の CRL (証明書失効リスト)。
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `'auto'` またはカスタム Diffie-Hellman パラメーター。非 ECDHE [完全前方秘匿](/ja/nodejs/api/tls#perfect-forward-secrecy) に必要です。省略された場合、または無効な場合、パラメーターは暗黙的に破棄され、DHE 暗号は使用できなくなります。[ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) ベースの [完全前方秘匿](/ja/nodejs/api/tls#perfect-forward-secrecy) は引き続き利用可能です。
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ECDH 鍵合意に使用する名前付き曲線、または曲線 NID または名前のコロン区切りリスト (たとえば、`P-521:P-384:P-256`) を記述する文字列。自動的に曲線を選択するには、`auto` に設定します。利用可能な曲線名のリストを取得するには、[`crypto.getCurves()`](/ja/nodejs/api/crypto#cryptogetcurves) を使用します。最近のリリースでは、`openssl ecparam -list_curves` でも、利用可能な各楕円曲線の名前と説明が表示されます。**デフォルト:** [`tls.DEFAULT_ECDH_CURVE`](/ja/nodejs/api/tls#tlsdefault_ecdh_curve)。
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) クライアントの暗号スイート設定の代わりに、サーバーの暗号スイート設定を使用しようとします。`true` の場合、`SSL_OP_CIPHER_SERVER_PREFERENCE` が `secureOptions` に設定されます。詳細については、[OpenSSL オプション](/ja/nodejs/api/crypto#openssl-options)を参照してください。
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM 形式の秘密鍵。PEM では、秘密鍵を暗号化するオプションを使用できます。暗号化された鍵は `options.passphrase` で復号化されます。暗号化されていない鍵文字列またはバッファーの配列、または `{pem: \<string|buffer\>[, passphrase: \<string\>]}` 形式のオブジェクトの配列として、異なるアルゴリズムを使用する複数の鍵を提供できます。オブジェクト形式は配列でのみ発生する可能性があります。`object.passphrase` はオプションです。暗号化された鍵は、`object.passphrase` が提供されている場合はそれで復号化され、そうでない場合は `options.passphrase` で復号化されます。
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 秘密鍵を取得する OpenSSL エンジンの名前。`privateKeyIdentifier` と一緒に使用する必要があります。**非推奨。**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OpenSSL エンジンによって管理される秘密鍵の識別子。`privateKeyEngine` と一緒に使用する必要があります。`key` と一緒に設定しないでください。両方のオプションは、異なる方法で秘密鍵を定義するためです。**非推奨。**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オプションで、許可する最大 TLS バージョンを設定します。`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'`、または `'TLSv1'` のいずれか。`secureProtocol` オプションと一緒に指定することはできません。どちらか一方を使用してください。**デフォルト:** [`tls.DEFAULT_MAX_VERSION`](/ja/nodejs/api/tls#tlsdefault_max_version)。
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オプションで、許可する最小 TLS バージョンを設定します。`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'`、または `'TLSv1'` のいずれか。`secureProtocol` オプションと一緒に指定することはできません。どちらか一方を使用してください。TLSv1.2 未満に設定することは避けてくださいが、相互運用性には必要になる場合があります。TLSv1.2 より前のバージョンでは、[OpenSSL セキュリティレベル](/ja/nodejs/api/tls#openssl-security-level)のダウングレードが必要になる場合があります。**デフォルト:** [`tls.DEFAULT_MIN_VERSION`](/ja/nodejs/api/tls#tlsdefault_min_version)。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 単一の秘密鍵または PFX に使用される共有パスフレーズ。
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PFX または PKCS12 でエンコードされた秘密鍵と証明書チェーン。`pfx` は、`key` と `cert` を個別に提供する代わりになります。PFX は通常暗号化されており、暗号化されている場合は、`passphrase` を使用して復号化されます。複数の PFX は、暗号化されていない PFX バッファーの配列、または `{buf: \<string|buffer\>[, passphrase: \<string\>]}` 形式のオブジェクトの配列として提供できます。オブジェクト形式は配列でのみ発生する可能性があります。`object.passphrase` はオプションです。暗号化された PFX は、`object.passphrase` が提供されている場合はそれで復号化され、そうでない場合は `options.passphrase` で復号化されます。
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オプションで OpenSSL プロトコルの動作に影響を与えますが、通常は必要ありません。これは慎重に使用する必要があります。値は、[OpenSSL オプション](/ja/nodejs/api/crypto#openssl-options)からの `SSL_OP_*` オプションの数値ビットマスクです。
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用する TLS プロトコルバージョンを選択するための従来のメカニズム。最小バージョンと最大バージョンの独立した制御をサポートせず、プロトコルを TLSv1.3 に制限することをサポートしません。代わりに `minVersion` と `maxVersion` を使用してください。使用可能な値は [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods) としてリストされており、関数名を文字列として使用します。たとえば、TLS バージョン 1.1 を強制するには `'TLSv1_1_method'` を使用し、TLSv1.3 までの任意の TLS プロトコルバージョンを許可するには `'TLS_method'` を使用します。TLS 1.2 未満のバージョンを使用することはお勧めしませんが、相互運用性には必要になる場合があります。**デフォルト:** なし。`minVersion` を参照してください。
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サーバーがアプリケーション間でセッション状態が共有されないようにするために使用する不透明な識別子。クライアントでは未使用。
    - `ticketKeys`: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 暗号学的に強力な擬似乱数データである 48 バイト。詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サーバーによって作成された TLS セッションが再開できなくなるまでの秒数。詳細については、[セッション再開](/ja/nodejs/api/tls#session-resumption)を参照してください。**デフォルト:** `300`。

[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) は `honorCipherOrder` オプションのデフォルト値を `true` に設定しますが、セキュアコンテキストを作成する他の API は設定しません。

[`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) は `process.argv` から生成された 128 ビットの切り捨てられた SHA1 ハッシュ値を `sessionIdContext` オプションのデフォルト値として使用しますが、セキュアコンテキストを作成する他の API にはデフォルト値がありません。

`tls.createSecureContext()` メソッドは `SecureContext` オブジェクトを作成します。これは、[`server.addContext()`](/ja/nodejs/api/tls#serveraddcontexthostname-context) などのいくつかの `tls` API の引数として使用できますが、パブリックメソッドはありません。[`tls.Server`](/ja/nodejs/api/tls#class-tlsserver) コンストラクターと [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) メソッドは `secureContext` オプションをサポートしていません。

証明書を使用する暗号には、鍵が *必須* です。`key` または `pfx` のいずれかを使用して提供できます。

`ca` オプションが指定されていない場合、Node.js はデフォルトで [Mozilla の公開的に信頼されている CA のリスト](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt)を使用します。

カスタム DHE パラメーターは、新しい `dhparam: 'auto'` オプションよりも推奨されません。`'auto'` に設定すると、十分な強度の既知の DHE パラメーターが自動的に選択されます。それ以外の場合、必要に応じて、`openssl dhparam` を使用してカスタムパラメーターを作成できます。キーの長さは 1024 ビット以上である必要があります。そうでない場合、エラーがスローされます。1024 ビットは許可されていますが、より強力なセキュリティのために 2048 ビット以上を使用してください。


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.0.0 | ALPNオプションがサポートされるようになりました。 |
| v0.11.3 | 非推奨: v0.11.3以降 |
| v0.3.2 | 追加: v0.3.2 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに[`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket)を使用してください。
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `tls.createSecureContext()`によって返されるセキュアコンテキストオブジェクト
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このTLS接続をサーバーとして開くことを指定するには`true`。
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) サーバーが接続クライアントから証明書を要求するかどうかを指定するには`true`。 `isServer`が`true`の場合にのみ適用されます。
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`でない場合、サーバーは無効な証明書を持つクライアントを自動的に拒否します。 `isServer`が`true`の場合にのみ適用されます。
- `options`
    - `enableTrace`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)を参照
    - `secureContext`: [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions)からのTLSコンテキストオブジェクト
    - `isServer`: `true`の場合、TLSソケットはサーバーモードでインスタンス化されます。 **デフォルト:** `false`。
    - `server` [\<net.Server\>](/ja/nodejs/api/net#class-netserver) [`net.Server`](/ja/nodejs/api/net#class-netserver)インスタンス
    - `requestCert`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)を参照
    - `rejectUnauthorized`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)を参照
    - `ALPNProtocols`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)を参照
    - `SNICallback`: [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)を参照
    - `session` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) TLSセッションを含む`Buffer`インスタンス。
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、OCSPステータスリクエスト拡張がクライアントハローに追加され、セキュアな通信を確立する前に`'OCSPResponse'`イベントがソケットで発生することを指定します。

暗号化されたデータを読み書きするストリームと、クリアテキストデータを読み書きするストリームの2つのストリームを持つ新しいセキュアペアオブジェクトを作成します。 一般的に、暗号化されたストリームは受信した暗号化されたデータストリームとの間でパイプされ、クリアテキストのストリームは初期の暗号化されたストリームの代替として使用されます。

`tls.createSecurePair()`は、`cleartext`および`encrypted`ストリームプロパティを持つ`tls.SecurePair`オブジェクトを返します。

`cleartext`の使用は、[`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket)と同じAPIを持ちます。

`tls.createSecurePair()`メソッドは、`tls.TLSSocket()`に賛成して非推奨になりました。 たとえば、次のコードです。

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
は次のように置き換えることができます。

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
ここで、`secureSocket`は`pair.cleartext`と同じAPIを持ちます。


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine`オプションは、OpenSSL 3で非推奨となっているOpenSSLのカスタムエンジンサポートに依存しています。 |
| v19.0.0 | `ALPNProtocols`が設定されている場合、サポートされているプロトコルのないALPN拡張を送信する受信接続は、致命的な`no_application_protocol`アラートで終了します。 |
| v20.4.0, v18.19.0 | `options`パラメーターに`ALPNCallback`を含めることができるようになりました。 |
| v12.3.0 | `options` パラメーターは `net.createServer()` オプションをサポートするようになりました。 |
| v9.3.0 | `options`パラメーターに`clientCertEngine`を含めることができるようになりました。 |
| v8.0.0 | `ALPNProtocols` オプションは `TypedArray` または `DataView` を使用できるようになりました。 |
| v5.0.0 | ALPN オプションがサポートされるようになりました。 |
| v0.3.2 | 追加: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) サポートされている ALPN プロトコルを含む文字列、`Buffer`、`TypedArray`、または `DataView` の配列、または単一の `Buffer`、`TypedArray`、または `DataView`。`Buffer` は `[len][name][len][name]...` の形式である必要があります。例えば、`0x05hello0x05world` のように、最初のバイトは次のプロトコル名の長さです。配列を渡す方が通常ははるかに簡単です。例えば、`['hello', 'world']` のようにします (プロトコルは優先順位順に並べる必要があります)。
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 設定されている場合、クライアントがALPN拡張を使用して接続を開くと、これが呼び出されます。コールバックには、`servername`と`protocols`フィールドを含むオブジェクトが1つ渡されます。それぞれ、SNI拡張からのサーバー名(存在する場合)と、ALPNプロトコル名文字列の配列が含まれます。コールバックは、`protocols`にリストされている文字列のいずれかを返す必要があります。これは、選択されたALPNプロトコルとしてクライアントに返されます。または、致命的なアラートで接続を拒否するには、`undefined`を返します。クライアントのALPNプロトコルのいずれにも一致しない文字列が返された場合、エラーがスローされます。このオプションは`ALPNProtocols`オプションと一緒に使用することはできません。両方のオプションを設定するとエラーがスローされます。
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クライアント証明書を提供できるOpenSSLエンジンの名前。 **非推奨。**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、新しい接続で[`tls.TLSSocket.enableTrace()`](/ja/nodejs/api/tls#tlssocketenabletrace)が呼び出されます。セキュリティで保護された接続が確立された後にトレースを有効にできますが、セキュリティで保護された接続のセットアップをトレースするには、このオプションを使用する必要があります。**デフォルト:** `false`。
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定されたミリ秒数でSSL/TLSハンドシェイクが完了しない場合、接続を中止します。ハンドシェイクがタイムアウトすると、`tls.Server`オブジェクトで`'tlsClientError'`が発生します。**デフォルト:** `120000` (120秒)。
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`でない場合、サーバーは、提供されたCAのリストで承認されていない接続を拒否します。このオプションは、`requestCert`が`true`の場合にのみ有効です。**デフォルト:** `true`。
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、サーバーは接続するクライアントから証明書を要求し、その証明書を検証しようとします。**デフォルト:** `false`。
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サーバーによって作成されたTLSセッションが再開できなくなるまでの秒数。[セッション再開](/ja/nodejs/api/tls#session-resumption)の詳細を参照してください。**デフォルト:** `300`。
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) クライアントが SNI TLS 拡張をサポートしている場合に呼び出される関数。 呼び出されると、`servername` と `callback` の 2 つの引数が渡されます。 `callback` は、エラー優先のコールバックで、2 つのオプション引数を受け取ります: `error` と `ctx`。 `ctx` が提供されている場合は、`SecureContext` インスタンスです。 [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) を使用して、適切な `SecureContext` を取得できます。 `callback` が falsey の `ctx` 引数で呼び出された場合、サーバーのデフォルトのセキュアコンテキストが使用されます。 `SNICallback` が提供されなかった場合は、高レベル API を使用したデフォルトのコールバックが使用されます (下記参照)。
    - `ticketKeys`: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 48 バイトの暗号学的に強力な疑似乱数データ。[セッション再開](/ja/nodejs/api/tls#session-resumption)の詳細を参照してください。
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) TLS-PSKネゴシエーションについては、[事前共有鍵](/ja/nodejs/api/tls#pre-shared-keys)を参照してください。
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) TLS-PSKネゴシエーション中にクライアントがアイデンティティを選択するのを助けるために送信するオプションのヒント。TLS 1.3では無視されます。pskIdentityHintの設定に失敗すると、`'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`コードで`'tlsClientError'`が出力されます。
    - ...: 任意の[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions)オプションを指定できます。サーバーの場合、IDオプション (`pfx`、`key`/`cert`、または `pskCallback`) が通常必要です。
    - ...: 任意の[`net.createServer()`](/ja/nodejs/api/net#netcreateserveroptions-connectionlistener)オプションを指定できます。

- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<tls.Server\>](/ja/nodejs/api/tls#class-tlsserver)

新しい[`tls.Server`](/ja/nodejs/api/tls#class-tlsserver)を作成します。`secureConnectionListener`が提供されている場合、[`'secureConnection'`](/ja/nodejs/api/tls#event-secureconnection)イベントのリスナーとして自動的に設定されます。

`ticketKeys` オプションは、`node:cluster` モジュールのワーカー間で自動的に共有されます。

以下は、簡単なエコーサーバーの例です。

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // これは、クライアント証明書認証を使用する場合にのみ必要です。
  requestCert: true,

  // これは、クライアントが自己署名証明書を使用する場合にのみ必要です。
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // これは、クライアント証明書認証を使用する場合にのみ必要です。
  requestCert: true,

  // これは、クライアントが自己署名証明書を使用する場合にのみ必要です。
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```
:::

この例の証明書とキーを生成するには、以下を実行します。

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
次に、この例の `client-cert.pem` 証明書を生成するには、以下を実行します。

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
サーバーは、[`tls.connect()`](/ja/nodejs/api/tls#tlsconnectoptions-callback) のクライアント例を使用して接続することでテストできます。


## `tls.getCiphers()` {#tlsgetciphers}

**Added in: v0.10.2**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サポートされている TLS 暗号スイートの名前の配列を返します。名前は歴史的な理由から小文字ですが、[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `ciphers` オプションで使用するには大文字にする必要があります。

サポートされているすべての暗号スイートがデフォルトで有効になっているわけではありません。「[デフォルトの TLS 暗号スイートの変更](/ja/nodejs/api/tls#modifying-the-default-tls-cipher-suite)」を参照してください。

`'tls_'` で始まる暗号スイート名は TLSv1.3 用であり、それ以外はすべて TLSv1.2 以下用です。

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Added in: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在の Node.js バージョンで提供される、バンドルされた Mozilla CA ストアからのルート証明書 (PEM 形式) を表す文字列のイミュータブルな配列。

Node.js で提供されるバンドルされた CA ストアは、リリース時に固定された Mozilla CA ストアのスナップショットです。これは、サポートされているすべてのプラットフォームで同じです。

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | デフォルト値が `'auto'` に変更されました。 |
| v0.11.13 | Added in: v0.11.13 |
:::

tls サーバーで ECDH 鍵交換に使用するデフォルトの曲線名。デフォルト値は `'auto'` です。詳細については、[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) を参照してください。

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Added in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `maxVersion` オプションのデフォルト値。サポートされている TLS プロトコルバージョン、`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'`、または `'TLSv1'` のいずれかを割り当てることができます。**デフォルト:** `'TLSv1.3'`。CLI オプションを使用して変更されない限り。`--tls-max-v1.2` を使用すると、デフォルトが `'TLSv1.2'` に設定されます。`--tls-max-v1.3` を使用すると、デフォルトが `'TLSv1.3'` に設定されます。複数のオプションが指定されている場合は、最大の最大値が使用されます。


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Added in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `minVersion` オプションのデフォルト値。サポートされている TLS プロトコルバージョン（`'TLSv1.3'`、`'TLSv1.2'`、`'TLSv1.1'`、`'TLSv1'`）のいずれかを割り当てることができます。TLSv1.2 より前のバージョンでは、[OpenSSL のセキュリティレベル](/ja/nodejs/api/tls#openssl-security-level) のダウングレードが必要になる場合があります。**デフォルト:** CLI オプションで変更されない限り `'TLSv1.2'`。`--tls-min-v1.0` を使用すると、デフォルトは `'TLSv1'` に設定されます。`--tls-min-v1.1` を使用すると、デフォルトは `'TLSv1.1'` に設定されます。`--tls-min-v1.3` を使用すると、デフォルトは `'TLSv1.3'` に設定されます。複数のオプションが指定された場合、最小の最小値が使用されます。

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Added in: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `ciphers` オプションのデフォルト値。サポートされている OpenSSL 暗号スイートを割り当てることができます。`crypto.constants.defaultCoreCipherList` の内容がデフォルトですが、`--tls-default-ciphers` を使用した CLI オプションで変更されない限り、そのようになります。

