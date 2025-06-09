---
title: Node-APIパッケージの公開
description: Node-APIバージョンのパッケージを非Node-APIバージョンとともに公開する方法と、パッケージにNode-APIバージョンの依存関係を導入する方法について学びます。
head:
  - - meta
    - name: og:title
      content: Node-APIパッケージの公開 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node-APIバージョンのパッケージを非Node-APIバージョンとともに公開する方法と、パッケージにNode-APIバージョンの依存関係を導入する方法について学びます。
  - - meta
    - name: twitter:title
      content: Node-APIパッケージの公開 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node-APIバージョンのパッケージを非Node-APIバージョンとともに公開する方法と、パッケージにNode-APIバージョンの依存関係を導入する方法について学びます。
---


# Node-API パッケージの公開方法

## Node-API バージョンのパッケージを、非 Node-API バージョンと並行して公開する方法

以下の手順は、`iotivity-node` パッケージを例に説明します。

- まず、非 Node-API バージョンを公開します。
    - `package.json` のバージョンを更新します。`iotivity-node` の場合、バージョンは 1.2.0-2 になります。
    - リリースのチェックリストを確認します (テスト、デモ、ドキュメントが OK であることを確認)。
    - `npm publish` を実行します。

- 次に、Node-API バージョンを公開します。
    - `package.json` のバージョンを更新します。`iotivity-node` の場合、バージョンは 1.2.0-3 になります。バージョニングには、[semver.org](https://semver.org) で説明されているプレリリースバージョン方式に従うことをお勧めします (例: 1.2.0-napi)。
    - リリースのチェックリストを確認します (テスト、デモ、ドキュメントが OK であることを確認)。
    - `npm publish --tag n-api` を実行します。

この例では、リリースに `n-api` というタグを付けることで、バージョン 1.2.0-3 は非 Node-API の公開バージョン (1.2.0-2) よりも新しいにもかかわらず、`npm install iotivity-node` を実行して `iotivity-node` をインストールしようとしてもインストールされないようになっています。デフォルトでは非 Node-API バージョンがインストールされます。Node-API バージョンを受け取るには、ユーザーは `npm install iotivity-node@n-api` を実行する必要があります。タグを npm で使用する方法の詳細については、「Using dist-tags」を参照してください。

## パッケージの Node-API バージョンへの依存関係を追加する方法

`iotivity-node` の Node-API バージョンを依存関係として追加するには、`package.json` は次のようになります。

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

「Using dist-tags」で説明されているように、通常のバージョンとは異なり、タグ付きバージョンは `package.json` 内で `"^2.0.0"` のようなバージョン範囲で指定することはできません。これは、タグが正確に 1 つのバージョンを参照するためです。したがって、パッケージメンテナーが同じタグを使用してパッケージの新しいバージョンにタグを付けることを選択した場合、`npm update` は新しいバージョンを受け取ります。これは許容できるはずです。公開されている最新バージョン以外のバージョンが必要な場合は、`package.json` の依存関係は次のように正確なバージョンを参照する必要があります。

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
