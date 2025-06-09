---
title: Node.js ドキュメント - 国際化
description: Node.jsのこのドキュメントセクションでは、国際化（Intl）モジュールについて説明しています。このモジュールは、並べ替え、数値フォーマット、日付と時間のフォーマットなど、さまざまな国際化およびローカライズ機能へのアクセスを提供します。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 国際化 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのこのドキュメントセクションでは、国際化（Intl）モジュールについて説明しています。このモジュールは、並べ替え、数値フォーマット、日付と時間のフォーマットなど、さまざまな国際化およびローカライズ機能へのアクセスを提供します。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 国際化 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのこのドキュメントセクションでは、国際化（Intl）モジュールについて説明しています。このモジュールは、並べ替え、数値フォーマット、日付と時間のフォーマットなど、さまざまな国際化およびローカライズ機能へのアクセスを提供します。
---


# 国際化サポート {#internationalization-support}

Node.jsには、国際化されたプログラムをより簡単に記述するための多くの機能があります。そのうちのいくつかは次のとおりです。

- [ECMAScript Language Specification](https://tc39.github.io/ecma262/)のロケールに依存する関数またはUnicode対応の関数:
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- [ECMAScript Internationalization API Specification](https://tc39.github.io/ecma402/)（別名ECMA-402）で説明されているすべての機能:
    - [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)オブジェクト
    - [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)や[`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)のようなロケールに依存するメソッド


- [WHATWG URLパーサー](/ja/nodejs/api/url#the-whatwg-url-api)の[国際化ドメイン名](https://en.wikipedia.org/wiki/Internationalized_domain_name)（IDN）のサポート
- [`require('node:buffer').transcode()`](/ja/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- より正確な[REPL](/ja/nodejs/api/repl#repl)の行編集
- [`require('node:util').TextDecoder`](/ja/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Unicodeプロパティエスケープ](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.jsと基盤となるV8エンジンは、[International Components for Unicode（ICU）](http://site.icu-project.org/)を使用して、これらの機能をネイティブC/C++コードで実装します。完全なICUデータセットは、デフォルトでNode.jsによって提供されます。ただし、ICUデータファイルのサイズが大きいため、Node.jsのビルド時または実行時にICUデータセットをカスタマイズするためのいくつかのオプションが提供されています。


## Node.js のビルドオプション {#options-for-building-nodejs}

Node.js での ICU の使用方法を制御するために、コンパイル時に 4 つの `configure` オプションを利用できます。Node.js のコンパイル方法の詳細については、[BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md) を参照してください。

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (デフォルト)

各 `configure` オプションで利用可能な Node.js および JavaScript 機能の概要:

| 機能 | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | なし (関数は no-op) | フル | フル | フル |
| `String.prototype.to*Case()` | フル | フル | フル | フル |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | なし (オブジェクトが存在しない) | 部分的/フル (OS に依存) | 部分的 (英語のみ) | フル |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | 部分的 (ロケールを認識しない) | フル | フル | フル |
| `String.prototype.toLocale*Case()` | 部分的 (ロケールを認識しない) | フル | フル | フル |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | 部分的 (ロケールを認識しない) | 部分的/フル (OS に依存) | 部分的 (英語のみ) | フル |
| `Date.prototype.toLocale*String()` | 部分的 (ロケールを認識しない) | 部分的/フル (OS に依存) | 部分的 (英語のみ) | フル |
| [レガシー URL パーサー](/ja/nodejs/api/url#legacy-url-api) | 部分的 (IDN サポートなし) | フル | フル | フル |
| [WHATWG URL パーサー](/ja/nodejs/api/url#the-whatwg-url-api) | 部分的 (IDN サポートなし) | フル | フル | フル |
| [`require('node:buffer').transcode()`](/ja/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | なし (関数が存在しない) | フル | フル | フル |
| [REPL](/ja/nodejs/api/repl#repl) | 部分的 (不正確な行編集) | フル | フル | フル |
| [`require('node:util').TextDecoder`](/ja/nodejs/api/util#class-utiltextdecoder) | 部分的 (基本的なエンコーディングをサポート) | 部分的/フル (OS に依存) | 部分的 (Unicode のみ) | フル |
| [`RegExp` Unicode プロパティエスケープ](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | なし (無効な `RegExp` エラー) | フル | フル | フル |

"(ロケールを認識しない)" という指定は、関数が、もし存在すれば、その関数の `Locale` が付かないバージョンとまったく同じように動作を実行することを示します。たとえば、`none` モードでは、`Date.prototype.toLocaleString()` の操作は `Date.prototype.toString()` の操作と同一です。


### すべての国際化機能を無効にする (`none`) {#disable-all-internationalization-features-none}

このオプションを選択すると、ICUが無効になり、上記の国際化機能のほとんどが、結果として得られる `node` バイナリで **利用できなくなり** ます。

### プリインストールされたICUでビルドする (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.jsは、システムに既にインストールされているICUビルドにリンクできます。実際、ほとんどのLinuxディストリビューションにはICUが既にインストールされており、このオプションを使用すると、OS内の他のコンポーネントで使用されているものと同じデータセットを再利用できます。

[`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) や [WHATWG URLパーサー](/ja/nodejs/api/url#the-whatwg-url-api) など、ICUライブラリ自体のみを必要とする機能は、`system-icu` で完全にサポートされます。[`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) のように、ICUロケールデータをさらに必要とする機能は、システムのICUデータの完全性に応じて、完全にまたは部分的にサポートされる *可能性があり* ます。

### ICUデータの限定されたセットを埋め込む (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

このオプションを選択すると、結果として得られるバイナリはICUライブラリに静的にリンクされ、ICUデータのサブセット（通常は英語ロケールのみ）が `node` 実行可能ファイルに組み込まれます。

[`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) や [WHATWG URLパーサー](/ja/nodejs/api/url#the-whatwg-url-api) など、ICUライブラリ自体のみを必要とする機能は、`small-icu` で完全にサポートされます。[`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) のように、ICUロケールデータをさらに必要とする機能は、一般に英語ロケールでのみ機能します。

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// small-icu では、ユーザーのデフォルトロケールに応じて、"M01" または "January" と表示されます。
// "enero" と表示されるはずです。
```
このモードは、機能とバイナリサイズのバランスを提供します。


#### ランタイムでの ICU データの提供 {#providing-icu-data-at-runtime}

`small-icu` オプションが使用されている場合でも、追加のロケールデータをランタイムに提供して、JS メソッドがすべての ICU ロケールで動作するようにすることができます。データファイルが `/runtime/directory/with/dat/file` に保存されていると仮定すると、次のいずれかの方法で ICU で利用できるようにすることができます。

- `--with-icu-default-data-dir` configure オプション: これはデフォルトのデータディレクトリパスのみをバイナリに埋め込みます。実際のデータファイルは、このディレクトリパスからランタイムにロードされます。
- [`NODE_ICU_DATA`](/ja/nodejs/api/cli#node_icu_datafile) 環境変数:
- [`--icu-data-dir`](/ja/nodejs/api/cli#--icu-data-dirfile) CLI パラメータ:

複数のものが指定されている場合、`--icu-data-dir` CLI パラメータが最も優先度が高く、次に `NODE_ICU_DATA` 環境変数、そして `--with-icu-default-data-dir` configure オプションとなります。

ICU は、さまざまなデータ形式を自動的に検索してロードできますが、データは ICU のバージョンに適しており、ファイル名が正しく名付けられている必要があります。データファイルの最も一般的な名前は `icudtX[bl].dat` で、`X` は対象の ICU バージョンを示し、`b` または `l` はシステムのエンディアンを示します。期待されるデータファイルを指定されたディレクトリから読み取れない場合、Node.js はロードに失敗します。現在の Node.js バージョンに対応するデータファイルの名前は、次のように計算できます。

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```

ICU でサポートされているその他の形式や、ICU データ全般の詳細については、ICU ユーザーガイドの ["ICU Data"](http://userguide.icu-project.org/icudata) の記事を参照してください。

[full-icu](https://www.npmjs.com/package/full-icu) npm モジュールを使用すると、実行中の `node` 実行可能ファイルの ICU バージョンを検出し、適切なデータファイルをダウンロードすることで、ICU データのインストールを大幅に簡素化できます。`npm i full-icu` でモジュールをインストールした後、データファイルは `./node_modules/full-icu` で利用できるようになります。このパスは、上記の `NODE_ICU_DATA` または `--icu-data-dir` のいずれかに渡して、完全な `Intl` サポートを有効にすることができます。


### ICU全体を埋め込む (`full-icu`) {#embed-the-entire-icu-full-icu}

このオプションを指定すると、結果のバイナリは ICU に静的にリンクされ、ICU データ一式が含まれます。このようにして作成されたバイナリには、それ以上の外部依存関係はなく、すべてのロケールをサポートしますが、かなり大きくなる可能性があります。 `--with-intl` フラグが渡されなかった場合、これがデフォルトの動作です。公式バイナリもこのモードでビルドされています。

## 国際化サポートの検出 {#detecting-internationalization-support}

ICU が有効になっているかどうか (`system-icu`、`small-icu`、または `full-icu`) を確認するには、`Intl` の存在を確認するだけで十分です。

```js [ESM]
const hasICU = typeof Intl === 'object';
```
または、ICU が有効な場合にのみ定義されるプロパティ `process.versions.icu` を確認することもできます。

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
英語以外のロケール（つまり、`full-icu` または `system-icu`）のサポートを確認するには、[`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) が優れた識別要素になります。

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
`Intl` サポートに関するより詳細なテストについては、次のリソースが役立つ場合があります。

- [btest402](https://github.com/srl295/btest402): 一般に、`Intl` サポート付きの Node.js が正しくビルドされているかどうかを確認するために使用されます。
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): ECMAScript の公式準拠テストスイートには、ECMA-402 に特化したセクションが含まれています。

