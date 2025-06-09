---
title: Node.js における ECMAScript モジュール
description: このページでは、Node.js で ECMAScript モジュール（ESM）を使用する方法について詳細に説明しています。モジュールの解決、インポートおよびエクスポートの構文、CommonJS との互換性を含みます。
head:
  - - meta
    - name: og:title
      content: Node.js における ECMAScript モジュール | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.js で ECMAScript モジュール（ESM）を使用する方法について詳細に説明しています。モジュールの解決、インポートおよびエクスポートの構文、CommonJS との互換性を含みます。
  - - meta
    - name: twitter:title
      content: Node.js における ECMAScript モジュール | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.js で ECMAScript モジュール（ESM）を使用する方法について詳細に説明しています。モジュールの解決、インポートおよびエクスポートの構文、CommonJS との互換性を含みます。
---


# モジュール: ECMAScript モジュール {#modules-ecmascript-modules}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.1.0 | インポート属性は実験的ではなくなりました。 |
| v22.0.0 | インポートアサーションのサポートを削除しました。 |
| v21.0.0, v20.10.0, v18.20.0 | インポート属性の実験的なサポートを追加しました。 |
| v20.0.0, v18.19.0 | モジュールカスタマイズフックはメインスレッド外で実行されます。 |
| v18.6.0, v16.17.0 | モジュールカスタマイズフックのチェーニングのサポートを追加しました。 |
| v17.1.0, v16.14.0 | インポートアサーションの実験的なサポートを追加しました。 |
| v17.0.0, v16.12.0 | カスタマイズフックを統合し、`getFormat`、`getSource`、`transformSource`、および `getGlobalPreloadCode` フックを削除し、`load` および `globalPreload` フックを追加し、`resolve` または `load` フックのいずれかから `format` を返すことを許可しました。 |
| v14.8.0 | トップレベルアウェイトのフラグを解除しました。 |
| v15.3.0, v14.17.0, v12.22.0 | モジュールの実装を安定化させます。 |
| v14.13.0, v12.20.0 | CommonJS の名前付きエクスポートの検出をサポートします。 |
| v14.0.0, v13.14.0, v12.20.0 | 実験的モジュールの警告を削除しました。 |
| v13.2.0, v12.17.0 | ECMAScript モジュールをロードするのにコマンドラインフラグは不要になりました。 |
| v12.0.0 | `package.json` の `"type"` フィールドを介して `.js` ファイル拡張子を使用する ES モジュールのサポートを追加しました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

::: tip [安定版: 2 - 安定版]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

## 導入 {#introduction}

ECMAScript モジュールは、JavaScript コードを再利用のためにパッケージ化する[公式の標準形式](https://tc39.github.io/ecma262/#sec-modules)です。 モジュールは、さまざまな [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) および [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) ステートメントを使用して定義されます。

ES モジュールの次の例では、関数をエクスポートします。

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
ES モジュールの次の例では、`addTwo.mjs` から関数をインポートします。

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
```
Node.js は現在指定されている ECMAScript モジュールを完全にサポートし、それらと元のモジュール形式である [CommonJS](/ja/nodejs/api/modules) との間の相互運用性を提供します。


## 有効化 {#enabling}

Node.jsには、[CommonJS](/ja/nodejs/api/modules)モジュールとECMAScriptモジュールの2つのモジュールシステムがあります。

作成者は、`.mjs`ファイル拡張子、`package.json`の[`"type"`](/ja/nodejs/api/packages#type)フィールドに`"module"`の値を設定する、または[`--input-type`](/ja/nodejs/api/cli#--input-typetype)フラグに`"module"`の値を設定することで、Node.jsにJavaScriptをESモジュールとして解釈するように指示できます。これらは、コードがESモジュールとして実行されることを意図していることを明示的に示すマーカーです。

逆に、作成者は、`.cjs`ファイル拡張子、`package.json`の[`"type"`](/ja/nodejs/api/packages#type)フィールドに`"commonjs"`の値を設定する、または[`--input-type`](/ja/nodejs/api/cli#--input-typetype)フラグに`"commonjs"`の値を設定することで、Node.jsにJavaScriptをCommonJSとして解釈するように明示的に指示できます。

コードにどちらのモジュールシステムの明示的なマーカーもない場合、Node.jsはモジュールのソースコードを調べてESモジュールの構文を探します。そのような構文が見つかった場合、Node.jsはそのコードをESモジュールとして実行します。それ以外の場合は、そのモジュールをCommonJSとして実行します。詳細については、[モジュールシステムの決定](/ja/nodejs/api/packages#determining-module-system)を参照してください。

## パッケージ {#packages}

このセクションは、[モジュール: パッケージ](/ja/nodejs/api/packages)に移動しました。

## `import` Specifier {#import-specifiers}

### 用語 {#terminology}

`import`ステートメントの*specifier*は、`from`キーワードの後の文字列です。たとえば、`import { sep } from 'node:path'`の`'node:path'`です。Specifierは、`export from`ステートメントでも使用され、`import()`式の引数としても使用されます。

Specifierには、次の3つの種類があります。

- *相対Specifier*：`'./startup.js'`や`'../config.mjs'`など。これらは、インポートするファイルの場所からの相対パスを参照します。*これらの場合、ファイル拡張子は常に必要です。*
- *ベアSpecifier*：`'some-package'`や`'some-package/shuffle'`など。これらは、パッケージ名でパッケージのメインエントリポイントを参照したり、例のようにパッケージ名が先頭に付いたパッケージ内の特定の機能モジュールを参照したりできます。*<a href="packages.html#exports"><code>"exports"</code></a>フィールドがないパッケージの場合のみ、ファイル拡張子を含める必要があります。*
- *絶対Specifier*：`'file:///opt/nodejs/config.js'`など。これらは、完全なパスを直接かつ明示的に参照します。

ベアSpecifierの解決は、[Node.jsモジュール解決およびロードアルゴリズム](/ja/nodejs/api/esm#resolution-algorithm-specification)によって処理されます。他のすべてのSpecifierの解決は、常に標準の相対[URL](https://url.spec.whatwg.org/)解決セマンティクスでのみ解決されます。

CommonJSと同様に、パッケージ内のモジュールファイルは、パッケージの[`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions)に[`"exports"`](/ja/nodejs/api/packages#exports)フィールドが含まれていない限り、パッケージ名にパスを追加することでアクセスできます。パッケージ内のファイルには、[`"exports"`](/ja/nodejs/api/packages#exports)で定義されたパスを介してのみアクセスできます。

Node.jsモジュール解決のベアSpecifierに適用されるこれらのパッケージ解決規則の詳細については、[パッケージのドキュメント](/ja/nodejs/api/packages)を参照してください。


### 必須のファイル拡張子 {#mandatory-file-extensions}

相対または絶対指定子を解決するために `import` キーワードを使用する場合、ファイル拡張子を提供する必要があります。ディレクトリのインデックス (例: `'./startup/index.js'`) も完全に指定する必要があります。

この動作は、一般的に設定されたサーバーを想定すると、ブラウザー環境での `import` の動作と一致します。

### URL {#urls}

ESモジュールはURLとして解決およびキャッシュされます。これは、特殊文字を[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls)する必要があることを意味します。たとえば、`#` は `%23`、`?` は `%3F` になります。

`file:`、`node:`、および `data:` URLスキームがサポートされています。`'https://example.com/app.js'` のような指定子は、[カスタムHTTPSローダー](/ja/nodejs/api/module#import-from-https)を使用しない限り、Node.jsではネイティブにサポートされていません。

#### `file:` URL {#file-urls}

モジュールは、それらを解決するために使用される `import` 指定子が異なるクエリまたはフラグメントを持っている場合、複数回ロードされます。

```js [ESM]
import './foo.mjs?query=1'; // クエリ "?query=1" で ./foo.mjs をロードします
import './foo.mjs?query=2'; // クエリ "?query=2" で ./foo.mjs をロードします
```
ボリュームルートは、`/`、`//`、または `file:///` を介して参照できます。[URL](https://url.spec.whatwg.org/) とパスの解決 (パーセントエンコードの詳細など) の違いを考えると、パスをインポートするときは [url.pathToFileURL](/ja/nodejs/api/url#urlpathtofileurlpath-options) を使用することをお勧めします。

#### `data:` インポート {#data-imports}

**追加: v12.10.0**

[`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) は、次のMIMEタイプでのインポートがサポートされています。

- ESモジュール用の `text/javascript`
- JSON用の `application/json`
- Wasm用の `application/wasm`

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
`data:` URLは、組み込みモジュールと[絶対指定子](/ja/nodejs/api/esm#terminology)に対してのみ[ベア指定子](/ja/nodejs/api/esm#terminology)を解決します。[相対指定子](/ja/nodejs/api/esm#terminology)の解決は、`data:` が[特殊スキーム](https://url.spec.whatwg.org/#special-scheme)ではないため、機能しません。たとえば、`data:text/javascript,import "./foo";` から `./foo` をロードしようとすると、`data:` URL には相対解決の概念がないため、解決に失敗します。


#### `node:` インポート {#node-imports}

::: info [歴史]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0, v14.18.0 | `require(...)` への `node:` インポートのサポートを追加。 |
| v14.13.1, v12.20.0 | 追加: v14.13.1, v12.20.0 |
:::

`node:` URL は、Node.js 組み込みモジュールをロードする代替手段としてサポートされています。この URL スキームにより、組み込みモジュールを有効な絶対 URL 文字列で参照できます。

```js [ESM]
import fs from 'node:fs/promises';
```
## インポート属性 {#import-attributes}

::: info [歴史]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Import Assertions から Import Attributes に切り替え。 |
| v17.1.0, v16.14.0 | 追加: v17.1.0, v16.14.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[インポート属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) は、モジュール指定子とともにモジュールインポートステートメントにさらに多くの情報を渡すためのインライン構文です。

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js は `type` 属性のみをサポートしており、以下の値をサポートしています。

| 属性   `type` | 必要なもの |
| --- | --- |
| `'json'` | [JSON モジュール](/ja/nodejs/api/esm#json-modules) |
JSON モジュールをインポートする際には、`type: 'json'` 属性が必須です。

## 組み込みモジュール {#built-in-modules}

[組み込みモジュール](/ja/nodejs/api/modules#built-in-modules) は、パブリック API の名前付きエクスポートを提供します。CommonJS エクスポートの値であるデフォルトのエクスポートも提供されます。デフォルトのエクスポートは、とりわけ、名前付きエクスポートの変更に使用できます。組み込みモジュールの名前付きエクスポートは、[`module.syncBuiltinESMExports()`](/ja/nodejs/api/module#modulesyncbuiltinesmexports) を呼び出すことによってのみ更新されます。

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## `import()` 式 {#import-expressions}

[Dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) は CommonJS と ES modules の両方でサポートされています。CommonJS モジュールでは、ES modules をロードするために使用できます。

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`import.meta` メタプロパティは、以下のプロパティを含む `Object` です。ES modules でのみサポートされています。

### `import.meta.dirname` {#importmetadirname}

**Added in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のモジュールのディレクトリ名。これは、[`import.meta.filename`](/ja/nodejs/api/esm#importmetafilename) の [`path.dirname()`](/ja/nodejs/api/path#pathdirnamepath) と同じです。

### `import.meta.filename` {#importmetafilename}

**Added in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のモジュールの完全な絶対パスとファイル名。シンボリックリンクは解決されます。
- これは、[`import.meta.url`](/ja/nodejs/api/esm#importmetaurl) の [`url.fileURLToPath()`](/ja/nodejs/api/url#urlfileurltopathurl-options) と同じです。

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) モジュールの絶対 `file:` URL。

これは、現在のモジュールファイルのURLを提供するブラウザと同じように定義されます。

これにより、相対ファイル読み込みなどの便利なパターンが可能になります。

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.6.0, v18.19.0 | `--experimental-import-meta-resolve` CLI フラグの背後に隠れていなくなりました。ただし、非標準の `parentURL` パラメーターを除きます。 |
| v20.6.0, v18.19.0 | この API は、ローカル FS 上に既存のファイルにマップされない `file:` URL をターゲットにしても、スローしなくなりました。 |
| v20.0.0, v18.19.0 | この API は、Promise の代わりに文字列を同期的に返すようになりました。 |
| v16.2.0, v14.18.0 | WHATWG `URL` オブジェクトの `parentURL` パラメーターへのサポートを追加します。 |
| v13.9.0, v12.16.2 | Added in: v13.9.0, v12.16.2 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のモジュールを基準に解決するモジュール指定子。
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定子が解決される絶対 URL 文字列。

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) は、各モジュールにスコープされたモジュール相対解決関数で、URL 文字列を返します。

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Node.js モジュール解決のすべての機能がサポートされています。依存関係の解決は、パッケージ内で許可されているエクスポートの解決に従います。

**注意点**:

- これにより、同期的なファイルシステム操作が発生する可能性があり、`require.resolve` と同様にパフォーマンスに影響を与える可能性があります。
- この機能は、カスタムローダー内では利用できません（デッドロックが発生します）。

**非標準 API**:

`--experimental-import-meta-resolve` フラグを使用すると、その関数は2番目の引数を受け入れます。

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 解決元のオプションの絶対親モジュール URL。 **Default:** `import.meta.url`


## CommonJS との相互運用性 {#interoperability-with-commonjs}

### `import` ステートメント {#import-statements}

`import` ステートメントは、ES モジュールまたは CommonJS モジュールを参照できます。`import` ステートメントは ES モジュールでのみ許可されますが、動的な [`import()`](/ja/nodejs/api/esm#import-expressions) 式は、ES モジュールをロードするために CommonJS でサポートされています。

[CommonJS モジュール](/ja/nodejs/api/esm#commonjs-namespaces)をインポートする場合、`module.exports` オブジェクトがデフォルトのエクスポートとして提供されます。名前付きエクスポートは、より良いエコシステム互換性のために、静的解析によって提供される場合があります。

### `require` {#require}

CommonJS モジュールの `require` は現在、同期的な ES モジュール（つまり、トップレベルの `await` を使用しない ES モジュール）のロードのみをサポートしています。

詳細については、[`require()` を使用した ECMAScript モジュールのロード](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require) を参照してください。

### CommonJS 名前空間 {#commonjs-namespaces}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | `'module.exports'` エクスポートマーカーを CJS 名前空間に追加しました。 |
| v14.13.0 | 追加: v14.13.0 |
:::

CommonJS モジュールは、任意の型にできる `module.exports` オブジェクトで構成されています。

これをサポートするために、ECMAScript モジュールから CommonJS をインポートするときに、CommonJS モジュールの名前空間ラッパーが構築されます。これは常に CommonJS の `module.exports` 値を指す `default` エクスポートキーを提供します。

さらに、CommonJS モジュールのソーステキストに対してヒューリスティックな静的解析が実行され、`module.exports` の値から名前空間で提供するエクスポートの可能な限り最適な静的リストを取得します。これは、これらの名前空間が CJS モジュールの評価の前に構築される必要があるため、必要です。

これらの CommonJS 名前空間オブジェクトは、`'module.exports'` 名前付きエクスポートとして `default` エクスポートも提供し、CommonJS での表現がこの値を使用し、名前空間の値を使用しないことを明確に示すために提供します。これは、[`require(esm)`](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require) 相互運用サポートにおける `'module.exports'` エクスポート名の処理のセマンティクスを反映しています。

CommonJS モジュールをインポートする場合、ES モジュールのデフォルトのインポートまたは対応する構文シュガーを使用して確実にインポートできます。

```js [ESM]
import { default as cjs } from 'cjs';
// 上記と同一
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// 出力:
//   <module.exports>
//   true
```
このモジュール名前空間エキゾチックオブジェクトは、`import * as m from 'cjs'` または動的なインポートを使用するときに直接観察できます。

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// 出力:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
JS エコシステムでの既存の使用法とのより良い互換性のために、Node.js はさらに、インポートされたすべての CommonJS モジュールの CommonJS 名前付きエクスポートを決定し、静的解析プロセスを使用して個別の ES モジュールエクスポートとして提供しようとします。

たとえば、次のように記述された CommonJS モジュールを考えてみます。

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
上記のモジュールは、ES モジュールで名前付きインポートをサポートします。

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// 出力: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// 出力: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// 出力:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
モジュール名前空間エキゾチックオブジェクトの最後の例からわかるように、`name` エクスポートは `module.exports` オブジェクトからコピーされ、モジュールがインポートされるときに ES モジュール名前空間に直接設定されます。

ライブバインディングの更新または `module.exports` に追加された新しいエクスポートは、これらの名前付きエクスポートに対して検出されません。

名前付きエクスポートの検出は、一般的な構文パターンに基づいていますが、名前付きエクスポートを常に正しく検出するとは限りません。このような場合、上記で説明したデフォルトのインポート形式を使用する方が良い場合があります。

名前付きエクスポートの検出は、多くの一般的なエクスポートパターン、再エクスポートパターン、およびビルドツールとトランスパイラーの出力をカバーしています。実装されている正確なセマンティクスについては、[cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) を参照してください。


### ESモジュールとCommonJSの違い {#differences-between-es-modules-and-commonjs}

#### `require`、`exports`、`module.exports` がない {#no-require-exports-or-moduleexports}

ほとんどの場合、ESモジュールの `import` を使用してCommonJSモジュールをロードできます。

必要な場合は、[`module.createRequire()`](/ja/nodejs/api/module#modulecreaterequirefilename) を使用してESモジュール内に `require` 関数を構築できます。

#### `__filename` または `__dirname` がない {#no-__filename-or-__dirname}

これらのCommonJS変数はESモジュールでは利用できません。

`__filename` と `__dirname` のユースケースは、[`import.meta.filename`](/ja/nodejs/api/esm#importmetafilename) と [`import.meta.dirname`](/ja/nodejs/api/esm#importmetadirname) で再現できます。

#### アドオンのロードなし {#no-addon-loading}

[アドオン](/ja/nodejs/api/addons) は現在、ESモジュールインポートではサポートされていません。

代わりに、[`module.createRequire()`](/ja/nodejs/api/module#modulecreaterequirefilename) または [`process.dlopen`](/ja/nodejs/api/process#processdlopenmodule-filename-flags) でロードできます。

#### `require.resolve` がない {#no-requireresolve}

相対的な解決は、`new URL('./local', import.meta.url)` を介して処理できます。

完全な `require.resolve` の代替として、[import.meta.resolve](/ja/nodejs/api/esm#importmetaresolvespecifier) APIがあります。

または、`module.createRequire()` を使用することもできます。

#### `NODE_PATH` がない {#no-node_path}

`NODE_PATH` は `import` 指定子の解決の一部ではありません。 この動作が必要な場合は、シンボリックリンクを使用してください。

#### `require.extensions` がない {#no-requireextensions}

`require.extensions` は `import` では使用されません。 モジュールのカスタマイズフックで代替を提供できます。

#### `require.cache` がない {#no-requirecache}

ESモジュールローダーには独自のキャッシュがあるため、`require.cache` は `import` では使用されません。

## JSONモジュール {#json-modules}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.1.0 | JSONモジュールは実験的ではなくなりました。 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

JSONファイルは `import` で参照できます。

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
`with { type: 'json' }` 構文は必須です。[インポート属性](/ja/nodejs/api/esm#import-attributes) を参照してください。

インポートされたJSONは `default` エクスポートのみを公開します。 名前付きエクスポートはサポートされていません。 重複を避けるために、CommonJSキャッシュにキャッシュエントリが作成されます。 JSONモジュールが同じパスからすでにインポートされている場合、同じオブジェクトがCommonJSで返されます。


## Wasm モジュール {#wasm-modules}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

WebAssembly モジュールのインポートは `--experimental-wasm-modules` フラグの下でサポートされており、任意の `.wasm` ファイルを通常のモジュールとしてインポートできるとともに、それらのモジュールのインポートもサポートしています。

この統合は、[WebAssembly の ES Module Integration Proposal](https://github.com/webassembly/esm-integration) に沿ったものです。

たとえば、`index.mjs` に以下が含まれているとします。

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
以下のように実行した場合：

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
`module.wasm` のインスタンス化のためのエクスポートインターフェースが提供されます。

## トップレベルの `await` {#top-level-await}

**Added in: v14.8.0**

`await` キーワードは、ECMAScript モジュールのトップレベルの本体で使用できます。

`a.mjs` に以下が含まれていると仮定します。

```js [ESM]
export const five = await Promise.resolve(5);
```
そして、`b.mjs` に以下が含まれていると仮定します。

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Logs `5`
```
```bash [BASH]
node b.mjs # works
```
トップレベルの `await` 式が解決されない場合、`node` プロセスは `13` の [ステータスコード](/ja/nodejs/api/process#exit-codes) で終了します。

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Never-resolving Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Logs `13`
});
```
## ローダー {#loaders}

以前のローダーのドキュメントは、[モジュール: カスタマイズフック](/ja/nodejs/api/module#customization-hooks) にあります。

## 解決と読み込みアルゴリズム {#resolution-and-loading-algorithm}

### 機能 {#features}

デフォルトの解決器には、次のプロパティがあります。

- ES モジュールで使用されている FileURL ベースの解決
- 相対 URL および絶対 URL の解決
- デフォルトの拡張子はありません
- フォルダのメインはありません
- node_modules を介したベア指定子のパッケージ解決ルックアップ
- 不明な拡張子またはプロトコルで失敗しません
- オプションで、読み込みフェーズにフォーマットのヒントを提供できます

デフォルトのローダーには、次のプロパティがあります。

- `node:` URL を介した組み込みモジュールの読み込みのサポート
- `data:` URL を介した「インライン」モジュールの読み込みのサポート
- `file:` モジュールの読み込みのサポート
- 他の URL プロトコルで失敗します
- `file:` の読み込みで不明な拡張子で失敗します（`.cjs`、`.js`、`.mjs` のみをサポート）


### 解決アルゴリズム {#resolution-algorithm}

ESモジュール指定子をロードするアルゴリズムは、以下の**ESM_RESOLVE**メソッドを通じて提供されます。これは、親URLを基準としたモジュール指定子の解決済みURLを返します。

解決アルゴリズムは、モジュールのロードのための完全な解決済みURLと、推奨されるモジュール形式を決定します。解決アルゴリズムは、解決済みURLのプロトコルがロード可能かどうか、またはファイル拡張子が許可されているかどうかを決定しません。代わりに、これらの検証はNode.jsがロード段階で適用します（たとえば、`file:`、`data:`、または`node:`ではないプロトコルを持つURLをロードするように要求された場合）。

このアルゴリズムは、拡張子に基づいてファイルの形式を判別しようともします（以下の`ESM_FILE_FORMAT`アルゴリズムを参照）。ファイル拡張子を認識しない場合（たとえば、`.mjs`、`.cjs`、または`.json`ではない場合）、`undefined`の形式が返され、ロード段階でエラーがスローされます。

解決済みURLのモジュール形式を決定するアルゴリズムは**ESM_FILE_FORMAT**によって提供され、これは任意のファイルの固有のモジュール形式を返します。*"module"*形式はECMAScriptモジュールに対して返され、*"commonjs"*形式は従来のCommonJSローダーを介したロードを示すために使用されます。*"addon"*のような追加の形式は、将来のアップデートで拡張できます。

以下のアルゴリズムでは、特に明記されていない限り、すべてのサブルーチンエラーはこれらのトップレベルルーチンのエラーとして伝播されます。

*defaultConditions*は、条件付き環境名配列`["node", "import"]`です。

リゾルバーは、次のエラーをスローする可能性があります。

- *Invalid Module Specifier*: モジュール指定子が、無効なURL、パッケージ名、またはパッケージサブパス指定子です。
- *Invalid Package Configuration*: package.jsonの構成が無効であるか、無効な構成が含まれています。
- *Invalid Package Target*: パッケージのエクスポートまたはインポートが、パッケージのターゲットモジュールを無効な型または文字列ターゲットとして定義しています。
- *Package Path Not Exported*: パッケージのエクスポートが、指定されたモジュールのパッケージ内のターゲットサブパスを定義または許可していません。
- *Package Import Not Defined*: パッケージのインポートが指定子を定義していません。
- *Module Not Found*: 要求されたパッケージまたはモジュールが存在しません。
- *Unsupported Directory Import*: 解決されたパスがディレクトリに対応しており、これはモジュールインポートでサポートされているターゲットではありません。


### 解決アルゴリズムの仕様 {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### ESM指定子解決アルゴリズムのカスタマイズ {#customizing-esm-specifier-resolution-algorithm}

[モジュールカスタマイズフック](/ja/nodejs/api/module#customization-hooks)は、ESM指定子解決アルゴリズムをカスタマイズするメカニズムを提供します。 ESM指定子にCommonJSスタイルの解決を提供する例として、[commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader)があります。

