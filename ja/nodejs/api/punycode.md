---
title: Node.js ドキュメント - Punycode
description: このページでは、Node.jsのPunycodeモジュールについて詳細に説明しており、国際化ドメイン名のエンコードとデコードに使用されます。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsのPunycodeモジュールについて詳細に説明しており、国際化ドメイン名のエンコードとデコードに使用されます。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsのPunycodeモジュールについて詳細に説明しており、国際化ドメイン名のエンコードとデコードに使用されます。
---


# Punycode {#punycode}

**Deprecated since: v7.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

**ソースコード:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**Node.jsにバンドルされているpunycodeモジュールのバージョンは非推奨となっています。** 将来のNode.jsのメジャーバージョンで、このモジュールは削除されます。 現在`punycode`モジュールに依存しているユーザーは、ユーザーランドで提供される[Punycode.js](https://github.com/bestiejs/punycode.js)モジュールを使用するように切り替える必要があります。 punycodeベースのURLエンコーディングについては、[`url.domainToASCII`](/ja/nodejs/api/url#urldomaintoasciidomain)または、より一般的には、[WHATWG URL API](/ja/nodejs/api/url#the-whatwg-url-api)を参照してください。

`punycode`モジュールは、[Punycode.js](https://github.com/bestiejs/punycode.js)モジュールのバンドルされたバージョンです。 これは以下を使用してアクセスできます。

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492)は、RFC 3492で定義された文字エンコーディングスキームであり、主に国際化ドメイン名での使用を目的としています。 URLのホスト名はASCII文字のみに制限されているため、非ASCII文字を含むドメイン名はPunycodeスキームを使用してASCIIに変換する必要があります。 たとえば、英語の単語 `'example'` に翻訳される日本語の文字は `'例'` です。 国際化ドメイン名 `'例.com'` （ `'example.com'` と同等）は、PunycodeによってASCII文字列 `'xn--fsq.com'` として表されます。

`punycode`モジュールは、Punycode標準の簡単な実装を提供します。

`punycode` モジュールは Node.js で使用されているサードパーティの依存関係であり、開発者の便宜のために利用できるようにされています。 モジュールの修正またはその他の変更は、[Punycode.js](https://github.com/bestiejs/punycode.js) プロジェクトに指示する必要があります。

## `punycode.decode(string)` {#punycodedecodestring}

**追加: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.decode()` メソッドは、ASCII 文字のみの [Punycode](https://tools.ietf.org/html/rfc3492) 文字列を、同等の Unicode コードポイントの文字列に変換します。

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Added in: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.encode()` メソッドは、Unicode コードポイントの文字列を ASCII のみの文字の [Punycode](https://tools.ietf.org/html/rfc3492) 文字列に変換します。

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Added in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toASCII()` メソッドは、国際化ドメイン名を表す Unicode 文字列を [Punycode](https://tools.ietf.org/html/rfc3492) に変換します。 ドメイン名の非 ASCII 部分のみが変換されます。 すでに ASCII 文字のみを含む文字列に対して `punycode.toASCII()` を呼び出しても、効果はありません。

```js [ESM]
// ドメイン名をエンコードする
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Added in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toUnicode()` メソッドは、[Punycode](https://tools.ietf.org/html/rfc3492) でエンコードされた文字を含むドメイン名を表す文字列を Unicode に変換します。 ドメイン名の [Punycode](https://tools.ietf.org/html/rfc3492) でエンコードされた部分のみが変換されます。

```js [ESM]
// ドメイン名をデコードする
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Added in: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Added in: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.ucs2.decode()` メソッドは、文字列内の各 Unicode シンボルの数値コードポイント値を含む配列を返します。

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// U+1D306 の中央のテトラグラムのサロゲートペア:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**追加:** v0.7.0

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)

`punycode.ucs2.encode()` メソッドは、数値コードポイント値の配列に基づいて文字列を返します。

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**追加:** v0.6.1

- [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type)

現在の [Punycode.js](https://github.com/bestiejs/punycode.js) のバージョン番号を識別する文字列を返します。

