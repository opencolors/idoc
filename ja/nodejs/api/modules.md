---
title: Node.js ドキュメント - モジュール
description: Node.jsのモジュールに関するドキュメントを探求し、CommonJS、ESモジュール、依存関係の管理、モジュールの解決方法を学びましょう。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - モジュール | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのモジュールに関するドキュメントを探求し、CommonJS、ESモジュール、依存関係の管理、モジュールの解決方法を学びましょう。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - モジュール | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのモジュールに関するドキュメントを探求し、CommonJS、ESモジュール、依存関係の管理、モジュールの解決方法を学びましょう。
---


# Modules: CommonJS モジュール {#modules-commonjs-modules}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

CommonJS モジュールは、Node.js 向けに JavaScript コードをパッケージ化する元々の方法です。Node.js は、ブラウザやその他の JavaScript ランタイムで使用される [ECMAScript モジュール](/ja/nodejs/api/esm) 標準もサポートしています。

Node.js では、各ファイルは個別のモジュールとして扱われます。たとえば、`foo.js` という名前のファイルを考えてみましょう。

```js [ESM]
const circle = require('./circle.js');
console.log(`半径 4 の円の面積は ${circle.area(4)}`);
```
最初の行で、`foo.js` は `foo.js` と同じディレクトリにあるモジュール `circle.js` をロードしています。

`circle.js` の内容は次のとおりです。

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
モジュール `circle.js` は、関数 `area()` と `circumference()` をエクスポートしました。関数とオブジェクトは、特別な `exports` オブジェクトに追加のプロパティを指定することで、モジュールのルートに追加されます。

モジュール内のローカル変数は、Node.js によってモジュールが関数でラップされているため、プライベートになります ( [モジュールラッパー](/ja/nodejs/api/modules#the-module-wrapper) を参照)。この例では、変数 `PI` は `circle.js` に対してプライベートです。

`module.exports` プロパティには、新しい値 (関数やオブジェクトなど) を割り当てることができます。

次のコードでは、`bar.js` は Square クラスをエクスポートする `square` モジュールを使用しています。

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`mySquare の面積は ${mySquare.area()}`);
```
`square` モジュールは `square.js` で定義されています。

```js [ESM]
// exports への割り当てはモジュールを変更しません。module.exports を使用する必要があります。
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
CommonJS モジュールシステムは、[`module` コアモジュール](/ja/nodejs/api/module) に実装されています。

## 有効化 {#enabling}

Node.js には、CommonJS モジュールと [ECMAScript モジュール](/ja/nodejs/api/esm) の 2 つのモジュールシステムがあります。

デフォルトでは、Node.js は次を CommonJS モジュールとして扱います。

- `.cjs` 拡張子のファイル。
- 最も近い親 `package.json` ファイルに `"commonjs"` の値を持つトップレベルのフィールド [`"type"`](/ja/nodejs/api/packages#type) が含まれている場合の `.js` 拡張子のファイル。
- 最も近い親 `package.json` ファイルにトップレベルのフィールド [`"type"`](/ja/nodejs/api/packages#type) が含まれていない場合、または親フォルダーに `package.json` がない場合の `.js` 拡張子のファイル、または拡張子のないファイル。ただし、ファイルに ES モジュールとして評価されない限りエラーになる構文が含まれている場合は除きます。パッケージの作成者は、すべてのソースが CommonJS であるパッケージでも、[`"type"`](/ja/nodejs/api/packages#type) フィールドを含める必要があります。パッケージの `type` を明示的にすることで、ビルドツールとローダーがパッケージ内のファイルをどのように解釈するかを判断しやすくなります。
- `.mjs`、`.cjs`、`.json`、`.node`、または `.js` ではない拡張子のファイル (最も近い親 `package.json` ファイルに `"module"` の値を持つトップレベルのフィールド [`"type"`](/ja/nodejs/api/packages#type) が含まれている場合、これらのファイルはプログラムのコマンドラインエントリポイントとして使用される場合はなく、`require()` 経由で含まれている場合にのみ CommonJS モジュールとして認識されます)。

詳細については、[モジュールシステムの決定](/ja/nodejs/api/packages#determining-module-system) を参照してください。

`require()` の呼び出しは常に CommonJS モジュールローダーを使用します。`import()` の呼び出しは常に ECMAScript モジュールローダーを使用します。


## メインモジュールへのアクセス {#accessing-the-main-module}

Node.jsから直接ファイルが実行されると、`require.main`はその`module`に設定されます。つまり、`require.main === module`をテストすることで、ファイルが直接実行されたかどうかを判断できます。

ファイル `foo.js` の場合、`node foo.js` を介して実行される場合はこれが `true` になりますが、`require('./foo')` で実行される場合は `false` になります。

エントリポイントが CommonJS モジュールでない場合、`require.main` は `undefined` であり、メインモジュールにアクセスできません。

## パッケージマネージャーのヒント {#package-manager-tips}

Node.jsの `require()` 関数のセマンティクスは、合理的なディレクトリ構造をサポートするのに十分な汎用性を持つように設計されました。`dpkg`、`rpm`、`npm` などのパッケージマネージャープログラムは、Node.jsモジュールからネイティブパッケージを修正なしで構築できることが期待されます。

以下に、うまく機能する可能性のある推奨されるディレクトリ構造を示します。

`/usr/lib/node/\<some-package\>/\<some-version\>` にパッケージの特定のバージョンの内容を保持したいとしましょう。

パッケージは互いに依存する可能性があります。パッケージ `foo` をインストールするには、パッケージ `bar` の特定のバージョンをインストールする必要がある場合があります。`bar` パッケージ自体に依存関係がある可能性があり、場合によっては、これらが衝突したり、循環依存関係を形成したりすることさえあります。

Node.jsは、ロードするすべてのモジュールの `realpath` を検索し（つまり、シンボリックリンクを解決します）、次に [それらの依存関係を `node_modules` フォルダーで検索する](/ja/nodejs/api/modules#loading-from-node_modules-folders) ため、この状況は次のアーキテクチャで解決できます。

- `/usr/lib/node/foo/1.2.3/`: `foo` パッケージの内容（バージョン1.2.3）。
- `/usr/lib/node/bar/4.3.2/`: `foo` が依存する `bar` パッケージの内容。
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: `/usr/lib/node/bar/4.3.2/` へのシンボリックリンク。
- `/usr/lib/node/bar/4.3.2/node_modules/*`: `bar` が依存するパッケージへのシンボリックリンク。

したがって、サイクルが発生した場合でも、依存関係の競合がある場合でも、すべてのモジュールは使用できる依存関係のバージョンを取得できます。

`foo` パッケージのコードが `require('bar')` を実行すると、`/usr/lib/node/foo/1.2.3/node_modules/bar` にシンボリックリンクされているバージョンが取得されます。次に、`bar` パッケージのコードが `require('quux')` を呼び出すと、`/usr/lib/node/bar/4.3.2/node_modules/quux` にシンボリックリンクされているバージョンが取得されます。

さらに、モジュールの検索プロセスをさらに最適化するために、パッケージを `/usr/lib/node` に直接配置するのではなく、`/usr/lib/node_modules/\<name\>/\<version\>` に配置することができます。これにより、Node.jsは `/usr/node_modules` または `/node_modules` で見つからない依存関係を探す手間が省けます。

モジュールをNode.js REPLで使用できるようにするには、`$NODE_PATH` 環境変数に `/usr/lib/node_modules` フォルダーを追加すると便利な場合があります。`node_modules` フォルダーを使用したモジュールの検索はすべて相対的であり、`require()` の呼び出しを行うファイルの実際のパスに基づいているため、パッケージ自体はどこにでも配置できます。


## `require()` を使用した ECMAScript モジュールの読み込み {#loading-ecmascript-modules-using-require}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v23.5.0 | この機能はデフォルトで実験的な警告を表示しなくなりましたが、`--trace-require-module` で警告を表示することは可能です。 |
| v23.0.0 | この機能は `--experimental-require-module` CLI フラグの背後にはありません。 |
| v23.0.0 | `require(esm)` で `'module.exports'` 相互運用エクスポートをサポート。 |
| v22.0.0, v20.17.0 | v22.0.0, v20.17.0 で追加 |
:::

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補
:::

`.mjs` 拡張子は [ECMAScript モジュール](/ja/nodejs/api/esm) 用に予約されています。 どのファイルが ECMAScript モジュールとして解析されるかについての詳細は、[モジュールシステムの決定](/ja/nodejs/api/packages#determining-module-system) セクションを参照してください。

`require()` は、次の要件を満たす ECMAScript モジュールの読み込みのみをサポートします。

- モジュールが完全に同期していること（トップレベルの `await` を含まない）。そして
- 次のいずれかの条件が満たされていること:

ロードされる ES モジュールが要件を満たしている場合、`require()` はそれをロードしてモジュール名前空間オブジェクトを返すことができます。 この場合、動的な `import()` に似ていますが、同期的に実行され、名前空間オブジェクトを直接返します。

次の ES モジュールがあるとします。

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
CommonJS モジュールは `require()` でロードできます:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
ES モジュールを CommonJS に変換する既存のツールとの相互運用性のために、`require()` を介して実際 ES モジュールをロードできる場合は、`default` エクスポートがある場合、返される名前空間には `__esModule: true` プロパティが含まれます。これにより、ツールによって生成された消費コードは、実際の ES モジュールでデフォルトのエクスポートを認識できます。 名前空間がすでに `__esModule` を定義している場合、これは追加されません。 このプロパティは実験的であり、将来変更される可能性があります。 これは、既存のエコシステム規約に従って、ES モジュールを CommonJS モジュールに変換するツールのみが使用する必要があります。 CommonJS で直接作成されたコードは、それに依存することを避ける必要があります。

ES モジュールに名前付きエクスポートとデフォルトエクスポートの両方が含まれている場合、`require()` によって返される結果はモジュール名前空間オブジェクトであり、`import()` によって返される結果と同様に、デフォルトのエクスポートを `.default` プロパティに配置します。 `require(esm)` で直接返されるものをカスタマイズするには、ES モジュールは文字列名 `"module.exports"` を使用して目的の値をエクスポートできます。

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` は、静的プロパティとして `Point` に追加されない限り、このモジュールの CommonJS コンシューマーには失われます。
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// 'module.exports' が使用されている場合、名前付きエクスポートは失われます
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
上記の例では、`module.exports` エクスポート名が使用されている場合、名前付きエクスポートは CommonJS コンシューマーには失われることに注意してください。 CommonJS コンシューマーが名前付きエクスポートへのアクセスを継続できるようにするために、モジュールは、デフォルトのエクスポートが、プロパティとして添付された名前付きエクスポートを持つオブジェクトであることを確認できます。 たとえば、上記の例では、`distance` は静的メソッドとしてデフォルトのエクスポートである `Point` クラスにアタッチできます。

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
`require()` されるモジュールにトップレベルの `await` が含まれている場合、または `import` するモジュールグラフにトップレベルの `await` が含まれている場合、[`ERR_REQUIRE_ASYNC_MODULE`](/ja/nodejs/api/errors#err_require_async_module) がスローされます。 この場合、ユーザーは [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) を使用して非同期モジュールをロードする必要があります。

`--experimental-print-required-tla` が有効になっている場合、評価前に `ERR_REQUIRE_ASYNC_MODULE` をスローする代わりに、Node.js はモジュールを評価し、トップレベルの await を特定しようとし、ユーザーがそれらを修正するのに役立つように場所を出力します。

`require()` を使用した ES モジュールのロードのサポートは現在実験的であり、`--no-experimental-require-module` を使用して無効にできます。 この機能が使用されている場所を出力するには、[`--trace-require-module`](/ja/nodejs/api/cli#--trace-require-modulemode) を使用します。

この機能は、[`process.features.require_module`](/ja/nodejs/api/process#processfeaturesrequire_module) が `true` かどうかを確認することで検出できます。


## まとめ {#all-together}

`require()` が呼び出されたときにロードされる正確なファイル名を取得するには、`require.resolve()` 関数を使用します。

上記のすべてをまとめると、`require()` が行うことの擬似コードによる高レベルのアルゴリズムは次のとおりです。

```text [TEXT]
require(X) from module at path Y
1. Xがコアモジュールである場合、
   a. コアモジュールを返す
   b. 停止
2. Xが'/'で始まる場合、
   a. Yをファイルシステムのルートに設定する
3. Xが'./'、'/'、または'../'で始まる場合、
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. "not found" を投げる
4. Xが'#'で始まる場合、
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. "not found" を投げる

MAYBE_DETECT_AND_LOAD(X)
1. XがCommonJSモジュールとして解析される場合、XをCommonJSモジュールとしてロードする。停止。
2. それ以外の場合、Xのソースコードが<a href="esm.md#resolver-algorithm-specification">ESMリゾルバーで定義されているDETECT_MODULE_SYNTAX</a>を使用してECMAScriptモジュールとして解析できる場合、
  a. XをECMAScriptモジュールとしてロードする。停止。
3. 1.でXをCommonJSとして解析しようとしたSyntaxErrorを投げる。停止。

LOAD_AS_FILE(X)
1. Xがファイルの場合、Xをそのファイル拡張子形式としてロードする。停止
2. X.jsがファイルの場合、
    a. Xに最も近いパッケージスコープ SCOPE を見つける。
    b. スコープが見つからない場合
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. SCOPE/package.jsonに "type" フィールドが含まれている場合、
      1. "type" フィールドが "module" の場合、X.jsをECMAScriptモジュールとしてロードする。停止。
      2. "type" フィールドが "commonjs" の場合、X.jsをCommonJSモジュールとしてロードする。停止。
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. X.jsonがファイルの場合、X.jsonをJavaScriptオブジェクトにロードする。停止
4. X.nodeがファイルの場合、X.nodeをバイナリaddonとしてロードする。停止

LOAD_INDEX(X)
1. X/index.jsがファイルの場合
    a. Xに最も近いパッケージスコープ SCOPE を見つける。
    b. スコープが見つからない場合、X/index.jsをCommonJSモジュールとしてロードする。停止。
    c. SCOPE/package.jsonに "type" フィールドが含まれている場合、
      1. "type" フィールドが "module" の場合、X/index.jsをECMAScriptモジュールとしてロードする。停止。
      2. それ以外の場合、X/index.jsをCommonJSモジュールとしてロードする。停止。
2. X/index.jsonがファイルの場合、X/index.jsonをJavaScriptオブジェクトに解析する。停止
3. X/index.nodeがファイルの場合、X/index.nodeをバイナリaddonとしてロードする。停止

LOAD_AS_DIRECTORY(X)
1. X/package.jsonがファイルの場合、
   a. X/package.jsonを解析し、"main" フィールドを探す。
   b. "main" が falsy な値の場合、2. に GOTO する。
   c. let M = X + (json main フィールド)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATED
   g. "not found" を投げる
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS = NODE_MODULES_PATHS(START)
2. DIRS の各 DIR について:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = PARTS のカウント - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules", GOTO d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. let I = I - 1
5. DIRS + GLOBAL_FOLDERS を返す

LOAD_PACKAGE_IMPORTS(X, DIR)
1. DIR に最も近いパッケージスコープ SCOPE を見つける。
2. スコープが見つからない場合、戻る。
3. SCOPE/package.json "imports" が null または undefined の場合、戻る。
4. `--experimental-require-module` が有効になっている場合
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. それ以外の場合、let CONDITIONS = ["node", "require"]
5. let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">ESMリゾルバーで定義されています</a>。
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. XをNAMEとSUBPATHの組み合わせとして解釈してみてください。ここで、名前には@scope/プレフィックスが付いており、サブパスはスラッシュ（`/`）で始まります。
2. Xがこのパターンに一致しないか、DIR/NAME/package.jsonがファイルでない場合、
   戻る。
3. DIR/NAME/package.jsonを解析し、"exports" フィールドを探す。
4. "exports" が null または undefined の場合、戻る。
5. `--experimental-require-module` が有効になっている場合
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. それ以外の場合、let CONDITIONS = ["node", "require"]
6. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">ESMリゾルバーで定義されています</a>。
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. DIR に最も近いパッケージスコープ SCOPE を見つける。
2. スコープが見つからない場合、戻る。
3. SCOPE/package.json "exports" が null または undefined の場合、戻る。
4. SCOPE/package.json "name" がXの最初のセグメントでない場合、戻る。
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">ESMリゾルバーで定義されています</a>。
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. let RESOLVED_PATH = fileURLToPath(MATCH)
2. RESOLVED_PATHのファイルが存在する場合、RESOLVED_PATHをその拡張子
   形式としてロードする。停止
3. "not found" を投げる
```

## キャッシュ {#caching}

モジュールは、最初にロードされた後にキャッシュされます。 これは、（とりわけ）`require('foo')`のすべての呼び出しが、同じファイルに解決される場合、まったく同じオブジェクトが返されることを意味します。

`require.cache`が変更されていない場合、`require('foo')`を複数回呼び出しても、モジュールコードが複数回実行されることはありません。 これは重要な機能です。 これにより、「部分的に完了した」オブジェクトを返すことができ、循環を引き起こす場合でも、推移的な依存関係をロードできます。

モジュールにコードを複数回実行させるには、関数をエクスポートし、その関数を呼び出します。

### モジュールのキャッシュに関する注意点 {#module-caching-caveats}

モジュールは、解決されたファイル名に基づいてキャッシュされます。 モジュールは、呼び出し元モジュールの場所（`node_modules`フォルダからのロード）に基づいて異なるファイル名に解決される可能性があるため、`require('foo')`が常にまったく同じオブジェクトを返すという*保証*はありません。

さらに、大文字と小文字を区別しないファイルシステムまたはオペレーティングシステムでは、異なる解決済みのファイル名が同じファイルを指す可能性がありますが、キャッシュはそれらを異なるモジュールとして扱い、ファイルを複数回リロードします。 たとえば、`require('./foo')`と`require('./FOO')`は、`./foo`と`./FOO`が同じファイルであるかどうかに関係なく、2つの異なるオブジェクトを返します。

## 組み込みモジュール {#built-in-modules}

::: info [歴史]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0, v14.18.0 | `require(...)`への`node:`インポートのサポートが追加されました。 |
:::

Node.jsには、バイナリにコンパイルされたいくつかのモジュールがあります。 これらのモジュールについては、このドキュメントの別の場所で詳しく説明されています。

組み込みモジュールはNode.jsソース内で定義されており、`lib/`フォルダにあります。

組み込みモジュールは`node:`プレフィックスを使用して識別でき、その場合、`require`キャッシュをバイパスします。 たとえば、`require('node:http')`は、その名前のエントリが`require.cache`にある場合でも、常に組み込みのHTTPモジュールを返します。

一部の組み込みモジュールは、その識別子が`require()`に渡された場合、常に優先的にロードされます。 たとえば、`require('http')`は、その名前のファイルがある場合でも、常に組み込みのHTTPモジュールを返します。 `node:`プレフィックスを使用せずにロードできる組み込みモジュールのリストは、プレフィックスなしでリストされた[`module.builtinModules`](/ja/nodejs/api/module#modulebuiltinmodules)で公開されています。


### `node:` プレフィックスが必須の組み込みモジュール {#built-in-modules-with-mandatory-node-prefix}

`require()` によってロードされる際、一部の組み込みモジュールは `node:` プレフィックスを付けてリクエストする必要があります。この要件は、新しく導入された組み込みモジュールが、すでにその名前を取得しているユーザーランドパッケージとの競合を防ぐために存在します。現在、`node:` プレフィックスを必要とする組み込みモジュールは次のとおりです。

- [`node:sea`](/ja/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/ja/nodejs/api/sqlite)
- [`node:test`](/ja/nodejs/api/test)
- [`node:test/reporters`](/ja/nodejs/api/test#test-reporters)

これらのモジュールのリストは、プレフィックスを含めて、[`module.builtinModules`](/ja/nodejs/api/module#modulebuiltinmodules) で公開されています。

## 循環参照 {#cycles}

循環 `require()` 呼び出しがある場合、モジュールは返されるときに実行を完了していない可能性があります。

次の状況を考えてください。

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
`main.js` が `a.js` をロードし、次に `a.js` が `b.js` をロードするとします。その時点で、`b.js` は `a.js` をロードしようとします。無限ループを防ぐために、`a.js` の exports オブジェクトの **未完了のコピー** が `b.js` モジュールに返されます。次に、`b.js` はロードを完了し、その `exports` オブジェクトが `a.js` モジュールに提供されます。

`main.js` が両方のモジュールをロードするまでに、両方とも完了しています。したがって、このプログラムの出力は次のようになります。

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
アプリケーション内で循環モジュールの依存関係が正しく機能するようにするには、慎重な計画が必要です。


## ファイルモジュール {#file-modules}

正確なファイル名が見つからない場合、Node.js は必要なファイル名に拡張子 `.js`、`.json`、そして最後に `.node` を追加してロードを試みます。異なる拡張子（例：`.cjs`）を持つファイルをロードする場合は、その完全な名前をファイル拡張子を含めて `require()` に渡す必要があります（例：`require('./file.cjs')`）。

`.json` ファイルは JSON テキストファイルとして解析され、`.node` ファイルは `process.dlopen()` でロードされるコンパイル済みアドオンモジュールとして解釈されます。他の拡張子（または拡張子がない）を持つファイルは、JavaScript テキストファイルとして解析されます。使用される解析目標を理解するには、[モジュールシステムの決定](/ja/nodejs/api/packages#determining-module-system) セクションを参照してください。

`'/'` で始まる require されるモジュールは、ファイルへの絶対パスです。たとえば、`require('/home/marco/foo.js')` は `/home/marco/foo.js` のファイルをロードします。

`'./'` で始まる require されるモジュールは、`require()` を呼び出すファイルからの相対パスです。つまり、`require('./circle')` が `circle.js` を見つけるためには、`circle.js` は `foo.js` と同じディレクトリにある必要があります。

ファイルを示す先頭の `'/'`、`'./'`、または `'../'` がない場合、モジュールはコアモジュールであるか、`node_modules` フォルダからロードされる必要があります。

指定されたパスが存在しない場合、`require()` は [`MODULE_NOT_FOUND`](/ja/nodejs/api/errors#module_not_found) エラーをスローします。

## モジュールとしてのフォルダ {#folders-as-modules}

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [サブパスエクスポート](/ja/nodejs/api/packages#subpath-exports) または [サブパスインポート](/ja/nodejs/api/packages#subpath-imports) を使用してください。
:::

フォルダを引数として `require()` に渡す方法は 3 つあります。

1 つ目は、フォルダのルートに [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルを作成し、`main` モジュールを指定することです。[`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルの例は次のようになります。

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
これが `./some-library` のフォルダにある場合、`require('./some-library')` は `./some-library/lib/some-library.js` のロードを試みます。

ディレクトリに [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルが存在しない場合、または [`"main"`](/ja/nodejs/api/packages#main) エントリが見つからないか解決できない場合、Node.js はそのディレクトリから `index.js` または `index.node` ファイルのロードを試みます。たとえば、前の例に [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルがない場合、`require('./some-library')` は次のロードを試みます。

- `./some-library/index.js`
- `./some-library/index.node`

これらの試みが失敗した場合、Node.js はモジュール全体をデフォルトのエラーで欠落しているものとして報告します。

```bash [BASH]
Error: Cannot find module 'some-library'
```
上記の 3 つのケースすべてにおいて、`import('./some-library')` の呼び出しは [`ERR_UNSUPPORTED_DIR_IMPORT`](/ja/nodejs/api/errors#err_unsupported_dir_import) エラーになります。パッケージの [サブパスエクスポート](/ja/nodejs/api/packages#subpath-exports) または [サブパスインポート](/ja/nodejs/api/packages#subpath-imports) を使用すると、モジュールとしてのフォルダと同じ包含組織の利点が得られ、`require` と `import` の両方で機能します。


## `node_modules`フォルダからのロード {#loading-from-node_modules-folders}

`require()`に渡されたモジュール識別子が[組み込み](/ja/nodejs/api/modules#built-in-modules)モジュールではなく、`'/'`、`'../'`、`'./'`で始まらない場合、Node.jsは現在のモジュールのディレクトリから開始し、`/node_modules`を追加し、その場所からモジュールをロードしようとします。Node.jsはすでに`node_modules`で終わるパスに`node_modules`を追加しません。

そこに見つからない場合、親ディレクトリに移動し、ファイルのシステムのルートに到達するまで続行します。

たとえば、`'/home/ry/projects/foo.js'`にあるファイルが`require('bar.js')`を呼び出した場合、Node.jsは次の場所をこの順序で検索します。

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

これにより、プログラムは依存関係をローカライズして、衝突しないようにすることができます。

モジュール名にパスのサフィックスを含めることで、モジュールとともに配布される特定のファイルまたはサブモジュールをrequireすることができます。たとえば、`require('example-module/path/to/file')`は、`example-module`が配置されている場所を基準に`path/to/file`を解決します。サフィックス付きのパスは、同じモジュール解決のセマンティクスに従います。

## グローバルフォルダからのロード {#loading-from-the-global-folders}

`NODE_PATH`環境変数がコロン区切りの絶対パスのリストに設定されている場合、Node.jsは他の場所で見つからないモジュールに対してそれらのパスを検索します。

Windowsでは、`NODE_PATH`はコロン（`:`）ではなくセミコロン（`;`）で区切られます。

`NODE_PATH`は、現在の[モジュール解決](/ja/nodejs/api/modules#all-together)アルゴリズムが定義される前に、さまざまなパスからモジュールをロードできるようにするために元々作成されました。

`NODE_PATH`はまだサポートされていますが、Node.jsのエコシステムが依存モジュールを配置するための規約に落ち着いたため、現在では必要性が低くなっています。`NODE_PATH`に依存するデプロイメントでは、`NODE_PATH`を設定する必要があることを人々が知らない場合、予期しない動作を示すことがあります。モジュールの依存関係が変更され、`NODE_PATH`が検索されると、異なるバージョン（または異なるモジュール）がロードされることがあります。

さらに、Node.jsは次のGLOBAL_FOLDERSのリストを検索します。

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

ここで、`$HOME`はユーザーのホームディレクトリであり、`$PREFIX`はNode.jsが構成された`node_prefix`です。

これらはほとんど歴史的な理由によるものです。

依存関係をローカルの`node_modules`フォルダに配置することを強くお勧めします。これらはより速く、より確実にロードされます。


## モジュールラッパー {#the-module-wrapper}

モジュールのコードが実行される前に、Node.js はそれを次のような関数ラッパーで包みます。

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// モジュールコードは実際にはここに記述されます
});
```

このようにすることで、Node.js はいくつかのことを実現します。

- トップレベルの変数（`var`、`const`、または`let`で定義）を、グローバルオブジェクトではなくモジュールにスコープ化します。
- モジュールに固有のグローバルに見える変数をいくつか提供するのに役立ちます。例：
    - 実装者がモジュールから値をエクスポートするために使用できる `module` および `exports` オブジェクト。
    - モジュールの絶対ファイル名とディレクトリパスを含む便利な変数 `__filename` と `__dirname`。

## モジュールスコープ {#the-module-scope}

### `__dirname` {#__dirname}

**追加: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在のモジュールのディレクトリ名。これは、[`__filename`](/ja/nodejs/api/modules#__filename)の[`path.dirname()`](/ja/nodejs/api/path#pathdirnamepath)と同じです。

例：`/Users/mjr`から`node example.js`を実行する

```js [ESM]
console.log(__dirname);
// 出力: /Users/mjr
console.log(path.dirname(__filename));
// 出力: /Users/mjr
```
### `__filename` {#__filename}

**追加: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在のモジュールのファイル名。これは、シンボリックリンクが解決された現在のモジュールファイルの絶対パスです。

メインプログラムの場合、これはコマンドラインで使用されるファイル名と同じであるとは限りません。

現在のモジュールのディレクトリ名については、[`__dirname`](/ja/nodejs/api/modules#__dirname)を参照してください。

例：

`/Users/mjr`から`node example.js`を実行する

```js [ESM]
console.log(__filename);
// 出力: /Users/mjr/example.js
console.log(__dirname);
// 出力: /Users/mjr
```

次のディレクトリ構造を持つ、`a`と`b`の2つのモジュールがあるとします。ここで、`b`は`a`の依存関係です。

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

`b.js`内の`__filename`への参照は`/Users/mjr/app/node_modules/b/b.js`を返し、`a.js`内の`__filename`への参照は`/Users/mjr/app/a.js`を返します。


### `exports` {#exports}

**Added in: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`module.exports` への参照であり、より短く入力できます。 `exports` をいつ使用し、`module.exports` をいつ使用するかについての詳細は、[exports ショートカット](/ja/nodejs/api/modules#exports-shortcut) に関するセクションを参照してください。

### `module` {#module}

**Added in: v0.1.16**

- [\<module\>](/ja/nodejs/api/modules#the-module-object)

現在のモジュールへの参照です。[`module` オブジェクト](/ja/nodejs/api/modules#the-module-object)に関するセクションを参照してください。 特に、`module.exports` は、モジュールがエクスポートするものを定義し、`require()` を通じて利用できるようにするために使用されます。

### `require(id)` {#requireid}

**Added in: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) モジュール名またはパス
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) エクスポートされたモジュールのコンテンツ

モジュール、`JSON`、およびローカルファイルをインポートするために使用されます。 モジュールは `node_modules` からインポートできます。 ローカルモジュールと JSON ファイルは、[`__dirname`](/ja/nodejs/api/modules#__dirname) (定義されている場合) または現在のワーキングディレクトリによって名前が付けられたディレクトリに対して解決される相対パス (例: `./`、`./foo`、`./bar/baz`、`../foo`) を使用してインポートできます。 POSIX スタイルの相対パスは OS に依存しない方法で解決されます。つまり、上記の例は Windows でも Unix システムと同じように動作します。

```js [ESM]
// `__dirname` または現在の
// ワーキングディレクトリを基準としたパスを持つローカルモジュールをインポートします。(Windows では、これは .\path\myLocalModule に解決されます。)
const myLocalModule = require('./path/myLocalModule');

// JSON ファイルのインポート:
const jsonData = require('./path/filename.json');

// node_modules または Node.js 組み込みモジュールからのモジュールのインポート:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Added in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

モジュールは、要求されたときにこのオブジェクトにキャッシュされます。 このオブジェクトからキー値を削除すると、次の `require` はモジュールをリロードします。 これは [ネイティブアドオン](/ja/nodejs/api/addons) には適用されず、リロードするとエラーが発生します。

エントリの追加または置換も可能です。 このキャッシュは組み込みモジュールの前にチェックされ、組み込みモジュールに一致する名前がキャッシュに追加されると、`node:` プレフィックス付きの require 呼び出しのみが組み込みモジュールを受信します。 取り扱いには注意してください！

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Added in: v0.3.0**

**Deprecated since: v0.10.6**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

特定のファイル拡張子をどのように処理するかを `require` に指示します。

拡張子 `.sjs` のファイルを `.js` として処理する:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**非推奨。** 過去には、このリストはオンデマンドでコンパイルすることによって非 JavaScript モジュールを Node.js に読み込むために使用されていました。 しかし実際には、他の Node.js プログラムを介してモジュールを読み込んだり、事前に JavaScript にコンパイルするなど、これを行うためのより良い方法がたくさんあります。

`require.extensions` の使用は避けてください。 使用すると、微妙なバグが発生する可能性があり、登録された拡張子ごとに拡張子の解決が遅くなります。

#### `require.main` {#requiremain}

**Added in: v0.1.17**

- [\<module\>](/ja/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Node.js プロセスが起動したときにロードされたエントリスクリプトを表す `Module` オブジェクト。プログラムのエントリポイントが CommonJS モジュールでない場合は `undefined`。 ["メインモジュールへのアクセス"](/ja/nodejs/api/modules#accessing-the-main-module)を参照してください。

`entry.js` スクリプト内:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [History]
| バージョン | 変更 |
| --- | --- |
| v8.9.0 | `paths` オプションがサポートされるようになりました。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するモジュールのパス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) モジュールの場所を解決するためのパス。 存在する場合、これらのパスはデフォルトの解決パスの代わりに使用されますが、`$HOME/.node_modules` のような [GLOBAL_FOLDERS](/ja/nodejs/api/modules#loading-from-the-global-folders) は常に含まれます。 これらの各パスは、モジュール解決アルゴリズムの開始点として使用されます。つまり、`node_modules` 階層はこの場所からチェックされます。


- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

内部の `require()` メカニズムを使用してモジュールの場所を検索しますが、モジュールをロードするのではなく、解決されたファイル名を返すだけです。

モジュールが見つからない場合は、`MODULE_NOT_FOUND` エラーがスローされます。


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Added in: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 検索パスを取得するモジュールのパス。
- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`request` の解決中に検索されたパスを含む配列を返します。または、`request` 文字列がコアモジュール (例えば `http` や `fs`) を参照する場合は `null` を返します。

## `module` オブジェクト {#the-module-object}

**Added in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

各モジュールにおいて、`module` 自由変数は現在のモジュールを表すオブジェクトへの参照です。 便宜上、`module.exports` は `exports` モジュールグローバルを通してアクセスすることもできます。 `module` は実際にはグローバルではなく、各モジュールに対してローカルです。

### `module.children` {#modulechildren}

**Added in: v0.1.16**

- [\<module[]\>](/ja/nodejs/api/modules#the-module-object)

このモジュールが最初に require したモジュールオブジェクト。

### `module.exports` {#moduleexports}

**Added in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`module.exports` オブジェクトは `Module` システムによって作成されます。 これが許容できない場合があります。多くの人は、自分のモジュールを何らかのクラスのインスタンスにしたいと思っています。 これを行うには、目的のエクスポートオブジェクトを `module.exports` に割り当てます。 目的のオブジェクトを `exports` に割り当てると、ローカルの `exports` 変数が再バインドされるだけです。これはおそらく望ましいものではありません。

たとえば、`a.js` というモジュールを作成するとします。

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// 何らかの作業を行い、しばらくしてから
// モジュール自体から 'ready' イベントを発行します。
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
次に、別のファイルで次のようにすることができます。

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
`module.exports` への割り当ては、すぐに行う必要があります。 コールバックで行うことはできません。 これは機能しません。

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### `exports` のショートカット {#exports-shortcut}

**追加: v0.1.16**

`exports` 変数は、モジュールのファイルレベルスコープ内で利用可能であり、モジュールが評価される前に `module.exports` の値が割り当てられます。

これにより、`module.exports.f = ...` を `exports.f = ...` とより簡潔に記述できるショートカットが提供されます。ただし、他の変数と同様に、`exports` に新しい値が割り当てられると、`module.exports` にはバインドされなくなることに注意してください。

```js [ESM]
module.exports.hello = true; // モジュールの require からエクスポート
exports = { hello: false };  // エクスポートされず、モジュール内でのみ利用可能
```
`module.exports` プロパティが新しいオブジェクトに完全に置き換えられる場合、`exports` を再割り当てすることも一般的です。

```js [ESM]
module.exports = exports = function Constructor() {
  // ... など
};
```
この動作を説明するために、`require()` の仮想的な実装を想像してください。これは、実際に `require()` によって行われることと非常によく似ています。

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // ここにモジュールコードを記述します。この例では、関数を定義します。
    function someFunc() {}
    exports = someFunc;
    // この時点で、exports は module.exports へのショートカットではなくなり、
    // このモジュールは空のデフォルトオブジェクトをエクスポートします。
    module.exports = someFunc;
    // この時点で、モジュールはデフォルトオブジェクトの代わりに someFunc をエクスポートします。
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**追加: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

モジュールの完全に解決されたファイル名。

### `module.id` {#moduleid}

**追加: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

モジュールの識別子。通常、これは完全に解決されたファイル名です。

### `module.isPreloading` {#moduleispreloading}

**追加: v15.4.0, v14.17.0**

- 型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) モジュールが Node.js のプリロードフェーズ中に実行されている場合は `true`。


### `module.loaded` {#moduleloaded}

**Added in: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

モジュールのロードが完了したかどうか、またはロード処理中であるかどうか。

### `module.parent` {#moduleparent}

**Added in: v0.1.16**

**Deprecated since: v14.6.0, v12.19.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに [`require.main`](/ja/nodejs/api/modules#requiremain) と [`module.children`](/ja/nodejs/api/modules#modulechildren) を使用してください。
:::

- [\<module\>](/ja/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

最初にこのモジュールを要求したモジュール。現在のモジュールが現在のプロセスのエントリーポイントである場合は `null`、または CommonJS モジュールではないもの（E.G.: REPL または `import`）によってモジュールがロードされた場合は `undefined`。

### `module.path` {#modulepath}

**Added in: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

モジュールのディレクトリ名。 これは通常、[`module.id`](/ja/nodejs/api/modules#moduleid) の [`path.dirname()`](/ja/nodejs/api/path#pathdirnamepath) と同じです。

### `module.paths` {#modulepaths}

**Added in: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

モジュールの検索パス。

### `module.require(id)` {#modulerequireid}

**Added in: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) エクスポートされたモジュールの内容

`module.require()` メソッドは、元のモジュールから `require()` が呼び出されたかのようにモジュールをロードする方法を提供します。

これを行うには、`module` オブジェクトへの参照を取得する必要があります。 `require()` は `module.exports` を返し、`module` は通常、特定のモジュールのコード内でのみ利用可能であるため、使用するには明示的にエクスポートする必要があります。


## `Module` オブジェクト {#the-module-object_1}

このセクションは[モジュール: `module` コアモジュール](/ja/nodejs/api/module#the-module-object)に移動しました。

- [`module.builtinModules`](/ja/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/ja/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/ja/nodejs/api/module#modulesyncbuiltinesmexports)

## Source map v3 サポート {#source-map-v3-support}

このセクションは[モジュール: `module` コアモジュール](/ja/nodejs/api/module#source-map-v3-support)に移動しました。

- [`module.findSourceMap(path)`](/ja/nodejs/api/module#modulefindsourcemappath)
- [Class: `module.SourceMap`](/ja/nodejs/api/module#class-modulesourcemap) 
    - [`new SourceMap(payload)`](/ja/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/ja/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/ja/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

