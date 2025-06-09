---
title: Node.js ドキュメント - DNS
description: Node.jsのこのドキュメントセクションでは、非同期ネットワーク名解決機能を提供するDNS（ドメインネームシステム）モジュールについて説明しています。ドメイン名をIPアドレスに解決する方法、逆引き、およびDNSレコードのクエリを含みます。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのこのドキュメントセクションでは、非同期ネットワーク名解決機能を提供するDNS（ドメインネームシステム）モジュールについて説明しています。ドメイン名をIPアドレスに解決する方法、逆引き、およびDNSレコードのクエリを含みます。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのこのドキュメントセクションでは、非同期ネットワーク名解決機能を提供するDNS（ドメインネームシステム）モジュールについて説明しています。ドメイン名をIPアドレスに解決する方法、逆引き、およびDNSレコードのクエリを含みます。
---


# DNS {#dns}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

`node:dns`モジュールは名前解決を可能にします。例えば、ホスト名のIPアドレスを調べるために使用します。

[ドメインネームシステム (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System) の名前が付けられていますが、名前解決に常に DNS プロトコルを使用するとは限りません。[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) は、オペレーティングシステムの機能を使用して名前解決を実行します。ネットワーク通信を実行する必要がない場合があります。同じシステムの他のアプリケーションと同様に名前解決を実行するには、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) を使用します。

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

`node:dns`モジュールの他のすべての関数は、名前解決を実行するために実際のDNSサーバーに接続します。それらは常にネットワークを使用してDNSクエリを実行します。これらの関数は、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) (例: `/etc/hosts`)で使用されるのと同じ構成ファイルセットを使用しません。常にDNSクエリを実行し、他の名前解決機能をバイパスするには、これらの関数を使用します。

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

詳細については、[実装に関する考慮事項のセクション](/ja/nodejs/api/dns#implementation-considerations)を参照してください。


## クラス: `dns.Resolver` {#class-dnsresolver}

**追加: v8.3.0**

DNSリクエストのための独立したリゾルバー。

新しいリゾルバーを作成すると、デフォルトのサーバー設定が使用されます。[`resolver.setServers()`](/ja/nodejs/api/dns#dnssetserversservers) を使用してリゾルバーに使用するサーバーを設定しても、他のリゾルバーには影響しません。

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// このリクエストは、グローバル設定とは独立して、4.4.4.4のサーバーを使用します。
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// このリクエストは、グローバル設定とは独立して、4.4.4.4のサーバーを使用します。
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

`node:dns` モジュールの以下のメソッドが利用可能です。

- [`resolver.getServers()`](/ja/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/ja/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/ja/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/ja/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/ja/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/ja/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/ja/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/ja/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/ja/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/ja/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/ja/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/ja/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/ja/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/ja/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/ja/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/ja/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.7.0, v14.18.0 | `options` オブジェクトで `tries` オプションを受け入れるようになりました。 |
| v12.18.3 | コンストラクタで `options` オブジェクトを受け入れるようになりました。唯一サポートされるオプションは `timeout` です。 |
| v8.3.0 | 追加: v8.3.0 |
:::

新しいリゾルバーを作成します。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) クエリのタイムアウト（ミリ秒単位）。デフォルトのタイムアウトを使用する場合は `-1`。
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リゾルバーが各ネームサーバーへの接続を試行する回数。あきらめるまでの回数。**デフォルト:** `4`


### `resolver.cancel()` {#resolvercancel}

**追加:** v8.3.0

このリゾルバーによって行われたすべての未解決のDNSクエリをキャンセルします。対応するコールバックは、コード`ECANCELLED`のエラーで呼び出されます。

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**追加:** v15.1.0, v14.17.0

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4アドレスの文字列表現。**デフォルト:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv6アドレスの文字列表現。**デフォルト:** `'::0'`

リゾルバーインスタンスは、指定されたIPアドレスからリクエストを送信します。これにより、プログラムは、マルチホームシステムで使用する場合にアウトバウンドインターフェースを指定できます。

v4またはv6アドレスが指定されていない場合、デフォルトに設定され、オペレーティングシステムがローカルアドレスを自動的に選択します。

リゾルバーは、IPv4 DNSサーバーにリクエストを行う場合はv4ローカルアドレスを使用し、IPv6 DNSサーバーにリクエストを行う場合はv6ローカルアドレスを使用します。解決リクエストの`rrtype`は、使用されるローカルアドレスに影響を与えません。

## `dns.getServers()` {#dnsgetservers}

**追加:** v0.11.3

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在DNS解決用に設定されているIPアドレス文字列の配列を、[RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)に従ってフォーマットして返します。文字列には、カスタムポートが使用されている場合、ポートセクションが含まれます。

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.1.0, v20.13.0 | `verbatim`オプションは非推奨となり、新しい`order`オプションが推奨されるようになりました。 |
| v18.4.0 | `node:net`との互換性のため、オプションオブジェクトを渡す場合、`family`オプションは文字列`'IPv4'`または文字列`'IPv6'`にすることができます。 |
| v18.0.0 | 無効なコールバックを`callback`引数に渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v17.0.0 | `verbatim`オプションのデフォルト値が`true`になりました。 |
| v8.5.0 | `verbatim`オプションがサポートされるようになりました。 |
| v1.2.0 | `all`オプションがサポートされるようになりました。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) レコードファミリー。`4`、`6`、または`0`である必要があります。下位互換性の理由から、`'IPv4'`および`'IPv6'`はそれぞれ`4`および`6`として解釈されます。値`0`は、IPv4またはIPv6アドレスのいずれかが返されることを示します。値`0`が`{ all: true }`（下記参照）とともに使用される場合、システムのDNSリゾルバーに応じて、IPv4アドレスとIPv6アドレスの一方または両方が返されます。**デフォルト:** `0`。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 1つ以上の[サポートされている`getaddrinfo`フラグ](/ja/nodejs/api/dns#supported-getaddrinfo-flags)。複数のフラグは、それらの値をビット単位の`OR`で渡すことができます。
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、コールバックは解決されたすべてのアドレスを配列で返します。それ以外の場合は、単一のアドレスを返します。**デフォルト:** `false`。
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `verbatim`の場合、解決されたアドレスはソートされずに返されます。`ipv4first`の場合、解決されたアドレスはIPv6アドレスの前にIPv4アドレスを配置するようにソートされます。`ipv6first`の場合、解決されたアドレスはIPv4アドレスの前にIPv6アドレスを配置するようにソートされます。**デフォルト:** `verbatim`（アドレスは並べ替えられません）。デフォルト値は、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder)または[`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder)を使用して構成できます。
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、コールバックはDNSリゾルバーが返した順序でIPv4アドレスとIPv6アドレスを受信します。`false`の場合、IPv4アドレスはIPv6アドレスの前に配置されます。このオプションは`order`に移行し非推奨となります。両方が指定されている場合、`order`が優先されます。新しいコードでは、`order`のみを使用する必要があります。**デフォルト:** `true`（アドレスは並べ替えられません）。デフォルト値は、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder)または[`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder)を使用して構成できます。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4またはIPv6アドレスの文字列表現。
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `address`のファミリーを示す`4`または`6`、またはアドレスがIPv4またはIPv6アドレスでない場合は`0`。`0`は、オペレーティングシステムで使用されている名前解決サービスにバグがある可能性を示すものです。

ホスト名（例：`'nodejs.org'`）を最初に見つかったA（IPv4）またはAAAA（IPv6）レコードに解決します。すべての`option`プロパティはオプションです。`options`が整数の場合、`4`または`6`である必要があります。`options`が指定されていない場合は、IPv4アドレスまたはIPv6アドレス、あるいはその両方が見つかった場合に返されます。

`all`オプションが`true`に設定されている場合、`callback`の引数は`(err, addresses)`に変更され、`addresses`はプロパティ`address`と`family`を持つオブジェクトの配列になります。

エラーが発生した場合、`err`は[`Error`](/ja/nodejs/api/errors#class-error)オブジェクトであり、`err.code`はエラーコードです。ホスト名が存在しない場合だけでなく、利用可能なファイルディスクリプタがないなど、ルックアップが他の方法で失敗した場合にも、`err.code`が`'ENOTFOUND'`に設定されることに注意してください。

`dns.lookup()`は、必ずしもDNSプロトコルと関係があるわけではありません。実装は、名前をアドレスと関連付けたり、その逆を行うことができるオペレーティングシステムの機能を使用します。この実装は、Node.jsプログラムの動作に微妙ながら重要な影響を与える可能性があります。`dns.lookup()`を使用する前に、[実装に関する考慮事項のセクション](/ja/nodejs/api/dns#implementation-considerations)を参照してください。

使用例：

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

このメソッドが[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal)されたバージョンとして呼び出され、`all`が`true`に設定されていない場合、`address`および`family`プロパティを持つ`Object`の`Promise`を返します。


### サポートされる getaddrinfo フラグ {#supported-getaddrinfo-flags}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.13.0, v12.17.0 | `dns.ALL` フラグのサポートが追加されました。 |
:::

以下のフラグは、ヒントとして[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)に渡すことができます。

- `dns.ADDRCONFIG`: 返されるアドレスの種類を、システムで構成されている非ループバックアドレスの種類に制限します。たとえば、現在のシステムに少なくとも1つのIPv4アドレスが構成されている場合にのみ、IPv4アドレスが返されます。
- `dns.V4MAPPED`: IPv6ファミリが指定されたが、IPv6アドレスが見つからなかった場合、IPv4マップされたIPv6アドレスを返します。一部のオペレーティングシステム（例：FreeBSD 10.1）ではサポートされていません。
- `dns.ALL`: `dns.V4MAPPED` が指定されている場合、解決されたIPv6アドレスだけでなく、IPv4マップされたIPv6アドレスも返します。

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v0.11.14 | 追加: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例: `example.com`
  - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例: `http`

指定された `address` および `port` を、オペレーティングシステムの基盤となる `getnameinfo` 実装を使用して、ホスト名とサービスに解決します。

`address` が有効なIPアドレスでない場合、`TypeError` がスローされます。 `port` は数値に強制変換されます。 有効なポートでない場合、`TypeError` がスローされます。

エラーが発生した場合、`err` は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトであり、`err.code` はエラーコードです。

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

このメソッドが [`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) されたバージョンとして呼び出された場合、`hostname` および `service` プロパティを持つ `Object` の `Promise` を返します。


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リソースレコードタイプ。**デフォルト:** `'A'`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、ホスト名 (例: `'nodejs.org'`) をリソースレコードの配列に解決します。 `callback` 関数は `(err, records)` の引数を持ちます。 成功すると、`records` はリソースレコードの配列になります。 個々の結果のタイプと構造は、`rrtype` によって異なります。

| `rrtype` | `records` に含まれるもの | 結果の型 | 短縮メソッド |
| --- | --- | --- | --- |
| `'A'` | IPv4 アドレス (デフォルト) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/ja/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | IPv6 アドレス | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/ja/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | すべてのレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/ja/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | CA 認証レコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/ja/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | 正規名レコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/ja/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | メール交換レコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/ja/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | 名前権限ポインタレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/ja/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | ネームサーバレコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/ja/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | ポインタレコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/ja/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | 権威レコードの開始 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/ja/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | サービスレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/ja/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | テキストレコード | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/ja/nodejs/api/dns#dnsresolvetxthostname-callback) |

エラーが発生した場合、`err` は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトとなり、`err.code` は [DNS エラーコード](/ja/nodejs/api/dns#error-codes) のいずれかになります。


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v7.2.0 | このメソッドは`options`、特に`options.ttl`の引き渡しをサポートするようになりました。 |
| v0.1.16 | Added in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 各レコードの Time-To-Live 値（TTL）を取得します。 `true`の場合、コールバックは文字列の配列ではなく、`{ address: '1.2.3.4', ttl: 60 }`オブジェクトの配列をTTLを秒単位で表して受け取ります。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS プロトコルを使用して、`hostname` の IPv4 アドレス (`A` レコード) を解決します。 `callback` 関数に渡される `addresses` 引数には、IPv4 アドレスの配列が含まれます (例: `['74.125.79.104', '74.125.79.105', '74.125.79.106']`)。

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v7.2.0 | このメソッドは`options`、特に`options.ttl`の引き渡しをサポートするようになりました。 |
| v0.1.16 | Added in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 各レコードの Time-To-Live 値（TTL）を取得します。 `true`の場合、コールバックは文字列の配列ではなく、`{ address: '0:1:2:3:4:5:6:7', ttl: 60 }`オブジェクトの配列をTTLを秒単位で表して受け取ります。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS プロトコルを使用して、`hostname` の IPv6 アドレス (`AAAA` レコード) を解決します。 `callback` 関数に渡される `addresses` 引数には、IPv6 アドレスの配列が含まれます。


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [History]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、すべてのレコード（`ANY`または`*`クエリとも呼ばれます）を解決します。`callback`関数に渡される`ret`引数は、さまざまなタイプのレコードを含む配列になります。各オブジェクトには、現在のレコードのタイプを示す `type` プロパティがあります。また、`type` によって、オブジェクトに追加のプロパティが存在します。

| タイプ | プロパティ |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | [`dns.resolveMx()`](/ja/nodejs/api/dns#dnsresolvemxhostname-callback) を参照してください。 |
| `'NAPTR'` | [`dns.resolveNaptr()`](/ja/nodejs/api/dns#dnsresolvenaptrhostname-callback) を参照してください。 |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | [`dns.resolveSoa()`](/ja/nodejs/api/dns#dnsresolvesoahostname-callback) を参照してください。 |
| `'SRV'` | [`dns.resolveSrv()`](/ja/nodejs/api/dns#dnsresolvesrvhostname-callback) を参照してください。 |
| `'TXT'` | このタイプのレコードには、[`dns.resolveTxt()`](/ja/nodejs/api/dns#dnsresolvetxthostname-callback) を参照する `entries` という配列プロパティが含まれています。例：`{ entries: ['...'], type: 'TXT' }` |

以下は、コールバックに渡される `ret` オブジェクトの例です。

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
DNSサーバのオペレーターは、`ANY`クエリに応答しないことを選択できます。[`dns.resolve4()`](/ja/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/ja/nodejs/api/dns#dnsresolvemxhostname-callback) などの個々のメソッドを呼び出す方が良い場合があります。詳細については、[RFC 8482](https://tools.ietf.org/html/rfc8482) を参照してください。


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.3.2 | Added in: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

DNSプロトコルを使用して、`hostname` の `CNAME` レコードを解決します。`callback` 関数に渡される `addresses` 引数には、`hostname` で利用可能な正規名レコードの配列が含まれます (例: `['bar.example.com']`)。

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.0.0, v14.17.0 | Added in: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、`hostname` の `CAA` レコードを解決します。`callback` 関数に渡される `addresses` 引数には、`hostname` で利用可能な認証局承認レコードの配列が含まれます (例: `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`)。


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数への無効なコールバックの渡しは、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`をスローするようになりました。 |
| v0.1.27 | Added in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、`hostname`のメール交換レコード（`MX`レコード）を解決します。 `callback`関数に渡される`addresses`引数には、`priority`と`exchange`プロパティの両方を含むオブジェクトの配列が含まれます（例：`[{priority: 10, exchange: 'mx.example.com'}, ...]`）。

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数への無効なコールバックの渡しは、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`をスローするようになりました。 |
| v0.9.12 | Added in: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、`hostname`の正規表現ベースのレコード（`NAPTR`レコード）を解決します。 `callback`関数に渡される`addresses`引数には、次のプロパティを持つオブジェクトの配列が含まれます。

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
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`をスローするようになりました。 |
| v0.1.90 | Added in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname`の名前サーバレコード（`NS`レコード）を解決します。`callback`関数に渡される`addresses`引数には、`hostname`で利用可能な名前サーバレコードの配列が含まれます（例：`['ns1.example.com', 'ns2.example.com']`）。

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`をスローするようになりました。 |
| v6.0.0 | Added in: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname`のポインタレコード（`PTR`レコード）を解決します。`callback`関数に渡される`addresses`引数は、応答レコードを含む文字列の配列になります。

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`をスローするようになりました。 |
| v0.11.10 | Added in: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

DNSプロトコルを使用して、`hostname`の権威の開始レコード（`SOA`レコード）を解決します。`callback`関数に渡される`address`引数は、次のプロパティを持つオブジェクトになります。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.1.27 | 追加: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNSプロトコルを使用して、`hostname` のサービスレコード（`SRV` レコード）を解決します。`callback` 関数に渡される `addresses` 引数は、次のプロパティを持つオブジェクトの配列になります。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.1.27 | 追加: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

DNSプロトコルを使用して、`hostname` のテキストクエリ（`TXT` レコード）を解決します。`callback` 関数に渡される `records` 引数は、`hostname` で利用可能なテキストレコードの2次元配列です（例：`[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`）。各サブ配列には、1つのレコードのTXTチャンクが含まれています。ユースケースに応じて、これらを結合することも、個別に処理することもできます。


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Added in: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

IPv4またはIPv6アドレスをホスト名の配列に解決する逆引きDNSクエリを実行します。

エラーが発生した場合、`err`は[`Error`](/ja/nodejs/api/errors#class-error)オブジェクトで、`err.code`は[DNSエラーコード](/ja/nodejs/api/dns#error-codes)のいずれかです。

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first`値がサポートされるようになりました。 |
| v17.0.0 | デフォルト値を `verbatim` に変更しました。 |
| v16.4.0, v14.18.0 | Added in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) は、`'ipv4first'`、`'ipv6first'`、または `'verbatim'` である必要があります。

[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) および [`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) の `order` のデフォルト値を設定します。値は次のいずれかになります。

- `ipv4first`: デフォルトの `order` を `ipv4first` に設定します。
- `ipv6first`: デフォルトの `order` を `ipv6first` に設定します。
- `verbatim`: デフォルトの `order` を `verbatim` に設定します。

デフォルトは `verbatim` であり、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder) は [`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder) よりも優先度が高くなります。[ワーカー スレッド](/ja/nodejs/api/worker_threads) を使用する場合、メイン スレッドからの [`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder) はワーカーのデフォルトの DNS 順序には影響しません。

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first`値がサポートされるようになりました。 |
| v20.1.0, v18.17.0 | Added in: v20.1.0, v18.17.0 |
:::

[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) および [`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) の `order` のデフォルト値を取得します。値は次のいずれかになります。

- `ipv4first`: `order` のデフォルトが `ipv4first` である場合。
- `ipv6first`: `order` のデフォルトが `ipv6first` である場合。
- `verbatim`: `order` のデフォルトが `verbatim` である場合。


## `dns.setServers(servers)` {#dnssetserversservers}

**追加:** v0.11.3

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)形式のアドレスの配列

DNS解決の実行時に使用するサーバーのIPアドレスとポートを設定します。`servers`引数は、[RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)形式のアドレスの配列です。ポートがIANAのデフォルトDNSポート（53）である場合、省略できます。

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
無効なアドレスが指定された場合、エラーがスローされます。

`dns.setServers()`メソッドは、DNSクエリが進行中の場合は呼び出さないでください。

[`dns.setServers()`](/ja/nodejs/api/dns#dnssetserversservers)メソッドは、[`dns.resolve()`](/ja/nodejs/api/dns#dnsresolvehostname-rrtype-callback)、`dns.resolve*()`、および[`dns.reverse()`](/ja/nodejs/api/dns#dnsreverseip-callback)にのみ影響します（特に、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback)には影響しません）。

このメソッドは、[resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5)によく似た働きをします。つまり、提供された最初のサーバーでの解決を試みた結果、`NOTFOUND`エラーが発生した場合、`resolve()`メソッドは、提供された後続のサーバーでの解決を試みません。フォールバックDNSサーバーは、以前のサーバーがタイムアウトするか、その他のエラーが発生した場合にのみ使用されます。

## DNS promises API {#dns-promises-api}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | `require('dns/promises')`として公開。 |
| v11.14.0, v10.17.0 | このAPIは実験的ではなくなりました。 |
| v10.6.0 | 追加: v10.6.0 |
:::

`dns.promises` APIは、コールバックを使用する代わりに`Promise`オブジェクトを返す、代替の非同期DNSメソッドのセットを提供します。APIには、`require('node:dns').promises`または`require('node:dns/promises')`を介してアクセスできます。

### クラス: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**追加:** v10.6.0

DNSリクエストのための独立したリゾルバー。

新しいリゾルバーを作成すると、デフォルトのサーバー設定が使用されます。[`resolver.setServers()`](/ja/nodejs/api/dns#dnspromisessetserversservers)を使用してリゾルバーに使用するサーバーを設定しても、他のリゾルバーには影響しません。

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// このリクエストは、グローバル設定とは無関係に、4.4.4.4のサーバーを使用します。
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// このリクエストは、グローバル設定とは無関係に、4.4.4.4のサーバーを使用します。
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// または、同じコードをasync-awaitスタイルで記述できます。
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

`dnsPromises` APIの次のメソッドが利用可能です。

- [`resolver.getServers()`](/ja/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/ja/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/ja/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/ja/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/ja/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/ja/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/ja/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/ja/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/ja/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/ja/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/ja/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/ja/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/ja/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/ja/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/ja/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/ja/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**追加:** v15.3.0, v14.17.0

このリゾルバーによって行われた未処理の DNS クエリをすべてキャンセルします。対応する Promise は、コード `ECANCELLED` のエラーで reject されます。

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**追加:** v10.6.0

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在 DNS 解決に設定されている IP アドレスの文字列の配列を、[RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) に従ってフォーマットして返します。カスタムポートが使用されている場合、文字列にはポートセクションが含まれます。

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.1.0, v20.13.0 | `verbatim` オプションは非推奨となり、新しい `order` オプションが推奨されるようになりました。 |
| v10.6.0 | 追加: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) レコードファミリ。 `4`、`6`、または `0` である必要があります。 値 `0` は、IPv4 または IPv6 アドレスのいずれかが返されることを示します。 値 `0` が `{ all: true }` (下記参照) と共に使用される場合、システムの DNS リゾルバーに応じて、IPv4 と IPv6 アドレスのいずれかまたは両方が返されます。 **デフォルト:** `0`。
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 1 つ以上の [サポートされている `getaddrinfo` フラグ](/ja/nodejs/api/dns#supported-getaddrinfo-flags)。 複数のフラグを渡すには、それらの値をビット単位で `OR` します。
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Promise` は配列内のすべてのアドレスで解決されます。 それ以外の場合は、単一のアドレスを返します。 **デフォルト:** `false`。
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `verbatim` の場合、`Promise` は DNS リゾルバーが返した順序で IPv4 および IPv6 アドレスで解決されます。 `ipv4first` の場合、IPv4 アドレスは IPv6 アドレスの前に配置されます。 `ipv6first` の場合、IPv6 アドレスは IPv4 アドレスの前に配置されます。 **デフォルト:** `verbatim` (アドレスは並べ替えられません)。 デフォルト値は、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder) または [`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder) を使用して構成できます。 新しいコードでは、`{ order: 'verbatim' }` を使用する必要があります。
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Promise` は DNS リゾルバーが返した順序で IPv4 および IPv6 アドレスで解決されます。 `false` の場合、IPv4 アドレスは IPv6 アドレスの前に配置されます。 このオプションは非推奨となり、`order` が推奨されるようになります。 両方が指定されている場合、`order` の方が優先されます。 新しいコードでは、`order` のみを使用する必要があります。 **デフォルト:** 現在は `false` (アドレスは並べ替えられます) ですが、そう遠くない将来に変更される予定です。 デフォルト値は、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder) または [`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder) を使用して構成できます。
 

ホスト名 (例: `'nodejs.org'`) を最初に見つかった A (IPv4) または AAAA (IPv6) レコードに解決します。 すべての `option` プロパティはオプションです。 `options` が整数の場合、`4` または `6` である必要があります。`options` が提供されていない場合は、IPv4 または IPv6 アドレス、またはその両方が見つかった場合に返されます。

`all` オプションが `true` に設定されている場合、`Promise` は `addresses` が `address` および `family` プロパティを持つオブジェクトの配列である状態で解決されます。

エラーが発生した場合、`Promise` は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトで reject されます。ここで、`err.code` はエラーコードです。 ホスト名が存在しない場合だけでなく、使用可能なファイル記述子がないなど、ルックアップが他の方法で失敗した場合にも、`err.code` が `'ENOTFOUND'` に設定されることに注意してください。

[`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) は、必ずしも DNS プロトコルと何らかの関係があるとは限りません。 この実装では、名前をアドレスに関連付けたり、その逆を行ったりできるオペレーティングシステムの機能を使用します。 この実装は、Node.js プログラムの動作に微妙ではあるものの重要な影響を与える可能性があります。 `dnsPromises.lookup()` を使用する前に、[実装に関する考慮事項](/ja/nodejs/api/dns#implementation-considerations)のセクションを参照してください。

使用例:

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

オペレーティングシステムの基盤となる `getnameinfo` 実装を使用して、指定された `address` と `port` をホスト名とサービスに解決します。

`address` が有効なIPアドレスでない場合、`TypeError` がスローされます。`port` は数値に強制変換されます。それが有効なポートでない場合、`TypeError` がスローされます。

エラーが発生した場合、`Promise` は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトで拒否され、`err.code` はエラーコードになります。

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

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リソースレコードタイプ。**デフォルト:** `'A'`。

DNSプロトコルを使用して、ホスト名（例：`'nodejs.org'`）をリソースレコードの配列に解決します。成功すると、`Promise` はリソースレコードの配列で解決されます。個々の結果の型と構造は、`rrtype` に基づいて異なります。

| `rrtype` | `records` に含まれるもの | 結果の型 | 短縮メソッド |
| --- | --- | --- | --- |
| `'A'` | IPv4アドレス（デフォルト） | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/ja/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6アドレス | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/ja/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | 全てのレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/ja/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | CA 認証レコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/ja/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | 正規名レコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/ja/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | メール交換レコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/ja/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | 名前権威ポインターレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/ja/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | ネームサーバーレコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/ja/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | ポインターレコード | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/ja/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | 権威レコードの開始 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/ja/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | サービスレコード | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/ja/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | テキストレコード | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/ja/nodejs/api/dns#dnspromisesresolvetxthostname) |

エラーが発生した場合、`Promise` は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトで拒否され、`err.code` は [DNSエラーコード](/ja/nodejs/api/dns#error-codes) のいずれかになります。


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 各レコードの Time-To-Live 値（TTL）を取得します。 `true` の場合、`Promise` は文字列の配列ではなく、`{ address: '1.2.3.4', ttl: 60 }` オブジェクトの配列で解決されます。TTL は秒単位で表現されます。
  
 

DNSプロトコルを使用して、`hostname` の IPv4 アドレス（`A` レコード）を解決します。 成功すると、`Promise` は IPv4 アドレスの配列（例：`['74.125.79.104', '74.125.79.105', '74.125.79.106']`）で解決されます。

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するホスト名。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 各レコードの Time-To-Live 値（TTL）を取得します。 `true` の場合、`Promise` は文字列の配列ではなく、`{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` オブジェクトの配列で解決されます。TTL は秒単位で表現されます。
  
 

DNSプロトコルを使用して、`hostname` の IPv6 アドレス（`AAAA` レコード）を解決します。 成功すると、`Promise` は IPv6 アドレスの配列で解決されます。

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、すべてのレコード（`ANY` または `*` クエリとも呼ばれます）を解決します。 成功すると、`Promise` はさまざまな型のレコードを含む配列で解決されます。 各オブジェクトには、現在のレコードの型を示す `type` プロパティがあります。 また、`type` に応じて、オブジェクトに追加のプロパティが存在します。

| Type | Properties |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | [`dnsPromises.resolveMx()`](/ja/nodejs/api/dns#dnspromisesresolvemxhostname) を参照 |
| `'NAPTR'` | [`dnsPromises.resolveNaptr()`](/ja/nodejs/api/dns#dnspromisesresolvenaptrhostname) を参照 |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | [`dnsPromises.resolveSoa()`](/ja/nodejs/api/dns#dnspromisesresolvesoahostname) を参照 |
| `'SRV'` | [`dnsPromises.resolveSrv()`](/ja/nodejs/api/dns#dnspromisesresolvesrvhostname) を参照 |
| `'TXT'` | このタイプのレコードには `entries` という配列プロパティが含まれており、[`dnsPromises.resolveTxt()`](/ja/nodejs/api/dns#dnspromisesresolvetxthostname) を参照します。たとえば、`{ entries: ['...'], type: 'TXT' }` |
結果オブジェクトの例を次に示します。

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

DNSプロトコルを使用して、`hostname` の `CAA` レコードを解決します。成功すると、`Promise` は `hostname` で利用可能な認証局承認レコードを含むオブジェクトの配列で解決されます（例: `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`）。

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname` の `CNAME` レコードを解決します。成功すると、`Promise` は `hostname` で利用可能な正規名レコードの配列で解決されます（例: `['bar.example.com']`）。

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname` のメール交換レコード（`MX` レコード）を解決します。成功すると、`Promise` は `priority` と `exchange` プロパティの両方を含むオブジェクトの配列で解決されます（例: `[{priority: 10, exchange: 'mx.example.com'}, ...]`）。

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname` の正規表現ベースのレコード（`NAPTR` レコード）を解決します。成功すると、`Promise` は以下のプロパティを持つオブジェクトの配列で解決されます。

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

DNSプロトコルを使用して、`hostname` のネームサーバーレコード（`NS` レコード）を解決します。成功すると、`Promise` は `hostname` で利用可能なネームサーバーレコードの配列で解決されます（例: `['ns1.example.com', 'ns2.example.com']`）。


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname` のポインターレコード（`PTR` レコード）を解決します。成功すると、応答レコードを含む文字列の配列で `Promise` が解決されます。

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNSプロトコルを使用して、`hostname` の権威レコードの開始（`SOA` レコード）を解決します。成功すると、`Promise` は次のプロパティを持つオブジェクトで解決されます。

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

DNSプロトコルを使用して、`hostname` のサービスレコード（`SRV` レコード）を解決します。成功すると、`Promise` は次のプロパティを持つオブジェクトの配列で解決されます。

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

DNSプロトコルを使用して、`hostname` のテキストクエリ（`TXT` レコード）を解決します。成功すると、`Promise` は `hostname` で利用可能なテキストレコードの二次元配列で解決されます（例：`[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`）。各サブ配列には、1つのレコードの TXT チャンクが含まれています。ユースケースに応じて、これらを結合するか、個別に扱うことができます。


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**追加:** v10.6.0

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

IPv4またはIPv6アドレスをホスト名の配列に解決する逆引きDNSクエリを実行します。

エラーが発生した場合、`Promise`は[`Error`](/ja/nodejs/api/errors#class-error)オブジェクトで拒否され、`err.code`は[DNSエラーコード](/ja/nodejs/api/dns#error-codes)のいずれかになります。

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first`値がサポートされるようになりました。 |
| v17.0.0 | デフォルト値を`verbatim`に変更しました。 |
| v16.4.0, v14.18.0 | 追加: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) は `'ipv4first'`、`'ipv6first'`、または `'verbatim'` である必要があります。

[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) および [`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) の `order` のデフォルト値を設定します。 値は次のいずれかになります。

- `ipv4first`: デフォルトの `order` を `ipv4first` に設定します。
- `ipv6first`: デフォルトの `order` を `ipv6first` に設定します。
- `verbatim`: デフォルトの `order` を `verbatim` に設定します。

デフォルトは `verbatim` で、[`dnsPromises.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnspromisessetdefaultresultorderorder) は [`--dns-result-order`](/ja/nodejs/api/cli#--dns-result-orderorder) よりも優先度が高くなっています。[ワーカー スレッド](/ja/nodejs/api/worker_threads) を使用する場合、メインスレッドからの [`dnsPromises.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnspromisessetdefaultresultorderorder) はワーカーのデフォルトの DNS 順序には影響しません。

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**追加:** v20.1.0, v18.17.0

`dnsOrder`の値を取得します。

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**追加:** v10.6.0

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 形式のアドレスの配列

DNS解決を実行するときに使用されるサーバーのIPアドレスとポートを設定します。`servers`引数は[RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)形式のアドレスの配列です。ポートがIANAのデフォルトDNSポート（53）の場合、省略できます。

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```

無効なアドレスが指定された場合、エラーがスローされます。

`dnsPromises.setServers()`メソッドは、DNSクエリの進行中に呼び出すことはできません。

このメソッドは、[resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5)と非常によく似ています。つまり、最初に指定されたサーバーで解決しようとした結果、`NOTFOUND`エラーが発生した場合、`resolve()`メソッドは、後続のサーバーで解決しようとしません。フォールバックDNSサーバーは、以前のサーバーがタイムアウトするか、他のエラーが発生した場合にのみ使用されます。


## エラーコード {#error-codes}

各 DNS クエリは、次のいずれかのエラーコードを返すことがあります。

- `dns.NODATA`: DNS サーバーがデータなしの応答を返しました。
- `dns.FORMERR`: DNS サーバーがクエリの形式が間違っていると主張しました。
- `dns.SERVFAIL`: DNS サーバーが一般的なエラーを返しました。
- `dns.NOTFOUND`: ドメイン名が見つかりませんでした。
- `dns.NOTIMP`: DNS サーバーが要求された操作を実装していません。
- `dns.REFUSED`: DNS サーバーがクエリを拒否しました。
- `dns.BADQUERY`: DNS クエリの形式が間違っています。
- `dns.BADNAME`: ホスト名の形式が間違っています。
- `dns.BADFAMILY`: サポートされていないアドレスファミリ。
- `dns.BADRESP`: DNS 応答の形式が間違っています。
- `dns.CONNREFUSED`: DNS サーバーに接続できませんでした。
- `dns.TIMEOUT`: DNS サーバーへの接続中にタイムアウトしました。
- `dns.EOF`: ファイルの終端。
- `dns.FILE`: ファイルの読み取りエラー。
- `dns.NOMEM`: メモリ不足。
- `dns.DESTRUCTION`: チャネルが破棄されています。
- `dns.BADSTR`: 文字列の形式が間違っています。
- `dns.BADFLAGS`: 無効なフラグが指定されました。
- `dns.NONAME`: 指定されたホスト名が数値ではありません。
- `dns.BADHINTS`: 無効なヒントフラグが指定されました。
- `dns.NOTINITIALIZED`: c-ares ライブラリの初期化がまだ実行されていません。
- `dns.LOADIPHLPAPI`: `iphlpapi.dll` のロードエラー。
- `dns.ADDRGETNETWORKPARAMS`: `GetNetworkParams` 関数が見つかりませんでした。
- `dns.CANCELLED`: DNS クエリがキャンセルされました。

`dnsPromises` API も、上記の例えば `dnsPromises.NODATA` のように、上記のエラーコードをエクスポートします。

## 実装に関する考慮事項 {#implementation-considerations}

[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) とさまざまな `dns.resolve*()/dns.reverse()` 関数は、ネットワーク名とネットワークアドレス (またはその逆) を関連付けるという同じ目的を持っていますが、その動作は大きく異なります。 これらの違いは、Node.js プログラムの動作に微妙ながらも重大な影響を与える可能性があります。

### `dns.lookup()` {#dnslookup}

内部的には、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) は、他のほとんどのプログラムと同じオペレーティングシステムの機能を使用します。 たとえば、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) は、ほとんどの場合、`ping` コマンドと同じように特定の名前を解決します。 ほとんどの POSIX のようなオペレーティングシステムでは、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) 関数の動作は、[`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) および/または [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5) の設定を変更することで変更できますが、これらのファイルを変更すると、同じオペレーティングシステムで実行されている他のすべてのプログラムの動作が変更されます。

`dns.lookup()` の呼び出しは JavaScript の観点からは非同期になりますが、libuv のスレッドプールで実行される [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) への同期呼び出しとして実装されます。 これは、一部のアプリケーションに驚くほどネガティブなパフォーマンスの影響を与える可能性があります。詳細については、[`UV_THREADPOOL_SIZE`](/ja/nodejs/api/cli#uv_threadpool_sizesize) のドキュメントを参照してください。

さまざまなネットワーキング API が、ホスト名を解決するために内部的に `dns.lookup()` を呼び出します。 それが問題になる場合は、`dns.resolve()` を使用してホスト名をアドレスに解決し、ホスト名の代わりにアドレスを使用することを検討してください。 また、一部のネットワーキング API (例えば [`socket.connect()`](/ja/nodejs/api/net#socketconnectoptions-connectlistener) や [`dgram.createSocket()`](/ja/nodejs/api/dgram#dgramcreatesocketoptions-callback)) では、デフォルトのリゾルバーである `dns.lookup()` を置き換えることができます。


### `dns.resolve()`, `dns.resolve*()`, および `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

これらの関数は、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) とはかなり異なる方法で実装されています。これらは [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) を使用せず、*常に*ネットワーク上で DNS クエリを実行します。このネットワーク通信は常に非同期で行われ、libuv のスレッドプールは使用しません。

その結果、これらの関数は、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) が持つ可能性がある、libuv のスレッドプールで発生する他の処理に同じような悪影響を与えることはありません。

これらは、[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) が使用するのと同じ設定ファイルセットを使用しません。たとえば、`/etc/hosts` の設定は使用しません。

