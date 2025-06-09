---
title: Node.js のインストール方法
description: さまざまなパッケージ マネージャーと方法を使用して Node.js をインストールする方法を学びます。nvm、fnm、Homebrew、Docker などが含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js のインストール方法 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: さまざまなパッケージ マネージャーと方法を使用して Node.js をインストールする方法を学びます。nvm、fnm、Homebrew、Docker などが含まれます。
  - - meta
    - name: twitter:title
      content: Node.js のインストール方法 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: さまざまなパッケージ マネージャーと方法を使用して Node.js をインストールする方法を学びます。nvm、fnm、Homebrew、Docker などが含まれます。
---


# Node.jsのインストール方法

Node.jsはさまざまな方法でインストールできます。この記事では、最も一般的で便利な方法を紹介します。すべての主要なプラットフォーム向けの公式パッケージは、[https://nodejs.org/download/](https://nodejs.org/download/)で入手できます。

Node.jsをインストールする非常に便利な方法の1つは、パッケージマネージャーを使用することです。この場合、オペレーティングシステムごとに独自のパッケージマネージャーがあります。

## パッケージマネージャーでインストールする

macOS、Linux、Windowsでは、次のようにインストールできます。

::: code-group
```bash [nvm]
# nvm（Node Version Manager）をインストールします
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Node.jsをダウンロードしてインストールします（ターミナルの再起動が必要になる場合があります）
nvm install 20

# 正しいNode.jsバージョンが環境にあることを確認します
node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
npm -v # `10.8.2` と表示されるはずです
```
```bash [fnm]
# fnm（Fast Node Manager）をインストールします
curl -fsSL https://fnm.vercel.app/install | bash

# fnmをアクティブにします
source ~/.bashrc

# Node.jsをダウンロードしてインストールします
fnm use --install-if-missing 20

# 正しいNode.jsバージョンが環境にあることを確認します
node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
npm -v # `10.8.2` と表示されるはずです
```
```bash [Brew]
# 注：
# HomebrewはNode.jsのパッケージマネージャーではありません。
# システムにすでにインストールされていることを確認してください。
# 公式の手順に従ってください：https://brew.sh/
# Homebrewは、Node.jsのメジャーバージョンのみをサポートしており、20リリースラインの最新のNode.jsバージョンをサポートしていない可能性があります。

# Node.jsをダウンロードしてインストールします
brew install node@20

# 正しいNode.jsバージョンが環境にあることを確認します
node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
npm -v # `10.8.2` と表示されるはずです
```
```bash [Docker]
# 注：
# DockerはNode.jsのパッケージマネージャーではありません。
# システムにすでにインストールされていることを確認してください。
# 公式の手順に従ってください：https://docs.docker.com/desktop/
# Dockerイメージは、公式に https://github.com/nodejs/docker-node/ で提供されています。

# Node.js Dockerイメージをプルします
docker pull node:20-alpine

# 正しいNode.jsバージョンが環境にあることを確認します
docker run node:20-alpine node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
docker run node:20-alpine npm -v # `10.8.2` と表示されるはずです
```
:::

Windowsでは、次のようにインストールできます。

::: code-group
```bash [fnm]
# fnm（Fast Node Manager）をインストールします
winget install Schniz.fnm

# fnm環境を設定します
fnm env --use-on-cd | Out-String | Invoke-Expression

# Node.jsをダウンロードしてインストールします
fnm use --install-if-missing 20

# 正しいNode.jsバージョンが環境にあることを確認します
node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
npm -v # `10.8.2` と表示されるはずです
```
```bash [Chocolatey]
# 注：
# ChocolateyはNode.jsのパッケージマネージャーではありません。
# システムにすでにインストールされていることを確認してください。
# 公式の手順に従ってください：https://chocolatey.org/
# ChocolateyはNode.jsプロジェクトによって公式にメンテナンスされておらず、Node.jsのv20.17.0バージョンをサポートしていない可能性があります。

# Node.jsをダウンロードしてインストールします
choco install nodejs-lts --version="20.17.0"

# 正しいNode.jsバージョンが環境にあることを確認します
node -v # `20` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
npm -v # `10.8.2` と表示されるはずです
```
```bash [Docker]
# 注：
# DockerはNode.jsのパッケージマネージャーではありません。
# システムにすでにインストールされていることを確認してください。
# 公式の手順に従ってください：https://docs.docker.com/desktop/
# Dockerイメージは、公式に https://github.com/nodejs/docker-node/ で提供されています。

# Node.js Dockerイメージをプルします
docker pull node:20-alpine

# 正しいNode.jsバージョンが環境にあることを確認します
docker run node:20-alpine node -v # `v20.17.0` と表示されるはずです

# 正しいnpmバージョンが環境にあることを確認します
docker run node:20-alpine npm -v # `10.8.2` と表示されるはずです
```
:::

`nvm` は、Node.jsを実行する一般的な方法です。Node.jsのバージョンを簡単に切り替えたり、新しいバージョンをインストールして試したり、問題が発生した場合に簡単にロールバックしたりできます。古いNode.jsバージョンでコードをテストするのにも非常に役立ちます。

::: tip
このオプションの詳細については、[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)を参照してください。
:::

いずれにせよ、Node.jsをインストールすると、コマンドラインでnode実行可能プログラムにアクセスできるようになります。

