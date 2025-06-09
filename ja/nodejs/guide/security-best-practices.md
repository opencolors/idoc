---
title: Node.js アプリケーションのセキュリティ ベスト プラクティス
description: Node.js アプリケーションのセキュリティを確保するための包括的なガイド、脅威のモデル化、ベスト プラクティス、サービス拒否、DNS の再バインド、機密情報の公開などの一般的な脆弱性の軽減を網羅しています。
head:
  - - meta
    - name: og:title
      content: Node.js アプリケーションのセキュリティ ベスト プラクティス | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js アプリケーションのセキュリティを確保するための包括的なガイド、脅威のモデル化、ベスト プラクティス、サービス拒否、DNS の再バインド、機密情報の公開などの一般的な脆弱性の軽減を網羅しています。
  - - meta
    - name: twitter:title
      content: Node.js アプリケーションのセキュリティ ベスト プラクティス | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js アプリケーションのセキュリティを確保するための包括的なガイド、脅威のモデル化、ベスト プラクティス、サービス拒否、DNS の再バインド、機密情報の公開などの一般的な脆弱性の軽減を網羅しています。
---


# セキュリティのベストプラクティス

### 目的

このドキュメントは、現在の[脅威モデル](/ja/nodejs/guide/security-best-practices#threat-model)を拡張し、Node.jsアプリケーションを保護する方法に関する広範なガイドラインを提供することを目的としています。

## ドキュメントの内容

- ベストプラクティス: ベストプラクティスを簡略化してまとめたものです。開始点として、[このissue](https://github.com/nodejs/security-wg/issues/488)または[このガイドライン](https://github.com/goldbergyoni/nodebestpractices)を使用できます。このドキュメントはNode.jsに固有のものであることに注意してください。広範なものを探している場合は、[OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers)を検討してください。
- 攻撃の説明: 脅威モデルで言及している攻撃について、平易な英語で説明し、コード例（可能な場合）を交えて文書化します。
- サードパーティライブラリ: 脅威（タイポスクワッティング攻撃、悪意のあるパッケージなど）と、Nodeモジュールの依存関係などに関するベストプラクティスを定義します。

## 脅威リスト

### HTTPサーバーのサービス拒否 (CWE-400)

これは、受信HTTPリクエストの処理方法が原因で、アプリケーションが本来の目的で使用できなくなる攻撃です。これらのリクエストは、悪意のある行為者によって意図的に作成されたものである必要はありません。設定ミスまたはバグのあるクライアントも、サービス拒否につながるリクエストパターンをサーバーに送信する可能性があります。

HTTPリクエストはNode.js HTTPサーバーによって受信され、登録されたリクエストハンドラーを介してアプリケーションコードに渡されます。サーバーはリクエスト本文の内容を解析しません。したがって、リクエストハンドラーに渡された後の本文の内容によって引き起こされるDoSは、Node.js自体の脆弱性ではありません。正しく処理するのはアプリケーションコードの責任であるためです。

WebServerがソケットエラーを適切に処理することを確認してください。たとえば、エラーハンドラーなしでサーバーが作成された場合、DoSに対して脆弱になります。

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // これによりサーバーがクラッシュするのを防ぎます
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_不正なリクエストが実行されると、サーバーがクラッシュする可能性があります。_

リクエストの内容が原因ではないDoS攻撃の例として、Slowlorisがあります。この攻撃では、HTTPリクエストがゆっくりと断片化されて送信されます。リクエスト全体が配信されるまで、サーバーは進行中のリクエスト専用のリソースを保持します。これらのリクエストが同時に十分に送信されると、同時接続の数がすぐに最大に達し、サービス拒否が発生します。これが、攻撃がリクエストの内容ではなく、サーバーに送信されるリクエストのタイミングとパターンに依存する方法です。


#### 軽減策

- リバースプロキシを使用して、リクエストを受信し、Node.jsアプリケーションに転送します。リバースプロキシは、キャッシング、ロードバランシング、IPブラックリストなどを提供し、DoS攻撃が効果的になる可能性を低減します。
- サーバのタイムアウトを正しく構成して、アイドル状態の接続や、リクエストの到着が遅すぎる接続をドロップできるようにします。`http.Server`のさまざまなタイムアウト（特に`headersTimeout`、`requestTimeout`、`timeout`、および`keepAliveTimeout`）を参照してください。
- ホストごとおよび合計のオープンソケットの数を制限します。[httpドキュメント](/ja/nodejs/api/http)（特に`agent.maxSockets`、`agent.maxTotalSockets`、`agent.maxFreeSockets`、および`server.maxRequestsPerSocket`）を参照してください。

### DNSリバインディング (CWE-346)

これは、[--inspectスイッチ](/ja/nodejs/guide/debugging-nodejs)を使用してデバッグインスペクターを有効にして実行されているNode.jsアプリケーションを標的にする可能性のある攻撃です。

Webブラウザで開かれたWebサイトはWebSocketおよびHTTPリクエストを行うことができるため、ローカルで実行されているデバッグインスペクターを標的にすることができます。これは通常、最新のブラウザによって実装されている[同一オリジンポリシー](/ja/nodejs/guide/debugging-nodejs)によって防止されます。このポリシーは、スクリプトが異なるオリジンからのリソースにアクセスすることを禁止します（つまり、悪意のあるWebサイトはローカルIPアドレスからリクエストされたデータを読み取ることができません）。

ただし、DNSリバインディングを通じて、攻撃者はリクエストのオリジンを一時的に制御して、ローカルIPアドレスから発信されたように見せかけることができます。これは、WebサイトとそのIPアドレスの解決に使用されるDNSサーバーの両方を制御することで行われます。詳細については、[DNS Rebinding wiki](https://en.wikipedia.org/wiki/DNS_rebinding)を参照してください。

#### 軽減策

- `process.on(‘SIGUSR1’, …)`リスナーをアタッチして、SIGUSR1シグナルでインスペクターを無効にします。
- 本番環境ではインスペクタープロトコルを実行しないでください。

### 許可されていないアクターへの機密情報の漏洩 (CWE-552)

現在のディレクトリに含まれるすべてのファイルとフォルダは、パッケージの公開中にnpmレジストリにプッシュされます。

`.npmignore`および`.gitignore`を使用してブロックリストを定義するか、`package.json`で許可リストを定義することにより、この動作を制御するいくつかのメカニズムがあります。


#### 対策

- `npm publish --dry-run` を使用して、公開するすべてのファイルを一覧表示します。パッケージを公開する前に、内容を必ず確認してください。
- `.gitignore` や `.npmignore` などの無視ファイルを作成および維持することも重要です。これらのファイルを通して、公開しないファイル/フォルダを指定できます。`package.json` の [files プロパティ](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) では、逆の操作（許可リスト）が可能です。
- 情報漏洩が発生した場合は、[パッケージの公開を取り消す](https://docs.npmjs.com/unpublishing-packages-from-the-registry) ようにしてください。

### HTTP リクエストスマグリング (CWE-444)

これは、2 つの HTTP サーバー (通常はプロキシと Node.js アプリケーション) が関与する攻撃です。クライアントは、まずフロントエンドサーバー (プロキシ) を通過し、次にバックエンドサーバー (アプリケーション) にリダイレクトされる HTTP リクエストを送信します。フロントエンドとバックエンドが曖昧な HTTP リクエストを異なる方法で解釈する場合、攻撃者がフロントエンドには見えないがバックエンドには見える悪意のあるメッセージを送信し、効果的にプロキシサーバーを「スマグリング」する可能性があります。

詳細な説明と例については、[CWE-444](https://cwe.mitre.org/data/definitions/444.html) を参照してください。

この攻撃は、Node.js が HTTP リクエストを (任意の) HTTP サーバーとは異なる方法で解釈することに依存しているため、攻撃が成功するかどうかは、Node.js、フロントエンドサーバー、またはその両方の脆弱性に起因する可能性があります。Node.js によるリクエストの解釈方法が HTTP 仕様 (see [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)) と一致している場合、Node.js の脆弱性とは見なされません。

#### 対策

- HTTP サーバーを作成する際に `insecureHTTPParser` オプションを使用しないでください。
- 曖昧なリクエストを正規化するようにフロントエンドサーバーを構成します。
- Node.js と選択したフロントエンドサーバーの両方で、新しい HTTP リクエストスマグリングの脆弱性を継続的に監視します。
- 可能であれば、HTTP/2 をエンドツーエンドで使用し、HTTP のダウングレードを無効にします。


### タイミング攻撃による情報漏洩 (CWE-208)

これは、例えば、アプリケーションがリクエストに応答するのにかかる時間を測定することによって、攻撃者が潜在的に機密情報を学習できるようにする攻撃です。この攻撃は Node.js に特有のものではなく、ほぼすべてのランタイムを標的にすることができます。

アプリケーションがタイミングに敏感な操作（例えば、分岐）でシークレットを使用する場合に、攻撃が可能になります。典型的なアプリケーションでの認証の処理を考えてみましょう。ここで、基本的な認証方法には、電子メールとパスワードが認証情報として含まれます。ユーザー情報は、ユーザーが提供した入力から、理想的には DBMS から取得されます。ユーザー情報を取得すると、パスワードはデータベースから取得したユーザー情報と比較されます。組み込みの文字列比較を使用すると、同じ長さの値に対してより長い時間がかかります。この比較を許容範囲内で実行すると、意図せずにリクエストの応答時間が長くなります。リクエストの応答時間を比較することにより、攻撃者は大量のリクエストでパスワードの長さと値を推測できます。

#### 緩和策

- crypto API は、定数時間アルゴリズムを使用して、実際の機密値と予想される機密値を比較するための関数 `timingSafeEqual` を公開しています。
- パスワードの比較には、ネイティブの crypto モジュールでも利用可能な [scrypt](/ja/nodejs/api/crypto) を使用できます。
- より一般的には、可変時間操作でシークレットを使用することを避けてください。これには、シークレットでの分岐や、攻撃者が同じインフラストラクチャ（例えば、同じクラウドマシン）に配置されている可能性がある場合に、シークレットをメモリへのインデックスとして使用することが含まれます。JavaScript で定数時間コードを記述するのは困難です（一部は JIT のため）。暗号化アプリケーションの場合は、組み込みの crypto API または WebAssembly（ネイティブで実装されていないアルゴリズムの場合）を使用してください。

### 悪意のあるサードパーティ製モジュール (CWE-1357)

現在、Node.js では、どのパッケージでもネットワークアクセスなどの強力なリソースにアクセスできます。さらに、ファイルシステムへのアクセス権もあるため、任意のデータを任意の場所に送信できます。

ノードプロセスで実行されているすべてのコードは、`eval()` (またはそれに相当するもの) を使用して、追加の任意のコードをロードして実行できます。ファイルシステムへの書き込みアクセス権を持つすべてのコードは、ロードされる新しいファイルまたは既存のファイルに書き込むことによって、同じことを実現できます。

Node.js には、ロードされたリソースを信頼されていない、または信頼されていると宣言するための試験的な¹ [ポリシーメカニズム](/ja/nodejs/api/permissions) があります。ただし、このポリシーはデフォルトでは有効になっていません。依存関係のバージョンを固定し、一般的なワークフローまたは npm スクリプトを使用して脆弱性の自動チェックを実行してください。パッケージをインストールする前に、そのパッケージがメンテナンスされており、想定されるすべてのコンテンツが含まれていることを確認してください。GitHub のソースコードは必ずしも公開されているものと同じではないため、`node_modules` で検証してください。



#### サプライチェーン攻撃

Node.jsアプリケーションに対するサプライチェーン攻撃は、その依存関係（直接的または推移的なもの）のいずれかが侵害された場合に発生します。これは、アプリケーションが依存関係の指定に関して緩すぎる（不要なアップデートを許容する）か、または指定における一般的なタイプミス（[タイポスクワッティング](https://en.wikipedia.org/wiki/Typosquatting)の影響を受けやすい）のいずれかによって発生する可能性があります。

上流のパッケージを制御する攻撃者は、悪意のあるコードを含む新しいバージョンを公開することができます。Node.jsアプリケーションが、どのバージョンが安全であるかについて厳密に指定せずにそのパッケージに依存している場合、パッケージは自動的に最新の悪意のあるバージョンに更新され、アプリケーションが侵害される可能性があります。

`package.json`ファイルで指定された依存関係は、正確なバージョン番号または範囲を持つことができます。ただし、依存関係を正確なバージョンに固定しても、その推移的な依存関係自体は固定されません。これにより、アプリケーションは不要な/予期しないアップデートに対して脆弱なままになります。

考えられる攻撃ベクトル：

- タイポスクワッティング攻撃
- ロックファイルポイズニング
- 侵害されたメンテナー
- 悪意のあるパッケージ
- 依存関係の混同

##### 軽減策

- `--ignore-scripts`を使用して、npmが悪意のあるスクリプトを実行するのを防ぐ
  - さらに、`npm config set ignore-scripts true`を使用してグローバルに無効にすることができます
- 依存関係のバージョンを、範囲または可変ソースからのバージョンではなく、特定の不変バージョンに固定します。
- すべての依存関係（直接的および推移的）を固定するロックファイルを使用します。
  - [ロックファイルポイズニングに対する軽減策](https://blog.ulisesgascon.com/lockfile-posioned)を使用します。
- [npm-audit](https://www.npmjs.com/package/npm-audit)のようなツールを使用して、CIを使用して新しい脆弱性のチェックを自動化します。
  - `Socket`などのツールを使用して、ネットワークやファイルシステムへのアクセスなどの危険な動作を見つけるために、静的分析でパッケージを分析できます。
- `npm install`の代わりに`npm ci`を使用します。これにより、ロックファイルが強制され、ロックファイルと`package.json`ファイル間の不整合が発生した場合、エラーが発生します（`package.json`を優先してロックファイルを黙って無視する代わりに）。
- `package.json`ファイルで、依存関係の名前のエラー/タイプミスを注意深く確認してください。


### メモリアクセス違反 (CWE-284)

メモリベースまたはヒープベースの攻撃は、メモリ管理エラーと悪用可能なメモリアロケータの組み合わせに依存します。すべてのランタイムと同様に、Node.js も、プロジェクトが共有マシン上で実行されている場合、これらの攻撃に対して脆弱です。セキュアヒープを使用することは、ポインタのオーバーランおよびアンダーランによる機密情報の漏洩を防ぐのに役立ちます。

残念ながら、セキュアヒープは Windows では利用できません。詳細については、Node.js の [セキュアヒープのドキュメント](/ja/nodejs/api/cli) を参照してください。

#### 緩和策

- アプリケーションに応じて `--secure-heap=n` を使用します。ここで n は割り当てられる最大バイトサイズです。
- 本番環境のアプリを共有マシン上で実行しないでください。

### モンキーパッチ (CWE-349)

モンキーパッチとは、既存の動作を変更することを目的として、実行時にプロパティを変更することを指します。例：

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // グローバルな [].push をオーバーライドする
}
```

#### 緩和策

`--frozen-intrinsics` フラグは、実験的な¹フローズンイントリンシクスを有効にします。これは、組み込みのすべての JavaScript オブジェクトと関数が再帰的にフリーズされることを意味します。したがって、次のスニペットは `Array.prototype.push` のデフォルトの動作をオーバーライドしません。

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // グローバルな [].push をオーバーライドする
}
// 未捕捉:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// オブジェクト 'の読み取り専用プロパティ 'push' に割り当てることができません
```

ただし、`globalThis` を使用して新しいグローバル変数を定義したり、既存のグローバル変数を置き換えたりできることに注意することが重要です。

```bash
globalThis.foo = 3; foo; // 新しいグローバル変数を定義できます 3
globalThis.Array = 4; Array; // ただし、既存のグローバル変数を置き換えることもできます 4
```

したがって、`Object.freeze(globalThis)` を使用すると、グローバル変数が置き換えられないことを保証できます。

### プロトタイプ汚染攻撃 (CWE-1321)

プロトタイプ汚染とは、\__proto_, \_constructor, prototype、および組み込みプロトタイプから継承された他のプロパティの使用を悪用して、Javascript 言語アイテムのプロパティを変更または挿入する可能性を指します。

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// 潜在的な DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // 未捕捉 TypeError: d.hasOwnProperty is not a function
```

これは、JavaScript 言語から継承された潜在的な脆弱性です。


#### 例

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (サードパーティライブラリ: Lodash)

#### 緩和策

- [安全でない再帰的マージ](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js)を避ける。([CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487)を参照)。
- 外部/信頼できないリクエストに対して JSON スキーマの検証を実装する。
- `Object.create(null)` を使用してプロトタイプなしでオブジェクトを作成する。
- プロトタイプを凍結する: `Object.freeze(MyObject.prototype)`。
- `--disable-proto` フラグを使用して `Object.prototype.__proto__` プロパティを無効にする。
- プロパティがオブジェクトに直接存在するかどうかを、`Object.hasOwn(obj, keyFromObj)` を使用してプロトタイプからではなく確認する。
- `Object.prototype` からのメソッドの使用を避ける。

### 制御されない検索パス要素 (CWE-427)

Node.js は[モジュール解決アルゴリズム](/ja/nodejs/api/modules)に従ってモジュールをロードします。したがって、モジュールが要求 (require) されるディレクトリは信頼されていると想定します。

つまり、次のアプリケーションの動作が期待されます。次のディレクトリ構造を想定します。

- app/
  - server.js
  - auth.js
  - auth

server.js が `require('./auth')` を使用する場合、モジュール解決アルゴリズムに従い、`auth.js` ではなく auth をロードします。

#### 緩和策

実験的な¹ [整合性チェック付きポリシーメカニズム](/ja/nodejs/api/permissions)を使用すると、上記の脅威を回避できます。上記のディレクトリの場合、次の `policy.json` を使用できます。

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

したがって、auth モジュールを要求する場合、システムは整合性を検証し、予期されたものと一致しない場合はエラーをスローします。

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

ポリシーの変更を避けるために、`--policy-integrity` を常に使用することをお勧めします。


## 本番環境での実験的機能

本番環境での実験的機能の使用は推奨されません。実験的機能は、必要に応じて破壊的な変更を受ける可能性があり、その機能は安全に安定していません。ただし、フィードバックは大歓迎です。

## OpenSSFツール

[OpenSSF](https://www.openssf.org)は、特にnpmパッケージを公開する予定がある場合に非常に役立つ可能性のあるいくつかのイニシアチブを主導しています。これらのイニシアチブには以下が含まれます。

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecardは、一連の自動化されたセキュリティリスクチェックを使用して、オープンソースプロジェクトを評価します。これを使用して、コードベースの脆弱性と依存関係をプロアクティブに評価し、脆弱性を受け入れるかどうかについて情報に基づいた決定を下すことができます。
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) プロジェクトは、各ベストプラクティスにどのように準拠しているかを記述することにより、自主的に自己認証できます。これにより、プロジェクトに追加できるバッジが生成されます。

