---
title: Node.js ドキュメント - クエリ文字列
description: Node.jsのこのドキュメントのセクションでは、URLクエリ文字列の解析とフォーマットのためのユーティリティを提供するquerystringモジュールについて詳しく説明しています。特殊文字のエスケープとアンエスケープ、ネストされたオブジェクトの処理、クエリ文字列のシリアライズ管理の方法が含まれています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - クエリ文字列 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのこのドキュメントのセクションでは、URLクエリ文字列の解析とフォーマットのためのユーティリティを提供するquerystringモジュールについて詳しく説明しています。特殊文字のエスケープとアンエスケープ、ネストされたオブジェクトの処理、クエリ文字列のシリアライズ管理の方法が含まれています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - クエリ文字列 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのこのドキュメントのセクションでは、URLクエリ文字列の解析とフォーマットのためのユーティリティを提供するquerystringモジュールについて詳しく説明しています。特殊文字のエスケープとアンエスケープ、ネストされたオブジェクトの処理、クエリ文字列のシリアライズ管理の方法が含まれています。
---


# クエリ文字列 {#query-string}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

`node:querystring` モジュールは、URL クエリ文字列をパースおよびフォーマットするためのユーティリティを提供します。これは次のようにしてアクセスできます。

```js [ESM]
const querystring = require('node:querystring');
```

`querystring` は [\<URLSearchParams\>](/ja/nodejs/api/url#class-urlsearchparams) よりも高性能ですが、標準化された API ではありません。パフォーマンスが重要でない場合、またはブラウザコードとの互換性が必要な場合は、[\<URLSearchParams\>](/ja/nodejs/api/url#class-urlsearchparams) を使用してください。

## `querystring.decode()` {#querystringdecode}

**追加: v0.1.99**

`querystring.decode()` 関数は `querystring.parse()` のエイリアスです。

## `querystring.encode()` {#querystringencode}

**追加: v0.1.99**

`querystring.encode()` 関数は `querystring.stringify()` のエイリアスです。

## `querystring.escape(str)` {#querystringescapestr}

**追加: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.escape()` メソッドは、URL クエリ文字列の特定の要件に合わせて最適化された方法で、与えられた `str` に対して URL パーセントエンコーディングを実行します。

`querystring.escape()` メソッドは `querystring.stringify()` によって使用され、通常は直接使用されることは想定されていません。これは主に、アプリケーションコードが必要に応じて `querystring.escape` を代替関数に割り当てることによって、代替のパーセントエンコーディング実装を提供できるようにするためにエクスポートされます。

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | 複数の空のエントリが正しく解析されるようになりました (例: `&=&=`)。 |
| v6.0.0 | 返されるオブジェクトは `Object.prototype` から継承しなくなりました。 |
| v6.0.0, v4.2.4 | `eq` パラメータの長さが `1` より長くなりました。 |
| v0.1.25 | 追加: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パースする URL クエリ文字列
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クエリ文字列内のキーと値のペアを区切るために使用されるサブ文字列。**デフォルト:** `'&'`。
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). クエリ文字列内のキーと値を区切るために使用されるサブ文字列。**デフォルト:** `'='`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) クエリ文字列内のパーセントエンコードされた文字をデコードするときに使用する関数。**デフォルト:** `querystring.unescape()`。
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) パースするキーの最大数を指定します。キーのカウント制限を削除するには `0` を指定します。**デフォルト:** `1000`。

`querystring.parse()` メソッドは、URL クエリ文字列 (`str`) をキーと値のペアのコレクションにパースします。

たとえば、クエリ文字列 `'foo=bar&abc=xyz&abc=123'` は次のようにパースされます。

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```

`querystring.parse()` メソッドによって返されるオブジェクトは、JavaScript の `Object` から原型的に継承 *しません*。これは、`obj.toString()`、`obj.hasOwnProperty()` などの一般的な `Object` メソッドが定義されておらず、*機能しない* ことを意味します。

デフォルトでは、クエリ文字列内のパーセントエンコードされた文字は、UTF-8 エンコーディングを使用すると想定されます。別の文字エンコーディングが使用されている場合は、別の `decodeURIComponent` オプションを指定する必要があります。

```js [ESM]
// gbkDecodeURIComponent 関数が既に存在すると仮定...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Added in: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) URLクエリ文字列にシリアライズするオブジェクト
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) クエリ文字列のキーと値のペアを区切るために使用される部分文字列。 **Default:** `'&'`。
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). クエリ文字列のキーと値を区切るために使用される部分文字列。 **Default:** `'='`。
- `options` 
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) URLセーフでない文字をクエリ文字列でパーセントエンコーディングに変換するときに使用する関数。 **Default:** `querystring.escape()`。
  
 

`querystring.stringify()` メソッドは、オブジェクトの "自身のプロパティ" を反復処理して、指定された `obj` から URL クエリ文字列を生成します。

`obj` に渡された次の型の値をシリアライズします。[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 数値は有限でなければなりません。他の入力値はすべて空の文字列に強制変換されます。

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Returns 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Returns 'foo:bar;baz:qux'
```
デフォルトでは、クエリ文字列内でパーセントエンコーディングを必要とする文字は、UTF-8としてエンコードされます。別のエンコーディングが必要な場合は、別の `encodeURIComponent` オプションを指定する必要があります。

```js [ESM]
// gbkEncodeURIComponent 関数がすでに存在すると仮定します。

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Added in: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.unescape()` メソッドは、与えられた `str` に対して、URL でパーセントエンコードされた文字のデコードを行います。

`querystring.unescape()` メソッドは、`querystring.parse()` によって使用され、通常は直接使用されることは想定されていません。これは主に、アプリケーションコードが `querystring.unescape` を代替関数に割り当てることで、必要に応じて代替のデコード実装を提供できるようにするためにエクスポートされています。

デフォルトでは、`querystring.unescape()` メソッドは、JavaScript の組み込み `decodeURIComponent()` メソッドを使用してデコードを試みます。それが失敗した場合、不正な URL でエラーをスローしない、より安全な同等のものが使用されます。

