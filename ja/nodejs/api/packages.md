---
title: Node.js パッケージドキュメント
description: Node.jsの公式パッケージに関するドキュメントを探求し、パッケージの管理、作成、公開方法、package.json、依存関係、パッケージ管理ツールに関する詳細を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js パッケージドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの公式パッケージに関するドキュメントを探求し、パッケージの管理、作成、公開方法、package.json、依存関係、パッケージ管理ツールに関する詳細を学びます。
  - - meta
    - name: twitter:title
      content: Node.js パッケージドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの公式パッケージに関するドキュメントを探求し、パッケージの管理、作成、公開方法、package.json、依存関係、パッケージ管理ツールに関する詳細を学びます。
---


# モジュール: パッケージ {#modules-packages}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.13.0, v12.20.0 | `"exports"` パターンのサポートを追加。 |
| v14.6.0, v12.19.0 | パッケージ `"imports"` フィールドを追加。 |
| v13.7.0, v12.17.0 | 条件付きエクスポートのフラグを解除。 |
| v13.7.0, v12.16.0 | `--experimental-conditional-exports` オプションを削除。12.16.0 では、条件付きエクスポートはまだ `--experimental-modules` の背後にあります。 |
| v13.6.0, v12.16.0 | パッケージの名前を使用した自己参照のフラグを解除。 |
| v12.7.0 | 古典的な `"main"` フィールドよりも強力な代替手段として、`"exports"` `package.json` フィールドを導入。 |
| v12.0.0 | `package.json` `"type"` フィールドを介して、`.js` ファイル拡張子を使用した ES モジュールのサポートを追加。 |
:::

## 導入 {#introduction}

パッケージは、`package.json` ファイルで記述されたフォルダツリーです。パッケージは、`package.json` ファイルを含むフォルダと、別の `package.json` ファイルを含む次のフォルダ、または `node_modules` という名前のフォルダまでのすべてのサブフォルダで構成されます。

このページでは、`package.json` ファイルを作成するパッケージ作成者向けに、Node.js によって定義された [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) フィールドのリファレンスとともにガイダンスを提供します。

## モジュールシステムの決定 {#determining-module-system}

### 導入 {#introduction_1}

Node.js は、`node` に最初の入力として渡された場合、または `import` ステートメントまたは `import()` 式によって参照された場合、以下を [ES モジュール](/ja/nodejs/api/esm) として扱います。

- `.mjs` 拡張子を持つファイル。
- 最も近い親 `package.json` ファイルに、値が `"module"` のトップレベルの [`"type"`](/ja/nodejs/api/packages#type) フィールドが含まれている場合、`.js` 拡張子を持つファイル。
- `--eval` の引数として渡された文字列、または `--input-type=module` フラグを使用して `STDIN` 経由で `node` にパイプされた文字列。
- [ES モジュール](/ja/nodejs/api/esm) として正常に解析された構文を含むコード（`import` または `export` ステートメント、または `import.meta` など）。解釈方法の明示的なマーカーはありません。明示的なマーカーは、`.mjs` または `.cjs` 拡張子、`package.json` `"type"` フィールド（`"module"` または `"commonjs"` のいずれかの値）、または `--input-type` フラグです。動的な `import()` 式は、CommonJS または ES モジュールのいずれかでサポートされており、ファイルが ES モジュールとして扱われることを強制しません。[構文検出](/ja/nodejs/api/packages#syntax-detection) を参照してください。

Node.js は、`node` に最初の入力として渡された場合、または `import` ステートメントまたは `import()` 式によって参照された場合、以下を [CommonJS](/ja/nodejs/api/modules) として扱います。

- `.cjs` 拡張子を持つファイル。
- 最も近い親 `package.json` ファイルに、値が `"commonjs"` のトップレベルフィールド [`"type"`](/ja/nodejs/api/packages#type) が含まれている場合、`.js` 拡張子を持つファイル。
- `--eval` または `--print` の引数として渡された文字列、または `--input-type=commonjs` フラグを使用して `STDIN` 経由で `node` にパイプされた文字列。
- 親 `package.json` ファイルがない、または最も近い親 `package.json` ファイルに `type` フィールドがなく、コードが CommonJS として正常に評価できる `.js` 拡張子を持つファイル。つまり、Node.js は、そのような「あいまいな」ファイルを最初に CommonJS として実行しようとし、パーサーが ES モジュールの構文を検出したために CommonJS としての評価が失敗した場合、ES モジュールとして再評価します。

「あいまいな」ファイルに ES モジュールの構文を記述すると、パフォーマンスコストが発生するため、可能な限り明示的に記述することをお勧めします。特に、パッケージ作成者は、すべてのソースが CommonJS であるパッケージであっても、常に `package.json` ファイルに [`"type"`](/ja/nodejs/api/packages#type) フィールドを含める必要があります。パッケージの `type` を明示的に記述すると、Node.js のデフォルトのタイプが変更された場合にパッケージを将来にわたって保護できます。また、ビルドツールやローダーがパッケージ内のファイルをどのように解釈する必要があるかを判断するのも簡単になります。


### 構文検出 {#syntax-detection}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.7.0 | 構文検出がデフォルトで有効になりました。 |
| v21.1.0, v20.10.0 | 追加: v21.1.0, v20.10.0 |
:::

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補
:::

Node.js は曖昧な入力のソースコードを検査し、それが ES モジュールの構文を含んでいるかどうかを判断します。もしそのような構文が検出された場合、その入力は ES モジュールとして扱われます。

曖昧な入力は以下のように定義されます:

- 拡張子 `.js` を持つファイル、または拡張子がないファイル。そして、制御する `package.json` ファイルがないか、`type` フィールドがないもの。
- `--input-type` が指定されていない場合の文字列入力 (`--eval` または `STDIN`)。

ES モジュールの構文は、CommonJS として評価された場合に例外をスローする構文として定義されます。これには以下が含まれます:

- `import` ステートメント (ただし、CommonJS で有効な `import()` 式は*含まれません*)。
- `export` ステートメント。
- `import.meta` 参照。
- モジュールのトップレベルでの `await`。
- CommonJS ラッパー変数の字句再宣言 (`require`, `module`, `exports`, `__dirname`, `__filename`)。

### モジュールローダー {#modules-loaders}

Node.js には、指定子を解決してモジュールをロードする 2 つのシステムがあります。

CommonJS モジュールローダーがあります:

- 完全に同期です。
- `require()` 呼び出しの処理を担当します。
- モンキーパッチ可能です。
- [フォルダーをモジュールとして](/ja/nodejs/api/modules#folders-as-modules)サポートします。
- 指定子を解決する際、完全一致が見つからない場合、拡張子 (`.js`、`.json`、最後に `.node`) を追加し、[フォルダーをモジュールとして](/ja/nodejs/api/modules#folders-as-modules)解決しようとします。
- `.json` を JSON テキストファイルとして扱います。
- `.node` ファイルは、`process.dlopen()` でロードされるコンパイル済みアドオンモジュールとして解釈されます。
- `.json` または `.node` 拡張子がないすべてのファイルを JavaScript テキストファイルとして扱います。
- モジュールグラフが同期である場合 (トップレベルの `await` を含まない)、[CommonJS モジュールから ECMAScript モジュールをロード](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require)するためにのみ使用できます。ECMAScript モジュールではない JavaScript テキストファイルをロードするために使用される場合、そのファイルは CommonJS モジュールとしてロードされます。

ECMAScript モジュールローダーがあります:

- `require()` のためにモジュールをロードするために使用されている場合を除き、非同期です。
- `import` ステートメントと `import()` 式の処理を担当します。
- モンキーパッチ不可能で、[ローダーフック](/ja/nodejs/api/esm#loaders)を使用してカスタマイズできます。
- フォルダーをモジュールとしてサポートせず、ディレクトリインデックス (例: `'./startup/index.js'`) は完全に指定する必要があります。
- 拡張子検索は行いません。指定子が相対または絶対ファイル URL である場合は、ファイル拡張子を指定する必要があります。
- JSON モジュールをロードできますが、import type 属性が必要です。
- JavaScript テキストファイルの場合は、`.js`、`.mjs`、`.cjs` 拡張子のみを受け入れます。
- JavaScript CommonJS モジュールをロードするために使用できます。そのようなモジュールは `cjs-module-lexer` を介して渡され、名前付きエクスポートを識別しようとします。名前付きエクスポートは静的分析を通じて決定できる場合に利用できます。インポートされた CommonJS モジュールは、URL が絶対パスに変換され、CommonJS モジュールローダーを介してロードされます。


### `package.json` とファイルの拡張子 {#packagejson-and-file-extensions}

パッケージ内では、[`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) の [`"type"`](/ja/nodejs/api/packages#type) フィールドは、Node.js が `.js` ファイルをどのように解釈するかを定義します。`package.json` ファイルに `"type"` フィールドがない場合、`.js` ファイルは [CommonJS](/ja/nodejs/api/modules) として扱われます。

`package.json` の `"type"` の値が `"module"` の場合、Node.js はそのパッケージ内の `.js` ファイルを [ES モジュール](/ja/nodejs/api/esm) 構文を使用しているものとして解釈します。

`"type"` フィールドは、最初のエントリーポイント (`node my-app.js`) だけでなく、`import` ステートメントや `import()` 式で参照されるファイルにも適用されます。

```js [ESM]
// my-app.js, パッケージ.json ファイルが同じフォルダにあり、"type": "module" であるため、ES モジュールとして扱われます。

import './startup/init.js';
// ./startup に package.json ファイルが含まれていないため、ES モジュールとしてロードされます。
// そのため、1 つ上のレベルから "type" の値を継承します。

import 'commonjs-package';
// ./node_modules/commonjs-package/package.json に
// "type" フィールドがないか、"type": "commonjs" が含まれているため、CommonJS としてロードされます。

import './node_modules/commonjs-package/index.js';
// ./node_modules/commonjs-package/package.json に
// "type" フィールドがないか、"type": "commonjs" が含まれているため、CommonJS としてロードされます。
```
`.mjs` で終わるファイルは、最も近い親の `package.json` に関係なく、常に [ES モジュール](/ja/nodejs/api/esm) としてロードされます。

`.cjs` で終わるファイルは、最も近い親の `package.json` に関係なく、常に [CommonJS](/ja/nodejs/api/modules) としてロードされます。

```js [ESM]
import './legacy-file.cjs';
// .cjs は常に CommonJS としてロードされるため、CommonJS としてロードされます。

import 'commonjs-package/src/index.mjs';
// .mjs は常に ES モジュールとしてロードされるため、ES モジュールとしてロードされます。
```
`.mjs` および `.cjs` 拡張子は、同じパッケージ内で型を混在させるために使用できます。

- `"type": "module"` パッケージ内では、`.cjs` 拡張子で名前を付けることによって、特定のファイルを [CommonJS](/ja/nodejs/api/modules) として解釈するように Node.js に指示できます（`.js` と `.mjs` の両方のファイルが `"module"` パッケージ内で ES モジュールとして扱われるため）。
- `"type": "commonjs"` パッケージ内では、`.mjs` 拡張子で名前を付けることによって、特定のファイルを [ES モジュール](/ja/nodejs/api/esm) として解釈するように Node.js に指示できます（`.js` と `.cjs` の両方のファイルが `"commonjs"` パッケージ内で CommonJS として扱われるため）。


### `--input-type` フラグ {#--input-type-flag}

**追加: v12.0.0**

`--eval`（または `-e`）への引数として渡された文字列、または `STDIN` 経由で `node` にパイプされた文字列は、`--input-type=module` フラグが設定されている場合、[ES モジュール](/ja/nodejs/api/esm)として扱われます。

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
完全を期すために、文字列入力を明示的に CommonJS として実行するための `--input-type=commonjs` もあります。 `--input-type` が指定されていない場合、これがデフォルトの動作です。

## パッケージマネージャーの決定 {#determining-package-manager}

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

すべての Node.js プロジェクトは、公開されるとすべてのパッケージマネージャーでインストール可能になることが期待されていますが、開発チームは多くの場合、特定のパッケージマネージャーを使用する必要があります。 このプロセスを容易にするために、Node.js には [Corepack](/ja/nodejs/api/corepack) と呼ばれるツールが付属しており、Node.js がインストールされていれば、すべてのパッケージマネージャーを環境内で透過的に利用できるようにすることを目指しています。

デフォルトでは、Corepack は特定のパッケージマネージャーを強制せず、各 Node.js リリースに関連付けられた一般的な "Last Known Good" バージョンを使用しますが、プロジェクトの `package.json` で [`"packageManager"`](/ja/nodejs/api/packages#packagemanager) フィールドを設定することで、このエクスペリエンスを向上させることができます。

## パッケージのエントリーポイント {#package-entry-points}

パッケージの `package.json` ファイルには、[`"main"`](/ja/nodejs/api/packages#main) と [`"exports"`](/ja/nodejs/api/packages#exports) の 2 つのフィールドがあり、パッケージのエントリーポイントを定義できます。 どちらのフィールドも、ES モジュールと CommonJS モジュールの両方のエントリーポイントに適用されます。

[`"main"`](/ja/nodejs/api/packages#main) フィールドはすべてのバージョンの Node.js でサポートされていますが、その機能は限定的です。パッケージのメインエントリーポイントのみを定義します。

[`"exports"`](/ja/nodejs/api/packages#exports) は、[`"main"`](/ja/nodejs/api/packages#main) の最新の代替手段を提供し、複数のエントリーポイントを定義したり、環境間の条件付きエントリー解決をサポートしたり、**<a href="#exports"><code>"exports"</code></a> で定義されたエントリーポイント以外の他のエントリーポイントを防ぎます**。 このカプセル化により、モジュールの作成者はパッケージのパブリックインターフェースを明確に定義できます。

現在サポートされているバージョンの Node.js を対象とする新しいパッケージには、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドが推奨されます。 Node.js 10 以前をサポートするパッケージには、[`"main"`](/ja/nodejs/api/packages#main) フィールドが必要です。 [`"exports"`](/ja/nodejs/api/packages#exports) と [`"main"`](/ja/nodejs/api/packages#main) の両方が定義されている場合、サポートされているバージョンの Node.js では、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドが [`"main"`](/ja/nodejs/api/packages#main) よりも優先されます。

[条件付きエクスポート](/ja/nodejs/api/packages#conditional-exports) を [`"exports"`](/ja/nodejs/api/packages#exports) 内で使用して、パッケージが `require` 経由で参照されるか `import` 経由で参照されるかなど、環境ごとに異なるパッケージのエントリーポイントを定義できます。 単一のパッケージで CommonJS と ES モジュールの両方をサポートする方法の詳細については、[デュアル CommonJS/ES モジュールパッケージのセクション](/ja/nodejs/api/packages#dual-commonjses-module-packages) を参照してください。

[`"exports"`](/ja/nodejs/api/packages#exports) フィールドを導入する既存のパッケージは、パッケージのコンシューマーが定義されていないエントリーポイント（[`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions)（例：`require('your-package/package.json')`）を含む）を使用することを防ぎます。 **これは、破壊的な変更になる可能性があります。**

[`"exports"`](/ja/nodejs/api/packages#exports) の導入を破壊的でないようにするには、以前にサポートされていたすべてのエントリーポイントがエクスポートされていることを確認してください。 パッケージのパブリック API が明確に定義されるように、エントリーポイントを明示的に指定するのが最善です。 たとえば、以前に `main`、`lib`、`feature`、および `package.json` をエクスポートしていたプロジェクトでは、次の `package.exports` を使用できます。

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
または、プロジェクトは、エクスポートパターンを使用して、拡張サブパスの有無にかかわらず、フォルダー全体をエクスポートすることもできます。

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
上記は、マイナーパッケージバージョンの下位互換性を提供し、パッケージの将来のメジャー変更では、エクスポートを公開されている特定の機能のエクスポートのみに適切に制限できます。

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### メインのエントリーポイントのエクスポート {#main-entry-point-export}

新しいパッケージを作成するときは、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドを使用することをお勧めします。

```json [JSON]
{
  "exports": "./index.js"
}
```
[`"exports"`](/ja/nodejs/api/packages#exports) フィールドが定義されている場合、パッケージのすべてのサブパスはカプセル化され、インポーターは使用できなくなります。たとえば、`require('pkg/subpath.js')` は [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/ja/nodejs/api/errors#err_package_path_not_exported) エラーをスローします。

このエクスポートのカプセル化は、ツールに対して、またパッケージのセマンティックバージョンのアップグレードを処理する際に、パッケージインターフェースに関するより信頼性の高い保証を提供します。`require('/path/to/node_modules/pkg/subpath.js')` のようなパッケージの任意の絶対サブパスを直接 `require` すると `subpath.js` がロードされるため、強力なカプセル化ではありません。

現在サポートされているすべてのバージョンの Node.js と最新のビルドツールは、`"exports"` フィールドをサポートしています。古いバージョンの Node.js または関連するビルドツールを使用しているプロジェクトでは、同じモジュールを指す `"main"` フィールドを `"exports"` と一緒に含めることで互換性を実現できます。

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### サブパスのエクスポート {#subpath-exports}

**追加: v12.7.0**

[`"exports"`](/ja/nodejs/api/packages#exports) フィールドを使用する場合、メインのエントリーポイントを `"."` サブパスとして扱うことで、メインのエントリーポイントとともにカスタムサブパスを定義できます。

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
これで、[`"exports"`](/ja/nodejs/api/packages#exports) で定義されたサブパスのみをコンシューマーがインポートできます。

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// ./node_modules/es-module-package/src/submodule.js をロードします
```
他のサブパスはエラーになります。

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// ERR_PACKAGE_PATH_NOT_EXPORTED をスローします
```
#### サブパスの拡張子 {#extensions-in-subpaths}

パッケージの作成者は、拡張子付き (`import 'pkg/subpath.js'`) または拡張子なし (`import 'pkg/subpath'`) のサブパスをエクスポートで提供する必要があります。これにより、エクスポートされたモジュールごとに 1 つのサブパスのみが存在することが保証されるため、すべての依存関係者が同じ一貫した指定子をインポートし、パッケージコントラクトをコンシューマーに明確にし、パッケージサブパスの補完を簡素化します。

従来、パッケージは拡張子なしのスタイルを使用する傾向があり、読みやすさと、パッケージ内のファイルの実際のパスをマスクできるという利点があります。

[インポートマップ](https://github.com/WICG/import-maps) がブラウザーやその他の JavaScript ランタイムでのパッケージ解決の標準を提供するようになったため、拡張子なしのスタイルを使用すると、インポートマップの定義が肥大化する可能性があります。明示的なファイル拡張子を使用すると、パッケージサブパスのエクスポートごとに個別のマップエントリを作成する代わりに、[パッケージフォルダーマッピング](https://github.com/WICG/import-maps#packages-via-trailing-slashes) を利用して、可能な限り複数のサブパスをマップできるため、この問題を回避できます。これは、相対インポートと絶対インポートの指定子で [完全な指定子パス](/ja/nodejs/api/esm#mandatory-file-extensions) を使用する必要性も反映しています。


### エクスポートの糖衣構文 {#exports-sugar}

**追加:** v12.11.0

`"."` エクスポートが唯一のエクスポートである場合、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドは、このケースが直接的な [`"exports"`](/ja/nodejs/api/packages#exports) フィールドの値であるという糖衣構文を提供します。

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
これは以下のように書けます:

```json [JSON]
{
  "exports": "./index.js"
}
```
### サブパスインポート {#subpath-imports}

**追加:** v14.6.0, v12.19.0

[`"exports"`](/ja/nodejs/api/packages#exports) フィールドに加えて、パッケージ自体からのインポート指定子にのみ適用されるプライベートなマッピングを作成するためのパッケージ `"imports"` フィールドがあります。

`"imports"` フィールドのエントリは、外部パッケージ指定子と区別するために、常に `#` で始まる必要があります。

たとえば、`imports` フィールドを使用して、内部モジュールの条件付きエクスポートの利点を得ることができます。

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
ここで、`import '#dep'` は、外部パッケージ `dep-node-native` (そのエクスポートを含む) の解決を取得せず、代わりに他の環境ではパッケージに対してローカルファイル `./dep-polyfill.js` を取得します。

`"exports"` フィールドとは異なり、`"imports"` フィールドは外部パッケージへのマッピングを許可します。

imports フィールドの解決ルールは、それ以外の場合、exports フィールドと同様です。

### サブパスパターン {#subpath-patterns}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.10.0, v14.19.0 | "imports" フィールドでのパターントレーラーのサポート。 |
| v16.9.0, v14.19.0 | パターントレーラーのサポート。 |
| v14.13.0, v12.20.0 | 追加: v14.13.0, v12.20.0 |
:::

エクスポートまたはインポートの数が少ないパッケージの場合は、各エクスポートサブパスエントリを明示的にリストすることをお勧めします。 ただし、多数のサブパスを持つパッケージの場合、これは `package.json` の肥大化およびメンテナンスの問題を引き起こす可能性があります。

これらのユースケースでは、代わりにサブパスエクスポートパターンを使用できます。

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> マップは、文字列置換構文であるため、ネストされたサブパスを公開します。**

右側のすべての `*` インスタンスは、`/` セパレーターが含まれている場合を含め、この値に置き換えられます。

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// ./node_modules/es-module-package/src/features/x.js をロードします

import featureY from 'es-module-package/features/y/y.js';
// ./node_modules/es-module-package/src/features/y/y.js をロードします

import internalZ from '#internal/z.js';
// ./node_modules/es-module-package/src/internal/z.js をロードします
```
これは、ファイル拡張子に対する特別な処理を行わない直接的な静的マッチングと置換です。 マッピングの両側に `"*.js"` を含めると、公開されるパッケージのエクスポートが JS ファイルのみに制限されます。

パッケージの個々のエクスポートは、右側のターゲットパターンをパッケージ内のファイルリストに対する `**` glob として扱うことによって判別できるため、エクスポートの静的に列挙可能であるというプロパティは、エクスポートパターンで維持されます。 `node_modules` パスはエクスポートターゲットでは禁止されているため、この展開はパッケージ自体のファイルのみに依存します。

プライベートなサブフォルダーをパターンから除外するには、`null` ターゲットを使用できます。

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// スロー: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// ./node_modules/es-module-package/src/features/x.js をロードします
```

### 条件付きエクスポート {#conditional-exports}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.7.0, v12.16.0 | 条件付きエクスポートのフラグを解除しました。 |
| v13.2.0, v12.16.0 | 追加: v13.2.0, v12.16.0 |
:::

条件付きエクスポートは、特定の条件に応じて異なるパスにマッピングする方法を提供します。CommonJS と ES モジュールのインポートの両方でサポートされています。

たとえば、`require()` と `import` に対して異なる ES モジュールエクスポートを提供したいパッケージは、次のように記述できます。

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
Node.js は、条件を定義する必要がある最も具体的なものから最も具体的でないものの順に、次の条件を実装します。

- `"node-addons"` - `"node"` と同様に、任意の Node.js 環境に一致します。この条件は、ネイティブアドオンに依存しない、より普遍的なエントリーポイントとは対照的に、ネイティブ C++ アドオンを使用するエントリーポイントを提供するために使用できます。この条件は、[`--no-addons` フラグ](/ja/nodejs/api/cli#--no-addons) を使用して無効にできます。
- `"node"` - 任意の Node.js 環境に一致します。CommonJS または ES モジュールファイルにすることができます。*ほとんどの場合、Node.js プラットフォームを明示的に呼び出す必要はありません。*
- `"import"` - `import` または `import()` 経由で、あるいは ECMAScript モジュールローダーによるトップレベルのインポートまたは解決操作経由でパッケージがロードされる場合に一致します。ターゲットファイルのモジュール形式に関係なく適用されます。*常に <code>"require"</code> と相互に排他的です。*
- `"require"` - `require()` 経由でパッケージがロードされる場合に一致します。参照されるファイルは `require()` でロード可能である必要がありますが、条件はターゲットファイルのモジュール形式に関係なく一致します。予想される形式には、CommonJS、JSON、ネイティブアドオン、および ES モジュールが含まれます。*常に <code>"import"</code> と相互に排他的です。*
- `"module-sync"` - パッケージが `import`、`import()`、または `require()` 経由でロードされるかどうかにかかわらず一致します。形式は、モジュールグラフにトップレベルの await を含まない ES モジュールであると予想されます。含まれている場合、モジュールが `require()` されると `ERR_REQUIRE_ASYNC_MODULE` がスローされます。
- `"default"` - 常に一致する一般的なフォールバック。CommonJS または ES モジュールファイルにすることができます。*この条件は常に最後に記述する必要があります。*

[`"exports"`](/ja/nodejs/api/packages#exports) オブジェクト内では、キーの順序が重要です。条件照合中、前のエントリは優先度が高く、後のエントリよりも優先されます。*一般的なルールは、条件をオブジェクトの順序で最も具体的なものから最も具体的でないものにする必要があるということです。*

`"import"` および `"require"` 条件を使用すると、いくつかの危険が生じる可能性があります。これについては、[デュアル CommonJS/ES モジュールパッケージセクション](/ja/nodejs/api/packages#dual-commonjses-module-packages) で詳しく説明します。

`"node-addons"` 条件は、ネイティブ C++ アドオンを使用するエントリーポイントを提供するために使用できます。ただし、この条件は [`--no-addons` フラグ](/ja/nodejs/api/cli#--no-addons) を使用して無効にできます。`"node-addons"` を使用する場合、`"default"` を、ネイティブアドオンの代わりに WebAssembly を使用するなど、より普遍的なエントリーポイントを提供する拡張機能として扱うことをお勧めします。

条件付きエクスポートは、エクスポートサブパスにも拡張できます。例：

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
`require('pkg/feature.js')` および `import 'pkg/feature.js'` が Node.js とその他の JS 環境で異なる実装を提供できるパッケージを定義します。

環境ブランチを使用する場合は、可能な限り `"default"` 条件を常に含めてください。`"default"` 条件を提供することで、不明な JS 環境がこの普遍的な実装を使用できるようになり、これらの JS 環境が条件付きエクスポートを持つパッケージをサポートするために既存の環境であるふりをする必要がなくなります。このため、`"node"` および `"default"` 条件ブランチを使用する方が、通常 `"node"` および `"browser"` 条件ブランチを使用するよりも好ましいです。


### ネストされた条件 {#nested-conditions}

Node.jsは、直接的なマッピングに加えて、ネストされた条件オブジェクトもサポートしています。

例えば、Node.jsでのみデュアルモードのエントリーポイントを持ち、ブラウザでは使用しないパッケージを定義するには：

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```

条件は、フラットな条件と同様に、順番にマッチングされます。ネストされた条件にマッピングがない場合、親条件の残りの条件のチェックを続けます。このように、ネストされた条件はネストされたJavaScriptの`if`文と同様に動作します。

### ユーザー条件の解決 {#resolving-user-conditions}

**追加: v14.9.0, v12.19.0**

Node.jsの実行時に、カスタムユーザー条件は`--conditions`フラグで追加できます：

```bash [BASH]
node --conditions=development index.js
```

これにより、パッケージのインポートとエクスポートで`"development"`条件が解決され、既存の`"node"`, `"node-addons"`, `"default"`, `"import"`, `"require"`条件も適切に解決されます。

カスタム条件は、リピートフラグを使用していくつでも設定できます。

一般的な条件には、英数字のみを含める必要があり、必要に応じて":", "-", または "=" を区切り文字として使用します。それ以外のものを使用すると、Node.js以外で互換性の問題が発生する可能性があります。

Node.jsでは、条件には制限がほとんどありませんが、具体的には次のものが含まれます。

### コミュニティ条件の定義 {#community-conditions-definitions}

`"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` および `"default"` の条件 ([Node.jsコアで実装](/ja/nodejs/api/packages#conditional-exports)) 以外の条件文字列は、デフォルトで無視されます。

他のプラットフォームは他の条件を実装する可能性があり、Node.jsでは、[`--conditions` / `-C` フラグ](/ja/nodejs/api/packages#resolving-user-conditions) を介してユーザー条件を有効にできます。

カスタムパッケージ条件は、正しい使用法を保証するために明確な定義を必要とするため、一般的な既知のパッケージ条件とその厳密な定義のリストを以下に提供し、エコシステムの調整を支援します。

- `"types"` - 型システムはこれを使用して、指定されたエクスポートの型定義ファイルを解決できます。*この条件は常に最初に含める必要があります。*
- `"browser"` - すべてのWebブラウザ環境。
- `"development"` - 開発専用の環境エントリーポイントを定義するために使用できます。たとえば、開発モードで実行する場合、より良いエラーメッセージなどの追加のデバッグコンテキストを提供します。*常に<code>"production"</code>と相互に排他的である必要があります。*
- `"production"` - 本番環境のエントリーポイントを定義するために使用できます。*常に<code>"development"</code>と相互に排他的である必要があります。*

他のランタイムの場合、プラットフォーム固有の条件キー定義は、[WinterCG](https://wintercg.org/) によって [Runtime Keys](https://runtime-keys.proposal.wintercg.org/) の提案仕様で管理されています。

新しい条件定義は、[このセクションのNode.jsドキュメント](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions) へのプルリクエストを作成することにより、このリストに追加できます。ここに新しい条件定義をリストする要件は次のとおりです。

- 定義は、すべての実装者にとって明確かつ曖昧さがない必要があります。
- 条件が必要な理由に関するユースケースは、明確に正当化される必要があります。
- 既存の実装の使用法が十分に存在する必要があります。
- 条件名は、別の条件定義または広く使用されている条件と競合しないようにする必要があります。
- 条件定義のリストは、他の方法では不可能なエコシステムへの調整上のメリットを提供する必要があります。たとえば、会社固有またはアプリケーション固有の条件には必ずしも当てはまりません。
- 条件は、Node.jsユーザーがNode.jsコアドキュメントに含めることを期待するようなものである必要があります。`"types"` 条件が良い例です。[Runtime Keys](https://runtime-keys.proposal.wintercg.org/) の提案には実際には属していませんが、Node.jsドキュメントでは適切です。

上記の定義は、適切な時期に専用の条件レジストリに移動される可能性があります。


### パッケージ名を使った自己参照 {#self-referencing-a-package-using-its-name}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.6.0, v12.16.0 | パッケージ名を使った自己参照のフラグを解除。 |
| v13.1.0, v12.16.0 | 追加: v13.1.0, v12.16.0 |
:::

パッケージ内では、パッケージの `package.json` の [`"exports"`](/ja/nodejs/api/packages#exports) フィールドで定義された値は、パッケージの名前を使って参照できます。たとえば、`package.json` が次のようになっていると仮定します。

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
すると、*そのパッケージ内の* どのモジュールも、パッケージ自体でエクスポートを参照できます。

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // ./index.mjs から "something" をインポートします。
```
自己参照は、`package.json` に [`"exports"`](/ja/nodejs/api/packages#exports) がある場合にのみ利用でき、その [`"exports"`](/ja/nodejs/api/packages#exports) (`package.json` 内) が許可するもののみインポートできます。したがって、前のパッケージが与えられた場合、次のコードはランタイムエラーを生成します。

```js [ESM]
// ./another-module.mjs

// ./m.mjs から "another" をインポートします。"package.json" の "exports" フィールドが
// "./m.mjs" という名前のエクスポートを提供していないため、失敗します。
import { another } from 'a-package/m.mjs';
```
自己参照は、ESモジュールとCommonJSモジュールの両方で、`require` を使用する場合にも利用できます。たとえば、次のコードも動作します。

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // ./foo.js からロードします。
```
最後に、自己参照はスコープ付きパッケージでも機能します。たとえば、次のコードも動作します。

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## デュアル CommonJS/ES モジュールパッケージ {#dual-commonjs/es-module-packages}

詳細については、[パッケージの例のリポジトリ](https://github.com/nodejs/package-examples)を参照してください。

## Node.js `package.json` フィールド定義 {#nodejs-packagejson-field-definitions}

このセクションでは、Node.js ランタイムで使用されるフィールドについて説明します。その他のツール ([npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) など) は、Node.js で無視され、ここではドキュメント化されていない追加のフィールドを使用します。

`package.json` ファイルの次のフィールドが Node.js で使用されます。

- [`"name"`](/ja/nodejs/api/packages#name) - パッケージ内で名前付きインポートを使用する場合に関連します。パッケージマネージャーでもパッケージ名として使用されます。
- [`"main"`](/ja/nodejs/api/packages#main) - エクスポートが指定されていない場合、およびエクスポートが導入される前の Node.js のバージョンで、パッケージをロードする際のデフォルトモジュール。
- [`"packageManager"`](/ja/nodejs/api/packages#packagemanager) - パッケージへの貢献時に推奨されるパッケージマネージャー。[Corepack](/ja/nodejs/api/corepack) シムによって活用されます。
- [`"type"`](/ja/nodejs/api/packages#type) - `.js` ファイルを CommonJS としてロードするか、ES モジュールとしてロードかを決定するパッケージタイプ。
- [`"exports"`](/ja/nodejs/api/packages#exports) - パッケージのエクスポートと条件付きエクスポート。存在する場合、パッケージ内からロードできるサブモジュールを制限します。
- [`"imports"`](/ja/nodejs/api/packages#imports) - パッケージのインポート。パッケージ内のモジュール自体で使用されます。


### `"name"` {#"name"}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.6.0, v12.16.0 | `--experimental-resolve-self` オプションを削除しました。 |
| v13.1.0, v12.16.0 | 追加: v13.1.0, v12.16.0 |
:::

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "package-name"
}
```
`"name"` フィールドは、パッケージの名前を定義します。*npm* レジストリへの公開には、[特定の要件](https://docs.npmjs.com/files/package.json#name)を満たす名前が必要です。

`"name"` フィールドは、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドに加えて、名前を使用してパッケージを[自己参照](/ja/nodejs/api/packages#self-referencing-a-package-using-its-name)するために使用できます。

### `"main"` {#"main"}

**追加: v0.4.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
`"main"` フィールドは、`node_modules` 検索によって名前でインポートされた場合のパッケージのエントリーポイントを定義します。値はパスです。

パッケージに [`"exports"`](/ja/nodejs/api/packages#exports) フィールドがある場合、名前でパッケージをインポートするときに、`"main"` フィールドよりも優先されます。

また、[パッケージディレクトリが `require()` でロードされる](/ja/nodejs/api/modules#folders-as-modules)ときに使用されるスクリプトも定義します。

```js [CJS]
// これは ./path/to/directory/index.js に解決されます。
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**追加: v16.9.0, v14.19.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<パッケージマネージャー名>@<バージョン>"
}
```
`"packageManager"` フィールドは、現在のプロジェクトで作業する際に使用することが期待されるパッケージマネージャーを定義します。これは、[サポートされているパッケージマネージャー](/ja/nodejs/api/corepack#supported-package-managers)のいずれかに設定でき、Node.js以外のものをインストールしなくても、チームがまったく同じバージョンのパッケージマネージャーを使用することを保証します。

このフィールドは現在試験的であり、オプトインする必要があります。手順の詳細については、[Corepack](/ja/nodejs/api/corepack)ページを確認してください。


### `"type"` {#"type"}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.2.0, v12.17.0 | `--experimental-modules` フラグを解除。 |
| v12.0.0 | 追加: v12.0.0 |
:::

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`"type"` フィールドは、Node.js が、その `package.json` ファイルを最も近い親として持つすべての `.js` ファイルに使用するモジュール形式を定義します。

`.js` で終わるファイルは、最も近い親の `package.json` ファイルに `"type"` というトップレベルのフィールドがあり、その値が `"module"` の場合に ES モジュールとして読み込まれます。

最も近い親の `package.json` は、現在のフォルダー、そのフォルダーの親、などと node_modules フォルダーまたはボリュームルートに到達するまで検索したときに最初に見つかる `package.json` として定義されます。

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# 前の package.json と同じフォルダー内 {#in-same-folder-as-preceding-packagejson}
node my-app.js # ES モジュールとして実行
```
最も近い親の `package.json` に `"type"` フィールドがない場合、または `"type": "commonjs"` が含まれている場合、`.js` ファイルは [CommonJS](/ja/nodejs/api/modules) として扱われます。 ボリュームルートに到達し、`package.json` が見つからない場合、`.js` ファイルは [CommonJS](/ja/nodejs/api/modules) として扱われます。

`.js` ファイルの `import` ステートメントは、最も近い親の `package.json` に `"type": "module"` が含まれている場合、ES モジュールとして扱われます。

```js [ESM]
// my-app.js, 上記の例の一部
import './startup.js'; // package.json のために ES モジュールとして読み込まれます
```
`"type"` フィールドの値に関係なく、`.mjs` ファイルは常に ES モジュールとして扱われ、`.cjs` ファイルは常に CommonJS として扱われます。

### `"exports"` {#"exports"}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.13.0, v12.20.0 | `"exports"` パターンのサポートを追加。 |
| v13.7.0, v12.17.0 | 条件付きエクスポートのフラグを解除。 |
| v13.7.0, v12.16.0 | 論理的な条件付きエクスポートの順序を実装。 |
| v13.7.0, v12.16.0 | `--experimental-conditional-exports` オプションを削除。 12.16.0 では、条件付きエクスポートはまだ `--experimental-modules` の背後にあります。 |
| v13.2.0, v12.16.0 | 条件付きエクスポートを実装。 |
| v12.7.0 | 追加: v12.7.0 |
:::

- 型: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
`"exports"` フィールドを使用すると、`node_modules` 検索または独自の名前への [自己参照](/ja/nodejs/api/packages#self-referencing-a-package-using-its-name) を介して読み込まれた名前でインポートされたときに、パッケージの [エントリーポイント](/ja/nodejs/api/packages#package-entry-points) を定義できます。 これは、[サブパスのエクスポート](/ja/nodejs/api/packages#subpath-exports) と [条件付きエクスポート](/ja/nodejs/api/packages#conditional-exports) の定義をサポートし、内部の未エクスポートモジュールをカプセル化できる [`"main"`](/ja/nodejs/api/packages#main) の代替として Node.js 12 以降でサポートされています。

[条件付きエクスポート](/ja/nodejs/api/packages#conditional-exports) は `"exports"` 内で使用して、パッケージが `require` または `import` のどちらで参照されるかなど、環境ごとに異なるパッケージのエントリーポイントを定義することもできます。

`"exports"` で定義されているすべてのパスは、`./` で始まる相対ファイル URL である必要があります。


### `"imports"` {#"imports"}

**追加:** v14.6.0, v12.19.0

- タイプ: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
importsフィールドのエントリは、`#`で始まる文字列でなければなりません。

パッケージインポートは、外部パッケージへのマッピングを許可します。

このフィールドは、現在のパッケージの[サブパスインポート](/ja/nodejs/api/packages#subpath-imports)を定義します。

