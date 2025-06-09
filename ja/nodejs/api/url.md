---
title: URLモジュール - Node.js ドキュメント
description: Node.jsのURLモジュールは、URLの解決と解析のためのユーティリティを提供します。WHATWG URL標準と従来のurlObject APIをサポートし、両方の形式でURLを操作するためのメソッドを提供します。
head:
  - - meta
    - name: og:title
      content: URLモジュール - Node.js ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのURLモジュールは、URLの解決と解析のためのユーティリティを提供します。WHATWG URL標準と従来のurlObject APIをサポートし、両方の形式でURLを操作するためのメソッドを提供します。
  - - meta
    - name: twitter:title
      content: URLモジュール - Node.js ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのURLモジュールは、URLの解決と解析のためのユーティリティを提供します。WHATWG URL標準と従来のurlObject APIをサポートし、両方の形式でURLを操作するためのメソッドを提供します。
---


# URL {#url}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

`node:url` モジュールは、URLの解決と解析のためのユーティリティを提供します。 これは以下を使用してアクセスできます。

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## URL 文字列と URL オブジェクト {#url-strings-and-url-objects}

URL 文字列は、複数の意味のあるコンポーネントを含む構造化された文字列です。 解析されると、これらの各コンポーネントのプロパティを含む URL オブジェクトが返されます。

`node:url` モジュールは、URLを扱うための2つのAPIを提供します。1つはNode.js固有のレガシーAPIで、もう1つはWebブラウザで使用されているものと同じ[WHATWG URL Standard](https://url.spec.whatwg.org/)を実装する新しいAPIです。

WHATWG APIとレガシーAPIの比較を以下に示します。 URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` の上で、レガシー `url.parse()` によって返されるオブジェクトのプロパティが表示されています。 その下には、WHATWG `URL` オブジェクトのプロパティがあります。

WHATWG URLの `origin` プロパティには `protocol` と `host` が含まれますが、 `username` や `password` は含まれません。

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(「""」行のスペースはすべて無視してください。 これらは純粋にフォーマット用です。)
```
WHATWG APIを使用してURL文字列を解析します。

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
レガシーAPIを使用してURL文字列を解析します。

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### コンポーネントパーツからURLを構築し、構築された文字列を取得する {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

プロパティセッターまたはテンプレートリテラル文字列を使用して、コンポーネントパーツからWHATWG URLを構築できます。

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
構築されたURL文字列を取得するには、`href`プロパティアクセサーを使用します。

```js [ESM]
console.log(myURL.href);
```
## WHATWG URL API {#the-whatwg-url-api}

### クラス: `URL` {#class-url}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | クラスがグローバルオブジェクトで利用可能になりました。 |
| v7.0.0, v6.13.0 | 追加: v7.0.0, v6.13.0 |
:::

WHATWG URL標準に従って実装された、ブラウザ互換の `URL` クラス。[解析されたURLの例](https://url.spec.whatwg.org/#example-url-parsing)は、標準自体にあります。`URL` クラスはグローバルオブジェクトでも利用できます。

ブラウザの慣例に従い、`URL` オブジェクトのすべてのプロパティは、オブジェクト自体のデータプロパティとしてではなく、クラスプロトタイプのゲッターとセッターとして実装されます。したがって、[従来の `urlObject`](/ja/nodejs/api/url#legacy-urlobject)とは異なり、`URL` オブジェクトのプロパティ（例：`delete myURL.protocol`、`delete myURL.pathname`など）で `delete` キーワードを使用しても効果はありませんが、`true`が返されます。

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0, v18.17.0 | ICUの要件が削除されました。 |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析する絶対または相対入力URL。`input`が相対的な場合、`base`が必要です。`input`が絶対的な場合、`base`は無視されます。`input`が文字列でない場合は、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input`が絶対的でない場合に、解決する基準となるベースURL。`base`が文字列でない場合は、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。

`base`を基準にして`input`を解析することにより、新しい`URL`オブジェクトを作成します。`base`が文字列として渡された場合、`new URL(base)`と同等に解析されます。

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
URLコンストラクターは、グローバルオブジェクトのプロパティとしてアクセスできます。組み込みのurlモジュールからインポートすることもできます。



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // 'true'を出力します。
```

```js [CJS]
console.log(URL === require('node:url').URL); // 'true'を出力します。
```
:::

`input`または`base`が有効なURLでない場合、`TypeError`がスローされます。与えられた値を強制的に文字列に変換しようとすることに注意してください。たとえば：

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
`input`のホスト名に現れるUnicode文字は、[Punycode](https://tools.ietf.org/html/rfc5891#section-4.4)アルゴリズムを使用して自動的にASCIIに変換されます。

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
`input`が絶対URLであるかどうかがあらかじめわからず、`base`が提供されている場合は、`URL`オブジェクトの`origin`が予期されるものであることを検証することをお勧めします。

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のフラグメント部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz
```
`hash` プロパティに割り当てられた値に含まれる無効な URL 文字は、[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls)されます。どの文字をパーセントエンコードするかという選択は、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) および [`url.format()`](/ja/nodejs/api/url#urlformaturlobject) メソッドが生成するものとは多少異なる場合があります。

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のホスト部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Prints example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Prints https://example.com:82/foo
```
`host` プロパティに割り当てられた無効なホスト値は無視されます。

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のホスト名部分を取得および設定します。`url.host` と `url.hostname` の主な違いは、`url.hostname` にはポートが含まれて*いない*ことです。

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Prints example.org

// ホスト名を設定してもポートは変わりません
myURL.hostname = 'example.com';
console.log(myURL.href);
// Prints https://example.com:81/foo

// ホスト名とポートを変更するには、myURL.host を使用します
myURL.host = 'example.org:82';
console.log(myURL.href);
// Prints https://example.org:82/foo
```
`hostname` プロパティに割り当てられた無効なホスト名は無視されます。

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

シリアライズされた URL を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Prints https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Prints https://example.com/bar
```
`href` プロパティの値を取得することは、[`url.toString()`](/ja/nodejs/api/url#urltostring) を呼び出すことと同じです。

このプロパティに新しい値を設定することは、[`new URL(value)`](/ja/nodejs/api/url#new-urlinput-base) を使用して新しい `URL` オブジェクトを作成することと同じです。`URL` オブジェクトの各プロパティが変更されます。

`href` プロパティに割り当てられた値が有効な URL でない場合、`TypeError` がスローされます。


#### `url.origin` {#urlorigin}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | スキーム "gopher" はもはや特別ではなくなり、`url.origin` はそれに対して `'null'` を返すようになりました。 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URLのオリジンを読み取り専用でシリアライズしたものを取得します。

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Prints https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Prints https://xn--g6w251d

console.log(idnURL.hostname);
// Prints xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URLのパスワード部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Prints xyz

myURL.password = '123';
console.log(myURL.href);
// Prints https://abc:/
```
`password` プロパティに割り当てられた値に含まれる無効な URL 文字は、[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls)されます。 どの文字をパーセントエンコードするかは、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) および [`url.format()`](/ja/nodejs/api/url#urlformaturlobject) メソッドが生成するものとは多少異なる場合があります。

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URLのパス部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Prints /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Prints https://example.org/abcdef?123
```
`pathname` プロパティに割り当てられた値に含まれる無効な URL 文字は、[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls)されます。 どの文字をパーセントエンコードするかは、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) および [`url.format()`](/ja/nodejs/api/url#urlformaturlobject) メソッドが生成するものとは多少異なる場合があります。


#### `url.port` {#urlport}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | スキーム "gopher" は特別なものではなくなりました。 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URLのポート部分を取得および設定します。

port の値は、`0` から `65535` までの範囲（両端を含む）の数値または数値を含む文字列にできます。 `URL` オブジェクトの与えられた `protocol` のデフォルトポートに値を設定すると、`port` の値は空文字列 (`''`) になります。

port の値は空文字列にすることができ、その場合、ポートはプロトコル/スキームに依存します。

| プロトコル | ポート |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
ポートに値を割り当てると、最初に `.toString()` を使用して文字列に変換されます。

その文字列が無効でも数値で始まる場合、先頭の数値が `port` に割り当てられます。 数値が上記の範囲外にある場合は無視されます。

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Prints 8888

// デフォルトポートは自動的に空文字列に変換されます
// (HTTPS プロトコルのデフォルトポートは 443 です)
myURL.port = '443';
console.log(myURL.port);
// 空文字列が出力されます
console.log(myURL.href);
// https://example.org/ が出力されます

myURL.port = 1234;
console.log(myURL.port);
// 1234 が出力されます
console.log(myURL.href);
// https://example.org:1234/ が出力されます

// 完全に無効なポート文字列は無視されます
myURL.port = 'abcd';
console.log(myURL.port);
// 1234 が出力されます

// 先頭の数値はポート番号として扱われます
myURL.port = '5678abcd';
console.log(myURL.port);
// 5678 が出力されます

// 整数以外は切り捨てられます
myURL.port = 1234.5678;
console.log(myURL.port);
// 1234 が出力されます

// 科学的な記法で表現されていない範囲外の数値は、
// 無視されます。
myURL.port = 1e10; // 10000000000, 後述のように範囲が確認されます
console.log(myURL.port);
// 1234 が出力されます
```
浮動小数点数や科学的な記法で表現された数値など、小数点を含む数値もこの規則の例外ではありません。 小数点までの先頭の数値は、有効であると仮定して URL のポートとして設定されます。

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// 4 (文字列 '4.567e21' の先頭の数値であるため) が出力されます
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のプロトコル部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Prints https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Prints ftp://example.org/
```
`protocol` プロパティに割り当てられた無効な URL プロトコルの値は無視されます。

##### 特殊なスキーム {#special-schemes}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | スキーム "gopher" はもはや特殊ではありません。 |
:::

[WHATWG URL Standard](https://url.spec.whatwg.org/) では、いくつかの URL プロトコルスキームが、解析およびシリアライズの方法に関して *特殊* であると見なされています。これらの特殊なプロトコルのいずれかを使用して URL が解析される場合、`url.protocol` プロパティは別の特殊なプロトコルに変更できますが、特殊でないプロトコルに変更することはできず、その逆も同様です。

たとえば、`http` から `https` への変更は可能です。

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
ただし、`http` から仮想の `fish` プロトコルへの変更は、新しいプロトコルが特殊ではないため、できません。

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
同様に、特殊でないプロトコルから特殊なプロトコルへの変更も許可されていません。

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
WHATWG URL Standard によると、特殊なプロトコルスキームは `ftp`、`file`、`http`、`https`、`ws`、および `wss` です。

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のシリアライズされたクエリ部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Prints ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Prints https://example.org/abc?abc=xyz
```
`search` プロパティに割り当てられた値に無効な URL 文字が含まれている場合、[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls) されます。パーセントエンコードする文字の選択は、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) および [`url.format()`](/ja/nodejs/api/url#urlformaturlobject) メソッドが生成するものとは多少異なる場合があります。


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/ja/nodejs/api/url#class-urlsearchparams)

URLのクエリパラメータを表す [`URLSearchParams`](/ja/nodejs/api/url#class-urlsearchparams) オブジェクトを取得します。このプロパティは読み取り専用ですが、提供される `URLSearchParams` オブジェクトを使用して URL インスタンスを変化させることができます。URL のクエリパラメータ全体を置き換えるには、[`url.search`](/ja/nodejs/api/url#urlsearch) セッターを使用します。詳細については、[`URLSearchParams`](/ja/nodejs/api/url#class-urlsearchparams) のドキュメントを参照してください。

`.searchParams` を使用して `URL` を変更する場合は注意が必要です。WHATWG 仕様に従い、`URLSearchParams` オブジェクトは、どの文字をパーセントエンコードするかを判断するために異なるルールを使用するためです。たとえば、`URL` オブジェクトは ASCII チルダ（`~`）文字をパーセントエンコードしませんが、`URLSearchParams` は常にエンコードします。

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // prints ?foo=~bar

// Modify the URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // prints ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL のユーザー名部分を取得および設定します。

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Prints abc

myURL.username = '123';
console.log(myURL.href);
// Prints https://123:/
```
`username` プロパティに割り当てられた値に無効な URL 文字が含まれている場合、[パーセントエンコード](/ja/nodejs/api/url#percent-encoding-in-urls)されます。パーセントエンコードする文字の選択は、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) メソッドと [`url.format()`](/ja/nodejs/api/url#urlformaturlobject) メソッドが生成するものとは多少異なる場合があります。

#### `url.toString()` {#urltostring}

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` オブジェクトの `toString()` メソッドは、シリアライズされた URL を返します。返される値は、[`url.href`](/ja/nodejs/api/url#urlhref) および [`url.toJSON()`](/ja/nodejs/api/url#urltojson) の値と同等です。


#### `url.toJSON()` {#urltojson}

**Added in: v7.7.0, v6.13.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` オブジェクトの `toJSON()` メソッドは、シリアライズされた URL を返します。 返される値は、[`url.href`](/ja/nodejs/api/url#urlhref) と [`url.toString()`](/ja/nodejs/api/url#urltostring) の値と同等です。

このメソッドは、[`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) で `URL` オブジェクトがシリアライズされるときに自動的に呼び出されます。

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Added in: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `blob` [\<Blob\>](/ja/nodejs/api/buffer#class-blob)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

与えられた [\<Blob\>](/ja/nodejs/api/buffer#class-blob) オブジェクトを表す `'blob:nodedata:...'` URL 文字列を作成し、後で `Blob` を取得するために使用できます。

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
登録された [\<Blob\>](/ja/nodejs/api/buffer#class-blob) によって格納されたデータは、それを削除するために `URL.revokeObjectURL()` が呼び出されるまで、メモリに保持されます。

`Blob` オブジェクトは現在のスレッドに登録されます。 Worker Threads を使用している場合、ある Worker 内に登録された `Blob` オブジェクトは、他のワーカーまたはメインスレッドでは使用できません。

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Added in: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `URL.createObjectURL()` の以前の呼び出しによって返された `'blob:nodedata:...` URL 文字列。

指定された ID によって識別される格納された [\<Blob\>](/ja/nodejs/api/buffer#class-blob) を削除します。 登録されていない ID を取り消そうとすると、エラーは発生しません。


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**追加: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析する絶対または相対入力URL。 `input` が相対的な場合、`base` が必須です。 `input` が絶対的な場合、`base` は無視されます。 `input` が文字列でない場合、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input` が絶対的でない場合に解決するためのベースURL。 `base` が文字列でない場合、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`base` を基準とした `input` を `URL` に解析できるかどうかを確認します。

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**追加: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析する絶対または相対入力URL。 `input` が相対的な場合、`base` が必須です。 `input` が絶対的な場合、`base` は無視されます。 `input` が文字列でない場合、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input` が絶対的でない場合に解決するためのベースURL。 `base` が文字列でない場合、最初に[文字列に変換](https://tc39.es/ecma262/#sec-tostring)されます。
- 戻り値: [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

文字列をURLとして解析します。 `base` が指定されている場合、非絶対 `input` URLを解決する目的で、ベースURLとして使用されます。 `input` が有効でない場合は `null` を返します。


### クラス: `URLSearchParams` {#class-urlsearchparams}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | このクラスはグローバルオブジェクトで利用可能になりました。 |
| v7.5.0, v6.13.0 | 追加: v7.5.0, v6.13.0 |
:::

`URLSearchParams` APIは、`URL`のクエリへの読み書きアクセスを提供します。`URLSearchParams`クラスは、以下の4つのコンストラクタのいずれかを使用してスタンドアロンでも使用できます。`URLSearchParams`クラスはグローバルオブジェクトでも利用可能です。

WHATWG `URLSearchParams`インターフェースと[`querystring`](/ja/nodejs/api/querystring)モジュールは同様の目的を持っていますが、[`querystring`](/ja/nodejs/api/querystring)モジュールの目的はより一般的であり、区切り文字（`&`と`=`）のカスタマイズを可能にします。一方、このAPIはURLクエリ文字列専用に設計されています。

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// 123と出力

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// https://example.org/?abc=123&abc=xyzと出力

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// https://example.org/?a=bと出力

const newSearchParams = new URLSearchParams(myURL.searchParams);
// 上記は以下と同等です
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// https://example.org/?a=bと出力
console.log(newSearchParams.toString());
// a=b&a=cと出力

// newSearchParams.toString() は暗黙的に呼び出されます
myURL.search = newSearchParams;
console.log(myURL.href);
// https://example.org/?a=b&a=cと出力
newSearchParams.delete('a');
console.log(myURL.href);
// https://example.org/?a=b&a=cと出力
```
#### `new URLSearchParams()` {#new-urlsearchparams}

新しい空の`URLSearchParams`オブジェクトをインスタンス化します。

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クエリ文字列

`string`をクエリ文字列として解析し、それを使用して新しい`URLSearchParams`オブジェクトをインスタンス化します。先頭の`'?'`が存在する場合、無視されます。

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// 'abc'と出力
console.log(params.toString());
// 'user=abc&query=xyz'と出力

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// 'user=abc&query=xyz'と出力
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**追加:** v7.10.0, v6.13.0

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) キーと値のペアのコレクションを表すオブジェクト

クエリハッシュマップを使用して新しい `URLSearchParams` オブジェクトをインスタンス化します。`obj` の各プロパティのキーと値は、常に文字列に強制変換されます。

[`querystring`](/ja/nodejs/api/querystring) モジュールとは異なり、配列値の形式での重複キーは許可されていません。配列は [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString) を使用して文字列化されます。これは、単にすべての配列要素をカンマで結合するだけです。

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Prints [ 'first,second' ]
console.log(params.toString());
// Prints 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**追加:** v7.10.0, v6.13.0

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 要素がキーと値のペアであるイテラブルオブジェクト

[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) のコンストラクタと同様の方法で、イテラブルマップを使用して新しい `URLSearchParams` オブジェクトをインスタンス化します。`iterable` は `Array` または任意のイテラブルオブジェクトにすることができます。つまり、`iterable` は別の `URLSearchParams` にすることができます。その場合、コンストラクタは提供された `URLSearchParams` のクローンを作成するだけです。`iterable` の要素はキーと値のペアであり、それ自体が任意のイテラブルオブジェクトにすることができます。

重複キーは許可されています。

```js [ESM]
let params;

// 配列を使用する場合
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Mapオブジェクトを使用する場合
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Prints 'user=abc&query=xyz'

// ジェネレーター関数を使用する場合
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// 各キーと値のペアは、正確に2つの要素を持つ必要があります
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Throws TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

新しい名前と値のペアをクエリ文字列に追加します。

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.2.0, v18.18.0 | オプションの `value` 引数のサポートを追加。 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`value` が提供されている場合、name が `name` で値が `value` であるすべての名前と値のペアを削除します。

`value` が提供されていない場合、名前が `name` であるすべての名前と値のペアを削除します。

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

クエリ内の名前と値のペアごとに ES6 `Iterator` を返します。Iterator の各アイテムは JavaScript `Array` です。`Array` の最初のアイテムは `name` で、2 番目のアイテムは `value` です。

[`urlSearchParams[@@iterator]()`](/ja/nodejs/api/url#urlsearchparamssymboliterator) のエイリアス。

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `fn` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) クエリ内の名前と値のペアごとに呼び出されます
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `fn` が呼び出されるときに `this` 値として使用されます

クエリ内の名前と値の各ペアを反復処理し、指定された関数を呼び出します。

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 指定された `name` を持つ名前と値のペアがない場合は、文字列または `null` を返します。

名前が `name` である最初の名前と値のペアの値を返します。そのようなペアがない場合は、`null` が返されます。

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

名前が `name` であるすべての名前と値のペアの値を返します。そのようなペアがない場合は、空の配列が返されます。

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.2.0, v18.18.0 | オプションの `value` 引数のサポートを追加しました。 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`URLSearchParams` オブジェクトが、`name` およびオプションの `value` 引数に基づいてキーと値のペアを含むかどうかを確認します。

`value` が指定されている場合、同じ `name` と `value` を持つ名前と値のペアが存在する場合は `true` を返します。

`value` が指定されていない場合、名前が `name` である名前と値のペアが少なくとも 1 つ存在する場合は `true` を返します。

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

各名前と値のペアの名前に対して ES6 `Iterator` を返します。

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// 出力:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name` に関連付けられた `URLSearchParams` オブジェクトの値を `value` に設定します。 `name` という名前の既存の名前と値のペアがある場合は、最初のペアの値を `value` に設定し、その他はすべて削除します。 そうでない場合は、名前と値のペアをクエリ文字列に追加します。

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**追加: v19.8.0, v18.16.0**

パラメータエントリの総数。

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**追加: v7.7.0, v6.13.0**

既存のすべての名前と値のペアを名前でインプレースでソートします。 ソートは [安定ソートアルゴリズム](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability) で行われるため、同じ名前を持つ名前と値のペア間の相対的な順序は保持されます。

このメソッドは、特にキャッシュヒットを増やすために使用できます。

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

検索パラメータを文字列としてシリアライズして返します。必要な場合は文字がパーセントエンコードされます。

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

各名前と値のペアの値に対する ES6 `Iterator` を返します。


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

クエリ文字列内の名前と値のペアのそれぞれに対する ES6 `Iterator` を返します。イテレーターの各アイテムは JavaScript の `Array` です。`Array` の最初のアイテムは `name` で、2 番目のアイテムは `value` です。

[`urlSearchParams.entries()`](/ja/nodejs/api/url#urlsearchparamsentries) のエイリアスです。

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0, v18.17.0 | ICUの要件が削除されました。 |
| v7.4.0, v6.13.0 | 追加: v7.4.0, v6.13.0 |
:::

- `domain` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`domain` の [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) ASCII シリアライゼーションを返します。`domain` が無効なドメインの場合、空の文字列が返されます。

[`url.domainToUnicode()`](/ja/nodejs/api/url#urldomaintounicodedomain) の逆の操作を実行します。



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0, v18.17.0 | ICUの要件が削除されました。 |
| v7.4.0, v6.13.0 | 追加: v7.4.0, v6.13.0 |
:::

- `domain` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`domain` の Unicode シリアライゼーションを返します。`domain` が無効なドメインの場合、空の文字列が返されます。

[`url.domainToASCII()`](/ja/nodejs/api/url#urldomaintoasciidomain) の逆の操作を実行します。



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.1.0, v20.13.0 | `options` 引数を使用して、`path` 引数をどのように解析するかを決定できるようになりました。 |
| v10.12.0 | 追加: v10.12.0 |
:::

- `url` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パスに変換するファイル URL 文字列または URL オブジェクト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `path` が Windows ファイルパスとして返される場合は `true`、posix の場合は `false`、システムのデフォルトの場合は `undefined`。 **デフォルト:** `undefined`。


- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 完全に解決されたプラットフォーム固有の Node.js ファイルパス。

この関数は、パーセントエンコードされた文字の正しいデコードと、クロスプラットフォームで有効な絶対パス文字列を保証します。

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // 不正: /C:/path/
fileURLToPath('file:///C:/path/');         // 正:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 不正: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 正:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 不正: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 正:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 不正: /hello%20world
fileURLToPath('file:///hello world');      // 正:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // 不正: /C:/path/
fileURLToPath('file:///C:/path/');         // 正:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 不正: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 正:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 不正: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 正:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 不正: /hello%20world
fileURLToPath('file:///hello world');      // 正:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Added in: v7.6.0**

- `URL` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) [WHATWG URL](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクト
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シリアライズされた URL 文字列にユーザー名とパスワードを含める場合は `true`、それ以外の場合は `false`。**デフォルト:** `true`。
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シリアライズされた URL 文字列にフラグメントを含める場合は `true`、それ以外の場合は `false`。**デフォルト:** `true`。
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シリアライズされた URL 文字列に検索クエリを含める場合は `true`、それ以外の場合は `false`。**デフォルト:** `true`。
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) URL 文字列のホストコンポーネントに表示される Unicode 文字を、Punycode でエンコードするのではなく、直接エンコードする場合は `true`。**デフォルト:** `false`。
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[WHATWG URL](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクトの URL `String` 表現のカスタマイズ可能なシリアライゼーションを返します。

URL オブジェクトには、URL の文字列シリアライゼーションを返す `toString()` メソッドと `href` プロパティの両方があります。ただし、これらはどのような方法でもカスタマイズできません。`url.format(URL[, options])` メソッドを使用すると、出力の基本的なカスタマイズが可能になります。



::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.1.0, v20.13.0 | `options` 引数を使用して、`path` 値の返し方を決定できるようになりました。 |
| v10.12.0 | Added in: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) File URL に変換するパス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `path` を Windows ファイルパスとして扱う場合は `true`、POSIX の場合は `false`、システムのデフォルトの場合は `undefined`。**Default:** `undefined`。
  
 
- 戻り値: [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) ファイル URL オブジェクト。

この関数は、`path` が絶対パスとして解決されること、および URL 制御文字が File URL に変換される際に正しくエンコードされることを保証します。

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // 間違い: file:///foo#1
pathToFileURL('/foo#1');              // 正しい:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 間違い: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 正しい:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // 間違い: throws (POSIX)
new URL(__filename);                  // 間違い: C:\... (Windows)
pathToFileURL(__filename);            // 正しい:   file:///... (POSIX)
pathToFileURL(__filename);            // 正しい:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // 間違い: file:///foo#1
pathToFileURL('/foo#1');              // 正しい:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 間違い: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 正しい:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.9.0, v18.17.0 | 返されるオブジェクトは、`url` 引数の列挙可能なすべての独自プロパティも含むようになります。 |
| v15.7.0, v14.18.0 | 追加: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) オプションオブジェクトに変換する [WHATWG URL](/ja/nodejs/api/url#the-whatwg-url-api) オブジェクト。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) オプションオブジェクト
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するプロトコル。
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストを発行するサーバーのドメイン名または IP アドレス。
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL のフラグメント部分。
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL のシリアライズされたクエリ部分。
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL のパス部分。
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストパス。 クエリストリングがある場合はそれを含める必要があります。 例: `'/index.html?page=12'`。 リクエストパスに不正な文字が含まれている場合、例外がスローされます。 現在、スペースのみが拒否されますが、将来変更される可能性があります。
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) シリアライズされた URL。
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リモートサーバーのポート。
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Basic 認証。Authorization ヘッダーを計算するための `'user:password'` など。

このユーティリティ関数は、URL オブジェクトを、[`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback) および [`https.request()`](/ja/nodejs/api/https#httpsrequestoptions-callback) API で想定される通常のオプションオブジェクトに変換します。

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## レガシー URL API {#legacy-url-api}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.13.0, v14.17.0 | 非推奨を撤回。ステータスを "レガシー" に変更。 |
| v11.0.0 | この API は非推奨です。 |
:::

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定版: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに WHATWG URL API を使用してください。
:::

### レガシー `urlObject` {#legacy-urlobject}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.13.0, v14.17.0 | 非推奨を撤回。ステータスを "レガシー" に変更。 |
| v11.0.0 | レガシー URL API は非推奨です。WHATWG URL API を使用してください。 |
:::

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定版: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに WHATWG URL API を使用してください。
:::

レガシー `urlObject` (`require('node:url').Url` または `import { Url } from 'node:url'`) は、`url.parse()` 関数によって作成され、返されます。

#### `urlObject.auth` {#urlobjectauth}

`auth` プロパティは、URL のユーザー名とパスワードの部分であり、*ユーザー情報*とも呼ばれます。この文字列のサブセットは、`protocol` と二重スラッシュ (存在する場合) の後に続き、`host` コンポーネントの前に `@` で区切られます。文字列はユーザー名であるか、コロン `:` で区切られたユーザー名とパスワードです。

例: `'user:pass'`

#### `urlObject.hash` {#urlobjecthash}

`hash` プロパティは、先頭の `#` 文字を含む URL のフラグメント識別子部分です。

例: `'#hash'`

#### `urlObject.host` {#urlobjecthost}

`host` プロパティは、URL の完全な小文字のホスト部分であり、`port` が指定されている場合はそれを含みます。

例: `'sub.example.com:8080'`

#### `urlObject.hostname` {#urlobjecthostname}

`hostname` プロパティは、`host` コンポーネントの小文字のホスト名部分であり、`port` は*含まれません*。

例: `'sub.example.com'`

#### `urlObject.href` {#urlobjecthref}

`href` プロパティは、`protocol` と `host` コンポーネントの両方が小文字に変換された、解析された完全な URL 文字列です。

例: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`


#### `urlObject.path` {#urlobjectpath}

`path` プロパティは、`pathname` と `search` のコンポーネントを連結したものです。

例：`'/p/a/t/h?query=string'`。

`path` のデコードは行われません。

#### `urlObject.pathname` {#urlobjectpathname}

`pathname` プロパティは、URL のパスセクション全体で構成されます。 これは、`host` ( `port` を含む) の後から `query` または `hash` コンポーネントの開始前までのすべてで、ASCII 疑問符 ( `?` ) またはハッシュ ( `#` ) 文字のいずれかで区切られます。

例：`'/p/a/t/h'`。

パス文字列のデコードは行われません。

#### `urlObject.port` {#urlobjectport}

`port` プロパティは、`host` コンポーネントの数値ポート部分です。

例：`'8080'`。

#### `urlObject.protocol` {#urlobjectprotocol}

`protocol` プロパティは、URL の小文字のプロトコルスキームを識別します。

例：`'http:'`。

#### `urlObject.query` {#urlobjectquery}

`query` プロパティは、先頭の ASCII 疑問符 ( `?` ) がないクエリ文字列、または [`querystring`](/ja/nodejs/api/querystring) モジュールの `parse()` メソッドから返されるオブジェクトのいずれかです。 `query` プロパティが文字列であるかオブジェクトであるかは、`url.parse()` に渡される `parseQueryString` 引数によって決定されます。

例：`'query=string'` または `{'query': 'string'}`。

文字列として返される場合、クエリ文字列のデコードは行われません。 オブジェクトとして返される場合、キーと値の両方がデコードされます。

#### `urlObject.search` {#urlobjectsearch}

`search` プロパティは、先頭の ASCII 疑問符 ( `?` ) を含む、URL の「クエリ文字列」部分全体で構成されます。

例：`'?query=string'`。

クエリ文字列のデコードは行われません。

#### `urlObject.slashes` {#urlobjectslashes}

`slashes` プロパティは、`boolean` であり、`protocol` のコロンの後に 2 つの ASCII スラッシュ ( `/` ) 文字が必要な場合は `true` の値になります。

### `url.format(urlObject)` {#urlformaturlobject}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.0.0 | ホスト名の Punycode 変換によって、URL の再解析が異なる可能性のある変更が導入された場合、`ERR_INVALID_URL` 例外をスローするようになりました。 |
| v15.13.0, v14.17.0 | 廃止が取り消されました。 ステータスが「レガシー」に変更されました。 |
| v11.0.0 | レガシー URL API は非推奨になりました。 WHATWG URL API を使用してください。 |
| v7.0.0 | `file:` スキームの URL は、`slashes` オプションに関係なく、常に正しい数のスラッシュを使用するようになりました。 プロトコルのない falsy `slashes` オプションも常に尊重されるようになりました。 |
| v0.1.25 | 追加: v0.1.25 |
:::

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに WHATWG URL API を使用してください。
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL オブジェクト ( `url.parse()` によって返されるか、それ以外で構築されます)。 文字列の場合、`url.parse()` に渡すことによってオブジェクトに変換されます。

`url.format()` メソッドは、`urlObject` から派生したフォーマットされた URL 文字列を返します。

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
`urlObject` がオブジェクトまたは文字列でない場合、`url.format()` は [`TypeError`](/ja/nodejs/api/errors#class-typeerror) をスローします。

フォーマット処理は次のように行われます。

- 新しい空の文字列 `result` が作成されます。
- `urlObject.protocol` が文字列の場合、そのまま `result` に追加されます。
- それ以外の場合、`urlObject.protocol` が `undefined` でなく、文字列でない場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。
- ASCII コロン ( `:` ) 文字で*終わらない* `urlObject.protocol` のすべての文字列値について、リテラル文字列 `:` が `result` に追加されます。
- 次のいずれかの条件が true の場合、リテラル文字列 `//` が `result` に追加されます。
    - `urlObject.slashes` プロパティが true の場合。
    - `urlObject.protocol` が `http`、`https`、`ftp`、`gopher`、または `file` で始まる場合。
  
 
- `urlObject.auth` プロパティの値が truthy で、`urlObject.host` または `urlObject.hostname` のいずれかが `undefined` でない場合、`urlObject.auth` の値は文字列に強制変換され、リテラル文字列 `@` に続けて `result` に追加されます。
- `urlObject.host` プロパティが `undefined` の場合: 
    - `urlObject.hostname` が文字列の場合、`result` に追加されます。
    - それ以外の場合、`urlObject.hostname` が `undefined` でなく、文字列でない場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。
    - `urlObject.port` プロパティ値が truthy で、`urlObject.hostname` が `undefined` でない場合: 
    - リテラル文字列 `:` が `result` に追加され、
    - `urlObject.port` の値が文字列に強制変換され、`result` に追加されます。
  
 
  
 
- それ以外の場合、`urlObject.host` プロパティ値が truthy の場合、`urlObject.host` の値は文字列に強制変換され、`result` に追加されます。
- `urlObject.pathname` プロパティが空の文字列ではない文字列の場合: 
    - `urlObject.pathname` が ASCII スラッシュ ( `/` ) で*始まらない*場合、リテラル文字列 `'/'` が `result` に追加されます。
    - `urlObject.pathname` の値が `result` に追加されます。
  
 
- それ以外の場合、`urlObject.pathname` が `undefined` でなく、文字列でない場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。
- `urlObject.search` プロパティが `undefined` で、`urlObject.query` プロパティが `Object` の場合、リテラル文字列 `?` が `result` に追加され、その後に `urlObject.query` の値を渡して [`querystring`](/ja/nodejs/api/querystring) モジュールの `stringify()` メソッドを呼び出した出力が続きます。
- それ以外の場合、`urlObject.search` が文字列の場合: 
    - `urlObject.search` の値が ASCII 疑問符 ( `?` ) 文字で*始まらない*場合、リテラル文字列 `?` が `result` に追加されます。
    - `urlObject.search` の値が `result` に追加されます。
  
 
- それ以外の場合、`urlObject.search` が `undefined` でなく、文字列でない場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。
- `urlObject.hash` プロパティが文字列の場合: 
    - `urlObject.hash` の値が ASCII ハッシュ ( `#` ) 文字で*始まらない*場合、リテラル文字列 `#` が `result` に追加されます。
    - `urlObject.hash` の値が `result` に追加されます。
  
 
- それ以外の場合、`urlObject.hash` プロパティが `undefined` でなく、文字列でない場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。
- `result` が返されます。


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0, v18.13.0 | ドキュメントのみの非推奨化。 |
| v15.13.0, v14.17.0 | 非推奨を撤回。ステータスを "Legacy" に変更。 |
| v11.14.0 | パスがなく、プロトコルスキームが `ws:` または `wss:` の場合、返される URL オブジェクトの `pathname` プロパティは `/` になります。 |
| v11.0.0 | Legacy URL API は非推奨です。WHATWG URL API を使用してください。 |
| v9.0.0 | クエリ文字列がない場合、返される URL オブジェクトの `search` プロパティは `null` になります。 |
| v0.1.25 | 追加: v0.1.25 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに WHATWG URL API を使用してください。
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析する URL 文字列。
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`query` プロパティは常に [`querystring`](/ja/nodejs/api/querystring) モジュールの `parse()` メソッドによって返されるオブジェクトに設定されます。 `false` の場合、返される URL オブジェクトの `query` プロパティは、解析されていない、デコードされていない文字列になります。 **デフォルト:** `false`。
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、リテラル文字列 `//` の後、次の `/` より前の最初のトークンは `host` として解釈されます。 たとえば、`//foo/bar` が与えられた場合、結果は `{host: 'foo', pathname: '/bar'}` になり、`{pathname: '//foo/bar'}` にはなりません。 **デフォルト:** `false`。

`url.parse()` メソッドは、URL 文字列を受け取り、それを解析して、URL オブジェクトを返します。

`urlString` が文字列でない場合、`TypeError` がスローされます。

`auth` プロパティが存在するがデコードできない場合、`URIError` がスローされます。

`url.parse()` は、URL 文字列の解析に寛容で非標準のアルゴリズムを使用します。 これは、[ホスト名スプーフィング](https://hackerone.com/reports/678487) やユーザー名とパスワードの誤った処理などのセキュリティの問題が発生しやすいです。 信頼できない入力で使用しないでください。 CVE は `url.parse()` の脆弱性に対して発行されません。 代わりに、[WHATWG URL](/ja/nodejs/api/url#the-whatwg-url-api) API を使用してください。


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.13.0, v14.17.0 | 非推奨が取り消されました。ステータスが "レガシー" に変更されました。 |
| v11.0.0 | レガシー URL API は非推奨になりました。WHATWG URL API を使用してください。 |
| v6.6.0 | `from` と `to` が同じホストを参照する場合、`auth` フィールドがそのまま保持されるようになりました。 |
| v6.0.0 | `to` パラメータにホスト名が含まれている場合、`auth` フィールドがクリアされるようになりました。 |
| v6.5.0, v4.6.2 | `port` フィールドが正しくコピーされるようになりました。 |
| v0.1.25 | 追加: v0.1.25 |
:::

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定版: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに WHATWG URL API を使用してください。
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `to` が相対 URL の場合に使用するベース URL。
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決するターゲット URL。

`url.resolve()` メソッドは、Web ブラウザーがアンカータグを解決するのと同様の方法で、ターゲット URL をベース URL を基準に解決します。

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
WHATWG URL API を使用して同じ結果を得るには:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` は相対 URL です。
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## URL のパーセントエンコーディング {#percent-encoding-in-urls}

URL には、特定の範囲の文字のみを含めることが許可されています。その範囲外の文字はエンコードする必要があります。そのような文字のエンコード方法と、どの文字をエンコードするかは、文字が URL の構造内のどこにあるかによって完全に異なります。


### レガシーAPI {#legacy-api}

レガシーAPI内では、スペース (`' '`) および次の文字は、URLオブジェクトのプロパティ内で自動的にエスケープされます。

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
例えば、ASCIIのスペース文字 (`' '`) は `%20` としてエンコードされます。ASCIIのスラッシュ (`/`) 文字は `%3C` としてエンコードされます。

### WHATWG API {#whatwg-api}

[WHATWG URL Standard](https://url.spec.whatwg.org/) は、レガシーAPIで使用されるよりも、より選択的で細かくエンコードされた文字を選択する方法を使用しています。

WHATWGアルゴリズムは、パーセントエンコードする必要がある文字の範囲を記述する4つの「パーセントエンコードセット」を定義します。

- *C0 control percent-encode set* には、U+0000からU+001F（両端を含む）の範囲のコードポイント、およびU+007E（〜）より大きいすべてのコードポイントが含まれます。
- *fragment percent-encode set* には、*C0 control percent-encode set* と、コードポイントU+0020 SPACE, U+0022 ("), U+003C (\<), U+003E (\>), および U+0060 (`) が含まれます。
- *path percent-encode set* には、*C0 control percent-encode set* と、コードポイントU+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({), および U+007D (}) が含まれます。
- *userinfo encode set* には、*path percent-encode set* と、コードポイントU+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) から U+005E(^) および U+007C (|) が含まれます。

*userinfo percent-encode set* は、URL内でエンコードされたユーザー名とパスワードにのみ使用されます。*path percent-encode set* は、ほとんどのURLのパスに使用されます。*fragment percent-encode set* は、URLフラグメントに使用されます。*C0 control percent-encode set* は、特定の条件下では、ホストおよびパスに使用され、その他すべての場合にも使用されます。

非ASCII文字がホスト名内に現れる場合、ホスト名は[Punycode](https://tools.ietf.org/html/rfc5891#section-4.4)アルゴリズムを使用してエンコードされます。ただし、ホスト名は、Punycodeエンコードされた文字とパーセントエンコードされた文字の*両方*を含む*可能性*があることに注意してください。

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

