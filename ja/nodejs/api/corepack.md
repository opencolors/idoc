---
title: Node.js Corepack ドキュメント
description: CorepackはNode.jsに同梱されているバイナリで、npm、pnpm、Yarnなどのパッケージマネージャを管理するための標準インターフェースを提供します。これにより、ユーザーは異なるパッケージマネージャやバージョン間で簡単に切り替えることができ、互換性を確保し、開発ワークフローを簡素化します。
head:
  - - meta
    - name: og:title
      content: Node.js Corepack ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: CorepackはNode.jsに同梱されているバイナリで、npm、pnpm、Yarnなどのパッケージマネージャを管理するための標準インターフェースを提供します。これにより、ユーザーは異なるパッケージマネージャやバージョン間で簡単に切り替えることができ、互換性を確保し、開発ワークフローを簡素化します。
  - - meta
    - name: twitter:title
      content: Node.js Corepack ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: CorepackはNode.jsに同梱されているバイナリで、npm、pnpm、Yarnなどのパッケージマネージャを管理するための標準インターフェースを提供します。これにより、ユーザーは異なるパッケージマネージャやバージョン間で簡単に切り替えることができ、互換性を確保し、開発ワークフローを簡素化します。
---


# Corepack {#corepack}

**追加:** v16.9.0, v14.19.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* は、パッケージマネージャーのバージョン管理を支援する実験的なツールです。 各[サポートされているパッケージマネージャー](/ja/nodejs/api/corepack#supported-package-managers)用のバイナリプロキシを公開しており、呼び出されると、現在のプロジェクトに設定されているパッケージマネージャーを識別し、必要に応じてダウンロードして、最後に実行します。

CorepackはNode.jsのデフォルトインストールで配布されていますが、Corepackが管理するパッケージマネージャーはNode.jsの配布物の一部ではありません。

- 最初の使用時に、Corepackはネットワークから最新バージョンをダウンロードします。
- （セキュリティ脆弱性などに関連する）必要な更新は、Node.jsプロジェクトの範囲外です。必要に応じて、エンドユーザーは自身で更新方法を見つける必要があります。

この機能は、2つの中核的なワークフローを簡素化します。

- 新規コントリビューターのオンボーディングが容易になります。システム固有のインストールプロセスに従う必要がなくなり、必要なパッケージマネージャーを入手できます。
- チームの全員が、更新が必要になるたびに手動で同期する必要なく、意図したとおりにパッケージマネージャーのバージョンを正確に使用できるようになります。

## ワークフロー {#workflows}

### 機能を有効にする {#enabling-the-feature}

実験的なステータスであるため、Corepackを有効にするには、明示的に有効にする必要があります。 そのためには、[`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name)を実行して、環境内の`node`バイナリの隣にシンボリックリンクを設定します（必要に応じて既存のシンボリックリンクを上書きします）。

この時点から、[サポートされているバイナリ](/ja/nodejs/api/corepack#supported-package-managers)への呼び出しは、追加のセットアップなしで機能します。 問題が発生した場合は、[`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name)を実行して、システムからプロキシを削除してください（そして、[Corepackリポジトリ](https://github.com/nodejs/corepack)で問題を提起して、お知らせください）。


### パッケージの設定 {#configuring-a-package}

Corepackプロキシは、現在のディレクトリ階層内で最も近い[`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions)ファイルを探し、その[`"packageManager"`](/ja/nodejs/api/packages#packagemanager)プロパティを抽出します。

値が[サポートされているパッケージマネージャー](/ja/nodejs/api/corepack#supported-package-managers)に対応する場合、Corepackは、関連するバイナリへのすべての呼び出しが要求されたバージョンに対して実行されるようにします。必要に応じてオンデマンドでダウンロードし、正常に取得できない場合は中止します。

[`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion)を使用すると、Corepackにローカルの`package.json`を更新して、選択したパッケージマネージャーを使用するように指示できます。

```bash [BASH]
corepack use  # package.jsonに最新の7.xバージョンを設定します
corepack use yarn@* # package.jsonに最新バージョンを設定します
```
### グローバルバージョンのアップグレード {#upgrading-the-global-versions}

既存のプロジェクトの外部で実行する場合（たとえば、`yarn init`を実行する場合）、Corepackはデフォルトで、各ツールの最新の安定版リリースにほぼ対応する事前定義されたバージョンを使用します。これらのバージョンは、設定するパッケージマネージャーのバージョンとともに[`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion)コマンドを実行することでオーバーライドできます。

```bash [BASH]
corepack install --global 
```
または、タグまたは範囲を使用できます。

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### オフラインワークフロー {#offline-workflow}

多くの本番環境にはネットワークアクセスがありません。Corepackは通常、パッケージマネージャーのリリースをレジストリから直接ダウンロードするため、このような環境と競合する可能性があります。これを回避するには、ネットワークアクセスがまだある間に（通常はデプロイイメージを準備するのと同時に）[`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion)コマンドを呼び出します。これにより、ネットワークアクセスがなくても必要なパッケージマネージャーが利用可能になります。

`pack`コマンドには[さまざまなフラグ](https://github.com/nodejs/corepack#utility-commands)があります。詳細については、詳細な[Corepackドキュメント](https://github.com/nodejs/corepack#readme)を参照してください。


## サポートされているパッケージマネージャー {#supported-package-managers}

Corepackを通じて、以下のバイナリが提供されます。

| パッケージマネージャー | バイナリ名 |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## よくある質問 {#common-questions}

### Corepackはnpmとどのように連携しますか？ {#how-does-corepack-interact-with-npm?}

Corepackは他のパッケージマネージャーと同様にnpmをサポートできますが、そのシムはデフォルトでは有効になっていません。これにはいくつかの結果が伴います。

- Corepackはそれを傍受できないため、別のパッケージマネージャーで使用するように構成されたプロジェクト内で `npm` コマンドを常に実行できます。
- `npm` は [`"packageManager"`](/ja/nodejs/api/packages#packagemanager) プロパティの有効なオプションですが、シムがないため、グローバルnpmが使用されます。

### `npm install -g yarn` が動作しません {#running-npm-install--g-yarn-doesnt-work}

npmは、グローバルインストール時にCorepackバイナリを誤って上書きすることを防ぎます。この問題を回避するには、次のいずれかのオプションを検討してください。

- このコマンドを実行しないでください。Corepackはとにかくパッケージマネージャーのバイナリを提供し、要求されたバージョンが常に利用可能であることを保証するため、パッケージマネージャーを明示的にインストールする必要はありません。
- `npm install` に `--force` フラグを追加します。これにより、npmにバイナリを上書きしても問題ないことを指示しますが、その過程でCorepackのバイナリを消去します。（それらを戻すには、[`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) を実行してください。）

