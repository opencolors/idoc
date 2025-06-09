---
title: Node.js 文档 - Punycode
description: 本页面详细介绍了 Node.js 中用于编码和解码国际化域名的 Punycode 模块。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面详细介绍了 Node.js 中用于编码和解码国际化域名的 Punycode 模块。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面详细介绍了 Node.js 中用于编码和解码国际化域名的 Punycode 模块。
---


# Punycode {#punycode}

**自版本起已弃用：v7.0.0**

::: danger [稳定度：0 - 已弃用]
[稳定度：0](/zh/nodejs/api/documentation#stability-index) [稳定性：0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

**源代码：** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**Node.js 中捆绑的 punycode 模块已被弃用。** 在未来 Node.js 的主要版本中，此模块将被移除。 当前依赖 `punycode` 模块的用户应切换为使用用户提供的 [Punycode.js](https://github.com/bestiejs/punycode.js) 模块。 对于基于 punycode 的 URL 编码，请参阅 [`url.domainToASCII`](/zh/nodejs/api/url#urldomaintoasciidomain) 或更广泛的 [WHATWG URL API](/zh/nodejs/api/url#the-whatwg-url-api)。

`punycode` 模块是 [Punycode.js](https://github.com/bestiejs/punycode.js) 模块的捆绑版本。 可以使用以下方式访问它：

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) 是 RFC 3492 定义的一种字符编码方案，主要用于国际化域名。 由于 URL 中的主机名仅限于 ASCII 字符，因此包含非 ASCII 字符的域名必须使用 Punycode 方案转换为 ASCII。 例如，翻译成英文单词 `'example'` 的日文字符是 `'例'`。 国际化域名 `'例.com'`（相当于 `'example.com'`）在 Punycode 中表示为 ASCII 字符串 `'xn--fsq.com'`。

`punycode` 模块提供了 Punycode 标准的简单实现。

`punycode` 模块是 Node.js 使用的第三方依赖项，为了方便开发者而提供。 对该模块的修复或其他修改必须 направляться в [Punycode.js](https://github.com/bestiejs/punycode.js) 项目。

## `punycode.decode(string)` {#punycodedecodestring}

**新增于：v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.decode()` 方法将仅包含 ASCII 字符的 [Punycode](https://tools.ietf.org/html/rfc3492) 字符串转换为等效的 Unicode 码位字符串。

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**加入于: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.encode()` 方法将 Unicode 码位字符串转换为仅包含 ASCII 字符的 [Punycode](https://tools.ietf.org/html/rfc3492) 字符串。

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**加入于: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toASCII()` 方法将表示国际化域名（Internationalized Domain Name）的 Unicode 字符串转换为 [Punycode](https://tools.ietf.org/html/rfc3492)。 只有域名中的非 ASCII 部分会被转换。 在已经只包含 ASCII 字符的字符串上调用 `punycode.toASCII()` 不会有任何效果。

```js [ESM]
// 编码域名
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**加入于: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toUnicode()` 方法将包含 [Punycode](https://tools.ietf.org/html/rfc3492) 编码字符的域名字符串转换为 Unicode。 只有域名中 [Punycode](https://tools.ietf.org/html/rfc3492) 编码的部分会被转换。

```js [ESM]
// 解码域名
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**加入于: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**加入于: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.ucs2.decode()` 方法返回一个数组，其中包含字符串中每个 Unicode 符号的数值码位值。

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// U+1D306 表示中心的四卦象的代理对：
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**新增于: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`punycode.ucs2.encode()` 方法基于数字代码点值的数组返回一个字符串。

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**新增于: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个字符串，标识当前的 [Punycode.js](https://github.com/bestiejs/punycode.js) 版本号。

