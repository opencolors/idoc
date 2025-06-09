---
title: npm パッケージマネージャーの完全ガイド
description: npm を使用して依存関係を管理し、パッケージをインストールおよび更新し、Node.js プロジェクトでタスクを実行する方法を学びます。
head:
  - - meta
    - name: og:title
      content: npm パッケージマネージャーの完全ガイド | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: npm を使用して依存関係を管理し、パッケージをインストールおよび更新し、Node.js プロジェクトでタスクを実行する方法を学びます。
  - - meta
    - name: twitter:title
      content: npm パッケージマネージャーの完全ガイド | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: npm を使用して依存関係を管理し、パッケージをインストールおよび更新し、Node.js プロジェクトでタスクを実行する方法を学びます。
---


# npm パッケージマネージャー入門

## npm について

`npm` は Node.js の標準パッケージマネージャーです。

2022年9月には、210万以上のパッケージが npm レジストリに登録されていると報告されており、これは地球上で最大の単一言語コードリポジトリとなっています。そして、ほぼすべてのものに対応するパッケージがあると確信できます。

もともとは Node.js パッケージの依存関係をダウンロードおよび管理する方法として始まりましたが、それ以来、フロントエンド JavaScript でも使用されるツールになりました。

::: tip
`Yarn` および `pnpm` は、npm cli の代替手段です。それらもチェックアウトできます。
:::

## パッケージ

### すべての依存関係をインストールする

`package.json` ファイルにリストされているすべての依存関係をインストールするには、以下を実行します。

```bash
npm install
```

これにより、プロジェクトに必要なものがすべて `node_modules` フォルダにインストールされ、存在しない場合は作成されます。

### 単一のパッケージをインストールする

単一のパッケージをインストールするには、以下を実行します。

```bash
npm install <package-name>
```

さらに、npm 5 以降、このコマンドは `<package-name>` を `package.json` ファイルの依存関係に追加します。バージョン 5 より前は、`--save` フラグを追加する必要がありました。

多くの場合、このコマンドにはさらにフラグが追加されています。

+ `--save-dev`（または `-D`）：`package.json` ファイルの `devDependencies` セクションにパッケージを追加します。
+ `--no-save`：パッケージを `package.json` ファイルに保存しないようにします。
+ `--no-optional`：オプションの依存関係のインストールを防ぎます。
+ `--save-optional`：パッケージを `package.json` ファイルの `optionalDependencies` セクションに追加します。

フラグの短縮形も使用できます。

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

devDependencies と dependencies の違いは、前者がテストライブラリなどの開発ツールを含み、後者が本番環境でアプリにバンドルされることです。

optionalDependencies については、依存関係のビルドの失敗がインストールを失敗させないという違いがあります。ただし、依存関係の欠如を処理するのは、プログラムの責任です。[オプションの依存関係](https://docs.npmjs.com/cli/v10/using-npm/config#optional) の詳細をお読みください。


### パッケージの更新
パッケージの更新も簡単です。

```bash
npm update
```

これを実行すると、すべての依存関係が最新バージョンに更新されます。

更新するパッケージを個別に指定することもできます。

```bash
npm update <package-name>
```

### パッケージの削除

パッケージを削除するには、以下を実行します。

```bash
npm uninstall <package-name>
```

### バージョニング
`npm`は、単純なダウンロードに加えて、バージョニングも管理します。これにより、パッケージの特定のバージョンを指定したり、必要なバージョンより高いバージョンまたは低いバージョンを要求したりできます。

多くの場合、ライブラリは別のライブラリのメジャーリリースとのみ互換性があることがわかります。

または、まだ修正されていないライブラリの最新リリースのバグが問題を引き起こしている可能性があります。

ライブラリの明示的なバージョンを指定すると、チーム全体が`package.json`ファイルが更新されるまで同じバージョンのパッケージを実行できるように、全員がパッケージのまったく同じバージョンを使用し続けるのにも役立ちます。

これらすべての場合において、バージョニングは非常に役立ち、`npm`は[セマンティックバージョニング（semver）](https://semver.org/)標準に従います。

パッケージの特定のバージョンをインストールするには、以下を実行します。

```bash
npm install <package-name>@<version>
```

パッケージの最新バージョンをインストールするには、以下を実行します。

```bash
npm install <package-name>@latest
```

### タスクの実行
package.jsonファイルは、以下を使用して実行できるコマンドラインタスクを指定するための形式をサポートしています。

```bash
npm run <task-name>
```

たとえば、package.jsonファイルに次のコンテンツが含まれている場合：

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

Webpackを実行するためにこの機能を使用するのは非常に一般的です。

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

そのため、忘れやすく、タイプミスしやすいこれらの長いコマンドを入力する代わりに、以下を実行できます。

```bash
npm run watch
npm run dev
npm run prod
```

