---
title: Node.js 文档 - 查询字符串
description: Node.js 文档的这一部分详细介绍了 querystring 模块，该模块提供了解析和格式化 URL 查询字符串的工具。包括转义和解码特殊字符、处理嵌套对象以及管理查询字符串序列化的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 查询字符串 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 文档的这一部分详细介绍了 querystring 模块，该模块提供了解析和格式化 URL 查询字符串的工具。包括转义和解码特殊字符、处理嵌套对象以及管理查询字符串序列化的方法。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 查询字符串 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 文档的这一部分详细介绍了 querystring 模块，该模块提供了解析和格式化 URL 查询字符串的工具。包括转义和解码特殊字符、处理嵌套对象以及管理查询字符串序列化的方法。
---


# 查询字符串 {#query-string}

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

`node:querystring` 模块提供了用于解析和格式化 URL 查询字符串的实用工具。 可以使用以下方式访问它：

```js [ESM]
const querystring = require('node:querystring');
```

与 [\<URLSearchParams\>](/zh/nodejs/api/url#class-urlsearchparams) 相比，`querystring` 的性能更高，但不是标准化的 API。 当性能不重要或需要与浏览器代码兼容时，请使用 [\<URLSearchParams\>](/zh/nodejs/api/url#class-urlsearchparams)。

## `querystring.decode()` {#querystringdecode}

**新增于: v0.1.99**

`querystring.decode()` 函数是 `querystring.parse()` 的别名。

## `querystring.encode()` {#querystringencode}

**新增于: v0.1.99**

`querystring.encode()` 函数是 `querystring.stringify()` 的别名。

## `querystring.escape(str)` {#querystringescapestr}

**新增于: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.escape()` 方法以针对 URL 查询字符串的特定要求进行了优化的方式，对给定的 `str` 执行 URL 百分比编码。

`querystring.escape()` 方法由 `querystring.stringify()` 使用，通常不希望直接使用。 导出它主要是为了允许应用程序代码在必要时通过将 `querystring.escape` 分配给备用函数来提供替换的百分比编码实现。

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 现在可以正确解析多个空条目（例如 `&=&=`）。 |
| v6.0.0 | 返回的对象不再继承自 `Object.prototype`。 |
| v6.0.0, v4.2.4 | `eq` 参数的长度现在可能大于 `1`。 |
| v0.1.25 | 新增于: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的 URL 查询字符串
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于分隔查询字符串中的键值对的子字符串。 **默认值:** `'&'`。
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). 用于分隔查询字符串中的键和值的子字符串。 **默认值:** `'='`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在解码查询字符串中经过百分比编码的字符时要使用的函数。 **默认值:** `querystring.unescape()`。
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定要解析的最大键数。 指定 `0` 以删除键计数限制。 **默认值:** `1000`。
  
 

`querystring.parse()` 方法将 URL 查询字符串 (`str`) 解析为键值对的集合。

例如，查询字符串 `'foo=bar&abc=xyz&abc=123'` 被解析为：

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
`querystring.parse()` 方法返回的对象 *不* 从 JavaScript `Object` 原型继承。 这意味着典型的 `Object` 方法（例如 `obj.toString()`、`obj.hasOwnProperty()` 等）未定义且*将不起作用*。

默认情况下，查询字符串中的百分比编码字符将被假定为使用 UTF-8 编码。 如果使用其他字符编码，则需要指定其他 `decodeURIComponent` 选项：

```js [ESM]
// 假设 gbkDecodeURIComponent 函数已经存在...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Added in: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要序列化为 URL 查询字符串的对象
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于分隔查询字符串中键值对的子字符串。 **默认值:** `'&'`。
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). 用于分隔查询字符串中键和值的子字符串。 **默认值:** `'='`。
- `options` 
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在查询字符串中将 URL 不安全字符转换为百分比编码时使用的函数。 **默认值:** `querystring.escape()`。
  
 

`querystring.stringify()` 方法通过迭代对象的“自有属性”来从给定的 `obj` 生成 URL 查询字符串。

它序列化在 `obj` 中传递的以下类型的值：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 数字值必须是有限的。 任何其他输入值都将被强制转换为空字符串。

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// 返回 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// 返回 'foo:bar;baz:qux'
```
默认情况下，查询字符串中需要百分比编码的字符将编码为 UTF-8。 如果需要替代编码，则需要指定替代的 `encodeURIComponent` 选项：

```js [ESM]
// 假设 gbkEncodeURIComponent 函数已经存在，

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**添加于: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.unescape()` 方法对给定的 `str` 执行 URL 百分号编码字符的解码。

`querystring.unescape()` 方法被 `querystring.parse()` 使用，通常不应直接使用。导出它的主要目的是允许应用程序代码在必要时通过将 `querystring.unescape` 赋值给一个替代函数来提供一个替代的解码实现。

默认情况下，`querystring.unescape()` 方法将尝试使用 JavaScript 内置的 `decodeURIComponent()` 方法进行解码。 如果失败，则会使用一个更安全的等效方法，该方法不会在格式错误的 URL 上抛出异常。

