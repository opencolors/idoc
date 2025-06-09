---
title: Node.js パーミッションAPI
description: Node.js パーミッションAPIのドキュメントは、Node.jsアプリケーション内でのさまざまな操作の権限管理と制御方法を説明し、システムリソースへの安全で制御されたアクセスを保証します。
head:
  - - meta
    - name: og:title
      content: Node.js パーミッションAPI | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js パーミッションAPIのドキュメントは、Node.jsアプリケーション内でのさまざまな操作の権限管理と制御方法を説明し、システムリソースへの安全で制御されたアクセスを保証します。
  - - meta
    - name: twitter:title
      content: Node.js パーミッションAPI | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js パーミッションAPIのドキュメントは、Node.jsアプリケーション内でのさまざまな操作の権限管理と制御方法を説明し、システムリソースへの安全で制御されたアクセスを保証します。
---


# 許可 {#permissions}

許可を使用すると、Node.jsプロセスがアクセスできるシステムリソースや、プロセスがそれらのリソースに対して実行できるアクションを制御できます。

- [プロセスベースの許可](/ja/nodejs/api/permissions#process-based-permissions) は、Node.jsプロセスのリソースへのアクセスを制御します。リソースは完全に許可または拒否されるか、それに関連するアクションを制御できます。たとえば、ファイルシステムの読み取りは許可しながら、書き込みは拒否できます。この機能は、悪意のあるコードから保護するものではありません。Node.jsの[セキュリティポリシー](https://github.com/nodejs/node/blob/main/SECURITY.md)によると、Node.jsは実行を要求されたコードを信頼します。

許可モデルは、「シートベルト」アプローチを実装しており、信頼されたコードが意図せずにファイルを変更したり、アクセスが明示的に許可されていないリソースを使用したりすることを防ぎます。悪意のあるコードが存在する場合、セキュリティを保証するものではありません。悪意のあるコードは、許可モデルをバイパスし、許可モデルによって課せられた制限なしに任意のコードを実行できます。

潜在的なセキュリティの脆弱性を見つけた場合は、[セキュリティポリシー](https://github.com/nodejs/node/blob/main/SECURITY.md)を参照してください。

## プロセスベースの許可 {#process-based-permissions}

### 許可モデル {#permission-model}

::: tip [安定版: 2 - 安定版]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定版。
:::

Node.jsの許可モデルは、実行中に特定のリソースへのアクセスを制限するメカニズムです。APIは[`--permission`](/ja/nodejs/api/cli#--permission)フラグの背後に存在し、有効にすると、利用可能なすべての許可へのアクセスを制限します。

利用可能な許可は、[`--permission`](/ja/nodejs/api/cli#--permission)フラグによって文書化されています。

`--permission`を指定してNode.jsを起動すると、`fs`モジュールを介したファイルシステムへのアクセス、プロセスの生成、`node:worker_threads`の使用、ネイティブアドオンの使用、WASIの使用、およびランタイムインスペクターの有効化が制限されます。

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```

プロセスの生成とワーカースレッドの作成へのアクセスを許可するには、それぞれ[`--allow-child-process`](/ja/nodejs/api/cli#--allow-child-process)および[`--allow-worker`](/ja/nodejs/api/cli#--allow-worker)を使用します。

許可モデルを使用する場合にネイティブアドオンを許可するには、[`--allow-addons`](/ja/nodejs/api/cli#--allow-addons)フラグを使用します。WASIの場合は、[`--allow-wasi`](/ja/nodejs/api/cli#--allow-wasi)フラグを使用します。


#### ランタイム API {#runtime-api}

[`--permission`](/ja/nodejs/api/cli#--permission) フラグを通じて Permission Model を有効にすると、新しいプロパティ `permission` が `process` オブジェクトに追加されます。このプロパティには、1 つの関数が含まれています。

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

ランタイムで権限をチェックするための API 呼び出し ([`permission.has()`](/ja/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### ファイルシステム権限 {#file-system-permissions}

Permission Model は、デフォルトで `node:fs` モジュールを通じてファイルシステムへのアクセスを制限します。`node:sqlite` モジュールなど、他の手段でユーザーがファイルシステムにアクセスできないことを保証するものではありません。

ファイルシステムへのアクセスを許可するには、[`--allow-fs-read`](/ja/nodejs/api/cli#--allow-fs-read) および [`--allow-fs-write`](/ja/nodejs/api/cli#--allow-fs-write) フラグを使用します。

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
両方のフラグの有効な引数は次のとおりです。

- `*` - すべての `FileSystemRead` または `FileSystemWrite` 操作をそれぞれ許可します。
- カンマ (`,`) で区切られたパス。一致する `FileSystemRead` または `FileSystemWrite` 操作のみをそれぞれ許可します。

例:

- `--allow-fs-read=*` - すべての `FileSystemRead` 操作を許可します。
- `--allow-fs-write=*` - すべての `FileSystemWrite` 操作を許可します。
- `--allow-fs-write=/tmp/` - `/tmp/` フォルダへの `FileSystemWrite` アクセスを許可します。
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - `/tmp/` フォルダ **および** `/home/.gitignore` パスへの `FileSystemRead` アクセスを許可します。

ワイルドカードもサポートされています。

- `--allow-fs-read=/home/test*` は、ワイルドカードに一致するすべてのものへの読み取りアクセスを許可します。例: `/home/test/file1` または `/home/test2`

ワイルドカード文字 (`*`) を渡すと、後続の文字はすべて無視されます。たとえば、`/home/*.js` は `/home/*` と同様に機能します。

Permission Model が初期化されると、指定されたディレクトリが存在する場合、自動的にワイルドカード (*) が追加されます。たとえば、`/home/test/files` が存在する場合、`/home/test/files/*` として扱われます。ただし、ディレクトリが存在しない場合、ワイルドカードは追加されず、アクセスは `/home/test/files` に制限されます。まだ存在しないフォルダへのアクセスを許可する場合は、ワイルドカードを明示的に含めるようにしてください: `/my-path/folder-do-not-exist/*`.


#### パーミッションモデルの制約 {#permission-model-constraints}

このシステムを使用する前に知っておくべき制約があります。

- モデルは子ノードプロセスまたはワーカースレッドに継承されません。
- パーミッションモデルを使用する場合、以下の機能が制限されます。
    - ネイティブモジュール
    - 子プロセス
    - ワーカースレッド
    - インスペクタープロトコル
    - ファイルシステムアクセス
    - WASI
  
 
- パーミッションモデルは、Node.js環境がセットアップされた後に初期化されます。ただし、`--env-file`や`--openssl-config`などの特定のフラグは、環境初期化前にファイルを読み込むように設計されています。結果として、これらのフラグはパーミッションモデルの規則に従いません。 `v8.setFlagsFromString`を介してランタイムで設定できるV8フラグについても同様です。
- OpenSSLエンジンは、パーミッションモデルが有効になっている場合、ランタイム時に要求できません。これは、組み込みのcrypto、https、およびtlsモジュールに影響します。
- ランタイムロード可能な拡張機能は、パーミッションモデルが有効になっている場合、ロードできません。これは、sqliteモジュールに影響します。
- `node:fs`モジュールを介して既存のファイル記述子を使用すると、パーミッションモデルがバイパスされます。

#### 制限事項と既知の問題 {#limitations-and-known-issues}

- シンボリックリンクは、アクセスが許可されているパスのセット外の場所であっても、たどられます。相対シンボリックリンクを使用すると、任意のファイルやディレクトリにアクセスできる可能性があります。パーミッションモデルを有効にしてアプリケーションを起動する場合は、アクセスが許可されているパスに相対シンボリックリンクが含まれていないことを確認する必要があります。

